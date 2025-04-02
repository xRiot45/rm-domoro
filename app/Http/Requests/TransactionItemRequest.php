<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransactionItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'menu_item_id' => 'required|exists:menu_items,id',
            'quantity'     => 'required|integer|min:1',
            'unit_price'   => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'menu_item_id.required' => 'ID menu wajib diisi.',
            'menu_item_id.exists'   => 'Menu yang dipilih tidak ditemukan.',
            'quantity.required'     => 'Jumlah item wajib diisi.',
            'quantity.integer'      => 'Jumlah item harus berupa angka.',
            'quantity.min'          => 'Jumlah item minimal 1.',
            'unit_price.required'   => 'Harga satuan wajib diisi.',
            'unit_price.integer'    => 'Harga satuan harus berupa angka.',
            'unit_price.min'        => 'Harga satuan minimal 1.',
        ];
    }
}
