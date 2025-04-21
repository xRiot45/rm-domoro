import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin/layout';
import { cn } from '@/lib/utils';
import { MenuCategoryForm } from '@/models/menu-categories';
import { BreadcrumbItem } from '@/types';
import { Icon } from '@iconify/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Menu',
        href: '#',
    },
    {
        title: 'Kategori Menu',
        href: '/admin/menu-management/menu-categories',
    },
    {
        title: 'Tambah Kategori Menu',
        href: '/admin/menu-management/menu-categories/create',
    },
];

export default function CreatePage() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<MenuCategoryForm>>({
        name: '',
    });

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        post(route('admin.menu-categories.store'), {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Kategori Menu Berhasil Ditambahkan!',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
                reset();
            },
            onError: (errors) => {
                toast.error('Failed', {
                    description: errors.message || 'Gagal Menambahkan Kategori Menu',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kategori Menu" />
            <form onSubmit={handleSubmit} className="p-4">
                <Label htmlFor="name">Nama Kategori Menu</Label>
                <Input
                    id="name"
                    type="text"
                    autoFocus
                    tabIndex={1}
                    autoComplete="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Masukkan nama kategori menu"
                    className={cn('mt-2', errors.name && 'border border-red-500')}
                />
                <InputError message={errors.name} className="mt-2" />

                <div className="mt-4 flex justify-end space-x-3">
                    <Link href={route('admin.menu-categories.index')} className="cursor-pointer">
                        <Button variant="destructive">
                            Batalkan <Icon icon="iconoir:cancel" />
                        </Button>
                    </Link>
                    <Button type="submit" tabIndex={4} disabled={processing} className="cursor-pointer">
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Tambah Data <Icon icon="heroicons:plus" />
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
