<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

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
        return Inertia::render('admin/master-data/roles/pages/create/index');
    }

    public function store(RoleRequest $request): RedirectResponse
    {
        Role::create($request->validated());
        return redirect()->route('admin.roles.index')->with([
            'success' => 'Add role successfully',
        ]);
    }
}
