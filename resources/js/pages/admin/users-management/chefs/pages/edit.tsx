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
import { Chef, ChefForm } from '@/models/chef';
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
        title: 'Koki',
        href: '/admin/users-management/chefs',
    },
    {
        title: 'Edit Koki',
        href: '/admin/users-management/chefs/edit',
    },
];

export default function EditPage({ chef }: { chef: Chef }) {
    const { usersChef } = usePage<{ usersChef: User[] }>().props;
    const { data, setData, processing, errors, reset } = useForm<Required<ChefForm>>({
        user_id: chef?.user_id,
        hired_at: new Date(chef?.hired_at ?? ''),
        stopped_at: new Date(chef?.stopped_at ?? ''),
        salary: chef?.salary,
        gender: chef?.gender,
        shift: chef?.shift,
        status: chef?.status,
        job_type: chef?.job_type,
    });

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const formattedData = {
            ...data,
            hired_at: formattedDateForInput(data.hired_at) ?? null,
            stopped_at: formattedDateForInput(data.stopped_at) ?? null,
        };

        router.put(route('admin.chefs.update', { id: chef?.id }), formattedData, {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Koki Berhasil Diedit!',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
                reset();
            },
            onError: (errors) => {
                toast.error('Failed', {
                    description: errors.message || 'Gagal Mengedit Koki',
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
                <Head title="Edit Koki" />
                <form onSubmit={handleSubmit} className="space-y-5 p-4">
                    <div id="user_id">
                        <Label htmlFor="user_id">Pengguna</Label>
                        <Select onValueChange={(value) => setData('user_id', parseInt(value))}>
                            <SelectTrigger className="mt-2 w-full" disabled>
                                <SelectValue
                                    placeholder={
                                        usersChef.find((item: User) => item.id === data.user_id)
                                            ? `${usersChef.find((item: User) => item.id === data.user_id)?.full_name} - ${usersChef.find((item: User) => item.id === data.user_id)?.phone_number}`
                                            : 'Pilih Koki'
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {usersChef.map((item: User) => (
                                    <SelectItem key={item.id} value={String(item.id)} disabled>
                                        {item.full_name} - {item.phone_number}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                                        <span className="text-sm text-gray-400">Pilih Tanggal</span>
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
                                        <span>{data?.stopped_at.toDateString()}</span>
                                    ) : (
                                        <span className="text-sm text-gray-400">Pilih Tanggal</span>
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
                        <Input type="number" className="mt-2" value={data.salary} onChange={(e) => setData('salary', parseInt(e.target.value))} />
                        <InputError message={errors.salary} className="mt-2" />
                    </div>

                    <div id="gender">
                        <Label htmlFor="status">Jenis Kelamin</Label>
                        <Select onValueChange={(value) => setData('gender', value as GenderEnum)}>
                            <SelectTrigger className="mt-2 w-full">
                                <SelectValue placeholder={data.gender} />
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

                    <div id="shift">
                        <Label htmlFor="status">Shift</Label>
                        <Select onValueChange={(value) => setData('shift', value as ShiftEnum)}>
                            <SelectTrigger className="mt-2 w-full">
                                <SelectValue placeholder={data.shift} />
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
                                <SelectValue placeholder={data.job_type} />
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
                        <Label htmlFor="status">Status Koki</Label>
                        <Select onValueChange={(value) => setData('status', value as EmployeeStatusEnum)}>
                            <SelectTrigger className="mt-2 w-full">
                                <SelectValue placeholder={data.status} />
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
                            Edit Data <Icon icon="iconoir:edit" />
                        </Button>
                    </div>
                </form>
            </AdminLayout>
        </>
    );
}
