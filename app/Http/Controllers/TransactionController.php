<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Enums\OrderTypeEnum;
use App\Enums\PaymentMethodEnum;
use App\Enums\PaymentStatusEnum;
use App\Http\Requests\TransactionRequest;
use App\Models\Cashier;
use App\Models\Customer;
use App\Models\Fee;
use App\Models\OrderStatus;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function payWithCash(TransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        return DB::transaction(function () use ($request, $transaction) {
            $user = Auth::user();
            $cashier = Cashier::where('user_id', $user->id)->first();
            $customer = Customer::where('user_id', $user->id)->first();

            $fees = Fee::whereIn(DB::raw('LOWER(type)'), ['delivery', 'service', 'discount', 'tax'])
                ->get()
                ->keyBy('type');

            $subtotal = $transaction->transactionItems->sum(fn($item) => $item->subtotal);

            $orderType = OrderTypeEnum::tryFrom($request->order_type) ?? OrderTypeEnum::DineIn;
            $paymentMethod = PaymentMethodEnum::tryFrom($request->payment_method) ?? PaymentMethodEnum::Cash;

            $deliveryFee = $orderType === OrderTypeEnum::Delivery ? $fees['delivery']->amount ?? 0 : 0;

            $serviceCharge = $fees['service']->amount ?? 0;
            $discount = $fees['discount']->amount ?? 0;
            $tax = $fees['tax']->amount ?? 0;

            $finalTotal = $subtotal + $deliveryFee + $serviceCharge - $discount + $tax;


            if (
                $paymentMethod === PaymentMethodEnum::Cash &&
                $transaction->cashier_id !== null &&
                $request->cash_received < $finalTotal
            ) {
                return redirect()
                    ->back()
                    ->withErrors(['cash_received' => 'Uang Anda kurang.']);
            }


            $cashReceived = $transaction->cashier_id !== null ? $request->cash_received : 0;
            $change = $cashReceived !== 0 ? ($cashReceived - $finalTotal) : 0;


            $transaction->update([
                'order_type' => $orderType,
                'payment_method' => $paymentMethod,
                'payment_status' => $paymentMethod === PaymentMethodEnum::Cash
                    ? ($transaction->cashier_id !== null ? PaymentStatusEnum::PAID : PaymentStatusEnum::PENDING)
                    : PaymentStatusEnum::PENDING,
                'cash_received' => $cashReceived,
                'change' => $change,
                'table_number' => $request->table_number,
                'shipping_address' => $request->shipping_address,
                'recipient' => $request->recipient,
                'recipient_phone_number' => $request->recipient_phone_number,
                'note' => $request->note,
                'chef_id' => null,
                'courier_id' => null,
                'final_total' => $finalTotal,
                'delivery_fee' => $deliveryFee,
                'service_charge' => $serviceCharge,
                'discount' => $discount,
                'tax' => $tax,
            ]);


            if ($transaction->cashier_id !== null && $paymentMethod === PaymentMethodEnum::Cash) {
                OrderStatus::create([
                    'transaction_id' => $transaction->id,
                    'status' => OrderStatusEnum::PROCESSING,
                ]);
            }

            if ($cashier) {
                return redirect()->route('cashier.cart.index')->with('success', 'Transaksi berhasil.');
            } elseif ($customer) {
                return redirect()->route('cart.index')->with('success', 'Transaksi berhasil.');
            }
        });
    }

    public function payWithMidtrans(TransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        $transaction->load('transactionItems.menuItem');
        $transaction->note = $request->input('note');

        // Tentukan jenis pesanan
        $orderType = OrderTypeEnum::tryFrom($request->order_type) ?? OrderTypeEnum::DineIn;
        $transaction->order_type = $orderType;

        // Isi informasi tambahan berdasarkan jenis pesanan
        if ($orderType === OrderTypeEnum::DineIn && $request->has('table_number')) {
            $transaction->table_number = $request->input('table_number');
        } elseif ($orderType === OrderTypeEnum::Takeway && $request->has('recipient')) {
            $transaction->recipient = $request->input('recipient');
        } elseif ($orderType === OrderTypeEnum::Delivery && $request->has('shipping_address') && $request->has('recipient') && $request->has('recipient_phone_number')) {
            $transaction->shipping_address = $request->input('shipping_address');
            $transaction->recipient = $request->input('recipient');
            $transaction->recipient_phone_number = $request->input('recipient_phone_number');
        } elseif ($orderType === OrderTypeEnum::Pickup && $request->has('recipient') && $request->has('recipient_phone_number')) {
            $transaction->recipient = $request->input('recipient');
            $transaction->recipient_phone_number = $request->input('recipient_phone_number');
        }

        // Ambil biaya lainnya
        $fees = Fee::whereIn(DB::raw('LOWER(type)'), ['delivery', 'service', 'discount', 'tax'])
            ->get()
            ->keyBy('type');

        $deliveryFee = $orderType === OrderTypeEnum::Delivery ? $fees['delivery']->amount ?? 0 : 0;
        $serviceFee = $fees['service']->amount ?? 0;
        $discount = $fees['discount']->amount ?? 0;
        $tax = $fees['tax']->amount ?? 0;

        // Hitung subtotal & total
        $subtotal = $transaction->transactionItems->sum(fn($item) => $item->subtotal);
        $finalTotal = $subtotal + $deliveryFee + $serviceFee - $discount + $tax;

        // Simpan ke database
        $transaction->delivery_fee = $deliveryFee;
        $transaction->service_charge = $serviceFee;
        $transaction->discount = $discount;
        $transaction->tax = $tax;
        $transaction->final_total = $finalTotal;
        $transaction->save();

        // Buat item detail untuk midtrans
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

        // Konfigurasi Midtrans
        \Midtrans\Config::$serverKey = config('services.midtrans.server_key');
        \Midtrans\Config::$isProduction = config('services.midtrans.is_production');
        \Midtrans\Config::$isSanitized = config('services.midtrans.is_sanitized');
        \Midtrans\Config::$is3ds = config('services.midtrans.is_3ds');

        // Parameter ke Midtrans
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

        // Ambil Snap Token
        $snapToken = \Midtrans\Snap::getSnapToken($midtransParams);

        OrderStatus::create([
            'transaction_id' => $transaction->id,
            'status' => OrderStatusEnum::PROCESSING,
        ]);

        return redirect()
            ->back()
            ->with(['snap_token' => $snapToken]);
    }

    public function midtransCallback(Request $request): RedirectResponse
    {
        $orderId = $request->input('order_id'); // Ambil order_id dari Midtrans
        $transaction = Transaction::where('order_number', $orderId)->first();

        if (!$transaction) {
            return redirect()->back()->withErrors('Transaksi tidak ditemukan.');
        }

        $paymnetStatusMap = [
            'settlement' => PaymentStatusEnum::PAID,
            'capture' => PaymentStatusEnum::PAID,
            'pending' => PaymentStatusEnum::PENDING,
            'expire' => PaymentStatusEnum::EXPIRED,
            'cancel' => PaymentStatusEnum::CANCELLED,
            'deny' => PaymentStatusEnum::FAILED,
            'failure' => PaymentStatusEnum::FAILED,
            'refund' => PaymentStatusEnum::REFUNDED,
        ];

        $transactionStatus = $request->input('transaction_status'); // Ambil transaction_status dari Midtrans
        $transaction->payment_status = $paymnetStatusMap[$transactionStatus] ?? $transaction->payment_status;
        $transaction->payment_method = PaymentMethodEnum::OnlinePayment;
        $transaction->save();

        $isSuccess = $transactionStatus === 'settlement';

        if ($transaction->cashier_id) {
            return $isSuccess ? redirect()->route('cashier.transaction.success') : redirect()->route('cashier.transaction.failed');
        }

        if ($transaction->customer_id) {
            return $isSuccess ? redirect()->route('transaction.success') : redirect()->route('transaction.failed');
        }

        return redirect()->back()->withErrors('Tidak dapat menentukan role pengguna.');
    }

    // Untuk Customer
    public function transactionCustomerSuccess(): Response
    {
        return Inertia::render('customer/pages/transaction/success', [
            'message' => 'Pembayaran berhasil! Terima kasih telah memesan.',
        ]);
    }

    public function transactionCustomerFailed(): Response
    {
        return Inertia::render('customer/pages/transaction/failed', [
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
