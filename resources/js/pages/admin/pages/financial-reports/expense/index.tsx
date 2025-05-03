import AdminLayout from '@/layouts/admin/layout';
import { ExpenseReport } from '@/models/financial-reports';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ButtonPartials from './partials/buttons';
import ExpenseReportTable from './partials/table';
import { columns } from './partials/table/columns';

interface ExpenseReportPageProps {
    data: ExpenseReport[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laporan Keuangan',
        href: '#',
    },
    {
        title: 'Pengeluaran',
        href: '/admin/financial-reports/expense',
    },
];

export default function ExpenseReportPage({ data }: ExpenseReportPageProps) {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Pengeluaran" />
            <div className="mb-2 flex flex-wrap justify-between space-y-2 p-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-gray-700 dark:text-gray-200">Laporan Pengeluaran</h2>
                    <p className="text-muted-foreground mt-1.5 text-[14px]">Kelola laporan pengeluaran anda di sini</p>
                </div>
                <ButtonPartials />
            </div>

            <div className="p-4">
                <ExpenseReportTable data={data} columns={columns} />
            </div>
        </AdminLayout>
    );
}
