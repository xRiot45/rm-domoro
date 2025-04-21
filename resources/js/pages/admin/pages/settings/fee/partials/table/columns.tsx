import { FeeItem } from '@/models/fee';
import { formatCurrency } from '@/utils/format-currency';
import { ColumnDef, Row } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<FeeItem>[] = [
    {
        id: 'no',
        accessorKey: 'no',
        header: () => <span className="text-md font-medium text-gray-900 dark:text-gray-200">No</span>,
        cell: ({ row }) => <span>{row.index + 1}</span>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: 'type',
        accessorKey: 'type',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Jenis Biaya" />,
        cell: ({ row }) => <span className="capitalize">{row.original.type}</span>,
    },
    {
        id: 'amount',
        accessorKey: 'amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Jumlah Biaya" />,
        cell: ({ row }) => <span>{formatCurrency(row.original.amount)}</span>,
        enableSorting: false,
        enableHiding: false,
    },

    {
        id: 'actions',
        accessorKey: 'actions',
        header: () => <span className="text-md font-medium text-gray-900 dark:text-gray-200">Aksi</span>,
        cell: ({ row }) => <DataTableRowActions row={row as Row<FeeItem>} />,
        enableHiding: false,
    },
];
