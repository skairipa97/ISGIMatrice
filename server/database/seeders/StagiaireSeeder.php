<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Stagiaire;
use App\Models\Groupe;
use Illuminate\Support\Facades\Hash;

class StagiaireSeeder extends Seeder
{
    public function run()
    {
        $groupe = Groupe::where('libelle', 'FS202')->first();

        Stagiaire::create([
            'matricule' => 'ST001',
            'nom' => 'Ait Hammou',
            'prenom' => 'Aya',
            'password' => Hash::make('AITHAMMOU123'),
            'genre' => 'Femme',
            'date_naissance' => '2002-08-15',
            'photo' => null,
            'adresse' => '123 rue Casablanca',
            'groupe_id' => $groupe->id,
        ]);
    }
}
