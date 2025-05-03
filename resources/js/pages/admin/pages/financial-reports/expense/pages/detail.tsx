import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin/layout';
import { BreadcrumbItem } from '@/types';
import { Icon } from '@iconify/react';
import { Head } from '@inertiajs/react';

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

export default function DetailExpenseReportPage() {
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Detail Laporan Pengeluaran" />
                <div className="space-y-2 p-4">
                    <Button onClick={() => window.history.back()} className="mb-6">
                        <Icon icon={'famicons:arrow-back'} className="mr-2 h-4 w-4" />
                        Kembali ke halaman sebelumnya
                    </Button>
                </div>
            </AdminLayout>
        </>
    );
}
