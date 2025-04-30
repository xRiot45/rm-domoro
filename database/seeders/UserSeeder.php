<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->first();

        if (!$adminRole) {
            $this->command->error("Role 'admin' belum ada. Jalankan RoleSeeder terlebih dahulu.");
            return;
        }

        $admin = User::create([
            'full_name' => 'Admin Utama',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('12345678'),
            'phone_number' => '081234567890',
            'avatar' => null,
        ]);

        $admin->assignRole($adminRole);
    }
}
