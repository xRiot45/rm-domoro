<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PermissionRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama permission / izin harus diisi',
            'name.string' => 'Nama permission / izin harus berupa string',
            'name.max' => 'Nama permission / izin maksimal 255 karakter',
        ];
    }
}
