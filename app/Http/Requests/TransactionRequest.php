<?php

namespace App\Http\Requests;

use App\Enums\OrderTypeEnum;
use App\Enums\PaymentMethodEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_type' => ['required', Rule::in(OrderTypeEnum::value())],
            'payment_method' => ['required', Rule::in(PaymentMethodEnum::value())],
            'cash_received' => 'nullable|integer|min:0',
            'table_number' => 'nullable|string|max:10',
            'note' => 'nullable|string|max:255',
            'shipping_address' => ['nullable', 'string', 'max:255'],
            'recipient' => ['nullable', 'string', 'max:255'],
            'recipient_phone_number' => ['nullable', 'string', 'max:15'],
        ];

        if ($this->isMethod('post')) {
            $rules['items'] = 'required|array|min:1';
            $rules['items.*.menu_item_id'] = 'required|exists:menu_items,id';
            $rules['items.*.quantity'] = 'required|integer|min:1';
            $rules['items.*.unit_price'] = 'required|integer|min:1';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            // Validasi Order Type (Tipe Pesanan)
            'order_type.required' => 'Tipe pesanan wajib dipilih.',
            'order_type.in' => 'Tipe pesanan harus salah satu dari: ' . implode(', ', OrderTypeEnum::value()) . '.',

            // Validasi Payment Method (Metode Pembayaran)
            'payment_method.required' => 'Metode pembayaran wajib dipilih.',
            'payment_method.in' => 'Metode pembayaran harus salah satu dari: ' . implode(', ', PaymentMethodEnum::value()) . '.',

            // Validasi Cash Received (Jumlah Uang yang Diterima)
            'cash_received.integer' => 'Jumlah uang yang diterima harus berupa angka.',
            'cash_received.min' => 'Jumlah uang yang diterima tidak boleh kurang dari 0.',

            // Validasi Nomor Meja & Catatan
            'table_number.string' => 'Nomor meja harus berupa teks.',
            'table_number.max' => 'Nomor meja tidak boleh lebih dari 10 karakter.',
            'note.string' => 'Catatan harus berupa teks.',
            'note.max' => 'Catatan tidak boleh lebih dari 255 karakter.',

            // Validasi Items (Daftar Menu yang Dipesan)
            'items.required' => 'Minimal harus ada satu item dalam pesanan.',
            'items.array' => 'Data item harus dalam format array.',
            'items.min' => 'Minimal harus ada satu item dalam pesanan.',

            // Validasi Menu Item ID
            'items.*.menu_item_id.required' => 'Menu wajib dipilih.',
            'items.*.menu_item_id.exists' => 'Menu yang dipilih tidak ditemukan.',

            // Validasi Quantity (Jumlah Item)
            'items.*.quantity.required' => 'Jumlah item wajib diisi.',
            'items.*.quantity.integer' => 'Jumlah item harus berupa angka.',
            'items.*.quantity.min' => 'Jumlah item minimal 1.',

            // Validasi Unit Price (Harga Satuan)
            'items.*.unit_price.required' => 'Harga satuan wajib diisi.',
            'items.*.unit_price.integer' => 'Harga satuan harus berupa angka.',
            'items.*.unit_price.min' => 'Harga satuan minimal 1.',

            // Validasi Shipping Address (Alamat Pengiriman), Phone Number (Nomor Telepon Penerima), Recipient (Penerima)
            'shipping_address.string' => 'Alamat pengiriman harus berupa teks.',
            'shipping_address.max' => 'Alamat pengiriman tidak boleh lebih dari 255 karakter.',
            'recipient.string' => 'Penerima harus berupa teks.',
            'recipient.max' => 'Penerima tidak boleh lebih dari 255 karakter.',
            'recipient_phone_number.string' => 'Nomor telepon penerima harus berupa teks.',
            'recipient_phone_number.max' => 'Nomor telepon penerima tidak boleh lebih dari 15 karakter.',
        ];
    }
}
