<?php

namespace App\Http\Requests;

use App\Enums\AddressLabelEnum;
use App\Enums\GenderEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'birthplace' => 'nullable|string|max:255',
            'birthdate' => 'nullable|date',
            'address' => 'nullable|string|max:255',
            'address_label' => ['nullable', Rule::in(AddressLabelEnum::value())],
            'note' => 'nullable|string',
            'gender' => ['nullable', Rule::in(GenderEnum::value())],
        ];
    }
}
