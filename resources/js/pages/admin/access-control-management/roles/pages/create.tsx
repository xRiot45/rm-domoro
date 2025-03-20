import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin/layout';
import { cn } from '@/lib/utils';
import { RoleForm } from '@/models/role';
import { BreadcrumbItem } from '@/types';
import { Icon } from '@iconify/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Kontrol Akses',
        href: '#',
    },
    {
        title: 'Roles / Peran',
        href: '/admin/manajemen-kontrol-akses/roles',
    },
    {
        title: 'Tambah Role / Peran',
        href: '/admin/manajemen-kontrol-akses/roles/create',
    },
];

export default function CreatePage() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RoleForm>>({
        name: '',
    });

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        post(route('admin.roles.store'), {
            onSuccess: () => {
                reset('name');
                toast('Success', {
                    description: 'Role Berhasil Ditambahkan!',
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
            <Head title="Tambah Role" />
            <form onSubmit={submit} className="p-4">
                <Label htmlFor="name">Nama Role / Peran</Label>
                <Input
                    id="name"
                    type="text"
                    autoFocus
                    tabIndex={1}
                    autoComplete="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Masukkan nama role / peran"
                    className={cn('mt-2', errors.name && 'border border-red-500')}
                />
                <InputError message={errors.name} className="mt-2" />

                <div className="mt-4 flex justify-end space-x-3">
                    <Link href={route('admin.roles.index')} className="cursor-pointer">
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
