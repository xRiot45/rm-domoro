<?php

namespace App\Enums;

enum PaymentStatusEnum: string
{
    case Pending = 'menunggu';

    case Paid = 'dibayar';

    case Failed = 'gagal';

    case Cancelled = 'dibatalkan';

    case Refunded = 'dikembalikan';

    case Expired = 'kadaluarsa';

    public  static function value(): array
    {
        return array_column(self::cases(), 'value');
    }
}
