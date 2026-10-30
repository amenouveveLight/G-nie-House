import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Calendar,
  Sparkles,
  Shield
} from 'lucide-react';
import { Instagram, Facebook } from '../common/SocialIcons';
import { salonSettings } from '../../Data/demoData';
import { useData } from '../../Contexts/DataContext';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Safely get settings from context or fallback to demoData
  let settings = salonSettings;
  try {
    const dataCtx = useData();
    if (dataCtx && dataCtx.settings) {
      settings = dataCtx.settings;
    }
  } catch {
    // If used outside DataProvider, fallback to demoData
    settings = salonSettings;
  }

  const phone = settings?.phone || '+225 01 23 45 67 89';
  const email = settings?.email || 'contact@glamor-beauty.com';
  const address = settings?.address || "12 Boulevard de la Beauté, Cocody Ambassades, Abidjan, Côte d'Ivoire";

  // Format WhatsApp link with clean phone number
  const rawPhone = phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${rawPhone}`;

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-container">
          {/* Column 1: Brand & Bio */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo">
              <span className="logo-main">Glam<span className="logo-accent">’</span>Or</span>
              <span className="logo-sub">Beauty</span>
            </Link>
            <p className="footer-about">
              Votre sanctuaire de beauté et d'élégance à Cocody. Nous vous offrons une expérience 
              sur-mesure alliant savoir-faire d'exception et soins capillaires, manucure et bien-être de prestige.
            </p>
            <div className="footer-socials">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link" 
                aria-label="Instagram de Glam'Or Beauty"
              >
                <Instagram size={19} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link" 
                aria-label="Facebook de Glam'Or Beauty"
              >
                <Facebook size={19} />
              </a>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link whatsapp-link" 
                aria-label="WhatsApp Glam'Or Beauty"
              >
                <MessageCircle size={19} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="footer-col links-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/">Accueil</Link>
              </li>
              <li>
                <Link to="/a-propos">À propos du salon</Link>
              </li>
              <li>
                <Link to="/services">Prestations & Soins</Link>
              </li>
              <li>
                <Link to="/boutique">Boutique en ligne</Link>
              </li>
              <li>
                <Link to="/contact">Contact & Accès</Link>
              </li>
              <li>
                <Link to="/reservation" className="highlight-link">
                  <Calendar size={14} />
                  <span>Prendre rendez-vous</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/login" style={{ opacity: 0.8, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={13} />
                  <span>Espace Pro (Admin)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="footer-col contact-col">
            <h4 className="footer-heading">Contact & Localisation</h4>
            <ul className="contact-list">
              <li className="contact-item">
                <MapPin size={18} className="contact-icon" />
                <span>{address}</span>
              </li>
              <li className="contact-item">
                <Phone size={18} className="contact-icon" />
                <a href={`tel:${phone}`}>{phone}</a>
              </li>
              <li className="contact-item">
                <Mail size={18} className="contact-icon" />
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Opening Hours */}
          <div className="footer-col hours-col">
            <h4 className="footer-heading">Horaires d'Ouverture</h4>
            <div className="hours-container">
              <div className="hours-row">
                <span className="days">Lun - Jeu</span>
                <span className="time">09:00 - 19:00</span>
              </div>
              <div className="hours-row">
                <span className="days">Ven - Sam</span>
                <span className="time">09:00 - 20:00</span>
              </div>
              <div className="hours-row closed">
                <span className="days">Dimanche</span>
                <span className="status">Fermé</span>
              </div>
            </div>
            <div className="hours-badge">
              <Clock size={15} />
              <span>Sur rendez-vous & sans interruption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-container bottom-container">
          <p className="copyright-text">
            © {currentYear} Glam'Or Beauty. Tous droits réservés.
          </p>
          <div className="footer-bottom-extra">
            <span>Créateur d'élégance et de sérénité</span>
            <Sparkles size={14} className="bottom-sparkle" />
          </div>
        </div>
      </div>
    </footer>
  );
}
