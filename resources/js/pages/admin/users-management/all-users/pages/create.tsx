import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin/layout';
import { cn } from '@/lib/utils';
import { Role } from '@/models/role';
import { UserForm } from '@/models/user';
import { BreadcrumbItem } from '@/types';
import { Icon } from '@iconify/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Pengguna',
        href: '#',
    },
    {
        title: 'Semua Pengguna',
        href: '/admin/users-management/all-users',
    },
    {
        title: 'Tambah Penguna',
        href: '/admin/users-management/all-users/create',
    },
];

export default function CreatePage() {
    const { roles }: { roles: Role[] } = usePage<{ roles: Role[] }>().props;
    const { data, setData, post, processing, errors, reset } = useForm<Required<UserForm>>({
        full_name: '',
        email: '',
        phone_number: '',
        password: '',
        password_confirmation: '',
        roles: [],
    });

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        post(route('admin.all-users.store'), {
            onSuccess: () => {
                reset('full_name');
                reset('email');
                reset('phone_number');
                reset('password');
                reset('password_confirmation');
                reset('roles');
                toast.success('Success', {
                    description: 'Pengguna Berhasil Ditambahkan!',
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
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Tambah Pengguna" />
                <form onSubmit={handleSubmit} className="space-y-4 p-4">
                    <div id="full_name">
                        <Label htmlFor="full_name">Nama Lengkap</Label>
                        <Input
                            id="full_name"
                            type="text"
                            autoFocus
                            tabIndex={1}
                            autoComplete="full_name"
                            value={data.full_name}
                            onChange={(e) => setData('full_name', e.target.value)}
                            placeholder="Masukkan nama lengkap pengguna"
                            className={cn('mt-2', errors.full_name && 'border border-red-500')}
                        />
                        <InputError message={errors.full_name} className="mt-2" />
                    </div>

                    <div id="email">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Masukkan email pengguna"
                            className={cn('mt-2', errors.email && 'border border-red-500')}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div id="phone_number">
                        <Label htmlFor="phone_number">Nomor Telepon</Label>
                        <Input
                            id="phone_number"
                            type="number"
                            tabIndex={3}
                            autoComplete="phone_number"
                            value={data.phone_number}
                            onChange={(e) => setData('phone_number', e.target.value)}
                            placeholder="Masukkan nomor telepon pengguna"
                            className={cn('mt-2', errors.phone_number && 'border border-red-500')}
                        />
                        <InputError message={errors.phone_number} className="mt-2" />
                    </div>

                    <div className="grid gap-3 lg:grid-cols-2">
                        <div id="password">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                tabIndex={4}
                                autoComplete="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Masukkan password pengguna"
                                className={cn('mt-2', errors.password && 'border border-red-500')}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div id="password_confirmation">
                            <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                tabIndex={5}
                                autoComplete="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Masukkan konfirmasi password pengguna"
                                className={cn('mt-2', errors.password_confirmation && 'border border-red-500')}
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>
                    </div>

                    <div id="roles">
                        <Label htmlFor="roles">Role / Peran</Label>
                        <Select onValueChange={(value) => setData('roles', [value])}>
                            <SelectTrigger className="mt-2 w-full">
                                <SelectValue placeholder="Pilih Role / Peran" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role: Role) => (
                                    <SelectItem key={role.id} value={String(role.name)}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <InputError message={errors.roles} className="mt-2" />
                    </div>

                    <div className="mt-4 flex justify-end space-x-3">
                        <Link href={route('admin.permissions.index')} className="cursor-pointer">
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
        </>
    );
}
