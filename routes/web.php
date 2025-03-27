<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CashierController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ManageRolePermissionController;
use App\Http\Controllers\MenuCategoryController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Route for customer
Route::middleware([])->group(function () {
    Route::get('/', [MenuItemController::class, 'index_customer'])->name('home');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
});

// Route for admin
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [DashboardController::class, 'index_admin'])->name('admin.dashboard');

    Route::prefix('/admin/manajemen-kontrol-akses')->group(function () {
        // Roles
        Route::prefix('/roles')
            ->controller(RoleController::class)
            ->group(function () {
                Route::get('/', 'index')->name('admin.roles.index');
                Route::get('/create', 'create')->name('admin.roles.create');
                Route::post('/create', 'store')->name('admin.roles.store');
                Route::get('/edit/{id}', 'edit')->name('admin.roles.edit');
                Route::put('/edit/{id}', 'update')->name('admin.roles.update');
                Route::delete('/delete/{id}', 'destroy')->name('admin.roles.destroy');
                Route::delete('/delete-all', 'destroy_all')->name('admin.roles.destroy_all');
            });

        // Permissions
        Route::prefix('/permissions')
            ->controller(PermissionController::class)
            ->group(function () {
                Route::get('/', 'index')->name('admin.permissions.index');
                Route::get('/create', 'create')->name('admin.permissions.create');
                Route::post('/create', 'store')->name('admin.permissions.store');
                Route::get('/edit/{id}', 'edit')->name('admin.permissions.edit');
                Route::put('/edit/{id}', 'update')->name('admin.permissions.update');
                Route::delete('/delete/{id}', 'destroy')->name('admin.permissions.destroy');
                Route::delete('/delete-all', 'destroy_all')->name('admin.permissions.destroy_all');
            });

        // Role Has Permissions
        Route::prefix('/manage-role-permissions')
            ->controller(ManageRolePermissionController::class)
            ->group(function () {
                Route::get('/', 'index')->name('admin.manage-role-permission.index');
                Route::get('/create', 'create')->name('admin.manage-role-permission.create');
                Route::post('/create', 'store')->name('admin.manage-role-permission.store');
                Route::get('/edit/{id}', 'edit')->name('admin.manage-role-permission.edit');
                Route::put('/edit/{id}', 'update')->name('admin.manage-role-permission.update');
            });
    });

    Route::prefix('/admin/users-management')->group(function () {
        // All Users
        Route::prefix('/all-users')
            ->controller(UserController::class)
            ->group(function () {
                Route::get('/', 'index_all_users')->name('admin.all-users.index');
                Route::get('/create', 'create')->name('admin.all-users.create');
                Route::post('/create', 'store')->name('admin.all-users.store');
                Route::get('/edit/{id}', 'edit')->name('admin.all-users.edit');
                Route::put('/edit/{id}', 'update')->name('admin.all-users.update');
                Route::delete('/delete/{id}', 'destroy')->name('admin.all-users.destroy');
            });

        // Cashiers
        Route::prefix('/cashiers')
            ->controller(CashierController::class)
            ->group(function () {
                Route::get('/', 'index')->name('admin.cashiers.index');
                Route::get('/create', 'create')->name('admin.cashiers.create');
                Route::post('/create', 'store')->name('admin.cashiers.store');
                Route::get('/edit/{id}', 'edit')->name('admin.cashiers.edit');
                Route::put('/edit/{id}', 'update')->name('admin.cashiers.update');
                Route::delete('/delete/{id}', 'destroy')->name('admin.cashiers.destroy');
            });
    });

    Route::prefix('/admin/menu-management')->group(function () {
        // Menu Categories
        Route::prefix('/menu-categories')
            ->controller(MenuCategoryController::class)
            ->group(function () {
                Route::get('/', 'index')->name('admin.menu-categories.index');
                Route::get('/create', 'create')->name('admin.menu-categories.create');
                Route::post('/create', 'store')->name('admin.menu-categories.store');
                Route::get('/edit/{id}', 'edit')->name('admin.menu-categories.edit');
                Route::put('/edit/{id}', 'update')->name('admin.menu-categories.update');
                Route::delete('/delete/{id}', 'destroy')->name('admin.menu-categories.destroy');
                Route::delete('/delete-all', 'destroy_all')->name('admin.menu-categories.destroy_all');
            });

        // Menu Items
        Route::prefix('/menu-items')
            ->controller(MenuItemController::class)
            ->group(function () {
                Route::get('/', 'index_admin')->name('admin.menu-items.index');
                Route::get('/create', 'create')->name('admin.menu-items.create');
                Route::post('/create', 'store')->name('admin.menu-items.store');
                Route::get('/edit/{id}', 'edit')->name('admin.menu-items.edit');
                Route::put('/edit/{id}', 'update')->name('admin.menu-items.update');
                Route::delete('/delete/{id}', 'destroy')->name('admin.menu-items.destroy');
                Route::delete('/delete-all', 'destroy_all')->name('admin.menu-items.destroy_all');
            });
    });
});

// Route for chef
Route::middleware(['auth', 'verified', 'role:chef'])->group(function () {
    Route::get('/chef/dashboard', [DashboardController::class, 'index_chef'])->name('chef.dashboard');
});

// Route for courier
Route::middleware(['auth', 'verified', 'role:courier'])->group(function () {
    Route::get('/courier/dashboard', [DashboardController::class, 'index_courier'])->name('courier.dashboard');
});

// Route for customer
Route::middleware(['auth', 'verified', 'role:cashier'])->group(function () {
    Route::get('/cashier/dashboard', [DashboardController::class, 'index_cashier'])->name('cashier.dashboard');

    // Menu Items
    Route::prefix('/cashier/menu')->group(function () {
        Route::controller(CartController::class)->group(function () {
            Route::get('/', 'index')->name('cashier.cart.index');
            Route::post('/cart', 'store')->name('cashier.cart.store');
            Route::put('/cart/{id}', 'update_quantity')->name('cashier.cart.update_quantity');
            Route::delete('/cart/{id}', 'destroy')->name('cashier.cart.destroy');
            Route::delete('/cart-all', 'destroy_all')->name('cashier.cart.destroy_all');
        });
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
