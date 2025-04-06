<?php

namespace App\Helpers;

use App\Enums\ShiftEnum;
use Carbon\Carbon;

class ShiftHelper
{
    public static function getCurrentShift(): string
    {
        $hour = Carbon::now()->format('H');

        if ($hour >= 6 && $hour < 14) {
            return ShiftEnum::Morning->value;
        } elseif ($hour >= 14 && $hour < 22) {
            return ShiftEnum::Evening->value;
        }

        return ShiftEnum::Night->value;
    }
}
