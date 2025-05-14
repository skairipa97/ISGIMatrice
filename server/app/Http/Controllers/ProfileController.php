<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        
        // Update prenom and nom
        $user->prenom = $request->prenom;
        $user->nom = $request->nom;
        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Update user profile photo
     */
    public function updatePhoto(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // max 5MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        try {
            // Delete old photo if exists
            if ($user->photo && Storage::disk('public')->exists($user->photo)) {
                Storage::disk('public')->delete($user->photo);
            }

            // Store the new photo
            $path = $request->file('photo')->store('profile-photos', 'public');
            $user->photo = $path;
            $user->save();

            // Get the full URL
            $photoUrl = Storage::url($path);
            
            // Log the path and URL for debugging
            \Log::info('Photo path: ' . $path);
            \Log::info('Photo URL: ' . $photoUrl);

            return response()->json([
                'message' => 'Photo updated successfully',
                'photo_url' => $photoUrl,
                'debug_info' => [
                    'path' => $path,
                    'url' => $photoUrl,
                    'storage_path' => Storage::disk('public')->path($path)
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Photo upload error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to upload photo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user password
     */
    public function updatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        // Check if current password matches
        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The provided password does not match your current password.'],
            ]);
        }

        // Update password
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully'
        ]);
    }
}
