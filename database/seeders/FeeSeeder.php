<?php

namespace Database\Seeders;

use App\Models\Fee;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FeeSeeder extends Seeder
{
    public function run(): void
    {
        Fee::updateOrCreate(['type' => 'delivery'], ['amount' => 5000]);
        Fee::updateOrCreate(['type' => 'service'], ['amount' => 2000]);
        Fee::updateOrCreate(['type' => 'discount'], ['amount' => 2000]);
        Fee::updateOrCreate(['type' => 'tax'], ['amount' => 500]);
    }
}
