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
import { MenuCategory } from '@/models/menu-categories';
import { MenuItemStatusEnum } from '@/models/menu-items';
import { DataTableToolbarProps } from '@/types/tanstack';
import { Icon } from '@iconify/react';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const { menuCategories } = usePage<{ menuCategories: MenuCategory[] }>().props;
    const isFiltered = table.getState().columnFilters.length > 0;
    const isAllSelected = table.getIsAllPageRowsSelected();

    const [open, setOpen] = useState<boolean>(false);

    const handleDeleteAll = () => {
        router.delete(route('admin.menu-items.destroy_all'), {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Semua Data Berhasil Dihapus!',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
            onError: (errors) => {
                toast.error('Failed', {
                    description: errors.message || 'Gagal Menghapus Semua Data',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
        });
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
                <Input
                    placeholder="Cari nama menu..."
                    value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
                    className="h-8 w-[200px] lg:w-[300px]"
                />

                <div className="flex gap-x-2">
                    {table.getColumn('menu_category') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('menu_category')}
                            title="Cari berdasarkan kategori"
                            options={menuCategories.map((item) => ({
                                label: item.name,
                                value: item.name,
                            }))}
                        />
                    )}
                </div>

                <div className="flex gap-x-2">
                    {table.getColumn('status') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('status')}
                            title="Cari berdasarkan status"
                            options={Object.values(MenuItemStatusEnum).map((status) => ({
                                label: status,
                                value: status,
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
