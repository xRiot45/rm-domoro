import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MenuCategory } from '@/models/menu-categories';
import { MenuItems } from '@/models/menu-items';

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    setFilteredMenuItems: (value: MenuItems[]) => void;
    menuItems: MenuItems[];
    menuCategories: MenuCategory[];
}

export default function Header({ searchTerm, setSearchTerm, setFilteredMenuItems, menuItems, menuCategories }: HeaderProps) {
    return (
        <div className="block items-center justify-between space-y-4 lg:flex">
            <div>
                <h1 className="text-2xl font-black tracking-tight text-gray-800 dark:text-gray-200">Daftar Menu</h1>
                <p className="text-muted-foreground mt-1.5 text-[16px]">Pilih menu yang tersedia dan tambahkan ke keranjang</p>
            </div>
            <div className="flex items-center gap-3">
                <Input placeholder="Cari menu" className="w-full lg:w-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <Select
                    onValueChange={(value) => {
                        const filtered = menuItems.filter((item) => item.menu_category_id === Number(value));
                        setFilteredMenuItems(filtered);
                    }}
                >
                    <SelectTrigger className="mt-2 w-[350px]">
                        <SelectValue placeholder="KATEGORI MENU" />
                    </SelectTrigger>
                    <SelectContent>
                        {menuCategories.map((item) => {
                            const itemCount = menuItems.filter((menu) => menu.menu_category_id === item.id).length;
                            return (
                                <SelectItem key={item.id} value={String(item.id)} className="cursor-pointer hover:border-none">
                                    {item.name} ({itemCount})
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
