import AdminLayout from '@/layouts/admin/layout';
import { ExpenseReport, ExpenseSummary } from '@/models/financial-reports';
import { BreadcrumbItem } from '@/types';
import { formatCurrency } from '@/utils/format-currency';
import { Head } from '@inertiajs/react';
import CardSummaryStatistics from './components/card-summary-statistics';
import ExpenseTrendChart from './components/expense-trends-chart';
import ButtonPartials from './partials/buttons';
import ExpenseReportTable from './partials/table';
import { columns } from './partials/table/columns';

interface ExpenseReportPageProps {
    data: ExpenseReport[];
    summary: ExpenseSummary;
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

export default function ExpenseReportPage({ data, summary }: ExpenseReportPageProps) {
    const { total_expense, total_reports, total_items, max_report_expense, average_report_expense } = summary;

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
                <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">Tren Pengeluaran per Tanggal</h3>
                <ExpenseTrendChart data={summary.expense_by_date} />
            </div>

            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                <CardSummaryStatistics
                    data={formatCurrency(total_expense)}
                    title="Total Pengeluaran"
                    subtitle="Seluruh laporan"
                    description="Total dari semua laporan pengeluaran"
                    icon="mdi:currency-usd"
                />
                <CardSummaryStatistics
                    data={total_reports}
                    title="Jumlah Laporan"
                    subtitle="Laporan"
                    description="Total laporan pengeluaran yang tercatat"
                    icon="mdi:file-document-outline"
                />
                <CardSummaryStatistics
                    data={total_items}
                    title="Jumlah Item"
                    subtitle="Item Pengeluaran"
                    description="Total item yang tercatat dalam laporan"
                    icon="mdi:playlist-edit"
                />
                <CardSummaryStatistics
                    data={`Rp ${max_report_expense.toLocaleString('id-ID')}`}
                    title="Laporan Tertinggi"
                    subtitle="Pengeluaran"
                    description="Laporan dengan total pengeluaran terbesar"
                    icon="mdi:chart-bar"
                />
                <CardSummaryStatistics
                    data={formatCurrency(average_report_expense)}
                    title="Rata-rata Pengeluaran"
                    subtitle="Per Laporan"
                    description="Rata-rata pengeluaran dari semua laporan"
                    icon="mdi:finance"
                />
            </div>

            <div className="p-4">
                <ExpenseReportTable data={data} columns={columns} />
            </div>
        </AdminLayout>
    );
}
