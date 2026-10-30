/**
 * Glam'Or Beauty - Données de démonstration (Single Source of Truth)
 * Données complètes et réalistes pour l'application salon de beauté et e-commerce.
 * Prix en FCFA, dates calées autour d'octobre 2026.
 */

// ==========================================
// 1. SERVICES (16 services / 3 catégories)
// ==========================================
export const services = [
  // --- COIFFURE (6 services) ---
  {
    id: 1,
    name: 'Coupe Femme & Brushing Signature',
    category: 'coiffure',
    description: 'Diagnostic personnalisé, shampoing traitant, coupe sur mesure et brushing soigné avec produits thermo-protecteurs.',
    price: 15000,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
    professionals: [1, 3],
    status: 'active'
  },
  {
    id: 2,
    name: 'Brushing Glamour & Soin Express',
    category: 'coiffure',
    description: 'Lavage délicat, masque nourrissant flash et séchage haute brillance pour un mouvement naturel impeccable.',
    price: 12000,
    duration: 30,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    professionals: [1, 3],
    status: 'active'
  },
  {
    id: 3,
    name: 'Tresses Africaines & Nattes Stylisées',
    category: 'coiffure',
    description: 'Confection artisanale de nattes collées, box braids ou vanilles élégantes avec hydratation en profondeur du cuir chevelu.',
    price: 30000,
    duration: 90,
    image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=800&auto=format&fit=crop&q=80',
    professionals: [1, 3],
    status: 'active'
  },
  {
    id: 4,
    name: 'Coloration Experte & Patine Éclat',
    category: 'coiffure',
    description: 'Application de nuance premium sans ammoniaque, fondu naturel, patine réparatrice et soin fixateur de reflets.',
    price: 35000,
    duration: 120,
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&auto=format&fit=crop&q=80',
    professionals: [1],
    status: 'active'
  },
  {
    id: 5,
    name: 'Coiffure Événementielle & Mariage',
    category: 'coiffure',
    description: 'Chignon haute couture, attaches sophistiquées, pose d’ornements et fixation longue tenue pour vos grands jours.',
    price: 50000,
    duration: 120,
    image: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&auto=format&fit=crop&q=80',
    professionals: [1],
    status: 'active'
  },
  {
    id: 6,
    name: 'Soin Capillaire Profond au Karité & Kératine',
    category: 'coiffure',
    description: 'Rituel revitalisant sous vapeur tiède, massage crânien relaxant et régénération de la fibre capillaire fragilisée.',
    price: 22000,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80',
    professionals: [1, 3],
    status: 'active'
  },

  // --- MANUCURE (5 services) ---
  {
    id: 7,
    name: 'Pose de Vernis Classique & Limage',
    category: 'manucure',
    description: 'Mise en forme des ongles, repousse des cuticules, application d’une base protectrice et double couche de vernis de luxe.',
    price: 10000,
    duration: 30,
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&auto=format&fit=crop&q=80',
    professionals: [2, 4],
    status: 'active'
  },
  {
    id: 8,
    name: 'Pose Complète Gel UV & Extensions',
    category: 'manucure',
    description: 'Rallongement aux chablons ou capsules, modelage au gel résistant, finition ultra-brillante ou mate au choix.',
    price: 22000,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=80',
    professionals: [2, 4],
    status: 'active'
  },
  {
    id: 9,
    name: 'Vernis Semi-Permanent Haute Tenue',
    category: 'manucure',
    description: 'Préparation méticuleuse de la plaque de l’ongle, catalysation sous lampe LED, tenue certifiée 3 semaines sans écaillement.',
    price: 18000,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800&auto=format&fit=crop&q=80',
    professionals: [2, 4],
    status: 'active'
  },
  {
    id: 10,
    name: 'Nail Art Créatif & Décoration Sur-Mesure',
    category: 'manucure',
    description: 'Motifs peints à la main, dégradés baby-boomer, incrustations de feuilles d’or ou strass précieux pour un look unique.',
    price: 25000,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&auto=format&fit=crop&q=80',
    professionals: [2],
    status: 'active'
  },
  {
    id: 11,
    name: 'Soin Prestige des Mains & Masque Velours',
    category: 'manucure',
    description: 'Gommage aux sels minéraux, bain d’huile d’argan tiède, masque adoucissant et modelage bienfaisant des mains et poignets.',
    price: 16000,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&auto=format&fit=crop&q=80',
    professionals: [2, 4],
    status: 'active'
  },

  // --- PÉDICURE (5 services) ---
  {
    id: 12,
    name: 'Beauté des Pieds Essentielle',
    category: 'pedicure',
    description: 'Bain bouillonnant délassant, élimination des callosités légères, soin des cuticules et hydratation au beurre de mangue.',
    price: 18000,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&auto=format&fit=crop&q=80',
    professionals: [2, 4],
    status: 'active'
  },
  {
    id: 13,
    name: 'Soin des Pieds Intense Anti-Callosités',
    category: 'pedicure',
    description: 'Traitement kératolytique ciblé, ponçage doux des talons, gommage exfoliant et enveloppement nourrissant.',
    price: 15000,
    duration: 40,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
    professionals: [2, 4],
    status: 'active'
  },
  {
    id: 14,
    name: 'Pose de Vernis Pieds Laqué',
    category: 'pedicure',
    description: 'Nettoyage des ongles, base fortifiante, double laquage aux teintes éclatantes et top coat séchage rapide.',
    price: 10000,
    duration: 25,
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&auto=format&fit=crop&q=80',
    professionals: [2],
    status: 'active'
  },
  {
    id: 15,
    name: 'Pédicure Esthétique & Vernis Semi-Permanent',
    category: 'pedicure',
    description: 'Soin complet des ongles de pieds, traitement des contours et application d’un gel semi-permanent éclat longue tenue.',
    price: 22000,
    duration: 50,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    professionals: [2, 4],
    status: 'active'
  },
  {
    id: 16,
    name: 'Pédicure Spa Complète & Bain Paraffine',
    category: 'pedicure',
    description: 'Rituel d’exception : bain aromatique, gommage sensoriel, bain chaud à la paraffine régénérante et réflexologie relaxante.',
    price: 28000,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop&q=80',
    professionals: [2],
    status: 'active'
  }
];

// ==========================================
// 2. PROFESSIONNELS (4 spécialistes)
// ==========================================
export const professionals = [
  {
    id: 1,
    name: 'Aminata Diallo',
    role: 'Coiffeuse Senior & Visagiste',
    specialties: ['Coupe & Brushing', 'Colorations complexes', 'Coiffure de mariée', 'Soins réparateurs'],
    phone: '+225 07 48 12 34 56',
    email: 'aminata.diallo@glamor-beauty.com',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    services: [1, 2, 3, 4, 5, 6],
    workingHours: {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '19:00' },
      saturday: { start: '09:00', end: '19:00' },
      sunday: null
    },
    breaks: [{ start: '12:30', end: '13:30' }],
    daysOff: ['sunday'],
    blockedSlots: [
      { date: '2026-10-15', start: '14:00', end: '16:00', reason: 'Formation technique coloration' },
      { date: '2026-10-22', start: '10:00', end: '12:00', reason: 'Rendez-vous fournisseur' }
    ],
    status: 'active'
  },
  {
    id: 2,
    name: 'Fatou Ndiaye',
    role: 'Styliste Ongulaire & Nail Artist',
    specialties: ['Pose Gel UV', 'Nail Art d\'exception', 'Vernis semi-permanent', 'Pédicure Spa'],
    phone: '+225 05 89 23 45 67',
    email: 'fatou.ndiaye@glamor-beauty.com',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
    services: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    workingHours: {
      monday: { start: '09:30', end: '18:30' },
      tuesday: { start: '09:30', end: '18:30' },
      wednesday: { start: '09:30', end: '18:30' },
      thursday: { start: '09:30', end: '18:30' },
      friday: { start: '09:00', end: '19:00' },
      saturday: { start: '09:00', end: '19:00' },
      sunday: null
    },
    breaks: [{ start: '13:00', end: '14:00' }],
    daysOff: ['sunday'],
    blockedSlots: [
      { date: '2026-10-18', start: '15:00', end: '17:00', reason: 'Masterclass Nail Art international' }
    ],
    status: 'active'
  },
  {
    id: 3,
    name: 'Mariam Koné',
    role: 'Coiffeuse Spécialiste Tresses & Soins',
    specialties: ['Tresses africaines', 'Nattes collées', 'Soins botaniques', 'Brushing lissant'],
    phone: '+225 01 02 34 56 78',
    email: 'mariam.kone@glamor-beauty.com',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    services: [1, 2, 3, 6],
    workingHours: {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '19:00' },
      saturday: { start: '09:00', end: '19:00' },
      sunday: null
    },
    breaks: [{ start: '12:00', end: '13:00' }],
    daysOff: ['monday', 'sunday'],
    blockedSlots: [
      { date: '2026-10-16', start: '11:00', end: '12:30', reason: 'Atelier soins naturels' }
    ],
    status: 'active'
  },
  {
    id: 4,
    name: 'Aïssatou Ba',
    role: 'Esthéticienne & Praticienne Mains-Pieds',
    specialties: ['Soins bien-être', 'Manucure russe', 'Callus peeling', 'Gommages sensoriels'],
    phone: '+225 07 77 88 99 00',
    email: 'aissatou.ba@glamor-beauty.com',
    photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=500&auto=format&fit=crop&q=80',
    services: [7, 8, 9, 11, 12, 13, 15],
    workingHours: {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '19:00' },
      saturday: { start: '09:00', end: '19:00' },
      sunday: null
    },
    breaks: [{ start: '13:30', end: '14:30' }],
    daysOff: ['sunday'],
    blockedSlots: [
      { date: '2026-10-20', start: '09:00', end: '11:00', reason: 'Inventaire matériel institut' }
    ],
    status: 'active'
  }
];

// ==========================================
// 3. PRODUITS (12 produits / 4 catégories)
// ==========================================
export const products = [
  // --- CAPILLAIRE (3 produits) ---
  {
    id: 1,
    name: 'Élixir Capillaire Régénérant Argan & Ricin (100ml)',
    description: 'Huile précieuse multifonction pour nourrir les pointes sèches, stimuler la pousse et apporter un éclat soyeux sans alourdir.',
    category: 'capillaire',
    price: 14500,
    image: 'https://images.unsplash.com/photo-1608248597359-597541604a37?w=800&auto=format&fit=crop&q=80',
    stock: 18,
    alertThreshold: 5,
    status: 'active',
    featured: true
  },
  {
    id: 2,
    name: 'Masque Réparateur Intense au Beurre de Karité (250ml)',
    description: 'Traitement réparateur profond formulé pour cheveux secs ou défrisés. Restaure l’élasticité et discipline les frisottis.',
    category: 'capillaire',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&auto=format&fit=crop&q=80',
    stock: 4, // Stock faible pour alerte
    alertThreshold: 5,
    status: 'active',
    featured: true
  },
  {
    id: 3,
    name: 'Shampoing Doux Sans Sulfate Éclat & Volume (300ml)',
    description: 'Nettoie en douceur tout en préservant le film lipidique naturel et l’éclat des colorations. Parfum jasmin délicat.',
    category: 'capillaire',
    price: 11000,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80',
    stock: 22,
    alertThreshold: 5,
    status: 'active',
    featured: false
  },

  // --- MANUCURE (3 produits) ---
  {
    id: 4,
    name: 'Huile Nourrissante Cuticules Rose & Amande (15ml)',
    description: 'Cocktail vitaminé aux extraits de rose pour adoucir les cuticules, fortifier les ongles cassants et stimuler une repousse saine.',
    category: 'manucure',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1607602132700-068258431c6c?w=800&auto=format&fit=crop&q=80',
    stock: 12,
    alertThreshold: 5,
    status: 'active',
    featured: true
  },
  {
    id: 5,
    name: 'Vernis Gel Laqué Rouge Royal 12ml',
    description: 'Pigments purs et formule longue durée offrant une brillance miroir et une résistance supérieure aux chocs jusqu’à 14 jours.',
    category: 'manucure',
    price: 9000,
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&auto=format&fit=crop&q=80',
    stock: 3, // Stock faible pour alerte
    alertThreshold: 5,
    status: 'active',
    featured: false
  },
  {
    id: 6,
    name: 'Crème Mains Veloutée Hydratation Intense (75ml)',
    description: 'Texture non grasse enrichie en glycérine végétale et fleur d’oranger pour protéger les mains contre les agressions quotidiennes.',
    category: 'manucure',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    stock: 0, // Rupture de stock pour démo
    alertThreshold: 5,
    status: 'active',
    featured: false
  },

  // --- SOINS PIEDS (3 produits) ---
  {
    id: 7,
    name: 'Baume Réparateur Talons Fendillés & Callosités (100ml)',
    description: 'Formule concentrée à 15% d’urée et huile de baobab pour réparer en profondeur les talons les plus rugueux dès 3 applications.',
    category: 'soins-pieds',
    price: 13000,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
    stock: 15,
    alertThreshold: 5,
    status: 'active',
    featured: true
  },
  {
    id: 8,
    name: 'Gommage Exfoliant Pieds Menthe & Sel Marin (200g)',
    description: 'Exfoliant vivifiant éliminant efficacement les peaux mortes tout en procurant une sensation immédiate de fraîcheur et légèreté.',
    category: 'soins-pieds',
    price: 11500,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80',
    stock: 8,
    alertThreshold: 5,
    status: 'active',
    featured: false
  },
  {
    id: 9,
    name: 'Spray Fraîcheur & Décongestion Jambes Légères (150ml)',
    description: 'Brume délassante enrichie en menthol et extrait de vigne rouge pour soulager les tensions et apaiser les jambes fatiguées.',
    category: 'soins-pieds',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    stock: 2, // Stock faible pour alerte
    alertThreshold: 5,
    status: 'active',
    featured: false
  },

  // --- ACCESSOIRES (3 produits) ---
  {
    id: 10,
    name: 'Brosse Démêlante Ergonomique Soie & Poils Doux',
    description: 'Conçue pour démêler les cheveux délicats sans casser la fibre capillaire ni tirer sur le cuir chevelu. Finition dorée chic.',
    category: 'accessoires',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1590159763121-7c9ff3149e0a?w=800&auto=format&fit=crop&q=80',
    stock: 25,
    alertThreshold: 5,
    status: 'active',
    featured: true
  },
  {
    id: 11,
    name: 'Kit Manucure Précision Doré en Cuir Véritable',
    description: 'Trousse de luxe comprenant coupe-ongles de précision, pince à cuticules biseautée, lime en verre et repousse-ongles.',
    category: 'accessoires',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&auto=format&fit=crop&q=80',
    stock: 9,
    alertThreshold: 5,
    status: 'active',
    featured: true
  },
  {
    id: 12,
    name: 'Bonnet de Nuit en Soie Pure Glamour Rose',
    description: 'Protège vos brushings, tresses et boucles naturelles contre les frottements nocturnes et préserve l’hydratation du cheveu.',
    category: 'accessoires',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
    stock: 14,
    alertThreshold: 5,
    status: 'active',
    featured: false
  }
];

// ==========================================
// 4. CLIENTS (6 clients réalistes)
// ==========================================
export const clients = [
  {
    id: 1,
    name: 'Kady Traoré',
    phone: '+225 07 11 22 33 44',
    email: 'kady.traore@gmail.com',
    preferences: 'Sensible du cuir chevelu. Préfère l’eau tiède et le thé à la menthe lors des soins. Vernis nude favori.',
    createdAt: '2026-02-14T10:30:00Z',
    lastVisit: '2026-10-10'
  },
  {
    id: 2,
    name: 'Sarah Kouamé',
    phone: '+225 05 44 55 66 77',
    email: 'sarah.kouame@yahoo.fr',
    preferences: 'Aime les coupes graphiques et le vernis semi-permanent rouge carmin. Toujours ponctuelle.',
    createdAt: '2026-03-20T14:15:00Z',
    lastVisit: '2026-10-12'
  },
  {
    id: 3,
    name: 'Chantal Bamba',
    phone: '+225 01 88 99 00 11',
    email: 'chantal.bamba@outlook.com',
    preferences: 'Adepte des tresses fines et des soins réguliers au karité bio. Allergie légère aux parfums synthétiques.',
    createdAt: '2026-05-08T09:00:00Z',
    lastVisit: '2026-09-28'
  },
  {
    id: 4,
    name: 'Esther Ouloto',
    phone: '+225 07 99 88 77 66',
    email: 'esther.ouloto@gmail.com',
    preferences: 'Client VIP mariage. Soins complets mains et pieds avec nail art géométrique sobre.',
    createdAt: '2026-06-15T16:45:00Z',
    lastVisit: '2026-10-05'
  },
  {
    id: 5,
    name: 'Olivia N\'Guessan',
    phone: '+225 05 12 34 56 78',
    email: 'olivia.nguessan@gmail.com',
    preferences: 'Rendez-vous entre 12h et 14h de préférence. Soin des pieds complet tous les mois.',
    createdAt: '2026-07-02T11:20:00Z',
    lastVisit: '2026-10-08'
  },
  {
    id: 6,
    name: 'Aude Mensah',
    phone: '+225 01 45 67 89 01',
    email: 'aude.mensah@gmail.com',
    preferences: 'Nouvelle cliente, souhaite tester les soins capillaires et la gamme d’huiles naturelles.',
    createdAt: '2026-09-10T15:00:00Z',
    lastVisit: '2026-09-25'
  }
];

// ==========================================
// 5. RENDEZ-VOUS (8 rendez-vous réalistes)
// ==========================================
export const appointments = [
  {
    id: 1,
    reference: 'RDV-2026-001',
    clientId: 1,
    serviceId: 1, // Coupe femme & brushing
    professionalId: 1, // Aminata Diallo
    date: '2026-10-05',
    startTime: '10:00',
    endTime: '10:45',
    price: 15000,
    status: 'completed',
    notes: 'Cliente ravie du dégradé naturel. Shampoing traitant appliqué.',
    createdAt: '2026-10-01T09:12:00Z'
  },
  {
    id: 2,
    reference: 'RDV-2026-002',
    clientId: 2,
    serviceId: 8, // Pose de gel UV
    professionalId: 2, // Fatou Ndiaye
    date: '2026-10-08',
    startTime: '14:00',
    endTime: '15:00',
    price: 22000,
    status: 'completed',
    notes: 'Pose chablons amande courte, finition nude brillant.',
    createdAt: '2026-10-02T15:40:00Z'
  },
  {
    id: 3,
    reference: 'RDV-2026-003',
    clientId: 3,
    serviceId: 3, // Tresses
    professionalId: 3, // Mariam Koné
    date: '2026-10-10',
    startTime: '09:30',
    endTime: '11:00',
    price: 30000,
    status: 'completed',
    notes: 'Tresses moyennes longueur épaules avec mèches naturelles fournies par le salon.',
    createdAt: '2026-10-04T18:20:00Z'
  },
  {
    id: 4,
    reference: 'RDV-2026-004',
    clientId: 4,
    serviceId: 16, // Pédicure spa complète
    professionalId: 2, // Fatou Ndiaye
    date: '2026-10-14',
    startTime: '11:00',
    endTime: '12:00',
    price: 28000,
    status: 'confirmed',
    notes: 'Préparation pour une cérémonie de mariage le week-end.',
    createdAt: '2026-10-09T11:15:00Z'
  },
  {
    id: 5,
    reference: 'RDV-2026-005',
    clientId: 5,
    serviceId: 9, // Vernis semi-permanent
    professionalId: 4, // Aïssatou Ba
    date: '2026-10-14',
    startTime: '15:00',
    endTime: '15:45',
    price: 18000,
    status: 'confirmed',
    notes: 'Teinte terracotta d’automne souhaitée.',
    createdAt: '2026-10-10T14:30:00Z'
  },
  {
    id: 6,
    reference: 'RDV-2026-006',
    clientId: 6,
    serviceId: 6, // Soin capillaire profond
    professionalId: 1, // Aminata Diallo
    date: '2026-10-15',
    startTime: '16:00',
    endTime: '17:00',
    price: 22000,
    status: 'confirmed',
    notes: 'Première séance d’un protocole de soin en 3 étapes.',
    createdAt: '2026-10-11T08:50:00Z'
  },
  {
    id: 7,
    reference: 'RDV-2026-007',
    clientId: 2,
    serviceId: 4, // Coloration experte
    professionalId: 1, // Aminata Diallo
    date: '2026-10-17',
    startTime: '10:00',
    endTime: '12:00',
    price: 35000,
    status: 'pending',
    notes: 'Demande de conseil coloration caramel doré à confirmer avec la cliente.',
    createdAt: '2026-10-11T16:05:00Z'
  },
  {
    id: 8,
    reference: 'RDV-2026-008',
    clientId: 1,
    serviceId: 11, // Soin prestige des mains
    professionalId: 4, // Aïssatou Ba
    date: '2026-10-12',
    startTime: '16:30',
    endTime: '17:15',
    price: 16000,
    status: 'cancelled',
    notes: 'Annulé par la cliente pour cause d’imprévu professionnel. Report prévu.',
    createdAt: '2026-10-06T10:00:00Z'
  }
];

// ==========================================
// 6. COMMANDES (5 commandes e-commerce)
// ==========================================
export const orders = [
  {
    id: 1,
    reference: 'CMD-2026-001',
    clientId: 1,
    items: [
      { productId: 1, name: 'Élixir Capillaire Régénérant Argan & Ricin (100ml)', price: 14500, quantity: 1 },
      { productId: 4, name: 'Huile Nourrissante Cuticules Rose & Amande (15ml)', price: 7500, quantity: 1 }
    ],
    subtotal: 22000,
    discount: 2200, // Code BIENVENUE10 (10%)
    shippingFee: 2500,
    total: 22300,
    deliveryMethod: 'delivery',
    shippingAddress: {
      recipient: 'Kady Traoré',
      phone: '+225 07 11 22 33 44',
      street: 'Rue des Jardins, Immeuble Flamboyant, Apt 4B',
      district: 'Cocody Deux-Plateaux',
      city: 'Abidjan',
      country: 'Côte d\'Ivoire'
    },
    orderStatus: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'mobile_money',
    createdAt: '2026-10-02T11:30:00Z'
  },
  {
    id: 2,
    reference: 'CMD-2026-002',
    clientId: 2,
    items: [
      { productId: 11, name: 'Kit Manucure Précision Doré en Cuir Véritable', price: 24000, quantity: 1 },
      { productId: 5, name: 'Vernis Gel Laqué Rouge Royal 12ml', price: 9000, quantity: 1 }
    ],
    subtotal: 33000,
    discount: 5000, // Code BEAUTY5000 (-5000 FCFA)
    shippingFee: 0,
    total: 28000,
    deliveryMethod: 'pickup',
    shippingAddress: {
      recipient: 'Sarah Kouamé',
      phone: '+225 05 44 55 66 77',
      street: 'Retrait sur place en boutique Glam\'Or Beauty',
      city: 'Abidjan',
      country: 'Côte d\'Ivoire'
    },
    orderStatus: 'ready_for_pickup',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    createdAt: '2026-10-06T15:15:00Z'
  },
  {
    id: 3,
    reference: 'CMD-2026-003',
    clientId: 3,
    items: [
      { productId: 2, name: 'Masque Réparateur Intense au Beurre de Karité (250ml)', price: 18000, quantity: 2 },
      { productId: 10, name: 'Brosse Démêlante Ergonomique Soie & Poils Doux', price: 12000, quantity: 1 }
    ],
    subtotal: 48000,
    discount: 0,
    shippingFee: 2500,
    total: 50500,
    deliveryMethod: 'delivery',
    shippingAddress: {
      recipient: 'Chantal Bamba',
      phone: '+225 01 88 99 00 11',
      street: 'Boulevard Latrille, Résidence Harmonie Villa 12',
      district: 'Angré 7ème Tranche',
      city: 'Abidjan',
      country: 'Côte d\'Ivoire'
    },
    orderStatus: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    createdAt: '2026-10-08T09:45:00Z'
  },
  {
    id: 4,
    reference: 'CMD-2026-004',
    clientId: 4,
    items: [
      { productId: 7, name: 'Baume Réparateur Talons Fendillés & Callosités (100ml)', price: 13000, quantity: 1 },
      { productId: 8, name: 'Gommage Exfoliant Pieds Menthe & Sel Marin (200g)', price: 11500, quantity: 1 },
      { productId: 12, name: 'Bonnet de Nuit en Soie Pure Glamour Rose', price: 15000, quantity: 1 }
    ],
    subtotal: 39500,
    discount: 3950, // Code BIENVENUE10
    shippingFee: 2500,
    total: 38050,
    deliveryMethod: 'delivery',
    shippingAddress: {
      recipient: 'Esther Ouloto',
      phone: '+225 07 99 88 77 66',
      street: 'Zone 4C, Rue Pierre et Marie Curie',
      district: 'Marcory',
      city: 'Abidjan',
      country: 'Côte d\'Ivoire'
    },
    orderStatus: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'mobile_money',
    createdAt: '2026-10-11T10:10:00Z'
  },
  {
    id: 5,
    reference: 'CMD-2026-005',
    clientId: 5,
    items: [
      { productId: 3, name: 'Shampoing Doux Sans Sulfate Éclat & Volume (300ml)', price: 11000, quantity: 1 }
    ],
    subtotal: 11000,
    discount: 0,
    shippingFee: 0,
    total: 11000,
    deliveryMethod: 'pickup',
    shippingAddress: {
      recipient: 'Olivia N\'Guessan',
      phone: '+225 05 12 34 56 78',
      street: 'Retrait express au salon Glam\'Or',
      city: 'Abidjan',
      country: 'Côte d\'Ivoire'
    },
    orderStatus: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'cash',
    createdAt: '2026-10-11T14:50:00Z'
  }
];

// ==========================================
// 7. TRANSACTIONS (5 transactions liées)
// ==========================================
export const transactions = [
  {
    id: 1,
    reference: 'TXN-2026-001',
    orderId: 1,
    amount: 22300,
    paymentMethod: 'mobile_money',
    status: 'success',
    date: '2026-10-02T11:32:15Z',
    failureReason: null
  },
  {
    id: 2,
    reference: 'TXN-2026-002',
    orderId: 2,
    amount: 28000,
    paymentMethod: 'card',
    status: 'success',
    date: '2026-10-06T15:16:40Z',
    failureReason: null
  },
  {
    id: 3,
    reference: 'TXN-2026-003',
    orderId: 3,
    amount: 50500,
    paymentMethod: 'card',
    status: 'success',
    date: '2026-10-08T09:47:02Z',
    failureReason: null
  },
  {
    id: 4,
    reference: 'TXN-2026-004',
    orderId: 4,
    amount: 38050,
    paymentMethod: 'mobile_money',
    status: 'success',
    date: '2026-10-11T10:12:30Z',
    failureReason: null
  },
  {
    id: 5,
    reference: 'TXN-2026-005',
    orderId: 5,
    amount: 11000,
    paymentMethod: 'cash',
    status: 'pending',
    date: '2026-10-11T14:50:00Z',
    failureReason: 'En attente de règlement au retrait en salon'
  }
];

// ==========================================
// 8. MOUVEMENTS DE STOCK (10 entrées)
// ==========================================
export const stockMovements = [
  {
    id: 1,
    productId: 1,
    type: 'entry',
    quantity: 25,
    date: '2026-09-25T08:30:00Z',
    note: 'Réception arrivage fournisseur cosmétiques bio'
  },
  {
    id: 2,
    productId: 1,
    type: 'order',
    quantity: -1,
    date: '2026-10-02T11:30:00Z',
    note: 'Commande client CMD-2026-001'
  },
  {
    id: 3,
    productId: 4,
    type: 'order',
    quantity: -1,
    date: '2026-10-02T11:30:00Z',
    note: 'Commande client CMD-2026-001'
  },
  {
    id: 4,
    productId: 2,
    type: 'exit',
    quantity: -2,
    date: '2026-10-04T17:00:00Z',
    note: 'Utilisation interne pour cabine de coiffure'
  },
  {
    id: 5,
    productId: 11,
    type: 'order',
    quantity: -1,
    date: '2026-10-06T15:15:00Z',
    note: 'Commande client CMD-2026-002'
  },
  {
    id: 6,
    productId: 5,
    type: 'order',
    quantity: -1,
    date: '2026-10-06T15:15:00Z',
    note: 'Commande client CMD-2026-002'
  },
  {
    id: 7,
    productId: 2,
    type: 'order',
    quantity: -2,
    date: '2026-10-08T09:45:00Z',
    note: 'Commande client CMD-2026-003'
  },
  {
    id: 8,
    productId: 10,
    type: 'order',
    quantity: -1,
    date: '2026-10-08T09:45:00Z',
    note: 'Commande client CMD-2026-003'
  },
  {
    id: 9,
    productId: 6,
    type: 'adjustment',
    quantity: -3,
    date: '2026-10-09T18:00:00Z',
    note: 'Ajustement inventaire : produit épuisé et rupture confirmée'
  },
  {
    id: 10,
    productId: 7,
    type: 'order',
    quantity: -1,
    date: '2026-10-11T10:10:00Z',
    note: 'Commande client CMD-2026-004'
  }
];

// ==========================================
// 9. PARAMÈTRES DU SALON
// ==========================================
export const salonSettings = {
  name: "Glam'Or Beauty",
  slogan: "L'art de sublimer votre élégance naturelle",
  logo: null,
  phone: '+225 01 23 45 67 89',
  secondaryPhone: '+225 07 89 01 23 45',
  email: 'contact@glamor-beauty.com',
  address: "12 Boulevard de la Beauté, Cocody Ambassades, Abidjan, Côte d'Ivoire",
  coordinates: {
    lat: 5.3400,
    lng: -4.0150
  },
  openingHours: {
    monday: { open: '09:00', close: '19:00', isOpen: true },
    tuesday: { open: '09:00', close: '19:00', isOpen: true },
    wednesday: { open: '09:00', close: '19:00', isOpen: true },
    thursday: { open: '09:00', close: '19:00', isOpen: true },
    friday: { open: '09:00', close: '20:00', isOpen: true },
    saturday: { open: '09:00', close: '20:00', isOpen: true },
    sunday: { open: null, close: null, isOpen: false }
  },
  closedDates: [
    '2026-12-25',
    '2026-01-01',
    '2026-05-01',
    '2026-08-07' // Fête nationale de Côte d'Ivoire
  ],
  slotDuration: 30, // en minutes
  categories: [
    { id: 'coiffure', name: 'Coiffure & Soins Capillaires', icon: 'Scissors', count: 6 },
    { id: 'manucure', name: 'Manucure & Onglerie', icon: 'Sparkles', count: 5 },
    { id: 'pedicure', name: 'Pédicure & Soins des Pieds', icon: 'Footprints', count: 5 }
  ],
  productCategories: [
    { id: 'capillaire', name: 'Soins Capillaires' },
    { id: 'manucure', name: 'Beauté des Mains' },
    { id: 'soins-pieds', name: 'Soins des Pieds' },
    { id: 'accessoires', name: 'Accessoires & Outils' }
  ],
  stockAlertThreshold: 5,
  paymentMethods: [
    { id: 'card', name: 'Carte bancaire (Visa / Mastercard)', active: true },
    { id: 'mobile_money', name: 'Mobile Money (Wave, Orange, MTN, Moov)', active: true },
    { id: 'cash', name: 'Paiement au salon / à la livraison', active: true }
  ],
  shippingFee: 2500,
  freeShippingThreshold: 50000,
  freePickup: true,
  promoCodes: [
    {
      code: 'BIENVENUE10',
      discount: 10,
      type: 'percentage',
      minOrderAmount: 15000,
      description: '10% de réduction sur votre première commande',
      validUntil: '2026-12-31'
    },
    {
      code: 'BEAUTY5000',
      discount: 5000,
      type: 'fixed',
      minOrderAmount: 25000,
      description: '5 000 FCFA de remise dès 25 000 FCFA d\'achats',
      validUntil: '2026-11-30'
    }
  ],
  currency: 'FCFA',
  currencySymbol: 'FCFA',
  socialMedia: {
    instagram: 'https://instagram.com/glamor_beauty_abidjan',
    facebook: 'https://facebook.com/glamorbeautyci',
    whatsapp: 'https://wa.me/2250123456789'
  }
};

// ==========================================
// 10. COMPTES DE DÉMONSTRATION
// ==========================================

// ==========================================
// 11. NOTIFICATIONS
// ==========================================
export const notifications = [
  {
    id: 1,
    type: 'appointment_confirmed',
    title: 'Nouveau rendez-vous confirmé',
    message: 'Le rendez-vous RDV-2026-006 pour Olivia N\'Guessan a été confirmé avec Aminata Diallo pour le 15 Oct.',
    date: '2026-10-11T08:50:00Z',
    read: false,
    link: '/admin/rendez-vous'
  },
  {
    id: 2,
    type: 'stock_alert',
    title: 'Alerte stock critique',
    message: 'Le produit "Crème Mains Veloutée Hydratation Intense" est actuellement en rupture de stock (0 unité).',
    date: '2026-10-11T09:15:00Z',
    read: false,
    link: '/admin/produits'
  },
  {
    id: 3,
    type: 'order_placed',
    title: 'Nouvelle commande boutique',
    message: 'Commande CMD-2026-004 de 38 050 FCFA passée par Esther Ouloto (Paiement Mobile Money validé).',
    date: '2026-10-11T10:12:00Z',
    read: true,
    link: '/admin/commandes'
  },
  {
    id: 4,
    type: 'stock_warning',
    title: 'Alerte stock faible',
    message: 'Le stock de "Spray Fraîcheur & Décongestion" est tombé à 2 unités (seuil d\'alerte : 5).',
    date: '2026-10-10T16:00:00Z',
    read: true,
    link: '/admin/produits'
  },
  {
    id: 5,
    type: 'appointment_cancelled',
    title: 'Annulation de rendez-vous',
    message: 'Kady Traoré a annulé son rendez-vous RDV-2026-008 du 12 Octobre.',
    date: '2026-10-10T11:20:00Z',
    read: true,
    link: '/admin/rendez-vous'
  }
];

// ==========================================
// 12. EXPORT PAR DÉFAUT DU MODÈLE COMBINÉ
// ==========================================
const demoData = {
  services,
  professionals,
  products,
  clients,
  appointments,
  orders,
  transactions,
  stockMovements,
  salonSettings,
  notifications
};

export default demoData;
