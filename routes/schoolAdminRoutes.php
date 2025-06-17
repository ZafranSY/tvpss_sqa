<?php

use App\Http\Controllers\SchoolAdminController;
use Illuminate\Support\Facades\Route;  
use Inertia\Inertia;

Route::get('/dashboardSchool', fn() => Inertia::render('4-SchoolAdmin/SchoolAdminDashboard'))
    ->name('dashboardSA');

// Equipment Management
Route::get('/listEquipment', [SchoolAdminController::class, 'equipmentIndex'])->name('equipment.equipmentIndex');
Route::get('equipment/create', [SchoolAdminController::class, 'equipmentCreate'])->name('equipment.equipmentCreate');
Route::post('equipment', [SchoolAdminController::class, 'equipmentStore'])->name('equipment.equipmentStore');
Route::get('equipment/{id}', [SchoolAdminController::class, 'equipmentShow'])->name('equipment.equipmentShow');
//Route::get('equipment/{id}/edit', [SchoolAdminController::class, 'equipmentEdit'])->name('equipment.equipmentEdit');
Route::get('/equipment/{equipment}/edit', [SchoolAdminController::class, 'equipmentEdit'])->name('equipment.edit');
Route::put('equipment/{equipment}', [SchoolAdminController::class, 'equipmentUpdate'])->name('equipment.equipmentUpdate');
Route::delete('equipment/{equipment}', [SchoolAdminController::class, 'equipmentDestroy'])->name('equipment.equipmentDestroy');
Route::delete('equipment/delete', [SchoolAdminController::class, 'deleteSelected'])->name('equipment.deleteSelected');
Route::get('/status-options', [SchoolAdminController::class, 'getStatusOptions']);
Route::post('equipment/{equipment}/follow-up', [SchoolAdminController::class, 'saveFollowUp'])->name('equipment.saveFollowUp');
Route::get('equipment/{equipment}/follow-ups', [SchoolAdminController::class, 'getFollowUps'])->name('equipment.getFollowUps');

//Equipment Location
Route::get('eqLoc/create', [SchoolAdminController::class, 'eqLocCreate'])->name('eqLoc.eqLocCreate');
Route::post('eqLoc', [SchoolAdminController::class, 'eqLocStore'])->name('eqLoc.eqLocStore');
Route::get('eqLoc/{eqLocation}', [SchoolAdminController::class, 'eqLocShow'])->name('eqLoc.eqLocShow');
Route::get('/eqLoc/{eqLocation}/edit', [SchoolAdminController::class, 'eqLocEdit'])->name('eqLoc.eqLocEdit');
Route::put('eqLoc/{eqLocation}', [SchoolAdminController::class, 'eqLocUpdate'])->name('eqLoc.eqLocUpdate');
Route::delete('eqLoc/{eqLocation}', [SchoolAdminController::class, 'eqLocDestroy'])->name('eqLoc.eqLocDestroy');
Route::get('/locations', [SchoolAdminController::class, 'getLocations'])->name('locations');

//School Information
Route::get('/updateSchool', [SchoolAdminController::class, 'editSchool'])->name('school.edit');
Route::post('/update-school', [SchoolAdminController::class, 'updateSchool'])->name('school.update');

//TVPSS Version
Route::get('/updateSchoolTVPSSVersion', [SchoolAdminController::class, 'updateTVPSSVer1'])->name('tvpss1');
Route::post('/updateEditSchoolTVPSSVersion', [SchoolAdminController::class, 'editTVPSSVer1'])->name('tvpss1Edit');
Route::get('/updateSchoolTVPSSVersion2', [SchoolAdminController::class, 'updateTVPSSVer2'])->name('tvpss2');
Route::post('/updateEditSchoolTVPSSVersion2', [SchoolAdminController::class, 'editTVPSSVer2'])->name('tvpss2Edit');

//Dashboard Count 
Route::get('/get-tvpss-version', [SchoolAdminController::class, 'getTVPSSVersion'])->name('tvpss.getVersion');
Route::get('/school-admin-stats', [SchoolAdminController::class, 'getSchoolAdminStats']);
Route::get('/studcrew-jawatan-count', [SchoolAdminController::class, 'countStudCrewJawatan']);


//Student Data
Route::get('/listStudent', [SchoolAdminController::class, 'studentList'])->name('student.studentList');
Route::get('/students/create', [SchoolAdminController::class, 'studentCreate'])->name('student.create');
Route::post('/students', [SchoolAdminController::class, 'storeStudent'])->name('student.store');
Route::get('/students/{id}/edit', [SchoolAdminController::class, 'studentEdit'])->name('student.edit');
Route::put('/students/{id}', [SchoolAdminController::class, 'updateStudent'])->name('student.update');
Route::delete('/students/{id}', [SchoolAdminController::class, 'deleteStudent'])->name('student.delete');


// StudCrew Data
Route::get('/studCrewList', [SchoolAdminController::class, 'studCrewList'])->name('studcrew.list');
Route::get('/studcrew/approve/{id}', [SchoolAdminController::class, 'editStudcrew'])->name('studcrew.edit');
Route::post('/studcrew/{id}/approve', [SchoolAdminController::class, 'approveStudcrew'])->name('studcrew.approve');
Route::post('/studcrew/{id}/reject', [SchoolAdminController::class, 'rejectStudcrew'])->name('studcrew.reject');
Route::delete('/studcrew/{id}', [SchoolAdminController::class, 'destroy'])->name('studcrew.destroy');

//Student Achievement
Route::get('/listAchievement', [SchoolAdminController::class, 'achievementList'])->name('achievement.achievementList');
Route::get('/achievements/create', [SchoolAdminController::class, 'achievementCreate'])->name('achievement.create');
Route::post('/achievements', [SchoolAdminController::class, 'storeAchievement'])->name('achievement.store');
Route::get('/achievements/{id}', [SchoolAdminController::class, 'achievementEdit'])->name('achievement.edit');
Route::put('/achievements/{id}', [SchoolAdminController::class, 'updateAchievement'])->name('achievement.update');
Route::delete('/achievements/{id}', [SchoolAdminController::class, 'deleteAchievement'])->name('achievement.delete');

//Donation
Route::get('/donationList', [SchoolAdminController::class, 'donationList'])->name('schooladmin.donation.list');


//Settings
Route::get('/profileSchoolAdmin', function () {
    return Inertia::render('4-SchoolAdmin/Profile/Edit');
})->name('schooladmin.profile');
