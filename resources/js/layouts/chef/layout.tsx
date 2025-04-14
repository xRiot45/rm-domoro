import LithiumLayoutTemplate from '@/layouts/chef/layouts/lithium-layout/layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface ChefLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: ChefLayoutProps) => (
    <LithiumLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
    </LithiumLayoutTemplate>
);
