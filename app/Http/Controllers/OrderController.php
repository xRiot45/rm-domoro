<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Models\Cashier;
use App\Models\Chef;
use App\Models\Courier;
use App\Models\Customer;
use App\Models\OrderStatus;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index_cashier(): RedirectResponse|Response
    {
        $user = Auth::user();
        $cashier = Cashier::where('user_id', $user->id)->first();

        if (!$cashier) {
            return redirect()->back()->withErrors('Anda bukan kasir.');
        }


        $unassignedOrders = Transaction::with(['customer.user', 'transactionItems.menuItem.menuCategory', 'orderStatus'])
            ->whereNull('cashier_id')
            ->whereNotNull('customer_id')
            ->whereNotNull('checked_out_at')
            ->latest()
            ->get();

        $myOrders = Transaction::with(['customer.user', 'transactionItems.menuItem.menuCategory', 'orderStatus'])
            ->where('cashier_id', $cashier->id)
            ->latest()
            ->get();

        return Inertia::render('cashier/pages/order/index', [
            'unassignedOrders' => $unassignedOrders,
            'myOrders' => $myOrders,
        ]);
    }

    public function index_customer(): RedirectResponse|Response
    {
        $user = Auth::user();
        $customer = Customer::where('user_id', $user->id)->first();

        if (!$customer) {
            return redirect()->back()->withErrors('Anda bukan pelanggan.');
        }

        $myOrders = Transaction::with(['customer', 'transactionItems.menuItem.menuCategory', 'orderStatus'])
            ->where('customer_id', $customer->id)
            ->whereNotNull('checked_out_at')
            ->latest()
            ->get();

        return Inertia::render('customer/pages/order/index', [
            'myOrders' => $myOrders,
        ]);
    }

    public function show(int $transactionId): Response
    {
        $transaction = Transaction::with(['customer.user', 'transactionItems.menuItem.menuCategory', 'orderStatus'])->findOrFail($transactionId);
        return Inertia::render('customer/pages/order/pages/show', [
            'data' => $transaction,
        ]);
    }

    public function edit(int $transactionId): Response
    {
        $transaction = Transaction::with(['customer', 'transactionItems.menuItem.menuCategory', 'orderStatus'])->findOrFail($transactionId);
        return Inertia::render('cashier/pages/order/pages/edit', [
            'data' => $transaction,
        ]);
    }

    public function update(Request $request, int $transactionId): RedirectResponse
    {
        $transaction = Transaction::findOrFail($transactionId);

        $chef = Chef::find($request->chef_id);

        if (!$chef) {
            return back()->withErrors(['message' => 'Koki tidak ditemukan']);
        }

        $courierId = null;
        if (!empty($request->courier_id)) {
            $courier = Courier::find($request->courier_id);

            if (!$courier) {
                return back()->withErrors(['message' => 'Courier tidak ditemukan']);
            }

            $courierId = $courier->id;
        }

        $transaction->update([
            'chef_id' => $chef->id,
            'courier_id' => $courierId,
        ]);

        OrderStatus::create([
            'transaction_id' => $transaction->id,
            'status' => OrderStatusEnum::PROCESSING,
        ]);

        return redirect()
            ->route('cashier.order.index_cashier')
            ->with(['success' => 'Pesanan berhasil diupdate']);
    }

    public function takeOrder(int $transactionId): RedirectResponse
    {
        $user = Auth::user();
        $cashier = Cashier::where('user_id', $user->id)->first();
        if (!$cashier) {
            return redirect()->back()->withErrors('Anda bukan kasir.');
        }

        $transaction = Transaction::findOrFail($transactionId);
        $transaction->update([
            'cashier_id' => $cashier->id,
        ]);

        OrderStatus::create([
            'transaction_id' => $transaction->id,
            'status' => OrderStatusEnum::PROCESSING,
        ]);

        return redirect()->back()->with(['success' => 'Pesanan berhasil diambil']);
    }
}
