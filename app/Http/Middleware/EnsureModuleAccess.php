<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureModuleAccess
{
    /** Modules accessibles par rôle (admin = tout). */
    public const ROLE_MODULES = [
        'admin' => ['*'],
        'manager' => ['dashboard', 'appointments', 'services', 'products', 'orders', 'payments', 'clients', 'staff'],
        'employee' => ['dashboard', 'appointments'],
    ];

    public static function allowed(?string $role, string $module): bool
    {
        $modules = self::ROLE_MODULES[$role] ?? [];

        return in_array('*', $modules, true) || in_array($module, $modules, true);
    }

    public function handle(Request $request, Closure $next, string $module): Response
    {
        abort_unless(self::allowed($request->user()?->role, $module), 403, 'Accès non autorisé.');

        return $next($request);
    }
}
