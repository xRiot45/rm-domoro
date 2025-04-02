<?php

namespace App\Models;

use App\Enums\AddressLabel;
use App\Enums\AddressLabelEnum;
use App\Enums\GenderEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $table = 'customers';

    protected $fillable = [
        'birthplace',
        'birthdate',
        'address',
        'address_label',
        'note',
        'gender',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'birthdate' => 'datetime',
            'address_label' => AddressLabelEnum::class,
            'gender' => GenderEnum::class
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'customer_id');
    }
}
