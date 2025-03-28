import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddressLabelEnum } from '@/enums/address-label';
import { GenderEnum } from '@/enums/gender';
import AdminLayout from '@/layouts/admin/layout';
import { cn } from '@/lib/utils';
import { Customer, CustomerForm } from '@/models/customer';
import { BreadcrumbItem } from '@/types';
import { formattedDateForInput } from '@/utils/format-date';
import { Icon } from '@iconify/react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { CalendarIcon, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Pengguna',
        href: '#',
    },
    {
        title: 'Pelanggan',
        href: '/admin/users-management/customers',
    },
    {
        title: 'Edit Pelanggan',
        href: '/admin/users-management/customers/edit',
    },
];

export default function EditPage({ customer }: { customer: Customer }) {
    const { data, setData, processing, errors, reset } = useForm<Required<CustomerForm>>({
        birthplace: customer?.birthplace,
        birthdate: new Date(customer?.birthdate ?? ''),
        address: customer?.address,
        address_label: customer?.address_label,
        note: customer?.note,
        gender: customer?.gender,
    });

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const formattedData = {
            ...data,
            birthdate: formattedDateForInput(data.birthdate),
        };

        router.put(route('admin.customers.update', { id: customer?.id }), formattedData, {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Data Pelanggan Berhasil Diedit!',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
                reset();
            },
            onError: (errors) => {
                toast.error('Failed', {
                    description: errors.message || 'Gagal Mengedit Data Pelanggan',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
        });
    };

    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Edit Pengguna" />
                <form onSubmit={handleSubmit} className="space-y-4 p-4">
                    <div id="birthplace">
                        <Label htmlFor="full_name">Tempat Lahir</Label>
                        <Input
                            id="birthplace"
                            type="text"
                            autoFocus
                            tabIndex={1}
                            autoComplete="birthplace"
                            value={data.birthplace}
                            onChange={(e) => setData('birthplace', e.target.value)}
                            placeholder="Masukkan Tempat Lahir"
                            className={cn('mt-2', errors.birthplace && 'border border-red-500')}
                        />
                        <InputError message={errors.birthplace} className="mt-2" />
                    </div>

                    <div id="birthdate" className="flex flex-col">
                        <Label htmlFor="birthdate">Tanggal Lahir</Label>
                        <Popover>
                            <PopoverTrigger>
                                <Button type="button" variant="outline" className="mt-2.5 w-full">
                                    {data.birthdate ? (
                                        <span>{data.birthdate.toDateString()}</span>
                                    ) : (
                                        <span className="text-sm text-gray-400">Pilih Tanggal</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-5 w-5 text-gray-500" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={data.birthdate ?? new Date()}
                                    onSelect={(date) => setData('birthdate', date ?? null)}
                                    disabled={(date) => date > new Date()}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="grid space-y-4 space-x-4 lg:grid-cols-3 lg:space-y-0">
                        <div id="address_label">
                            <Label htmlFor="status">Label Alamat</Label>
                            <Select onValueChange={(value) => setData('address_label', value as AddressLabelEnum)}>
                                <SelectTrigger className="mt-2 w-full">
                                    <SelectValue placeholder={data.address_label || 'Pilih Label Alamat'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(AddressLabelEnum).map((value) => (
                                        <SelectItem key={value} value={value} className="capitalize">
                                            {value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.address_label} className="mt-2" />
                        </div>

                        <div id="address">
                            <Label htmlFor="address">Alamat</Label>
                            <Input
                                id="address"
                                type="text"
                                autoFocus
                                tabIndex={1}
                                autoComplete="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Masukkan alamat pengguna"
                                className={cn('mt-2', errors.address && 'border border-red-500')}
                            />
                            <InputError message={errors.address} className="mt-2" />
                        </div>

                        <div id="note">
                            <Label htmlFor="note">Catatan Untuk Kurir (Optional)</Label>
                            <Input
                                id="note"
                                type="text"
                                autoFocus
                                tabIndex={1}
                                autoComplete="note"
                                value={data.note}
                                onChange={(e) => setData('note', e.target.value)}
                                placeholder="Masukkan catatan untuk kurir"
                                className={cn('mt-2', errors.note && 'border border-red-500')}
                            />
                            <InputError message={errors.note} className="mt-2" />
                        </div>
                    </div>

                    <div id="gender">
                        <Label htmlFor="status">Jenis Kelamin</Label>
                        <Select onValueChange={(value) => setData('gender', value as GenderEnum)}>
                            <SelectTrigger className="mt-2 w-full">
                                <SelectValue placeholder={data.gender || 'Pilih Jenis Kelamin'} />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(GenderEnum).map((value) => (
                                    <SelectItem key={value} value={value} className="capitalize">
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.gender} className="mt-2" />
                    </div>

                    <div className="mt-4 flex justify-end space-x-3">
                        <Link href={route('admin.customers.index')} className="cursor-pointer">
                            <Button variant="destructive">
                                Batalkan <Icon icon="iconoir:cancel" />
                            </Button>
                        </Link>
                        <Button type="submit" tabIndex={4} disabled={processing} className="cursor-pointer">
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Edit Data <Icon icon="material-symbols:edit" />
                        </Button>
                    </div>
                </form>
            </AdminLayout>
        </>
    );
}
