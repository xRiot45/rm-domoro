import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        snap: any;
    }

    interface PageProps {
        flash: { [key: string]: string };
    }
}

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        className: string;
    }
}
