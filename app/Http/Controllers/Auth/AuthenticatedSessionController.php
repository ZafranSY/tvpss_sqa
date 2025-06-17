<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        Log::info("User logged in", [
            'user_id' => $user->id,
            'role' => $user->role,
            'email' => $user->email,
        ]);

        switch ($user->role) {
            case User::SUPER_ADMIN:
                Log::info("Redirecting Super Admin", ['user_id' => $user->id]);
                return redirect()->intended(route('dashboardSP', absolute: false));

            case User::STATE_ADMIN:
                Log::info("Redirecting State Admin", ['user_id' => $user->id]);
                return redirect()->intended(route('dashboardST', absolute: false));

            case User::PPD_ADMIN:
                Log::info("Redirecting PPD Admin", ['user_id' => $user->id]);
                return redirect()->intended(route('dashboardPP', absolute: false));

            case User::SCHOOL_ADMIN:
                Log::info("Redirecting School Admin", ['user_id' => $user->id]);
                return redirect()->intended(route('dashboardSA', absolute: false));

            default:
                Log::warning("Unauthorized access attempt", ['user_id' => $user->id]);
                return redirect()->route('login')->withErrors('Unauthorized');
        }
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
