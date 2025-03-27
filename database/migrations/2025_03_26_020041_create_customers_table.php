<?php

use App\Enums\AddressLabelEnum;
use App\Enums\GenderEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('birthplace')->nullable();
            $table->date('birthdate')->nullable();
            $table->string('address')->nullable();
            $table->enum('address_label', AddressLabelEnum::value())->nullable();
            $table->string('note')->nullable();
            $table->enum('gender', GenderEnum::value())->nullable();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
