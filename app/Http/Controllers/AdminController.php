<?php

namespace App\Http\Controllers;

use App\Http\Middleware\EnsureModuleAccess;
use App\Models\Appointment;
use App\Models\Client;
use App\Models\Order;
use App\Models\Product;
use App\Models\Professional;
use App\Models\SalonSetting;
use App\Models\Service;
use App\Models\StockMovement;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function dashboard(Request $request): Response
    {
        // Le tableau de bord est visible par tous les rôles : les données financières et
        // clients ne sont envoyées qu'à ceux qui ont accès aux modules correspondants.
        $role = $request->user()->role;
        $allowed = fn (string $module) => EnsureModuleAccess::allowed($role, $module);

        return Inertia::render('admin/Dashboard', [
            'appointments' => $this->allAppointments(),
            'services' => $this->allServices(),
            'professionals' => $this->allProfessionals(),
            'products' => $allowed('products') ? $this->allProducts() : [],
            'orders' => $allowed('orders') ? $this->allOrders() : [],
            'transactions' => $allowed('payments') ? $this->allTransactions() : [],
            'clients' => $allowed('clients') ? $this->allClients() : [],
        ]);
    }

    public function appointments(): Response
    {
        return Inertia::render('admin/AdminAppointments', [
            'appointments' => $this->allAppointments(),
            'services' => $this->allServices(),
            'professionals' => $this->allProfessionals(),
            'clients' => $this->allClients(),
        ]);
    }

    public function services(): Response
    {
        return Inertia::render('admin/AdminServices', [
            'services' => $this->allServices(),
            'professionals' => $this->allProfessionals(),
        ]);
    }

    public function products(): Response
    {
        return Inertia::render('admin/AdminProducts', [
            'products' => $this->allProducts(),
            'stockMovements' => StockMovement::orderBy('created_at')->get(),
        ]);
    }

    public function orders(): Response
    {
        return Inertia::render('admin/AdminOrders', [
            'orders' => $this->allOrders(),
            'clients' => $this->allClients(),
        ]);
    }

    public function payments(): Response
    {
        return Inertia::render('admin/AdminPayments', [
            'transactions' => $this->allTransactions(),
            'orders' => $this->allOrders(),
            'clients' => $this->allClients(),
        ]);
    }

    public function clients(): Response
    {
        return Inertia::render('admin/AdminClients', [
            'clients' => $this->allClients(),
            'appointments' => $this->allAppointments(),
            'orders' => $this->allOrders(),
        ]);
    }

    public function staff(): Response
    {
        return Inertia::render('admin/AdminStaff', [
            'professionals' => $this->allProfessionals(),
            'services' => $this->allServices(),
            'appointments' => $this->allAppointments(),
        ]);
    }

    public function settings(): Response
    {
        return Inertia::render('admin/AdminSettings', [
            'settings' => SalonSetting::pluck('value', 'key'),
        ]);
    }

    private function allAppointments(): Collection
    {
        return Appointment::orderBy('date')->orderBy('start_time')->get();
    }

    private function allServices(): Collection
    {
        return Service::with('professionals:id')->get();
    }

    private function allProfessionals(): Collection
    {
        return Professional::with('services:id')->get();
    }

    private function allProducts(): Collection
    {
        return Product::all();
    }

    private function allOrders(): Collection
    {
        return Order::with('items')->get();
    }

    private function allTransactions(): Collection
    {
        return Transaction::orderBy('created_at')->get();
    }

    private function allClients(): Collection
    {
        return Client::all();
    }
}
