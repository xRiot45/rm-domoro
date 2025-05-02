<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExpenseReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'report_date' => 'required|date|unique:expense_reports,report_date',
            'description' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.expense_name' => 'required|string|max:255',
            'items.*.description' => 'nullable|string',
            'items.*.amount' => 'required|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'report_date.unique' => 'Laporan pengeluaran untuk tanggal ini sudah ada.',
            'report_date.date' => 'Tanggal harus berupa tanggal.',
            'items.*.amount.min' => 'Jumlah harus lebih besar dari 0.',
            'items.*.amount.numeric' => 'Jumlah harus berupa angka.',
            'items.*.expense_name.required' => 'Nama pengeluaran harus diisi.',
            'items.*.expense_name.string' => 'Nama pengeluaran harus berupa teks.',
            'items.*.expense_name.max' => 'Nama pengeluaran maksimal 255 karakter.',
            'items.*.description.string' => 'Keterangan harus berupa teks.',
            'items.*.description.max' => 'Keterangan maksimal 255 karakter.',
            'items.*.amount.required' => 'Jumlah harus diisi.',

        ];
    }
}
