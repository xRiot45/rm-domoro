import EmptyImg from '@/assets/errors/empty.svg';
import { Input } from '@/components/ui/input';
import CashierLayout from '@/layouts/cashier/layout';
import { Carts } from '@/models/cart';
import { MenuItems } from '@/models/menu-items';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import CartSidebar from './components/cart/cart-sidebar';
import MenuItemCard from './components/menu-item-card';

interface MenuPageProps {
    menuItems: MenuItems[];
    carts: Carts[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Menu',
        href: '/cashier/menu',
    },
];

export default function MenuPage({ menuItems, carts }: MenuPageProps) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const searchMenuItems = menuItems?.filter((item) => item?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <>
            <CashierLayout breadcrumbs={breadcrumbs}>
                <Head title="Menu" />
                <div className="mt-2 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className="block items-center justify-between space-y-4 lg:flex">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-gray-800 dark:text-gray-200">Daftar Menu</h1>
                            <p className="text-muted-foreground mt-1.5 text-[16px]">Pilih menu yang tersedia dan tambahkan ke keranjang</p>
                        </div>

                        <Input
                            placeholder="Cari menu"
                            className="w-full lg:w-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative mt-4 space-x-6 lg:flex">
                        {/* Menu Feed Start */}
                        {searchMenuItems?.length > 0 ? (
                            <MenuItemCard menuItems={searchMenuItems} />
                        ) : (
                            <div className="mx-auto flex h-full w-full flex-col items-center justify-center">
                                <img src={EmptyImg} alt="Error" className="mx-auto h-96 w-96" />
                                <p className="text-md text-center font-black text-gray-500">Menu Sedang Kosong</p>
                            </div>
                        )}
                        {/* Menu Feed End */}

                        {/* Cart Sidebar */}
                        <CartSidebar cartItems={carts} />
                    </div>
                </div>
            </CashierLayout>
        </>
    );
}
