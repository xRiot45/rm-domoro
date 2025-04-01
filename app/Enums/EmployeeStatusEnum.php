<?php

namespace App\Enums;

enum EmployeeStatusEnum: string
{
    case Work = 'bekerja';

    case Leave = 'berhenti';

    public static function value(): array
    {
        return array_column(self::cases(), 'value');
    }
}
