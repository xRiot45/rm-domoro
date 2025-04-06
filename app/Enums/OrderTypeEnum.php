<?php

namespace App\Enums;

enum OrderTypeEnum: string
{
    case DineIn = 'makan di tempat';

    case Takeway = 'pesan lalu dibawa pulang';

    case Delivery = 'antar ke rumah';

    case Pickup = 'ambil di tempat';

    public  static function value(): array
    {
        return array_column(self::cases(), 'value');
    }
}
