<?php

namespace App\Http\Controllers;

use App\Enums\OrderTypeEnum;
use App\Enums\PaymentMethodEnum;
use App\Enums\PaymentStatusEnum;
use App\Http\Requests\TransactionRequest;
use App\Models\Fee;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

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
            $deliveryFee = $orderType === OrderTypeEnum::Delivery ? ($fees['delivery']->amount ?? 0) : 0;
            $serviceFee = $fees['service']->amount ?? 0;
            $discount = $fees['discount']->amount ?? 0;
            $tax = $fees['tax']->amount ?? 0;

            // Hitung total akhir
            $finalTotal = $subtotal + $deliveryFee + $serviceFee - $discount + $tax;

            // Validasi jika pembayaran tunai tidak mencukupi
            if ($paymentType === PaymentMethodEnum::Cash && $request->cash_received < $finalTotal) {
                return redirect()->back()->withErrors(['cash_received' => 'Uang Anda kurang.']);
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
}
