import { NavGroup } from '@/types';
import { DatabaseIcon, LayoutGrid } from 'lucide-react';

const mainNavItems: NavGroup[] = [
    {
        group: 'Platform',
        items: [
            {
                title: 'Dashboard',
                href: '/admin/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Master Data',
                href: '#',
                icon: DatabaseIcon,
                menu: [
                    {
                        title: 'Users',
                        href: '/admin/master-data/users',
                    },
                    {
                        title: 'Roles',
                        href: '/admin/master-data/roles',
                    },
                ],
            },
        ],
    },
];

export default mainNavItems;
