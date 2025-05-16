<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Affectation;

class AffectationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
 public function run()
{
    Affectation::create([
        'formateur_id' => 1, 
        'group_id' => 1,     
        'module_id' => 1     
    ]);

    Affectation::create([
        'formateur_id' => 1,
        'group_id' => 1,     
        'module_id' => 2     
    ]);

}
}
