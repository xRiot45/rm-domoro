<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index_admin(): Response
    {
        return Inertia::render('admin/dashboard');
    }

    public function index_courier(): Response
    {
        return Inertia::render('courier/dashboard');
    }

    public function index_cashier(): Response
    {
        return Inertia::render('cashier/dashboard');
    }

    public function index_chef(): Response
    {
        return Inertia::render('chef/dashboard');
    }
}
