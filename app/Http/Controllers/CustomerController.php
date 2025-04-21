<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index_admin(): Response
    {
        $customers = Customer::with('user')->get();
        return Inertia::render('admin/pages/users-management/customers/index', [
            'data' => $customers,
        ]);
    }

    public function edit(int $id): Response
    {
        $customer = Customer::findOrFail($id);
        return Inertia::render('admin/pages/users-management/customers/pages/edit', [
            'customer' => $customer,
        ]);
    }

    public function update(CustomerRequest $request, int $id): RedirectResponse
    {
        $validatedData = $request->validated();
        $customer = Customer::findOrFail($id);
        $customer->update($validatedData);

        return redirect()
            ->route('admin.customers.index')
            ->with(['success' => 'Data berhasil diubah']);
    }
}
