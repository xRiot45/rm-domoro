import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
    const handleCanceledOrder = (transactionId: number) => {
        // router.delete(route('admin.roles.destroy', { id: roleId }), {
        //     onSuccess: () => {
        //         toast.success('Success', {
        //             description: 'Role Berhasil Dihapus!',
        //             action: {
        //                 label: 'Tutup',
        //                 onClick: () => toast.dismiss(),
        //             },
        //         });
        //     },
        //     onError: (errors) => {
        //         toast.error('Failed', {
        //             description: errors.message || 'Role Gagal Dihapus!',
        //             action: {
        //                 label: 'Tutup',
        //                 onClick: () => toast.dismiss(),
        //             },
        //         });
        //     },
        // });
        console.log(transactionId);
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
                                    Hapus
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
