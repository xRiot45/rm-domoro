// RevenueTrendChart.tsx
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

interface RevenueTrendChartProps {
    data: {
        report_date: string;
        total_revenue: number;
    }[];
}

export default function RevenueTrendChart({ data }: RevenueTrendChartProps) {
    const chartData = {
        labels: data.map((item) => item.report_date),
        datasets: [
            {
                label: 'Pendapatan Harian',
                data: data.map((item) => item.total_revenue),
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="mx-auto h-[400px] w-full">
            <Line data={chartData} options={options} />
        </div>
    );
}
