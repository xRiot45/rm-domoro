interface RoleForm {
    name: string;
}

interface Role {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export type { Role, RoleForm };
