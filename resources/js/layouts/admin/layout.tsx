import HydrogenLayoutTemplate from '@/layouts/admin/layouts/hydrogen-layout/index';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AdminLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    return (
        <HydrogenLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </HydrogenLayoutTemplate>
    );
}
