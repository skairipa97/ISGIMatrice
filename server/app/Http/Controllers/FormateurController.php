<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Affectation;
use App\Models\Groupe;
use Illuminate\Http\Request;

class FormateurController extends Controller
{
    public function groups()
    {
        try {
            $formateur = Auth::user();

            if (!$formateur) {
                Log::error('Aucun utilisateur authentifié.');
                return response()->json(['message' => 'Non authentifié'], 401);
            }

            Log::info('Tentative d\'accès aux groupes pour formateur: ' . $formateur->id);

            // Récupérer les affectations du formateur avec les relations
            $affectations = Affectation::with(['groupe', 'module'])
                ->where('formateur_id', $formateur->id)
                ->get();

            // Structurer les données de réponse
            $response = $affectations->map(function ($affectation) {
                return [
                    'affectation_id' => $affectation->id,
                    'groupe' => [
                        'id' => $affectation->groupe->id ?? null,
                        'libelle' => $affectation->groupe->libelle ?? null,
                    ],
                    'module' => [
                        'id' => $affectation->module->id ?? null,
                        'libelle' => $affectation->module->libelle ?? null,
                    ],
                ];
            });

            return response()->json([
                'success' => true,
                'formateur_id' => $formateur->id,
                'affectations' => $response
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur dans FormateurController@groups: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur interne du serveur'
            ], 500);
        }
    }
}