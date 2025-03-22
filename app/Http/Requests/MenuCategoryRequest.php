<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MenuCategoryRequest extends FormRequest
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
            'name.required' => 'Nama Kategori Menu Harus Diisi',
            'name.string' => 'Nama Kategori Menu Harus Berupa String',
            'name.max' => 'Nama Kategori Menu Maksimal 255 Karakter',
        ];
    }
}
