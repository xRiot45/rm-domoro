<?php

namespace App\Http\Requests;

use App\Enums\EmployeeStatusEnum;
use App\Enums\GenderEnum;
use App\Enums\JobTypeEnum;
use App\Enums\ShiftEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class CourierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|integer|exists:users,id',
            'hired_at' => 'required|date',
            'stopped_at' => 'nullable|date',
            'salary' => 'required|numeric',
            'gender' => ['required', new Enum(GenderEnum::class)],
            'shift' => ['required', new Enum(ShiftEnum::class)],
            'status' => ['required', new Enum(EmployeeStatusEnum::class)],
            'job_type' => ['required', new Enum(JobTypeEnum::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'User harus dipilih',
            'user_id.integer' => 'User harus berupa angka',
            'user_id.exists' => 'User yang dipilih tidak valid',

            'hired_at.required' => 'Tanggal bergabung harus diisi',
            'hired_at.date' => 'Tanggal bergabung harus berupa tanggal',

            'stopped_at.date' => 'Tanggal selesai harus berupa tanggal',

            'salary.required' => 'Gaji harus diisi',
            'salary.numeric' => 'Gaji harus berupa angka',

            'gender.required' => 'Jenis kelamin harus dipilih',
            'shift.required' => 'Shift harus dipilih',
            'status.required' => 'Status harus dipilih',
            'job_type.required' => 'Tipe pekerjaan harus dipilih',
        ];
    }
}
