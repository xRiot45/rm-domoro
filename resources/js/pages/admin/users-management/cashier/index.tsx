import AdminLayout from '@/layouts/admin/layout';
import { Cashier } from '@/models/cashier';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ButtonPartials from './partials/buttons';
import CashiersTable from './partials/table';
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

export default function CashierPage({ data }: { data: Cashier[] }) {
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Kasir" />
                <div className="mb-2 flex flex-wrap justify-between space-y-2 p-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-700 dark:text-gray-200">Daftar Karyawan Kasir</h2>
                        <p className="text-muted-foreground mt-1.5 text-[14px]">Kelola data semua karyawan kasir yang terdaftar di aplikasi anda</p>
                    </div>
                    <ButtonPartials />
                </div>

                <div className="p-4">
                    <CashiersTable data={data} columns={columns} />
                </div>
            </AdminLayout>
        </>
    );
}
