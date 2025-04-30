<?php

namespace App\Http\Controllers;

use App\Models\RevenueReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RevenueReportController extends Controller
{
    public function index(): Response
    {
        $revenueReports = RevenueReport::all();
        return Inertia::render('admin/pages/financial-reports/revenue/index', [
            'data' => $revenueReports,
        ]);
    }
}
