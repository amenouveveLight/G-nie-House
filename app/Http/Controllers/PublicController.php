<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Product;
use App\Models\Professional;
use App\Models\SalonSetting;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    public function home(): Response
    {
        return $this->page('Home');
    }

    public function about(): Response
    {
        return $this->page('About');
    }

    public function services(): Response
    {
        return $this->page('Services');
    }

    public function shop(): Response
    {
        return $this->page('Shop');
    }

    public function contact(): Response
    {
        return $this->page('Contact');
    }

    public function booking(): Response
    {
        return $this->page('Booking');
    }

    public function cart(): Response
    {
        return $this->page('Cart');
    }

    public function checkout(): Response
    {
        return $this->page('Checkout');
    }

    /**
     * Toutes les pages publiques partagent le même jeu de données (catalogue, équipe,
     * réglages du salon). Aucune donnée personnelle n'est exposée : ni coordonnées des
     * professionnelles, ni identité des clientes — les rendez-vous existants ne sont
     * envoyés que sous forme de créneaux occupés.
     */
    private function page(string $component): Response
    {
        return Inertia::render($component, [
            'services' => Service::where('status', 'active')->with('professionals:id')->get(),
            'professionals' => Professional::where('status', 'active')
                ->with('services:id')
                ->get(['id', 'name', 'role', 'specialties', 'photo', 'status', 'working_hours', 'breaks', 'days_off', 'blocked_slots']),
            'products' => Product::where('status', 'active')->get(),
            'settings' => SalonSetting::pluck('value', 'key'),
            'busySlots' => Appointment::where('status', '!=', 'cancelled')
                ->whereDate('date', '>=', now()->toDateString())
                ->get(['id', 'professional_id', 'date', 'start_time', 'end_time', 'status']),
        ]);
    }
}
