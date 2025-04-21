import AdminLayout from '@/layouts/admin/layout';
import { MenuCategory } from '@/models/menu-categories';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ButtonPartials from './partials/buttons';
import MenuCategoryTable from './partials/table';
import { columns } from './partials/table/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Menu',
        href: '#',
    },
    {
        title: 'Kategori Menu',
        href: '/admin/meu-management/menu-categories',
    },
];

export default function MenuCategoriesPage({ data }: { data: MenuCategory[] }) {
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="Kategori Menu" />
                <div className="mb-2 flex flex-wrap justify-between space-y-2 p-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-700 dark:text-gray-200">Daftar Kategori Menu</h2>
                        <p className="text-muted-foreground mt-1.5 text-[14px]">Kelola data Kategori menu yang terdaftar di aplikasi anda</p>
                    </div>
                    <ButtonPartials />
                </div>

                <div className="p-4">
                    <MenuCategoryTable data={data} columns={columns} />
                </div>
            </AdminLayout>
        </>
    );
}
