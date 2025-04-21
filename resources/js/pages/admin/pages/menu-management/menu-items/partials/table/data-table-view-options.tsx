import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { DataTableViewOptionsProps } from '@/types/tanstack';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { Column, Header } from '@tanstack/react-table';
import React from 'react';

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
    const getColumnTitle = (column: Column<TData>): string => {
        const { header } = column.columnDef;
        if (typeof header === 'string') {
            return header;
        }

        if (typeof header === 'function') {
            const renderedHeader = header({
                column,
                header: {} as Header<TData, unknown>,
                table,
            });

            if (React.isValidElement(renderedHeader)) {
                return (renderedHeader.props as { title?: string }).title || column.id;
            }
        }

        return column.id;
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
                    <MixerHorizontalIcon className="mr-2 h-4 w-4" />
                    Tampilkan Kolom
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[250px]">
                <DropdownMenuSeparator />
                {table
                    .getAllColumns()
                    .filter((column: Column<TData>) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                    .map((column: Column<TData>) => {
                        const columnTitle = getColumnTitle(column);
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            >
                                {columnTitle}
                            </DropdownMenuCheckboxItem>
                        );
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
