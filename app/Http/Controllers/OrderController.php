<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index_cashier(): Response
    {
        return Inertia::render('cashier/pages/order/index');
    }
}
