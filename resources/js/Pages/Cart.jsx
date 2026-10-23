import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Sparkles,
  AlertCircle,
  Check
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const {
    items,
    promoCode,
    discountAmount,
    discountPercent,
    discountType,
    subtotal,
    updateQuantity,
    removeItem,
    applyPromo,
    removePromo,
    clearCart
  } = useCart();

  const { products, settings } = useData();
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  // Get max stock for a product from DataContext
  const getProductStock = (productId) => {
    const prod = (products || []).find(p => p.id === productId);
    return prod ? prod.stock : 99;
  };

  // Handle promo code application
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');

    const trimmed = promoInput.trim().toUpperCase();
    if (!trimmed) {
      setPromoError('Veuillez saisir un code promotionnel.');
      return;
    }

    const availablePromos = settings?.promoCodes || [];
    const matched = availablePromos.find(p => p.code.toUpperCase() === trimmed);

    if (!matched) {
      setPromoError('Code promotionnel invalide ou expiré.');
      toastError('Code promotionnel invalide.');
      return;
    }

    // Check minimum order amount
    if (matched.minOrderAmount && subtotal < matched.minOrderAmount) {
      const minFormatted = formatPrice(matched.minOrderAmount);
      const msg = `Ce code nécessite un panier minimum de ${minFormatted}.`;
      setPromoError(msg);
      toastError(msg);
      return;
    }

    // Check validity date
    if (matched.validUntil) {
      const validDate = new Date(matched.validUntil);
      if (new Date() > validDate) {
        setPromoError('Ce code promotionnel a expiré.');
        toastError('Ce code a expiré.');
        return;
      }
    }

    applyPromo(matched.code, matched.discount, matched.type);
    toastSuccess(`Code promo "${matched.code}" appliqué avec succès !`);
    setPromoInput('');
  };

  // Handle promo removal
  const handleRemovePromo = () => {
    removePromo();
    toastInfo('Code promotionnel retiré.');
  };

  // Estimated total calculation
  const estimatedTotal = Math.max(0, subtotal - discountAmount);

  // Free shipping progress calculation
  const freeThreshold = settings?.freeShippingThreshold || 50000;
  const remainingForFreeShipping = Math.max(0, freeThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  // If cart is completely empty
  if (!items || items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty-container">
          <div className="cart-empty-icon-box">
            <ShoppingBag size={64} />
          </div>
          <h1 className="cart-empty-title">Votre panier est vide</h1>
          <p className="cart-empty-desc">
            Vous n'avez pas encore ajouté de soins ou produits d'exception à votre sélection.
            Découvrez notre gamme exclusive de rituels capillaires et cosmétiques précieux.
          </p>
          <div className="cart-empty-actions">
            <Link to="/boutique" className="btn-cart-primary">
              <Sparkles size={18} />
              <span>Découvrir la boutique</span>
            </Link>
            <Link to="/services" className="btn-cart-secondary">
              <span>Explorer nos prestations</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Page Header */}
      <section className="cart-header-banner">
        <div className="cart-header-content">
          <span className="cart-eyebrow">Votre Sélection Beauté</span>
          <h1 className="cart-title">Mon Panier d'Achats</h1>
          <p className="cart-subtitle">
            {items.reduce((sum, item) => sum + item.quantity, 0)} article(s) dans votre sélection
          </p>
        </div>
      </section>

      <div className="cart-main-container">
        {/* Free Shipping Alert Bar */}
        <div className="shipping-reward-bar">
          <div className="shipping-reward-header">
            <div className="shipping-reward-title">
              <Truck size={18} />
              {remainingForFreeShipping === 0 ? (
                <span>Félicitations ! Vous bénéficiez de la <strong>livraison offerte</strong>.</span>
              ) : (
                <span>
                  Plus que <strong>{formatPrice(remainingForFreeShipping)}</strong> pour profiter de la <strong>livraison gratuite</strong> !
                </span>
              )}
            </div>
            <span className="shipping-reward-percent">{freeShippingProgress}%</span>
          </div>
          <div className="shipping-reward-track">
            <div
              className="shipping-reward-progress"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        <div className="cart-layout-grid">
          {/* Left Column: Product List */}
          <div className="cart-items-section">
            <div className="cart-items-header">
              <h2>Articles sélectionnés</h2>
              <button
                type="button"
                className="cart-clear-btn"
                onClick={() => {
                  if (window.confirm('Voulez-vous vraiment vider l\'ensemble de votre panier ?')) {
                    clearCart();
                    toastInfo('Le panier a été vidé.');
                  }
                }}
              >
                Vider le panier
              </button>
            </div>

            <div className="cart-items-list">
              {items.map((item) => {
                const maxStock = getProductStock(item.productId);
                const lineTotal = item.price * item.quantity;

                return (
                  <div key={item.productId} className="cart-item-card">
                    {/* Item Image */}
                    <div className="cart-item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="cart-item-noimg">
                          <Sparkles size={24} />
                        </div>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="cart-item-details">
                      <div className="cart-item-header-row">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <button
                          type="button"
                          className="cart-remove-item-btn"
                          title="Supprimer cet article"
                          aria-label={`Supprimer ${item.name}`}
                          onClick={() => {
                            removeItem(item.productId);
                            toastInfo(`"${item.name}" a été retiré du panier.`);
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="cart-item-price-unit">
                        Prix unitaire : <strong>{formatPrice(item.price)}</strong>
                      </div>

                      <div className="cart-item-actions-row">
                        {/* Quantity Controls */}
                        <div className="qty-stepper">
                          <button
                            type="button"
                            className="qty-btn"
                            disabled={item.quantity <= 1}
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            aria-label="Diminuer la quantité"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="number"
                            className="qty-input"
                            min="1"
                            max={maxStock}
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val)) {
                                const clamped = Math.max(1, Math.min(val, maxStock));
                                updateQuantity(item.productId, clamped);
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="qty-btn"
                            disabled={item.quantity >= maxStock}
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            aria-label="Augmenter la quantité"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {item.quantity >= maxStock && (
                          <span className="stock-limit-warning">
                            Stock max ({maxStock})
                          </span>
                        )}

                        {/* Line Subtotal */}
                        <div className="cart-item-line-total">
                          <span className="total-sub-label">Sous-total :</span>
                          <span className="total-sub-amount">{formatPrice(lineTotal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Back to Boutique link */}
            <div className="cart-continue-wrap">
              <Link to="/boutique" className="cart-continue-link">
                <ArrowLeft size={16} />
                <span>Continuer mes achats dans la boutique</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Summary & Promo Sidebar */}
          <aside className="cart-summary-sidebar">
            <div className="summary-card">
              <h2 className="summary-card-title">Récapitulatif</h2>

              {/* Promo Code Input Block */}
              <div className="promo-block">
                {promoCode ? (
                  <div className="applied-promo-tag">
                    <div className="applied-promo-left">
                      <Tag size={16} className="tag-icon" />
                      <div>
                        <strong>Code appliqué : {promoCode}</strong>
                        <span className="promo-desc">
                          {discountType === 'percentage' ? `-${discountPercent}%` : `-${formatPrice(discountAmount)}`}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="promo-remove-btn"
                      onClick={handleRemovePromo}
                      title="Retirer le code"
                    >
                      Retirer
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="promo-form">
                    <label htmlFor="promo-input" className="promo-label">
                      Code promo ou bon d'achat
                    </label>
                    <div className="promo-input-group">
                      <input
                        id="promo-input"
                        type="text"
                        placeholder="Ex: BIENVENUE10"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          if (promoError) setPromoError('');
                        }}
                      />
                      <button type="submit" className="promo-apply-btn">
                        Appliquer
                      </button>
                    </div>
                    {promoError && <span className="promo-error-msg">{promoError}</span>}
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="summary-breakdown">
                <div className="breakdown-row">
                  <span className="row-label">Sous-total articles</span>
                  <span className="row-value">{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="breakdown-row discount-row">
                    <span className="row-label">Réduction promo</span>
                    <span className="row-value">- {formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="breakdown-row">
                  <span className="row-label">Frais de livraison</span>
                  <span className="row-value shipping-calc-note">
                    Calculés à l'étape suivante
                  </span>
                </div>

                <div className="breakdown-divider" />

                <div className="breakdown-row total-row">
                  <span className="row-label total-label">Total estimé</span>
                  <span className="row-value total-value">{formatPrice(estimatedTotal)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <div className="summary-cta-wrap">
                <button
                  type="button"
                  className="btn-checkout-primary"
                  onClick={() => navigate('/commande')}
                >
                  <span>Passer la commande</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              {/* Trust & Guarantee Badges */}
              <div className="summary-trust-badges">
                <div className="trust-item">
                  <ShieldCheck size={18} />
                  <span>Paiements sécurisés (Mobile Money, Carte, Espèces)</span>
                </div>
                <div className="trust-item">
                  <Truck size={18} />
                  <span>Livraison express à Abidjan ou retrait gratuit au salon</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
