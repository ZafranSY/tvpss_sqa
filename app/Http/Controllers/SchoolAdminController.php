<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\Equipment\StoreEquipmentRequest;
use App\Http\Requests\Equipment\UpdateEquipmentRequest;
use Inertia\Inertia;
use App\Models\Equipment;
use App\Models\EqLocation;
use App\Models\SchoolInfo;
use App\Models\TVPSSVersion;
use App\Models\Student;
use App\Models\StudentAchievement;
use App\Models\Studcrew;
use App\Models\EqFollowUp;
use App\Models\Donations;
use App\Enums\StatusEnum;
use App\Enums\versionEnum;
use App\Enums\ApprovalStatusEnum;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;


class SchoolAdminController extends Controller
{
    public function equipmentIndex(Request $request)
    {
        $user = request()->user();

        $school = SchoolInfo::where('user_id', $user->id)->first();

        if (!$school) {
            return redirect()->route('school.edit')->with('error', 'Please create your school information first.');
        }

        $query = Equipment::where('school_info_id', $school->id);

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('search')) {
            $query->where('equipName', 'like', '%' . $request->input('search') . '%');
        }

        $equipment = $query->paginate(10);
        $eqLocation = EqLocation::where('school_info_id', $school->id)->get();

        return Inertia::render('4-SchoolAdmin/ManageEquipment/ListEquipment', [
            'equipment' => $equipment,
            'school' => $school,
            'eqLocation' => $eqLocation,
        ]);
    }

    public function equipmentCreate()
    {
        $user = request()->user();

        $school = SchoolInfo::where('user_id', $user->id)->first();

        if (!$school) {
            return redirect()->route('school.edit')->with('error', 'Please complete your school information first.');
        }

        $eqLocation = EqLocation::where('school_info_id', $school->id)->get();

        return Inertia::render('4-SchoolAdmin/ManageEquipment/AddEquipment', [
            'eqLocation' => $eqLocation,
        ]);
    }

    /*public function equipmentStore(StoreEquipmentRequest $request)
    {
        try {
            $data = $request->all();
            //Log::info('Received Data in Controller:', $data); // Debug log

            Equipment::create([
                'equipName' => $data['equipName'],
                'equipType' => $data['equipType'],
                'location' => $data['location'],
                'acquired_date' => $data['acquired_date'],
                'status' => $data['status'],
                'school_info_id' => SchoolInfo::where('user_id', $request->user()->id)->value('id'),
            ]);

            return redirect()->route('equipment.equipmentIndex')->with('success', 'Equipment successfully added!');
        } catch (\Exception $e) {
            //Log::error('Error in equipmentStore:', ['message' => $e->getMessage()]);
            return back()->with('error', 'An error occurred.');
        }
    }*/

    public function equipmentStore(StoreEquipmentRequest $request)
    {
        try {
            DB::beginTransaction();
            $school = SchoolInfo::where('user_id', $request->user()->id)->first();
            if (!$school) {
                throw new \Exception('School information not found.');
            }

            $equipment = Equipment::create([
                'equipName' => $request->input('equipName'),
                'equipType' => $request->input('equipType'),
                'location' => $request->input('location'),
                'acquired_date' => $request->input('acquired_date'),
                'status' => $request->input('status'),
                'school_info_id' => $school->id,
            ]);

            if (in_array($request->input('status'), ['Tidak Berfungsi', 'Penyelenggaraan'])) {
                $uploadPaths = [];

                $request->validate([
                    'uploadBrEq.*' => 'file|mimes:jpeg,png,jpg|max:2048',
                ]);

                if ($request->hasFile('uploadBrEq')) {
                    foreach ($request->file('uploadBrEq') as $file) {
                        $schoolFolder = "followUpEq/school_{$school->id}";
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
                    'content' => $request->input('followUpUpdateSchool'),
                    'date' => now()->format('Y-m-d'),
                ]);

                Log::info('Follow-up saved for equipment', [
                    'equipment_id' => $equipment->id,
                    'file_paths' => $uploadPaths,
                ]);
            }

            DB::commit();

            return redirect()->route('equipment.equipmentIndex')->with('success', 'Equipment successfully added!');
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error in equipmentStore:', [
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'An error occurred while adding equipment.');
        }
    }

    public function equipmentShow(Equipment $equipment)
    {
        $user = request()->user();

        if ($equipment->school_info_id !== SchoolInfo::where('user_id', $user->id)->value('id')) {
            abort(403, 'Unauthorized access.');
        }

        return Inertia::render('4-SchoolAdmin/ManageEquipment/ShowEquipment', [
            'equipment' => $equipment,
        ]);
    }

    public function equipmentEdit($id)
    {
        $user = request()->user();
        $school = SchoolInfo::where('user_id', $user->id)->first();

        if (!$school) {
            return redirect()->route('school.edit')->with('error', 'Please complete your school information first.');
        }

        $equipment = Equipment::where('id', $id)
            ->where('school_info_id', $school->id)
            ->first();

        if (!$equipment) {
            abort(403, 'Unauthorized access.');
        }

        $eqLocation = EqLocation::where('school_info_id', $school->id)->get();
        $followUps = EqFollowUp::where('equipment_id', $id)
            ->with('user') 
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('4-SchoolAdmin/ManageEquipment/UpdateEquipment', [
            'equipment' => $equipment,
            'eqLocation' => $eqLocation,
            'followUps' => $followUps,
        ]);
    }

    public function equipmentUpdate(UpdateEquipmentRequest $request, $id)
    {
        $user = request()->user();

        $school = SchoolInfo::where('user_id', $user->id)->first();

        if (!$school) {
            return redirect()->route('school.edit')->with('error', 'Please complete your school information first.');
        }

        $equipment = Equipment::where('id', $id)
            ->where('school_info_id', $school->id)
            ->first();

        if (!$equipment) {
            abort(403, 'Unauthorized access.');
        }

        try {
            $data = $request->all();

            if ($request->equipType === 'other' && $request->has('otherType')) {
                $data['equipType'] = $request->input('otherType'); 
            }

            $equipment->update([
                'equipName' => $data['equipName'],
                'equipType' => $data['equipType'],
                'location' => $data['location'],
                'acquired_date' => $data['acquired_date'],
                'status' => $data['status'],
            ]);

            return redirect()->route('equipment.edit')->with('success', 'Equipment successfully updated!');
        } catch (\Exception $e) {
            Log::error('Error updating equipment:', ['message' => $e->getMessage()]);
            return back()->with('error', 'An error occurred while updating equipment.');
        }
    }

    public function saveFollowUp(Request $request, $equipmentId)
    {
        try {
            DB::beginTransaction();
            $request->validate([
                'followUpUpdateSchool' => 'nullable|string|max:500',
                'uploadBrEq.*' => 'file|mimes:jpeg,png,jpg|max:2048',
            ]);

            $equipment = Equipment::findOrFail($equipmentId);
            $equipmentStatus = $equipment->status instanceof StatusEnum 
                ? $equipment->status->value 
                : $equipment->status;

            $allowedStatuses = [
                StatusEnum::Tidak_Berfungsi->value,
                StatusEnum::Penyelenggaraan->value,
            ];

            if (!in_array($equipmentStatus, $allowedStatuses)) {
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
                'content' => $request->input('followUpUpdateSchool'),
                'date' => now()->format('Y-m-d'),
            ]);

            DB::commit();

            return redirect()->route('equipment.edit', ['equipment' => $equipmentId])
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

    public function getFollowUps($equipmentId)
    {
        $followUps = EqFollowUp::where('equipment_id', $equipmentId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($followUps);
    }

    public function equipmentDestroy(Equipment $equipment)
    {
        try {
            DB::beginTransaction();
            $user = request()->user();
            if ($equipment->school_info_id !== SchoolInfo::where('user_id', $user->id)->value('id')) {
                abort(403, 'Unauthorized access.');
            }
            $followUps = EqFollowUp::where('equipment_id', $equipment->id)->get();

            foreach ($followUps as $followUp) {
                if (!empty($followUp->uploadBrEq)) {
                    $uploadPaths = json_decode($followUp->uploadBrEq, true);

                    foreach ($uploadPaths as $path) {
                        $fullPath = storage_path("app/public/{$path}");
                        if (file_exists($fullPath)) {
                            unlink($fullPath); 
                        }
                    }
                }

                $followUp->delete();
            }

            $equipment->delete();
            DB::commit();

            return redirect()->route('equipment.equipmentIndex')->with('success', 'Equipment and related data successfully deleted!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting equipment:', [
                'message' => $e->getMessage(),
                'equipment_id' => $equipment->id,
            ]);
            return back()->with('error', 'An error occurred while deleting the equipment.');
        }
    }

    public function deleteSelected(Request $request)
    {
        try {
            $user = request()->user();
            $school = SchoolInfo::where('user_id', $user->id)->first();

            if (!$school) {
                return redirect()->route('school.edit')->with('error', 'Please complete your school information first.');
            }

            $ids = $request->input('ids');

            Equipment::whereIn('id', $ids)->where('school_info_id', $school->id)->delete();

            return redirect()->route('equipment.equipmentIndex')->with('success', 'Selected equipment successfully deleted!');
        } catch (\Exception $e) {
            return back()->with('error', 'An error occurred, please try again.');
        }
    }

    public function getStatusOptions()
    {
        return response()->json([
            'status' => StatusEnum::getValues(),
        ]);
    }

    public function editSchool()
    {
        $user = request()->user();

        $schoolInfo = SchoolInfo::where('user_id', $user->id)->first();

        return Inertia::render('4-SchoolAdmin/SchoolInformation/UpdateSchoolInformation', [
            'schoolInfo' => $schoolInfo,
        ]);
    }

    public function updateSchool(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'schoolCode'    => 'required|string|max:255',
            'schoolName'    => 'required|string|max:255',
            'schoolEmail'   => 'required|email|max:255',
            'schoolAddress1'=> 'nullable|string|max:255',
            'schoolAddress2'=> 'nullable|string|max:255',
            'postcode'      => 'required|string|max:10',
            'state'         => 'required|string|max:100',
            'district'      => 'required|string|max:100',
            'noPhone'       => 'required|string|max:20',
            'noFax'         => 'nullable|string|max:20',
            'linkYoutube'   => 'nullable|url|max:255',
            'schoolLogo'    => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        $schoolInfo = SchoolInfo::firstOrNew(['user_id' => $user->id]);
        $currentSchoolLogo = $schoolInfo->schoolLogo;
        $schoolInfo->schoolOfficer = $user->name;
        $schoolInfo->fill($validated);

        if ($request->hasFile('schoolLogo')) {
            try {
                $file = $request->file('schoolLogo');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $destinationPath = public_path('images/schoolLogo');

                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }

                $file->move($destinationPath, $fileName);

                $schoolInfo->schoolLogo = 'images/schoolLogo/' . $fileName;
            } catch (\Exception $e) {
                return back()->with('error', 'Error uploading the logo. Please try again.');
            }
        } else {
            $schoolInfo->schoolLogo = $currentSchoolLogo;
        }

        $schoolInfo->save();

        return redirect()->route('school.edit')->with('success', 'School information updated successfully!');
    }

    public function updateTVPSSVer1()
    {
        $user = request()->user();

        $schoolInfo = SchoolInfo::with('schoolVersion')->where('user_id', $user->id)->first();

        if (!$schoolInfo) {
            return back()->with('error', 'No school information found for your account.');
        }

        return inertia('4-SchoolAdmin/SchoolInformation/UpdateSchoolTVPSSVersion', [
            'schoolInfo' => $schoolInfo,
            'schoolVersion' => $schoolInfo->schoolVersion,
        ]);
    }

    public function editTVPSSVer1(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'schoolCode'    => 'required|string|max:255',
            'schoolName'    => 'required|string|max:255',
            'schoolEmail'   => 'required|email|max:255',
            'schoolAddress1'=> 'nullable|string|max:255',
            'schoolAddress2'=> 'nullable|string|max:255',
            'postcode'      => 'required|string|max:10',
            'state'         => 'required|string|max:100',
            'district'      => 'required|string|max:100',
            'noPhone'       => 'required|string|max:20',
            'noFax'         => 'nullable|string|max:20',
            'linkYoutube'   => 'nullable|url|max:255',
            'schoolLogo'    => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        $schoolInfo = SchoolInfo::where('user_id', $user->id)->first();
        $schoolInfo->schoolOfficer = $user->name;

        if (!$schoolInfo) {
            return back()->with('error', 'No school information found for your account.');
        }

        //$schoolInfo->schoolOfficer = $user->name;

        $currentSchoolLogo = $schoolInfo->schoolLogo;
        $schoolInfo->fill($validated);

        if ($request->hasFile('schoolLogo')) {
            $file = $request->file('schoolLogo');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $destinationPath = public_path('images/schoolLogo');

            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $file->move($destinationPath, $fileName);
            $schoolInfo->schoolLogo = 'images/schoolLogo/' . $fileName;
        } else {
            $schoolInfo->schoolLogo = $currentSchoolLogo;
        }

        $schoolInfo->save();

        return redirect()->route('tvpss2')->with('success', 'School information updated successfully!');
    }

    public function updateTVPSSVer2()
    {
        $user = request()->user();

        $schoolInfo = SchoolInfo::with('schoolVersion')->where('user_id', $user->id)->first();

        if (!$schoolInfo) {
            return back()->with('error', 'No school information found for your account.');
        }

        return inertia('4-SchoolAdmin/SchoolInformation/UpdateSchoolTVPSSVersion2', [
            'schoolInfo' => $schoolInfo,
            'schoolVersion' => $schoolInfo->schoolVersion,
        ]);
    }

    public function editTVPSSVer2(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'version' => 'nullable|integer', 
            'agency1_name' => 'required|string|max:255',
            'agency1Manager_name' => 'nullable|string|max:255',
            'agency2_name' => 'nullable|string|max:255',
            'agency2Manager_name' => 'required|string|max:255',
            'recordEquipment' => 'required|in:Ada,Tiada',
            'tvpssStudio' => 'required|in:Ada,Tiada',
            'recInSchool' => 'required|in:Ada,Tiada',
            'recInOutSchool' => 'required|in:Ada,Tiada',
            'greenScreen' => 'nullable|in:Ada,Tiada',
            'tvpssLogo' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        $schoolInfo = SchoolInfo::where('user_id', $user->id)->firstOrFail();
        $schoolVersion = $schoolInfo->schoolVersion ?? new TVPSSVersion();

        if ($request->hasFile('tvpssLogo')) {
            $tvpssLogo = $request->file('tvpssLogo');
            $fileName = time() . '_' . $tvpssLogo->getClientOriginalName();
            $destinationPath = public_path('images/tvpssLogo');

            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $tvpssLogo->move($destinationPath, $fileName);
            $schoolVersion->tvpssLogo = 'images/tvpssLogo/' . $fileName;
        }

        $schoolVersion->isFillSchoolName = $schoolInfo->schoolName ? 'Ada' : 'Tiada';
        $schoolVersion->isTvpssLogo = $schoolVersion->tvpssLogo ? 'Ada' : 'Tiada';
        $schoolVersion->isUploadYoutube = $schoolInfo->linkYoutube ? 'Ada' : 'Tiada';
        $schoolVersion->isCollabAgency = ($validated['agency1_name'] || $validated['agency2_name']) ? 'Ada' : 'Tiada';

        $schoolVersion->fill([
            'version' => $validated['version'] ?? $schoolVersion->version, 
            'agency1_name' => $validated['agency1_name'],
            'agencyManager1_name' => $validated['agency1Manager_name'],
            'agency2_name' => $validated['agency2_name'],
            'agencyManager2_name' => $validated['agency2Manager_name'],
            'recordEquipment' => $validated['recordEquipment'],
            'tvpssStudio' => $validated['tvpssStudio'],
            'recInSchool' => $validated['recInSchool'],
            'recInOutSchool' => $validated['recInOutSchool'],
            'greenScreen' => $validated['greenScreen'],
        ]);

        $schoolVersion->status = ApprovalStatusEnum::PENDING;
        $schoolVersion->ppd_approval = false;
        $schoolVersion->state_approval = false;
        $schoolVersion->version = $this->checkTVPSSVersion($schoolInfo, $schoolVersion);

        $schoolVersion->school_info_id = $schoolInfo->id;
        $schoolVersion->save();

        return redirect()->route('tvpss2')->with('success', 'School version updated and submitted for approval!');
    }
    
    private function checkTVPSSVersion(SchoolInfo $schoolInfo, TVPSSVersion $schoolVersion): int
    {
        $isFillSchoolName = $schoolInfo->schoolName ? 'Ada' : 'Tiada';
        $isTvpssLogo = $schoolVersion->tvpssLogo ? 'Ada' : 'Tiada';
        $tvpssStudio = $schoolVersion->tvpssStudio ?? 'Tiada';
        $recInSchool = $schoolVersion->recInSchool ?? 'Tiada';
        $isUploadYoutube = $schoolInfo->linkYoutube ? 'Ada' : 'Tiada';
        $recInOutSchool = $schoolVersion->recInOutSchool ?? 'Tiada';
        $isCollabAgency = ($schoolVersion->agency1_name || $schoolVersion->agency2_name) ? 'Ada' : 'Tiada';
        $greenScreen = $schoolVersion->greenScreen?->value ?? 'Tiada'; 

        // Debugging logs
        Log::info("Check TVPSS Version", [
            'isFillSchoolName' => $isFillSchoolName,
            'isTvpssLogo' => $isTvpssLogo,
            'tvpssStudio' => $tvpssStudio,
            'recInSchool' => $recInSchool,
            'isUploadYoutube' => $isUploadYoutube,
            'recInOutSchool' => $recInOutSchool,
            'isCollabAgency' => $isCollabAgency,
            'greenScreen' => $greenScreen,
        ]);

        if (
            $isFillSchoolName === 'Ada' &&
            $isTvpssLogo === 'Ada' &&
            $tvpssStudio === 'Ada' &&
            $recInSchool === 'Ada' &&
            $isUploadYoutube === 'Ada' &&
            $recInOutSchool === 'Ada' &&
            $isCollabAgency === 'Ada' &&
            $greenScreen === 'Ada'
        ) {
            return versionEnum::V4->value;
        }

        if (
            $isFillSchoolName === 'Ada' &&
            $isTvpssLogo === 'Ada' &&
            $tvpssStudio === 'Ada' &&
            $recInSchool === 'Ada' &&
            $isUploadYoutube === 'Ada' &&
            $recInOutSchool === 'Ada' &&
            $isCollabAgency === 'Ada'
        ) {
            return versionEnum::V3->value;
        }

        if (
            $isFillSchoolName === 'Ada' &&
            $isTvpssLogo === 'Ada' &&
            $tvpssStudio === 'Ada' &&
            $recInSchool === 'Ada' &&
            $isUploadYoutube === 'Ada'
        ) {
            return versionEnum::V2->value;
        }

        if (
            $isFillSchoolName === 'Ada' &&
            $isTvpssLogo === 'Ada' &&
            $tvpssStudio === 'Ada'
        ) {
            return versionEnum::V1->value;
        }

        return versionEnum::NOT_SATISFIED->value;
    }

    public function eqLocCreate(){
        return Inertia::render('4-SchoolAdmin/ManageEquipment/AddEqLoc');
    }

    public function eqLocStore(Request $request)
    {
        $user = $request->user();

        $school = SchoolInfo::where('user_id', $user->id)->first();

        if (!$school) {
            return redirect()->route('school.edit')->with('error', 'Please complete your school information first.');
        }

        $validated = $request->validate([
            'eqLocName' => 'required|string|max:255',
            'eqLocType' => 'required|string|max:255',
        ]);

        EqLocation::create([
            'eqLocName' => $validated['eqLocName'],
            'eqLocType' => $validated['eqLocType'],
            'school_info_id' => $school->id, 
        ]);

        return redirect()->route('equipment.equipmentIndex')->with('success', 'Equipment location successfully added!');
    }

    public function eqLocShow(EqLocation $eqLocation)
    {
        $user = request()->user();

        if ($eqLocation->school_info_id !== SchoolInfo::where('user_id', $user->id)->value('id')) {
            abort(403, 'Unauthorized access.');
        }

        return Inertia::render('4-SchoolAdmin/ManageEquipment/UpdateEqLoc', [
            'eqLocation' => $eqLocation,
        ]);
    }

    public function eqLocEdit(EqLocation $eqLocation)
    {
        $user = request()->user();

        if ($eqLocation->school_info_id !== SchoolInfo::where('user_id', $user->id)->value('id')) {
            abort(403, 'Unauthorized access.');
        }

        return Inertia::render('4-SchoolAdmin/ManageEquipment/UpdateEqLoc', [
            'eqLocation' => $eqLocation,
        ]);
    }

    public function eqLocUpdate(Request $request, $id)
    {
        $eqLocation = EqLocation::findOrFail($id);
        
        try {
            $validated = $request->validate([
                'eqLocName'    => 'required|string|max:255',
                'eqLocType'    => 'required|string|max:255',
            ]);

            $eqLocation->update([
                'eqLocName' => $request->eqLocName,
                'eqLocType' => $request->eqLocType,
            ]);

            return redirect()->route('equipment.equipmentIndex')->with('success', 'Lokasi berjaya dikemaskini!');
        } catch (\Exception $e) {
            return back()->with('error', 'Ralat berlaku, sila cuba lagi.');
        }
    }

    public function eqLocDestroy(EqLocation $eqLocation)
    {
        $eqLocation->delete();

        return redirect()->route('equipment.equipmentIndex')->with('success', 'Barang berjaya dipadam!');
    }

    public function getLocations(Request $request)
    {
        $user = $request->user();

        $school = SchoolInfo::where('user_id', $user->id)->first();

        if (!$school) {
            return response()->json(['locations' => []]);
        }

        $locations = EqLocation::where('school_info_id', $school->id)->get();

        return response()->json(['locations' => $locations]);
    }

    public function getTVPSSVersion(Request $request)
    {
        $user = $request->user();

        $schoolInfo = SchoolInfo::with('schoolVersion')->where('user_id', $user->id)->first();

        if (!$schoolInfo || !$schoolInfo->schoolVersion) {
            return response()->json(['version' => '-']);
        }

        return response()->json(['version' => $schoolInfo->schoolVersion->version]);
    }

    public function studentList(Request $request)
    {
        $user = $request->user();

        $school = SchoolInfo::where('user_id', $user->id)->first();
        $query = Student::where('school_info_id', $school->id);

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%')
                ->orWhere('ic_num', 'like', '%' . $request->input('search') . '%');
        }

        $students = $query->paginate(10);

        return Inertia::render('4-SchoolAdmin/StudentManagement/studentList', [
            'students' => $students,
            'school' => $school,
        ]);
    }

    public function studentCreate(Request $request)
    {
        $user = $request->user();

        $schoolInfo = SchoolInfo::where('user_id', $user->id)->first();

        if (!$schoolInfo) {
            return redirect()->back()->with('error', 'No associated school found for this user.');
        }

        return Inertia::render('4-SchoolAdmin/StudentManagement/addStudent', [
            'schoolInfo' => $schoolInfo,
        ]);
    }

    public function storeStudent(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'ic_num' => 'required|string|unique:students,ic_num',
                'email' => 'required|email|unique:students,email',
                'crew' => 'nullable|string|max:255',
            ]);

            $schoolInfo = SchoolInfo::where('user_id', $request->user()->id)->firstOrFail();

            Student::create([
                'name' => $validatedData['name'],
                'ic_num' => $validatedData['ic_num'], 
                'email' => $validatedData['email'],
                'crew' => $validatedData['crew'],
                'state' => $schoolInfo->state,
                'district' => $schoolInfo->district,
                'schoolName' => $schoolInfo->schoolName,
                'school_info_id' => $schoolInfo->id,
            ]);

            return redirect()->route('student.studentList')->with('success', 'Student added successfully!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->validator->errors())->withInput();
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to add student. Please try again.');
        }
    }

    public function studentEdit($id)
    {
        $user = request()->user();

        $student = Student::where('id', $id)
            ->whereHas('schoolInfo', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->firstOrFail();

        return Inertia::render('4-SchoolAdmin/StudentManagement/updateStudent', [
            'student' => $student,
            'schoolInfo' => $student->schoolInfo,
        ]);
    }

    public function updateStudent(Request $request, $id)
    {
        $user = $request->user();
        $schoolInfo = SchoolInfo::where('user_id', $user->id)->firstOrFail();

        $student = Student::where('id', $id)
            ->where('school_info_id', $schoolInfo->id)
            ->firstOrFail();

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'ic_num' => 'required|string|unique:students,ic_num,' . $id,
            'email' => 'required|email|unique:students,email,' . $id,
            'crew' => 'nullable|string|max:255',
        ]);

        $student->update([
            'name' => $validatedData['name'],
            'ic_num' => $validatedData['ic_num'],
            'email' => $validatedData['email'],
            'crew' => $validatedData['crew'],
            'state' => $schoolInfo->state,
            'district' => $schoolInfo->district,
            'schoolName' => $schoolInfo->schoolName,
            'school_info_id' => $schoolInfo->id,
        ]);

        return redirect()->route('student.studentList')->with('success', 'Student updated successfully!');
    }

    public function deleteStudent($id)
    {
        $user = request()->user();

        $student = Student::where('id', $id)
            ->whereHas('schoolInfo', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->firstOrFail();

        $student->delete();

        return redirect()->route('student.studentList')->with('success', 'Student deleted successfully!');
    }

    public function studCrewList(Request $request)
    {
        $user = $request->user();
    
        $school = SchoolInfo::where('user_id', $user->id)->first();
    
        // Fetch Studcrews with Student details
        $query = Studcrew::with('student')->whereHas('student', function ($q) use ($school) {
            $q->where('school_info_id', $school->id);
        });
    
        if ($request->has('search')) {
            $query->where('jawatan', 'like', '%' . $request->input('search') . '%')
            ->orWhere('status', 'like', '%' . $request->input('search') . '%');
        }
    
        $studcrews = $query->paginate(10);
    
        return Inertia::render('4-SchoolAdmin/StudentManagement/studCrewList', [
            'studcrews' => $studcrews,
            'school' => $school,
        ]);
    }

    public function editStudcrew($id)
    {
        $crew = StudCrew::with('student')->findOrFail($id); // Eager load the student
        return Inertia::render('4-SchoolAdmin/StudentManagement/approveStudCrew', ['crew' => $crew]);
    }

    public function approveStudcrew($id)
    {
        $crew = StudCrew::findOrFail($id);
        $crew->status = 'Approved';
        $crew->save();

        return redirect()->route('studcrew.list')->with('message', 'Application approved successfully.');
    }

    public function rejectStudcrew($id)
    {
        $crew = StudCrew::findOrFail($id);
        $crew->status = 'Rejected';
        $crew->save();

        return redirect()->route('studcrew.list')->with('message', 'Application rejected successfully.');
    }


    public function destroy($id)
    {
        // Find the StudCrew by ID or fail if not found
        $crew = StudCrew::findOrFail($id);

        // Delete the StudCrew
        $crew->delete();

        // Redirect back with a success message
        return redirect()->route('studcrew.list')->with('success', 'StudCrew deleted successfully.');
    }



    public function achievementList(Request $request)
    {
        try {
            $user = $request->user();
            $school = SchoolInfo::where('user_id', $user->id)->firstOrFail();

            $achievements = StudentAchievement::where('school_info_id', $school->id)->get();

            return inertia('4-SchoolAdmin/StudentAchievement/achievementList', [
                'achievements' => $achievements,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve achievements', ['error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Failed to retrieve achievements. Please try again.');
        }
    }

    public function achievementCreate(Request $request)
    {
        $user = $request->user();
        $schoolInfo = SchoolInfo::where('user_id', $user->id)->first();

        if (!$schoolInfo) {
            return redirect()->back()->with('error', 'No associated school found for this user.');
        }

        $students = Student::where('school_info_id', $schoolInfo->id)->get(['ic_num', 'name']);

        return Inertia::render('4-SchoolAdmin/StudentAchievement/addAchievement', [
            'students' => $students,
        ]);
    }

    public function storeAchievement(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'type_of_achievement' => 'required|string|max:255',
                'type_of_application' => 'required|string|in:Individu,Berkumpulan',
                'date' => 'required|date',
                'details' => 'required|string',
                'supporting_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
                'ic_num' => 'required|array|min:1',
                'ic_num.*' => 'required|string|exists:students,ic_num',
            ]);

            $user = $request->user();
            $school = SchoolInfo::where('user_id', $user->id)->firstOrFail();

            $filePath = $request->file('supporting_file')
                ? $request->file('supporting_file')->storeAs(
                    'documents/studentachievement',
                    time() . '_' . $request->file('supporting_file')->getClientOriginalName(),
                    'public'
                )
                : null;

            $achievementId = 'PS' . str_pad(StudentAchievement::count() + 1, 4, '0', STR_PAD_LEFT);

            $students = [];
            foreach ($validatedData['ic_num'] as $ic) {
                $student = Student::where('ic_num', $ic)
                    ->where('school_info_id', $school->id)
                    ->firstOrFail();

                $students[] = [
                    'student_id' => $student->id,
                    'ic_num' => $student->ic_num,
                    'name' => $student->name,
                ];
            }

            StudentAchievement::create([
                'id' => $achievementId,
                'type_of_achievement' => $validatedData['type_of_achievement'],
                'type_of_application' => $validatedData['type_of_application'],
                'date' => $validatedData['date'],
                'details' => $validatedData['details'],
                'supporting_file' => $filePath,
                'students' => $students, 
                'school_info_id' => $school->id, 
                'status' => ApprovalStatusEnum::PENDING->value,
            ]);

            return redirect()->route('achievement.achievementList')->with('success', 'Achievement submitted successfully!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Failed to store achievement', ['error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Failed to submit achievement. Please try again.');
        }
    }

    public function achievementEdit($id, Request $request)
    {
        try {
            $user = $request->user();
            $school = SchoolInfo::where('user_id', $user->id)->firstOrFail();
    
            $achievement = StudentAchievement::where('id', $id)
                ->where('school_info_id', $school->id)
                ->firstOrFail();
    
            return inertia('4-SchoolAdmin/StudentAchievement/viewAchievement', [
                'achievement' => $achievement,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch achievement details', ['error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Failed to fetch achievement details. Please try again.');
        }
    }

    public function deleteAchievement($id, Request $request)
    {
        try {
            $user = $request->user();
            $school = SchoolInfo::where('user_id', $user->id)->firstOrFail();

            $achievement = StudentAchievement::where('id', $id)
                ->where('school_info_id', $school->id)
                ->firstOrFail();

            $achievement->delete();

            return redirect()->route('achievement.achievementList')->with('success', 'Achievement deleted successfully!');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning('Achievement not found or unauthorized access', ['id' => $id, 'error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Achievement not found or you do not have permission to delete it.');
        } catch (\Exception $e) {
            Log::error('Failed to delete achievement', ['error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Failed to delete achievement. Please try again.');
        }
    }

    public function donationList(Request $request)
    {
        try {
            $user = $request->user();
            $school = SchoolInfo::where('user_id', $user->id)->firstOrFail();
    
            // Retrieve the donations associated with the school
            $donations = Donations::where('school_id', $school->id)->get();
    
            // Return the donation list view with the donations data
            return inertia('4-SchoolAdmin/Donation/donationList', [
                'donations' => $donations,
            ]);
        } catch (\Exception $e) {
            // Log any errors that occur
            Log::error('Failed to retrieve donations', ['error' => $e->getMessage()]);
    
            // Redirect back with an error message
            return redirect()->back()->with('error', 'Failed to retrieve donations. Please try again.');
        }
    }
    
    public function getSchoolAdminStats(Request $request)
{
    $user = $request->user();

        // Fetch the school information linked to the School Admin
        $schoolInfo = SchoolInfo::where('user_id', $user->id)->first();

        if (!$schoolInfo) {
            return response()->json([
                'students_count' => 0,
                'achievements_count' => 0,
                'student_crews_count' => 0,
            ]);
        }

        // Get the counts for students, achievements, and crews
        $studentsCount = Student::where('school_info_id', $schoolInfo->id)->count();
        $achievementsCount = StudentAchievement::where('school_info_id', $schoolInfo->id)->count();
        $studentCrewsCount = Studcrew::whereHas('student', function ($query) use ($schoolInfo) {
            $query->where('school_info_id', $schoolInfo->id);
        })->count();

        return response()->json([
            'students_count' => $studentsCount,
            'achievements_count' => $achievementsCount,
            'student_crews_count' => $studentCrewsCount,
        ]);
    
}

public function countStudCrewJawatan(Request $request)
{
    // Get the logged-in user
    $user = $request->user();

    // Fetch the school linked to the logged-in School Admin
    $school = SchoolInfo::where('user_id', $user->id)->first();

    if (!$school) {
        return response()->json([
            'message' => 'No school linked to this user',
            'gaffer_count' => 0,
            'penemuduga_count' => 0,
            'jurukamera_count' => 0,
        ], 404);
    }

    // Count the types of jawatan in the studcrew table
    $gafferCount = Studcrew::where('jawatan', 'Gaffer')->count();
    $penemudugaCount = Studcrew::where('jawatan', 'Penemuduga')->count();
    $jurukameraCount = Studcrew::where('jawatan', 'Jurukamera')->count();

    return response()->json([
        'message' => 'Jawatan counts retrieved successfully',
        'gaffer_count' => $gafferCount,
        'penemuduga_count' => $penemudugaCount,
        'jurukamera_count' => $jurukameraCount,
    ]);
}


}
