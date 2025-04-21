import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableToolbarProps } from '@/types/tanstack';
import { Icon } from '@iconify/react';
import { DataTableViewOptions } from './data-table-view-options';

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="items-center justify-between lg:flex">
            <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                <Input
                    placeholder="Cari jenis biaya..."
                    value={(table.getColumn('type')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('type')?.setFilterValue(event.target.value)}
                    className="h-8 w-full sm:w-[150px] lg:w-[250px]"
                />

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
