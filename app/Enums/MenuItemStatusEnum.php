<?php

namespace App\Enums;

enum MenuItemStatusEnum: string
{
    case Available = 'tersedia';
    case Unavailable = 'tidak tersedia';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
