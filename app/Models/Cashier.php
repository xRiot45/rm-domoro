<?php

namespace App\Models;

use App\Enums\CashierStatusEnum;
use App\Enums\JobTypeEnum;
use App\Enums\ShiftEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cashier extends Model
{
    protected $table = 'cashiers';

    protected $fillable = [
        'user_id',
        'hired_at',
        'salary',
        'shift',
        'status',
        'job_type',
    ];

    protected function casts(): array
    {
        return [
            'hired_at' => 'datetime',
            'shift' => ShiftEnum::class,
            'status' => CashierStatusEnum::class,
            'job_type' => JobTypeEnum::class
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
