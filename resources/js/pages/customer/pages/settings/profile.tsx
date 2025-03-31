import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddressLabelEnum } from '@/enums/address-label';
import { GenderEnum } from '@/enums/gender';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app/layout';
import SettingsLayout from '@/layouts/settings/layout';
import { cn } from '@/lib/utils';
import { Customer } from '@/models/customer';
import { CustomerProfileForm } from '@/models/settings/customer-profile';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { formattedDateForInput } from '@/utils/format-date';
import { Transition } from '@headlessui/react';
import { Icon } from '@iconify/react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { CalendarIcon } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status, customer }: { mustVerifyEmail: boolean; status?: string; customer: Customer }) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

    const { data, setData, errors, processing, recentlySuccessful, reset, setError } = useForm<Required<CustomerProfileForm>>({
        full_name: customer?.user?.full_name,
        email: customer?.user?.email,
        phone_number: customer?.user?.phone_number,
        avatar: customer?.user?.avatar,
        birthplace: customer?.birthplace,
        birthdate: new Date(customer?.birthdate ?? ''),
        address: customer?.address,
        address_label: customer?.address_label,
        note: customer?.note,
        gender: customer?.gender,
    });

    const [inputValue, setInputValue] = useState(data.birthdate ? data.birthdate.toISOString().split('T')[0] : '');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const handleInputBirthdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        const parsedData = new Date(event.target.value);
        if (!isNaN(parsedData.getTime())) {
            setData('birthdate', parsedData);
        }
    };

    const handleFileChange = (file: File | null) => {
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            setData('avatar', file);
        }
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('full_name', data.full_name ?? '');
        formData.append('email', data.email ?? '');
        formData.append('phone_number', data.phone_number ?? '');

        if (data.avatar instanceof File) {
            formData.append('avatar', data.avatar);
        }

        formData.append('birthplace', data.birthplace ?? '');
        formData.append('birthdate', data.birthdate ? String(formattedDateForInput(data.birthdate)) : '');
        formData.append('address', data.address ?? '');
        formData.append('address_label', data.address_label ?? '');
        formData.append('note', data.note ?? '');
        formData.append('gender', data.gender ?? '');

        router.post(route('customer.profile.update_profile', { id: customer?.id }), formData, {
            forceFormData: true,
            preserveState: true,
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Data Anda Berhasil Diedit!',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });

                router.reload({ only: ['customer'] });
                reset();
            },
            onError: (errors) => {
                Object.entries(errors).forEach(([key, value]) => {
                    setError(key as keyof CustomerProfileForm, value);
                });
                toast.error('Failed', {
                    description: errors.message || 'Gagal Mengedit Data Anda',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Informasi Pribadi" description="Update data pribadi anda" />

                    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                        <div className="mt-10 flex flex-col items-center justify-center">
                            <div className="relative">
                                <Avatar className="h-28 w-28 overflow-hidden rounded-full">
                                    <AvatarImage
                                        className="h-full w-full object-cover"
                                        src={avatarPreview || auth.user.avatar}
                                        alt={auth.user.full_name}
                                    />
                                    <AvatarFallback>{getInitials(auth.user.full_name)}</AvatarFallback>
                                </Avatar>

                                <Label
                                    htmlFor="file-input"
                                    className="absolute right-0 bottom-0 cursor-pointer rounded-full bg-black p-2 transition-all hover:bg-gray-600 dark:bg-white hover:dark:bg-gray-600"
                                >
                                    <Icon icon="tabler:camera-filled" className="h-5 w-5 text-white dark:text-black" />
                                    <Input
                                        id="file-input"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                    />
                                </Label>
                            </div>

                            <h1 className="mt-5 mb-1 text-lg font-bold text-gray-800 dark:text-white">{data?.full_name}</h1>
                            <span className="text-sm text-gray-500 dark:text-white">{data?.email}</span>
                        </div>

                        <div id="full_name">
                            <Label htmlFor="full_name">Nama Lengkap</Label>
                            <Input
                                id="full_name"
                                className={cn('mt-1', errors.full_name && 'border border-red-500')}
                                value={data?.full_name}
                                onChange={(e) => setData('full_name', e.target.value)}
                                autoComplete="full_name"
                                placeholder="Masukkan nama lengkap anda"
                            />
                            <InputError className="mt-1" message={errors.full_name} />
                        </div>

                        <div id="email">
                            <Label htmlFor="email">Alamat Email</Label>
                            <Input
                                id="email"
                                type="email"
                                className={cn('mt-1', errors.email && 'border border-red-500')}
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="email"
                                placeholder="Masukkan alamat email anda"
                                disabled
                            />
                            <InputError className="mt-1" message={errors.email} />
                        </div>

                        <div id="phone_number">
                            <Label htmlFor="phone_number">Nomor Telepon</Label>
                            <Input
                                id="phone_number"
                                type="number"
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                autoComplete="phone_number"
                                placeholder="Masukkan nomor telepon anda"
                                className={cn('mt-1', errors.phone_number && 'border border-red-500')}
                            />
                            <InputError className="mt-1" message={errors.phone_number} />
                        </div>

                        <div id="birthplace">
                            <Label htmlFor="full_name">Tempat Lahir</Label>
                            <Input
                                id="birthplace"
                                type="text"
                                autoComplete="birthplace"
                                value={data.birthplace}
                                onChange={(e) => setData('birthplace', e.target.value)}
                                placeholder="Masukkan Tempat Lahir"
                                className="mt-1 block w-full"
                            />
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

                                <PopoverContent className="w-auto p-2">
                                    <Input type="text" value={inputValue} onChange={handleInputBirthdate} className="mb-2 py-6 text-center" />
                                    <Calendar
                                        mode="single"
                                        selected={data.birthdate ?? new Date()}
                                        onSelect={(date) => {
                                            setData('birthdate', date ?? null);
                                            setInputValue(date ? date.toISOString().split('T')[0] : '');
                                        }}
                                        disabled={(date) => date > new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div id="gender">
                            <Label htmlFor="gender">Jenis Kelamin</Label>
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

                        <div className="grid space-y-4 space-x-4 lg:grid-cols-3 lg:space-y-0">
                            <div id="address_label">
                                <Label htmlFor="address_label">Label Alamat</Label>
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
                            </div>

                            <div id="address">
                                <Label htmlFor="address">Alamat</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    autoComplete="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Masukkan alamat pengguna"
                                    className="mt-1 block w-full"
                                />
                            </div>

                            <div id="note">
                                <Label htmlFor="note">Catatan Untuk Kurir (Optional)</Label>
                                <Input
                                    id="note"
                                    type="text"
                                    autoComplete="note"
                                    value={data.note}
                                    onChange={(e) => setData('note', e.target.value)}
                                    placeholder="Masukkan catatan untuk kurir"
                                    className="mt-1 block w-full"
                                />
                                <Label className="mt-2 text-xs text-gray-500">Warna rumah, patokan, pesan khusus, dll.</Label>
                            </div>
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-muted-foreground -mt-4 text-sm">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Update Profile</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
