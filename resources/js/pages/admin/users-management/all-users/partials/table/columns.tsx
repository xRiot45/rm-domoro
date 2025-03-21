import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@/types';
import { formatDate } from '@/utils/format-date';
import { ColumnDef, Row } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<User>[] = [
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
        id: 'full_name',
        accessorKey: 'full_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Lengkap" />,
        cell: ({ row }) => <span className="max-w-36">{row.getValue('full_name')}</span>,
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'email',
        accessorKey: 'email',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email Pengguna" />,
        cell: ({ row }) => <span className="max-w-36">{row.getValue('email')}</span>,
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'phone_number',
        accessorKey: 'phone_number',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nomor Telepon Pengguna" />,
        cell: ({ row }) => <span className="max-w-36">{row.getValue('phone_number')}</span>,
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'roles',
        accessorKey: 'roles',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Role / Peran" />,
        cell: ({ row }) => {
            const roles: string[] = row.getValue('roles') || [];
            const roleColors: Record<string, string> = {
                admin: 'bg-green-600',
                customer: 'bg-blue-600',
                cashier: 'bg-yellow-600',
                chef: 'bg-red-600',
                courier: 'bg-orange-600',
            };

            if (!Array.isArray(roles) || roles.length === 0) return <Badge className="bg-gray-500 shadow-none">-</Badge>;
            return (
                <div className="flex gap-1">
                    {roles.map((role) => (
                        <Badge key={role} className={`${roleColors[role] || 'bg-gray-500'} shadow-none`}>
                            {role}
                        </Badge>
                    ))}
                </div>
            );
        },
        filterFn: (row, columnId, filterValue) => {
            const roles = row.getValue(columnId);
            return Array.isArray(roles) ? roles.some((role) => filterValue.includes(role)) : false;
        },
        enableHiding: false,
    },

    {
        id: 'created_at',
        accessorKey: 'created_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mendaftar Pada" />,
        cell: ({ row }) => <span className="max-w-36">{formatDate(row.getValue('created_at'))}</span>,
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'actions',
        accessorKey: 'actions',
        header: () => <span className="text-md font-medium text-gray-900 dark:text-gray-200">Aksi</span>,
        cell: ({ row }) => <DataTableRowActions row={row as Row<User>} />,
        enableHiding: false,
    },
];
