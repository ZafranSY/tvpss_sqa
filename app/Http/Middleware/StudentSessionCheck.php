<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StudentSessionCheck
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): mixed
    {
        // Check if the session has 'ic_num'
        if (!$request->session()->has('ic_num')) {
            // Redirect to the login route if 'ic_num' is missing
            return redirect()->route('student.login');
        }

        // Proceed with the request and let Inertia handle the response
        return $next($request);
    }
}
