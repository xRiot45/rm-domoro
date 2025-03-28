import { Badge } from '@/components/ui/badge';
import { Customer } from '@/models/customer';
import { Icon } from '@iconify/react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Customer>[] = [
    {
        id: 'no',
        accessorKey: 'no',
        header: () => <span className="text-md font-medium text-gray-900 dark:text-gray-200">No</span>,
        cell: ({ row }) => <span>{row.index + 1}</span>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: 'full_name',
        accessorKey: 'user.full_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Lengkap" />,
        cell: ({ row }) => <span>{row.original.user.full_name}</span>,
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'email',
        accessorKey: 'user.email',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
        cell: ({ row }) => <span>{row.original.user.email}</span>,
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'phone_number',
        accessorKey: 'user.phone_number',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nomor Telepon" />,
        cell: ({ row }) => <span>{row.original.user.phone_number}</span>,
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'birthplace',
        accessorKey: 'birthplace',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tempat Lahir" />,
        cell: ({ row }) => <span>{row.original.birthplace ? row.original.birthplace : '-'}</span>,
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'birthdate',
        accessorKey: 'birthdate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal Lahir" />,
        cell: ({ row }) => {
            const birthdate = row.original.birthdate;
            const date = birthdate ? new Date(birthdate) : new Date();
            return <span>{date ? date.toLocaleDateString() : '-'}</span>;
        },
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'gender',
        accessorKey: 'gender',
        accessorFn: (row) => row.gender || '-',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Jenis Kelamin" />,
        cell: ({ row }) => {
            const gender = row.original.gender || '-';
            return (
                <Badge
                    className={
                        gender === 'laki-laki'
                            ? 'bg-blue-500 text-white'
                            : gender === 'perempuan'
                              ? 'bg-pink-500 text-white'
                              : 'bg-transparent text-black dark:text-white'
                    }
                >
                    {gender === 'laki-laki' ? (
                        <Icon icon={'mdi:gender-male'} className="mr-1 h-4 w-4" />
                    ) : gender === 'perempuan' ? (
                        <Icon icon={'mdi:gender-female'} className="mr-1 h-4 w-4" />
                    ) : null}
                    <span className="capitalize">{gender}</span>
                </Badge>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'actions',
        accessorKey: 'actions',
        header: () => <span className="text-md font-medium text-gray-900 dark:text-gray-200">Aksi</span>,
        cell: ({ row }) => <DataTableRowActions row={row as Row<Customer>} />,
        enableHiding: false,
    },
];
