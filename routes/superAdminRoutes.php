<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;

Route::get('/dashboardSuper', fn() => Inertia::render('1-SuperAdmin/SuperAdminDashboard'))
    ->name('dashboardSP');

// User Management Route
//Route::resource('users', UserController::class);
Route::get('/listUsers', [UserController::class, 'index'])->name('users.index');
Route::get('/addUser', [UserController::class, 'create'])->name('users.create');
Route::post('/users', [UserController::class, 'store'])->name('users.store');
Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

// Dashboard Data Analytics Route
Route::get('/user-role-counts', [UserController::class, 'getUserRoleCounts']);
Route::get('/user-role-counts/30-minutes', [UserController::class, 'getActiveUserCounts30Minutes']);

Route::get('/profileSuperAdmin', function () {
    return Inertia::render('1-SuperAdmin/UserProfile/Edit');
})->name('superadmin.profile');
