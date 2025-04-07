<?php

namespace App\Http\Middleware;

use App\Models\Cashier;
use App\Models\Chef;
use App\Models\Courier;
use App\Models\MenuCategory;
use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'wishlist' => $request->user() ? $request->user()->wishlists()->pluck('menu_item_id') : [],
            ],
            'ziggy' => fn(): array => [...(new Ziggy())->toArray(), 'location' => $request->url()],

            // Data
            'roles' => Role::all(),
            'permissions' => Permission::all(),
            'menuCategories' => MenuCategory::all(),

            // Data Kasir
            'usersCashier' => User::whereHas('roles', function ($query) {
                $query->where('name', 'cashier');
            })->get(),
            'existingCashiers' => Cashier::pluck('user_id')->toArray(),

            // Data Chef
            'usersChef' => User::whereHas('roles', function ($query) {
                $query->where('name', 'chef');
            })->get(),
            'existingChefs' => Chef::pluck('user_id')->toArray(),
            'chefs' => Chef::with(['user'])->get(),

            // Data Courier
            'usersCourier' => User::whereHas('roles', function ($query) {
                $query->where('name', 'courier');
            })->get(),
            'existingCouriers' => Courier::pluck('user_id')->toArray(),
            'couriers' => Courier::with(['user'])->get(),

            'flash' => [
                'status' => session('status'),
                'snap_token' => fn() => $request->session()->get('snap_token'),
            ],
        ];
    }
}
