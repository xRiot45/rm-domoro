import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { OrderStatusEnum } from '@/enums/order-status';
import { Transaction } from '@/models/transaction';
import { Icon } from '@iconify/react';
import { Link, router } from '@inertiajs/react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { toast } from 'sonner';

export function DataTableRowActions({ row }: { row: Row<Transaction> }) {
    const latestStatusOrder = row?.original?.order_status[row?.original?.order_status.length - 1];
    const orderIsCancelled = latestStatusOrder?.status === OrderStatusEnum.CANCELLED;

    const handleCanceledOrder = (transactionId: number) => {
        router.put(
            route('admin.all-orders.cancelledOrder', { id: transactionId }),
            {},
            {
                onSuccess: () => {
                    toast.success('Success', {
                        description: 'Order Berhasil Dibatalkan!',
                        action: {
                            label: 'Tutup',
                            onClick: () => toast.dismiss(),
                        },
                    });
                },
                onError: (errors) => {
                    toast.error('Failed', {
                        description: errors.message || 'Order Gagal Dibatalkan!',
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
                <DropdownMenuContent align="end" className="w-[200px]">
                    <Link href={route('admin.all-orders.orderDetails', { id: row.original.id })} className="cursor-pointer">
                        <DropdownMenuItem className="cursor-pointer">
                            Lihat Detail Pesanan
                            <DropdownMenuShortcut>
                                <Icon icon={'material-symbols:visibility'} />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                    {/* {!orderIsCancelled && (
                        <>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="cursor-pointer !text-red-500" onSelect={(e) => e.preventDefault()}>
                                        Batalkan Pesanan
                                        <DropdownMenuShortcut>
                                            <Icon icon={'material-symbols:delete'} className="!text-red-500" />
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Hapus Data</AlertDialogTitle>
                                        <AlertDialogDescription>Apakah Kamu Yakin Ingin Membatalkan Data ini?</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleCanceledOrder(row.original.id)}
                                            className="cursor-pointer bg-red-600 transition-all"
                                        >
                                            Batalkan Pesanan
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    )} */}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
