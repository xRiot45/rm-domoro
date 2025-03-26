<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id' => 'nullable|exists:customers,id',
            'cashier_id' => 'nullable|exists:cashiers,id',
            'menu_item_id' => 'required|exists:menu_items,id',
            'quantity' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'customer_id.exists' => 'Customer tidak ditemukan',
            'cashier_id.exists' => 'Cashier tidak ditemukan',
            'menu_item_id.exists' => 'Menu tidak ditemukan',
            'quantity.integer' => 'Quantity harus berupa angka',
            'quantity.min' => 'Quantity minimal adalah 1',
        ];
    }
}
