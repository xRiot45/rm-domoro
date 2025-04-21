import AdminLayout from '@/layouts/admin/layout';
import { Courier } from '@/models/courier';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ButtonPartials from './partials/buttons';
import CourierTable from './partials/table';
import { columns } from './partials/table/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Pengguna',
        href: '#',
    },
    {
        title: 'Courier / Kurir',
        href: '/admin/users-management/couriers',
    },
];

export default function CouriersPage({ data }: { data: Courier[] }) {
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Kurir" />
                <div className="mb-2 flex flex-wrap justify-between space-y-2 p-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-700 dark:text-gray-200">Daftar Karyawan Kurir</h2>
                        <p className="text-muted-foreground mt-1.5 text-[14px]">Kelola data semua karyawan kurir yang terdaftar di aplikasi anda</p>
                    </div>
                    <ButtonPartials />
                </div>

                <div className="p-4">
                    <CourierTable data={data} columns={columns} />
                </div>
            </AdminLayout>
        </>
    );
}
