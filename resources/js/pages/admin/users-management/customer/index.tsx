import AdminLayout from '@/layouts/admin/layout';
import { Customer } from '@/models/customer';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ButtonPartials from './partials/buttons';
import CustomersTable from './partials/table';
import { columns } from './partials/table/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Pengguna',
        href: '#',
    },
    {
        title: 'Pelanggan',
        href: '/admin/users-management/customers',
    },
];

export default function CustomerPage({ data }: { data: Customer[] }) {
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Kasir" />
                <div className="mb-2 flex flex-wrap justify-between space-y-2 p-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-700 dark:text-gray-200">Daftar Semua Pelanggan</h2>
                        <p className="text-muted-foreground mt-1.5 text-[14px]">Kelola data semua pelanggan yang terdaftar di aplikasi anda</p>
                    </div>
                    <ButtonPartials />
                </div>

                <div className="p-4">
                    <CustomersTable data={data} columns={columns} />
                </div>
            </AdminLayout>
        </>
    );
}
