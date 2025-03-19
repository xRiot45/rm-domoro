<?php

namespace App\Http\Controllers;

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
}
