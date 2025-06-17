<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Donations;
use App\Models\SchoolInfo;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function donationHP()
    {
        return Inertia::render('Donation/donateHP');
    }

    public function getSchools(Request $request)
    {
        try {
            $state = $request->input('state');
            $district = $request->input('district');

            $schools = SchoolInfo::where('state', $state)
                                ->where('district', $district)
                                ->pluck('schoolName');

            return response()->json($schools);
        } catch (\Exception $e) {
            \Log::error('School fetch error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch schools'], 500);
        }
    }

    public function donation(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string',
        'email' => 'required|string',
        'phone' => 'required|string',
        'ic_num' => 'required|string|max:12',
        'amaun' => 'required|numeric',
        'state' => 'required|string',
        'district' => 'required|string',
        'schoolName' => 'required|string',
    ]);

    // Get the school information
    $school = SchoolInfo::where('state', $validated['state'])
                        ->where('district', $validated['district'])
                        ->where('schoolName', $validated['schoolName'])
                        ->first();

    // Save donation data
    $donation = Donations::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'phone' => $validated['phone'],
        'ic_num' => $validated['ic_num'],
        'amaun' => $validated['amaun'],
        'school_id' => $school ? $school->id : null,
    ]);

    // Prepare the payment data with additional information
    $paymentData = array_merge($donation->toArray(), [
        'negeri' => $validated['state'],
        'daerah' => $validated['district'],
        'sekolah' => $validated['schoolName'],
        'paymentMethod' => $request->input('paymentMethod', 'Online Banking')
    ]);

    return Inertia::render('Donation/receiptPage', [
        'paymentData' => $paymentData,
    ]);
}

    public function getSchoolId($state, $district, $schoolName)
    {
        $school = SchoolInfo::where('state', $state)
                            ->where('district', $district)
                            ->where('schoolName', $schoolName)
                            ->first();

        return $school ? $school->id : null;
    }

}
