<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExpenseReport extends Model
{
    protected $table = 'expense_reports';

    protected $fillable = [
        'report_date',
        'description',
        'total_expense'
    ];

    public function expenseItems(): HasMany
    {
        return $this->hasMany(ExpenseItem::class);
    }
}
