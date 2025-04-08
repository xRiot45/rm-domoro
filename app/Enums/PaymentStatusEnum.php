<?php

namespace App\Enums;

enum PaymentStatusEnum: string
{
    case PENDING = 'menunggu';

    case PAID = 'dibayar';

    case FAILED = 'gagal';

    case CANCELLED = 'dibatalkan';

    case REFUNDED = 'dikembalikan';

    case EXPIRED = 'kadaluarsa';

    public  static function value(): array
    {
        return array_column(self::cases(), 'value');
    }
}
