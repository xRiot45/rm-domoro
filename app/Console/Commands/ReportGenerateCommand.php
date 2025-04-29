<?php

namespace App\Console\Commands;

use App\Enums\PaymentStatusEnum;
use App\Models\RevenueReport;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Container\Attributes\DB;
use Illuminate\Support\Facades\Log;

class ReportGenerateCommand extends Command
{
    protected $signature = 'app:report-generate-command';

    protected $description = 'Generate daily revenue report based on transactions';

    public function handle()
    {
        $yesterday = Carbon::yesterday()->toDateString();
        $transactions = Transaction::whereDate('checked_out_at', $yesterday)->where('payment_status', PaymentStatusEnum::PAID)->get();

        $totalTransactions = $transactions->count();
        $totalRevenue = $transactions->sum('final_total');

        if ($totalTransactions === 0) {
            Log::info("Tidak ada transaksi pada tanggal {$yesterday}. Revenue report tidak dibuat.");
            $this->info("Tidak ada transaksi pada tanggal {$yesterday}. Revenue report tidak dibuat.");
            return;
        }

        RevenueReport::create([
            'report_date' => $yesterday,
            'total_transactions' => $totalTransactions,
            'total_revenue' => $totalRevenue,
        ]);

        Log::info("Revenue report untuk {$yesterday} berhasil dibuat.");
        $this->info("Revenue report untuk {$yesterday} berhasil dibuat.");
    }
}
