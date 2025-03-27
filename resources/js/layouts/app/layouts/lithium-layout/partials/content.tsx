import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function LithiumContent({ variant = 'header', children, ...props }: AppContentProps) {
    if (variant === 'sidebar') {
        return <SidebarInset {...props}>{children}</SidebarInset>;
    }

    return (
        <main className="container mx-auto flex h-full w-full flex-1 flex-col gap-4 rounded-xl px-4 lg:px-0" {...props}>
            {children}
        </main>
    );
}
