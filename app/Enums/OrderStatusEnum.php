<?php

namespace App\Enums;

enum OrderStatusEnum: string
{
    case Pending = 'menunggu';                   // Order dibuat, menunggu pembayaran/konfirmasi
    case AwaitingPayment = 'menunggu pembayaran';  // (Opsional) Jika menunggu pembayaran cash/transfer
    case Paid = 'dibayar';                         // Order sudah dibayar (tunai/online)

    case Processing = 'diproses';             // Order dikonfirmasi & diproses
    case Cooking = 'dimasak';                   // Chef sedang memasak
    case Cooked = 'selesai dimasak';                     // Masakan selesai dimasak
    case Ready = 'siap';                       // Makanan siap diambil / diantar

    case Delivering = 'diantar';             // Kurir sedang mengantar
    case Completed = 'selesai';               // Order selesai (sudah diterima customer)

    case Cancelled = 'dibatalkan';               // Order dibatalkan

    public static function value(): array
    {
        return array_column(self::cases(), 'value');
    }
}
