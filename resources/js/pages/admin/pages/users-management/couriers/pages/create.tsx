import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeStatusEnum } from '@/enums/employee-status';
import { GenderEnum } from '@/enums/gender';
import { JobTypeEnum } from '@/enums/job-type';
import { ShiftEnum } from '@/enums/shift';
import AdminLayout from '@/layouts/admin/layout';
import { CourierForm } from '@/models/courier';

import { User } from '@/models/user';
import { BreadcrumbItem } from '@/types';
import { formattedDateForInput } from '@/utils/format-date';
import { Icon } from '@iconify/react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { CalendarIcon, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Pengguna',
        href: '#',
    },
    {
        title: 'Courier / Kurir',
        href: '/admin/users-management/couriers',
    },
    {
        title: 'Tambah Kurir',
        href: '/admin/users-management/couriers/create',
    },
];

export default function CreatePage() {
    const { usersCourier } = usePage<{ usersCourier: User[] }>().props;
    const { existingCouriers } = usePage<{ existingCouriers: number[] }>().props;
    const availableUsers = usersCourier.filter((user) => !existingCouriers.includes(user.id));

    const { data, setData, processing, errors, reset } = useForm<Required<CourierForm>>({
        user_id: 0,
        hired_at: null,
        stopped_at: null,
        salary: 0,
        gender: GenderEnum.MALE,
        shift: ShiftEnum.MORNING,
        status: EmployeeStatusEnum.WORK,
        job_type: JobTypeEnum.FULL_TIME,
    });

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const formattedData = {
            ...data,
            hired_at: formattedDateForInput(data.hired_at) ?? null,
            stopped_at: formattedDateForInput(data.stopped_at) ?? null,
        };

        router.post(route('admin.couriers.store'), formattedData, {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Kurir Berhasil Ditambahkan!',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
                reset();
            },
            onError: (errors) => {
                toast.error('Failed', {
                    description: errors.user_id || 'Gagal Menambahkan Kurir',
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
                <Head title="Tambah Kasir" />
                <form onSubmit={handleSubmit} className="space-y-5 p-4">
                    <div id="user_id">
                        <Label htmlFor="user_id">Pengguna</Label>
                        {availableUsers.length > 0 ? (
                            <Select onValueChange={(value) => setData('user_id', parseInt(value))}>
                                <SelectTrigger className="mt-2 w-full">
                                    <SelectValue placeholder="Pilih Pengguna" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableUsers.map((item: User) => (
                                        <SelectItem key={item.id} value={String(item.id)}>
                                            {item.full_name} - {item.phone_number}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Select disabled>
                                <SelectTrigger className="mt-2 w-full">
                                    <SelectValue placeholder="Pilih Pengguna" />
                                </SelectTrigger>
                            </Select>
                        )}

                        <InputError message={errors.user_id} className="mt-2" />
                    </div>

                    <div id="hired_at" className="flex flex-col">
                        <Label htmlFor="hired_at">Tanggal Diterima</Label>
                        <Popover>
                            <PopoverTrigger>
                                <Button type="button" variant="outline" className="mt-2.5 w-full">
                                    {data.hired_at ? (
                                        <span>{data.hired_at.toDateString()}</span>
                                    ) : (
                                        <span className="text-sm text-gray-400">Pilih Tanggal Diterima</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-5 w-5 text-gray-500" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={data.hired_at ?? new Date()}
                                    onSelect={(date) => setData('hired_at', date ?? null)}
                                    disabled={(date) => date > new Date()}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div id="stopped_at" className="flex flex-col">
                        <Label htmlFor="stopped_at">Tanggal Berhenti</Label>
                        <Popover>
                            <PopoverTrigger>
                                <Button type="button" variant="outline" className="mt-2.5 w-full">
                                    {data.stopped_at ? (
                                        <span>{data.stopped_at.toDateString()}</span>
                                    ) : (
                                        <span className="text-sm text-gray-400">Pilih Tanggal Berhenti</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-5 w-5 text-gray-500" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={data.stopped_at ?? new Date()}
                                    onSelect={(date) => setData('stopped_at', date ?? null)}
                                    disabled={(date) => date > new Date()}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div id="salary">
                        <Label htmlFor="salary">Gaji</Label>
                        <Input
                            type="number"
                            className="mt-2"
                            value={data.salary ?? ''}
                            onChange={(e) => setData('salary', e.target.value === '' ? '' : parseInt(e.target.value))}
                        />

                        <InputError message={errors.salary} className="mt-2" />
                    </div>

                    <div id="gender">
                        <Label htmlFor="status">Jenis Kelamin</Label>
                        <Select onValueChange={(value) => setData('gender', value as GenderEnum)}>
                            <SelectTrigger className="mt-2 w-full">
                                <SelectValue placeholder="Pilih Jenis Kelamin" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(GenderEnum).map((value) => (
                                    <SelectItem key={value} value={value} className="capitalize">
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div id="shift">
                        <Label htmlFor="status">Shift</Label>
                        <Select onValueChange={(value) => setData('shift', value as ShiftEnum)}>
                            <SelectTrigger className="mt-2 w-full">
                                <SelectValue placeholder="Pilih Shift" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(ShiftEnum).map((value) => (
                                    <SelectItem key={value} value={value} className="capitalize">
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div id="job_type">
                        <Label htmlFor="job_type">Jenis Pekerjaan</Label>
                        <Select onValueChange={(value) => setData('job_type', value as JobTypeEnum)}>
                            <SelectTrigger className="mt-2 w-full">
                                <SelectValue placeholder="Pilih Jenis Pekerjaan" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(JobTypeEnum).map((value) => (
                                    <SelectItem key={value} value={value} className="capitalize">
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div id="status">
                        <Label htmlFor="status">Status Kasir</Label>
                        <Select onValueChange={(value) => setData('status', value as EmployeeStatusEnum)}>
                            <SelectTrigger className="mt-2 w-full">
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(EmployeeStatusEnum).map((value) => (
                                    <SelectItem key={value} value={value} className="capitalize">
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div className="mt-4 flex justify-end space-x-3">
                        <Link href={route('admin.chefs.index')} className="cursor-pointer">
                            <Button variant="destructive">
                                Batalkan <Icon icon="iconoir:cancel" />
                            </Button>
                        </Link>
                        <Button type="submit" tabIndex={4} disabled={processing} className="cursor-pointer">
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Tambah Data <Icon icon="heroicons:plus" />
                        </Button>
                    </div>
                </form>
            </AdminLayout>
        </>
    );
}
