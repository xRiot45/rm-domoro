import { ManageRolePermission } from '@/models/manage-role-permission';
import { Permission } from '@/models/permission';
import { formatDate } from '@/utils/format-date';
import { ColumnDef, Row } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<ManageRolePermission>[] = [
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
                <ul className="max-w-36 list-inside list-disc space-y-1">
                    {permissions?.length ? (
                        permissions.map((permission) => (
                            <li key={permission.id} className="truncate">
                                {permission.name}
                            </li>
                        ))
                    ) : (
                        <span>-</span>
                    )}
                </ul>
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
