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
import { EmployeeStatusEnum } from '@/enums/employee-status';
import { Chef } from '@/models/chef';
import { formatCurrency } from '@/utils/format-currency';
import { Icon } from '@iconify/react';
import { Link, router } from '@inertiajs/react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { toast } from 'sonner';

export function DataTableRowActions({ row }: { row: Row<Chef> }) {
    const handleDelete = (chefId: number) => {
        router.delete(route('admin.chefs.destroy', { id: chefId }), {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Data Berhasil Dihapus!',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
            onError: (error) => {
                toast.error('Error', {
                    description: error.message || 'Data Gagal Dihapus!',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
        });
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
                    <Link href={route('admin.chefs.edit', { id: row.original.id })} className="cursor-pointer">
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
                                <DialogTitle>Data Karyawan Koki</DialogTitle>
                            </DialogHeader>
                            <ChefData data={row.original} />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="secondary" className="cursor-pointer">
                                        Tutup
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    {row.original.stopped_at && row.original.status === EmployeeStatusEnum.LEAVE ? (
                        <>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="cursor-pointer !text-red-500" onSelect={(e) => e.preventDefault()}>
                                        Hapus Data
                                        <DropdownMenuShortcut>
                                            <Icon icon={'material-symbols:delete'} className="!text-red-500" />
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Hapus Data</AlertDialogTitle>
                                        <AlertDialogDescription>Apakah Kamu Yakin Ingin Menghapus Data ini?</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleDelete(row.original.id)}
                                            className="cursor-pointer bg-red-600 transition-all"
                                        >
                                            Hapus Karyawan Koki
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    ) : null}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

function ChefData({ data }: { data: Chef }) {
    return (
        <>
            <div>
                <Separator className="mb-4" />

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Nama Lengkap</h1>
                        <h2>: {data?.user?.full_name}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Email</h1>
                        <h2>: {data?.user?.email}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Nomor Telepon</h1>
                        <h2>: {data?.user?.phone_number}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Tanggal Masuk Kerja</h1>
                        <h2>: {data?.hired_at ? new Date(data.hired_at).toLocaleDateString('id-ID') : 'Unknown'}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Tanggal Berhenti Kerja</h1>
                        <h2>: {data?.stopped_at ? new Date(data.stopped_at).toLocaleDateString('id-ID') : '-'}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Gaji</h1>
                        <h2>: {formatCurrency(data?.salary)}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Jenis Kelamin</h1>
                        <h2 className="capitalize">: {data?.gender}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Shift Kerja</h1>
                        <h2 className="capitalize">: {data?.shift}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Status Karyawan</h1>
                        <h2 className={`font-semibold capitalize ${data?.status === EmployeeStatusEnum.WORK ? 'text-green-500' : 'text-red-500'}`}>
                            : {data?.status}
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <h1 className="font-medium">Tipe Pekerjaan</h1>
                        <h2 className="capitalize">: {data?.job_type}</h2>
                    </div>
                </div>
            </div>
        </>
    );
}
