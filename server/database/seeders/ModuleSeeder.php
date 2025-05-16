<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Module;
use Illuminate\Support\Facades\DB;

class ModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Désactiver les contraintes de clé étrangère temporairement
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Module::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $modules = [
            [
                'id' => 1,
                'libelle' => 'Développement Web',
             
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 2,
                'libelle' => 'Réseaux Informatiques',
               
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 3,
                'libelle' => 'Marketing Digital',
               
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 4,
                'libelle' => 'Base de Données',
              
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 5,
                'libelle' => 'Systèmes d\'Exploitation',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        Module::insert($modules);
    }
}