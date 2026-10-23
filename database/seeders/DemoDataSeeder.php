<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\Professional;
use App\Models\Product;
use App\Models\Client;
use App\Models\Appointment;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Transaction;
use App\Models\StockMovement;
use App\Models\SalonSetting;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Users for admin
        User::updateOrCreate(['email' => 'admin@glamor-beauty.com'], [
            'name' => 'Directrice du Salon',
            'password' => Hash::make('admin123'),
        ]);

        // 2. Services
        $servicesData = [
            // Coiffure
            ['id' => 1, 'name' => 'Coupe & Brushing Signature', 'category' => 'coiffure', 'description' => 'Diagnostic personnalisé, shampoing traitant, coupe sur-mesure et brushing soyeux.', 'price' => 15000, 'duration' => 60, 'image' => 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop'],
            ['id' => 2, 'name' => 'Brushing Glamour & Soin', 'category' => 'coiffure', 'description' => 'Mise en forme sublimée avec soin thermo-protecteur et brillance longue durée.', 'price' => 10000, 'duration' => 45, 'image' => 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop'],
            ['id' => 3, 'name' => 'Tresses Africaines & Nattes Stylisées', 'category' => 'coiffure', 'description' => 'Créations artistiques protectrices : box braids, knotless, nattes collées soignées.', 'price' => 25000, 'duration' => 120, 'image' => 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&auto=format&fit=crop'],
            ['id' => 4, 'name' => 'Coloration Lumineuse & Balayage', 'category' => 'coiffure', 'description' => 'Éclaircissement délicat, reflets dorés ou caramel et patine gloss nourrissante.', 'price' => 35000, 'duration' => 120, 'image' => 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop'],
            ['id' => 5, 'name' => 'Coiffure Événementielle & Mariage', 'category' => 'coiffure', 'description' => 'Chignon haute couture, attaches sophistiquées et pose d’accessoires précieux.', 'price' => 40000, 'duration' => 90, 'image' => 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&auto=format&fit=crop'],
            ['id' => 6, 'name' => 'Soin Profond Kératine & Hydratation', 'category' => 'coiffure', 'description' => 'Bain d’huiles précieuses, vapeur régénérante et scellage d’hydratation intensif.', 'price' => 20000, 'duration' => 60, 'image' => 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&auto=format&fit=crop'],
            // Manucure
            ['id' => 7, 'name' => 'Pose de Vernis Classique Élégance', 'category' => 'manucure', 'description' => 'Limage précis, repousse des cuticules et application d’une laque haute brillance.', 'price' => 8000, 'duration' => 30, 'image' => 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&auto=format&fit=crop'],
            ['id' => 8, 'name' => 'Pose de Gel & Rallongement Chablons', 'category' => 'manucure', 'description' => 'Façonnement d’ongles parfaits, robustes et naturels avec finition brillante.', 'price' => 22000, 'duration' => 75, 'image' => 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format&fit=crop'],
            ['id' => 9, 'name' => 'Vernis Semi-Permanent Tenue 3 Semaines', 'category' => 'manucure', 'description' => 'Manucure russe combinée et pose sous lampe UV pour une tenue impeccable.', 'price' => 15000, 'duration' => 45, 'image' => 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&auto=format&fit=crop'],
            ['id' => 10, 'name' => 'Nail Art Haute Couture & Effets Précieux', 'category' => 'manucure', 'description' => 'Feuilles d’or, dégradés babyboomer, incrustations paillettes et motifs peints à la main.', 'price' => 12000, 'duration' => 45, 'image' => 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop'],
            ['id' => 11, 'name' => 'Soin des Mains Royal au Karité', 'category' => 'manucure', 'description' => 'Gommage velours, masque tiède au pur beurre de karité et modelage délassant.', 'price' => 14000, 'duration' => 40, 'image' => 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&auto=format&fit=crop'],
            // Pédicure
            ['id' => 12, 'name' => 'Beauté des Pieds Prestige', 'category' => 'pedicure', 'description' => 'Bain moussant adoucissant, soin des callosités, limage et hydratation intense.', 'price' => 16000, 'duration' => 45, 'image' => 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600&auto=format&fit=crop'],
            ['id' => 13, 'name' => 'Soins des Pieds Calluspeeling Rénovateur', 'category' => 'pedicure', 'description' => 'Traitement novateur éliminant crevasses et callosités sans lame pour une peau de bébé.', 'price' => 22000, 'duration' => 50, 'image' => 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop'],
            ['id' => 14, 'name' => 'Pose de Vernis Pieds & Éclat', 'category' => 'pedicure', 'description' => 'Mise en beauté rapide avec vernis éclatant adapté aux sandales ouvertes.', 'price' => 8000, 'duration' => 30, 'image' => 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&auto=format&fit=crop'],
            ['id' => 15, 'name' => 'Pédicure Esthétique & Gommage Minéral', 'category' => 'pedicure', 'description' => 'Exfoliation aux sels marins, masque enveloppant et soin des ongles complet.', 'price' => 18000, 'duration' => 50, 'image' => 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&auto=format&fit=crop'],
            ['id' => 16, 'name' => 'Pédicure Complète Spa & Réflexologie Douce', 'category' => 'pedicure', 'description' => 'Rituel sensoriel suprême avec bain floral, gommage, masque karité et massage plantaire.', 'price' => 26000, 'duration' => 60, 'image' => 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&auto=format&fit=crop'],
        ];

        foreach ($servicesData as $svc) {
            Service::updateOrCreate(['id' => $svc['id']], $svc);
        }

        // 3. Professionals
        $professionalsData = [
            [
                'id' => 1,
                'name' => 'Aminata Diallo',
                'role' => 'Coiffeuse Senior & Visagiste',
                'specialties' => ['Tresses d’art', 'Colorimétrie', 'Coupes structurées'],
                'phone' => '+225 07 45 89 12 34',
                'email' => 'aminata.diallo@glamor-beauty.com',
                'photo' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&auto=format&fit=crop&crop=faces',
                'working_hours' => [
                    'monday' => ['start' => '09:00', 'end' => '18:00'],
                    'tuesday' => ['start' => '09:00', 'end' => '18:00'],
                    'wednesday' => ['start' => '09:00', 'end' => '18:00'],
                    'thursday' => ['start' => '09:00', 'end' => '18:00'],
                    'friday' => ['start' => '09:00', 'end' => '19:00'],
                    'saturday' => ['start' => '09:00', 'end' => '19:00'],
                ],
                'breaks' => [['start' => '13:00', 'end' => '14:00']],
                'days_off' => ['sunday'],
                'blocked_slots' => [],
                'status' => 'active',
                'service_ids' => [1, 2, 3, 4, 5, 6],
            ],
            [
                'id' => 2,
                'name' => 'Fatou Ndiaye',
                'role' => 'Styliste Ongulaire & Nail Artist',
                'specialties' => ['Nail Art haute précision', 'Extension chablon', 'Gel porcelaine'],
                'phone' => '+225 05 67 12 34 56',
                'email' => 'fatou.ndiaye@glamor-beauty.com',
                'photo' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&auto=format&fit=crop&crop=faces',
                'working_hours' => [
                    'monday' => ['start' => '09:00', 'end' => '18:00'],
                    'tuesday' => ['start' => '09:00', 'end' => '18:00'],
                    'wednesday' => ['start' => '09:00', 'end' => '18:00'],
                    'thursday' => ['start' => '09:00', 'end' => '18:00'],
                    'friday' => ['start' => '09:00', 'end' => '19:00'],
                    'saturday' => ['start' => '09:00', 'end' => '19:00'],
                ],
                'breaks' => [['start' => '12:30', 'end' => '13:30']],
                'days_off' => ['sunday', 'monday'],
                'blocked_slots' => [],
                'status' => 'active',
                'service_ids' => [7, 8, 9, 10, 11, 14],
            ],
            [
                'id' => 3,
                'name' => 'Mariam Koné',
                'role' => 'Experte Soins Capillaires & Tresses',
                'specialties' => ['Soins cuir chevelu', 'Tresses protectrices', 'Brushing'],
                'phone' => '+225 01 23 98 76 54',
                'email' => 'mariam.kone@glamor-beauty.com',
                'photo' => 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&auto=format&fit=crop&crop=faces',
                'working_hours' => [
                    'tuesday' => ['start' => '09:30', 'end' => '18:30'],
                    'wednesday' => ['start' => '09:30', 'end' => '18:30'],
                    'thursday' => ['start' => '09:30', 'end' => '18:30'],
                    'friday' => ['start' => '09:30', 'end' => '19:00'],
                    'saturday' => ['start' => '09:00', 'end' => '19:00'],
                ],
                'breaks' => [['start' => '13:00', 'end' => '14:00']],
                'days_off' => ['sunday', 'monday'],
                'blocked_slots' => [],
                'status' => 'active',
                'service_ids' => [1, 2, 3, 6],
            ],
            [
                'id' => 4,
                'name' => 'Aïssatou Ba',
                'role' => 'Esthéticienne & Praticienne Mains-Pieds',
                'specialties' => ['Pédicure Spa', 'Calluspeeling', 'Modelage relaxant'],
                'phone' => '+225 07 11 22 33 44',
                'email' => 'aissatou.ba@glamor-beauty.com',
                'photo' => 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&auto=format&fit=crop&crop=faces',
                'working_hours' => [
                    'monday' => ['start' => '09:00', 'end' => '18:00'],
                    'wednesday' => ['start' => '09:00', 'end' => '18:00'],
                    'thursday' => ['start' => '09:00', 'end' => '18:00'],
                    'friday' => ['start' => '09:00', 'end' => '19:00'],
                    'saturday' => ['start' => '09:00', 'end' => '19:00'],
                ],
                'breaks' => [['start' => '12:00', 'end' => '13:00']],
                'days_off' => ['sunday', 'tuesday'],
                'blocked_slots' => [],
                'status' => 'active',
                'service_ids' => [7, 9, 11, 12, 13, 15, 16],
            ],
        ];

        foreach ($professionalsData as $prof) {
            $serviceIds = $prof['service_ids'];
            unset($prof['service_ids']);
            $professional = Professional::updateOrCreate(['id' => $prof['id']], $prof);
            $professional->services()->sync($serviceIds);
        }

        // 4. Products
        $productsData = [
            ['id' => 1, 'name' => 'Élixir Capillaire Régénérant Argan & Baobab', 'description' => 'Sérum d’exception nourrissant en profondeur la fibre capillaire sans alourdir.', 'category' => 'capillaire', 'price' => 18000, 'image' => 'https://images.unsplash.com/photo-1608248597359-f24300305ecb?w=600&auto=format&fit=crop', 'stock' => 18, 'alert_threshold' => 5, 'featured' => true, 'status' => 'active'],
            ['id' => 2, 'name' => 'Masque Sublime au Beurre de Mangue & Karité', 'description' => 'Soin réparateur intense pour cheveux secs, frisés ou défrisés.', 'category' => 'capillaire', 'price' => 22000, 'image' => 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop', 'stock' => 12, 'alert_threshold' => 4, 'featured' => true, 'status' => 'active'],
            ['id' => 3, 'name' => 'Shampoing Botanique Sans Sulfates 250ml', 'description' => 'Nettoyant doux infusé à l’aloe vera et à la provitamine B5.', 'category' => 'capillaire', 'price' => 12000, 'image' => 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&auto=format&fit=crop', 'stock' => 3, 'alert_threshold' => 5, 'featured' => false, 'status' => 'active'],
            ['id' => 4, 'name' => 'Crème Définition Boucles & Tresses Hibiscus', 'description' => 'Hydrate, apporte brillance et élimine les frisottis des coiffures afro.', 'category' => 'capillaire', 'price' => 15000, 'image' => 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop', 'stock' => 9, 'alert_threshold' => 3, 'featured' => false, 'status' => 'active'],
            ['id' => 5, 'name' => 'Huile Nourrissante Ongles & Cuticules à l’Amande', 'description' => 'Formule fortifiante au pinceau applicateur précision.', 'category' => 'manucure', 'price' => 7500, 'image' => 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop', 'stock' => 25, 'alert_threshold' => 5, 'featured' => true, 'status' => 'active'],
            ['id' => 6, 'name' => 'Vernis à Ongles Haute Couture "Rose Impérial"', 'description' => 'Teinte poudrée iconique, séchage rapide et éclat miroir.', 'category' => 'manucure', 'price' => 9500, 'image' => 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&auto=format&fit=crop', 'stock' => 14, 'alert_threshold' => 4, 'featured' => false, 'status' => 'active'],
            ['id' => 7, 'name' => 'Baume Réparateur Intense Pieds au Beurre d’Avocat', 'description' => 'Soulage les talons fendillés et hydrate les zones rugueuses.', 'category' => 'soins-pieds', 'price' => 13500, 'image' => 'https://images.unsplash.com/photo-1556228722-d0b7194680bc?w=600&auto=format&fit=crop', 'stock' => 2, 'alert_threshold' => 4, 'featured' => false, 'status' => 'active'],
            ['id' => 8, 'name' => 'Gommage Exfoliant Sels Marins & Eucalyptus', 'description' => 'Draine et adoucit instantanément la peau des pieds fatigués.', 'category' => 'soins-pieds', 'price' => 11000, 'image' => 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop', 'stock' => 0, 'alert_threshold' => 3, 'featured' => false, 'status' => 'active'],
            ['id' => 9, 'name' => 'Brosse en Poils de Sanglier & Bois d’Olivier', 'description' => 'Lisse la fibre capillaire et stimule délicatement la microcirculation.', 'category' => 'accessoires', 'price' => 16000, 'image' => 'https://images.unsplash.com/photo-1590159763121-7c9ff3149e0a?w=600&auto=format&fit=crop', 'stock' => 7, 'alert_threshold' => 2, 'featured' => true, 'status' => 'active'],
        ];

        foreach ($productsData as $prod) {
            Product::updateOrCreate(['id' => $prod['id']], $prod);
        }

        // 5. Clients
        $clientsData = [
            ['id' => 1, 'name' => 'Marie-Josée Kouassi', 'phone' => '+225 07 01 23 45 67', 'email' => 'mj.kouassi@gmail.com', 'preferences' => 'Adore les colorations lumineuses et le thé vert à la menthe.', 'last_visit' => now()->subDays(5)],
            ['id' => 2, 'name' => 'Sarah Traoré', 'phone' => '+225 05 12 34 56 78', 'email' => 'sarah.traore@yahoo.fr', 'preferences' => 'Préfère les poses en gel naturelles et amande.', 'last_visit' => now()->subDays(2)],
            ['id' => 3, 'name' => 'Chantal Bamba', 'phone' => '+225 01 98 76 54 32', 'email' => 'chantal.bamba@orange.ci', 'preferences' => 'Sensible au cuir chevelu, masser avec douceur.', 'last_visit' => now()->subDays(12)],
            ['id' => 4, 'name' => 'Dominique Ouattara', 'phone' => '+225 07 88 99 00 11', 'email' => 'dominique.o@outlook.com', 'preferences' => 'Cliente VIP, créneaux en matinée recommandés.', 'last_visit' => now()->subDays(20)],
        ];

        foreach ($clientsData as $cli) {
            Client::updateOrCreate(['id' => $cli['id']], $cli);
        }

        // 6. Appointments
        $appointmentsData = [
            ['id' => 1, 'reference' => 'RDV-2026-001', 'client_id' => 1, 'service_id' => 1, 'professional_id' => 1, 'date' => now()->format('Y-m-d'), 'start_time' => '10:00', 'end_time' => '11:00', 'price' => 15000, 'status' => 'confirmed', 'notes' => 'Coupe d’entretien régulier.'],
            ['id' => 2, 'reference' => 'RDV-2026-002', 'client_id' => 2, 'service_id' => 8, 'professional_id' => 2, 'date' => now()->format('Y-m-d'), 'start_time' => '14:30', 'end_time' => '15:45', 'price' => 22000, 'status' => 'confirmed', 'notes' => 'Rallongement chablon forme amande.'],
            ['id' => 3, 'reference' => 'RDV-2026-003', 'client_id' => 3, 'service_id' => 6, 'professional_id' => 3, 'date' => now()->addDay()->format('Y-m-d'), 'start_time' => '11:00', 'end_time' => '12:00', 'price' => 20000, 'status' => 'pending', 'notes' => 'Soin kératine profond.'],
            ['id' => 4, 'reference' => 'RDV-2026-004', 'client_id' => 4, 'service_id' => 16, 'professional_id' => 4, 'date' => now()->addDays(2)->format('Y-m-d'), 'start_time' => '15:00', 'end_time' => '16:00', 'price' => 26000, 'status' => 'confirmed', 'notes' => 'Pédicure Spa complète VIP.'],
        ];

        foreach ($appointmentsData as $apt) {
            Appointment::updateOrCreate(['id' => $apt['id']], $apt);
        }

        // 7. Orders & Transactions
        $order = Order::updateOrCreate(['id' => 1], [
            'reference' => 'CMD-2026-001',
            'client_id' => 1,
            'subtotal' => 40000,
            'discount' => 4000,
            'shipping_fee' => 0,
            'total' => 36000,
            'delivery_method' => 'pickup',
            'shipping_address' => ['city' => 'Abidjan', 'district' => 'Cocody'],
            'order_status' => 'payee',
            'payment_status' => 'success',
            'payment_method' => 'mobile_money',
        ]);

        OrderItem::updateOrCreate(['id' => 1], [
            'order_id' => $order->id,
            'product_id' => 1,
            'name' => 'Élixir Capillaire Régénérant Argan & Baobab',
            'price' => 18000,
            'quantity' => 1,
        ]);

        OrderItem::updateOrCreate(['id' => 2], [
            'order_id' => $order->id,
            'product_id' => 2,
            'name' => 'Masque Sublime au Beurre de Mangue & Karité',
            'price' => 22000,
            'quantity' => 1,
        ]);

        Transaction::updateOrCreate(['id' => 1], [
            'reference' => 'TXN-2026-001',
            'order_id' => $order->id,
            'amount' => 36000,
            'payment_method' => 'mobile_money',
            'status' => 'success',
        ]);

        // 8. Salon Settings
        $settingsData = [
            'general' => [
                'name' => "Glam'Or Beauty",
                'phone' => '+225 01 23 45 67 89',
                'email' => 'contact@glamor-beauty.com',
                'address' => "12 Boulevard de la Beauté, Cocody Ambassades, Abidjan, Côte d'Ivoire",
            ],
            'shipping' => [
                'shipping_fee' => 2500,
                'free_shipping_threshold' => 50000,
                'free_pickup' => true,
            ],
            'promo_codes' => [
                ['code' => 'BIENVENUE10', 'discount' => 10, 'type' => 'percentage'],
                ['code' => 'BEAUTY5000', 'discount' => 5000, 'type' => 'fixed'],
            ],
        ];

        foreach ($settingsData as $key => $val) {
            SalonSetting::updateOrCreate(['key' => $key], ['value' => $val]);
        }
    }
}
