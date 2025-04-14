<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('orders', function ($user, $id) {
    return true;
});

Broadcast::channel('orders.to-chef.{chefId}', function ($user, $chefId) {
    return $user->id == (int) $chefId && $user->hasRole('chef');
});
