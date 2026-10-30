import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  Calendar, 
  X, 
  Check, 
  Sparkles, 
  Scissors, 
  Footprints, 
  User, 
  Filter,
  ArrowRight,
  Info
} from 'lucide-react';
import { useData } from '../Contexts/DataContext';
import './Services.css';

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
};

const categoryLabels = {
  all: 'Toutes les prestations',
  coiffure: 'Coiffure & Soins Capillaires',
  manucure: 'Manucure & Onglerie',
  pedicure: 'Pédicure & Soins des Pieds'
};

const categoryIcons = {
  all: Sparkles,
  coiffure: Scissors,
  manucure: Sparkles,
  pedicure: Footprints
};

export default function Services() {
  const { services, professionals } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const servicesList = useMemo(() => {
    return services.filter(s => s.status === 'active');
  }, [services]);

  const professionalsList = useMemo(() => {
    return professionals.filter(p => p.status === 'active');
  }, [professionals]);

  // Read initial category from query param
  const initialCategory = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null); // For detailed modal

  // Synchronize state if URL query changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && ['coiffure', 'manucure', 'pedicure'].includes(cat)) {
      setSelectedCategory(cat);
    } else if (!cat) {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  // Filter services
  const filteredServices = useMemo(() => {
    return servicesList.filter(service => {
      const matchCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' || 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [servicesList, selectedCategory, searchQuery]);

  // Helper to get professional names for a service
  const getServiceProfessionals = (profIds = []) => {
    if (!profIds || profIds.length === 0) return [];
    return professionalsList.filter(p => profIds.includes(p.id));
  };

  return (
    <div className="services-page">
      {/* 1. HEADER */}
      <section className="services-header">
        <div className="container text-center">
          <div className="services-eyebrow">
            <Sparkles size={16} />
            <span>Carte des Soins Exclusifs</span>
          </div>
          <h1 className="services-title">Nos Prestations</h1>
          <p className="services-subtitle">
            Sublimez votre beauté naturelle avec nos protocoles de soins sur mesure, exécutés par des expertes dévouées.
          </p>
        </div>
      </section>

      {/* 2. FILTERS & SEARCH */}
      <section className="services-controls-section">
        <div className="container">
          <div className="controls-wrapper">
            {/* Category Tabs */}
            <div className="category-tabs">
              {[
                { id: 'all', label: 'Toutes' },
                { id: 'coiffure', label: 'Coiffure' },
                { id: 'manucure', label: 'Manucure' },
                { id: 'pedicure', label: 'Pédicure' },
              ].map(cat => {
                const Icon = categoryIcons[cat.id];
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`category-tab-btn ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={16} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un soin, un brushing, gel UV..."
                className="search-input"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="search-clear-btn"
                  title="Effacer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES LIST */}
      <section className="services-content-section section">
        <div className="container">
          {/* Results count info */}
          <div className="services-meta-header">
            <h2 className="current-category-name">
              {categoryLabels[selectedCategory]}
            </h2>
            <span className="results-count">
              {filteredServices.length} prestation{filteredServices.length > 1 ? 's' : ''} disponible{filteredServices.length > 1 ? 's' : ''}
            </span>
          </div>

          {filteredServices.length === 0 ? (
            /* EMPTY STATE */
            <div className="services-empty-state">
              <div className="empty-icon-wrap">
                <Search size={40} />
              </div>
              <h3 className="empty-title">Aucune prestation trouvée</h3>
              <p className="empty-desc">
                Nous n'avons trouvé aucun soin correspondant à vos critères "{searchQuery}". Essayez d'autres mots-clés ou réinitialisez les filtres.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  handleCategorySelect('all');
                }}
                className="btn btn-outline"
              >
                Réinitialiser la recherche
              </button>
            </div>
          ) : (
            /* GRID */
            <div className="services-cards-grid">
              {filteredServices.map(service => {
                const pros = getServiceProfessionals(service.professionals);

                return (
                  <div 
                    key={service.id} 
                    className="service-item-card"
                    onClick={() => setSelectedService(service)}
                  >
                    <div className="service-card-media">
                      <img 
                        src={service.image} 
                        alt={service.name} 
                        className="service-card-img" 
                        loading="lazy"
                      />
                      <span className="service-cat-pill">
                        {service.category === 'coiffure' ? 'Coiffure' : service.category === 'manucure' ? 'Manucure' : 'Pédicure'}
                      </span>
                    </div>

                    <div className="service-card-content">
                      <div className="service-card-timing-price">
                        <span className="timing-badge">
                          <Clock size={14} />
                          {service.duration} min
                        </span>
                        <span className="price-tag">
                          {formatPrice(service.price)}
                        </span>
                      </div>

                      <h3 className="service-card-title">{service.name}</h3>
                      <p className="service-card-desc">{service.description}</p>

                      {/* Specialists avatars/names */}
                      {pros.length > 0 && (
                        <div className="service-specialists">
                          <span className="specialists-label">Réalisé par :</span>
                          <div className="specialists-list">
                            {pros.map(pro => (
                              <span key={pro.id} className="pro-chip" title={pro.role}>
                                <img src={pro.photo} alt={pro.name} className="pro-chip-avatar" />
                                <span>{pro.name.split(' ')[0]}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="service-card-buttons">
                        <button 
                          type="button"
                          className="btn-link-details"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedService(service);
                          }}
                        >
                          <Info size={15} />
                          <span>Voir détails</span>
                        </button>
                        
                        <button
                          type="button"
                          className="btn btn-primary book-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/reservation?service=${service.id}`);
                          }}
                        >
                          <Calendar size={16} />
                          <span>Réserver</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. DETAIL MODAL */}
      {selectedService && (
        <div className="service-modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="service-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-button" 
              onClick={() => setSelectedService(null)}
              aria-label="Fermer"
            >
              <X size={20} />
            </button>

            <div className="modal-content-grid">
              <div className="modal-image-col">
                <img 
                  src={selectedService.image} 
                  alt={selectedService.name} 
                  className="modal-service-img" 
                />
                <div className="modal-badge-wrapper">
                  <span className="modal-category-badge">
                    {categoryLabels[selectedService.category]}
                  </span>
                </div>
              </div>

              <div className="modal-details-col">
                <h3 className="modal-service-title">{selectedService.name}</h3>
                
                <div className="modal-service-metrics">
                  <div className="metric-box">
                    <span className="metric-label">Tarif</span>
                    <span className="metric-value price-metric">{formatPrice(selectedService.price)}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Durée estimée</span>
                    <span className="metric-value">
                      <Clock size={16} />
                      {selectedService.duration} minutes
                    </span>
                  </div>
                </div>

                <div className="modal-section-block">
                  <h4 className="modal-block-title">Description du Rituel</h4>
                  <p className="modal-block-text">{selectedService.description}</p>
                </div>

                <div className="modal-section-block">
                  <h4 className="modal-block-title">Praticiennes Référentes</h4>
                  <div className="modal-pros-grid">
                    {getServiceProfessionals(selectedService.professionals).map(pro => (
                      <div key={pro.id} className="modal-pro-card">
                        <img src={pro.photo} alt={pro.name} className="modal-pro-avatar" />
                        <div>
                          <h5 className="modal-pro-name">{pro.name}</h5>
                          <p className="modal-pro-role">{pro.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="modal-modal-actions">
                  <button 
                    onClick={() => {
                      const id = selectedService.id;
                      setSelectedService(null);
                      navigate(`/reservation?service=${id}`);
                    }}
                    className="btn btn-primary modal-reserve-btn"
                  >
                    <Calendar size={18} />
                    <span>Réserver ce soin maintenant</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
