import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmployeeStatusEnum } from '@/enums/employee-status';
import { ShiftEnum } from '@/enums/shift';
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
                    placeholder="Cari nama koki..."
                    value={(table.getColumn('full_name')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('full_name')?.setFilterValue(event.target.value)}
                    className="h-8 w-full sm:w-[150px] lg:w-[250px]"
                />

                <Input
                    placeholder="Cari email koki..."
                    value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
                    className="h-8 w-full sm:w-[150px] lg:w-[250px]"
                />

                <Input
                    placeholder="Cari nomor telepon koki..."
                    value={(table.getColumn('phone_number')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('phone_number')?.setFilterValue(event.target.value)}
                    className="h-8 w-full sm:w-[150px] lg:w-[250px]"
                />

                <div className="flex gap-x-2">
                    {table.getColumn('shift') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('shift')}
                            title="Cari berdasarkan shift"
                            options={Object.values(ShiftEnum).map((status) => ({
                                label: status,
                                value: status,
                            }))}
                        />
                    )}
                </div>

                <div className="flex gap-x-2">
                    {table.getColumn('status') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('status')}
                            title="Cari berdasarkan status"
                            options={Object.values(EmployeeStatusEnum).map((status) => ({
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
