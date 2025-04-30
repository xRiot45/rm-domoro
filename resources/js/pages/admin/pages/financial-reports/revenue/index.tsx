import AdminLayout from '@/layouts/admin/layout';
import { RevenueReport } from '@/models/financial-reports';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ButtonPartials from './partials/buttons';
import RevenueReportTable from './partials/table';
import { columns } from './partials/table/columns';

interface RevenueReportPageProps {
    data: RevenueReport[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laporan Keuangan',
        href: '#',
    },
    {
        title: 'Pemasukan',
        href: '/admin/financial-reports/revenue',
    },
];

export default function RevenueReportPage({ data }: RevenueReportPageProps) {
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Pemasukan" />
                <div className="mb-2 flex flex-wrap justify-between space-y-2 p-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-700 dark:text-gray-200">Laporan Pemasukan</h2>
                        <p className="text-muted-foreground mt-1.5 text-[14px]">Kelola laporan pemasukan</p>
                    </div>
                    <ButtonPartials />
                </div>

                <div className="p-4">
                    <RevenueReportTable data={data} columns={columns} />
                </div>
            </AdminLayout>
        </>
    );
}
