<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Enums\OrderTypeEnum;
use App\Enums\PaymentMethodEnum;
use App\Enums\PaymentStatusEnum;
use App\Events\OrderPlacedEvent;
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
    private function handleMidtransStatusUpdate(Transaction $transaction, string $transactionStatus): void
    {
        $paymentStatusMap = [
            'capture' => PaymentStatusEnum::PAID,
            'settlement' => PaymentStatusEnum::PAID,
            'pending' => PaymentStatusEnum::PENDING,
            'deny' => PaymentStatusEnum::FAILED,
            'cancel' => PaymentStatusEnum::CANCELLED,
            'expire' => PaymentStatusEnum::EXPIRED,
            'failure' => PaymentStatusEnum::FAILED,
            'refund' => PaymentStatusEnum::REFUNDED,
        ];

        $transaction->payment_status = $paymentStatusMap[$transactionStatus] ?? $transaction->payment_status;
        $transaction->payment_method = PaymentMethodEnum::OnlinePayment;
        $transaction->save();
    }

    public function payWithCash(TransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        return DB::transaction(function () use ($request, $transaction) {
            $user = Auth::user();
            $cashier = Cashier::where('user_id', $user->id)->first();
            $customer = Customer::where('user_id', $user->id)->first();

            if ($customer && empty($customer->address)) {
                return redirect()
                    ->back()
                    ->withErrors(['address' => 'Alamat harus diisi terlebih dahulu di menu setting.']);
            }

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

            if ($paymentMethod === PaymentMethodEnum::Cash && $transaction->cashier_id !== null && $request->cash_received < $finalTotal) {
                return redirect()
                    ->back()
                    ->withErrors(['cash_received' => 'Uang Anda kurang.']);
            }

            $cashReceived = $transaction->cashier_id !== null ? $request->cash_received : 0;
            $change = $cashReceived !== 0 ? $cashReceived - $finalTotal : 0;

            $transaction->update([
                'order_type' => $orderType,
                'payment_method' => $paymentMethod,
                'payment_status' => $paymentMethod === PaymentMethodEnum::Cash ? ($transaction->cashier_id !== null ? PaymentStatusEnum::PAID : PaymentStatusEnum::PENDING) : PaymentStatusEnum::PENDING,
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
                'checked_out_at' => now(),
            ]);

            if ($cashier && $paymentMethod === PaymentMethodEnum::Cash) {
                OrderStatus::create([
                    'transaction_id' => $transaction->id,
                    'status' => OrderStatusEnum::PROCESSING,
                ]);
            } elseif ($customer && $paymentMethod === PaymentMethodEnum::Cash) {
                OrderStatus::create([
                    'transaction_id' => $transaction->id,
                    'status' => OrderStatusEnum::PENDING,
                ]);
            }

            if ($cashier) {
                return redirect()->route('cashier.cart.index')->with('success', 'Transaksi berhasil.');
            } elseif ($customer) {
                broadcast(new OrderPlacedEvent($transaction))->toOthers();
                return redirect()->route('cart.index')->with('success', 'Transaksi berhasil.');
            }
        });
    }

    public function payWithMidtrans(TransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        $transaction->load('transactionItems.menuItem');
        $transaction->note = $request->input('note');

        $user = Auth::user();
        $cashier = Cashier::where('user_id', $user->id)->first();
        $customer = Customer::where('user_id', $user->id)->first();

        if ($customer && empty($customer->address)) {
            return redirect()
                ->back()
                ->withErrors(['address' => 'Alamat harus diisi terlebih dahulu di menu setting.']);
        }

        // Tentukan jenis pesanan
        $orderType = OrderTypeEnum::tryFrom($request->order_type) ?? OrderTypeEnum::DineIn;
        $transaction->order_type = $orderType;

        // Isi informasi tambahan berdasarkan jenis pesanan (Untuk role Cashier)
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
        if ($cashier) {
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
        } elseif ($customer) {
            $midtransParams = [
                'transaction_details' => [
                    'order_id' => $transaction->order_number,
                    'gross_amount' => $finalTotal,
                ],
                'customer_details' => [
                    'first_name' => $user->full_name,
                    'phone' => $user->phone_number,
                    'email' => $user->email,
                    'shipping_address' => [
                        'first_name' => $user->full_name,
                        'phone' => $user->phone_number,
                        'address' => $customer->address,
                    ],
                ],
                'item_details' => $itemDetails,
                'callbacks' => [
                    'finish' => route('midtrans.callback'),
                    'unfinish' => route('midtrans.callback'),
                ],
                'notification_url' => route('midtrans.notification'),
            ];
        }

        // Ambil Snap Token
        $snapToken = \Midtrans\Snap::getSnapToken($midtransParams);

        if ($transaction->cashier_id !== null) {
            OrderStatus::create([
                'transaction_id' => $transaction->id,
                'status' => OrderStatusEnum::PROCESSING,
            ]);
        } elseif ($transaction->customer_id !== null) {
            OrderStatus::create([
                'transaction_id' => $transaction->id,
                'status' => OrderStatusEnum::PENDING,
            ]);
            broadcast(new OrderPlacedEvent($transaction))->toOthers();
        }

        return redirect()
            ->back()
            ->with(['snap_token' => $snapToken]);
    }

    // Digunakan untuk redirect dari sisi UI nya
    public function midtransCallback(Request $request): RedirectResponse
    {
        $orderId = $request['order_id'];
        $transaction = Transaction::where('order_number', $orderId)->first();

        if (!$transaction) {
            return redirect()->back()->withErrors('Transaksi tidak ditemukan.');
        }

        $transactionStatus = $request['transaction_status'];
        $this->handleMidtransStatusUpdate($transaction, $transactionStatus);

        $isSuccess = $transactionStatus === 'settlement';

        if ($isSuccess) {
            $transaction->update([
                'payment_status' => PaymentStatusEnum::PAID,
                'checked_out_at' => now(),
            ]);
        }

        if ($transaction->cashier_id) {
            return $isSuccess ? redirect()->route('cashier.transaction.success') : redirect()->route('cashier.transaction.failed');
        }

        if ($transaction->customer_id) {
            broadcast(new OrderPlacedEvent($transaction))->toOthers();
            return $isSuccess ? redirect()->route('transaction.success') : redirect()->route('transaction.failed');
        }

        return redirect()->back()->withErrors('Tidak dapat menentukan role pengguna.');
    }

    // Digunakan untuk webhook dari midtrans
    public function midtransNotification(Request $request)
    {
        $transaction = Transaction::where('order_number', $request['order_id'])->first();

        $orderId = $request['order_id'];
        $statusCode = $request['status_code'];
        $grossAmount = $request['gross_amount'];
        $reqSignature = $request['signature_key'];
        $signature = hash('sha512', $orderId . $statusCode . $grossAmount . config('services.midtrans.server_key'));

        if ($signature !== $reqSignature) {
            return response()->json(['message' => 'Invalid signature'], 401);
        }

        $transactionStatus = $request['transaction_status'];
        $order = Transaction::where('order_number', $orderId)->first();

        if ($transactionStatus === 'settlement') {
            $transaction->update([
                'payment_status' => PaymentStatusEnum::PAID,
                'checked_out_at' => now(),
            ]);
            broadcast(new OrderPlacedEvent($transaction))->toOthers();
        }

        if (!$order) {
            return response()->json(['message' => 'Transaksi tidak ditemukan'], 404);
        }

        $this->handleMidtransStatusUpdate($order, $transactionStatus);

        return response()->json(['message' => 'Notifikasi berhasil diterima'], 200);
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
