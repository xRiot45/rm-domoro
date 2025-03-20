<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index(): Response
    {
        $permissions = Permission::all();
        return Inertia::render('admin/master-data/permission/index', [
            'data' => $permissions,
        ]);
    }
}
