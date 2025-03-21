import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin/layout';
import { cn } from '@/lib/utils';
import { Permission, PermissionForm } from '@/models/permission';
import { BreadcrumbItem } from '@/types';
import { Icon } from '@iconify/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Master Data',
        href: '#',
    },
    {
        title: 'Permissions / Izin',
        href: '/admin/manajemen-kontrol-akses/permissions',
    },
    {
        title: 'Edit Permission / Izin',
        href: '/admin/manajemen-kontrol-akses/permissions/edit',
    },
];

export default function EditPage({ permission }: { permission: Permission }) {
    const { data, setData, put, processing, errors, reset } = useForm<Required<PermissionForm>>({
        name: permission?.name,
    });

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        put(route('admin.permissions.update', { id: permission?.id }), {
            onSuccess: () => {
                reset('name');
                toast.success('Success', {
                    description: 'Permission / Izin Berhasil Diedit!',
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
                <Label htmlFor="name">Nama Role</Label>
                <Input
                    id="name"
                    type="text"
                    autoFocus
                    tabIndex={1}
                    autoComplete="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Masukkan nama role"
                    className={cn('mt-2', errors.name && 'border border-red-500')}
                />
                <InputError message={errors.name} className="mt-2" />

                <div className="mt-4 flex justify-end space-x-3">
                    <Link href={route('admin.roles.index')}>
                        <Button variant="destructive" className="cursor-pointer">
                            Batalkan <Icon icon="iconoir:cancel" />
                        </Button>
                    </Link>
                    <Button type="submit" tabIndex={4} disabled={processing} className="cursor-pointer">
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Edit Data <Icon icon="heroicons:check" />
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
