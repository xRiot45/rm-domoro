<?php

namespace App\Http\Controllers;

use App\Http\Requests\FeeRequest;
use App\Models\Fee;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FeeController extends Controller
{
    public function index_admin(): Response
    {
        $data = Fee::all();
        return Inertia::render('admin/pages/settings/fee/index', [
            'data' => $data
        ]);
    }

    public function update(FeeRequest $request, int $feeId): RedirectResponse
    {
        $fee = Fee::findOrFail($feeId);
        $validated = $request->validated();
        $fee->update($validated);

        return redirect()->back()->with(['success' => 'Update fee berhasil']);
    }
}
