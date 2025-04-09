import { PaymentStatusEnum } from '@/enums/payment-status';

export const paymentStatusMap: Record<PaymentStatusEnum, { label: string; className: string }> = {
    [PaymentStatusEnum.PENDING]: {
        label: 'Pending',
        className: 'bg-yellow-500 text-white',
    },
    [PaymentStatusEnum.PAID]: {
        label: 'Dibayar',
        className: 'bg-green-500 text-white',
    },
    [PaymentStatusEnum.FAILED]: {
        label: 'Gagal',
        className: 'bg-red-500 text-white',
    },
    [PaymentStatusEnum.CANCELLED]: {
        label: 'Dibatalkan',
        className: 'bg-red-500 text-white',
    },
    [PaymentStatusEnum.REFUNDED]: {
        label: 'Dikembalikan',
        className: 'bg-blue-500 text-white',
    },
    [PaymentStatusEnum.EXPIRED]: {
        label: 'Kadaluarsa',
        className: 'bg-gray-500 text-white',
    },
};
