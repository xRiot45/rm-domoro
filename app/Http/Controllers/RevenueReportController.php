<?php

namespace App\Http\Controllers;

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
        return Inertia::render('admin/pages/financial-reports/revenue/index', [
            'data' => $revenueReports,
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
