<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpenseReport extends Model
{
    protected $table = 'expense_reports';

    protected $fillable = [
        'report_date',
        'description',
        'total_expense'
    ];
}
