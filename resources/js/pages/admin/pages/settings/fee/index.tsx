import AdminLayout from '@/layouts/admin/layout';
import { FeeItem } from '@/models/fee';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ButtonPartials from './partials/buttons';
import FeesTable from './partials/table';
import { columns } from './partials/table/columns';

interface FeePageProps {
    data: FeeItem;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaturan',
        href: '#',
    },
    {
        title: 'Biaya',
        href: '/admin/settings/fee',
    },
];

export default function FeePage({ data }: FeePageProps) {
    const feeArray: FeeItem[] = Object.entries(data).map(([_, value]) => ({
        id: value.id,
        type: value.type,
        amount: value.amount,
    }));

    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Fee" />
                <div className="mb-2 flex flex-wrap justify-between space-y-2 p-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-700 dark:text-gray-200">Daftar Karyawan Kurir</h2>
                        <p className="text-muted-foreground mt-1.5 text-[14px]">Kelola data semua karyawan kurir yang terdaftar di aplikasi anda</p>
                    </div>
                    <ButtonPartials />
                </div>

                <div className="p-4">
                    <FeesTable data={feeArray} columns={columns} />
                </div>
            </AdminLayout>
        </>
    );
}
