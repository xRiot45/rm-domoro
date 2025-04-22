<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
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

    public function orderDetails(Transaction $transaction): Response
    {
        $data = $this->getOrderDetails($transaction);
        return Inertia::render('admin/pages/order-management/pages/order-detail', $data);
    }
}
