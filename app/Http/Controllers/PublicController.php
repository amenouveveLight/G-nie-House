<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Service;
use App\Models\Product;
use App\Models\Professional;
use App\Models\SalonSetting;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Home', [
            'services' => Service::where('status', 'active')->get(),
            'products' => Product::where('status', 'active')->where('featured', true)->get(),
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('About', [
            'professionals' => Professional::where('status', 'active')->get(),
        ]);
    }

    public function services(): Response
    {
        return Inertia::render('Services', [
            'services' => Service::where('status', 'active')->with('professionals')->get(),
        ]);
    }

    public function shop(): Response
    {
        return Inertia::render('Shop', [
            'products' => Product::where('status', 'active')->get(),
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('Contact', [
            'settings' => SalonSetting::pluck('value', 'key'),
        ]);
    }

    public function booking(): Response
    {
        return Inertia::render('Booking', [
            'services' => Service::where('status', 'active')->with('professionals')->get(),
            'professionals' => Professional::where('status', 'active')->get(),
        ]);
    }

    public function cart(): Response
    {
        return Inertia::render('Cart');
    }

    public function checkout(): Response
    {
        return Inertia::render('Checkout');
    }
}
