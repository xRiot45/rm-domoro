<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = ['full_name', 'email', 'password', 'phone_number', 'avatar'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected static function booted()
    {
        static::created(function ($user) {
            if (!$user->hasRole('customer')) {
                $user->customer()->delete();
            }
        });
    }

    public function cashiers(): HasOne
    {
        return $this->hasOne(Cashier::class);
    }

    public function customer(): HasOne
    {
        return $this->hasOne(Customer::class);
    }

    public function chef(): HasOne
    {
        return $this->hasOne(Chef::class);
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }
}
