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
        
        // Utiliser le groupe avec id 1
        $groupe = Groupe::find(1);
        
        if (!$groupe) {
            $groupe = Groupe::create([
                'id' => 1,
                'libelle' => 'FS202',
                'filiere' => 'Informatique',
                'niveau' => '2ème année'
            ]);
        }

        $stagiaires = [
            [
                'matricule' => 'ST001',
                'nom' => 'Ait Hammou',
                'prenom' => 'Aya',
                'password' => Hash::make('AITHAMMOU123'),
                'genre' => 'Femme',
                'date_naissance' => '2002-08-15',
                'photo' => null,
                'adresse' => '123 rue Casablanca',
                'groupe_id' => $groupe->id,
            ],
            [
                'matricule' => 'ST002',
                'nom' => 'Benali',
                'prenom' => 'Karim',
                'password' => Hash::make('BENALI123'),
                'genre' => 'Homme',
                'date_naissance' => '2001-05-20',
                'photo' => null,
                'adresse' => '456 avenue Rabat',
                'groupe_id' => $groupe->id,
            ],
            [
                'matricule' => 'ST003',
                'nom' => 'Chraibi',
                'prenom' => 'Leila',
                'password' => Hash::make('CHRAIBI123'),
                'genre' => 'Femme',
                'date_naissance' => '2000-11-30',
                'photo' => null,
                'adresse' => '789 boulevard Marrakech',
                'groupe_id' => $groupe->id,
            ],
            [
                'matricule' => 'ST004',
                'nom' => 'Daoudi',
                'prenom' => 'Youssef',
                'password' => Hash::make('DAOUDI123'),
                'genre' => 'Homme',
                'date_naissance' => '2002-03-12',
                'photo' => null,
                'adresse' => '101 rue Tanger',
                'groupe_id' => $groupe->id,
            ],
            [
                'matricule' => 'ST005',
                'nom' => 'El Fassi',
                'prenom' => 'Fatima',
                'password' => Hash::make('ELFASSI123'),
                'genre' => 'Femme',
                'date_naissance' => '2001-07-25',
                'photo' => null,
                'adresse' => '202 avenue Fès',
                'groupe_id' => $groupe->id,
            ],
            [
                'matricule' => 'ST006',
                'nom' => 'Ghazi',
                'prenom' => 'Mehdi',
                'password' => Hash::make('GHAZI123'),
                'genre' => 'Homme',
                'date_naissance' => '2000-09-18',
                'photo' => null,
                'adresse' => '303 boulevard Agadir',
                'groupe_id' => $groupe->id,
            ],
            [
                'matricule' => 'ST007',
                'nom' => 'Hassani',
                'prenom' => 'Nadia',
                'password' => Hash::make('HASSANI123'),
                'genre' => 'Femme',
                'date_naissance' => '2002-01-05',
                'photo' => null,
                'adresse' => '404 rue Oujda',
                'groupe_id' => $groupe->id,
            ],
            [
                'matricule' => 'ST008',
                'nom' => 'Idrissi',
                'prenom' => 'Amine',
                'password' => Hash::make('IDRISSI123'),
                'genre' => 'Homme',
                'date_naissance' => '2001-12-22',
                'photo' => null,
                'adresse' => '505 avenue Kenitra',
                'groupe_id' => $groupe->id,
            ],
            [
                'matricule' => 'ST009',
                'nom' => 'Jabri',
                'prenom' => 'Sara',
                'password' => Hash::make('JABRI123'),
                'genre' => 'Femme',
                'date_naissance' => '2000-04-14',
                'photo' => null,
                'adresse' => '606 boulevard Safi',
                'groupe_id' => $groupe->id,
            ],
            [
                'matricule' => 'ST010',
                'nom' => 'Khaldi',
                'prenom' => 'Omar',
                'password' => Hash::make('KHALDI123'),
                'genre' => 'Homme',
                'date_naissance' => '2002-06-08',
                'photo' => null,
                'adresse' => '707 rue Tetouan',
                'groupe_id' => $groupe->id,
            ],
            [
                'matricule' => 'ST011',
                'nom' => 'Lamrani',
                'prenom' => 'Houda',
                'password' => Hash::make('LAMRANI123'),
                'genre' => 'Femme',
                'date_naissance' => '2001-02-19',
                'photo' => null,
                'adresse' => '808 avenue El Jadida',
                'groupe_id' => $groupe->id,
            ],
            [
                'matricule' => 'ST012',
                'nom' => 'Mansouri',
                'prenom' => 'Adil',
                'password' => Hash::make('MANSOURI123'),
                'genre' => 'Homme',
                'date_naissance' => '2000-10-11',
                'photo' => null,
                'adresse' => '909 boulevard Meknès',
                'groupe_id' => $groupe->id,
            ],
            [
                'matricule' => 'ST013',
                'nom' => 'Naciri',
                'prenom' => 'Imane',
                'password' => Hash::make('NACIRI123'),
                'genre' => 'Femme',
                'date_naissance' => '2002-07-03',
                'photo' => null,
                'adresse' => '1010 rue Settat',
                'groupe_id' => $groupe->id,
            ],
            [
                'matricule' => 'ST014',
                'nom' => 'Ouazzani',
                'prenom' => 'Yassin',
                'password' => Hash::make('OUAZZANI123'),
                'genre' => 'Homme',
                'date_naissance' => '2001-09-27',
                'photo' => null,
                'adresse' => '1111 avenue Khouribga',
                'groupe_id' => $groupe->id,
            ],
            [
                'matricule' => 'ST015',
                'nom' => 'Rachidi',
                'prenom' => 'Salma',
                'password' => Hash::make('RACHIDI123'),
                'genre' => 'Femme',
                'date_naissance' => '2000-12-15',
                'photo' => null,
                'adresse' => '1212 boulevard Beni Mellal',
                'groupe_id' => $groupe->id,
            ]
        ];

        foreach ($stagiaires as $stagiaire) {
            Stagiaire::create($stagiaire);
        }
    }
}