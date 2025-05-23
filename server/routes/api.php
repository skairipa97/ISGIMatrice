<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\FormateurController;
use App\Http\Controllers\SeanceController;
use App\Http\Controllers\AbsenceController;
use App\Http\Controllers\JustificationController;
use App\Http\Controllers\PasswordResetController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Profile routes
    Route::put('/user/profile', [ProfileController::class, 'updateProfile']);
    Route::post('/user/profile/photo', [ProfileController::class, 'updatePhoto']);
    Route::put('/user/password', [ProfileController::class, 'updatePassword']);

    // Admin routes
    Route::get('/admin/users/{id}/edit', [AdminController::class, 'edit']);
    Route::put('/admin/users/{id}', [AdminController::class, 'update']);
    Route::get('/admin/absences', [AbsenceController::class, 'adminAbsences']);

    // Groupes
    Route::get('/groups', [GroupController::class, 'index']);
    Route::get('/groupes/{id}', [GroupController::class, 'show']);
    Route::get('/groupes/{groupId}/stagiaires', [GroupController::class, 'stagiaires']);


    // Formateurs
    Route::get('/formateurs/{formateurId}/groups', [FormateurController::class, 'groups']);
    Route::get('/formateurs/{formateurId}/absences', [AbsenceController::class, 'absencesForFormateur']);

    // Seances
    Route::post('/seances', [SeanceController::class, 'store']);

    // Absences
    Route::get('/absences', [AbsenceController::class, 'index']);
    Route::get('/absences/critical', [AbsenceController::class, 'critical']);
    Route::get('/absences/by-group', [\App\Http\Controllers\AbsenceController::class, 'byGroup']);

     // Justification routes
     Route::get('/justifications', [JustificationController::class, 'index']);
     Route::post('/justifications', [JustificationController::class, 'store']);
     Route::get('/justifications/pending', [JustificationController::class, 'pending']);
    Route::put('/justifications/{id}/status', [JustificationController::class, 'updateStatus']);
});

// Password Reset Routes
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])->name('password.reset');
Route::post('/check-token', [PasswordResetController::class, 'checkToken']);
