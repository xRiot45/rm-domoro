import LithiumLayoutTemplate from '@/layouts/cashier/layouts/lithium-layout/layout';
import { Transaction } from '@/models/transaction';
import { type BreadcrumbItem } from '@/types';
import { useEffect, type ReactNode } from 'react';

interface CashierLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    onNewOrder?: (order: Transaction) => void;
}

export default ({ children, breadcrumbs, onNewOrder, ...props }: CashierLayoutProps) => {
    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.channel(`orders`);
        channel.listen('.order-created', (event: { transaction: Transaction }) => {
            if (onNewOrder != null && event.transaction) {
                onNewOrder(event.transaction);
            }
        });

        return () => {
            channel.stopListening('.order-created');
            window.Echo.leave(`orders`);
        };
    }, [onNewOrder]);

    return (
        <LithiumLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </LithiumLayoutTemplate>
    );
};
