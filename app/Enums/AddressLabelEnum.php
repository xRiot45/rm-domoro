<?php

namespace App\Enums;

enum AddressLabelEnum: string
{
    case Home = 'rumah';

    case Office = 'kantor';

    case Apartment = 'apartemen';

    case BoardingHouse = 'kos';

    case Others = 'lainnya';

    public static function value(): array
    {
        return array_column(self::cases(), 'value');
    }
}
