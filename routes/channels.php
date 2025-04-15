<?php

use App\Models\Chef;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('orders', function () {
    return true;
});

Broadcast::channel('orders.to-chef', function () {
    return true;
});
