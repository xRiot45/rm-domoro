import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin/layout';
import { ExpenseReport } from '@/models/financial-reports';
import { BreadcrumbItem } from '@/types';
import { Icon } from '@iconify/react';
import { Head } from '@inertiajs/react';
import DetailExpenseTable from './partials/table';
import { columns } from './partials/table/columns';

interface DetailExpenseReportPageProps {
    data: ExpenseReport;
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
    {
        title: 'Detail Pengeluaran',
        href: '/admin/financial-reports/expense/detail',
    },
];

export default function DetailExpenseReportPage({ data }: DetailExpenseReportPageProps) {
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Detail Laporan Pengeluaran" />
                <div className="space-y-2 p-4">
                    <Button onClick={() => window.history.back()} className="mb-6">
                        <Icon icon={'famicons:arrow-back'} className="mr-2 h-4 w-4" />
                        Kembali ke halaman sebelumnya
                    </Button>

                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-700 dark:text-gray-200">Detail Laporan Pemasukan</h2>
                        <p className="text-muted-foreground mt-1.5 text-[14px]">
                            Tanggal Laporan Pemasukan : <strong className="italic">{data.report_date}</strong>
                        </p>
                    </div>
                </div>

                <div className="mb-2 px-4">
                    <DetailExpenseTable data={data?.expense_items} columns={columns} />
                </div>
            </AdminLayout>
        </>
    );
}
