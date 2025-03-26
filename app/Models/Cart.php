<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Cart extends Model
{
    protected $table = 'carts';

    protected $fillable = [
        'customer_id',
        'cashier_id',
        'menu_item_id',
        'quantity',
        'unit_price'
    ];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function ($cart): void {
            if (!$cart->session_id) {
                $cart->session_id = Str::uuid();
            }
        });
    }

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(Cashier::class, 'cashier_id');
    }
}
