<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Models\Cart;
use App\Models\Cashier;
use App\Models\Customer;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function store(TransactionRequest $request): RedirectResponse
    {
        return DB::transaction(function () use ($request) {
            $user = Auth::user();
            $cashier = Cashier::where('user_id', $user->id)->first();
            $customer = Customer::where('user_id', $user->id)->first();

            if (!$cashier && !$customer) {
                return redirect()->back()->withErrors('Anda bukan kasir atau customer.');
            }

            $cashierId = $cashier->id ?? null;
            $customerId = $customer->id ?? null;

            $cartItems = Cart::where(function ($query) use ($cashierId, $customerId) {
                if ($cashierId) {
                    $query->where('cashier_id', $cashierId);
                }
                if ($customerId) {
                    $query->orWhere('customer_id', $customerId);
                }
            })->get();

            if ($cartItems->isEmpty()) {
                return redirect()->back()->withErrors('Keranjang masih kosong.');
            }

            $totalPrice = $cartItems->sum(fn($item) => $item->quantity * $item->unit_price);

            $transaction = Transaction::create([
                'customer_id' => $customerId,
                'cashier_id' => $cashierId,
                'order_type' => $request->order_type,
                'payment_method' => $request->payment_method,
                'payment_status' => 'Pending',
                'cash_received' => $request->cash_received ?? 0,
                'table_number' => $request->order_type === 'Dine-In' ? $request->table_number : null,
                'note' => $request->note,
                'total_price' => $totalPrice,
            ]);

            // Simpan setiap item dari carts ke transaction_items
            foreach ($cartItems as $item) {
                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'menu_item_id' => $item->menu_item_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->quantity * $item->unit_price,
                ]);
            }

            // Hapus item di carts setelah checkout
            Cart::where(function ($query) use ($cashierId, $customerId) {
                if ($cashierId) {
                    $query->where('cashier_id', $cashierId);
                }
                if ($customerId) {
                    $query->orWhere('customer_id', $customerId);
                }
            })->delete();

            return redirect()->route('cashier.transaction.index')->with('success', 'Checkout berhasil.');
        });
    }
}
