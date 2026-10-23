<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Service;
use App\Models\Product;
use App\Models\Professional;
use App\Models\Appointment;
use App\Models\Order;
use App\Models\Client;
use App\Models\Transaction;
use App\Models\SalonSetting;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function login(): Response
    {
        return Inertia::render('admin/AdminLogin');
    }

    public function dashboard(): Response
    {
        return Inertia::render('admin/Dashboard', [
            'appointmentsCount' => Appointment::count(),
            'ordersCount' => Order::count(),
            'clientsCount' => Client::count(),
            'servicesCount' => Service::count(),
            'recentAppointments' => Appointment::with(['client', 'service', 'professional'])->latest()->take(5)->get(),
            'recentOrders' => Order::with(['client', 'items'])->latest()->take(5)->get(),
        ]);
    }

    public function appointments(): Response
    {
        return Inertia::render('admin/AdminAppointments', [
            'appointments' => Appointment::with(['client', 'service', 'professional'])->get(),
            'services' => Service::all(),
            'professionals' => Professional::all(),
            'clients' => Client::all(),
        ]);
    }

    public function services(): Response
    {
        return Inertia::render('admin/AdminServices', [
            'services' => Service::with('professionals')->get(),
            'professionals' => Professional::all(),
        ]);
    }

    public function products(): Response
    {
        return Inertia::render('admin/AdminProducts', [
            'products' => Product::all(),
        ]);
    }

    public function orders(): Response
    {
        return Inertia::render('admin/AdminOrders', [
            'orders' => Order::with(['client', 'items.product', 'transaction'])->latest()->get(),
        ]);
    }

    public function payments(): Response
    {
        return Inertia::render('admin/AdminPayments', [
            'transactions' => Transaction::with('order.client')->latest()->get(),
        ]);
    }

    public function clients(): Response
    {
        return Inertia::render('admin/AdminClients', [
            'clients' => Client::withCount(['appointments', 'orders'])->get(),
        ]);
    }

    public function staff(): Response
    {
        return Inertia::render('admin/AdminStaff', [
            'staff' => Professional::with('services')->get(),
            'services' => Service::all(),
        ]);
    }

    public function settings(): Response
    {
        return Inertia::render('admin/AdminSettings', [
            'settings' => SalonSetting::pluck('value', 'key'),
        ]);
    }
}
