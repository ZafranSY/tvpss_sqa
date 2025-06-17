<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles) :Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');  
        }

        $role = Auth::user()->role;

        if ($role == 0) {
            #return redirect()->route('superADashControl');  
            Log::debug('Redirecting to super admin dashboard.');
            return redirect()->route('superADashControl');
        }

        if ($role == 1) {
            return redirect()->route('stateADashControl');  
        }

        if ($role == 2) {
            return redirect()->route('ppdADashControl');  
        }

        if ($role == 3) {
            return redirect()->route('schoolADashControl');  
        }

        return $next($request);
    }
}
