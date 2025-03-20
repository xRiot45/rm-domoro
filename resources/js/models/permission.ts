interface PermissionForm {
    name: string;
}

interface Permission {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export type { Permission, PermissionForm };
