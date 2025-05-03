import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin/layout';
import { ExpenseReportItem } from '@/models/expense';
import { BreadcrumbItem } from '@/types';
import { Icon } from '@iconify/react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

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

export default function CreateExpenseReportPage({ availableDates }: { availableDates: string[] }) {
    const { data, setData, processing, errors, reset } = useForm({
        report_date: '',
        description: '',
        items: [
            {
                expense_name: '',
                description: '',
                amount: '',
            },
        ],
    });

    const [inputValue, setInputValue] = useState('');

    const handleItemChange = (index: number, field: keyof ExpenseReportItem, value: string) => {
        const updatedItems = [...data.items];
        updatedItems[index][field] = value;
        setData('items', updatedItems);
    };

    const handleAddItem = () => {
        setData('items', [...data.items, { expense_name: '', description: '', amount: '' }]);
    };

    const handleRemoveItem = (index: number) => {
        const updatedItems = [...data.items];
        updatedItems.splice(index, 1);
        setData('items', updatedItems);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formattedData = {
            ...data,
            items: data.items.map((item) => ({
                ...item,
                amount: parseInt(item.amount) || 0,
            })),
        };

        router.post(route('admin.financial-reports.expense.store'), formattedData, {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Laporan Pengeluaran Berhasil Ditambahkan!',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
                reset();
            },
            onError: (error) => {
                console.log(error);
                toast.error('Error', {
                    description: 'Laporan Pengeluaran Gagal Ditambahkan!',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Laporan Pengeluaran" />
            <form onSubmit={handleSubmit} className="mb-4 px-4">
                <div className="space-y-6">
                    <div id="report_date" className="flex flex-col">
                        <Label htmlFor="report_date" className="mb-2">
                            Tanggal Laporan
                        </Label>
                        <Select
                            value={inputValue}
                            onValueChange={(value) => {
                                const dateOnly = new Date(value).toISOString().slice(0, 10);
                                setData('report_date', dateOnly);
                                setInputValue(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Tanggal Laporan" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(availableDates).map((dateStr) => {
                                    const date = new Date(dateStr);
                                    return (
                                        <SelectItem key={date.toISOString()} value={date.toISOString()}>
                                            {date.toDateString()}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>

                        <InputError className="mt-1" message={errors.report_date} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Deskripsi Laporan Pengeluaran (Optional)</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Deskripsi Laporan Pengeluaran"
                            className="min-h-[100px]"
                        />
                    </div>
                </div>

                {/* Form for items */}
                <div className="mt-6">
                    <Label className="text-lg font-semibold">Detail Pengeluaran</Label>

                    {data.items.map((item, index) => (
                        <Card key={index} className="mt-2 mb-4 py-6 shadow-none">
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor={`expense_name_${index}`}>Nama Pengeluaran</Label>
                                    <Input
                                        id={`expense_name_${index}`}
                                        type="text"
                                        value={item.expense_name}
                                        onChange={(e) => handleItemChange(index, 'expense_name', e.target.value)}
                                        placeholder="Nama Pengeluaran"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor={`amount_${index}`}>Jumlah</Label>
                                    <Input
                                        id={`amount_${index}`}
                                        type="number"
                                        value={item.amount}
                                        onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                                        placeholder="Jumlah"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor={`description_${index}`}>Deskripsi</Label>
                                    <Textarea
                                        id={`description_${index}`}
                                        value={item.description}
                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                        placeholder="Deskripsi Pengeluaran"
                                        className="min-h-[100px]"
                                    />
                                </div>

                                <div className="text-right">
                                    <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveItem(index)}>
                                        Hapus Item
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="flex items-center justify-end gap-2">
                    <Button type="button" onClick={handleAddItem} className="cursor-pointer bg-blue-500 hover:bg-blue-600">
                        <Icon icon={'heroicons:plus'} />
                        Tambah Item
                    </Button>
                    <Link href={route('admin.financial-reports.expense.index')}>
                        <Button variant="destructive" className="cursor-pointer">
                            Batalkan <Icon icon="iconoir:cancel" />
                        </Button>
                    </Link>
                    <Button type="submit" disabled={processing} className="cursor-pointer">
                        <Icon icon={'ic:outline-done-all'} />
                        Simpan Data
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
