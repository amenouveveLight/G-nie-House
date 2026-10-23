<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| Routes Publiques - Glam'Or Beauty
|--------------------------------------------------------------------------
*/
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/a-propos', [PublicController::class, 'about'])->name('about');
Route::get('/services', [PublicController::class, 'services'])->name('services');
Route::get('/boutique', [PublicController::class, 'shop'])->name('shop');
Route::get('/contact', [PublicController::class, 'contact'])->name('contact');
Route::get('/reservation', [PublicController::class, 'booking'])->name('booking');
Route::get('/panier', [PublicController::class, 'cart'])->name('cart');
Route::get('/commande', [PublicController::class, 'checkout'])->name('checkout');

/*
|--------------------------------------------------------------------------
| Routes Espace Administration
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->group(function () {
    Route::get('/login', [AdminController::class, 'login'])->name('admin.login');
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/rendez-vous', [AdminController::class, 'appointments'])->name('admin.appointments');
    Route::get('/services', [AdminController::class, 'services'])->name('admin.services');
    Route::get('/produits', [AdminController::class, 'products'])->name('admin.products');
    Route::get('/commandes', [AdminController::class, 'orders'])->name('admin.orders');
    Route::get('/paiements', [AdminController::class, 'payments'])->name('admin.payments');
    Route::get('/clientes', [AdminController::class, 'clients'])->name('admin.clients');
    Route::get('/personnel', [AdminController::class, 'staff'])->name('admin.staff');
    Route::get('/parametres', [AdminController::class, 'settings'])->name('admin.settings');
});
