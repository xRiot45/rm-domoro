import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin/layout';
import { cn } from '@/lib/utils';
import { Role, RoleForm } from '@/models/role';
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
        title: 'Edit Role / Peran',
        href: '/admin/manajemen-kontrol-akses/roles/edit',
    },
];

export default function EditPage({ role }: { role: Role }) {
    const { data, setData, put, processing, errors, reset } = useForm<Required<RoleForm>>({
        name: role?.name,
    });

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        put(route('admin.roles.update', { id: role?.id }), {
            onSuccess: () => {
                reset('name');
                toast.success('Success', {
                    description: 'Role Berhasil Diedit!',
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
