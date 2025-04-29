<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RevenueReport extends Model
{
    protected $table = 'revenue_reports';

    protected $fillable = [
        'report_date',
        'total_transactions',
        'total_revenue',
    ];
}
