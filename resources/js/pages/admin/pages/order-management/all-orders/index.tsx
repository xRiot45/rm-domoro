import AdminLayout from '@/layouts/admin/layout';
import { Transaction } from '@/models/transaction';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ButtonPartials from './partials/buttons';
import AllOrdersTable from './partials/table';
import { columns } from './partials/table/columns';

interface AllOrdersPageProps {
    orders: Transaction[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Order / Pesanan',
        href: '#',
    },
    {
        title: 'Semua Order',
        href: '/admin/order-management/all-orders',
    },
];

export default function AllOrdersPage({ orders }: AllOrdersPageProps) {
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Semua Order" />
                <div className="mb-2 flex flex-wrap justify-between space-y-2 p-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-700 dark:text-gray-200">Daftar Semua Order</h2>
                        <p className="text-muted-foreground mt-1.5 text-[14px]">Kelola data semua order yang sudah masuk di aplikasi anda</p>
                    </div>
                    <ButtonPartials />
                </div>

                <div className="p-4">
                    <AllOrdersTable data={orders} columns={columns} />
                </div>
            </AdminLayout>
        </>
    );
}
