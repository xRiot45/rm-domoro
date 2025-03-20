<?php

namespace App\Http\Controllers;

use App\Http\Requests\PermissionRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index(): Response
    {
        $permissions = Permission::all();
        return Inertia::render('admin/access-control-management/permissions/index', [
            'data' => $permissions,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/access-control-management/permissions/pages/create');
    }

    public function store(PermissionRequest $request): RedirectResponse
    {
        Permission::create($request->validated());
        return redirect()
            ->route('admin.permissions.index')
            ->with([
                'success' => 'Add permission successfully',
            ]);
    }

    public function edit(int $id): Response
    {
        $permission = Permission::findOrFail($id);
        return Inertia::render('admin/access-control-management/permissions/pages/edit', [
            'permission' => $permission,
        ]);
    }

    public function update(PermissionRequest $request, int $id): RedirectResponse
    {
        $permission = Permission::findOrFail($id);
        $permission->update($request->validated());
        return redirect()
            ->route('admin.permissions.index')
            ->with([
                'success' => 'Update permission successfully',
            ]);
    }

    public function destroy(int $id): RedirectResponse
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();
        return redirect()
            ->route('admin.permissions.index')
            ->with([
                'success' => 'Delete permission successfully',
            ]);
    }

    public function destroy_all(): RedirectResponse
    {
        Permission::query()->delete();
        return redirect()
            ->route('admin.permissions.index')
            ->with([
                'success' => 'Delete all permission successfully',
            ]);
    }
}
