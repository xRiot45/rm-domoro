<?php

namespace App\Enums;

enum GenderEnum: string
{
    case Male = 'laki-laki';

    case Female = 'perempuan';

    public static function value(): array
    {
        return array_column(self::cases(), 'value');
    }
}
