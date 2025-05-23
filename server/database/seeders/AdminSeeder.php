<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::create([
            'matricule' => 'SURV002', // Example matricule
            'mdp' => Hash::make('admin123'),
            'nom' =>'admin' ,
            'prenom' => 'admin',
            'photo'=> 'hhhhhhh', // Example password (hashed)
        ]);
    
    }
}
