import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';
import { LithiumContent } from './partials/content';
import { LithiumFooter } from './partials/footer';
import { LithiumHeader } from './partials/headers/header';
import { LithiumShell } from './partials/shell';

export default function LithiumLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <LithiumShell>
            <LithiumHeader breadcrumbs={breadcrumbs} />
            <LithiumContent>{children}</LithiumContent>
            <LithiumFooter />
        </LithiumShell>
    );
}
