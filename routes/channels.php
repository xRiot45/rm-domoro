<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('orders', function ($user, $id) {
    return true;
});
