<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Stagiaire;
use App\Models\Groupe;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class StagiaireSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('fr_FR');

        // Créer ou récupérer le groupe DD101
        $groupe = Groupe::firstOrCreate(
            ['libelle' => 'DD101'],
            [
                'filiere' => 'Développement Digital',
                'niveau' => '1ère année'
            ]
        );

       
            $stagiaires = [
                [
                    'matricule' => 'DD101-ST001',
                    'nom' => 'Zahraoui',
                    'prenom' => 'Nabil',
                    'email' => $faker->unique()->safeEmail,
                    'password' => Hash::make('ZAHRAOUI123'),
                    'genre' => 'Homme',
                    'date_naissance' => '2004-03-22',
                    'photo' => null,
                    'adresse' => 'Rue Nador, Casablanca',
                    'groupe_id' => $groupe->id,
                ],
                [
                    'matricule' => 'DD101-ST002',
                    'nom' => 'Lahlou',
                    'prenom' => 'Khadija',
                    'email' => $faker->unique()->safeEmail,
                    'password' => Hash::make('LAHLOU123'),
                    'genre' => 'Femme',
                    'date_naissance' => '2004-07-10',
                    'photo' => null,
                    'adresse' => 'Rue Berkane, Rabat',
                    'groupe_id' => $groupe->id,
                ],
            
            
            
          
            [
                'matricule' => 'DD101-ST003',
                'nom' => 'El Idrissi',
                'prenom' => 'Hamza',
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('IDRISSI123'),
                'genre' => 'Homme',
                'date_naissance' => '2003-12-10',
                'photo' => null,
                'adresse' => 'Bd Zerktouni, Marrakech',
                'groupe_id' => $groupe->id,
            ],
            [
                'matricule' => 'DD101-ST004',
                'nom' => 'Bouchaib',
                'prenom' => 'Sanae',
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('BOUCHAIB123'),
                'genre' => 'Femme',
                'date_naissance' => '2004-06-05',
                'photo' => null,
                'adresse' => 'Rue Fès, Fès',
                'groupe_id' => $groupe->id,
            ],
        ];

        foreach ($stagiaires as $stagiaire) {
            Stagiaire::create($stagiaire);
        }
    }
}
