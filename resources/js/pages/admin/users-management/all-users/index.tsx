import AdminLayout from '@/layouts/admin/layout';
import { BreadcrumbItem, User } from '@/types';
import { Head } from '@inertiajs/react';
import ButtonPartials from './partials/buttons';
import AllUsersTable from './partials/table';
import { columns } from './partials/table/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Pengguna',
        href: '#',
    },
    {
        title: 'Semua Pengguna',
        href: '/admin/users-management/all-users',
    },
];

export default function AllUsersPage({ data }: { data: User[] }) {
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Semua Pengguna" />
                <div className="mb-2 flex flex-wrap justify-between space-y-2 p-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-700 dark:text-gray-200">Daftar Semua Pengguna</h2>
                        <p className="text-muted-foreground mt-1.5 text-[14px]">Kelola data semua pengguna yang terdaftar di aplikasi anda</p>
                    </div>
                    <ButtonPartials />
                </div>

                <div className="p-4">
                    <AllUsersTable data={data} columns={columns} />
                </div>
            </AdminLayout>
        </>
    );
}
