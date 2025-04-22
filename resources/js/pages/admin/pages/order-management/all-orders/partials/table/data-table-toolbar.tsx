import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OrderStatusEnum } from '@/enums/order-status';
import { OrderTypeEnum } from '@/enums/order-type';
import { PaymentStatusEnum } from '@/enums/payment-status';
import { PaymentTypeEnum } from '@/enums/payment-type';
import { DataTableToolbarProps } from '@/types/tanstack';
import { Icon } from '@iconify/react';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
                <Input
                    placeholder="Cari nomor pesanan..."
                    value={(table.getColumn('order_number')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('order_number')?.setFilterValue(event.target.value)}
                    className="h-8 w-[200px] lg:w-[300px]"
                />

                {table.getColumn('order_type') && (
                    <DataTableFacetedFilter
                        column={table.getColumn('order_type')}
                        title="Metode Pemesanan"
                        options={Object.values(OrderTypeEnum).map((status) => ({
                            label: status,
                            value: status,
                        }))}
                    />
                )}

                {table.getColumn('payment_method') && (
                    <DataTableFacetedFilter
                        column={table.getColumn('payment_method')}
                        title="Metode Pembayaran"
                        options={Object.values(PaymentTypeEnum).map((status) => ({
                            label: status,
                            value: status,
                        }))}
                    />
                )}

                {table.getColumn('payment_status') && (
                    <DataTableFacetedFilter
                        column={table.getColumn('payment_status')}
                        title="Status Pembayaran"
                        options={Object.values(PaymentStatusEnum).map((status) => ({
                            label: status,
                            value: status,
                        }))}
                    />
                )}

                {table.getColumn('latest_order_status') && (
                    <DataTableFacetedFilter
                        column={table.getColumn('latest_order_status')}
                        title="Status Pesanan"
                        options={Object.values(OrderStatusEnum).map((status) => ({
                            label: status,
                            value: status,
                        }))}
                    />
                )}

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
