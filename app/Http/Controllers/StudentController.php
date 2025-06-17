<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia; // Import the Inertia facade
use App\Models\Student;
use App\Models\Studcrew;
use Illuminate\Support\Facades\Auth;
use App\Http\Middleware\StudentSessionCheck;

class StudentController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('5-Students/Auth/LoginStudent');
    }

    public function login(Request $request)
    {
        $request->validate([
            'ic_num' => 'required|string|max:12',
        ]);
        $student = Student::where('ic_num', $request->input('ic_num'))->first();
    
        if (!$student) {
            return response()->json(['ic_num' => 'Student not found.'], 422);
        }
        session(['ic_num' => $student->ic_num]);
    
        return redirect()->route('student.dashboard');
    }

    // First index method for StudentPage
    public function index()
    {
        $ic_num = session('ic_num');
        $student = Student::where('ic_num', $ic_num)->first();
        
        return Inertia::render('5-Students/StudentPage', [
            'student' => $student, // Pass the student data to the view
        ]);
    }

    public function applyCrew()
    {
        $ic_num = session('ic_num');

        // Retrieve the student data based on IC number
        $student = Student::where('ic_num', $ic_num)->first();

        if (!$student) {
            return redirect()->route('student.dashboard')->with('error', 'Pelajar tidak dijumpai.');
        }

        return Inertia::render('5-Students/ApplyCrew', [
            'student' => $student, // Pass the student data to the view
        ]);
    }

    public function applyCrewSubmit(Request $request)
    {
        // Validate the incoming data
        $validated = $request->validate([
            'ic_num' => 'required|string|max:12',
            'jawatan' => 'required|string',
        ]);

        // Retrieve the student based on IC number
        $student = Student::where('ic_num', $validated['ic_num'])->first();
        if (!$student) {
            return redirect()->route('student.applyCrew')->with('error', 'Pelajar tidak dijumpai.');
        }

        // Save the crew application data
        $studcrew = Studcrew::create([
            'student_id' => $student->id,
            'jawatan' => $validated['jawatan'],
            'status' => 'Permohonan Belum Diproses',
        ]);

        return redirect()->route('student.resultApply', ['icNum' => $student->ic_num]);

    }

    public function resultApply(Request $request)
{
    // Get the IC number of the logged-in user
    $ic_num = session('ic_num'); // Assuming `ic_num` is part of the `users` table
    
    // Fetch student by IC number
    $student = Student::where('ic_num', $ic_num)->with('studcrews.student')->first(); // Make sure to load 'student' relationship with 'studcrews'
    
    if (!$student) {
        return Inertia::render('5-Students/ResultApply', [
            'applications' => [],  // No applications to show
            'message' => 'No student found with the provided IC number.',
        ]);
    }

    // Map the student's Studcrew data
    $applications = $student->studcrews->map(function ($studcrew) {
        return [
            'id' => $studcrew->id,
            'jawatan' => $studcrew->jawatan, // Position
            'status' => $studcrew->status, // Application status
            'dateSubmitted' => $studcrew->created_at->format('d-m-Y H:i:s'), // Format the date if needed
            'name' => $studcrew->student->name,
            'email' => $studcrew->student->email,
            'ic_num' => $studcrew->student->ic_num,
        ];
    });

    // Return the data to the Inertia view
    return Inertia::render('5-Students/ResultApply', [
        'applications' => $applications,
        'message' => 'Student data found.',
    ]);
}

public function logout(Request $request)
{
    //$request->session()->flush();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    
    return redirect('/');  // Direct redirect response
}

    // Store method for creating a new student
    public function store(Request $request)
    {
        return "Store a new student";
    }

    // Update method for updating a student by ID
    public function update(Request $request, $id)
    {
        return "Update student with ID: " . $id;
    }

    // Destroy method for deleting a student by ID
    public function destroy($id)
    {
        return "Delete student with ID: " . $id;
    }
}
