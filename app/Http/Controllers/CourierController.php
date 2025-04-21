<?php

namespace App\Http\Controllers;

use App\Http\Requests\CourierRequest;
use App\Models\Courier;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CourierController extends Controller
{
    public function index(): Response
    {
        $couriers = Courier::with('user')->get();
        return Inertia::render('admin/pages/users-management/couriers/index', [
            'data' => $couriers,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/pages/users-management/couriers/pages/create');
    }

    public function store(CourierRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();
        if (Courier::where('user_id', $validatedData['user_id'])->exists()) {
            return redirect()->route('admin.couriers.index')->with('error', 'User ini sudah terdaftar sebagai kurir');
        }

        Courier::create($validatedData);
        return redirect()
            ->route('admin.couriers.index')
            ->with(['success' => 'Kurir berhasil ditambahkan']);
    }

    public function edit(int $id): Response
    {
        $courier = Courier::findOrFail($id);
        return Inertia::render('admin/pages/users-management/couriers/pages/edit', [
            'courier' => $courier,
        ]);
    }

    public function update(CourierRequest $request, int $id): RedirectResponse
    {
        $validatedData = $request->validated();
        $courier = Courier::findOrFail($id);
        $courier->update($validatedData);

        return redirect()
            ->route('admin.couriers.index')
            ->with(['success' => 'Kurir berhasil diubah']);
    }

    public function destroy(int $id): RedirectResponse
    {
        Courier::findOrFail($id)->delete();
        return redirect()
            ->route('admin.couriers.index')
            ->with(['success' => 'Koki berhasil dihapus']);
    }
}
