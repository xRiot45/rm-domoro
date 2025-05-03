<?php

namespace App\Http\Controllers;

use App\Models\ExpenseReport;
use App\Models\RevenueReport;
use Illuminate\Database\Eloquent\Model;
use Inertia\Inertia;
use Inertia\Response;

class NetProfitController extends Model
{
    public function index(): Response
    {
        $revenueDates = (new RevenueReport)->newQuery()->select('report_date');
        $expenseDates = (new ExpenseReport)->newQuery()->select('report_date');

        $dates = $revenueDates
            ->union($expenseDates)
            ->distinct()
            ->orderBy('report_date', 'desc')
            ->get()
            ->pluck('report_date');

        $netProfits = $dates->map(function ($date) {
            $revenue = RevenueReport::where('report_date', $date)->sum('total_revenue');
            $expense = ExpenseReport::where('report_date', $date)->sum('total_expense');

            return [
                'date' => $date,
                'revenue' => $revenue,
                'expense' => $expense,
                'net_profit' => $revenue - $expense,
            ];
        });

        return Inertia::render('admin/pages/financial-reports/net-profit/index', [
            'netProfits' => $netProfits,
        ]);
    }
}
