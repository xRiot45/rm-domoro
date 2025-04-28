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
            // {
            //     title: 'Permissions / Izin',
            //     href: '/admin/manajemen-kontrol-akses/permissions',
            //     icon: 'material-symbols:security',
            // },
            // {
            //     title: 'Kelola Izin Peran',
            //     href: '/admin/manajemen-kontrol-akses/manage-role-permissions',
            //     icon: 'material-symbols:manage-accounts-outline-rounded',
            // },
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
                title: 'Customer / Pelanggan',
                href: '/admin/users-management/customers',
                icon: 'carbon:customer',
            },
            {
                title: 'Chef / Koki',
                href: '/admin/users-management/chefs',
                icon: 'hugeicons:chef',
            },
            {
                title: 'Cashier / Kasir',
                href: '/admin/users-management/cashiers',
                icon: 'hugeicons:cashier',
            },
            {
                title: 'Courier / Kurir',
                href: '/admin/users-management/couriers',
                icon: 'mdi:courier-fast',
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
    {
        group: 'MANAJEMEN ORDER / PESANAN',
        items: [
            {
                title: 'Semua Order',
                href: '/admin/order-management/all-orders',
                icon: 'material-symbols:receipt-long',
            },
            // {
            //     title: 'Order Baru',
            //     href: '/admin/order-management/new-orders',
            //     icon: 'lets-icons:order',
            // },
            // {
            //     title: 'Order Dikonfirmasi & Diproses',
            //     href: '/admin/order-management/confirmed-orders',
            //     icon: 'material-symbols:checklist',
            // },
            // {
            //     title: 'Order Dimasak & Selesai Dimasak',
            //     href: '/admin/order-management/cooking-orders',
            //     icon: 'material-symbols:cooking',
            // },
            // {
            //     title: 'Order Siap Disajikan & Diantar',
            //     href: '/admin/order-management/delivering-orders',
            //     icon: 'icon-park-outline:delivery',
            // },
            // {
            //     title: 'Order Dalam Pengiriman',
            //     href: '/admin/order-management/delivered-orders',
            //     icon: 'carbon:delivery',
            // },
            // {
            //     title: 'Order Selesai',
            //     href: '/admin/order-management/done-orders',
            //     icon: 'material-symbols:done',
            // },
            // {
            //     title: 'Order Dibatalkan',
            //     href: '/admin/order-management/canceled-orders',
            //     icon: 'material-symbols:cancel',
            // },
        ],
    },
    {
        group: 'LAPORAN KEUANGAN',
        items: [
            {
                title: 'Pemasukan',
                href: '/admin/financial-reports/revenue',
                icon: 'tabler:cash-plus',
            },
            {
                title: 'Pengeluaran',
                href: '/admin/financial-reports/expenses',
                icon: 'mdi:cash-minus',
            },
        ],
    },
    {
        group: 'PENGATURAN',
        items: [
            {
                title: 'Biaya',
                href: '/admin/settings/fee',
                icon: 'tabler:cash',
            },
        ],
    },
];

export default mainNavItems;
