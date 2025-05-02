import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { Link } from '@inertiajs/react';

export default function ButtonPartials() {
    return (
        <div className="flex gap-2">
            <Button onClick={() => window.location.reload()} className="cursor-pointer">
                <span>Refresh Halaman</span>
                <Icon icon={'material-symbols:refresh'} className="text-background" />
            </Button>
            <Link href={route('admin.financial-reports.expense.create')}>
                <Button className="cursor-pointer">
                    <span>Tambah Pengeluaran</span> <Icon icon={'heroicons:plus'} className="text-background" />
                </Button>
            </Link>
        </div>
    );
}
