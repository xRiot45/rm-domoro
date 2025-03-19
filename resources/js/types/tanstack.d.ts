

export interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
}

export interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}
