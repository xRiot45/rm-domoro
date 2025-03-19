import { NavItem } from '@/types';
import { BookOpen, Folder } from 'lucide-react';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: '#',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: '#',
        icon: BookOpen,
    },
];

export default footerNavItems;
