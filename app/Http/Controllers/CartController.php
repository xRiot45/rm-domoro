<?php

namespace App\Http\Controllers;

use App\Http\Requests\CartRequest;
use App\Models\Cart;
use App\Models\Cashier;
use App\Models\Customer;
use App\Models\MenuItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    private function getCartItems(): array|RedirectResponse
    {
        $user = Auth::user();

        $cashier = Cashier::where('user_id', $user->id)->first();
        $customer = Customer::where('user_id', $user->id)->first();

        if (!$cashier && !$customer) {
            return redirect()->back()->withErrors('Anda bukan kasir atau customer.');
        }

        $menuItems = MenuItem::with('menuCategory')->get();
        $carts = Cart::with(['menuItem'])
            ->when($cashier?->id, fn($query, $id) => $query->where('cashier_id', $id))
            ->when($customer?->id, fn($query, $id) => $query->where('customer_id', $id))
            ->get();

        return [
            'menuItems' => $menuItems,
            'carts' => $carts,
        ];
    }

    public function index_cashier(): RedirectResponse|Response
    {
        $data = $this->getCartItems();

        if ($data instanceof RedirectResponse) {
            return $data;
        }

        return Inertia::render('cashier/pages/menu/index', [
            'menuItems' => $data['menuItems'],
            'carts' => $data['carts'],
        ]);
    }

    public function index_customer(): RedirectResponse|Response
    {
        $data = $this->getCartItems();
        $user = Auth::user();
        $customer = Customer::where('user_id', $user->id)->first();

        if ($data instanceof RedirectResponse) {
            return $data;
        }

        return Inertia::render('customer/pages/cart/index', [
            'carts' => $data['carts'],
            'customer' => $customer
        ]);
    }

    public function store(CartRequest $request): RedirectResponse
    {
        $user = Auth::user();
        $cashier = Cashier::where('user_id', $user->id)->first();
        $customer = Customer::where('user_id', $user->id)->first();

        if (!$cashier && !$customer) {
            return redirect()->back()->withErrors('Anda bukan kasir atau customer.');
        }

        $cashierId = $cashier->id ?? null;
        $customerId = $customer->id ?? null;

        $menuItem = MenuItem::findOrFail($request->menu_item_id);

        $cart = Cart::where('menu_item_id', $request->menu_item_id)->when($cashierId, fn($query) => $query->where('cashier_id', $cashierId))->when($customerId, fn($query) => $query->where('customer_id', $customerId))->first();

        if ($cart) {
            $cart->increment('quantity', $request->quantity);
        } else {
            Cart::create([
                'cashier_id' => $cashierId,
                'customer_id' => $customerId,
                'menu_item_id' => $request->menu_item_id,
                'quantity' => $request->quantity,
                'unit_price' => $menuItem->price,
            ]);
        }

        return redirect()->back()->with('success', 'Item berhasil ditambahkan ke keranjang.');
    }

    public function update_quantity(Request $request, int $id): RedirectResponse
    {
        $cart = Cart::findOrFail($id);
        $increment = $request->input('increment', true);

        if ($increment) {
            $cart->increment('quantity');
        } elseif ($cart->quantity > 1) {
            $cart->decrement('quantity');
        } else {
            $cart->delete();
        }

        return redirect()->back()->with('success', 'Jumlah menu berhasil diubah.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $cart = Cart::findOrFail($id);
        $cart->delete();
        return redirect()->back()->with('success', 'Item berhasil dihapus dari keranjang.');
    }

    public function destroy_all(): RedirectResponse
    {
        $user = Auth::user();
        $cashier = Cashier::where('user_id', $user->id)->first();
        $customer = Customer::where('user_id', $user->id)->first();

        if (!$cashier && !$customer) {
            return redirect()->back()->withErrors('Anda bukan kasir atau customer.');
        }

        $cashierId = $cashier->id ?? null;
        $customerId = $customer->id ?? null;

        Cart::where(function ($query) use ($cashierId, $customerId) {
            if ($cashierId) {
                $query->orWhere('cashier_id', $cashierId);
            }
            if ($customerId) {
                $query->orWhere('customer_id', $customerId);
            }
        })->delete();

        return redirect()->back()->with('success', 'Semua item berhasil dihapus dari keranjang.');
    }
}
