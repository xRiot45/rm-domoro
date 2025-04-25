import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderStatusEnum } from '@/enums/order-status';
import { OrderTypeEnum } from '@/enums/order-type';
import { PaymentStatusEnum } from '@/enums/payment-status';
import { cn } from '@/lib/utils';
import { Transaction } from '@/models/transaction';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import { formatOrderType } from '@/utils/format-order-type';
import { orderStatusMap } from '@/utils/order-status-map';
import { paymentStatusMap } from '@/utils/payment-status-map';
import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { DataTableColumnHeader } from './data-table-column-header';

export const columns = (onUpdateStatusOrder: (transaction: Transaction) => void): ColumnDef<Transaction>[] => [
    {
        id: 'order_number',
        accessorKey: 'order_number',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nomor Pesanan" />,
        cell: ({ row }) => <span className="text-sm">{row.getValue('order_number')}</span>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        id: 'name',
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Menu" />,
        cell: ({ row }) => {
            const items = row.original.transaction_items;

            return (
                <div className="flex flex-col gap-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                            {item.menu_item?.image_url && (
                                <img src={`${item.menu_item.image_url}`} alt={item.menu_item.name} className="h-16 w-16 rounded-md object-cover" />
                            )}
                            <div>
                                <span className="block font-medium">{item.menu_item?.name ?? '-'}</span>
                                <span className="text-muted-foreground block text-sm">{item.menu_item?.menu_category?.name ?? '-'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            );
        },
        meta: {
            className: cn('pe-22 lg:pe-0'),
        },
        enableHiding: false,
        enableSorting: false,
    },
    {
        id: 'quantity',
        accessorKey: 'quantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Jumlah Menu" />,
        cell: ({ row }) => {
            const items = row.original.transaction_items;
            return (
                <div className="flex flex-col gap-1 space-y-13">
                    {items.map((item) => (
                        <span key={item.id} className="text-sm">
                            {item.quantity}x {item.menu_item?.name ?? '-'}
                        </span>
                    ))}
                </div>
            );
        },
        enableHiding: false,
        enableSorting: false,
    },
    {
        id: 'unit_price',
        accessorKey: 'unit_price',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Harga Satuan" />,
        cell: ({ row }) => {
            const unitPrice = row.original.transaction_items;
            return (
                <div className="flex flex-col gap-1 space-y-13">
                    {unitPrice.map((item) => (
                        <span key={item.id} className="text-sm">
                            {formatCurrency(item.unit_price)}
                        </span>
                    ))}
                </div>
            );
        },
        enableHiding: false,
        enableSorting: false,
    },
    {
        id: 'order_type',
        accessorKey: 'order_type',
        accessorFn: (row) => row.order_type ?? 'unknown',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Metode Pemesanan" />,
        cell: ({ row }) => <span className="text-sm capitalize">{formatOrderType(row.getValue('order_type'))}</span>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableHiding: false,
        enableSorting: false,
    },
    {
        id: 'table_number',
        accessorKey: 'table_number',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nomor Meja" />,
        cell: ({ row }) => {
            const orderType = row.original.order_type;
            const tableNumber = row.original.table_number;

            if (orderType === OrderTypeEnum.DINEIN) {
                return <span className="text-sm">{tableNumber ?? '-'}</span>;
            }

            return <span className="text-muted-foreground text-sm italic">-</span>;
        },
        enableHiding: false,
        enableSorting: false,
    },
    {
        id: 'payment_method',
        accessorKey: 'payment_method',
        accessorFn: (row) => row.payment_method ?? 'unknown',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Metode Pembayaran" />,
        cell: ({ row }) => {
            const value = row.getValue('payment_method') as string;
            const isOnline = value === 'online';
            const colorClass = isOnline ? 'bg-blue-500 text-white' : 'bg-green-500 text-white';
            const icon = isOnline ? 'mdi:credit-card' : 'mdi:cash';
            const label = isOnline ? 'Online' : 'Tunai';

            return (
                <Badge className={`flex items-center gap-1 ${colorClass}`}>
                    <Icon icon={icon} className="h-4 w-4" />
                    {label}
                </Badge>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableHiding: false,
        enableSorting: false,
    },
    {
        id: 'payment_status',
        accessorKey: 'payment_status',
        accessorFn: (row) => row.payment_status ?? 'unknown',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status Pembayaran" />,
        cell: ({ row }) => {
            const value = row.getValue('payment_status') as PaymentStatusEnum;
            const paymentStatus = paymentStatusMap[value] ?? {
                label: value,
                className: 'bg-muted text-muted-foreground',
            };

            return <Badge className={paymentStatus.className}>{paymentStatus.label}</Badge>;
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableHiding: true,
        enableSorting: false,
    },
    {
        id: 'final_total',
        accessorKey: 'final_total',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
        cell: ({ row }) => <span className="text-sm">{formatCurrency(row.getValue('final_total'))}</span>,
        enableHiding: true,
        enableSorting: false,
    },
    {
        id: 'latest_order_status',
        accessorFn: (row) => row.order_status?.[row.order_status.length - 1]?.status ?? 'unknown',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status Pesanan" />,
        cell: ({ row }) => {
            const statuses = row.original.order_status;
            const latestStatus = statuses?.[statuses.length - 1];
            const orderStatus = latestStatus
                ? (orderStatusMap[latestStatus.status as OrderStatusEnum] ?? {
                      label: latestStatus.status,
                      className: 'bg-muted text-muted-foreground',
                  })
                : {
                      label: 'Tidak Diketahui',
                      className: 'bg-muted text-muted-foreground',
                  };

            return <Badge className={orderStatus.className}>{orderStatus.label}</Badge>;
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableHiding: false,
        enableSorting: false,
    },
    {
        id: 'created_at',
        accessorKey: 'created_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal Pemesanan" />,
        cell: ({ row }) => <span className="max-w-36">{formatDate(row.getValue('created_at'))}</span>,
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'actions',
        accessorKey: 'actions',
        header: () => <span className="text-md font-medium text-gray-900 dark:text-gray-200">Aksi</span>,
        cell: ({ row }) => {
            const transactionId = row.original.id;
            const orderStatusList = row.original.order_status;
            const latestStatus = orderStatusList[orderStatusList.length - 1];
            const cookedStatuses = [
                OrderStatusEnum.COOKED,
                OrderStatusEnum.READY_FOR_DELIVERY,
                OrderStatusEnum.READY_TO_SERVE,
                OrderStatusEnum.DELIVERING,
                OrderStatusEnum.COMPLETED,
                OrderStatusEnum.CANCELLED,
            ];

            const beingCooked = latestStatus.status === OrderStatusEnum.COOKING;
            const cooked = cookedStatuses.includes(latestStatus.status as OrderStatusEnum);

            const handleCookOrder = () => {
                router.put(
                    route('chef.order.cookOrder', transactionId),
                    {},
                    {
                        onSuccess: () => {
                            toast.success('Success', {
                                description: 'Pesanan Siap Dimasak!',
                                action: {
                                    label: 'Tutup',
                                    onClick: () => toast.dismiss(),
                                },
                            });

                            onUpdateStatusOrder({
                                ...row.original,
                                order_status: [
                                    ...orderStatusList,
                                    {
                                        status: OrderStatusEnum.COOKING,
                                    },
                                ],
                            });
                        },
                        onError: (errors) => {
                            toast.error('Failed', {
                                description: errors.message || 'Pesanan Gagal Dimasak!',
                                action: {
                                    label: 'Tutup',
                                    onClick: () => toast.dismiss(),
                                },
                            });
                        },
                        preserveScroll: true,
                    },
                );
            };

            const handleOrderFinishedCooking = () => {
                router.put(
                    route('chef.order.cookedOrder', transactionId),
                    {},
                    {
                        onSuccess: () => {
                            toast.success('Success', {
                                description: 'Pesanan Selesai Dimasak!',
                                action: {
                                    label: 'Tutup',
                                    onClick: () => toast.dismiss(),
                                },
                            });

                            onUpdateStatusOrder({
                                ...row.original,
                                order_status: [
                                    ...orderStatusList,
                                    {
                                        status: OrderStatusEnum.COOKED,
                                    },
                                ],
                            });
                        },
                        onError: (errors) => {
                            toast.error('Failed', {
                                description: errors.message || 'Pesanan Tidak Selesai Dimasak!',
                                action: {
                                    label: 'Tutup',
                                    onClick: () => toast.dismiss(),
                                },
                            });
                        },
                        preserveScroll: true,
                    },
                );
            };

            return (
                <Button
                    className="cursor-pointer"
                    size="sm"
                    onClick={beingCooked ? handleOrderFinishedCooking : handleCookOrder}
                    disabled={cooked}
                    variant={beingCooked ? 'destructive' : 'default'}
                    title={cooked ? 'Pesanan sudah selesai dimasak atau tidak dapat dimasak lagi' : ''}
                >
                    {cooked ? 'Sudah Dimasak' : beingCooked ? 'Selesai Dimasak' : 'Masak Pesanan'}
                </Button>
            );
        },
        enableHiding: false,
    },
];
