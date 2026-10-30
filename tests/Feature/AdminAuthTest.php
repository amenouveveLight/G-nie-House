<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/admin')->assertRedirect(route('admin.login'));
        $this->get('/admin/parametres')->assertRedirect(route('admin.login'));
    }

    public function test_login_page_is_reachable_by_guests(): void
    {
        $this->get('/admin/login')->assertOk();
    }

    public function test_user_can_log_in_with_valid_credentials(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        $this->post('/admin/login', ['email' => $user->email, 'password' => 'password'])
            ->assertRedirect(route('admin.dashboard'));

        $this->assertAuthenticatedAs($user);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $user = User::factory()->create();

        $this->post('/admin/login', ['email' => $user->email, 'password' => 'mauvais'])
            ->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_employee_cannot_access_restricted_modules(): void
    {
        $employee = User::factory()->create(['role' => 'employee']);

        $this->actingAs($employee)->get('/admin')->assertOk();
        $this->actingAs($employee)->get('/admin/rendez-vous')->assertOk();
        $this->actingAs($employee)->get('/admin/paiements')->assertForbidden();
        $this->actingAs($employee)->get('/admin/parametres')->assertForbidden();
    }

    public function test_manager_cannot_access_settings_but_admin_can(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'manager']))
            ->get('/admin/parametres')->assertForbidden();

        $this->actingAs(User::factory()->create(['role' => 'admin']))
            ->get('/admin/parametres')->assertOk();
    }

    public function test_user_can_log_out(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']))
            ->post('/admin/logout')
            ->assertRedirect(route('admin.login'));

        $this->assertGuest();
    }
}
