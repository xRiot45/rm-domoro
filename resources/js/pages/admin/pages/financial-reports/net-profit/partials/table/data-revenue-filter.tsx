import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatCurrency } from '@/utils/format-currency';
import { Icon } from '@iconify/react';
import { Column } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

interface RevenueRangeFilterProps<TData, TValue> {
    column: Column<TData, TValue>;
    title?: string;
}

export function RevenueRangeFilter<TData, TValue>({ column, title = 'Tanggal' }: RevenueRangeFilterProps<TData, TValue>) {
    const selectedValue = column.getFilterValue() as { min?: number; max?: number } | undefined;
    const [range, setRange] = useState<typeof selectedValue>(selectedValue || { min: undefined, max: undefined });

    useEffect(() => {
        setRange(selectedValue || { min: undefined, max: undefined });
    }, [selectedValue]);

    const applyFilter = () => {
        column.setFilterValue(range);
    };

    return (
        <Popover>
            <PopoverTrigger>
                <Button variant="outline" className="w-[350px] justify-start text-left font-normal">
                    <Icon icon="majesticons:money-line" className="mr-2 h-4 w-4" />
                    {range?.min || range?.max ? `Pendapatan: ${formatCurrency(range?.min ?? 0)} - ${formatCurrency(range?.max ?? 0)}` : title}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="z-50 mt-3 w-[350px] space-y-3">
                <div className="flex flex-col space-y-2">
                    <Label className="text-sm font-medium">Min</Label>
                    <Input
                        type="number"
                        placeholder="Minimal pendapatan"
                        value={range?.min ?? ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            setRange((prev) => ({
                                ...prev,
                                min: value === '' ? undefined : parseInt(value),
                            }));
                        }}
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Max</label>
                    <Input
                        type="number"
                        placeholder="Maksimal pendapatan"
                        value={range?.max ?? ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            setRange((prev) => ({
                                ...prev,
                                max: value === '' ? undefined : parseInt(value),
                            }));
                        }}
                    />
                </div>
                <div className="flex justify-end">
                    <Button size="sm" onClick={applyFilter}>
                        Terapkan
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
