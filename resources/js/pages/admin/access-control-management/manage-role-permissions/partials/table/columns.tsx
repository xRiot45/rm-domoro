import { Checkbox } from '@/components/ui/checkbox';
import { ManageRolePermission } from '@/models/manage-role-permission';
import { Permission } from '@/models/permission';
import { formatDate } from '@/utils/format-date';
import { ColumnDef, Row } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Permission>[] = [
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
        id: 'name',
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Role / Peran" />,
        cell: ({ row }) => <span className="max-w-36">{row.getValue('name')}</span>,
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'permissions',
        accessorKey: 'permissions',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Izin Yang Diberikan" />,
        cell: ({ row }) => {
            const permissions: Permission[] = row.getValue('permissions');
            return (
                <span className="max-w-36">
                    {permissions?.length ? (
                        permissions.map((permission, index: number) => (
                            <span key={permission.id} className="mr-2">
                                {index > 0 && ','}
                                {permission.name}
                            </span>
                        ))
                    ) : (
                        <span>-</span>
                    )}
                </span>
            );
        },
    },
    {
        id: 'created_at',
        accessorKey: 'created_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Dibuat Pada" />,
        cell: ({ row }) => <span className="max-w-36">{formatDate(row.getValue('created_at'))}</span>,
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'updated_at',
        accessorKey: 'updated_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Diubah Pada" />,
        cell: ({ row }) => <span className="max-w-36">{formatDate(row.getValue('updated_at'))}</span>,
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'actions',
        accessorKey: 'actions',
        header: () => <span className="text-md font-medium text-gray-900 dark:text-gray-200">Aksi</span>,
        cell: ({ row }) => <DataTableRowActions row={row as Row<ManageRolePermission>} />,
        enableHiding: false,
    },
];
