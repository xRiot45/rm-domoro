<?php

namespace App\Enums;

enum ShiftEnum: string
{
    case Morning = 'pagi';

    case Evening = 'sore';

    case Night = 'malam';

    public  static function value(): array
    {
        return array_column(self::cases(), 'value');
    }
}
