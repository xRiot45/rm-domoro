import InputError from '@/components/input-error';
import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin/layout';
import { ManageRolePermission, ManageRolePermissionForm } from '@/models/manage-role-permission';
import { Permission } from '@/models/permission';
import { Role } from '@/models/role';
import { BreadcrumbItem } from '@/types';
import { Icon } from '@iconify/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Master Data',
        href: '#',
    },
    {
        title: 'Kelola Izin Peran',
        href: '/admin/manajemen-kontrol-akses/manage-role-permissions',
    },
    {
        title: 'Edit Izin Peran',
        href: '/admin/manajemen-kontrol-akses/manage-role-permissions/edit',
    },
];

export default function EditPage({ role_has_permissions }: { role_has_permissions: ManageRolePermission }) {
    const { roles, permissions }: { roles: Role[]; permissions: Permission[] } = usePage<{ roles: Role[]; permissions: Permission[] }>().props;
    const { data, setData, put, processing, errors, reset } = useForm<Required<ManageRolePermissionForm>>({
        permission_id: role_has_permissions.permissions.map((p) => p.id),
        role_id: role_has_permissions.id,
    });

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        put(route('admin.manage-role-permission.update', { id: role_has_permissions.id }), {
            onSuccess: () => {
                reset('permission_id');
                reset('role_id');

                toast.success('Success!', {
                    description: 'Izin Peran Berhasil Diedit!',
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
                <Head title="Tambah Permission / Izin" />
                <form onSubmit={handleSubmit} className="p-4">
                    <div id="role">
                        <Label htmlFor="name">Role / Peran</Label>
                        <Select onValueChange={(value) => setData('role_id', parseInt(value))}>
                            <SelectTrigger className="pointer-events-none mt-2 w-full disabled:bg-gray-200" disabled>
                                <SelectValue
                                    placeholder={roles.find((role: Role) => role.id === role_has_permissions.id)?.name || 'Pilih Role / Peran'}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role: Role) => (
                                    <SelectItem key={role.id} value={String(role.id)}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <InputError message={errors.role_id} className="mt-2" />
                    </div>

                    <div id="permission" className="mt-6 flex flex-col">
                        <Label htmlFor="name">Permission / Izin</Label>
                        <MultiSelect
                            options={permissions.map((permission) => ({
                                label: permission.name,
                                value: permission.id,
                            }))}
                            onValueChange={(data: number[]) => setData('permission_id', data)}
                            defaultValue={data.permission_id}
                            placeholder="Pilih Permission / Izin"
                            variant="inverted"
                            animation={2}
                            maxCount={3}
                            className="mt-2"
                        />
                        <InputError message={errors.permission_id} className="mt-2" />
                    </div>

                    <div className="mt-4 flex justify-end space-x-3">
                        <Link href={route('admin.manage-role-permission.index')} className="cursor-pointer">
                            <Button variant="destructive">
                                Batalkan <Icon icon="iconoir:cancel" />
                            </Button>
                        </Link>
                        <Button type="submit" tabIndex={4} disabled={processing} className="cursor-pointer">
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Edit Izin Peran <Icon icon="material-symbols:edit" />
                        </Button>
                    </div>
                </form>
            </AdminLayout>
        </>
    );
}
