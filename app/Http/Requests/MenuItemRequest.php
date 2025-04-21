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
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'image_url' => 'sometimes|nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status' => ['sometimes', 'required', new Enum(MenuItemStatusEnum::class)],
            'ingredients' => 'sometimes|nullable',
            'menu_category_id' => 'sometimes|required|exists:menu_categories,id',
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

            'image_url.required' => 'Gambar menu harus diisi.',
            'image_url.image' => 'Gambar menu harus berupa gambar.',
            'image_url.mimes' => 'Format gambar menu harus jpg, jpeg, png, atau webp.',
            'image_url.max' => 'Ukuran gambar menu tidak boleh lebih dari 2MB.',

            'status.required' => 'Status menu harus dipilih.',
            'status.exists' => 'Status menu yang dipilih tidak valid.',

            'menu_category_id.required' => 'Kategori menu harus dipilih.',
            'menu_category_id.exists' => 'Kategori menu yang dipilih tidak valid.',
        ];
    }
}
