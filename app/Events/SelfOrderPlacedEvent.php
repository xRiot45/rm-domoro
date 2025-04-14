<?php

namespace App\Events;

use App\Models\Transaction;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SelfOrderPlacedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Transaction $transaction) {}

    public function broadcastWith(): array
    {
        $this->transaction->load([
            'customer.user',
            'transactionItems.menuItem.menuCategory',
            'orderStatus'
        ]);

        return [
            'transaction' => $this->transaction,
        ];
    }

    public function broadcastOn(): array
    {
        return [
            new Channel("orders")
        ];
    }

    public function broadcastAs(): string
    {
        return 'order-created';
    }
}
