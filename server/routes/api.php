<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\FormateurController;
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

    // Groupes
    Route::get('/groups', [GroupController::class, 'index']);
    Route::get('/groups/{id}', [GroupController::class, 'show']);
    Route::get('/groups/{groupId}/stagiaires', [GroupController::class, 'stagiaires']);


    // Formateurs
    Route::get('/formateurs/{formateurId}/groups', [FormateurController::class, 'groups']);
});