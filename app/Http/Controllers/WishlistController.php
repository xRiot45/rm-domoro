<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    public function index_customer(): Response
    {
        $wishlists = Wishlist::with('menuItem.menuCategory')
            ->where('user_id', Auth::user()->id)
            ->get();

        return Inertia::render('customer/pages/wishlist/index', [
            'wishlists' => $wishlists,
        ]);
    }

    public function toggle(Request $request): RedirectResponse
    {
        $user = Auth::user();
        $request->validate([
            'menu_item_id' => 'required|exists:menu_items,id',
        ]);

        $wishlist = Wishlist::where('user_id', $user->id)->where('menu_item_id', $request->menu_item_id)->first();

        if ($wishlist) {
            $wishlist->delete();
            return redirect()->back()->with('status', false);
        } else {
            Wishlist::create([
                'user_id' => $user->id,
                'menu_item_id' => $request->menu_item_id,
            ]);
            return redirect()->back()->with('status', true);
        }
    }
}
