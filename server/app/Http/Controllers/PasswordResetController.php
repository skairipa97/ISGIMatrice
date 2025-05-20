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
        Log::info('Password reset request received', ['email' => $request->email, 'ip' => $request->ip()]);

        $request->validate([
            'email' => 'required|email',
        ]);

        $stagiaire = Stagiaire::where('email', $request->email)->first();
        if (!$stagiaire) {
            Log::warning('Password reset attempt for non-existent email', ['email' => $request->email]);
            return response()->json(['message' => 'Email not found in our records'], 404);
        }

        $token = Password::broker('stagiaires')->createToken($stagiaire);
       
        return response()->json(['message' => 'Reset link sent to your email'], 200);
    }


    public function resetPassword(Request $request)
    {
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed',
    ]);

    $status = Password::broker('stagiaires')->reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            $user->forceFill([
                'password' => Hash::make($password)
            ])->setRememberToken(Str::random(60));
            
            $user->save();
            event(new PasswordReset($user));
        }
    );

    return $status === Password::PASSWORD_RESET
        ? response()->json(['message' => 'Password reset successfully'])
        : response()->json(['message' => 'Unable to reset password', 'error' => $status], 400);
}

}