import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  Calendar, 
  Sparkles, 
  MessageCircle, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Instagram, Facebook } from '../components/common/SocialIcons';
import { salonSettings as defaultSettings } from '../data/demoData';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import './Contact.css';

const daysTranslation = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche'
};

export default function Contact() {
  const data = useData();
  const { success, error } = useToast();
  const settings = data?.settings || defaultSettings;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Renseignement général',
    message: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Veuillez saisir votre nom complet.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Veuillez saisir votre adresse email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Adresse email invalide.';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Veuillez saisir votre numéro de téléphone.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Votre message doit contenir au moins 10 caractères.';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      error('Veuillez corriger les champs requis dans le formulaire.');
      return;
    }

    setIsSubmitting(true);
    // Simulate server delay
    setTimeout(() => {
      setIsSubmitting(false);
      success('Votre message a bien été envoyé ! Notre équipe vous répondra sous 24h.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Renseignement général',
        message: ''
      });
      setFormErrors({});
    }, 700);
  };

  return (
    <div className="contact-page">
      {/* 1. HERO HEADER */}
      <section className="contact-hero">
        <div className="container text-center">
          <div className="contact-badge">
            <Sparkles size={16} />
            <span>À votre écoute</span>
          </div>
          <h1 className="contact-title">Contactez-Nous</h1>
          <p className="contact-subtitle">
            Une question sur nos rituels, un événement privé ou une demande sur mesure ? Nous sommes à votre entière disposition.
          </p>
        </div>
      </section>

      {/* 2. MAIN CONTENT (FORM & SALON INFO) */}
      <section className="contact-main section">
        <div className="container">
          <div className="contact-grid">
            {/* Form Column */}
            <div className="contact-form-card">
              <div className="card-header-block">
                <h2 className="form-heading">Envoyez-nous un message</h2>
                <p className="form-subheading">
                  Remplissez ce formulaire et notre conciergerie vous recontactera rapidement.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="contact-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Nom & Prénom <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Sarah Konan"
                    className={`form-input ${formErrors.name ? 'input-error' : ''}`}
                  />
                  {formErrors.name && (
                    <span className="field-error-text">
                      <AlertCircle size={14} />
                      {formErrors.name}
                    </span>
                  )}
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Adresse Email <span className="required-star">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="sarah@example.com"
                      className={`form-input ${formErrors.email ? 'input-error' : ''}`}
                    />
                    {formErrors.email && (
                      <span className="field-error-text">
                        <AlertCircle size={14} />
                        {formErrors.email}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Téléphone <span className="required-star">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+225 07 00 00 00 00"
                      className={`form-input ${formErrors.phone ? 'input-error' : ''}`}
                    />
                    {formErrors.phone && (
                      <span className="field-error-text">
                        <AlertCircle size={14} />
                        {formErrors.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Objet de votre demande
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-input form-select"
                  >
                    <option value="Renseignement général">Renseignement général</option>
                    <option value="Prise de rendez-vous spécifique">Prise de rendez-vous spécifique</option>
                    <option value="Mariage & Événements privés">Mariage & Événements privés</option>
                    <option value="Question sur un produit boutique">Question sur un produit boutique</option>
                    <option value="Autre demande">Autre demande</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Votre Message <span className="required-star">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Détaillez votre souhait ou question..."
                    className={`form-input form-textarea ${formErrors.message ? 'input-error' : ''}`}
                  />
                  {formErrors.message && (
                    <span className="field-error-text">
                      <AlertCircle size={14} />
                      {formErrors.message}
                    </span>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className={`btn btn-primary submit-btn ${isSubmitting ? 'submitting' : ''}`}
                >
                  <Send size={18} />
                  <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer mon message'}</span>
                </button>
              </form>
            </div>

            {/* Info Column */}
            <div className="contact-details-col">
              {/* Salon info card */}
              <div className="details-card salon-info-card">
                <h3 className="details-card-title">Coordonnées du Salon</h3>
                
                <div className="contact-item">
                  <div className="contact-item-icon">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="contact-item-label">Adresse</span>
                    <p className="contact-item-val">{settings.address}</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item-icon">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="contact-item-label">Téléphone</span>
                    <a href={`tel:${settings.phone}`} className="contact-item-val link-val">
                      {settings.phone}
                    </a>
                    {settings.secondaryPhone && (
                      <p className="contact-item-secondary">
                        Ligne directe : {settings.secondaryPhone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item-icon">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="contact-item-label">Courriel</span>
                    <a href={`mailto:${settings.email}`} className="contact-item-val link-val">
                      {settings.email}
                    </a>
                  </div>
                </div>

                {/* Social media links */}
                <div className="social-links-block">
                  <span className="social-label">Suivez-nous :</span>
                  <div className="social-icons-row">
                    {settings.socialMedia?.instagram && (
                      <a 
                        href={settings.socialMedia.instagram} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="social-btn instagram"
                        aria-label="Instagram"
                      >
                        <Instagram size={20} />
                      </a>
                    )}
                    {settings.socialMedia?.facebook && (
                      <a 
                        href={settings.socialMedia.facebook} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="social-btn facebook"
                        aria-label="Facebook"
                      >
                        <Facebook size={20} />
                      </a>
                    )}
                    {settings.socialMedia?.whatsapp && (
                      <a 
                        href={settings.socialMedia.whatsapp} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="social-btn whatsapp"
                        aria-label="WhatsApp"
                      >
                        <MessageCircle size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Opening Hours card */}
              <div className="details-card hours-card">
                <div className="hours-card-title-row">
                  <Clock size={20} className="hours-icon" />
                  <h3 className="details-card-title">Horaires d'Ouverture</h3>
                </div>

                <ul className="hours-list">
                  {settings.openingHours && Object.entries(settings.openingHours).map(([dayKey, sched]) => {
                    const isClosed = !sched.isOpen;
                    return (
                      <li key={dayKey} className={`hours-row ${isClosed ? 'closed-day' : ''}`}>
                        <span className="day-name">{daysTranslation[dayKey] || dayKey}</span>
                        <span className="day-hours">
                          {isClosed ? 'Fermé' : `${sched.open} - ${sched.close}`}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Booking Shortcut Card */}
              <div className="details-card booking-cta-card">
                <h4 className="booking-cta-title">Préférez-vous réserver immédiatement ?</h4>
                <p className="booking-cta-desc">
                  Consultez en temps réel les disponibilités de vos praticiennes favorites et réservez votre créneau en 2 minutes.
                </p>
                <Link to="/reservation" className="btn btn-primary w-full booking-cta-btn">
                  <Calendar size={18} />
                  <span>Prendre rendez-vous en ligne</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAP PLACEHOLDER SECTION */}
      <section className="contact-map-section section section-cream">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Localisation</span>
            <h2 className="section-title">Nous Rendre Visite</h2>
            <p className="section-description">
              Idéalement situé au cœur de Cocody, le salon dispose d’un parking privé surveillé pour votre confort absolu.
            </p>
          </div>

          <div className="map-placeholder-card">
            <div className="map-artistic-bg">
              <div className="map-grid-pattern" />
              <div className="map-pin-pulse">
                <div className="pin-circle">
                  <MapPin size={28} className="pin-icon" />
                </div>
                <div className="pin-ripple" />
              </div>
            </div>

            <div className="map-overlay-info">
              <h4 className="map-salon-name">{settings.name}</h4>
              <p className="map-salon-address">{settings.address}</p>
              <div className="map-badges-row">
                <span className="map-badge">Parking Privé Disponible</span>
                <span className="map-badge">Accès PMR</span>
                <span className="map-badge">Climatisé & Sécurisé</span>
              </div>
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`} 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-outline map-directions-btn"
              >
                <span>Ouvrir dans Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
