<?php

namespace App\Http\Requests\Settings;

use App\Enums\AddressLabelEnum;
use App\Enums\GenderEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'full_name' => 'filled|string|max:255',
            'phone_number' => 'filled|string|min:12|max:12',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'birthplace' => 'nullable|string|max:255',
            'birthdate' => 'nullable|date',
            'address' => 'nullable|string|max:255',
            'address_label' => ['nullable', Rule::in(AddressLabelEnum::value())],
            'note' => 'nullable|string',
            'gender' => ['nullable', Rule::in(GenderEnum::value())],
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'Nama lengkap harus diisi',
            'full_name.string' => 'Nama lengkap harus berupa string',
            'full_name.max' => 'Nama lengkap maksimal 255 karakter',
            'phone_number.required' => 'Nomor telepon harus diisi',
            'phone_number.string' => 'Nomor telepon harus berupa string',
            'phone_number.min' => 'Nomor telepon minimal 12 karakter',
            'phone_number.max' => 'Nomor telepon maksimal 12 karakter',
            'birthplace.string' => 'Tempat lahir harus berupa string',
            'birthplace.max' => 'Tempat lahir maksimal 255 karakter',
            'birthdate.date' => 'Tanggal lahir harus berupa tanggal',
            'address.string' => 'Alamat harus berupa string',
            'address.max' => 'Alamat maksimal 255 karakter',
            'note.string' => 'Catatan harus berupa string',
            'gender.string' => 'Jenis kelamin harus berupa string',
            'gender.in' => 'Jenis kelamin harus sesuai dengan pilihan',
        ];
    }
}
