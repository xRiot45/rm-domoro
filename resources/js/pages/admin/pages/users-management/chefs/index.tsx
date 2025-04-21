import AdminLayout from '@/layouts/admin/layout';
import { Chef } from '@/models/chef';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ButtonPartials from './partials/buttons';
import ChefsTable from './partials/table';
import { columns } from './partials/table/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Pengguna',
        href: '#',
    },
    {
        title: 'Chefs / Koki',
        href: '/admin/users-management/chefs',
    },
];

export default function ChefsPage({ data }: { data: Chef[] }) {
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Koki" />
                <div className="mb-2 flex flex-wrap justify-between space-y-2 p-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-700 dark:text-gray-200">Daftar Karyawan Koki</h2>
                        <p className="text-muted-foreground mt-1.5 text-[14px]">Kelola data semua karyawan koki yang terdaftar di aplikasi anda</p>
                    </div>
                    <ButtonPartials />
                </div>

                <div className="p-4">
                    <ChefsTable data={data} columns={columns} />
                </div>
            </AdminLayout>
        </>
    );
}
