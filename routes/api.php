<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TransactionController;

Route::post('/midtrans/notification', [TransactionController::class, 'midtransNotification'])->name('midtrans.notification');
