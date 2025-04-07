<?php

namespace App\Http\Controllers;

use App\Models\Cashier;
use App\Models\Chef;
use App\Models\Courier;
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

        $cashierId = $cashier->id ?? null;

        $unassignedOrders = Transaction::with(['customer', 'transactionItems.menuItem.menuCategory'])
            ->whereNull('cashier_id')
            ->whereNotNull('customer_id')
            ->latest()
            ->get();

        $myOrders = Transaction::with(['customer', 'transactionItems.menuItem.menuCategory'])
            ->where('cashier_id', $cashierId)
            ->latest()
            ->get();

        return Inertia::render('cashier/pages/order/index', [
            'unassignedOrders' => $unassignedOrders,
            'myOrders' => $myOrders,
        ]);
    }

    public function edit(int $transactionId): Response
    {
        $transaction = Transaction::with(['customer', 'transactionItems.menuItem.menuCategory'])->findOrFail($transactionId);
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

        return redirect()
            ->route('cashier.order.index_cashier')
            ->with(['success' => 'Pesanan berhasil diupdate']);
    }
}
