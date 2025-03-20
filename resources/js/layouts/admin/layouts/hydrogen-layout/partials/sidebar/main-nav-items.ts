import { NavGroup } from '@/types';

const mainNavItems: NavGroup[] = [
    {
        group: 'Platform',
        items: [
            {
                title: 'Dashboard',
                href: '/admin/dashboard',
                icon: 'material-symbols:dashboard',
            },
        ],
    },
    {
        group: 'Manajemen Kontrol Akses',
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
        ],
    },
];

export default mainNavItems;
