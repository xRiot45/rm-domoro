import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { Link, router } from '@inertiajs/react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { useState } from 'react';
import { toast } from 'sonner';

export function DataTableRowActions({ row }: { row: Row<Transaction> }) {
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [isOrderSent, setIsOrderSent] = useState(!!row?.original?.order_sent_to_chef_at);

    const handleSendOrderToChef = () => {
        router.put(
            route('cashier.order.sendOrderToChef', { id: row.original.id }),
            {},
            {
                onSuccess: () => {
                    toast.success('Success', {
                        description: 'Order berhasil dikirim ke Chef',
                        action: {
                            label: 'Tutup',
                            onClick: () => toast.dismiss(),
                        },
                    });

                    setIsOrderSent(true);
                    router.reload({ only: ['unassignedOrders', 'myOrders'] });
                },
                onError: () => {
                    toast.error('Error', {
                        description: 'Gagal mengirim order ke Chef',
                        action: {
                            label: 'Tutup',
                            onClick: () => toast.dismiss(),
                        },
                    });
                },
            },
        );
    };

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
                    {!isOrderSent && (
                        <>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => setShowDialog(true)}>
                                Kirim ke Chef
                                <DropdownMenuShortcut>
                                    <Icon icon={'material-symbols:send'} />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    <Link href={route('cashier.order.showInvoiceCashier', { id: row.original.id })}>
                        <DropdownMenuItem className="cursor-pointer">
                            Lihat Invoice
                            <DropdownMenuShortcut>
                                <Icon icon={'iconamoon:invoice'} />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Kirim Pesanan Ke Chef!</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-sm">Pastikan data pesanan sudah benar sebelum mengirim ke Chef</DialogDescription>
                    <DialogFooter className="mt-4">
                        <Button
                            onClick={() => {
                                handleSendOrderToChef();
                                setShowDialog(false);
                            }}
                        >
                            Saya Mengerti & Kirim Pesanan Ke Chef
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
