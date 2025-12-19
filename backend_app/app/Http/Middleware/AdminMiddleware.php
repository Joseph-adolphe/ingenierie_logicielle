<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        //verifier si l'utilisateur est admin
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'status' => false,
                'message' => 'Accès refusé. Vous n\'êtes pas administrateur.'
            ], 403);
        }
        return $next($request);
    }
}
