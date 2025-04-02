<?php

namespace App\Enums;

enum OrderStatusEnum: string
{
    case Pending = 'pending';

    case Processing = 'processing';

    case Ready = 'ready';

    case Delivering = 'delivering';

    case Completed = 'completed';

    case Cancelled = 'cancelled';

    public static function value(): array
    {
        return array_column(self::cases(), 'value');
    }
}
