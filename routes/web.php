<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log; // For logging
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    $user = Auth::user(); // Safely get the user
    Log::info('Accessed the Welcome page.', [
        'method' => request()->method(),
        'path' => request()->path(),
        'ip' => request()->ip(),
        'user_id' => Auth::check() ? $user->id : 'guest', // Check if user is authenticated
        'user_role' => Auth::check() ? $user->role : 'guest', // Check if user is authenticated
    ]);
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Middleware group for authenticated users
Route::middleware(['auth', 'verified'])->group(function () {
    $user = Auth::user(); // Safely get the user

    Log::info('Authenticated user accessing routes with auth and verified middleware.', [
        'method' => request()->method(),
        'path' => request()->path(),
        'ip' => request()->ip(),
        'user_id' => $user ? $user->id : 'guest', // Check if user is authenticated
        'user_role' => $user ? $user->role : 'guest', // Check if user is authenticated
    ]);

    require __DIR__ . '/schoolAdminRoutes.php';
    require __DIR__ . '/ppdAdminRoutes.php';
    require __DIR__ . '/stateAdminRoutes.php';
    require __DIR__ . '/superAdminRoutes.php';
});

// For student login page
Route::get('/studentLogin', [StudentController::class, 'showLogin'])->name('student.showLogin');
Route::post('/studentLogin', [StudentController::class, 'login'])->name('student.login');

// Profile routes
Route::middleware('auth')->group(function () {
    $user = Auth::user(); // Safely get the user
    Log::info('Authenticated user accessing profile routes.', [
        'method' => request()->method(),
        'path' => request()->path(),
        'ip' => request()->ip(),
        'user_id' => $user ? $user->id : 'guest', // Check if user is authenticated
        'user_role' => $user ? $user->role : 'guest', // Check if user is authenticated
    ]);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Authentication routes
require __DIR__ . '/auth.php';
require __DIR__ . '/donationRoutes.php';
require __DIR__ . '/studentRoutes.php';


