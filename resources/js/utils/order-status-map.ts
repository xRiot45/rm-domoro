import { OrderStatusEnum } from '@/enums/order-status';

export const orderStatusMap: Record<OrderStatusEnum, { label: string; className: string }> = {
    [OrderStatusEnum.PROCESSING]: {
        label: 'Diproses',
        className: 'bg-blue-500 text-white',
    },
    [OrderStatusEnum.COOKING]: {
        label: 'Dimasak',
        className: 'bg-orange-500 text-white',
    },
    [OrderStatusEnum.COOKED]: {
        label: 'Selesai Dimasak',
        className: 'bg-teal-500 text-white',
    },
    [OrderStatusEnum.READY]: {
        label: 'Siap',
        className: 'bg-green-600 text-white',
    },
    [OrderStatusEnum.DELIVERING]: {
        label: 'Dikirim',
        className: 'bg-indigo-500 text-white',
    },
    [OrderStatusEnum.COMPLETED]: {
        label: 'Selesai',
        className: 'bg-gray-700 text-white',
    },
    [OrderStatusEnum.CANCELLED]: {
        label: 'Dibatalkan',
        className: 'bg-red-500 text-white',
    },
};
