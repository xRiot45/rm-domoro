<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuItemRequest;
use App\Models\MenuItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MenuItemController extends Controller
{
    public function index_admin(): Response
    {
        $data = MenuItem::with('menuCategory')->get();
        return Inertia::render('admin/menu-management/menu-items/index', [
            'data' => $data,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/menu-management/menu-items/pages/create');
    }

    public function store(MenuItemRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        if ($request->hasFile('image_url') && $request->file('image_url')->isValid()) {
            $file = $request->file('image_url');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('', $filename, 'public');

            $validated['image_url'] = '/' . 'storage/' . $path;
        }

        MenuItem::create($validated);
        return redirect()
            ->route('admin.menu-items.index')
            ->with([
                'success' => 'Menu item created successfully.',
            ]);
    }

    public function edit(int $id): Response
    {
        $menu_item = MenuItem::findOrFail($id);
        return Inertia::render('admin/menu-management/menu-items/pages/edit', [
            'menu_item' => $menu_item,
        ]);
    }

    public function update(MenuItemRequest $request, int $id): RedirectResponse
    {
        $menuItem = MenuItem::findOrFail($id);
        $validated = $request->validated();
        if ($request->hasFile('image_url') && $request->file('image_url')->isValid()) {
            $oldImagePath = $menuItem->image_url;
            $file = $request->file('image_url');
            $filename = time() . '_' . $file->getClientOriginalName();
            $imagePath = $file->storeAs('', $filename, 'public');

            if ($oldImagePath) {
                $oldImagePath = str_replace('/storage/', '', $oldImagePath);
                if (Storage::disk('public')->exists($oldImagePath)) {
                    Storage::disk('public')->delete($oldImagePath);
                }
            }

            $validated['image_url'] = '/' . 'storage/' . $imagePath;
        }

        $menuItem->update($validated);

        return redirect()
            ->route('admin.menu-items.index')
            ->with(['success' => 'Menu item updated successfully.']);
    }

    public function destroy(int $id): RedirectResponse
    {
        $menu_item = MenuItem::findOrFail($id);
        if ($menu_item->image_url) {
            $path = str_replace('/storage/', '', $menu_item->image_url);

            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }

        $menu_item->delete();
        return redirect()
            ->route('admin.menu-items.index')
            ->with([
                'success' => 'Menu item deleted successfully.',
            ]);
    }

    public function destroy_all(): RedirectResponse
    {
        $menu_items = MenuItem::all();
        foreach ($menu_items as $menu_item) {
            if ($menu_item->image_url) {
                $path = str_replace('/storage/', '', $menu_item->image_url);

                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }
        }

        MenuItem::truncate();
        return redirect()
            ->route('admin.menu-items.index')
            ->with([
                'success' => 'All menu items deleted successfully.',
            ]);
    }
}
