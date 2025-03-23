<?php

namespace App\Http\Requests;

use App\Enums\MenuItemStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class MenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'image_url' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status' => ['required', new Enum(MenuItemStatusEnum::class)],
            'menu_category_id' => 'required|exists:menu_categories,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama menu harus diisi.',
            'name.string' => 'Nama menu harus berupa teks.',
            'name.max' => 'Nama menu tidak boleh lebih dari 255 karakter.',

            'price.required' => 'Harga menu harus diisi.',
            'price.numeric' => 'Harga menu harus berupa angka.',

            'image_url.required' => 'URL gambar menu harus diisi.',
            'image_url.image' => 'URL gambar menu harus berupa gambar.',
            'image_url.mimes' => 'Format gambar menu harus jpg, jpeg, png, atau webp.',
            'image_url.max' => 'Ukuran gambar menu tidak boleh lebih dari 2MB.',

            'status.required' => 'Status menu harus dipilih.',
            'status.exists' => 'Status menu yang dipilih tidak valid.',

            'menu_category_id.required' => 'Kategori menu harus dipilih.',
            'menu_category_id.exists' => 'Kategori menu yang dipilih tidak valid.',
        ];
    }
}
