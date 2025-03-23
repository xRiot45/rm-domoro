import AdminLayout from '@/layouts/admin/layout';
import { MenuItems } from '@/models/menu-items';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ButtonPartials from './partials/buttons';
import MenuTable from './partials/table';
import { columns } from './partials/table/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Menu',
        href: '#',
    },
    {
        title: 'Menu',
        href: '/admin/menu-management/menu-items',
    },
];

export default function MenuItemsPage({ data }: { data: MenuItems[] }) {
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Kategori Menu" />
                <div className="mb-2 flex flex-wrap justify-between space-y-2 p-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-700 dark:text-gray-200">Daftar Menu</h2>
                        <p className="text-muted-foreground mt-1.5 text-[14px]">Kelola data menu yang terdaftar di aplikasi anda</p>
                    </div>
                    <ButtonPartials />
                </div>

                <div className="p-4">
                    <MenuTable data={data} columns={columns} />
                </div>
            </AdminLayout>
        </>
    );
}
