<?php

use App\Enums\EmployeeStatusEnum;
use App\Enums\GenderEnum;
use App\Enums\JobTypeEnum;
use App\Enums\ShiftEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('chefs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('hired_at')->default(now());
            $table->date('stopped_at')->nullable();
            $table->integer('salary')->default(0);
            $table->enum('gender', GenderEnum::value());
            $table->enum('shift', ShiftEnum::value())->default(ShiftEnum::Morning->value);
            $table->enum('status', EmployeeStatusEnum::value())->default(EmployeeStatusEnum::Work->value);
            $table->enum('job_type', JobTypeEnum::value())->default(JobTypeEnum::FullTime->value);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chefs');
    }
};
