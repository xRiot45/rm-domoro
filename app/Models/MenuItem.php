<?php

namespace App\Models;

use App\Enums\MenuItemStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MenuItem extends Model
{
    protected $table = 'menu_items';

    protected $fillable = [
        'name',
        'price',
        'image_url',
        'status',
        'menu_category_id',
    ];

    protected $casts = [
        'status' => MenuItemStatusEnum::class
    ];

    public function menuCategory(): BelongsTo
    {
        return $this->belongsTo(MenuCategory::class);
    }

    public function carts(): HasMany
    {
        return $this->hasMany(Cart::class);
    }
}
