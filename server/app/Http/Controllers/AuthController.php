<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Admin;
use App\Models\Formateur;
use App\Models\Stagiaire;

class AuthController extends Controller
{
    /**
     * Handle login for Admin, Formateur, or Stagiaire
     */
    public function login(Request $request)
    {
        $request->validate([
            'matricule' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = ['matricule' => $request->matricule, 'password' => $request->password];

        // Vérifie dans Admin
        $admin = Admin::where('matricule', $credentials['matricule'])->first();
        if ($admin && Hash::check($credentials['password'], $admin->mdp)) {
            $token = $admin->createToken('admin-token')->plainTextToken;
            return response()->json([
                'user' => $admin,
                'role' => 'admin',
                'token' => $token,
            ]);
        }

        // Vérifie dans Formateur
        $formateur = Formateur::where('matricule', $credentials['matricule'])->first();
        if ($formateur && Hash::check($credentials['password'], $formateur->mdp)) {
            $token = $formateur->createToken('formateur-token')->plainTextToken;
            return response()->json([
                'user' => $formateur,
                'role' => 'formateur',
                'token' => $token,
            ]);
        }

        // Vérifie dans Stagiaire
        $stagiaire = Stagiaire::where('matricule', $credentials['matricule'])->first();
        if ($stagiaire && Hash::check($credentials['password'], $stagiaire->password)) {
            $token = $stagiaire->createToken('stagiaire-token')->plainTextToken;
            return response()->json([
                'user' => $stagiaire,
                'role' => 'stagiaire',
                'token' => $token,
            ]);
        }

        // Sinon, identifiants invalides
        throw ValidationException::withMessages([
            'matricule' => ['Les identifiants sont incorrects.'],
        ]);
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie']);
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
