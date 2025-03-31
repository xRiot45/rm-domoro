<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\CustomerProfileRequest;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
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

        $avatarPath = $customer->user->avatar;
        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            if ($customer->user->avatar && Storage::disk('public')->exists(str_replace('/storage/', '', $customer->user->avatar))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $customer->user->avatar));
            }

            $file = $request->file('avatar');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('', $filename, 'public');

            $avatarPath = '/storage/' . $path;
        }

        $customer->update($request->except(['full_name', 'phone_number', 'avatar']));
        $customer->user->update([
            'full_name' => $request->input('full_name', $customer->user->full_name),
            'phone_number' => $request->input('phone_number', $customer->user->phone_number),
            'avatar' => $avatarPath,
        ]);

        return redirect()->back()->with('success', 'Profile updated successfully');
    }
}
