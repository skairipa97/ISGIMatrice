<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'first_name' => 'Aicha',
            'last_name' => 'FATIHI',
            'matrice' => '979797',
            'password' => Hash::make('isgi97'),
            'matrice_verified_at' => now(),
        ]);
    }
}
