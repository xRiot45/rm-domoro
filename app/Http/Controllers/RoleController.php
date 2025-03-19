<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(): Response
    {
        $roles = Role::all();
        return Inertia::render('admin/master-data/roles/index', [
            'data' => $roles,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/master-data/roles/pages/create');
    }

    public function store(RoleRequest $request): RedirectResponse
    {
        Role::create($request->validated());
        return redirect()
            ->route('admin.roles.index')
            ->with([
                'success' => 'Add role successfully',
            ]);
    }

    public function edit(int $id): Response
    {
        $role = Role::findOrFail($id);
        return Inertia::render('admin/master-data/roles/pages/edit', [
            'role' => $role,
        ]);
    }

    public function update(RoleRequest $request, int $id): RedirectResponse
    {
        $role = Role::findOrFail($id);
        $role->update($request->validated());
        return redirect()
            ->route('admin.roles.index')
            ->with([
                'success' => 'Update role successfully',
            ]);
    }

    public function destroy(int $id): RedirectResponse
    {
        $role = Role::findOrFail($id);
        $role->delete();
        return redirect()
            ->route('admin.roles.index')
            ->with([
                'success' => 'Delete role successfully',
            ]);
    }
}
