// NetProfitTrendChart.tsx
import type { NetProfitChart } from '@/models/financial-reports';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function NetProfitTrendChart({ labels, datasets }: NetProfitChart) {
    const data = {
        labels,
        datasets: [
            {
                label: 'Pendapatan',
                data: datasets.revenue,
                borderColor: 'green',
                backgroundColor: 'oklch(0.723 0.219 149.579)',
            },
            {
                label: 'Pengeluaran',
                data: datasets.expense,
                borderColor: 'red',
                backgroundColor: 'oklch(0.637 0.237 25.331)',
            },
            {
                label: 'Laba Bersih',
                data: datasets.net_profit,
                borderColor: 'blue',
                backgroundColor: 'oklch(0.623 0.214 259.815)',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Grafik Laba Bersih',
            },
        },
    };

    return (
        <div className="h-[600px] w-full">
            <Bar options={options} data={data} />
        </div>
    );
}
