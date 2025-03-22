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
import { Input } from '@/components/ui/input';
import { UserDeleteForm } from '@/models/user';
import { User } from '@/types';
import { Icon } from '@iconify/react';
import { Link, router, useForm } from '@inertiajs/react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

export function DataTableRowActions({ row }: { row: Row<User> }) {
    const { data, setData, processing, reset } = useForm<Required<UserDeleteForm>>({
        password: '',
    });

    const handleDelete = (userId: number) => {
        router.delete(route('admin.all-users.destroy', { id: userId }), {
            data: { password: data.password },
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Pengguna Berhasil Dihapus!',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
                reset();
            },
            onError: (error) => {
                reset();
                toast.error('Error', {
                    description: error.message || 'Pengguna Gagal Dihapus!',
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
                    <Link href={route('admin.all-users.edit', { id: row.original.id })} className="cursor-po">
                        <DropdownMenuItem className="cursor-pointer">
                            Edit Data
                            <DropdownMenuShortcut>
                                <Icon icon={'material-symbols:edit'} />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
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
                            <Input
                                type="password"
                                placeholder="Password"
                                value={data?.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(row.original.id)} className="cursor-pointer bg-red-600 transition-all">
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Hapus Pengguna
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
