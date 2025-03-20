export interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
}

export interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export interface DataTablePaginationProps<TData> {
    table: Table<TData>;
}

export interface DataTableFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>;
    title?: string;
    options: {
        label: string;
        value: string;
        icon?: React.ComponentType<{ className?: string }>;
    }[];
}

export interface DataTableViewOptionsProps<TData> {
    table: Table<TData>;
}
