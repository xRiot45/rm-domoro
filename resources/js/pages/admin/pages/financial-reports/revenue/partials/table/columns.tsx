import { RevenueReport } from '@/models/financial-reports';
import { formatCurrency } from '@/utils/format-currency';
import { ColumnDef, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<RevenueReport>[] = [
    {
        id: 'no',
        accessorKey: 'no',
        header: () => <span className="text-md font-medium text-gray-900 dark:text-gray-200">No</span>,
        cell: ({ row }) => <span className="text-sm text-gray-600 dark:text-gray-200">{row.index + 1}</span>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'report_date',
        header: 'Tanggal Laporan',
        cell: ({ row }) => format(new Date(row.original.report_date), 'dd/MM/yyyy'),
        filterFn: (row, columnId, value) => {
            const date = new Date(row.getValue(columnId));
            const from = value?.from ? new Date(value.from) : null;
            const to = value?.to ? new Date(value.to) : null;
            return (!from || date >= from) && (!to || date <= to);
        },
    },
    {
        id: 'total_transactions',
        accessorKey: 'total_transactions',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Transaksi" />,
        cell: ({ row }) => <span className="max-w-36">{row.getValue('total_transactions')} Transaksi</span>,
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
        id: 'total_revenue',
        accessorKey: 'total_revenue',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Pendapatan" />,
        cell: ({ row }) => <span className="max-w-36">{formatCurrency(row.getValue('total_revenue'))}</span>,
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
        id: 'actions',
        accessorKey: 'actions',
        header: () => <span className="text-md font-medium text-gray-900 dark:text-gray-200">Aksi</span>,
        cell: ({ row }) => <DataTableRowActions row={row as Row<RevenueReport>} />,
        enableHiding: false,
    },
];
