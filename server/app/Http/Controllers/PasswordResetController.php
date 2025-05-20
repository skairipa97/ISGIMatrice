<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Auth\Events\PasswordReset;
use App\Models\Stagiaire;
use App\Notifications\StagiaireResetPassword;

class PasswordResetController extends Controller
{
   
    public function forgotPassword(Request $request)
    {
    $request->validate(['email' => 'required|email']);

    $stagiaire = Stagiaire::where('email', $request->email)->first();
    if (!$stagiaire) {
        return response()->json(['message' => 'Email not found'], 404);
    }

    // Token generation remains for password reset validation
    Password::broker('stagiaires')->createToken($stagiaire);
    
    return response()->json([
        'message' => 'Password reset allowed',
     
    ]);
}


    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $stagiaire = Stagiaire::where('email', $request->email)->firstOrFail();
        
        $stagiaire->forceFill([
            'password' => Hash::make($request->password)
        ])->save();

        return response()->json(['message' => 'Password reset successfully']);
    }
}