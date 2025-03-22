import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { HydrogenContent } from './partials/content';
import { HydrogenShell } from './partials/shell';
import { HydrogenSidebar } from './partials/sidebar/sidebar';
import { HydrogenSidebarHeader } from './partials/sidebar/sidebar-header';

export default function HydrogenLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <HydrogenShell variant="sidebar">
            <HydrogenSidebar />
            <HydrogenContent variant="sidebar">
                <HydrogenSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </HydrogenContent>
        </HydrogenShell>
    );
}
