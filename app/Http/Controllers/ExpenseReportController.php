<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExpenseReportRequest;
use App\Models\ExpenseReport;
use App\Models\RevenueReport;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseReportController extends Controller
{
    public function index(): Response
    {
        $expenseReport = ExpenseReport::with('expenseItems')->get();
        return Inertia::render('admin/pages/financial-reports/expense/index', [
            'data' => $expenseReport
        ]);
    }

    public function detailReport($reportDate): Response
    {
        $expenseReport = ExpenseReport::with('expenseItems')->where('report_date', $reportDate)->first();
        return Inertia::render('admin/pages/financial-reports/expense/pages/detail-report/index', [
            'data' => $expenseReport
        ]);
    }

    public function create(): Response
    {
        $revenueReports = RevenueReport::pluck('report_date')->map(fn($date) => Carbon::parse($date)->toDateString());
        $expenseReports = ExpenseReport::pluck('report_date')->map(fn($date) => Carbon::parse($date)->toDateString());
        $availableDates = $revenueReports->diff($expenseReports);

        return Inertia::render('admin/pages/financial-reports/expense/pages/create', [
            'availableDates' => $availableDates,
        ]);
    }

    public function store(ExpenseReportRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['report_date'] = Carbon::parse($validated['report_date'])->toDateString();

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
