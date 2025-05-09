<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Filiere;

class FiliereSeeder extends Seeder
{
    public function run()
    {
        $filieres = [
            ['libelle' => 'Développement Digital'],
            ['libelle' => 'Infrastructure Digitale'],
            ['libelle' => 'Développement Digital Option Mobile'],
            ['libelle' => 'Développement Digital Option Full Stack'],
            ['libelle' => 'Infrastructure Digitale Option Système Réseau'],
            ['libelle' => 'Infrastructure Digitale Option Cyber Sécurité'],
            ['libelle' => 'Finance'],
            ['libelle' => 'Ressources Humaines'],
            ['libelle' => 'Gestion'],
        ];

        Filiere::insert($filieres);
    }
}
