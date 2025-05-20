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
use Illuminate\Support\Facades\Mail;

class PasswordResetController extends Controller
{
   
    public function forgotPassword(Request $request)
    {
        try {
            $request->validate([
                    'email' => 'required|email',
            ]);

            $validated = $request->only('email');

            $stagiaire = Stagiaire::where('email', $validated['email'])->first();


        if($stagiaire){
                $token = Str::random(60);
                $stagiaire->remember_token = $token;
                $stagiaire->remember_token_expires_at = now()->addHours(1);
                $stagiaire->save();

                $url = env('FRONTEND_URL') . "/reset-password?token=" . $token;
                Mail::send('emails.reset-password', ['url' => $url], function ($message) use ($stagiaire) {
                    $message->to($stagiaire->email)->subject('Reset Password');
                });

            }

             return response()->json(['message' => 'Reset link sent to your email if we have it in our database'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred. Please try again.'], 500);
        }
    }


    public function resetPassword(Request $request)
    {
        try {
            $request->validate([
                'token' => 'required',
                'email' => 'required|email',
                'password' => 'required|min:8|confirmed',
        ]);

        $stagiaire = Stagiaire::where('email', $request->email)->first();

        $isTokenExpired = now()->gt($stagiaire->remember_token_expires_at);

        if(!$stagiaire || $isTokenExpired){
            return response()->json(['message' => 'Invalid email or token expired'], 400);
        }

        $stagiaire->password = Hash::make($request->password);
        $stagiaire->remember_token = null;
        $stagiaire->remember_token_expires_at = null;
        $stagiaire->email_verified_at = now();
        $stagiaire->save();

        return response()->json(['message' => 'Password reset successfully'], 200);

        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred. Please try again.' . $e->getMessage()], 500);
        }
    }




    public function checkToken(Request $request)
    {
        $request->validate([
            'token' => 'required'
        ]);

        $token = $request->input('token');

        $stagiaire = Stagiaire::where('remember_token', $token)->first();

        $isExpired = now()->gt($stagiaire->remember_token_expires_at);

        if(!$stagiaire || $isExpired){
            return response()->json(['valid' => false], 400);
        }

        return response()->json(['valid' => true, 'stagiaire' => $stagiaire], 200);
    }

}