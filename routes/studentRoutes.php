<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use Inertia\Inertia;
use App\Models\Student;
use App\Http\Middleware\StudentSessionCheck;

Route::middleware([StudentSessionCheck::class])->group(function () {
    Route::get('/studentPage', [StudentController::class, 'index'])->name('student.dashboard');
    Route::get('/applyCrew', [StudentController::class, 'applyCrew'])->name('student.applyCrew');
    Route::post('/applyCrew', [StudentController::class, 'applyCrewSubmit'])->name('student.applyCrewSubmit');
    Route::get('/resultApply/{icNum}', [StudentController::class, 'resultApply'])->name('student.resultApply');
});

Route::post('/student/logout', [StudentController::class, 'logout'])->name('student.logout');

// Toksah mung nak guna route hok ni, aku hok milih jaley aku
/*Route::get('/students/{id}', [StudentController::class, 'show']);
Route::post('/students', [StudentController::class, 'store']);
Route::put('/students/{id}', [StudentController::class, 'update']);
Route::delete('/students/{id}', [StudentController::class, 'destroy']);*/
