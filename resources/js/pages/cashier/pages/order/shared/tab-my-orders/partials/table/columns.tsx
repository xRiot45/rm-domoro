import { Badge } from '@/components/ui/badge';
import { OrderStatusEnum } from '@/enums/order-status';
import { PaymentStatusEnum } from '@/enums/payment-status';
import { cn } from '@/lib/utils';
import { Transaction } from '@/models/transaction';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import { formatOrderType } from '@/utils/format-order-type';
import { Icon } from '@iconify/react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Transaction>[] = [
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
        header: ({ column }) => <DataTableColumnHeader column={column} title="Metode Pemesanan" />,
        cell: ({ row }) => <span className="text-sm capitalize">{formatOrderType(row.getValue('order_type'))}</span>,
        enableHiding: false,
        enableSorting: false,
    },
    {
        id: 'payment_method',
        accessorKey: 'payment_method',
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
        enableHiding: false,
        enableSorting: false,
    },
    {
        id: 'payment_status',
        accessorKey: 'payment_status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status Pembayaran" />,
        cell: ({ row }) => {
            const value = row.getValue('payment_status') as PaymentStatusEnum;

            const statusMap: Record<PaymentStatusEnum, { label: string; className: string }> = {
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

            const status = statusMap[value] ?? {
                label: value,
                className: 'bg-muted text-muted-foreground',
            };

            return <Badge className={status.className}>{status.label}</Badge>;
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
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status Pesanan" />,
        cell: ({ row }) => {
            const statuses = row.original.order_status;
            const latestStatus = statuses?.[statuses.length - 1];

            const statusMap: Record<OrderStatusEnum, { label: string; className: string }> = {
                // [OrderStatusEnum.PENDING]: {
                //     label: 'Menunggu',
                //     className: 'bg-yellow-500 text-white',
                // },
                // [OrderStatusEnum.AWAITINGPAYMENT]: {
                //     label: 'Menunggu Pembayaran',
                //     className: 'bg-yellow-500 text-white',
                // },
                // [OrderStatusEnum.PAID]: {
                //     label: 'Dibayar',
                //     className: 'bg-green-500 text-white',
                // },
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

            const status = latestStatus
                ? (statusMap[latestStatus.status as OrderStatusEnum] ?? {
                      label: latestStatus.status,
                      className: 'bg-muted text-muted-foreground',
                  })
                : {
                      label: 'Tidak Diketahui',
                      className: 'bg-muted text-muted-foreground',
                  };

            return <Badge className={status.className}>{status.label}</Badge>;
        },
        enableHiding: false,
        enableSorting: false,
    },

    {
        id: 'created_at',
        accessorKey: 'created_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Waktu Order" />,
        cell: ({ row }) => <span className="max-w-36">{formatDate(row.getValue('created_at'))}</span>,
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'actions',
        accessorKey: 'actions',
        header: () => <span className="text-md font-medium text-gray-900 dark:text-gray-200">Aksi</span>,
        cell: ({ row }) => <DataTableRowActions row={row as Row<Transaction>} />,
        enableHiding: false,
    },
];
