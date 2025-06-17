<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CertificateTemplate;
use App\Models\TVPSSVersion;
use App\Enums\ApprovalStatusEnum;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Models\SchoolInfo;
use App\Models\Student;
use App\Models\StudentAchievement;
use App\Models\Studcrew;
use App\Enums\StatusEnum;
use App\Enums\versionEnum;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;


class StateAdminController extends Controller
{
    public function certList()
    {
        $templates = CertificateTemplate::all();

        return Inertia::render('2-StateAdmin/StudentCertificate/CertificateTemplateList', [
            'templates' => $templates,
        ]);
    }

    public function uploadCertForm()
    {
        return Inertia::render('2-StateAdmin/StudentCertificate/CertificateTemplateForm');
    }

    public function uploadTemplate(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,jpg,png',
        ]);

        try {
            $path = $request->file('file')->store('cert_templates','public');

            $template = CertificateTemplate::create([
                'name' => $request->name,
                'file_path' => $path,
            ]);

            return redirect()->route('certList')->with('success', 'Templat sijil berjaya disimpan!');
        } catch (\Exception $e) {
            return response()->json(['error' => 'File upload failed.'], 500);
        }
    }

    public function getTemplates()
    {
        $templates = CertificateTemplate::all();
        return response()->json($templates);
    }

    public function getTemplate($id)
    {
        $template = CertificateTemplate::find($id);
        if (!$template) {
            return response()->json(['error' => 'Template not found.'], 404);
        }
        return response()->json($template);
    }

    // Method to update a specific certificate template
    public function updateTemplate(Request $request, $id)
    {
        $template = CertificateTemplate::find($id);
        if (!$template) {
            return response()->json(['error' => 'Template not found.'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'file' => 'sometimes|file|mimes:pdf,jpg,png', // Adjust based on your needs
        ]);

        try {
            if ($request->hasFile('file')) {
                // Delete the old file if it exists
                if ($template->file_path) {
                    Storage::delete($template->file_path);
                }

                $path = $request->file('file')->store('certificates');
                $template->file_path = $path;
            }

            if ($request->has('name')) {
                $template->name = $request->name;
            }

            $template->save();

            return response()->json($template);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Update failed.'], 500);
        }
    }

    public function editTemplate($id)
    {
        $template = CertificateTemplate::find($id);
        if (!$template) {
            return response()->json(['error' => 'Template not found.'], 404);
        }

        return Inertia::render('2-StateAdmin/StudentCertificate/CertificateTemplateEdit', [
            'template' => $template,
        ]);
    }

    public function certificateGenerateList(Request $request)
    {
        $user = $request->user();
    
        if (!$user->state) {
            return Inertia::render('2-StateAdmin/StudentCertificate/CertificateGenerateList', [
                'schools' => [],
                'message' => 'No schools found for your state.',
            ]);
        }
    
        $schools = SchoolInfo::where('state', $user->state)
            ->with(['schoolVersion' => function ($query) {
                $query->select('id', 'school_info_id', 'version', 'status');
            }])
            ->get()
            ->map(function ($school) {
                return [
                    'schoolCode' => $school->schoolCode,
                    'schoolName' => $school->schoolName,
                    'schoolOfficer' => $school->schoolOfficer,
                    'state' => $school->state,
                    'schoolVersion' => $school->schoolVersion->version ?? '-',
                    'status' => $school->schoolVersion->status ?? 'Null',
                ];
            });
    
        return Inertia::render('2-StateAdmin/StudentCertificate/CertificateGenerateList', [
            'schools' => $schools,
        ]);
    }
    
    public function generateCertificate($schoolCode)
    {
        // Fetch the school by its code
        $school = SchoolInfo::where('schoolCode', $schoolCode)->first();
    
        if (!$school) {
            return redirect()->route('some.error.page')->with('error', 'School not found.');
        }
    
        // Fetch students and their achievements belonging to the school
        $students = Student::where('school_info_id', $school->id)->get();
        
        // Eager load achievements with student data
        $achievements = StudentAchievement::where('school_info_id', $school->id)
            ->with('student') // Eager load student relation
            ->get();
    
        // Return the view or data needed for the certificate generation page
        return inertia('2-StateAdmin/StudentCertificate/GenerateCertificate', [
            'school' => $school,
            'students' => $students,
            'achievements' => $achievements, // Pass achievements
        ]);
    }
    
    public function destroy($id)
    {
        $template = CertificateTemplate::find($id);
        
        if (!$template) {
            return response()->json(['error' => 'Template not found.'], 404);
        }

        try {
            // Delete the file from storage if it exists
            if ($template->file_path) {
                Storage::delete($template->file_path);
            }

            // Delete the template from the database
            $template->delete();

            return redirect()->route('certList')->with('success', 'Template deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('certList')->with('error', 'Failed to delete template.');
        }
    }
    
    public function tvpssInfoIndex(Request $request)
    {
        $user = $request->user();

        if (!$user->state) {
            return Inertia::render('2-StateAdmin/SchoolVersionStatus/listSchool', [
                'schools' => [],
                'message' => 'No schools found for your state.',
            ]);
        }

        $schools = SchoolInfo::where('state', $user->state)
            ->with(['schoolVersion' => function ($query) {
                $query->select('id', 'school_info_id', 'version', 'status');
            }])
            ->get()
            ->map(function ($school) {
                return [
                    'schoolCode' => $school->schoolCode,
                    'schoolName' => $school->schoolName,
                    'schoolOfficer' => $school->schoolOfficer,
                    'state' => $school->state,
                    'schoolVersion' => $school->schoolVersion->version ?? '-',
                    'status' => $school->schoolVersion->status ?? 'Null',
                ];
            });

        return Inertia::render('2-StateAdmin/SchoolVersionStatus/listSchool', [
            'schools' => $schools,
        ]);
    }

    public function tvpssInfoView($schoolCode)
    {
        $school = SchoolInfo::with('schoolVersion')->where('schoolCode', $schoolCode)->first();

        if (!$school) {
            return redirect()->route('schoolInfo.tvpssInfoIndex')->with('error', 'School not found.');
        }

        $currentVersion = $school->schoolVersion->version?->value ?? 0;

        $tvpssData = [
            'schoolName' => $school->schoolName . " (" . $school->schoolCode . ")",
            'schoolCode' => $school->schoolCode,
            'officer' => $school->schoolOfficer,
            'info' => [
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

        return Inertia::render('2-StateAdmin/SchoolVersionStatus/approveStateTvpss', [
            'tvpssData' => $tvpssData,
        ]);
    }

    public function approveTVPSS(Request $request, string $schoolCode)
    {
        $school = SchoolInfo::where('schoolCode', $schoolCode)->firstOrFail();
        $schoolVersion = $school->schoolVersion;

        if (!$schoolVersion) {
            return redirect()
                ->route('schoolInfo.tvpssInfoIndex')
                ->with('error', 'TVPSS Version not found for the given school.');
        }

        $schoolVersion->state_approval = true; 
        $schoolVersion->status = ApprovalStatusEnum::APPROVED;
        $schoolVersion->save();

        return redirect()->route('schoolInfo.tvpssInfoIndex')
            ->with('success', 'TVPSS Version successfully approved!');
    }

    public function rejectTVPSS(Request $request, string $schoolCode)
    {
        $school = SchoolInfo::where('schoolCode', $schoolCode)->firstOrFail();
        $schoolVersion = $school->schoolVersion;

        if (!$schoolVersion) {
            return redirect()
                ->route('schoolInfo.tvpssInfoIndex')
                ->with('error', 'TVPSS Version not found for the given school.');
        }

        $schoolVersion->state_approval = false;
        $schoolVersion->status = ApprovalStatusEnum::REJECTED->value; 
        $schoolVersion->save();

        return redirect()
            ->route('schoolInfo.tvpssInfoIndex')
            ->with('error', 'TVPSS Version has been rejected.');
    }
    
    public function getStateAdminStats()
{
    try {
        $data = [
            'schools_count' => SchoolInfo::count(),
            'achievements_count' => StudentAchievement::count(),
            'approved_tvpss_count' => TVPSSVersion::where('status', 'Pending')->count(),
        ];

        return response()->json($data);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


    public function getVersionCounts()
    {
        // Count the number of schools for each TVPSS version
        $version1Count = TVPSSVersion::where('version', 1)->count();
        $version2Count = TVPSSVersion::where('version', 2)->count();
        $version3Count = TVPSSVersion::where('version', 3)->count();
        $version4Count = TVPSSVersion::where('version', 4)->count();

        // Return the counts as a JSON response
        return response()->json([
            'version1_count' => $version1Count,
            'version2_count' => $version2Count,
            'version3_count' => $version3Count,
            'version4_count' => $version4Count,
        ]);
    }

}
