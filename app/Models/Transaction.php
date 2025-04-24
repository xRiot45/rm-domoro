<?php

namespace App\Models;

use App\Enums\OrderTypeEnum;
use App\Enums\PaymentMethodEnum;
use App\Enums\PaymentStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Transaction extends Model
{
    protected $table = 'transactions';

    protected $fillable = ['customer_id', 'cashier_id', 'order_type', 'payment_method', 'payment_status', 'cash_received', 'change', 'table_number', 'shipping_address', 'recipient', 'recipient_phone_number', 'note', 'chef_id', 'courier_id', 'total_price', 'delivery_fee', 'service_charge', 'discount', 'tax', 'final_total', 'proof_photo', 'checked_out_at', 'order_sent_to_chef_at', 'order_sent_to_courier_at'];

    protected function casts(): array
    {
        return [
            'order_type' => OrderTypeEnum::class,
            'payment_method' => PaymentMethodEnum::class,
            'payment_status' => PaymentStatusEnum::class,
        ];
    }

    public static function boot(): void
    {
        parent::boot();

        static::creating(function ($transaction) {
            $randomString = strtoupper(Str::random(6));
            $transaction->order_number = 'ORD-' . now()->format('Ymd') . '-' . $randomString;
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

    public function orderStatus(): HasMany
    {
        return $this->hasMany(OrderStatus::class);
    }
}
