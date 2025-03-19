import { cn } from '@/lib/utils';
import { Role } from '@/models/role';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Role>[] = [
    {
        id: 'no',
        accessorKey: 'no',
        header: () => <span className="text-xs font-bold text-gray-900 dark:text-gray-200">No</span>,
        cell: ({ row }) => <span className="max-w-36 text-sm text-gray-600 dark:text-gray-200">{row.index + 1}</span>,
        meta: {
            className: cn('sticky left-6'),
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: 'name',
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Role" />,
        cell: ({ row }) => <span className="max-w-36">{row.getValue('name')}</span>,
        meta: {
            className: cn(
                'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] lg:drop-shadow-none dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
                'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted transition-colors duration-200',
                'sticky left-6 md:table-cell',
            ),
        },
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'actions',
        accessorKey: 'actions',
        header: () => <span className="text-xs font-bold text-gray-900 dark:text-gray-200">Aksi</span>,
        cell: DataTableRowActions,
    },
];
