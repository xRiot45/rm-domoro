import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin/layout';
import { RevenueReport } from '@/models/financial-reports';
import { Transaction } from '@/models/transaction';
import { BreadcrumbItem } from '@/types';
import { Icon } from '@iconify/react';
import { Head } from '@inertiajs/react';
import TransactionTable from './partials/table';
import { columns } from './partials/table/columns';

interface DetailRevenueReportPageProps {
    report: RevenueReport;
    transactions: Transaction[];
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
    {
        title: 'Detail Laporan Pemasukan',
        href: '#',
    },
];

export default function DetailRevenueReportPage({ report, transactions }: DetailRevenueReportPageProps) {
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Detail Laporan Pemasukan" />
                <div className="space-y-2 p-4">
                    <Button onClick={() => window.history.back()} className="mb-6">
                        <Icon icon={'famicons:arrow-back'} className="mr-2 h-4 w-4" />
                        Kembali ke halaman sebelumnya
                    </Button>
                    <div className="mb-2 flex flex-wrap justify-between">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-gray-700 dark:text-gray-200">Detail Laporan Pemasukan</h2>
                            <p className="text-muted-foreground mt-1.5 text-[14px]">
                                Tanggal Laporan Pemasukan : <strong className="italic">{report.report_date}</strong>
                            </p>
                        </div>

                        <div className="p-4">
                            <TransactionTable data={transactions} columns={columns} />
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
