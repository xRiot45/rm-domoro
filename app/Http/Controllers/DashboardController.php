<?php

namespace App\Http\Controllers;

use App\Models\ExpenseReport;
use App\Models\MenuItem;
use App\Models\RevenueReport;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index_admin(): Response
    {
        // Statistik Umum
        $totalUsers = User::count();
        $totalMenuItems = MenuItem::count();
        $totalTransactions = Transaction::count();

        // Pendapatan
        $totalRevenue = RevenueReport::sum('total_revenue');
        $totalRevenueTransactions = RevenueReport::sum('total_transactions');
        $averageRevenuePerTransaction = $totalRevenueTransactions > 0
            ? $totalRevenue / $totalRevenueTransactions
            : 0;

        $todayRevenueReport = RevenueReport::whereDate('report_date', Carbon::today())->first();
        $todayRevenue = $todayRevenueReport?->total_revenue ?? 0;

        // Pengeluaran
        $totalExpense = ExpenseReport::sum('total_expense');
        $todayExpense = ExpenseReport::whereDate('report_date', Carbon::today())->sum('total_expense');

        // Net Profit per Hari (Chart dan Tabel)
        $revenueDates = RevenueReport::select('report_date');
        $expenseDates = ExpenseReport::select('report_date');

        $dates = $revenueDates
            ->union($expenseDates)
            ->distinct()
            ->orderBy('report_date', 'asc')
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

        return Inertia::render('admin/dashboard', [
            // Angka Ringkasan
            'totalUsers' => $totalUsers,
            'totalMenuItems' => $totalMenuItems,
            'totalTransactions' => $totalTransactions,
            'totalRevenue' => $totalRevenue,
            'totalExpense' => $totalExpense,
            'averageRevenuePerTransaction' => $averageRevenuePerTransaction,
            'todayRevenue' => $todayRevenue,
            'todayExpense' => $todayExpense,

            // Grafik Net Profit
            'netProfitChart' => [
                'labels' => $labels,
                'datasets' => [
                    'revenue' => $revenues,
                    'expense' => $expenses,
                    'net_profit' => $netProfitsChart,
                ],
            ],

            // Tabel Laba Bersih
            'netProfitTable' => $netProfitsTable,
        ]);
    }

    public function index_courier(): Response
    {
        return Inertia::render('courier/dashboard');
    }

    public function index_cashier(): Response
    {
        return Inertia::render('cashier/dashboard');
    }

    public function index_chef(): Response
    {
        return Inertia::render('chef/dashboard');
    }
}
