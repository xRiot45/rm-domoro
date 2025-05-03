import { Button } from '@/components/ui/button';
import { DataTableToolbarProps } from '@/types/tanstack';
import { Icon } from '@iconify/react';
import { DateRangeFacetedFilter } from './data-dateRange-faceted-filter';
import { ExpenseRangeFilter } from './data-expense-filter';
import { NetProfitRangeFilter } from './data-netProfit-filter';
import { RevenueRangeFilter } from './data-revenue-filter';

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
                {table.getColumn('date') && <DateRangeFacetedFilter column={table.getColumn('date')} title="Rentang Tanggal Laporan" />}

                {table.getColumn('revenue') && <RevenueRangeFilter column={table.getColumn('revenue')} title="Total Pendapatan" />}

                {table.getColumn('expense') && <ExpenseRangeFilter column={table.getColumn('expense')} title="Total Pengeluaran" />}

                {table.getColumn('net_profit') && <NetProfitRangeFilter column={table.getColumn('net_profit')} title="Total Laba Bersih" />}

                {isFiltered && (
                    <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 cursor-pointer px-2 lg:px-3">
                        Reset
                        <Icon icon={'material-symbols:close'} className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
