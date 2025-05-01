import { Button } from '@/components/ui/button';
import { DataTableToolbarProps } from '@/types/tanstack';
import { Icon } from '@iconify/react';
import { DateRangeFacetedFilter } from './data-dateRange-faceted-filter';
import { RevenueRangeFilter } from './data-revenue-filter';
import { TransactionRangeFilter } from './data-transaction-filter';

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
                {table.getColumn('report_date') && <DateRangeFacetedFilter column={table.getColumn('report_date')} title="Rentang Tanggal Laporan" />}

                {table.getColumn('total_transactions') && (
                    <TransactionRangeFilter column={table.getColumn('total_transactions')} title="Total Transaksi" />
                )}

                {table.getColumn('total_revenue') && <RevenueRangeFilter column={table.getColumn('total_revenue')} title="Total Pendapatan" />}

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
