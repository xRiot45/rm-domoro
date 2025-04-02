<?php

namespace App\Enums;

enum PaymentMethodEnum: string
{
    case Cash = 'tunai';

    case OnlinePayment = 'online';

    public  static function value(): array
    {
        return array_column(self::cases(), 'value');
    }
}
