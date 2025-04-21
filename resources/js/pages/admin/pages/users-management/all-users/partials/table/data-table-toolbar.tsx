import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Role } from '@/models/role';
import { DataTableToolbarProps } from '@/types/tanstack';
import { Icon } from '@iconify/react';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const { roles }: { roles: Role[] } = usePage<{ roles: Role[] }>().props;
    const isFiltered = table.getState().columnFilters.length > 0;
    const isAllSelected = table.getIsAllPageRowsSelected();

    const [open, setOpen] = useState<boolean>(false);

    const handleDeleteAll = () => {
        router.delete(route('admin.roles.destroy_all'), {
            onSuccess: () => {
                toast('Success', {
                    description: 'Semua Data Berhasil Dihapus!',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
        });
    };

    return (
        <div className="items-center justify-between lg:flex">
            <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                <Input
                    placeholder="Cari nama user..."
                    value={(table.getColumn('full_name')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('full_name')?.setFilterValue(event.target.value)}
                    className="h-8 w-full sm:w-[150px] lg:w-[250px]"
                />

                <Input
                    placeholder="Cari email user..."
                    value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
                    className="h-8 w-full sm:w-[150px] lg:w-[250px]"
                />

                <Input
                    placeholder="Cari nomor telepon user..."
                    value={(table.getColumn('phone_number')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('phone_number')?.setFilterValue(event.target.value)}
                    className="h-8 w-full sm:w-[150px] lg:w-[250px]"
                />

                <div className="flex gap-x-2">
                    {table.getColumn('roles') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('roles')}
                            title="Cari berdasarkan role"
                            options={roles.map((role) => ({
                                label: role.name,
                                value: role.name,
                            }))}
                        />
                    )}
                </div>

                {isFiltered && (
                    <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 cursor-pointer px-2 lg:px-3">
                        Reset
                        <Icon icon={'material-symbols:close'} className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex justify-between gap-2">
                <DataTableViewOptions table={table} />

                {isAllSelected && (
                    <div>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(true)}
                            className="h-8 cursor-pointer border border-red-500 px-2 text-red-500 hover:bg-transparent lg:px-3"
                        >
                            Hapus semua data
                            <Icon icon={'material-symbols:delete'} className="h-4 w-4" />
                        </Button>
                        <AlertDialog open={open} onOpenChange={setOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Hapus Data</AlertDialogTitle>
                                    <AlertDialogDescription>Apakah Kamu Yakin Ingin Menghapus Semua Data?</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
                                    <AlertDialogAction className="cursor-pointer bg-red-600 transition-all" onClick={handleDeleteAll}>
                                        Hapus
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </div>
        </div>
    );
}
