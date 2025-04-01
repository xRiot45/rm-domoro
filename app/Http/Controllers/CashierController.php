<?php

namespace App\Http\Controllers;

use App\Http\Requests\CashierRequest;
use App\Models\Cashier;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CashierController extends Controller
{
    public function index(): Response
    {
        $cashiers = Cashier::with('user')->get();
        return Inertia::render('admin/users-management/cashiers/index', [
            'data' => $cashiers,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/users-management/cashiers/pages/create');
    }

    public function store(CashierRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();
        if (Cashier::where('user_id', $validatedData['user_id'])->exists()) {
            return redirect()
                ->route('admin.cashiers.index')
                ->with('error', 'User ini sudah terdaftar sebagai kasir');
        }

        Cashier::create($validatedData);
        return redirect()
            ->route('admin.cashiers.index')
            ->with(['success' => 'Cashier berhasil ditambahkan']);
    }


    public function edit(int $id): Response
    {
        $cashier = Cashier::findOrFail($id);
        return Inertia::render('admin/users-management/cashiers/pages/edit', [
            'cashier' => $cashier,
        ]);
    }

    public function update(CashierRequest $request, int $id): RedirectResponse
    {
        $validatedData = $request->validated();
        $cashier = Cashier::findOrFail($id);
        $cashier->update($validatedData);

        return redirect()
            ->route('admin.cashiers.index')
            ->with(['success' => 'Cashier berhasil diubah']);
    }

    public function destroy(int $id): RedirectResponse
    {
        Cashier::findOrFail($id)->delete();
        return redirect()
            ->route('admin.cashiers.index')
            ->with(['success' => 'Cashier berhasil dihapus']);
    }
}
