<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/admin/dashboard', [DashboardController::class, 'index_admin'])->name('admin.dashboard');

    // Roles
    Route::prefix('/admin/master-data/roles')
        ->controller(RoleController::class)
        ->group(function () {
            Route::get('/', 'index')->name('admin.roles.index');
            Route::get('/create', 'create')->name('admin.roles.create');
            Route::post('/create', 'store')->name('admin.roles.store');
        });
});



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
