<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Client;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Professional;
use App\Models\SalonSetting;
use App\Models\Service;
use App\Models\StockMovement;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Données de démonstration du salon.
 * Le contenu vient de database/seeders/data/demo.json (généré à partir des données
 * d'exemple du front) ; les statuts utilisent le vocabulaire attendu par l'interface :
 * commandes pending|processing|shipped|delivered|cancelled, paiements pending|paid|refunded,
 * transactions pending|success|failed|refunded, rendez-vous pending|confirmed|completed|cancelled.
 */
class DemoDataSeeder extends Seeder
{
    private array $data;

    public function run(): void
    {
        $this->data = json_decode(file_get_contents(__DIR__.'/data/demo.json'), true, 512, JSON_THROW_ON_ERROR);

        $this->services();
        $this->professionals();
        $this->linkProfessionalsAndServices();
        $this->products();
        $this->clients();
        $this->appointments();
        $this->orders();
        $this->transactions();
        $this->stockMovements();
        $this->settings();
        $this->users();
    }

    private function date(?string $value): ?Carbon
    {
        return $value ? Carbon::parse($value) : null;
    }

    private function services(): void
    {
        foreach ($this->data['services'] as $s) {
            Service::updateOrCreate(['id' => $s['id']], [
                'name' => $s['name'],
                'category' => $s['category'],
                'description' => $s['description'] ?? null,
                'price' => $s['price'],
                'duration' => $s['duration'],
                'image' => $s['image'] ?? null,
                'status' => $s['status'] ?? 'active',
            ]);
        }
    }

    private function professionals(): void
    {
        foreach ($this->data['professionals'] as $p) {
            Professional::updateOrCreate(['id' => $p['id']], [
                'name' => $p['name'],
                'role' => $p['role'],
                'specialties' => $p['specialties'] ?? [],
                'phone' => $p['phone'] ?? null,
                'email' => $p['email'] ?? null,
                'photo' => $p['photo'] ?? null,
                'working_hours' => $p['workingHours'] ?? [],
                'breaks' => $p['breaks'] ?? [],
                'days_off' => $p['daysOff'] ?? [],
                'blocked_slots' => $p['blockedSlots'] ?? [],
                'status' => $p['status'] ?? 'active',
            ]);
        }
    }

    /** Table pivot : à faire une fois services ET professionnelles créés (clés étrangères). */
    private function linkProfessionalsAndServices(): void
    {
        foreach ($this->data['services'] as $s) {
            Service::findOrFail($s['id'])->professionals()->syncWithoutDetaching($s['professionals'] ?? []);
        }

        foreach ($this->data['professionals'] as $p) {
            Professional::findOrFail($p['id'])->services()->syncWithoutDetaching($p['services'] ?? []);
        }
    }

    private function products(): void
    {
        foreach ($this->data['products'] as $p) {
            Product::updateOrCreate(['id' => $p['id']], [
                'name' => $p['name'],
                'description' => $p['description'] ?? null,
                'category' => $p['category'],
                'price' => $p['price'],
                'image' => $p['image'] ?? null,
                'stock' => $p['stock'] ?? 0,
                'alert_threshold' => $p['alertThreshold'] ?? 5,
                'featured' => $p['featured'] ?? false,
                'status' => $p['status'] ?? 'active',
            ]);
        }
    }

    private function clients(): void
    {
        foreach ($this->data['clients'] as $c) {
            Client::updateOrCreate(['id' => $c['id']], [
                'name' => $c['name'],
                'phone' => $c['phone'],
                'email' => $c['email'] ?? null,
                'preferences' => $c['preferences'] ?? null,
                'last_visit' => $this->date($c['lastVisit'] ?? null),
                'created_at' => $this->date($c['createdAt'] ?? null) ?? now(),
            ]);
        }
    }

    private function appointments(): void
    {
        foreach ($this->data['appointments'] as $a) {
            Appointment::updateOrCreate(['id' => $a['id']], [
                'reference' => $a['reference'],
                'client_id' => $a['clientId'],
                'service_id' => $a['serviceId'],
                'professional_id' => $a['professionalId'] ?? null,
                'date' => $a['date'],
                'start_time' => $a['startTime'],
                'end_time' => $a['endTime'],
                'price' => $a['price'],
                'status' => $a['status'],
                'notes' => $a['notes'] ?? null,
                'created_at' => $this->date($a['createdAt'] ?? null) ?? now(),
            ]);
        }
    }

    private function orders(): void
    {
        foreach ($this->data['orders'] as $o) {
            $order = Order::updateOrCreate(['id' => $o['id']], [
                'reference' => $o['reference'],
                'client_id' => $o['clientId'] ?? null,
                'subtotal' => $o['subtotal'],
                'discount' => $o['discount'] ?? 0,
                'shipping_fee' => $o['shippingFee'] ?? 0,
                'total' => $o['total'],
                'delivery_method' => $o['deliveryMethod'] ?? 'pickup',
                'shipping_address' => $o['shippingAddress'] ?? null,
                'order_status' => $o['orderStatus'],
                'payment_status' => $o['paymentStatus'],
                'payment_method' => $o['paymentMethod'] ?? null,
                'created_at' => $this->date($o['createdAt'] ?? null) ?? now(),
            ]);

            $order->items()->delete();
            foreach ($o['items'] ?? [] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['productId'] ?? null,
                    'name' => $item['name'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                ]);
            }
        }
    }

    private function transactions(): void
    {
        foreach ($this->data['transactions'] as $t) {
            Transaction::updateOrCreate(['id' => $t['id']], [
                'reference' => $t['reference'],
                'order_id' => $t['orderId'],
                'amount' => $t['amount'],
                'payment_method' => $t['paymentMethod'],
                'status' => $t['status'],
                'failure_reason' => $t['failureReason'] ?? null,
                'created_at' => $this->date($t['date'] ?? null) ?? now(),
            ]);
        }
    }

    private function stockMovements(): void
    {
        foreach ($this->data['stockMovements'] as $m) {
            StockMovement::updateOrCreate(['id' => $m['id']], [
                'product_id' => $m['productId'],
                'type' => $m['type'],
                'quantity' => $m['quantity'],
                'note' => $m['note'] ?? null,
                'created_at' => $this->date($m['date'] ?? null) ?? now(),
            ]);
        }
    }

    /** Un enregistrement par clé de premier niveau des réglages (name, phone, openingHours...). */
    private function settings(): void
    {
        foreach ($this->data['salonSettings'] as $key => $value) {
            SalonSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }

    /** Comptes de l'espace admin. Mot de passe : SEED_PASSWORD, sinon généré et affiché. */
    private function users(): void
    {
        $password = env('SEED_PASSWORD') ?: Str::random(14);

        $users = [
            ['email' => 'directrice@glamor-beauty.com', 'name' => 'Directrice du Salon', 'role' => 'admin', 'professional_id' => null],
            ['email' => 'manager@glamor-beauty.com', 'name' => 'Responsable Opérationnelle', 'role' => 'manager', 'professional_id' => null],
            ['email' => 'aminata.diallo@glamor-beauty.com', 'name' => 'Aminata Diallo', 'role' => 'employee', 'professional_id' => 1],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(['email' => $user['email']], $user + ['password' => Hash::make($password)]);
        }

        if (! env('SEED_PASSWORD')) {
            $this->command?->warn("Mot de passe généré pour les comptes admin : {$password}");
        }
    }
}