<?php

namespace App\Models;

use App\Enums\EmployeeStatusEnum;
use App\Enums\GenderEnum;
use App\Enums\JobTypeEnum;
use App\Enums\ShiftEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cashier extends Model
{
    protected $table = 'cashiers';

    protected $fillable = [
        'user_id',
        'hired_at',
        'stopped_at',
        'salary',
        'gender',
        'shift',
        'status',
        'job_type',
    ];

    protected function casts(): array
    {
        return [
            'hired_at' => 'datetime',
            'stopped_at' => 'datetime',
            'shift' => ShiftEnum::class,
            'gender' => GenderEnum::class,
            'status' => EmployeeStatusEnum::class,
            'job_type' => JobTypeEnum::class
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function carts(): HasMany
    {
        return $this->hasMany(Cart::class, 'cashier_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'cashier_id');
    }
}
