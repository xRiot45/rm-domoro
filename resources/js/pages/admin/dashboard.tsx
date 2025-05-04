import AdminLayout from '@/layouts/admin/layout';
import { BreadcrumbItem } from '@/types';
import { formatCurrency } from '@/utils/format-currency';
import { Head } from '@inertiajs/react';
import CardSummaryStatistics from './components/card-summary-statistics';
import ExpenseTrendChart from './components/expense-trends-chart';
import NetProfitTrendChart from './components/net-profit-chart';
import RevenueTrendChart from './components/revenue-trend-chart';

interface NetProfitChartData {
    labels: string[];
    datasets: {
        revenue: number[];
        expense: number[];
        net_profit: number[];
    };
}

interface NetProfitTableRow {
    date: string;
    revenue: number;
    expense: number;
    net_profit: number;
}

interface DashboardProps extends PageProps {
    totalUsers: number;
    totalMenuItems: number;
    totalTransactions: number;
    totalRevenue: number;
    totalExpense: number;
    averageRevenuePerTransaction: number;
    todayRevenue: number;
    todayExpense: number;
    netProfitChart: NetProfitChartData;
    netProfitTable: NetProfitTableRow[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
];

export default function DashboardPage({
    totalUsers,
    totalMenuItems,
    totalTransactions,
    totalRevenue,
    totalExpense,
    averageRevenuePerTransaction,
    todayRevenue,
    todayExpense,
    netProfitChart,
    netProfitTable,
}: DashboardProps) {
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    {/* Summary Cards */}
                    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                        <CardSummaryStatistics
                            title="Total Pengguna"
                            data={totalUsers}
                            description="Jumlah seluruh pengguna"
                            icon="mdi:account-group"
                        />
                        <CardSummaryStatistics title="Total Menu" data={totalMenuItems} description="Menu yang tersedia" icon="mdi:food" />
                        <CardSummaryStatistics
                            title="Total Transaksi"
                            data={totalTransactions}
                            description="Semua transaksi yang tercatat"
                            icon="mdi:cart"
                        />
                        <CardSummaryStatistics
                            title="Total Pendapatan"
                            data={formatCurrency(totalRevenue)}
                            description="Akumulasi semua pendapatan"
                            icon="mdi:cash"
                        />
                        <CardSummaryStatistics
                            title="Total Pengeluaran"
                            data={formatCurrency(totalExpense)}
                            description="Total semua pengeluaran"
                            icon="mdi:cash-minus"
                        />
                        <CardSummaryStatistics
                            title="Rata-rata Pendapatan / Transaksi"
                            data={formatCurrency(averageRevenuePerTransaction)}
                            description="Rata-rata dari total transaksi"
                            icon="mdi:chart-bar"
                        />
                        <CardSummaryStatistics
                            title="Pendapatan Hari Ini"
                            data={formatCurrency(todayRevenue)}
                            description="Pendapatan per hari ini"
                            icon="mdi:calendar-today"
                        />
                        <CardSummaryStatistics
                            title="Pengeluaran Hari Ini"
                            data={formatCurrency(todayExpense)}
                            description="Pengeluaran per hari ini"
                            icon="mdi:calendar-remove"
                        />
                    </div>

                    {/* Chart */}
                    <div className="p-4">
                        <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">Tren Laba Bersih per Tanggal</h3>
                        <NetProfitTrendChart labels={netProfitChart.labels} datasets={netProfitChart.datasets} />
                    </div>

                    <div className="p-4">
                        <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">Tren Pendapatan per Tanggal</h3>
                        <RevenueTrendChart
                            data={netProfitChart.labels.map((label, index) => ({
                                report_date: label,
                                total_revenue: netProfitChart.datasets.revenue[index],
                            }))}
                        />
                    </div>

                    <div className="p-4">
                        <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">Tren Pengeluaran per Tanggal</h3>
                        <ExpenseTrendChart
                            data={netProfitChart?.labels.map((label, index) => ({
                                report_date: label,
                                total: netProfitChart.datasets.expense[index],
                            }))}
                        />
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
