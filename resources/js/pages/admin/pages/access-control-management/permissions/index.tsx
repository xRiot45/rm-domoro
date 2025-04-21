import AdminLayout from '@/layouts/admin/layout';
import { Permission } from '@/models/permission';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ButtonPartials from './partials/buttons';
import PermissionTable from './partials/table';
import { columns } from './partials/table/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Kontrol Akses',
        href: '#',
    },
    {
        title: 'Permissions / Izin',
        href: '/admin/manajemen-kontrol-akses/permissions',
    },
];

export default function PermissionsPage({ data }: { data: Permission[] }) {
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Permissions / Izin" />
                <div className="mb-2 flex flex-wrap justify-between space-y-2 p-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-700 dark:text-gray-200">Daftar Permission / Izin</h2>
                        <p className="text-muted-foreground mt-1.5 text-[14px]">Kelola permission / izin untuk mengatur hak akses user</p>
                    </div>
                    <ButtonPartials />
                </div>

                <div className="p-4">
                    <PermissionTable data={data} columns={columns} />
                </div>
            </AdminLayout>
        </>
    );
}
