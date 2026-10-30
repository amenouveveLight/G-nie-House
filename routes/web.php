<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;

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
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AuthController::class, 'showLogin'])->name('admin.login');
        Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1')->name('admin.login.submit');
    });

    Route::middleware('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('admin.logout');

        Route::get('/', [AdminController::class, 'dashboard'])->middleware('module:dashboard')->name('admin.dashboard');
        Route::get('/rendez-vous', [AdminController::class, 'appointments'])->middleware('module:appointments')->name('admin.appointments');
        Route::get('/services', [AdminController::class, 'services'])->middleware('module:services')->name('admin.services');
        Route::get('/produits', [AdminController::class, 'products'])->middleware('module:products')->name('admin.products');
        Route::get('/commandes', [AdminController::class, 'orders'])->middleware('module:orders')->name('admin.orders');
        Route::get('/paiements', [AdminController::class, 'payments'])->middleware('module:payments')->name('admin.payments');
        Route::get('/clientes', [AdminController::class, 'clients'])->middleware('module:clients')->name('admin.clients');
        Route::get('/personnel', [AdminController::class, 'staff'])->middleware('module:staff')->name('admin.staff');
        Route::get('/parametres', [AdminController::class, 'settings'])->middleware('module:settings')->name('admin.settings');
    });
});
