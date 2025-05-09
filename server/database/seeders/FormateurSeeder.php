<?php

namespace Database\Seeders;

use App\Models\Formateur;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class FormateurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Formateur::create([
            'matricule' => 'F12345',
            'mdp' => Hash::make('password123'),
            'nom' => 'Dupont',
            'prenom' => 'Jean',
            'photo' => null,
            'date_embauche' => '2022-01-01',
        ]);
    }
}
