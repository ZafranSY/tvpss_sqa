<?php

use App\Http\Controllers\PPDAdminController;
use Illuminate\Support\Facades\Route; 
use Inertia\Inertia;

Route::get('/dashboardPPD', fn() => Inertia::render('3-PPDAdmin/PPDAdminDashboard'))->name('dashboardPP');

// TVPSS VERSION (LIST OF SCHOOL)
Route::get('/tvpssInfoPPDList', [PPDAdminController::class, 'tvpssInfoPPDList'])->name('schoolInfo.tvpssInfoPPDList');
Route::get('/tvpssInfoPPD/{schoolCode}/edit', [PPDAdminController::class, 'tvpssInfoPPDView'])->name('schoolInfo.tvpssInfoPPDView');

// Approve or Reject TVPSS Version
Route::post('/tvpssInfoPPD/{schoolCode}/approve', [PPDAdminController::class, 'approveTVPSS'])->name('schoolInfo.approveTVPSS');
Route::post('/tvpssInfoPPD/{schoolCode}/reject', [PPDAdminController::class, 'rejectTVPSS'])->name('schoolInfo.rejectTVPSS');

// Equipment Management PPD
Route::get('/eqManagementListPPDSchool', [PPDAdminController::class, 'equipmentManagementPPDSchool'])->name('equipmentManagementPPDSchool');
Route::get('/eqManagementPPD/list/{schoolId}', [PPDAdminController::class, 'equipmentManagementPPDList'])->name('equipmentManagementPPD.list');
Route::get('/eqManagementPPD/edit/{equipmentId}', [PPDAdminController::class, 'editEquipment'])->name('equipmentManagementPPD.edit');
Route::post('/equipmentPPD/{equipmentId}/update', [PPDAdminController::class, 'updateEquipment'])->name('equipmentManagementPPD.update');
Route::post('/equipmentPPD/{equipmentId}/follow-up', [PPDAdminController::class, 'saveFollowUp'])->name('equipmentManagementPPD.followUp');
Route::delete('/eqManagementPPD/{equipmentId}/delete', [PPDAdminController::class, 'deleteEquipment'])->name('equipmentManagementPPD.delete');

//Dashbaord 
Route::get('/ppd-admin-stats', [PPDAdminController::class, 'getPPDAdminStats']);

//Settings
Route::get('/profilePPDAdmin', function () {
    return Inertia::render('3-PPDAdmin/Profile/Edit');
})->name('ppdadmin.profile');