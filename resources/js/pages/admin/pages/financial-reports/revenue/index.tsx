import AdminLayout from '@/layouts/admin/layout';
import { RevenueReport } from '@/models/financial-reports';
import { BreadcrumbItem } from '@/types';
import { formatCurrency } from '@/utils/format-currency';
import { Head } from '@inertiajs/react';
import CardSummaryStatistics from './components/card-summary-statistics';
import RevenueTrendChart from './components/revenue-trend-chart';
import ButtonPartials from './partials/buttons';
import RevenueReportTable from './partials/table';
import { columns } from './partials/table/columns';

interface RevenueReportPageProps {
    data: RevenueReport[];
    totalTransactions: number;
    totalRevenue: number;
    averageRevenuePerTransaction: number;
    todayTransactions: number;
    todayRevenue: number;
    todayAverageRevenuePerTransaction: number;
    revenueByDate: {
        report_date: string;
        total_revenue: number;
    }[];
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

export default function RevenueReportPage({
    data,
    totalTransactions,
    totalRevenue,
    averageRevenuePerTransaction,
    todayTransactions,
    todayRevenue,
    todayAverageRevenuePerTransaction,
    revenueByDate,
}: RevenueReportPageProps) {
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
                    <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">Tren Pendapatan per Tanggal</h3>
                    <RevenueTrendChart data={revenueByDate} />
                </div>

                <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                    <CardSummaryStatistics
                        data={totalTransactions}
                        title="Total Transaksi"
                        subtitle="Transaksi"
                        description="Total transaksi seluruhnya"
                        icon="bitcoin-icons:transactions-filled"
                    />

                    <CardSummaryStatistics
                        data={formatCurrency(totalRevenue)}
                        title="Total Pendapatan"
                        description="Total pendapatan seluruhnya"
                        icon="tdesign:money"
                    />

                    <CardSummaryStatistics
                        data={formatCurrency(averageRevenuePerTransaction)}
                        title="Rata-rata Pendapatan"
                        description="Pendapatan rata-rata yang dihasilkan dari setiap transaksi"
                        icon="humbleicons:money"
                    />

                    <CardSummaryStatistics
                        data={todayTransactions}
                        title="Transaksi Hari Ini"
                        subtitle="Transaksi"
                        description="Total transaksi hari ini"
                        icon="fluent:person-money-20-filled"
                    />

                    <CardSummaryStatistics
                        data={formatCurrency(todayRevenue)}
                        title="Pendapatan Hari Ini"
                        description="Total pendapatan hari ini"
                        icon="healthicons:money-bag"
                    />

                    <CardSummaryStatistics
                        data={formatCurrency(todayAverageRevenuePerTransaction)}
                        title="Rata-rata Pendapatan Hari Ini"
                        description="Pendapatan rata-rata yang dihasilkan dari setiap transaksi hari ini"
                        icon="uil:money-insert"
                    />
                </div>

                <div className="p-4">
                    <RevenueReportTable data={data} columns={columns} />
                </div>
            </AdminLayout>
        </>
    );
}
