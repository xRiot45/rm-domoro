<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('orders', function () {
    return true;
});

Broadcast::channel('orders.to-chef', function () {
    return true;
});

Broadcast::channel('orders.to-courier', function () {
    return true;
});
