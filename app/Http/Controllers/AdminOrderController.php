<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Models\OrderStatus;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminOrderController extends Controller
{
    private function getOrderDetails(Transaction $transaction): array
    {
        $transaction->load([
            'transactionItems.menuItem.menuCategory',
            'orderStatus',
            'customer.user',
            'cashier.user',
            'courier.user',
        ]);

        return [
            'transaction' => $transaction
        ];
    }

    public function allOrders(): Response
    {
        $orders = Transaction::with(['customer.user', 'transactionItems.menuItem.menuCategory', 'orderStatus'])
            ->whereNotNull('checked_out_at')
            ->latest()
            ->get();

        return Inertia::render('admin/pages/order-management/all-orders/index', [
            'orders' => $orders,
        ]);
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

    public function cancelledOrder(Transaction $transaction, int $transactionId): RedirectResponse
    {
        $transaction = Transaction::findOrFail($transactionId);

        OrderStatus::create([
            'transaction_id' => $transaction->id,
            'status' => OrderStatusEnum::CANCELLED,
        ]);

        return redirect()->back()->with('success', 'Order has been cancelled.');
    }
}
