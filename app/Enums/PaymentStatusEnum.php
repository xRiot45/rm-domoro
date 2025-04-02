<?php

namespace App\Enums;

enum PaymentStatusEnum: string
{
    case Pending = 'pending';

    case Paid = 'paid';

    case Failed = 'failed';

    case Cancelled = 'cancelled';

    case Refunded = 'refunded';

    case Expired = 'expired';

    public  static function value(): array
    {
        return array_column(self::cases(), 'value');
    }
}
