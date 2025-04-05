<?php

namespace App\Http\Controllers;

use App\Enums\OrderTypeEnum;
use App\Enums\PaymentMethodEnum;
use App\Enums\PaymentStatusEnum;
use App\Http\Requests\TransactionRequest;
use App\Models\Cashier;
use App\Models\Customer;
use App\Models\Fee;
use App\Models\Transaction;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function update(TransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        return DB::transaction(function () use ($request, $transaction) {
            // Ambil biaya berdasarkan jenisnya
            $fees = Fee::whereIn(DB::raw('LOWER(type)'), ['delivery', 'service', 'discount', 'tax'])
                ->get()
                ->keyBy('type');

            // Hitung subtotal
            $subtotal = $transaction->transactionItems->sum(fn($item) => $item->subtotal);

            // Tentukan jenis pesanan dan metode pembayaran
            $orderType = OrderTypeEnum::tryFrom($request->order_type) ?? OrderTypeEnum::DineIn;
            $paymentType = PaymentMethodEnum::tryFrom($request->payment_method) ?? PaymentMethodEnum::Cash;

            // Hitung biaya tambahan
            $deliveryFee = $orderType === OrderTypeEnum::Delivery ? $fees['delivery']->amount ?? 0 : 0;
            $serviceFee = $fees['service']->amount ?? 0;
            $discount = $fees['discount']->amount ?? 0;
            $tax = $fees['tax']->amount ?? 0;

            // Hitung total akhir
            $finalTotal = $subtotal + $deliveryFee + $serviceFee - $discount + $tax;

            // Validasi jika pembayaran tunai tidak mencukupi
            if ($paymentType === PaymentMethodEnum::Cash && $request->cash_received < $finalTotal) {
                return redirect()
                    ->back()
                    ->withErrors(['cash_received' => 'Uang Anda kurang.']);
            }

            // Perbarui transaksi
            $transaction->update([
                'order_type' => $request->order_type,
                'payment_method' => $request->payment_method,
                'payment_status' => $paymentType === PaymentMethodEnum::Cash ? PaymentStatusEnum::Paid : PaymentStatusEnum::Pending,
                'cash_received' => $request->cash_received,
                'change' => $request->cash_received - $finalTotal,
                'table_number' => $request->table_number,
                'shipping_address' => $request->shipping_address,
                'recipient' => $request->recipient,
                'recipient_phone_number' => $request->recipient_phone_number,
                'note' => $request->note,
                'chef_id' => null,
                'courier_id' => null,
                'final_total' => $finalTotal,
                'delivery_fee' => $deliveryFee,
                'service_charge' => $serviceFee,
                'discount' => $discount,
                'tax' => $tax,
            ]);

            return redirect()->route('cashier.cart.index')->with('success', 'Transaksi berhasil.');
        });
    }

    public function payWithMidtrans(TransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        $transaction->load('transactionItems.menuItem');

        // Ambil biaya berdasarkan jenisnya
        $fees = Fee::whereIn(DB::raw('LOWER(type)'), ['delivery', 'service', 'discount', 'tax'])
            ->get()
            ->keyBy('type');

        // Hitung subtotal
        $subtotal = $transaction->transactionItems->sum(fn($item) => $item->subtotal);

        // Tentukan jenis pesanan dan metode pembayaran
        $orderType = OrderTypeEnum::tryFrom($request->order_type) ?? OrderTypeEnum::DineIn;

        // Hitung biaya tambahan
        $deliveryFee = $orderType === OrderTypeEnum::Delivery ? $fees['delivery']->amount ?? 0 : 0;
        $serviceFee = $fees['service']->amount ?? 0;
        $discount = $fees['discount']->amount ?? 0;
        $tax = $fees['tax']->amount ?? 0;

        // Hitung total akhir
        $finalTotal = $subtotal + $deliveryFee + $serviceFee - $discount + $tax;

        $itemDetails = $transaction->transactionItems
            ->map(function ($item) {
                return [
                    'id' => (int) $item->menuItem?->id ?? 0,
                    'name' => $item->menuItem?->name ?? 'Item',
                    'price' => (int) $item->unit_price,
                    'quantity' => (int) $item->quantity,
                ];
            })
            ->values()
            ->toArray();

        if ($deliveryFee > 0) {
            $itemDetails[] = [
                'id' => 'delivery_fee',
                'name' => 'Biaya Pengiriman',
                'price' => $deliveryFee,
                'quantity' => 1,
            ];
        }

        if ($serviceFee > 0) {
            $itemDetails[] = [
                'id' => 'service_charge',
                'name' => 'Biaya Layanan',
                'price' => $serviceFee,
                'quantity' => 1,
            ];
        }

        if ($discount > 0) {
            $itemDetails[] = [
                'id' => 'discount',
                'name' => 'Diskon',
                'price' => -$discount,
                'quantity' => 1,
            ];
        }

        if ($tax > 0) {
            $itemDetails[] = [
                'id' => 'tax',
                'name' => 'Pajak',
                'price' => $tax,
                'quantity' => 1,
            ];
        }

        // Buat transaksi midtrans
        $midtransParams = [
            'transaction_details' => [
                'order_id' => $transaction->order_number,
                'gross_amount' => $finalTotal,
            ],
            'customer_details' => [
                'first_name' => $request->recipient,
                'phone' => $request->recipient_phone_number,
                'shipping_address' => [
                    'first_name' => $request->recipient,
                    'phone' => $request->recipient_phone_number,
                    'address' => $request->shipping_address,
                ],
            ],
            'item_details' => $itemDetails,
            'callbacks' => [
                'finish' => route('midtrans.callback'),
                'error' => route('midtrans.callback'),
            ],
        ];

        // Panggil Midtrans API
        \Midtrans\Config::$serverKey = config('services.midtrans.server_key');
        \Midtrans\Config::$isProduction = config('services.midtrans.is_production');
        \Midtrans\Config::$isSanitized = config('services.midtrans.is_sanitized');
        \Midtrans\Config::$is3ds = config('services.midtrans.is_3ds');

        $snapToken = \Midtrans\Snap::getSnapToken($midtransParams);

        return redirect()
            ->back()
            ->with([
                'snap_token' => $snapToken,
            ]);
    }


    public function midtransCallback(Request $request): RedirectResponse
    {
        $orderId = $request->order_id;
        $status = $request->transaction_status;

        $transaction = Transaction::where('order_number', $orderId)->first();

        if (!$transaction) {
            return redirect()->back()->withErrors('Transaksi tidak ditemukan.');
        }

        if ($transaction->cashier_id) {
            return $status === 'settlement' ? redirect()->route('cashier.transaction.success') : redirect()->route('cashier.transaction.failed');
        }

        if ($transaction->customer_id) {
            return $status === 'settlement' ? redirect()->route('transaction.success') : redirect()->route('transaction.failed');
        }

        return redirect()->back()->withErrors('Tidak dapat menentukan role pengguna.');
    }

    // Untuk Customer
    public function transactionCustomerSuccess(): Response
    {
        return Inertia::render('transaction/success', [
            'message' => 'Pembayaran berhasil! Terima kasih telah memesan.'
        ]);
    }

    public function transactionCustomerFailed(): Response
    {
        return Inertia::render('transaction/failed', [
            'message' => 'Pembayaran gagal. Silakan coba lagi atau hubungi kasir.'
        ]);
    }

    // Untuk Cashier
    public function transactionCashierSuccess(): Response
    {
        return Inertia::render('cashier/pages/transaction/success', [
            'message' => 'Pembayaran berhasil diproses.'
        ]);
    }

    public function transactionCashierFailed(): Response
    {
        return Inertia::render('cashier/pages/transaction/failed', [
            'message' => 'Pembayaran gagal. Silakan ulangi transaksi.'
        ]);
    }
}
