<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index_all_users(): Response
    {
        $users = User::with('roles')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'roles' => $user->getRoleNames(),
            ];
        });

        return Inertia::render('admin/users-management/all-users/index', [
            'data' => $users,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/users-management/all-users/pages/create');
    }

    public function store(UserRequest $request): RedirectResponse
    {
        $user = User::create($request->all());
        $user->syncRoles($request->roles);
        return redirect()
            ->route('admin.all-users.index')
            ->with(['success' => 'Add user successfully']);
    }
}
