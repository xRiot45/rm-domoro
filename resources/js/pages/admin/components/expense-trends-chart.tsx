import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ExpenseTrendChart({ data }: { data: { report_date: string; total: number }[] }) {
    const chartData = {
        labels: data.map((item) => item.report_date),
        datasets: [
            {
                label: 'Pengeluaran Harian',
                data: data.map((item) => item.total),
                borderColor: '#fb2c36',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
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
