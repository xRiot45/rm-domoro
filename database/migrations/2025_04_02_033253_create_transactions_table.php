<?php

use App\Enums\OrderTypeEnum;
use App\Enums\PaymentMethodEnum;
use App\Enums\PaymentStatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->cascadeOnDelete();
            $table->foreignId('cashier_id')->nullable()->constrained('cashiers')->cascadeOnDelete();
            $table->enum('order_type', OrderTypeEnum::value())->nullable();
            $table->enum('payment_method', PaymentMethodEnum::value())->nullable();
            $table->enum('payment_status', PaymentStatusEnum::value());
            $table->integer('cash_received')->default(0);
            $table->integer('change')->default(0);
            $table->string('table_number')->nullable();
            $table->string('shipping_address')->nullable();
            $table->string('recipient')->nullable();
            $table->string('recipient_phone_number')->nullable();
            $table->string('note')->nullable();
            $table->foreignId('chef_id')->nullable()->constrained('chefs')->cascadeOnDelete();
            $table->foreignId('courier_id')->nullable()->constrained('couriers')->cascadeOnDelete();
            $table->integer('total_price')->default(0);
            $table->integer('delivery_fee')->default(0); // Biaya pengantaran
            $table->integer('service_charge')->default(0); // Biaya layanan
            $table->integer('discount')->default(0); // Diskon jika ada
            $table->integer('tax')->default(0); // Pajak
            $table->integer('final_total')->default(0); // Total akhir
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
