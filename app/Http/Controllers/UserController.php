<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Requests\User\StoreUserRequest;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function index()
    {
        $role = request()->get('role', ''); 
        $rowsPerPage = request()->get('rowsPerPage', 50); 

        $usersQuery = User::query();

        if ($role !== '') {
            $usersQuery->where('role', $role);
        }

        $users = $usersQuery->paginate($rowsPerPage);

        return Inertia::render('1-SuperAdmin/UserManagement/ListUser', [
            'users' => $users,
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
            'selectedRole' => $role,  
        ]);
    }

    public function create()
    {
        return Inertia::render('1-SuperAdmin/UserManagement/addUser');
    }

    public function store(StoreUserRequest $request)
    {
        Log::info('Storing new user:', $request->all());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|integer|in:' . User::SUPER_ADMIN . ',' . User::STATE_ADMIN . ',' . User::PPD_ADMIN . ',' . User::SCHOOL_ADMIN,
            'state' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        try {
            $role = (int) $validated['role'];  

            User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $role,
                'state' => $validated['state'],
                'district' => $validated['district'],
                'password' => Hash::make($validated['password']),
            ]);

            Log::info('User created successfully:', $validated);

            return redirect()->route('users.index')->with('success', 'Pengguna berjaya ditambah.');
        } catch (\Exception $e) {
            Log::error('Failed to store user:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to add user.');
        }
    }

    public function show(User $user)
    {
        return Inertia::render('1-SuperAdmin/UserManagement/ShowUser', [
            'user' => $user,
        ]);
    }

    public function edit(User $user)
    {
        $roles = [
            ['id' => User::SUPER_ADMIN, 'name' => 'Super Admin'],
            ['id' => User::STATE_ADMIN, 'name' => 'State Admin'],
            ['id' => User::PPD_ADMIN, 'name' => 'PPD Admin'],
            ['id' => User::SCHOOL_ADMIN, 'name' => 'School Admin'],
        ];

        return Inertia::render('1-SuperAdmin/UserManagement/UpdateUser', [
            'user' => $user,
            'roles' => $roles, 
        ]);
    }

    public function update(UpdateUserRequest $request, $userId)
    {
        $user = User::findOrFail($userId);

        Log::info('Updating user:', $request->all());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|integer|in:' . User::SUPER_ADMIN . ',' . User::STATE_ADMIN . ',' . User::PPD_ADMIN . ',' . User::SCHOOL_ADMIN,
            'state' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'password' => 'nullable|string|min:8|confirmed', 
        ]);

        Log::info('Validated data:', $validated);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'state' => $validated['state'],
            'district' => $validated['district'],
            'password' => $validated['password'] ? Hash::make($validated['password']) : $user->password,
        ]);

        Log::info('User updated:', $user->toArray());

        return redirect()->route('users.index')->with('success', 'Pengguna berjaya dikemaskini.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'Pengguna berjaya dipadam.');
    }

    public function getUserRoleCounts()
    {
        $stateAdminCount = User::where('role', User::STATE_ADMIN)->count();
        $ppdAdminCount = User::where('role', User::PPD_ADMIN)->count();
        $schoolAdminCount = User::where('role', User::SCHOOL_ADMIN)->count();

        return response()->json([
            'state_admin' => $stateAdminCount,
            'ppd_admin' => $ppdAdminCount,
            'school_admin' => $schoolAdminCount,
        ]);
    }

    public function getActiveUserCounts30Minutes()
    {
        $stateAdminCount = User::where('role', User::STATE_ADMIN)
            ->where('last_login_at', '>=', now()->subMinutes(30))
            ->count();

        $ppdAdminCount = User::where('role', User::PPD_ADMIN)
            ->where('last_login_at', '>=', now()->subMinutes(30))
            ->count();

        $schoolAdminCount = User::where('role', User::SCHOOL_ADMIN)
            ->where('last_login_at', '>=', now()->subMinutes(30))
            ->count();

        return response()->json([
            'state_admin_30_minutes' => $stateAdminCount,
            'ppd_admin_30_minutes' => $ppdAdminCount,
            'school_admin_30_minutes' => $schoolAdminCount,
        ]);
    }
}
