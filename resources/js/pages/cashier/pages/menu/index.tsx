import CashierLayout from '@/layouts/cashier/layout';
import { Carts } from '@/models/cart';
import { MenuCategory } from '@/models/menu-categories';
import { MenuItems } from '@/models/menu-items';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import CartSidebar from './components/cart/cart-sidebar';
import EmptyState from './components/cart/empty-state';
import Header from './components/header';
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
    const { menuCategories } = usePage<{ menuCategories: MenuCategory[] }>().props;
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItems[]>([]);

    const filterMenuItems = (items: MenuItems[]) => items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const displayedMenuItems = filterMenuItems(filteredMenuItems.length > 0 ? filteredMenuItems : menuItems);

    return (
        <CashierLayout breadcrumbs={breadcrumbs}>
            <Head title="Menu" />
            <div className="mt-2 flex flex-1 flex-col gap-4 rounded-xl p-4">
                <Header
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setFilteredMenuItems={setFilteredMenuItems}
                    menuItems={menuItems}
                    menuCategories={menuCategories}
                />
                <div className="relative mt-4 space-x-6 lg:flex">
                    {displayedMenuItems.length > 0 ? (
                        <MenuItemCard menuItems={displayedMenuItems} />
                    ) : (
                        <EmptyState description="Menu tidak ditemukan" />
                    )}
                    <CartSidebar cartItems={carts} />
                </div>
            </div>
        </CashierLayout>
    );
}
