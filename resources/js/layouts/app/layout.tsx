import LithiumLayoutTemplate from '@/layouts/app/layouts/lithium-layout/index';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    return (
        <LithiumLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </LithiumLayoutTemplate>
    );
}
