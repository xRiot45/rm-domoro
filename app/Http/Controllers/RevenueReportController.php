<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Models\RevenueReport;
use App\Models\Transaction;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class RevenueReportController extends Controller
{
    public function index(): Response
    {
        $revenueReports = RevenueReport::all();
        $totalTransactions = RevenueReport::sum('total_transactions');
        $totalRevenue = RevenueReport::sum('total_revenue');
        $averageRevenuePerTransaction = $totalTransactions > 0 ? $totalRevenue / $totalTransactions : 0;

        $todayReport = RevenueReport::whereDate('report_date', Carbon::today())->first();
        $revenueByDate = RevenueReport::selectRaw('report_date, total_revenue')
            ->orderBy('report_date', 'asc')
            ->get();


        $todayTransactions = 0;
        $todayRevenue = 0;
        $todayAverageRevenuePerTransaction = 0;

        if ($todayReport) {
            $todayTransactions = $todayReport->total_transactions;
            $todayRevenue = $todayReport->total_revenue;
            $todayAverageRevenuePerTransaction = $todayTransactions > 0
                ? $todayRevenue / $todayTransactions
                : 0;
        }

        return Inertia::render('admin/pages/financial-reports/revenue/index', [
            'data' => $revenueReports,
            'totalTransactions' => $totalTransactions,
            'totalRevenue' => $totalRevenue,
            'averageRevenuePerTransaction' => $averageRevenuePerTransaction,
            'todayTransactions' => $todayTransactions,
            'todayRevenue' => $todayRevenue,
            'todayAverageRevenuePerTransaction' => $todayAverageRevenuePerTransaction,
            'revenueByDate' => $revenueByDate,
        ]);
    }


    public function detailReport($reportDate): Response
    {
        $revenueReport = RevenueReport::where('report_date', $reportDate)->first();
        if (!$revenueReport) {
            abort(404);
        }

        $transactions = Transaction::whereDate('checked_out_at', $reportDate)->get();
        $transactions->load([
            'transactionItems.menuItem.menuCategory',
            'orderStatus',
            'customer.user',
            'cashier.user',
            'courier.user',
            'chef.user',
        ]);

        return Inertia::render('admin/pages/financial-reports/revenue/pages/detail-report/index', [
            'report' => $revenueReport,
            'transactions' => $transactions,
        ]);
    }

    public function orderDetails(Transaction $transaction, int $transactionId): Response
    {
        $transaction = Transaction::findOrFail($transactionId);
        $transaction->load([
            'transactionItems.menuItem.menuCategory',
            'orderStatus',
            'customer.user',
            'cashier.user',
            'courier.user',
            'chef.user',
        ]);

        return Inertia::render('shared/order-detail', [
            'transaction' => $transaction,
        ]);
    }
}
