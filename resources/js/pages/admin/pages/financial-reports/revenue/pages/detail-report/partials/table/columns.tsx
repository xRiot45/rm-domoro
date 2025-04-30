import { Badge } from '@/components/ui/badge';
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
import { ColumnDef, Row } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Transaction>[] = [
    {
        id: 'order_number',
        accessorKey: 'order_number',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nomor Pesanan" />,
        cell: ({ row }) => <span className="text-sm">{row.getValue('order_number')}</span>,
        meta: {
            className: cn('pe-22 md:pe-10'),
        },
        enableSorting: true,
        enableHiding: false,
    },
    {
        id: 'name',
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Menu" />,
        cell: ({ row }) => {
            const items = row.original.transaction_items;
            const firstItem = items[0];

            return (
                <div className="flex items-start gap-3">
                    {firstItem?.menu_item?.image_url && (
                        <img src={`${firstItem.menu_item.image_url}`} alt={firstItem.menu_item?.name} className="h-16 w-16 rounded-md object-cover" />
                    )}
                    <div className="flex flex-col justify-center">
                        <h1 className="font-bold">{firstItem?.menu_item?.name ?? '-'}</h1>
                        <span className="text-muted-foreground text-sm">{firstItem?.menu_item?.menu_category?.name ?? '-'}</span>
                        {items.length > 1 && <span className="text-muted-foreground mt-1 text-xs">dan {items.length - 1} menu lainnya</span>}
                    </div>
                </div>
            );
        },
        meta: {
            className: cn('pe-22'),
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
            const firstItem = items[0];

            return (
                <div className="flex flex-col justify-center">
                    <span className="text-sm">
                        {firstItem?.quantity}x {firstItem?.menu_item?.name ?? '-'}
                    </span>
                    {items.length > 1 && <span className="text-muted-foreground mt-1 text-xs">dan {items.length - 1} menu lainnya</span>}
                </div>
            );
        },
        meta: {
            className: cn('pe-22 md:pe-10'),
        },
        enableHiding: false,
        enableSorting: false,
    },
    {
        id: 'unit_price',
        accessorKey: 'unit_price',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Harga Satuan" />,
        cell: ({ row }) => {
            const items = row.original.transaction_items;
            const firstItem = items[0];

            return (
                <div className="flex flex-col justify-center">
                    <span className="text-sm">{formatCurrency(firstItem?.unit_price)}</span>
                    {items.length > 1 && <span className="text-muted-foreground mt-1 text-xs">dan {items.length - 1} harga lainnya</span>}
                </div>
            );
        },
        meta: {
            className: cn('pe-22 md:pe-10'),
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
        meta: {
            className: cn('pe-22 md:pe-10'),
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
        meta: {
            className: cn('pe-22 md:pe-10'),
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
        meta: {
            className: cn('pe-22 md:pe-10'),
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
        meta: {
            className: cn('pe-22 md:pe-10'),
        },
        enableHiding: true,
        enableSorting: false,
    },
    {
        id: 'final_total',
        accessorKey: 'final_total',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
        cell: ({ row }) => <span className="text-sm">{formatCurrency(row.getValue('final_total'))}</span>,
        meta: {
            className: cn('pe-22 md:pe-10'),
        },
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
        meta: {
            className: cn('pe-22 md:pe-10'),
        },
        enableHiding: false,
        enableSorting: false,
    },
    {
        id: 'checked_out_at',
        accessorKey: 'checked_out_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal Checkout Pesanan" />,
        cell: ({ row }) => <span className="max-w-36">{formatDate(row.getValue('checked_out_at'))}</span>,
        meta: {
            className: cn('pe-22 md:pe-10'),
        },
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'actions',
        accessorKey: 'actions',
        header: () => <span className="text-md font-medium text-gray-900 dark:text-gray-200">Aksi</span>,
        cell: ({ row }) => <DataTableRowActions row={row as Row<Transaction>} />,
        meta: {
            className: cn('pe-10'),
        },
        enableHiding: false,
    },
];
