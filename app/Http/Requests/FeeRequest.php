<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => 'sometimes',
            'amount' => 'required|numeric',
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'Jumlah fee wajib diisi.',
            'amount.numeric' => 'Jumlah fee harus berupa angka.',
        ];
    }
}
