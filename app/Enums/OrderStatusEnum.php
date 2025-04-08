<?php

namespace App\Enums;

enum OrderStatusEnum: string
{
    case PROCESSING = 'diproses';             // Order dikonfirmasi & diproses
    case COOKING = 'dimasak';                   // Chef sedang memasak
    case COOKED = 'selesai dimasak';                     // Masakan selesai dimasak
    case READY = 'siap';                       // Makanan siap diambil / diantar

    case DELIVERING = 'diantar';             // Kurir sedang mengantar
    case COMPLETED = 'selesai';               // Order selesai (sudah diterima customer)

    case CANCELLED = 'dibatalkan';               // Order dibatalkan

    public static function value(): array
    {
        return array_column(self::cases(), 'value');
    }
}
