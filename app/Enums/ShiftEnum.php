<?php

namespace App\Enums;

enum ShiftEnum: string
{
    case Morning = 'pagi'; // 06:00 - 13:59

    case Evening = 'sore'; // 14:00 - 21:59

    case Night = 'malam';  // 22:00 - 05:59

    public  static function value(): array
    {
        return array_column(self::cases(), 'value');
    }
}
