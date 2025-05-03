<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExpenseReportRequest;
use App\Models\ExpenseReport;
use App\Models\RevenueReport;
use Illuminate\Container\Attributes\DB;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/pages/financial-reports/expense/index');
    }

    public function create(): Response
    {
        $revenueReports = RevenueReport::pluck('report_date')->map(fn($date) => \Carbon\Carbon::parse($date)->toDateString());
        $expenseReports = ExpenseReport::pluck('report_date')->map(fn($date) => \Carbon\Carbon::parse($date)->toDateString());
        $availableDates = $revenueReports->diff($expenseReports);

        return Inertia::render('admin/pages/financial-reports/expense/pages/create', [
            'availableDates' => $availableDates,
        ]);
    }

    public function store(ExpenseReportRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['report_date'] = \Carbon\Carbon::parse($validated['report_date'])->toDateString();

        try {
            $totalExpense = collect($validated['items'])->sum('amount');
            $expenseReport = ExpenseReport::create([
                'report_date' => $validated['report_date'],
                'description' => $validated['description'] ?? null,
                'total_expense' => $totalExpense,
            ]);

            foreach ($validated['items'] as $item) {
                $expenseReport->expenseItems()->create([
                    'expense_name' => $item['expense_name'],
                    'description' => $item['description'] ?? null,
                    'amount' => $item['amount'],
                ]);
            }

            return redirect()
                ->route('admin.financial-reports.expense.index')
                ->with(['success' => 'Laporan pengeluaran berhasil ditambahkan.']);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Gagal menyimpan laporan pengeluaran: ' . $e->getMessage()]);
        }
    }
}
