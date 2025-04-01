import { Badge } from '@/components/ui/badge';
import { EmployeeStatusEnum } from '@/enums/employee-status';
import { ShiftEnum } from '@/enums/shift';
import { Courier } from '@/models/courier';
import { ColumnDef, Row } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Courier>[] = [
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
        id: 'hired_at',
        accessorKey: 'hired_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal Masuk Kerja" />,
        cell: ({ row }) => {
            const hiredAt = row.original.hired_at;
            const date = hiredAt ? new Date(hiredAt) : new Date();
            return <span>{date ? date.toLocaleDateString() : '-'}</span>;
        },
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'stopped_at',
        accessorKey: 'stopped_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal Berhenti Kerja" />,
        cell: ({ row }) => {
            const hiredAt = row.original.stopped_at;
            const date = hiredAt ? new Date(hiredAt) : null;
            return <span>{date ? date.toLocaleDateString() : '-'}</span>;
        },
        enableHiding: true,
        enableSorting: true,
    },
    {
        id: 'shift',
        accessorKey: 'shift',
        accessorFn: (row) => row.shift,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Shift Kerja" />,
        cell: ({ row }) => {
            const shift = row.original.shift;
            const colorShift = shift === ShiftEnum.MORNING ? 'bg-green-500' : shift === ShiftEnum.EVENING ? 'bg-yellow-500' : 'bg-red-500';
            return (
                <Badge className={`font-medium ${colorShift} text-white`}>
                    {shift === ShiftEnum.MORNING ? 'Pagi' : shift === ShiftEnum.EVENING ? 'Sore' : 'Malam'}
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
        id: 'status',
        accessorKey: 'status',
        accessorFn: (row) => row.status,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status Karyawan" />,
        cell: ({ row }) => {
            const status = row.original.status;
            const colorStatus =
                status === EmployeeStatusEnum.WORK ? 'bg-green-500' : status === EmployeeStatusEnum.LEAVE ? 'bg-red-500' : 'bg-gray-500';
            return (
                <Badge className={`font-medium ${colorStatus} text-white`}>
                    {status === EmployeeStatusEnum.WORK ? 'Bekerja' : status === EmployeeStatusEnum.LEAVE ? 'Berhenti' : '-'}
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
        cell: ({ row }) => <DataTableRowActions row={row as Row<Courier>} />,
        enableHiding: false,
    },
];
