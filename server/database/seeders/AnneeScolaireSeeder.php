<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AnneeScolaire;

class AnneeScolaireSeeder extends Seeder
{
    public function run()
    {
        $annees = [
            ['date' => '2023-2024'],
            ['date' => '2024-2025'],
        ];

        AnneeScolaire::insert($annees);
    }
}
