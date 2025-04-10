import { OrderStatusEnum } from '@/enums/order-status';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@/models/order-status';
import { orderStatusMap } from '@/utils/order-status-map';
import { Icon } from '@iconify/react';

interface OrderProgressProps {
    orderId: string;
    orderStatus: OrderStatus[];
}

const statusIcons: Record<OrderStatusEnum, JSX.Element> = {
    [OrderStatusEnum.PENDING]: <Icon icon="mdi:clock-outline" className="h-5 w-5" />,
    [OrderStatusEnum.CONFIRMED]: <Icon icon="mdi:check-circle-outline" className="h-5 w-5" />,
    [OrderStatusEnum.PROCESSING]: <Icon icon="mdi:progress-clock" className="h-5 w-5" />,
    [OrderStatusEnum.COOKING]: <Icon icon="mdi:chef-hat" className="h-5 w-5" />,
    [OrderStatusEnum.COOKED]: <Icon icon="mdi:food-outline" className="h-5 w-5" />,
    [OrderStatusEnum.READY]: <Icon icon="mdi:bell-ring-outline" className="h-5 w-5" />,
    [OrderStatusEnum.DELIVERING]: <Icon icon="mdi:truck-delivery-outline" className="h-5 w-5" />,
    [OrderStatusEnum.COMPLETED]: <Icon icon="mdi:check-decagram" className="h-5 w-5" />,
    [OrderStatusEnum.CANCELLED]: <Icon icon="mdi:cancel" className="h-5 w-5" />,
};

const OrderProgress: React.FC<OrderProgressProps> = ({ orderId, orderStatus }) => {
    return (
        <div className="rounded-2xl border p-6 shadow-none">
            <div className="mb-16">
                <h3 className="mb-2 text-center text-xl font-semibold">Lacak Pesanan</h3>
                <div className="text-muted-foreground text-center text-sm">
                    Nomor Pesanan : <span className="font-medium text-black dark:text-white">{orderId}</span>
                </div>
            </div>
            <div className="grid grid-cols-2 space-y-12 md:grid-cols-4">
                {orderStatus.map((step, idx) => {
                    const statusInfo = orderStatusMap[step.status as OrderStatusEnum];
                    if (!statusInfo) {
                        return null;
                    }

                    const { label, className } = statusInfo;

                    return (
                        <div key={idx} className="text-center">
                            {/* Icon + Label */}
                            <div className="flex flex-col items-center">
                                <div className={cn('mb-2 flex h-10 w-10 items-center justify-center rounded-full', className)}>
                                    {statusIcons[step.status as OrderStatusEnum]}
                                </div>
                                <span className="text-sm font-semibold">{label}</span>
                                <div className="mt-1 flex flex-col">
                                    {/* Waktu */}
                                    <span className="text-muted-foreground mt-1 text-xs">
                                        {new Date(step.created_at).toLocaleTimeString('id-ID', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}
                                    </span>
                                    {/* Tanggal */}
                                    <span className="text-muted-foreground mt-1 text-xs">
                                        {new Date(step.created_at).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderProgress;
