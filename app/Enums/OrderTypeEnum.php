<?php

namespace App\Enums;

enum OrderTypeEnum: string
{
    case DineIn = 'makan di tempat';

    case Takeway = 'ambil di tempat';

    case Delivery = 'antar ke rumah';

    public  static function value(): array
    {
        return array_column(self::cases(), 'value');
    }
}
