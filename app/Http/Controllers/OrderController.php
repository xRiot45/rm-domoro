<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Events\OrderAssignedToChefEvent;
use App\Events\OrderAssignedToCourierEvent;
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
            ->whereNotNull('checked_out_at')
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

        $myOrders = Transaction::with(['customer.user', 'transactionItems.menuItem.menuCategory', 'orderStatus'])
            ->where('customer_id', $customer->id)
            ->whereNotNull('checked_out_at')
            ->latest()
            ->get();

        return Inertia::render('customer/pages/order/index', [
            'myOrders' => $myOrders,
        ]);
    }

    public function index_chef(): RedirectResponse|Response
    {
        $user = Auth::user();
        $chef = Chef::where('user_id', $user->id)->first();

        if (!$chef) {
            return redirect()->back()->withErrors('Anda bukan koki.');
        }

        $unassignedOrders = Transaction::with(['customer.user', 'transactionItems.menuItem.menuCategory', 'orderStatus'])
            ->whereNull('chef_id')
            ->whereNotNull('order_sent_to_chef_at')
            ->latest()
            ->get();

        $myOrders = Transaction::with(['customer.user', 'transactionItems.menuItem.menuCategory', 'orderStatus'])
            ->where('chef_id', $chef->id)
            ->latest()
            ->get();

        return Inertia::render('chef/pages/order/index', [
            'unassignedOrders' => $unassignedOrders,
            'myOrders' => $myOrders,
        ]);
    }

    public function index_courier(): RedirectResponse|Response
    {
        $user = Auth::user();
        $courier = Courier::where('user_id', $user->id)->first();

        if (!$courier) {
            return redirect()->back()->withErrors('Anda bukan kurir.');
        }

        $unassignedOrders = Transaction::with(['customer.user', 'transactionItems.menuItem.menuCategory', 'orderStatus'])
            ->whereNull('courier_id')
            ->whereNotNull('order_sent_to_courier_at')
            ->latest()
            ->get();

        $myOrders = Transaction::with(['customer.user', 'transactionItems.menuItem.menuCategory', 'orderStatus'])
            ->where('courier_id', $courier->id)
            ->latest()
            ->get();

        return Inertia::render('courier/pages/order/index', [
            'unassignedOrders' => $unassignedOrders,
            'myOrders' => $myOrders,
        ]);
    }

    public function edit(int $transactionId): RedirectResponse|Response
    {
        $transaction = Transaction::with(['customer.user', 'transactionItems.menuItem.menuCategory', 'orderStatus'])->findOrFail($transactionId);

        return Inertia::render('cashier/pages/order/pages/edit', [
            'data' => $transaction,
        ]);
    }

    public function confirmSelfOrderCashPayment(Request $request, int $transactionId): RedirectResponse
    {
        $transaction = Transaction::findOrFail($transactionId);
        $cashReceived = (int) $request->cash_received;
        $finalTotal = (int) $transaction->final_total;
        $change = max(0, $cashReceived - $finalTotal);

        $transaction->update([
            'note' => $request->note,
            'cash_received' => $cashReceived,
            'change' => $change,
            'payment_status' => PaymentStatusEnum::PAID,
        ]);

        OrderStatus::create([
            'transaction_id' => $transaction->id,
            'status' => OrderStatusEnum::COMPLETED,
        ]);

        return redirect()
            ->back()
            ->with(['success' => 'Pesanan berhasil diupdate']);
    }

    /**
     * Menampilkan detail pesanan pelanggan.
     *
     * @param int $transactionId ID transaksi.
     * @return Response
     */
    public function showOrderCustomer(int $transactionId): Response
    {
        $transaction = Transaction::with(['customer.user', 'transactionItems.menuItem.menuCategory', 'orderStatus'])->findOrFail($transactionId);
        return Inertia::render('customer/pages/order/pages/show', [
            'data' => $transaction,
        ]);
    }

    /**
     * Menampilkan halaman cetak nota pesanan.
     *
     * @param int $transactionId ID transaksi.
     * @return Response
     */
    public function showInvoice(int $transactionId): Response
    {
        $transaction = Transaction::with(['customer.user', 'transactionItems.menuItem.menuCategory', 'orderStatus'])->findOrFail($transactionId);

        if (!$transaction->customer || !$transaction->customer->user) {
            $transaction->setRelation('customer', null);
        }

        return Inertia::render('shared/invoice', [
            'data' => $transaction,
        ]);
    }

    public function sendOrderToChef(int $transactionId): RedirectResponse
    {
        $transaction = Transaction::findOrFail($transactionId);
        $transaction->update([
            'order_sent_to_chef_at' => now(),
        ]);

        broadcast(new OrderAssignedToChefEvent($transaction))->toOthers();

        return redirect()
            ->back()
            ->with(['success' => 'Pesanan berhasil dikirim ke koki']);
    }

    public function sendOrderToCourier(int $transactionId): RedirectResponse
    {
        $transaction = Transaction::findOrFail($transactionId);
        $transaction->update([
            'order_sent_to_courier_at' => now(),
        ]);

        broadcast(new OrderAssignedToCourierEvent($transaction))->toOthers();

        return redirect()
            ->back()
            ->with(['success' => 'Pesanan berhasil dikirim ke kurir']);
    }

    // Ambil pesanan (cashier)
    public function takeOrderCashier(int $transactionId): RedirectResponse
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

        return redirect()
            ->back()
            ->with(['success' => 'Pesanan berhasil diambil']);
    }

    // Ambil pesanan (chef)
    public function takeOrderChef(int $transactionId): RedirectResponse
    {
        $user = Auth::user();
        $chef = Chef::where('user_id', $user->id)->first();
        if (!$chef) {
            return redirect()->back()->withErrors('Anda bukan chef.');
        }

        $transaction = Transaction::findOrFail($transactionId);
        $transaction->update([
            'chef_id' => $chef->id,
        ]);

        return redirect()
            ->back()
            ->with(['success' => 'Pesanan berhasil diambil']);
    }

    // Ambil pesanan (courier)
    public function takeOrderCourier(int $transactionId): RedirectResponse
    {
        $user = Auth::user();
        $courier = Courier::where('user_id', $user->id)->first();
        if (!$courier) {
            return redirect()->back()->withErrors('Anda bukan courier.');
        }

        $transaction = Transaction::findOrFail($transactionId);
        $transaction->update([
            'courier_id' => $courier->id,
        ]);

        return redirect()
            ->back()
            ->with(['success' => 'Pesanan berhasil diambil']);
    }

    // Masak pesanan (koki)
    public function cookOrder(int $transactionId): RedirectResponse
    {
        $transaction = Transaction::findOrFail($transactionId);
        OrderStatus::create([
            'transaction_id' => $transaction->id,
            'status' => OrderStatusEnum::COOKING,
        ]);

        return redirect()
            ->back()
            ->with(['success' => 'Pesanan sedang dimasak']);
    }

    // Pesanan selesai dimasak (koki)
    public function cookedOrder(int $transactionId): RedirectResponse
    {
        $transaction = Transaction::findOrFail($transactionId);
        OrderStatus::create([
            'transaction_id' => $transaction->id,
            'status' => OrderStatusEnum::COOKED,
        ]);

        return redirect()
            ->back()
            ->with(['success' => 'Pesanan selesai dimasak']);
    }

    // Pesanan siap diantar (courier)
    public function readyForDelivery(int $transactionId): RedirectResponse
    {
        $transaction = Transaction::findOrFail($transactionId);
        OrderStatus::create([
            'transaction_id' => $transaction->id,
            'status' => OrderStatusEnum::READY_FOR_DELIVERY,
        ]);

        return redirect()
            ->back()
            ->with(['success' => 'Pesanan siap diantar']);
    }

    // Pesanan diantar (courier)
    public function deliveringOrder(int $transactionId): RedirectResponse
    {
        $transaction = Transaction::findOrFail($transactionId);
        OrderStatus::create([
            'transaction_id' => $transaction->id,
            'status' => OrderStatusEnum::DELIVERING,
        ]);

        return redirect()
            ->back()
            ->with(['success' => 'Pesanan sedang diantar']);
    }

    // Pesanan siap disajikan (cashier)
    public function readyToServe(int $transactionId): RedirectResponse
    {
        $transaction = Transaction::findOrFail($transactionId);
        OrderStatus::create([
            'transaction_id' => $transaction->id,
            'status' => OrderStatusEnum::READY_TO_SERVE,
        ]);

        return redirect()
            ->back()
            ->with(['success' => 'Pesanan siap disajikan']);
    }

    // Pesanan Selesai (Cashier / Courier)
    public function orderCompleted(Request $request, int $transactionId): RedirectResponse
    {
        $transaction = Transaction::findOrFail($transactionId);

        $validated = $request->validate([
            'cash_received' => 'nullable|integer|min:0',
            'proof_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('proof_photo') && $request->file('proof_photo')->isValid()) {
            $file = $request->file('proof_photo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('', $filename, 'public');

            $validated['proof_photo'] = '/' . 'storage/' . $path;
        }

        if (isset($validated['cash_received'])) {
            $transaction->cash_received = $validated['cash_received'];
            $transaction->change = max(0, $transaction->cash_received - $transaction->final_total);
            $transaction->payment_status = PaymentStatusEnum::PAID;
        }

        if (isset($validated['proof_photo'])) {
            $transaction->proof_photo = $validated['proof_photo'];
        }
        $transaction->save();

        OrderStatus::create([
            'transaction_id' => $transaction->id,
            'status' => OrderStatusEnum::COMPLETED,
        ]);

        return redirect()
            ->back()
            ->with(['success' => 'Pesanan selesai']);
    }

    public function orderDetails(Transaction $transaction, int $transactionId): Response
    {
        $transaction = Transaction::findOrFail($transactionId);
        $transaction->load([
            'transactionItems.menuItem.menuCategory',
            'orderStatus',
            'customer.user',
            'cashier.user',
            'courier.user',
            'chef.user',
        ]);

        return Inertia::render('shared/order-detail', [
            'transaction' => $transaction,
        ]);
    }
}
