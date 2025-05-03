import { ExpenseReportItem } from '@/models/financial-reports';
import { formatCurrency } from '@/utils/format-currency';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';

export const columns: ColumnDef<ExpenseReportItem>[] = [
    {
        id: 'no',
        accessorKey: 'no',
        header: ({ column }) => <DataTableColumnHeader column={column} title="No" />,
        cell: ({ row }) => <span className="text-sm">{row.index + 1}</span>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'expense_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Pengeluaran" />,
        cell: ({ row }) => <span className="text-sm">{row.original.expense_name}</span>,
    },
    {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Deskripsi Pengeluaran" />,
        cell: ({ row }) => <span className="text-sm">{row.original.description}</span>,
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Jumlah Pengeluaran" />,
        cell: ({ row }) => <span className="text-sm">{formatCurrency(row.original.amount)}</span>,
    },
];
