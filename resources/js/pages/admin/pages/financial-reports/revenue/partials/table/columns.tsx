import { Checkbox } from '@/components/ui/checkbox';
import { RevenueReport } from '@/models/financial-reports';
import { formatCurrency } from '@/utils/format-currency';
import { ColumnDef, Row } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<RevenueReport>[] = [
    {
        id: 'select',
        accessorKey: 'id',
        size: 20,
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: 'no',
        accessorKey: 'no',
        header: () => <span className="text-md font-medium text-gray-900 dark:text-gray-200">No</span>,
        cell: ({ row }) => <span className="text-sm text-gray-600 dark:text-gray-200">{row.index + 1}</span>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: 'report_date',
        accessorKey: 'report_date',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal Laporan" />,
        cell: ({ row }) => <span className="max-w-36">{row.getValue('report_date')}</span>,
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'total_transactions',
        accessorKey: 'total_transactions',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Transaksi" />,
        cell: ({ row }) => <span className="max-w-36">{row.getValue('total_transactions')} Transaksi</span>,
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'total_revenue',
        accessorKey: 'total_revenue',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Pendapatan" />,
        cell: ({ row }) => <span className="max-w-36">{formatCurrency(row.getValue('total_revenue'))}</span>,
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
