import { NavGroup } from '@/types';

const mainNavItems: NavGroup[] = [
    {
        group: 'DASHBOARD',
        items: [
            {
                title: 'Dashboard',
                href: '/admin/dashboard',
                icon: 'material-symbols:dashboard',
            },
        ],
    },
    {
        group: 'MANAJEMEN KONTROL AKSES',
        items: [
            {
                title: 'Roles / Peran',
                href: '/admin/manajemen-kontrol-akses/roles',
                icon: 'eos-icons:role-binding',
            },
            {
                title: 'Permissions / Izin',
                href: '/admin/manajemen-kontrol-akses/permissions',
                icon: 'material-symbols:security',
            },
            {
                title: 'Kelola Izin Peran',
                href: '/admin/manajemen-kontrol-akses/manage-role-permissions',
                icon: 'material-symbols:manage-accounts-outline-rounded',
            },
        ],
    },
    {
        group: 'MANAJEMEN PENGGUNA',
        items: [
            {
                title: 'Semua Pengguna',
                href: '/admin/users-management/all-users',
                icon: 'la:users',
            },
            {
                title: 'Customer',
                href: '/admin/users-management/customer',
                icon: 'carbon:customer',
            },
            {
                title: 'Admin',
                href: '/admin/users-management/admin',
                icon: 'ri:admin-line',
            },
            {
                title: 'Chef',
                href: '/admin/users-management/chef',
                icon: 'hugeicons:chef',
            },
            {
                title: 'Cashier',
                href: '/admin/users-management/cashier',
                icon: 'hugeicons:cashier',
            },
        ],
    },
    {
        group: 'MANAJEMEN MENU',
        items: [
            {
                title: 'Kategori Menu',
                href: '/admin/menu-management/menu-categories',
                icon: 'material-symbols:category',
            },
            {
                title: 'Menu',
                href: '/admin/menu-management/menu-items',
                icon: 'material-symbols:menu',
            },
        ],
    },
];

export default mainNavItems;
