<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Cart;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\Cashier;
use App\Models\Customer;
use App\Models\Fee;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index_checkout_cashier(int $transactionId): Response
    {
        $data = Transaction::with('transactionItems.menuItem.menuCategory')->findOrFail($transactionId);
        $fees = Fee::whereIn('type', ['delivery', 'service', 'discount', 'tax'])->get()->keyBy('type');

        return Inertia::render('cashier/pages/checkout/index', [
            'data' => $data,
            'fees' => $fees
        ]);
    }

    public function store(): RedirectResponse
    {
        $user = Auth::user();
        $cashier = Cashier::where('user_id', $user->id)->first();
        $customer = Customer::where('user_id', $user->id)->first();

        if (!$cashier && !$customer) {
            return redirect()->back()->withErrors('Anda bukan kasir atau customer.');
        }

        $cashierId = $cashier->id ?? null;
        $customerId = $customer->id ?? null;

        // Ambil semua data dari keranjang untuk user yang sedang login
        $cartItems = Cart::where('cashier_id', $cashierId)->orWhere('customer_id', $customerId)->get();

        if ($cartItems->isEmpty()) {
            return redirect()->back()->withErrors('Keranjang Anda kosong.');
        }

        // Buat transaksi baru dengan status awal
        $transaction = Transaction::create([
            'customer_id' => $customerId,
            'cashier_id' => $cashierId,
            'order_type' => null,
            'payment_method' => null,
            'payment_status' => 'pending',
            'cash_received' => 0,
            'table_number' => null,
            'note' => null,
            'chef_id' => null,
            'courier_id' => null,
            'total_price' => $cartItems->sum(fn($item) => $item->unit_price * $item->quantity),
        ]);

        // Pindahkan data dari carts ke transaction_items
        foreach ($cartItems as $cartItem) {
            TransactionItem::create([
                'transaction_id' => $transaction->id,
                'menu_item_id' => $cartItem->menu_item_id,
                'quantity' => $cartItem->quantity,
                'unit_price' => $cartItem->unit_price,
                'subtotal' => $cartItem->unit_price * $cartItem->quantity,
            ]);
        }

        // Hapus semua item di keranjang setelah dipindahkan
        Cart::where('cashier_id', $cashierId)->orWhere('customer_id', $customerId)->delete();
        return redirect()->route('cashier.checkout.index', ['transaction' => $transaction->id]);
    }
}
