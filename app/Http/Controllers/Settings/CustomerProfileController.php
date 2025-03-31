<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\CustomerProfileRequest;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CustomerProfileController extends Controller
{
    public function index_profile(): Response
    {
        $customer = Customer::with('user')->where('user_id', Auth::id())->first();
        return Inertia::render('customer/pages/settings/profile', [
            'customer' => $customer,
        ]);
    }

    public function update_profile(CustomerProfileRequest $request): RedirectResponse
    {
        $customer = Customer::with('user')->where('user_id', Auth::id())->first();
        if (!$customer) {
            return redirect()->back()->with('error', 'Customer not found');
        }

        $customer->update($request->except(['full_name', 'phone_number']));
        $customer->user->update([
            'full_name' => $request->input('full_name'),
            'phone_number' => $request->input('phone_number'),
        ]);

        return redirect()->back()->with('success', 'Profile updated successfully');
    }
}
