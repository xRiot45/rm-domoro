import AdminLayout from '@/layouts/admin/layout';
import { BreadcrumbItem } from '@/types';

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
        title: 'Tambah Pengeluaran',
        href: '/admin/financial-reports/expense/create',
    },
];

export default function CreateExpenseReportPage() {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <h1>Create Expense Report</h1>
        </AdminLayout>
    );
}
