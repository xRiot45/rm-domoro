<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExpenseItem extends Model
{
    protected $table = 'expense_items';

    protected $fillable = [
        'expense_report_id',
        'expense_name',
        'description',
        'amount',
    ];

    public function expenseReport(): BelongsTo
    {
        return $this->belongsTo(ExpenseReport::class);
    }
}
