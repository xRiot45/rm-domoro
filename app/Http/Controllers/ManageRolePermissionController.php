<?php

namespace App\Http\Controllers;

use App\Http\Requests\ManageRolePermissionRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class ManageRolePermissionController extends Controller
{
    public function index(): Response
    {
        $role_has_permissions = Role::with('permissions:id,name')->get();
        return Inertia::render('admin/access-control-management/manage-role-permissions/index', [
            'data' => $role_has_permissions,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/access-control-management/manage-role-permissions/pages/create');
    }

    public function store(ManageRolePermissionRequest $request): RedirectResponse
    {
        $role = Role::findOrFail($request->role_id);
        $permissions = Permission::whereIn('id', $request->permission_id)->pluck('name')->toArray();
        $role->syncPermissions($permissions);
        return redirect()
            ->route('admin.manage-role-permission.index')
            ->with(['success' => 'Set role permission successfully']);
    }
}
