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
            ->orderBy('report_date', 'asc') // urutan waktu untuk chart
            ->get()
            ->pluck('report_date');

        $labels = [];
        $revenues = [];
        $expenses = [];
        $netProfitsChart = [];
        $netProfitsTable = [];

        foreach ($dates as $date) {
            $revenue = RevenueReport::where('report_date', $date)->sum('total_revenue');
            $expense = ExpenseReport::where('report_date', $date)->sum('total_expense');
            $netProfit = $revenue - $expense;

            $labels[] = $date;
            $revenues[] = $revenue;
            $expenses[] = $expense;
            $netProfitsChart[] = $netProfit;

            $netProfitsTable[] = [
                'date' => $date,
                'revenue' => $revenue,
                'expense' => $expense,
                'net_profit' => $netProfit,
            ];
        }

        return Inertia::render('admin/pages/financial-reports/net-profit/index', [
            'netProfits' => $netProfitsTable,
            'chartData' => [
                'labels' => $labels,
                'datasets' => [
                    'revenue' => $revenues,
                    'expense' => $expenses,
                    'net_profit' => $netProfitsChart,
                ],
            ],
        ]);
    }
}
