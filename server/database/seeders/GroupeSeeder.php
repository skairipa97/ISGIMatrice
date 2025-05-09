<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Groupe;
use App\Models\Filiere;
use App\Models\AnneeScolaire;

class GroupeSeeder extends Seeder
{
    public function run()
    {
        // Supposons qu'on a déjà les filières et années
        $filiereId = Filiere::where('libelle', 'Développement Digital Option Full Stack')->first()->id;
        $anneeId = AnneeScolaire::where('date', '2024-2025')->first()->id;

        Groupe::create([
            'libelle' => 'FS202',
            'filiere_id' => $filiereId,
            'annee_scolaire_id' => $anneeId,
        ]);

        Groupe::create([
            'libelle' => 'DD101',
            'filiere_id' => Filiere::where('libelle', 'Développement Digital')->first()->id,
            'annee_scolaire_id' => $anneeId,
        ]);
    }
}
