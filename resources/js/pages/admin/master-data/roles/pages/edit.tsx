import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin/layout';
import { Role, RoleForm } from '@/models/role';
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
        title: 'Roles',
        href: '/admin/master-data/roles',
    },
    {
        title: 'Edit Role',
        href: '/admin/master-data/roles/edit',
    },
];

export default function RoleContainer({ role }: { role: Role }) {
    const { data, setData, put, processing, errors, reset } = useForm<Required<RoleForm>>({
        name: role?.name,
    });

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        put(route('admin.roles.update', { id: role?.id }), {
            onSuccess: () => {
                reset('name');
                toast('Success', {
                    description: 'Role Berhasil Diedit!',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
        });
    };

    return <RoleView data={data} setData={setData} processing={processing} errors={errors} submit={submit} />;
}

const RoleView = ({
    data,
    setData,
    processing,
    errors,
    submit,
}: {
    data: RoleForm;
    setData: (key: keyof RoleForm, value: string) => void;
    processing: boolean;
    errors: Record<string, string>;
    submit: FormEventHandler<HTMLFormElement>;
}) => {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Role" />
            <form onSubmit={submit} className="p-4">
                <Label htmlFor="name">Nama Role</Label>
                <Input
                    id="name"
                    type="text"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Masukkan nama role"
                    className="mt-2"
                />
                <InputError message={errors.name} />

                <div className="mt-4 flex justify-end space-x-3">
                    <Link href={route('admin.roles.index')}>
                        <Button variant="destructive" className="cursor-pointer">
                            Batalkan <Icon icon="iconoir:cancel" />
                        </Button>
                    </Link>
                    <Button type="submit" tabIndex={4} disabled={processing} className="cursor-pointer">
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Edit Role <Icon icon="heroicons:plus" />
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
};
