import AdminLayout from '@/layouts/admin/layout';
import { ManageRolePermission } from '@/models/manage-role-permission';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ButtonPartials from './partials/buttons';
import ManageRolePermissionTable from './partials/table';
import { columns } from './partials/table/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Kontrol Akses',
        href: '#',
    },
    {
        title: 'Kelola Izin Peran',
        href: '/admin/manajemen-kontrol-akses/manage-role-permissions',
    },
];

export default function ManageRolePermissionPage({ data }: { data: ManageRolePermission[] }) {
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Kelola Izin Peran" />
                <div className="mb-2 flex flex-wrap justify-between space-y-2 p-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-700 dark:text-gray-200">Daftar Izin Peran</h2>
                        <p className="text-muted-foreground mt-1.5 text-[14px]">Kelola izin peran untuk mengatur hak akses user</p>
                    </div>
                    <ButtonPartials />
                </div>

                <div className="p-4">
                    <ManageRolePermissionTable data={data} columns={columns} />
                </div>
            </AdminLayout>
        </>
    );
}
