<?php

namespace App\Http\Controllers;

use App\Models\RevenueReport;
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
        $revenueReports = RevenueReport::pluck('report_date');
        $expenseReports = RevenueReport::pluck('report_date');
        $availableDates = $revenueReports->diff($expenseReports);

        return Inertia::render('admin/pages/financial-reports/expense/pages/create', [
            'availableDates' => $availableDates,
        ]);
    }
}
