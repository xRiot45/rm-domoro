import HydrogenLayoutTemplate from '@/layouts/courier/layouts/hydrogen-layout/layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <HydrogenLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
    </HydrogenLayoutTemplate>
);
