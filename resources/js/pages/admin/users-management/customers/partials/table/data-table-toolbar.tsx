import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GenderEnum } from '@/enums/gender';
import { DataTableToolbarProps } from '@/types/tanstack';
import { Icon } from '@iconify/react';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="items-center justify-between lg:flex">
            <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                <Input
                    placeholder="Cari nama pelanggan..."
                    value={(table.getColumn('full_name')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('full_name')?.setFilterValue(event.target.value)}
                    className="h-8 w-full sm:w-[150px] lg:w-[250px]"
                />

                <Input
                    placeholder="Cari email pelanggan..."
                    value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
                    className="h-8 w-full sm:w-[150px] lg:w-[250px]"
                />

                <Input
                    placeholder="Cari nomor telepon pelanggan..."
                    value={(table.getColumn('phone_number')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('phone_number')?.setFilterValue(event.target.value)}
                    className="h-8 w-full sm:w-[150px] lg:w-[250px]"
                />

                <div className="flex gap-x-2">
                    {table.getColumn('gender') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('gender')}
                            title="Cari berdasarkan jenis kelamin"
                            options={Object.values(GenderEnum).map((status) => ({
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
            </div>
        </div>
    );
}
