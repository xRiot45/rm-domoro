import AdminLayout from '@/layouts/admin/layout';
import { NetProfit } from '@/models/financial-reports';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ButtonPartials from './partials/buttons';
import NetProfitTable from './partials/table';
import { columns } from './partials/table/columns';

interface NetProfitPageProps {
    netProfits: NetProfit[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laporan Keuangan',
        href: '#',
    },
    {
        title: 'Laba Bersih',
        href: '/admin/financial-reports/net-profit',
    },
];

export default function NetProfitPage({ netProfits }: NetProfitPageProps) {
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Laporan Pengeluaran" />
                <div className="mb-2 flex flex-wrap justify-between space-y-2 p-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-700 dark:text-gray-200">Laporan Laba Bersih</h2>
                        <p className="text-muted-foreground mt-1.5 text-[14px]">Kelola laporan laba bersih anda di sini</p>
                    </div>
                    <ButtonPartials />
                </div>

                <div className="p-4">
                    <NetProfitTable data={netProfits} columns={columns} />
                </div>
            </AdminLayout>
        </>
    );
}
