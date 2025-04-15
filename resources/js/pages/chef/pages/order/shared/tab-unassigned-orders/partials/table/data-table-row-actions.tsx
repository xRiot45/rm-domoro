import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Transaction } from '@/models/transaction';
import { Icon } from '@iconify/react';
import { Link } from '@inertiajs/react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';

export function DataTableRowActions({ row }: { row: Row<Transaction> }) {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <Link href={route('cashier.order.edit', { id: row.original.id })} className="cursor-po">
                        <DropdownMenuItem className="cursor-pointer">
                            Edit Data Order
                            <DropdownMenuShortcut>
                                <Icon icon={'material-symbols:edit'} />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                        Print Invoice
                        <DropdownMenuShortcut>
                            <Icon icon={'iconamoon:invoice'} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
