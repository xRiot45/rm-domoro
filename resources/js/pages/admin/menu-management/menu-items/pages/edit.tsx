import FileDropzone from '@/components/file-dropzone';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin/layout';
import { cn } from '@/lib/utils';
import { MenuCategory } from '@/models/menu-categories';
import { MenuItemForm, MenuItems, MenuItemStatusEnum } from '@/models/menu-items';
import { BreadcrumbItem } from '@/types';
import { Icon } from '@iconify/react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
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
        title: 'Edit Menu',
        href: '/admin/menu-management/menu-items/edit',
    },
];

export default function EditPage({ menu_item }: { menu_item: MenuItems }) {
    const { menuCategories } = usePage<{ menuCategories: MenuCategory[] }>().props;
    const { data, setData, processing, errors, reset } = useForm<Required<MenuItemForm>>({
        name: menu_item?.name,
        price: menu_item?.price,
        image_url: menu_item?.image_url,
        status: menu_item?.status,
        ingredients: menu_item?.ingredients,
        menu_category_id: menu_item?.menu_category_id,
    });

    const handleFileChange = (file: File | null) => {
        setData('image_url', file);
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            const originalValue = menu_item[key as keyof MenuItems];
            if (value !== originalValue) {
                if (key === 'image_url' && value instanceof File) {
                    formData.append(key, value);
                } else if (key === 'ingredients' && Array.isArray(value)) {
                    value.forEach((ingredient, index) => {
                        formData.append(`ingredients[${index}]`, ingredient);
                    });
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        formData.append('_method', 'PUT');
        router.post(route('admin.menu-items.update', { id: menu_item?.id }), formData, {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Menu Berhasil Diedit!',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
                reset();
            },
            onError: (errors) => {
                toast.error('Failed', {
                    description: errors.message || 'Gagal Mengedit Menu',
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
                <Head title="Edit Menu" />
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
                        <FileDropzone
                            onFileChange={handleFileChange}
                            error={errors.image_url}
                            initialImage={data.image_url instanceof File ? undefined : data.image_url}
                        />
                    </div>

                    <div id="menu_category_id">
                        <Label htmlFor="menu_category_id">Kategori Menu</Label>
                        <Select onValueChange={(value) => setData('menu_category_id', parseInt(value))}>
                            <SelectTrigger className="mt-2 w-full">
                                <SelectValue placeholder={menuCategories.find((item: MenuCategory) => item.id === data.menu_category_id)?.name} />
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
                                <SelectValue datatype="status" placeholder={data?.status || 'Pilih Status Menu'} />
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

                    <div id="ingredients">
                        <Label htmlFor="ingredients">Bahan - Bahan</Label>
                        <div className="mt-2 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {data?.ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <Input
                                            type="text"
                                            value={ingredient}
                                            onChange={(e) => {
                                                const newIngredients = [...data.ingredients];
                                                newIngredients[index] = e.target.value;
                                                setData('ingredients', newIngredients);
                                            }}
                                            placeholder="Masukkan bahan-bahan"
                                            className="flex-1 shadow-none"
                                        />
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                const newIngredients = [...data.ingredients];
                                                newIngredients.splice(index, 1);
                                                setData('ingredients', newIngredients);
                                            }}
                                        >
                                            <Icon icon="tabler:trash" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <Button type="button" onClick={() => setData('ingredients', [...data.ingredients, ''])}>
                                Tambah Bahan
                            </Button>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end space-x-3">
                        <Link href={route('admin.menu-items.index')} className="cursor-pointer">
                            <Button variant="destructive">
                                Batalkan <Icon icon="iconoir:cancel" />
                            </Button>
                        </Link>
                        <Button type="submit" tabIndex={4} disabled={processing} className="cursor-pointer">
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Edit Data <Icon icon="heroicons:plus" />
                        </Button>
                    </div>
                </form>
            </AdminLayout>
        </>
    );
}
