<?php

namespace App\Console\Commands;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Models\RevenueReport;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ReportGenerateCommand extends Command
{
    protected $signature = 'report-revenue:generate';

    protected $description = 'Generate daily revenue report based on transactions';

    public function handle()
    {
        $today = Carbon::yesterday(config('app.timezone'))->toDateString();
        $transactions = Transaction::whereDate('checked_out_at', $today)
            ->where('payment_status', PaymentStatusEnum::PAID)
            ->whereHas('orderStatus', function ($query) {
                $query->where('status', OrderStatusEnum::COMPLETED);
            })
            ->get();

        $totalTransactions = $transactions->count();
        $totalRevenue = $transactions->sum('final_total');

        if ($totalTransactions === 0) {
            $this->info("Tidak ada transaksi pada tanggal {$today}. Revenue report tidak dibuat.");
            return;
        }

        RevenueReport::create([
            'report_date' => $today,
            'total_transactions' => $totalTransactions,
            'total_revenue' => $totalRevenue,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
