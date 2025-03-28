<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index_all_users(): Response
    {
        $users = User::with('roles')
            ->get()
            ->map(function ($user) {
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
        $user = User::create($request->validated());
        $user->syncRoles($request->roles);

        if ($user->hasRole('customer')) {
            Customer::create([
                'user_id' => $user->id,
            ]);
        }
        return redirect()
            ->route('admin.all-users.index')
            ->with(['success' => 'User berhasil ditambahkan']);
    }

    public function edit(int $id): Response
    {
        $user = User::findOrFail($id);
        $user->getRoleNames();
        return Inertia::render('admin/users-management/all-users/pages/edit', [
            'user' => $user,
        ]);
    }

    public function update(UserRequest $request, int $id): RedirectResponse
    {
        $user = User::findOrFail($id);
        $oldRoles = $user->getRoleNames();

        $user->update($request->validated());
        if ($request->filled('roles')) {
            $user->syncRoles($request->roles);
        }

        $newRoles = $user->getRoleNames();
        if ($oldRoles->contains('customer') && !$newRoles->contains('customer')) {
            $user->customer()->delete();
        }

        return redirect()
            ->route('admin.all-users.index')
            ->with(['success' => 'User berhasil diperbarui']);
    }

    public function destroy(Request $request, int $userId): RedirectResponse
    {
        $request->validate(
            [
                'password' => 'required',
            ],
            [
                'password.required' => 'Password harus diisi',
            ],
        );

        $user = User::findOrFail($userId);

        if (!Hash::check($request->input('password'), $user->password)) {
            return back()->withErrors(['password' => 'Password salah']);
        }

        $user->delete();

        return redirect()
            ->route('admin.all-users.index')
            ->with(['success' => 'User berhasil dihapus']);
    }
}
