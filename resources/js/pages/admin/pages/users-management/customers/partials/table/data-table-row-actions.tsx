import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Customer } from '@/models/customer';
import { Icon } from '@iconify/react';
import { Link } from '@inertiajs/react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';

export function DataTableRowActions({ row }: { row: Row<Customer> }) {
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
                    <Link href={route('admin.customers.edit', { id: row.original.id })} className="cursor-po">
                        <DropdownMenuItem className="cursor-pointer">
                            Edit Data
                            <DropdownMenuShortcut>
                                <Icon icon={'material-symbols:edit'} />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <Dialog>
                        <DialogTrigger className="w-full">
                            <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                                Lihat Data
                                <DropdownMenuShortcut>
                                    <Icon icon={'material-symbols:visibility'} />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Data Pelanggan</DialogTitle>
                            </DialogHeader>
                            <CustomerData data={row.original} />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="secondary" className="cursor-pointer">
                                        Tutup
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

function CustomerData({ data }: { data: Customer }) {
    return (
        <>
            <div>
                <Separator className="mb-4" />

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Nama Lengkap</h1>
                        <h2 className="capitalize">: {data?.user?.full_name}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Email</h1>
                        <h2 className="capitalize">: {data?.user?.email}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Nomor Telepon</h1>
                        <h2 className="capitalize">: {data?.user?.phone_number}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Tempat Lahir</h1>
                        <h2 className="capitalize">: {data?.birthplace}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Tanggal Lahir</h1>
                        <h2 className="capitalize">: {data?.birthdate ? new Date(data.birthdate).toLocaleDateString('id-ID') : '-'}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Alamat Lengkap</h1>
                        <h2 className="capitalize">: {data?.address ? data?.address : '-'}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Label Alamat</h1>
                        <h2 className="capitalize">: {data?.address_label ? data?.address_label : '-'}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Catatan Untuk Kurir (Optional)</h1>
                        <h2 className="capitalize">: {data?.note ? data?.note : '-'}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Jenis Kelamin</h1>
                        <h2 className="capitalize">: {data?.gender ? data?.gender : '-'}</h2>
                    </div>
                </div>
            </div>
        </>
    );
}
