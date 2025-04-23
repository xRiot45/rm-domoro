<?php

use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CashierController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ChefController;
use App\Http\Controllers\CourierController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FeeController;
use App\Http\Controllers\ManageRolePermissionController;
use App\Http\Controllers\MenuCategoryController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\Settings\CustomerProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

// Route for customer
Route::middleware([])->group(function () {
    Route::get('/', [MenuItemController::class, 'index_customer'])->name('home');

    // Cart
    Route::prefix('cart')
        ->name('cart.')
        ->group(function () {
            Route::get('/', [CartController::class, 'index_customer'])->name('index');
            Route::post('/', [CartController::class, 'store'])->name('store');
            Route::put('/{id}', [CartController::class, 'update_quantity'])->name('update_quantity');
            Route::delete('/all', [CartController::class, 'destroy_all'])->name('destroy_all');
            Route::delete('/{id}', [CartController::class, 'destroy'])->name('destroy');
        });

    Route::get('/menu', [MenuItemController::class, 'menu_customer'])->name('menu.index');

    // Wishlist
    Route::prefix('wishlist')
        ->name('wishlist.')
        ->group(function () {
            Route::get('/', [WishlistController::class, 'index_customer'])->name('index');
            Route::post('/', [WishlistController::class, 'toggle'])->name('toggle');
        });

    // Checkout
    Route::prefix('checkout')
        ->name('checkout.')
        ->controller(CheckoutController::class)
        ->group(function () {
            Route::post('/', 'store')->name('store');
            Route::get('/{transaction}', 'index_checkout_customer')->name('index');
        });

    // Transaction
    Route::prefix('transaction')
        ->name('transaction.')
        ->group(function () {
            Route::put('/{transaction}/pay-cash', [TransactionController::class, 'payWithCash'])->name('pay-cash');
            Route::post('/{transaction}/pay-midtrans', [TransactionController::class, 'payWithMidtrans'])->name('pay-midtrans');
            Route::get('/success', [TransactionController::class, 'transactionCustomerSuccess'])->name('success');
            Route::get('/pending', [TransactionController::class, 'transactionCustomerPending'])->name('pending');
            Route::get('/failed', [TransactionController::class, 'transactionCustomerFailed'])->name('failed');
        });

    // Order
    Route::prefix('order')
        ->name('order.')
        ->group(function () {
            Route::get('/', [OrderController::class, 'index_customer'])->name('index');
            Route::get('/{id}', [OrderController::class, 'showOrderCustomer'])->name('show');
        });

    // Settings
    Route::prefix('settings/profile')
        ->name('customer.profile.')
        ->group(function () {
            Route::get('/', [CustomerProfileController::class, 'index_profile'])->name('index_profile');
            Route::post('/', [CustomerProfileController::class, 'update_profile'])->name('update_profile');
        });
});

// Route for admin
Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index_admin'])->name('dashboard');

        // Manajemen Kontrol Akses
        Route::prefix('manajemen-kontrol-akses')->group(function () {
            // Roles
            Route::prefix('roles')
                ->name('roles.')
                ->controller(RoleController::class)
                ->group(function () {
                    Route::get('/', 'index')->name('index');
                    Route::get('/create', 'create')->name('create');
                    Route::post('/create', 'store')->name('store');
                    Route::get('/edit/{id}', 'edit')->name('edit');
                    Route::put('/edit/{id}', 'update')->name('update');
                    Route::delete('/delete/{id}', 'destroy')->name('destroy');
                    Route::delete('/delete-all', 'destroy_all')->name('destroy_all');
                });

            // Permissions
            Route::prefix('permissions')
                ->name('permissions.')
                ->controller(PermissionController::class)
                ->group(function () {
                    Route::get('/', 'index')->name('index');
                    Route::get('/create', 'create')->name('create');
                    Route::post('/create', 'store')->name('store');
                    Route::get('/edit/{id}', 'edit')->name('edit');
                    Route::put('/edit/{id}', 'update')->name('update');
                    Route::delete('/delete/{id}', 'destroy')->name('destroy');
                    Route::delete('/delete-all', 'destroy_all')->name('destroy_all');
                });

            // Role Has Permissions
            Route::prefix('manage-role-permissions')
                ->name('manage-role-permission.')
                ->controller(ManageRolePermissionController::class)
                ->group(function () {
                    Route::get('/', 'index')->name('index');
                    Route::get('/create', 'create')->name('create');
                    Route::post('/create', 'store')->name('store');
                    Route::get('/edit/{id}', 'edit')->name('edit');
                    Route::put('/edit/{id}', 'update')->name('update');
                });
        });

        // Users Management
        Route::prefix('users-management')->group(function () {
            // All Users
            Route::prefix('all-users')
                ->name('all-users.')
                ->controller(UserController::class)
                ->group(function () {
                    Route::get('/', 'index_all_users')->name('index');
                    Route::get('/create', 'create')->name('create');
                    Route::post('/create', 'store')->name('store');
                    Route::get('/edit/{id}', 'edit')->name('edit');
                    Route::put('/edit/{id}', 'update')->name('update');
                    Route::delete('/delete/{id}', 'destroy')->name('destroy');
                });

            // Cashiers
            Route::prefix('cashiers')
                ->name('cashiers.')
                ->controller(CashierController::class)
                ->group(function () {
                    Route::get('/', 'index')->name('index');
                    Route::get('/create', 'create')->name('create');
                    Route::post('/create', 'store')->name('store');
                    Route::get('/edit/{id}', 'edit')->name('edit');
                    Route::put('/edit/{id}', 'update')->name('update');
                    Route::delete('/delete/{id}', 'destroy')->name('destroy');
                });

            // Customers
            Route::prefix('customers')
                ->name('customers.')
                ->controller(CustomerController::class)
                ->group(function () {
                    Route::get('/', 'index_admin')->name('index');
                    Route::get('/edit/{id}', 'edit')->name('edit');
                    Route::put('/edit/{id}', 'update')->name('update');
                });

            // Chefs
            Route::prefix('chefs')
                ->name('chefs.')
                ->controller(ChefController::class)
                ->group(function () {
                    Route::get('/', 'index')->name('index');
                    Route::get('/create', 'create')->name('create');
                    Route::post('/create', 'store')->name('store');
                    Route::get('/edit/{id}', 'edit')->name('edit');
                    Route::put('/edit/{id}', 'update')->name('update');
                    Route::delete('/delete/{id}', 'destroy')->name('destroy');
                });

            // Couriers
            Route::prefix('couriers')
                ->name('couriers.')
                ->controller(CourierController::class)
                ->group(function () {
                    Route::get('/', 'index')->name('index');
                    Route::get('/create', 'create')->name('create');
                    Route::post('/create', 'store')->name('store');
                    Route::get('/edit/{id}', 'edit')->name('edit');
                    Route::put('/edit/{id}', 'update')->name('update');
                    Route::delete('/delete/{id}', 'destroy')->name('destroy');
                });
        });

        // Menu Management
        Route::prefix('menu-management')->group(function () {
            // Menu Categories
            Route::prefix('menu-categories')
                ->name('menu-categories.')
                ->controller(MenuCategoryController::class)
                ->group(function () {
                    Route::get('/', 'index')->name('index');
                    Route::get('/create', 'create')->name('create');
                    Route::post('/create', 'store')->name('store');
                    Route::get('/edit/{id}', 'edit')->name('edit');
                    Route::put('/edit/{id}', 'update')->name('update');
                    Route::delete('/delete/{id}', 'destroy')->name('destroy');
                    Route::delete('/delete-all', 'destroy_all')->name('destroy_all');
                });

            // Menu Items
            Route::prefix('menu-items')
                ->name('menu-items.')
                ->controller(MenuItemController::class)
                ->group(function () {
                    Route::get('/', 'index_admin')->name('index');
                    Route::get('/create', 'create')->name('create');
                    Route::post('/create', 'store')->name('store');
                    Route::get('/edit/{id}', 'edit')->name('edit');
                    Route::put('/edit/{id}', 'update')->name('update');
                    Route::delete('/delete/{id}', 'destroy')->name('destroy');
                    Route::delete('/delete-all', 'destroy_all')->name('destroy_all');
                });
        });

        // Order Management
        Route::prefix('order-management')->group(function () {
            // All Orders
            Route::prefix('all-orders')
                ->name('all-orders.')
                ->controller(AdminOrderController::class)
                ->group(function () {
                    Route::get('/', 'allOrders')->name('index');
                    Route::get('/{transaction}', 'orderDetails')->name('orderDetails');
                });
        });

        // Settings
        Route::prefix('settings')
            ->name('settings.')
            ->group(function () {
                Route::prefix('fee')
                    ->name('fee.')
                    ->controller(FeeController::class)
                    ->group(function () {
                        Route::get('/', 'index_admin')->name('index');
                        Route::put('/{id}', 'update')->name('update');
                    });
            });
    });

// Route for chef
Route::middleware(['auth', 'verified', 'role:chef'])
    ->prefix('chef')
    ->name('chef.')
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index_chef'])->name('dashboard');

        // Orders
        Route::prefix('order')
            ->name('order.')
            ->controller(OrderController::class)
            ->group(function () {
                Route::get('/', 'index_chef')->name('index_chef');
                Route::put('/{transactionId}', 'takeOrderChef')->name('takeOrderChef');
                Route::put('/{transactionId}/cook', 'cookOrder')->name('cookOrder');
                Route::put('/{transactionId}/cooked', 'cookedOrder')->name('cookedOrder');
            });
    });

// Route for courier
Route::middleware(['auth', 'verified', 'role:courier'])
    ->prefix('courier')
    ->name('courier.')
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index_courier'])->name('dashboard');

        Route::prefix('order')
            ->name('order.')
            ->controller(OrderController::class)
            ->group(function () {
                Route::get('/', 'index_courier')->name('index_courier');
                Route::put('/{transactionId}', 'takeOrderCourier')->name('takeOrderCourier');
                Route::put('/{id}/ready-to-delivery', 'readyForDelivery')->name('readyForDelivery');
                Route::put('/{id}/delivering', 'deliveringOrder')->name('deliveringOrder');
                Route::put('/{id}/complete', 'orderCompleted')->name('orderCompleted');
            });
    });

// Route for cashier
Route::middleware(['auth', 'verified', 'role:cashier'])
    ->prefix('cashier')
    ->name('cashier.')
    ->group(function () {
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index_cashier'])->name('dashboard');

        // Menu Items / Cart
        Route::prefix('menu')
            ->name('cart.')
            ->controller(CartController::class)
            ->group(function () {
                Route::get('/', 'index_cashier')->name('index');
                Route::post('/cart', 'store')->name('store');
                Route::put('/cart/{id}', 'update_quantity')->name('update_quantity');
                Route::delete('/cart/{id}', 'destroy')->name('destroy');
                Route::delete('/cart-all', 'destroy_all')->name('destroy_all');
            });

        // Checkout
        Route::prefix('checkout')
            ->name('checkout.')
            ->controller(CheckoutController::class)
            ->group(function () {
                Route::post('/', 'store')->name('store');
                Route::get('/{transaction}', 'index_checkout_cashier')->name('index');
            });

        // Transaction
        Route::prefix('transaction')
            ->name('transaction.')
            ->group(function () {
                Route::put('/{transaction}/pay-cash', [TransactionController::class, 'payWithCash'])->name('pay-cash');
                Route::post('/{transaction}/pay-midtrans', [TransactionController::class, 'payWithMidtrans'])->name('pay-midtrans');
                Route::post('/midtrans/callback', [TransactionController::class, 'midtransCallback'])->name('midtrans.callback');
                Route::get('/success', [TransactionController::class, 'transactionCashierSuccess'])->name('success');
                Route::get('/pending', [TransactionController::class, 'transactionCashierPending'])->name('pending');
                Route::get('/failed', [TransactionController::class, 'transactionCashierFailed'])->name('failed');
            });

        // Orders
        Route::prefix('order')
            ->name('order.')
            ->controller(OrderController::class)
            ->group(function () {
                Route::get('/', 'index_cashier')->name('index_cashier');
                Route::put('/{transactionId}/update', 'update')->name('update');
                Route::get('/{transactionId}', 'edit')->name('edit');
                Route::put('/{transactionId}/take-order-cashier', 'takeOrderCashier')->name('takeOrderCashier');
                Route::put('/{id}/send-to-chef', 'sendOrderToChef')->name('sendOrderToChef');
                Route::put('/{id}/send-to-courier', 'sendOrderToCourier')->name('sendOrderToCourier');
                Route::put('/{id}/ready-to-serve', 'readyToServe')->name('readyToServe');
                Route::put('/{id}/complete', 'orderCompleted')->name('orderCompleted');
                Route::get('/invoice/{id}', 'showInvoiceCashier')->name('showInvoiceCashier');
            });
    });

Route::get('/midtrans/callback', [TransactionController::class, 'midtransCallback'])->name('midtrans.callback');
Broadcast::routes();

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
