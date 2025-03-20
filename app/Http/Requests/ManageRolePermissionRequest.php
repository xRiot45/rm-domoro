<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ManageRolePermissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'role_id' => 'required|integer',
            'permission_id' => 'required|array',
            'permission_id.*' => 'integer|exists:permissions,id',
        ];
    }

    public function messages(): array
    {
        return [
            'role_id.required' => 'Role / Peran Wajib Dipilih',
            'role_id.integer' => 'Role / Peran Harus Berupa Angka',
            'role_id.exists' => 'Role yang dipilih tidak valid',

            'permission_id.required' => 'Permission / Izin Wajib Dipilih',
            'permission_id.array' => 'Permission / Izin harus berupa array',
            'permission_id.*.integer' => 'Setiap Permission / Izin harus berupa angka',
            'permission_id.*.exists' => 'Permission yang dipilih tidak valid',
        ];
    }
}
