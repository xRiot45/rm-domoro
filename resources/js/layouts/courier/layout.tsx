import LithiumLayoutTemplate from '@/layouts/courier/layouts/lithium-layout/layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface CourierLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: CourierLayoutProps) => (
    <LithiumLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
    </LithiumLayoutTemplate>
);
