<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->cascadeOnDelete();
            $table->foreignId('cashier_id')->nullable()->constrained('cashiers')->cascadeOnDelete();
            $table->foreignId('menu_item_id')->constrained('menu_items')->cascadeOnDelete();
            $table->uuid('session_id');
            $table->integer('quantity');
            $table->integer('unit_price');
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
