<?php

namespace App\Http\Controllers;

use App\Enums\OrderTypeEnum;
use App\Enums\PaymentMethodEnum;
use App\Enums\PaymentStatusEnum;
use App\Http\Requests\TransactionRequest;
use Midtrans\Notification;
use App\Models\Fee;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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

        $transaction->note = $request->input('note');

        $orderType = OrderTypeEnum::tryFrom($request->order_type) ?? OrderTypeEnum::DineIn;
        $transaction->order_type = $orderType;

        if ($orderType === OrderTypeEnum::DineIn && $request->has('table_number')) {
            $transaction->order_type = OrderTypeEnum::DineIn;
            $transaction->table_number = $request->input('table_number');
        } elseif ($orderType === OrderTypeEnum::Delivery) {
            $transaction->shipping_address = $request->input('shipping_address');
            $transaction->recipient = $request->input('recipient');
            $transaction->recipient_phone_number = $request->input('recipient_phone_number');
        }

        $transaction->save();

        // Ambil biaya berdasarkan jenisnya
        $fees = Fee::whereIn(DB::raw('LOWER(type)'), ['delivery', 'service', 'discount', 'tax'])
            ->get()
            ->keyBy('type');

        // Hitung biaya tambahan
        $deliveryFee = $orderType === OrderTypeEnum::Delivery ? $fees['delivery']->amount ?? 0 : 0;
        $serviceFee = $fees['service']->amount ?? 0;
        $discount = $fees['discount']->amount ?? 0;
        $tax = $fees['tax']->amount ?? 0;

        // Hitung subtotal
        $subtotal = $transaction->transactionItems->sum(fn($item) => $item->subtotal);

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
        $orderId = $request->input('order_id');
        $transaction = Transaction::where('order_number', $orderId)->first();

        if (!$transaction) {
            return redirect()->back()->withErrors('Transaksi tidak ditemukan.');
        }

        $transactionStatus = $request->input('transaction_status');

        switch ($transactionStatus) {
            case 'settlement':
            case 'capture':
                $transaction->payment_status = PaymentStatusEnum::Paid;
                break;
            case 'pending':
                $transaction->payment_status = PaymentStatusEnum::Pending;
                break;
            case 'expire':
                $transaction->payment_status = PaymentStatusEnum::Expired;
                break;
            case 'cancel':
                $transaction->payment_status = PaymentStatusEnum::Cancelled;
                break;
            case 'deny':
            case 'failure':
                $transaction->payment_status = PaymentStatusEnum::Failed;
                break;
            case 'refund':
                $transaction->payment_status = PaymentStatusEnum::Refunded;
                break;
        }

        $transaction->payment_method = PaymentMethodEnum::OnlinePayment;
        $transaction->save();

        if ($transaction->cashier_id) {
            return $transactionStatus === 'settlement' ? redirect()->route('cashier.transaction.success') : redirect()->route('cashier.transaction.failed');
        }

        if ($transaction->customer_id) {
            return $transactionStatus === 'settlement' ? redirect()->route('transaction.success') : redirect()->route('transaction.failed');
        }

        return redirect()->back()->withErrors('Tidak dapat menentukan role pengguna.');
    }

    // Untuk Customer
    public function transactionCustomerSuccess(): Response
    {
        return Inertia::render('transaction/success', [
            'message' => 'Pembayaran berhasil! Terima kasih telah memesan.',
        ]);
    }

    public function transactionCustomerFailed(): Response
    {
        return Inertia::render('transaction/failed', [
            'message' => 'Pembayaran gagal. Silakan coba lagi atau hubungi kasir.',
        ]);
    }

    // Untuk Cashier
    public function transactionCashierSuccess(): Response
    {
        return Inertia::render('cashier/pages/transaction/success', [
            'message' => 'Pembayaran berhasil diproses.',
        ]);
    }

    public function transactionCashierFailed(): Response
    {
        return Inertia::render('cashier/pages/transaction/failed', [
            'message' => 'Pembayaran gagal. Silakan ulangi transaksi.',
        ]);
    }
}
