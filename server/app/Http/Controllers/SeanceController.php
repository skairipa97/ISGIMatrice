<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use App\Models\Absence;
use App\Models\Stagiaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class SeanceController extends Controller
{
    public function store(Request $request)
    {
        \Log::info('Request data:', $request->all()); // Log les données reçues
        
        try {
            $validated = $request->validate([
                'seance.date' => 'required|date',
                'seance.type' => 'required|in:presentiel,a distance',
                'seance.lieu' => 'required|string',
                'seance.duree' => 'required|numeric',
                'seance.groupe_id' => 'required|exists:groupes,id',
                'seance.module_id' => 'required|exists:modules,id',
                'seance.formateur_id' => 'required|exists:formateurs,id',
                'absences' => 'required|array',
                'absences.*.stagiaire_matricule' => 'required|exists:stagiaires,matricule'
            ]);

            // Vérifier si une séance similaire existe déjà pour ce formateur dans la journée
            $existingSeance = Seance::where('formateur_id', $validated['seance']['formateur_id'])
                ->where('groupe_id', $validated['seance']['groupe_id'])
                ->where('type', $validated['seance']['type'])
                ->whereDate('date', $validated['seance']['date'])
                ->first();

            if ($existingSeance) {
                return response()->json([
                    'message' => 'Vous avez déjà programmé une séance de ce type pour ce groupe aujourd\'hui.',
                    'existing_seance' => $existingSeance
                ], 422);
            }

            DB::beginTransaction();

            $seance = Seance::create($validated['seance']);
            $duree = $seance->duree;
            foreach ($validated['absences'] as $absence) {
                Absence::create([
                    'seance_id' => $seance->id,
                    'stagiaire_matricule' => $absence['stagiaire_matricule']
                ]);
                // Update note_de_discipline
                $stagiaire = Stagiaire::where('matricule', $absence['stagiaire_matricule'])->first();
                if ($stagiaire) {
                    if ($duree == 5) {
                        $stagiaire->note_de_discipline = $stagiaire->note_de_discipline - 0.5;
                    } elseif ($duree == 2.5) {
                        $stagiaire->note_de_discipline = $stagiaire->note_de_discipline - 0.25;
                    }
                    $stagiaire->save();
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Enregistrement réussi',
                'data' => $seance
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error in SeanceController: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}