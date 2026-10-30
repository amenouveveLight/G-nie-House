import { Link, useNavigate } from 'react-router-dom';
import { 
  Scissors, 
  Sparkles, 
  Footprints, 
  Clock, 
  ArrowRight, 
  Star, 
  ShoppingBag, 
  ShieldCheck, 
  Heart, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { services as defaultServices, products as defaultProducts } from '../Data/demoData';
import { useData } from '../Contexts/DataContext';
import { useCart } from '../Contexts/CartContext';
import { useToast } from '../Contexts/ToastContext';
import './Home.css';

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
};

const categoryIcons = {
  coiffure: Scissors,
  manucure: Sparkles,
  pedicure: Footprints
};

const categoryLabels = {
  coiffure: 'Coiffure & Soins Capillaires',
  manucure: 'Manucure & Onglerie',
  pedicure: 'Pédicure & Soins des Pieds'
};

const categoryDescriptions = {
  coiffure: 'Coupes sur mesure, colorations éclatantes, tresses artistiques et soins botaniques profonds.',
  manucure: 'Pose gel UV haute précision, vernis semi-permanent et nail art sur-mesure.',
  pedicure: 'Rituels spa régénérants, soins anti-callosités et bains de paraffine délassants.'
};

const testimonials = [
  {
    id: 1,
    name: 'Aurelie Kouadio',
    role: 'Cliente fidèle',
    rating: 5,
    comment: "Une expérience sensorielle exceptionnelle ! Aminata a magnifiquement réalisé mon brushing et le soin capillaire a redonné vie à mes cheveux. L'ambiance feutrée est tout simplement magique.",
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'Sarah Benali',
    role: 'Cliente régulière',
    rating: 5,
    comment: "Fatou est une véritable artiste de l'ongle ! La pose de gel UV est impeccable, ultra fine et a tenu plus de 4 semaines sans aucun accroc. Je ne change de salon pour rien au monde.",
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'Christelle N\'Dri',
    role: 'Cliente VIP',
    rating: 5,
    comment: "Le rituel Pédicure Spa à la paraffine est un pur délice après une longue semaine. Le personnel est prévenant, le thé servi est délicat et le salon respire le luxe discret.",
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

export default function Home() {
  const navigate = useNavigate();
  const data = useData();
  const { addItem } = useCart();
  const { success } = useToast();

  const servicesList = (data?.services || defaultServices).filter(s => s.status === 'active');
  const productsList = (data?.products || defaultProducts).filter(p => p.status === 'active');

  // Select 4 popular services
  const popularServices = servicesList.slice(0, 4);

  // Select 4 featured or first products
  const featuredProducts = productsList
    .filter(p => p.featured)
    .slice(0, 4);
  const displayProducts = featuredProducts.length === 4 ? featuredProducts : productsList.slice(0, 4);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      maxStock: product.stock
    });
    success(`"${product.name}" a été ajouté à votre panier`);
  };

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="home-hero">
        <div className="hero-backdrop-glow glow-1" />
        <div className="hero-backdrop-glow glow-2" />
        
        <div className="container hero-container">
          <div className="hero-badge">
            <Sparkles size={16} className="badge-icon" />
            <span>Maison de Beauté Haute Couture • Abidjan Cocody</span>
          </div>

          <h1 className="hero-title">
            Sublimez Votre <span className="text-gradient">Beauté Naturelle</span>
          </h1>

          <p className="hero-subtitle">
            Entrez dans un sanctuaire de raffinement et de sérénité. Nos maîtres artisans de la coiffure, de l'onglerie et du bien-être subliment votre éclat grâce à des soins sur mesure et des produits d'exception.
          </p>

          <div className="hero-cta-group">
            <Link to="/reservation" className="btn btn-primary hero-btn">
              <Calendar size={18} />
              <span>Prendre rendez-vous</span>
            </Link>
            <Link to="/services" className="btn btn-outline hero-btn">
              <span>Découvrir nos services</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">4.9 / 5</span>
              <span className="stat-label">Satisfaction client</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">+1 500</span>
              <span className="stat-label">Soins d'exception réalisés</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Produits premium certifiés</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES HIGHLIGHTS (CATEGORIES) */}
      <section className="home-categories section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Nos Univers</span>
            <h2 className="section-title">L'Excellence du Soin</h2>
            <p className="section-description">
              Chaque espace est pensé pour offrir une parenthèse enchantée dédiée à votre sublimité.
            </p>
          </div>

          <div className="categories-grid">
            {['coiffure', 'manucure', 'pedicure'].map((catKey) => {
              const Icon = categoryIcons[catKey];
              return (
                <div key={catKey} className="category-card">
                  <div className="category-icon-wrapper">
                    <Icon size={32} />
                  </div>
                  <h3 className="category-title">{categoryLabels[catKey]}</h3>
                  <p className="category-desc">{categoryDescriptions[catKey]}</p>
                  <Link 
                    to={`/services?category=${catKey}`} 
                    className="category-link"
                  >
                    <span>Explorer la carte</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. POPULAR SERVICES */}
      <section className="home-popular section section-cream">
        <div className="container">
          <div className="section-header-split">
            <div>
              <span className="section-eyebrow">Les Incontournables</span>
              <h2 className="section-title">Prestations Signatures</h2>
              <p className="section-description">
                Découvrez les rituels les plus plébiscités par notre clientèle raffinée.
              </p>
            </div>
            <Link to="/services" className="btn btn-outline view-all-btn">
              <span>Toutes les prestations</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="services-grid">
            {popularServices.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-img-container">
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="service-img" 
                    loading="lazy"
                  />
                  <span className="service-category-badge">
                    {service.category === 'coiffure' ? 'Coiffure' : service.category === 'manucure' ? 'Manucure' : 'Pédicure'}
                  </span>
                </div>
                
                <div className="service-body">
                  <div className="service-meta">
                    <span className="service-duration">
                      <Clock size={14} />
                      {service.duration} min
                    </span>
                    <span className="service-price">
                      {formatPrice(service.price)}
                    </span>
                  </div>

                  <h3 className="service-name">{service.name}</h3>
                  <p className="service-desc">{service.description}</p>

                  <div className="service-actions">
                    <button 
                      onClick={() => navigate(`/reservation?service=${service.id}`)}
                      className="btn btn-primary w-full service-btn"
                    >
                      <span>Réserver ce soin</span>
                      <Calendar size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. RECOMMENDED PRODUCTS */}
      <section className="home-products section">
        <div className="container">
          <div className="section-header-split">
            <div>
              <span className="section-eyebrow">Boutique Glamour</span>
              <h2 className="section-title">Soins & Cosmétiques Élite</h2>
              <p className="section-description">
                Prolongez l'expérience du salon chez vous avec notre sélection rigoureuse d'élixirs et soins d'experts.
              </p>
            </div>
            <Link to="/boutique" className="btn btn-outline view-all-btn">
              <span>Visiter la boutique</span>
              <ShoppingBag size={16} />
            </Link>
          </div>

          <div className="products-grid">
            {displayProducts.map((product) => {
              const isOutOfStock = product.stock <= 0;
              return (
                <div key={product.id} className="product-card">
                  <div className="product-img-wrapper">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="product-img" 
                      loading="lazy"
                    />
                    {isOutOfStock ? (
                      <span className="stock-badge stock-out">Rupture de stock</span>
                    ) : product.stock <= (product.alertThreshold || 5) ? (
                      <span className="stock-badge stock-low">Derniers articles</span>
                    ) : (
                      <span className="stock-badge stock-in">En stock</span>
                    )}
                  </div>

                  <div className="product-info">
                    <span className="product-category-tag">
                      {product.category}
                    </span>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">{formatPrice(product.price)}</p>

                    <button 
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={isOutOfStock}
                      className={`btn w-full product-btn ${isOutOfStock ? 'btn-disabled' : 'btn-primary'}`}
                    >
                      <ShoppingBag size={16} />
                      <span>{isOutOfStock ? 'Épuisé' : 'Ajouter au panier'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="home-testimonials section section-cream">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Témoignages</span>
            <h2 className="section-title">L'Avis de Nos Clientes</h2>
            <p className="section-description">
              Leur fidélité et leurs sourires sont notre plus belle consécration.
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="var(--color-gold)" color="var(--color-gold)" />
                  ))}
                </div>
                <p className="testimonial-quote">"{t.comment}"</p>
                <div className="testimonial-author">
                  <img src={t.avatar} alt={t.name} className="author-avatar" />
                  <div className="author-meta">
                    <h4 className="author-name">{t.name}</h4>
                    <span className="author-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="home-cta">
        <div className="container cta-container">
          <div className="cta-content">
            <span className="cta-eyebrow">Votre Parenthèse Bien-Être</span>
            <h2 className="cta-title">Prête à vous faire chouchouter ?</h2>
            <p className="cta-desc">
              Réservez en ligne en quelques clics ou découvrez nos créneaux disponibles dès aujourd'hui. Notre équipe d'expertes est impatiente de prendre soin de vous.
            </p>
            <div className="cta-actions">
              <Link to="/reservation" className="btn btn-primary cta-btn">
                <Calendar size={18} />
                <span>Prendre rendez-vous en ligne</span>
              </Link>
              <Link to="/contact" className="btn btn-outline cta-outline-btn">
                <span>Nous contacter</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
