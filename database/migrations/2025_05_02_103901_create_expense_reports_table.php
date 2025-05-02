<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expense_reports', function (Blueprint $table) {
            $table->id();
            $table->date('report_date');
            $table->text('description')->nullable();
            $table->integer('total_expense');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expense_reports');
    }
};
