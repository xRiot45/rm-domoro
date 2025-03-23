<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuItemRequest;
use App\Models\MenuItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

            $validated['image_url'] = 'storage/' . $path;
        }

        MenuItem::create($validated);
        return redirect()
            ->route('admin.menu-items.index')
            ->with([
                'success' => 'Menu item created successfully.',
            ]);
    }
}
