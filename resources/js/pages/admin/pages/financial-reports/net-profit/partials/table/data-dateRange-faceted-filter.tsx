import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover } from '@/components/ui/popover';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Column } from '@tanstack/react-table';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DateRangeFacetedFilterProps<TData, TValue> {
    column: Column<TData, TValue>;
    title?: string;
}

export function DateRangeFacetedFilter<TData, TValue>({ column, title = 'Tanggal' }: DateRangeFacetedFilterProps<TData, TValue>) {
    const selectedDate = column.getFilterValue() as { from: Date | undefined; to: Date | undefined } | undefined;
    const [date, setDate] = useState<typeof selectedDate>(selectedDate || { from: undefined, to: undefined });

    useEffect(() => {
        setDate(selectedDate || { from: undefined, to: undefined });
    }, [selectedDate]);

    return (
        <Popover>
            <PopoverTrigger>
                <Button variant="outline" className="w-[350px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                        date.to ? (
                            <>
                                {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                            </>
                        ) : (
                            format(date.from, 'LLL dd, y')
                        )
                    ) : (
                        <span>{title}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="z-50 mt-4 w-full rounded-md border bg-white p-0 shadow-lg" align="start">
                <Calendar
                    mode="range"
                    selected={date}
                    onSelect={(range) => {
                        setDate(range as typeof date);
                        column.setFilterValue(range);
                    }}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    );
}
