<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuCategoryRequest;
use App\Models\MenuCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MenuCategoryController extends Controller
{
    public function index(): Response
    {
        $menu_categories = MenuCategory::all();
        return Inertia::render('admin/menu-management/menu-categories/index', [
            'data' => $menu_categories,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/menu-management/menu-categories/pages/create');
    }

    public function store(MenuCategoryRequest $request): RedirectResponse
    {
        MenuCategory::create($request->validated());
        return redirect()
            ->route('admin.menu-categories.index')
            ->with([
                'success' => 'Add menu category successfully',
            ]);
    }

    public function edit(int $id): Response
    {
        $menu_category = MenuCategory::findOrFail($id);
        return Inertia::render('admin/menu-management/menu-categories/pages/edit', [
            'menu_category' => $menu_category,
        ]);
    }

    public function update(MenuCategoryRequest $request, int $id): RedirectResponse
    {
        $menu_category = MenuCategory::findOrFail($id);
        $menu_category->update($request->validated());
        return redirect()
            ->route('admin.menu-categories.index')
            ->with([
                'success' => 'Update menu category successfully',
            ]);
    }

    public function destroy(int $id): RedirectResponse
    {
        $menu_category = MenuCategory::findOrFail($id);
        $menu_category->delete();
        return redirect()
            ->route('admin.menu-categories.index')
            ->with([
                'success' => 'Delete menu category successfully',
            ]);
    }

    public function destroy_all(): RedirectResponse
    {
        MenuCategory::query()->delete();
        return redirect()
            ->route('admin.menu-categories.index')
            ->with([
                'success' => 'Delete all menu category successfully',
            ]);
    }
}
