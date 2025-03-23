import FileDropzone from '@/components/file-dropzone';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin/layout';
import { cn } from '@/lib/utils';
import { MenuCategory } from '@/models/menu-categories';
import { MenuItemForm, MenuItemStatusEnum } from '@/models/menu-items';
import { BreadcrumbItem } from '@/types';
import { Icon } from '@iconify/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Menu',
        href: '#',
    },
    {
        title: 'Menu',
        href: '/admin/menu-management/menu-items',
    },
    {
        title: 'Tambah Menu',
        href: '/admin/menu-management/menu-items/create',
    },
];

export default function CreateMenuItemPage() {
    const { menuCategories } = usePage<{ menuCategories: MenuCategory[] }>().props;
    const { data, setData, post, processing, errors, reset } = useForm<Required<MenuItemForm>>({
        name: '',
        price: 0,
        image_url: null,
        status: MenuItemStatusEnum.AVAILABLE,
        menu_category_id: 0,
    });

    const handleFileChange = (file: File | null) => {
        setData('image_url', file);
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('price', data.price.toString());
        formData.append('status', data.status);
        formData.append('menu_category_id', data.menu_category_id.toString());

        if (data.image_url) {
            formData.append('image_url', data.image_url);
        }

        formData.append('_method', 'POST');
        post(route('admin.menu-items.store'), {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Menu Berhasil Ditambahkan!',
                    action: {
                        label: 'Close',
                        onClick: () => toast.dismiss(),
                    },
                });
                reset();
            },
            onError: (errors) => {
                toast.error('Failed', {
                    description: errors.message || 'Gagal Menambahkan Menu',
                    action: {
                        label: 'Close',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
        });
    };

    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Tambah Menu" />
                <form onSubmit={handleSubmit} className="space-y-4 p-4" encType="multipart/form-data">
                    <div id="name">
                        <Label htmlFor="name">Nama Menu</Label>
                        <Input
                            id="name"
                            type="text"
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Masukkan nama menu"
                            className={cn('mt-2', errors.name && 'border border-red-500')}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div id="price">
                        <Label htmlFor="price">Harga Menu</Label>
                        <Input
                            id="price"
                            type="number"
                            tabIndex={2}
                            autoComplete="price"
                            value={data.price}
                            onChange={(e) => setData('price', parseInt(e.target.value))}
                            placeholder="Masukkan harga menu"
                            className={cn('mt-2', errors.price && 'border border-red-500')}
                        />
                        <InputError message={errors.price} className="mt-2" />
                    </div>

                    <div id="image_url">
                        <Label htmlFor="image_url">Gambar Menu</Label>
                        <FileDropzone onFileChange={handleFileChange} error={errors.image_url} />
                        <InputError message={errors.image_url} className="mt-2" />
                    </div>

                    <div id="menu_category_id">
                        <Label htmlFor="menu_category_id">Kategori Menu</Label>
                        <Select onValueChange={(value) => setData('menu_category_id', parseInt(value))}>
                            <SelectTrigger className="mt-2 w-full">
                                <SelectValue placeholder="Pilih Kategori Menu" />
                            </SelectTrigger>
                            <SelectContent>
                                {menuCategories.map((item: MenuCategory) => (
                                    <SelectItem key={item.id} value={String(item.id)}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.menu_category_id} className="mt-2" />
                    </div>

                    <div id="status">
                        <Label htmlFor="status">Status Menu</Label>
                        <Select onValueChange={(value) => setData('status', value as MenuItemStatusEnum)}>
                            <SelectTrigger className="mt-2 w-full">
                                <SelectValue placeholder="Pilih Status Menu" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(MenuItemStatusEnum).map((value) => (
                                    <SelectItem key={value} value={value} className="capitalize">
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div className="mt-4 flex justify-end space-x-3">
                        <Link href={route('admin.menu-items.index')} className="cursor-pointer">
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
