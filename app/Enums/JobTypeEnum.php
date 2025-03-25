<?php

namespace App\Enums;

enum JobTypeEnum: string
{
    case FullTime = 'penuh waktu';

    case PartTime = 'paruh waktu';

    public static function value(): array
    {
        return array_column(self::cases(), 'value');
    }
}
