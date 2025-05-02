<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/pages/financial-reports/expense/index');
    }
}
