import { NetProfit } from '@/models/financial-reports';
import { formatCurrency } from '@/utils/format-currency';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { DataTableColumnHeader } from './data-table-column-header';

export const columns: ColumnDef<NetProfit>[] = [
    {
        id: 'no',
        accessorKey: 'no',
        header: () => <span className="text-md font-medium text-gray-900 dark:text-gray-200">No</span>,
        cell: ({ row }) => <span className="text-sm text-gray-600 dark:text-gray-200">{row.index + 1}</span>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'date',
        header: 'Tanggal Laporan',
        cell: ({ row }) => format(new Date(row.original.date), 'dd/MM/yyyy'),
        filterFn: (row, columnId, value) => {
            const date = new Date(row.getValue(columnId));
            const from = value?.from ? new Date(value.from) : null;
            const to = value?.to ? new Date(value.to) : null;
            return (!from || date >= from) && (!to || date <= to);
        },
    },
    {
        id: 'revenue',
        accessorKey: 'revenue',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Pendapatan" />,
        cell: ({ row }) => <span className="max-w-36">{formatCurrency(row.getValue('revenue'))}</span>,
        filterFn: (row, columnId, value) => {
            const val = row.getValue(columnId) as number;
            const min = value?.min ?? 0;
            const max = value?.max ?? Infinity;
            return val >= min && val <= max;
        },
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'expense',
        accessorKey: 'expense',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Pengeluaran" />,
        cell: ({ row }) => <span className="max-w-36">{formatCurrency(row.getValue('expense'))}</span>,
        filterFn: (row, columnId, value) => {
            const val = row.getValue(columnId) as number;
            const min = value?.min ?? 0;
            const max = value?.max ?? Infinity;
            return val >= min && val <= max;
        },
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'net_profit',
        accessorKey: 'net_profit',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Laba Bersih" />,
        cell: ({ row }) => <span className="max-w-36">{formatCurrency(row.getValue('net_profit'))}</span>,
        filterFn: (row, columnId, value) => {
            const val = row.getValue(columnId) as number;
            const min = value?.min ?? 0;
            const max = value?.max ?? Infinity;
            return val >= min && val <= max;
        },
        enableHiding: true,
        enableSorting: true,
    },
];
