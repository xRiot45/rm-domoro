<?php

namespace App\Models;

use App\Enums\OrderTypeEnum;
use App\Enums\PaymentMethodEnum;
use App\Enums\PaymentStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    protected $table = 'transactions';

    protected $fillable = ['customer_id', 'cashier_id', 'order_type', 'payment_method', 'payment_status', 'cash_received', 'table_number', 'shipping_address', 'recipient', 'recipient_phone_number', 'note', 'chef_id', 'courier_id', 'total_price', 'delivery_fee', 'service_charge', 'discount', 'tax', 'final_total'];

    protected function casts(): array
    {
        return [
            'order_type' => OrderTypeEnum::class,
            'payment_method' => PaymentMethodEnum::class,
            'payment_status' => PaymentStatusEnum::class,
        ];
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($transaction) {
            $latestOrder = static::whereDate('created_at', now()->toDateString())->count() + 1;
            $transaction->order_number = 'ORD-' . now()->format('Ymd') . '-' . str_pad($latestOrder, 4, '0', STR_PAD_LEFT);
        });
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(Cashier::class);
    }

    public function chef(): BelongsTo
    {
        return $this->belongsTo(Chef::class);
    }

    public function courier(): BelongsTo
    {
        return $this->belongsTo(Courier::class);
    }

    public function transactionItems(): HasMany
    {
        return $this->hasMany(TransactionItem::class);
    }
}
