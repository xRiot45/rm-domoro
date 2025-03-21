<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->route('id')),
            ],
            'password' => [
                $this->isMethod('post') ? 'required' : 'nullable',
                'confirmed',
                Rules\Password::defaults(),
            ],
            'phone_number' => 'required|string|min:12|max:255',
            'roles' => [
                $this->isMethod('post') ? 'required' : 'nullable',
                'exists:roles,name',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'Nama lengkap wajib diisi.',
            'full_name.string' => 'Nama lengkap harus berupa teks.',
            'full_name.max' => 'Nama lengkap tidak boleh lebih dari 255 karakter.',

            'email.required' => 'Email wajib diisi.',
            'email.string' => 'Email harus berupa teks.',
            'email.lowercase' => 'Email harus menggunakan huruf kecil.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email tidak boleh lebih dari 255 karakter.',
            'email.unique' => 'Email sudah digunakan, silakan gunakan email lain.',

            'password.required' => 'Kata sandi wajib diisi.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',

            'phone_number.required' => 'Nomor telepon wajib diisi.',
            'phone_number.string' => 'Nomor telepon harus berupa teks.',
            'phone_number.min' => 'Nomor telepon harus memiliki minimal 12 karakter.',
            'phone_number.255' => 'Nomor telepon tidak boleh lebih dari 255 karakter.',

            'roles.required' => 'Role wajib dipilih.',
            'roles.exists' => 'Role yang dipilih tidak valid.',
        ];
    }
}
