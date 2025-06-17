<?php

use App\Http\Controllers\StateAdminController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*Route::get('/dashboardState', function () {
    return Inertia::render('2-StateAdmin/StateAdminDashboard');
})->middleware(['auth', 'verified'])->name('dashboardST');*/

Route::get('/dashboardState', fn() => Inertia::render('2-StateAdmin/StateAdminDashboard'))
    ->name('dashboardST');

// CERTIFICATE MANAGEMENT
Route::get('/certificate-Template-List', [StateAdminController::class, 'certList'])->name('certList');
Route::get('/certificateTemplateUploadForm', [StateAdminController::class, 'uploadCertForm'])->name('uploadCertForm');
Route::post('/certificate-templates', [StateAdminController::class, 'uploadTemplate'])->name('uploadTemplate');
Route::get('/certificate-templates', [StateAdminController::class, 'getTemplates']);
Route::get('/certificate-templates/{id}', [StateAdminController::class, 'getTemplate']);
Route::put('/certificate-templates/{id}', [StateAdminController::class, 'updateTemplate']);
Route::get('/certificate-templates/{id}/edit', [StateAdminController::class, 'editTemplate'])->name('certificate-templates.edit');
Route::get('/listSchoolCertificate', [StateAdminController::class, 'certificateGenerateList'])->name('certificate.generateList');
Route::get('/generateCertificate/{schoolCode}', [StateAdminController::class, 'generateCertificate'])->name('certificate.generate');
Route::delete('/certificate-templates/{id}', [StateAdminController::class, 'destroy'])->name('certificate-templates.destroy');

// TVPSS VERSION UPDATE
Route::get('/tvpssInfo', [StateAdminController::class, 'tvpssInfoIndex'])->name('schoolInfo.tvpssInfoIndex');
Route::get('/tvpssInfoState/{schoolCode}/edit', [StateAdminController::class, 'tvpssInfoView'])->name('schoolInfo.tvpssInfoView');

// Approve or Reject TVPSS Version
Route::post('/tvpssInfoState/{schoolCode}/approve', [StateAdminController::class, 'approveTVPSS'])->name('schoolInfo.approveTVPSS');
Route::post('/tvpssInfoState/{schoolCode}/reject', [StateAdminController::class, 'rejectTVPSS'])->name('schoolInfo.rejectTVPSS');

//Dashboard
Route::get('/state-admin-stats', [StateAdminController::class, 'getStateAdminStats']);
Route::get('/state-admin-version-counts', [StateAdminController::class, 'getVersionCounts']);

//Settings
Route::get('/profileStateAdmin', function () {
    return Inertia::render('2-StateAdmin/Profile/Edit');
})->name('stateadmin.profile');

