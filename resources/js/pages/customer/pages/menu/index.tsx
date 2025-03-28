import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app/layout';
import { MenuCategory } from '@/models/menu-categories';
import { MenuItems } from '@/models/menu-items';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MenuItemCard from '../../components/menu-item-card';

export default function MenuPage({ data }: { data: MenuItems[] }) {
    const { menuCategories } = usePage<{ menuCategories: MenuCategory[] }>().props;
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredMenu = data.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? item.menu_category?.id === Number(selectedCategory) : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <AppLayout>
                <Head title="Menu" />
                <div className="my-8 flex flex-wrap justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-700 dark:text-gray-200">Daftar Menu</h2>
                        <p className="text-muted-foreground mt-1.5 text-[14px]">Lihat menu yang tersedia dan pilih sesuai kebutuhan anda</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 space-y-6 lg:grid-cols-3 lg:gap-6">
                    {/* Filter Form */}
                    <div className="sticky h-auto w-full self-start rounded-lg border border-gray-200 p-6 lg:top-4 lg:mb-0">
                        <h1 className="text-xl font-bold">Filter</h1>
                        <Separator className="my-4" />
                        <div className="space-y-4">
                            <div className="mt-4">
                                <Label htmlFor="search">Cari Menu</Label>
                                <Input placeholder="Cari menu" className="mt-2" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>

                            <div id="menu_category_id">
                                <Label htmlFor="menu_category_id">Kategori Menu</Label>
                                <Select onValueChange={(value) => setSelectedCategory(value)}>
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
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="col-span-2">
                        <MenuItemCard menuItems={filteredMenu} />
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
