interface PermissionPivot {
    role_id: number;
    permission_id: number;
}

interface Permission {
    id: number;
    name: string;
    pivot: PermissionPivot;
}

interface ManageRolePermission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions: Permission[];
}

interface ManageRolePermissionForm {
    permission_id: number[];
    role_id: number;
}

export type { ManageRolePermission, ManageRolePermissionForm };
