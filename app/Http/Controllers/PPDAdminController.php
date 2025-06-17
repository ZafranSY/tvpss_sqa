<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SchoolInfo;
use App\Models\TVPSSVersion;
use App\Models\Equipment;
use App\Models\EqFollowUp;
use App\Enums\ApprovalStatusEnum;
use App\Enums\StatusEnum;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PPDAdminController extends Controller
{
    public function tvpssInfoPPDList(Request $request)
    {
        $user = $request->user();

        if (!$user->district) {
            return Inertia::render('3-PPDAdmin/SchoolVersionStatus/listSchool', [
                'schools' => [],
                'message' => 'No schools found for your district.',
            ]);
        }

        $schools = SchoolInfo::where('district', $user->district)
            ->with(['schoolVersion' => function ($query) {
                $query->select('id', 'school_info_id', 'version', 'status');
            }])
            ->get()
            ->map(function ($school) {
                return [
                    'schoolCode' => $school->schoolCode,
                    'schoolName' => $school->schoolName,
                    'schoolOfficer' => $school->schoolOfficer,
                    'district' => $school->district,
                    'schoolVersion' => $school->schoolVersion->version ?? '-',
                    'status' => $school->schoolVersion->status ?? 'Null',
                ];
            });

        return Inertia::render('3-PPDAdmin/SchoolVersionStatus/listSchool', [
            'schools' => $schools,
        ]);
    }

    public function tvpssInfoPPDView(string $schoolCode)
    {
        $school = SchoolInfo::with('schoolVersion')->where('schoolCode', $schoolCode)->first();

        if (!$school) {
            return redirect()->route('schoolInfo.tvpssInfoPPDList')->with('error', 'School not found.');
        }

        $currentVersion = $school->schoolVersion->version?->value ?? 0;

        $tvpssData = [
            'schoolName' => $school->schoolName . " (" . $school->schoolCode . ")",
            'schoolCode' => $school->schoolCode,
            'officer' => $school->schoolOfficer,
            'info' => [
                //'tvpssLogo' => $school->schoolVersion->tvpssLogo,
                'isTvpssLogo' => $school->schoolVersion->isTvpssLogo ?? 'TIADA',
                'studio' => $school->schoolVersion->tvpssStudio ?? 'TIADA',
                'youtube' => $school->schoolVersion->isUploadYoutube ?? 'TIADA',
                'inSchoolRecording' => $school->schoolVersion->recInSchool ?? 'TIADA',
                'outSchoolRecording' => $school->schoolVersion->recInOutSchool ?? 'TIADA',
                'collaboration' => $school->schoolVersion->isCollabAgency ?? 'TIADA',
                'greenScreen' => $school->schoolVersion->greenScreen ?? 'TIADA',
            ],
            'currentVersion' => $currentVersion,
            'nextVersion' => $currentVersion < 4 ? $currentVersion + 1 : 'Versi Dipenuhi',
        ];

        $debugData = [
            'schoolCode' => $schoolCode,
            'school' => $school->toArray(),
        ];

        return Inertia::render('3-PPDAdmin/SchoolVersionStatus/approvePPDTvpss', [
            'tvpssData' => $tvpssData,
            'debug' => $debugData, 
        ]);
    }

    public function approveTVPSS(Request $request, string $schoolCode)
    {
        $school = SchoolInfo::where('schoolCode', $schoolCode)->firstOrFail();
        $schoolVersion = $school->schoolVersion;

        if (!$schoolVersion) {
            return redirect()
                ->route('schoolInfo.tvpssInfoPPDList')
                ->with('error', 'TVPSS Version not found for the given school.');
        }

        $schoolVersion->ppd_approval = true; 
        $schoolVersion->status = ApprovalStatusEnum::PENDING;
        $schoolVersion->save();

        return redirect()->route('schoolInfo.tvpssInfoPPDList')
            ->with('success', 'TVPSS Version successfully approved!');
    }

    public function rejectTVPSS(Request $request, string $schoolCode)
    {
        $school = SchoolInfo::where('schoolCode', $schoolCode)->firstOrFail();
        $schoolVersion = $school->schoolVersion;

        if (!$schoolVersion) {
            return redirect()
                ->route('schoolInfo.tvpssInfoPPDList')
                ->with('error', 'TVPSS Version not found for the given school.');
        }

        $schoolVersion->ppd_approval = false; 
        $schoolVersion->status = ApprovalStatusEnum::REJECTED->value; 
        $schoolVersion->save();

        return redirect()
            ->route('schoolInfo.tvpssInfoPPDList')
            ->with('error', 'TVPSS Version has been rejected.');
    }

    public function equipmentManagementPPDSchool()
    {
        $user = request()->user();
        $schools = SchoolInfo::where('district', $user->district)->get();

        $schoolsWithEquipmentCount = $schools->map(function ($school) {
            $equipmentCount = Equipment::where('school_info_id', $school->id)->count();
            return [
                'id' => $school->id,
                'schoolName' => $school->schoolName,
                'schoolCode' => $school->schoolCode,
                'schoolOfficer' => $school->schoolOfficer,
                'district' => $school->district,
                'equipment_count' => $equipmentCount,
            ];
        });

        return Inertia::render('3-PPDAdmin/ManageSchoolEquipment/listSchoolEq', [
            'schools' => $schoolsWithEquipmentCount,
        ]);
    }

    public function equipmentManagementPPDList($schoolId)
    {
        $equipment = Equipment::where('school_info_id', $schoolId)->paginate(10);
        $school = SchoolInfo::findOrFail($schoolId);

        return Inertia::render('3-PPDAdmin/ManageSchoolEquipment/listSchoolWEq', [
            'equipment' => $equipment,
            'school' => $school,
        ]);
    }

    public function editEquipment($equipmentId)
    {
        $equipment = Equipment::findOrFail($equipmentId);
        $schoolId = $equipment->school_info_id;
        $followUps = EqFollowUp::where('equipment_id', $equipmentId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('3-PPDAdmin/ManageSchoolEquipment/addFollowUpEq', [
            'equipment' => $equipment,
            'followUps' => $followUps,
            'schoolId' => $schoolId,
        ]);
    }

    public function updateEquipment(Request $request, $equipmentId)
    {
        try {
            DB::beginTransaction();
            $equipment = Equipment::findOrFail($equipmentId);

            $request->validate([
                'status' => ['required', 'string', 'in:' . implode(',', StatusEnum::getValues())],
            ]);

            $equipment->update([
                'status' => $request->input('status'),
            ]);

            DB::commit();

            return redirect()->route('equipmentManagementPPD.edit', ['equipmentId' => $equipmentId])
                ->with('success', 'Equipment status updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error updating equipment status:', [
                'message' => $e->getMessage(),
                'equipment_id' => $equipmentId,
            ]);

            return back()->with('error', 'An error occurred while updating the equipment status.');
        }
    }

    public function saveFollowUp(Request $request, $equipmentId)
    {
        try {
            DB::beginTransaction();

            Log::info('Incoming Request:', $request->all());

            $request->validate([
                'followUpUpdatePPD' => 'nullable|string|max:500',
                'uploadBrEq.*' => 'file|mimes:jpeg,png,jpg|max:2048',
            ]);

            $equipment = Equipment::findOrFail($equipmentId);
            $equipmentStatus = $equipment->status instanceof StatusEnum 
                ? $equipment->status->value 
                : $equipment->status;

            Log::info('Resolved Equipment Status:', ['status' => $equipmentStatus]);

            $allowedStatuses = [
                StatusEnum::Tidak_Berfungsi->value,
                StatusEnum::Penyelenggaraan->value,
            ];

            if (!in_array($equipmentStatus, $allowedStatuses)) {
                Log::error('Invalid Status for Follow-Up:', ['status' => $equipmentStatus]);
                throw new \Exception('Follow-ups can only be created for specific statuses.');
            }

            $uploadPaths = [];
            if ($request->hasFile('uploadBrEq')) {
                foreach ($request->file('uploadBrEq') as $file) {
                    $schoolFolder = "followUpEq/school_{$equipment->school_info_id}";
                    $filePath = $file->storeAs(
                        $schoolFolder,
                        time() . '_' . $file->getClientOriginalName(),
                        'public'
                    );
                    $uploadPaths[] = "{$schoolFolder}/" . time() . '_' . $file->getClientOriginalName();
                }
            }

            EqFollowUp::create([
                'equipment_id' => $equipment->id,
                'user_id' => $request->user()->id,
                'uploadBrEq' => !empty($uploadPaths) ? json_encode($uploadPaths) : null,
                'content' => $request->input('followUpUpdatePPD'),
                'date' => now()->format('Y-m-d'),
            ]);

            DB::commit();

            Log::info('Follow-Up Created Successfully');

            return redirect()->route('equipmentManagementPPD.edit', ['equipmentId' => $equipmentId])
                ->with('success', 'Follow-up successfully saved!');
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error saving follow-up:', [
                'message' => $e->getMessage(),
                'equipment_id' => $equipmentId,
                'user_id' => $request->user()->id,
                'status' => $equipment->status ?? 'Unknown',
            ]);

            return back()->with('error', 'An error occurred while saving the follow-up.');
        }
    }

    public function deleteEquipment($equipmentId)
    {
        try {
            $equipment = Equipment::findOrFail($equipmentId);
            $equipment->delete();

            return redirect()->back()->with('success', 'Equipment deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting equipment:', [
                'message' => $e->getMessage(),
                'equipment_id' => $equipmentId,
            ]);

            return back()->with('error', 'An error occurred while deleting the equipment.');
        }
    }

    public function getPPDAdminStats(Request $request)
    {
        // Fetch the logged-in PPD Admin user
        $user = $request->user();
        $user = request()->user();

        // Fetch the district directly from the User model
        $district = $user->district;

        // If no district found for the PPD Admin, return an error message
        if (!$district) {
            return response()->json([
                'message' => 'No district info found for this user',
                'schools_count' => 0,
                'pending_tvpss_count' => 0,
                'approved_tvpss_count' => 0,
                'rejected_tvpss_count' => 0,  // Add rejected count in case of error
            ]);
        }

        // Get the counts for schools, pending TVPSS, approved TVPSS, and rejected TVPSS in the district
        $schoolsCount = SchoolInfo::where('district', $district)->count();

        $pendingTVPSSCount = TVPSSVersion::whereHas('schoolInfo', function ($query) use ($district) {
            $query->where('district', $district);
        })->where('status', 'Pending')->count();

        $approvedTVPSSCount = TVPSSVersion::whereHas('schoolInfo', function ($query) use ($district) {
            $query->where('district', $district);
        })->where('status', 'Approved')->count();

        $rejectedTVPSSCount = TVPSSVersion::whereHas('schoolInfo', function ($query) use ($district) {
            $query->where('district', $district);
        })->where('status', 'Rejected')->count();

        // Return the district statistics as a JSON response
        return response()->json([
            'schools_count' => $schoolsCount,
            'pending_tvpss_count' => $pendingTVPSSCount,
            'approved_tvpss_count' => $approvedTVPSSCount,
            'rejected_tvpss_count' => $rejectedTVPSSCount, // Include rejected count in the response
        ]);
    }


}
