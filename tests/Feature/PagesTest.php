<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\User;
use Database\Seeders\DemoDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DemoDataSeeder::class);
    }

    public function test_every_public_page_renders_with_catalog_data(): void
    {
        $pages = [
            '/' => 'Home',
            '/a-propos' => 'About',
            '/services' => 'Services',
            '/boutique' => 'Shop',
            '/contact' => 'Contact',
            '/reservation' => 'Booking',
            '/panier' => 'Cart',
            '/commande' => 'Checkout',
        ];

        foreach ($pages as $url => $component) {
            $this->get($url)->assertInertia(fn (Assert $page) => $page
                ->component($component, false)
                ->has('services', 16)
                ->has('professionals', 4)
                ->has('products', 12)
                ->has('settings.name')
                ->has('settings.openingHours')
            );
        }
    }

    public function test_public_pages_do_not_expose_personal_data(): void
    {
        Appointment::create([
            'reference' => 'RDV-TEST-001',
            'client_id' => 1,
            'service_id' => 1,
            'professional_id' => 1,
            'date' => now()->addDays(3)->toDateString(),
            'start_time' => '10:00',
            'end_time' => '10:45',
            'price' => 15000,
            'status' => 'confirmed',
            'notes' => 'privé',
        ]);

        $this->get('/reservation')->assertInertia(fn (Assert $page) => $page
            ->has('professionals.0', fn (Assert $pro) => $pro
                ->missing('email')
                ->missing('phone')
                ->etc()
            )
            ->has('busySlots.0', fn (Assert $slot) => $slot
                ->missing('client_id')
                ->missing('notes')
                ->missing('price')
                ->etc()
            )
            ->missing('clients')
            ->missing('orders')
            ->missing('transactions')
        );
    }

    public function test_admin_pages_receive_their_data(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->get('/admin/rendez-vous')->assertInertia(fn (Assert $page) => $page
            ->component('admin/AdminAppointments', false)
            ->has('appointments', 8)
            ->has('clients', 6)
        );

        $this->actingAs($admin)->get('/admin/commandes')->assertInertia(fn (Assert $page) => $page
            ->component('admin/AdminOrders', false)
            ->has('orders', 5)
            ->has('orders.0.items')
        );

        $this->actingAs($admin)->get('/admin/paiements')->assertInertia(fn (Assert $page) => $page
            ->has('transactions', 5)
        );

        $this->actingAs($admin)->get('/admin/personnel')->assertInertia(fn (Assert $page) => $page
            ->has('professionals.0.email')
        );
    }

    public function test_employee_dashboard_does_not_receive_financial_or_client_data(): void
    {
        $employee = User::factory()->create(['role' => 'employee']);

        $this->actingAs($employee)->get('/admin')->assertInertia(fn (Assert $page) => $page
            ->component('admin/Dashboard', false)
            ->has('appointments', 8)
            ->has('orders', 0)
            ->has('transactions', 0)
            ->has('clients', 0)
        );
    }

    public function test_seeder_is_idempotent(): void
    {
        $this->seed(DemoDataSeeder::class);

        $this->assertDatabaseCount('services', 16);
        $this->assertDatabaseCount('appointments', 8);
        $this->assertDatabaseCount('order_items', 10);
        $this->assertDatabaseCount('users', 3);
    }
}
