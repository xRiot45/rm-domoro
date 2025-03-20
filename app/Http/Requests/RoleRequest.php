<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoleRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama role tidak boleh kosong',
            'name.string' => 'Nama role harus berupa string',
            'name.max' => 'Nama role tidak boleh lebih dari 255 karakter',
        ];
    }
}
