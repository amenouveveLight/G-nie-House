import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Calendar, Sparkles } from 'lucide-react';
import { useCart } from '../../Contexts/CartContext';
import './Header.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  // Handle sticky header shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="header-container">
        {/* Brand Logo */}
        <Link to="/" className="header-logo" aria-label="Glam'Or Beauty Accueil">
          <span className="logo-main">
            Glam<span className="logo-accent">’</span>Or
          </span>
          <span className="logo-sub">Beauty</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav" aria-label="Navigation principale">
          <ul className="nav-list">
            <li>
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Accueil
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/a-propos" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                À propos
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/services" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Services
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/boutique" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Boutique
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Header Actions (Cart, Book Button, Hamburger) */}
        <div className="header-actions">
          {/* Cart Icon */}
          <Link 
            to="/panier" 
            className="header-cart-btn" 
            aria-label={`Panier d'achats, ${totalItems} article${totalItems > 1 ? 's' : ''}`}
          >
            <ShoppingBag size={22} className="cart-icon" />
            {totalItems > 0 && (
              <span className="cart-badge animate-badge">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          {/* Book Appointment CTA */}
          <Link to="/reservation" className="btn-book-cta">
            <Calendar size={17} className="btn-cta-icon" />
            <span>Prendre rendez-vous</span>
          </Link>

          {/* Hamburger Button for Mobile */}
          <button 
            type="button" 
            className="hamburger-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`mobile-menu-backdrop ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <div 
        className={`mobile-menu-drawer ${isMobileMenuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu mobile"
      >
        <div className="mobile-menu-header">
          <div className="mobile-logo">
            Glam<span className="logo-accent">’</span>Or <span>Beauty</span>
          </div>
          <button 
            type="button" 
            className="mobile-close-btn" 
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Fermer le menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mobile-nav">
          <ul className="mobile-nav-list">
            <li>
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accueil
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/a-propos" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                À propos
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/services" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/boutique" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Boutique
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="mobile-menu-footer">
          <Link 
            to="/reservation" 
            className="btn-book-mobile"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Calendar size={18} />
            <span>Prendre rendez-vous</span>
          </Link>
          <div className="mobile-tagline">
            <Sparkles size={14} className="tagline-icon" />
            <span>Sublimez votre éclat naturel</span>
          </div>
        </div>
      </div>
    </header>
  );
}
