<?php

namespace App\Models;

use App\Enums\MenuItemStatusEnum;
use Illuminate\Database\Eloquent\Model;

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

    public function menuCategory()
    {
        return $this->belongsTo(MenuCategory::class);
    }
}
