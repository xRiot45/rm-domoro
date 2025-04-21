<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChefRequest;
use App\Models\Chef;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ChefController extends Controller
{
    public function index(): Response
    {
        $chefs = Chef::with('user')->get();
        return Inertia::render('admin/pages/users-management/chefs/index', [
            'data' => $chefs,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/pages/users-management/chefs/pages/create');
    }

    public function store(ChefRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();
        if (Chef::where('user_id', $validatedData['user_id'])->exists()) {
            return redirect()
                ->route('admin.chefs.index')
                ->with('error', 'User ini sudah terdaftar sebagai koki');
        }

        Chef::create($validatedData);
        return redirect()
            ->route('admin.chefs.index')
            ->with(['success' => 'Koki berhasil ditambahkan']);
    }

    public function edit(int $id): Response
    {
        $chef = Chef::findOrFail($id);
        return Inertia::render('admin/pages/users-management/chefs/pages/edit', [
            'chef' => $chef,
        ]);
    }

    public function update(ChefRequest $request, int $id): RedirectResponse
    {
        $validatedData = $request->validated();
        $chef = Chef::findOrFail($id);
        $chef->update($validatedData);

        return redirect()
            ->route('admin.chefs.index')
            ->with(['success' => 'Koki berhasil diubah']);
    }

    public function destroy(int $id): RedirectResponse
    {
        Chef::findOrFail($id)->delete();
        return redirect()
            ->route('admin.chefs.index')
            ->with(['success' => 'Koki berhasil dihapus']);
    }
}
