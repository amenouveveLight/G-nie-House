import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  Award, 
  HeartHandshake, 
  Leaf, 
  Clock, 
  CheckCircle, 
  Calendar,
  Camera,
  Scissors
} from 'lucide-react';
import { professionals as defaultProfessionals } from '../data/demoData';
import { useData } from '../contexts/DataContext';
import './About.css';

const valuesList = [
  {
    icon: Award,
    title: 'Excellence & Savoir-Faire',
    desc: 'Nos stylistes et praticiennes sont formées aux techniques internationales les plus exigeantes afin d’offrir des prestations haute couture.'
  },
  {
    icon: HeartHandshake,
    title: 'Bien-Être & Sur-Mesure',
    desc: 'Chaque personne est unique. Nous débutons chaque soin par un diagnostic personnalisé pour révéler l’harmonie naturelle de votre beauté.'
  },
  {
    icon: Leaf,
    title: 'Éthique & Formules Botaniques',
    desc: 'Nous privilégions des soins capillaires et cosmétiques aux principes actifs nobles (karité d’Afrique de l’Ouest, huiles pures, sans sulfates).'
  }
];

const commitmentsList = [
  {
    icon: ShieldCheck,
    title: 'Hygiène & Stérilisation Médicale',
    desc: 'Tous nos instruments métalliques sont stérilisés en autoclave médical après chaque usage, et nos limes & embouts sont à usage strictement unique.'
  },
  {
    icon: CheckCircle,
    title: 'Produits 100% Certifiés',
    desc: 'Sélection rigoureuse des plus grandes marques internationales et des meilleurs laboratoires de dermo-cosmétique capillaire.'
  },
  {
    icon: Clock,
    title: 'Ponctualité & Sérénité',
    desc: 'Des créneaux maîtrisés garantissant aucune attente superflue, pour profiter pleinement d’une bulle de calme et d’intimité.'
  },
  {
    icon: Sparkles,
    title: 'Ambiance Luxueuse & Privative',
    desc: 'Cabines privées insonorisées, bar à thé gourmand et fauteuils massants ergonomiques pour une relaxation sensorielle absolue.'
  }
];

const galleryPlaces = [
  {
    title: 'Espace Coiffure VIP',
    subtitle: 'Miroirs rétroéclairés & fauteuils massants en cuir',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Bar à Ongles Haute Couture',
    subtitle: 'Comptoirs en marbre & nuanciers exclusifs',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Suite Pédicure Spa',
    subtitle: 'Bains balnéo aromatiques & luminothérapie',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Salon d\'Attente & Bar Détox',
    subtitle: 'Thés bio, presse internationale & douceur feutrée',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
  }
];

export default function About() {
  const data = useData();
  const team = (data?.professionals || defaultProfessionals).filter(p => p.status === 'active');

  return (
    <div className="about-page">
      {/* 1. HERO SECTION */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-badge">
            <Sparkles size={16} />
            <span>Glam'Or Beauty • Notre Univers</span>
          </div>
          <h1 className="about-hero-title">Notre Histoire</h1>
          <p className="about-hero-subtitle">
            Quand la passion du raffinement rencontre l’art ancestral du soin : bienvenue au cœur de notre écrin abidjanais.
          </p>
        </div>
      </section>

      {/* 2. HISTORY / STORY SECTION */}
      <section className="about-story section">
        <div className="container">
          <div className="story-grid">
            <div className="story-content">
              <span className="section-eyebrow">Origines & Vision</span>
              <h2 className="section-title">Une Ode à la Beauté Africaine & Moderne</h2>
              <div className="story-paragraphs">
                <p>
                  Fondé au cœur du quartier résidentiel de Cocody Ambassades à Abidjan, <strong>Glam'Or Beauty</strong> est né d'une ambition claire : créer un lieu d’exception où l'élégance internationale s'harmonise avec la générosité des rituels de beauté africains.
                </p>
                <p>
                  Fatiguées des salons bruyants et impersonnels, nos fondatrices ont imaginé un havre intimiste où chaque cliente est accueillie en hôte privilégiée. Du soin des boucles texturées à la finesse du nail art contemporain, chaque geste est pensé comme une œuvre d’art.
                </p>
                <p>
                  Aujourd’hui, Glam'Or Beauty réunit des praticiennes chevronnées et passionnées, unies par un standard d’excellence sans compromis et un dévouement absolu au bien-être de notre communauté.
                </p>
              </div>
            </div>

            <div className="story-visual">
              <div className="story-image-card main-img-card">
                <img 
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80" 
                  alt="Atmosphère du salon Glam'Or Beauty" 
                  className="story-image"
                />
                <div className="experience-badge">
                  <span className="exp-years">+8</span>
                  <span className="exp-text">Années d'excellence esthétique</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION & VALUES */}
      <section className="about-values section section-cream">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Philosophie</span>
            <h2 className="section-title">Nos Valeurs Fondatrices</h2>
            <p className="section-description">
              Trois piliers inébranlables guident chacune de nos attentions au quotidien.
            </p>
          </div>

          <div className="values-grid">
            {valuesList.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="value-card">
                  <div className="value-icon-box">
                    <Icon size={30} />
                  </div>
                  <h3 className="value-title">{val.title}</h3>
                  <p className="value-desc">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. TEAM SECTION */}
      <section className="about-team section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Les Maîtres Artisans</span>
            <h2 className="section-title">Une Équipe d'Expertes Passionnées</h2>
            <p className="section-description">
              Rencontrez les professionnelles dévouées qui subliment votre beauté jour après jour.
            </p>
          </div>

          <div className="team-grid">
            {team.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-avatar-container">
                  <img 
                    src={member.photo} 
                    alt={member.name} 
                    className="team-avatar"
                  />
                  <div className="team-avatar-overlay">
                    <span className="team-specialty-count">
                      <Scissors size={14} />
                      {member.specialties ? member.specialties.length : member.services?.length || 4} spécialités
                    </span>
                  </div>
                </div>

                <div className="team-body">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  
                  {member.specialties && (
                    <div className="team-tags">
                      {member.specialties.slice(0, 3).map((spec, sIdx) => (
                        <span key={sIdx} className="team-tag">{spec}</span>
                      ))}
                    </div>
                  )}

                  <Link 
                    to={`/reservation?professional=${member.id}`} 
                    className="btn btn-outline team-book-btn"
                  >
                    <Calendar size={14} />
                    <span>Réserver avec {member.name.split(' ')[0]}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HYGIENE & QUALITY COMMITMENTS */}
      <section className="about-commitments section section-cream">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Normes & Sécurité</span>
            <h2 className="section-title">Nos Engagements Qualité & Hygiène</h2>
            <p className="section-description">
              Votre santé et votre confort sont nos priorités absolues. Nous appliquons les standards sanitaires les plus stricts.
            </p>
          </div>

          <div className="commitments-grid">
            {commitmentsList.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="commitment-card">
                  <div className="commitment-icon">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="commitment-title">{item.title}</h3>
                    <p className="commitment-desc">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. SALON PHOTOS / ATMOSPHERE */}
      <section className="about-gallery section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Immersion Visuelle</span>
            <h2 className="section-title">L'Écrin Glam'Or Beauty</h2>
            <p className="section-description">
              Un aperçu de nos espaces raffinés pensés pour votre détente complète.
            </p>
          </div>

          <div className="gallery-grid">
            {galleryPlaces.map((place, idx) => (
              <div key={idx} className="gallery-item">
                <img 
                  src={place.image} 
                  alt={place.title} 
                  className="gallery-img"
                />
                <div className="gallery-caption">
                  <h4 className="gallery-title">{place.title}</h4>
                  <p className="gallery-subtitle">{place.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="about-cta">
        <div className="container text-center">
          <h2 className="about-cta-title">Vivez l'Expérience Glam'Or Beauty</h2>
          <p className="about-cta-desc">
            Accordez-vous l’instant de beauté et de plénitude que vous méritez.
          </p>
          <Link to="/reservation" className="btn btn-primary about-cta-btn">
            <Calendar size={18} />
            <span>Prendre rendez-vous maintenant</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
