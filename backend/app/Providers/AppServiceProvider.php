<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [ /* ... */ ];

    public function boot(): void
    {
        $this->registerPolicies();

        // ← Este 'before' deja pasar SIEMPRE a los admins
        Gate::before(function (User $user, $ability) {
            if ($user->role === 'admin') {
                return true;
            }
        });

        // Tu definición normal (aunque ya no hará falta para los admins)
        Gate::define('admin', function (User $user) {
            return $user->role === 'admin';
        });
    }
}
