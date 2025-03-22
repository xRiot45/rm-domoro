import LithiumLayoutTemplate from '@/layouts/cashier/layouts/lithium-layout/layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <LithiumLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
    </LithiumLayoutTemplate>
);
