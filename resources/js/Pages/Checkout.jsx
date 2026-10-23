import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  User,
  Phone,
  Mail,
  Truck,
  Store,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ShieldCheck,
  AlertCircle,
  Check,
  RefreshCw,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import './Checkout.css';

const CHECKOUT_STEPS = [
  { id: 1, title: 'Panier', short: 'Panier' },
  { id: 2, title: 'Client', short: 'Client' },
  { id: 3, title: 'Livraison', short: 'Livraison' },
  { id: 4, title: 'Paiement', short: 'Paiement' },
  { id: 5, title: 'Vérification', short: 'Validation' },
  { id: 6, title: 'Simulation', short: 'Traitement' },
  { id: 7, title: 'Confirmation', short: 'Résultat' }
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, promoCode, discountAmount, clearCart } = useCart();
  const { products, settings, dispatch, findOrCreateClient } = useData();
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  const [currentStep, setCurrentStep] = useState(1);

  // Recalculate item prices and live subtotal using latest product catalog
  const cartItemsWithDetails = useMemo(() => {
    return items.map(item => {
      const liveProduct = (products || []).find(p => p.id === item.productId);
      const price = liveProduct ? liveProduct.price : item.price;
      return {
        ...item,
        price,
        stock: liveProduct ? liveProduct.stock : item.maxStock || 99,
        lineTotal: price * item.quantity
      };
    });
  }, [items, products]);

  const liveSubtotal = useMemo(() => {
    return cartItemsWithDetails.reduce((sum, item) => sum + item.lineTotal, 0);
  }, [cartItemsWithDetails]);

  // Client form state (Step 2)
  const [clientForm, setClientForm] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [clientErrors, setClientErrors] = useState({});

  // Delivery state (Step 3)
  const [deliveryMethod, setDeliveryMethod] = useState('delivery'); // 'delivery' | 'pickup'
  const [deliveryAddress, setDeliveryAddress] = useState({
    address: '',
    city: 'Abidjan',
    postalCode: '',
    notes: ''
  });
  const [addressErrors, setAddressErrors] = useState({});

  // Payment method (Step 4)
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'mobile_money' | 'cash'

  // Payment simulation state (Step 6)
  const [simulationScenario, setSimulationScenario] = useState('success'); // 'success' | 'refused' | 'pending'
  const [simulationProgress, setSimulationProgress] = useState(0);

  // Final confirmation result (Step 7)
  const [orderResult, setOrderResult] = useState(null);

  // Financial calculations
  const freeThreshold = settings?.freeShippingThreshold || 50000;
  const isFreeShipping = liveSubtotal >= freeThreshold;
  const shippingFee = deliveryMethod === 'pickup' ? 0 : (isFreeShipping ? 0 : (settings?.shippingFee || 2500));
  const finalTotal = Math.max(0, liveSubtotal - (discountAmount || 0) + shippingFee);

  // Helper currency formatter
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  // Redirect if cart is empty and not on confirmation
  useEffect(() => {
    if ((!items || items.length === 0) && currentStep < 6) {
      // Allow viewing or redirect
    }
  }, [items, currentStep]);

  // Validation step 2
  const validateClientForm = () => {
    const errs = {};
    if (!clientForm.name || clientForm.name.trim().length < 2) {
      errs.name = 'Veuillez saisir votre nom complet.';
    }
    const phoneClean = clientForm.phone.replace(/[\s.-]/g, '');
    if (!phoneClean || phoneClean.length < 8) {
      errs.phone = 'Veuillez renseigner un numéro de téléphone valide.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!clientForm.email || !emailRegex.test(clientForm.email)) {
      errs.email = 'Veuillez saisir une adresse email valide.';
    }
    setClientErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validation step 3 (if delivery)
  const validateDeliveryForm = () => {
    if (deliveryMethod === 'pickup') return true;
    const errs = {};
    if (!deliveryAddress.address || deliveryAddress.address.trim().length < 3) {
      errs.address = 'Veuillez préciser votre adresse ou commune de livraison.';
    }
    if (!deliveryAddress.city || deliveryAddress.city.trim().length < 2) {
      errs.city = 'Veuillez renseigner la ville.';
    }
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Advance from Step 2
  const handleClientSubmit = (e) => {
    e.preventDefault();
    if (validateClientForm()) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Advance from Step 3
  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    if (validateDeliveryForm()) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Start Payment Simulation (Step 5 -> Step 6)
  const handleStartPaymentSimulation = () => {
    setCurrentStep(6);
    setSimulationProgress(10);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Simulate progress animation over 2.5 seconds
    const interval = setInterval(() => {
      setSimulationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 450);

    setTimeout(() => {
      clearInterval(interval);
      executeOrderCreation(simulationScenario);
    }, 2400);
  };

  // Process order based on chosen simulation outcome
  const executeOrderCreation = (scenario) => {
    const counter = Math.floor(100 + Math.random() * 900);
    const orderRef = `CMD-2026-${counter}`;
    const txnRef = `TXN-2026-${counter}`;

    if (scenario === 'refused') {
      setOrderResult({
        status: 'refused',
        orderReference: orderRef,
        message: 'Transaction refusée par l\'émetteur ou solde insuffisant.'
      });
      toastError('Paiement refusé par la passerelle de test.');
      setCurrentStep(7);
      return;
    }

    // Success or Pending
    try {
      // 1. Find or create client
      const client = findOrCreateClient({
        name: clientForm.name.trim(),
        phone: clientForm.phone.trim(),
        email: clientForm.email.trim(),
        address: deliveryMethod === 'delivery' ? `${deliveryAddress.address}, ${deliveryAddress.city}` : 'Cocody, Abidjan'
      });

      // Order status
      const isPending = scenario === 'pending';
      const orderStatus = isPending ? 'pending' : 'paid';
      const paymentStatus = isPending ? 'pending' : 'completed';

      // 2. Add Order to DataContext
      const orderPayload = {
        clientId: client.id,
        clientName: client.name,
        clientPhone: client.phone,
        clientEmail: client.email,
        items: cartItemsWithDetails.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.lineTotal
        })),
        subtotal: liveSubtotal,
        discount: discountAmount || 0,
        promoCode: promoCode || null,
        shippingFee,
        total: finalTotal,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : null,
        paymentMethod,
        status: orderStatus,
        paymentStatus
      };

      dispatch({ type: 'ADD_ORDER', payload: orderPayload });

      // 3. Add Transaction to DataContext
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          clientId: client.id,
          clientName: client.name,
          amount: finalTotal,
          type: 'order',
          method: paymentMethod,
          status: paymentStatus,
          reference: txnRef,
          relatedOrderRef: orderRef,
          note: `Commande boutique ${orderRef}`
        }
      });

      // 4. If success, decrement stocks in DataContext
      if (!isPending) {
        cartItemsWithDetails.forEach(item => {
          dispatch({
            type: 'UPDATE_STOCK',
            payload: {
              productId: item.productId,
              quantity: item.quantity,
              type: 'order',
              note: `Commande client ${orderRef}`
            }
          });
        });

        // 5. Clear cart
        clearCart();
        toastSuccess(`Commande ${orderRef} confirmée avec succès !`);
      } else {
        toastInfo(`Commande ${orderRef} enregistrée en attente de paiement.`);
      }

      setOrderResult({
        status: isPending ? 'pending' : 'success',
        orderReference: orderRef,
        transactionReference: txnRef,
        total: finalTotal,
        clientName: client.name,
        clientEmail: client.email,
        clientPhone: client.phone,
        deliveryMethod,
        deliveryAddress,
        paymentMethod,
        items: cartItemsWithDetails
      });

      setCurrentStep(7);
    } catch (err) {
      console.error(err);
      toastError('Erreur lors du traitement de la commande.');
      setCurrentStep(5);
    }
  };

  return (
    <div className="checkout-page">
      {/* Checkout Hero */}
      <section className="checkout-hero">
        <div className="checkout-hero-content">
          <span className="checkout-eyebrow">Boutique Glam'Or Beauty</span>
          <h1 className="checkout-title">Finalisation de Commande</h1>
          <p className="checkout-subtitle">Processus d'achat sécurisé et rituels de beauté livrés chez vous</p>
        </div>
      </section>

      <div className="checkout-container">
        {/* Stepper Progress Indicator */}
        {currentStep <= 5 && (
          <nav className="checkout-stepper" aria-label="Étapes de la commande">
            <div className="checkout-stepper-track">
              {CHECKOUT_STEPS.slice(0, 5).map(step => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                return (
                  <div
                    key={step.id}
                    className={`c-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => {
                      if (isCompleted) {
                        setCurrentStep(step.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  >
                    <div className="c-step-circle">
                      {isCompleted ? <Check size={16} /> : step.id}
                    </div>
                    <span className="c-step-label">{step.short}</span>
                  </div>
                );
              })}
            </div>
            <div className="c-step-mobile">
              Étape {currentStep} sur 5 : <strong>{CHECKOUT_STEPS[currentStep - 1]?.title}</strong>
            </div>
          </nav>
        )}

        {/* ======================================================== */}
        {/* STEP 1: CART REVIEW                                      */}
        {/* ======================================================== */}
        {currentStep === 1 && (
          <div className="checkout-step-card step-enter">
            <div className="step-header-compact">
              <span className="step-badge">Étape 1</span>
              <h2>Vérification de vos articles</h2>
              <p>Confirmez les articles de votre panier avant de renseigner vos informations de livraison</p>
            </div>

            {cartItemsWithDetails.length === 0 ? (
              <div className="empty-cart-warning">
                <ShoppingBag size={48} />
                <h3>Votre panier est vide</h3>
                <p>Ajoutez des soins ou accessoires depuis la boutique avant de passer commande.</p>
                <Link to="/boutique" className="btn-primary">
                  Aller à la boutique
                </Link>
              </div>
            ) : (
              <div className="cart-review-list">
                {cartItemsWithDetails.map(item => (
                  <div key={item.productId} className="review-item-row">
                    <div className="review-item-img">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <Sparkles size={20} />
                      )}
                    </div>
                    <div className="review-item-details">
                      <h4 className="review-item-name">{item.name}</h4>
                      <div className="review-item-unit">
                        Prix : <strong>{formatPrice(item.price)}</strong> × {item.quantity}
                      </div>
                    </div>
                    <div className="review-item-subtotal">
                      {formatPrice(item.lineTotal)}
                    </div>
                  </div>
                ))}

                {/* Financial Summary */}
                <div className="review-financials-box">
                  <div className="fin-row">
                    <span>Sous-total articles :</span>
                    <strong>{formatPrice(liveSubtotal)}</strong>
                  </div>
                  {discountAmount > 0 && (
                    <div className="fin-row discount">
                      <span>Réduction ({promoCode}) :</span>
                      <strong>- {formatPrice(discountAmount)}</strong>
                    </div>
                  )}
                  <div className="fin-row">
                    <span>Livraison estimée :</span>
                    <span>{isFreeShipping ? 'Offerte' : `${formatPrice(settings?.shippingFee || 2500)}`}</span>
                  </div>
                  <div className="fin-divider" />
                  <div className="fin-row total">
                    <span>Total estimé :</span>
                    <span className="fin-total-amount">
                      {formatPrice(Math.max(0, liveSubtotal - (discountAmount || 0)))}
                    </span>
                  </div>
                </div>

                <div className="step-actions-footer">
                  <Link to="/panier" className="btn-secondary">
                    <ChevronLeft size={18} />
                    <span>Modifier le panier</span>
                  </Link>
                  <button
                    type="button"
                    className="btn-primary btn-large"
                    onClick={() => {
                      setCurrentStep(2);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <span>Continuer vers les coordonnées</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: CLIENT INFO                                      */}
        {/* ======================================================== */}
        {currentStep === 2 && (
          <div className="checkout-step-card step-enter">
            <div className="step-nav-bar">
              <button
                type="button"
                className="btn-back"
                onClick={() => {
                  setCurrentStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <ChevronLeft size={18} />
                <span>Retour au panier</span>
              </button>
            </div>

            <div className="step-header-compact">
              <span className="step-badge">Étape 2</span>
              <h2>Vos Coordonnées</h2>
              <p>Indiquez la personne qui recevra la commande et les notifications de suivi</p>
            </div>

            <form onSubmit={handleClientSubmit} className="checkout-form" noValidate>
              <div className="c-form-grid">
                {/* Nom */}
                <div className={`c-form-group ${clientErrors.name ? 'has-error' : ''}`}>
                  <label htmlFor="checkout-name">
                    Nom complet <span className="req">*</span>
                  </label>
                  <div className="c-input-wrap">
                    <User size={18} className="c-input-icon" />
                    <input
                      id="checkout-name"
                      type="text"
                      placeholder="Ex: Fatim Cissé"
                      value={clientForm.name}
                      onChange={e => {
                        setClientForm({ ...clientForm, name: e.target.value });
                        if (clientErrors.name) setClientErrors({ ...clientErrors, name: null });
                      }}
                    />
                  </div>
                  {clientErrors.name && <span className="c-field-err">{clientErrors.name}</span>}
                </div>

                {/* Téléphone */}
                <div className={`c-form-group ${clientErrors.phone ? 'has-error' : ''}`}>
                  <label htmlFor="checkout-phone">
                    Téléphone (WhatsApp / SMS) <span className="req">*</span>
                  </label>
                  <div className="c-input-wrap">
                    <Phone size={18} className="c-input-icon" />
                    <input
                      id="checkout-phone"
                      type="tel"
                      placeholder="+225 07 12 34 56 78"
                      value={clientForm.phone}
                      onChange={e => {
                        setClientForm({ ...clientForm, phone: e.target.value });
                        if (clientErrors.phone) setClientErrors({ ...clientErrors, phone: null });
                      }}
                    />
                  </div>
                  {clientErrors.phone && <span className="c-field-err">{clientErrors.phone}</span>}
                </div>

                {/* Email */}
                <div className={`c-form-group full-width ${clientErrors.email ? 'has-error' : ''}`}>
                  <label htmlFor="checkout-email">
                    Adresse Email pour la facture <span className="req">*</span>
                  </label>
                  <div className="c-input-wrap">
                    <Mail size={18} className="c-input-icon" />
                    <input
                      id="checkout-email"
                      type="email"
                      placeholder="fatim.cisse@example.com"
                      value={clientForm.email}
                      onChange={e => {
                        setClientForm({ ...clientForm, email: e.target.value });
                        if (clientErrors.email) setClientErrors({ ...clientErrors, email: null });
                      }}
                    />
                  </div>
                  {clientErrors.email && <span className="c-field-err">{clientErrors.email}</span>}
                </div>
              </div>

              <div className="step-actions-footer">
                <button type="submit" className="btn-primary btn-large ml-auto">
                  <span>Continuer vers le mode de livraison</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: DELIVERY METHOD                                   */}
        {/* ======================================================== */}
        {currentStep === 3 && (
          <div className="checkout-step-card step-enter">
            <div className="step-nav-bar">
              <button
                type="button"
                className="btn-back"
                onClick={() => {
                  setCurrentStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <ChevronLeft size={18} />
                <span>Retour aux coordonnées</span>
              </button>
            </div>

            <div className="step-header-compact">
              <span className="step-badge">Étape 3</span>
              <h2>Mode de Réception</h2>
              <p>Choisissez entre une livraison soignée à votre porte ou un retrait privilégié au salon</p>
            </div>

            <div className="delivery-options-grid">
              {/* Option 1: Livraison à domicile */}
              <div
                className={`delivery-option-card ${deliveryMethod === 'delivery' ? 'selected' : ''}`}
                onClick={() => setDeliveryMethod('delivery')}
              >
                <div className="option-radio-dot">
                  {deliveryMethod === 'delivery' && <div className="dot-inner" />}
                </div>
                <div className="option-card-icon">
                  <Truck size={28} />
                </div>
                <div className="option-card-body">
                  <div className="option-title-row">
                    <h3>Livraison à domicile</h3>
                    <span className="option-fee-badge">
                      {isFreeShipping ? 'Gratuite' : formatPrice(settings?.shippingFee || 2500)}
                    </span>
                  </div>
                  <p>
                    Livraison express sous 24h à 48h sur Abidjan et périphérie avec suivi par coursier dédié.
                  </p>
                </div>
              </div>

              {/* Option 2: Retrait au salon */}
              <div
                className={`delivery-option-card ${deliveryMethod === 'pickup' ? 'selected' : ''}`}
                onClick={() => setDeliveryMethod('pickup')}
              >
                <div className="option-radio-dot">
                  {deliveryMethod === 'pickup' && <div className="dot-inner" />}
                </div>
                <div className="option-card-icon">
                  <Store size={28} />
                </div>
                <div className="option-card-body">
                  <div className="option-title-row">
                    <h3>Retrait gratuit au salon</h3>
                    <span className="option-fee-badge free">Gratuit</span>
                  </div>
                  <p>
                    Disponible sous 2h ouvrées à notre salon de Cocody Ambassades avec un accueil privilégié.
                  </p>
                </div>
              </div>
            </div>

            {/* If delivery: Address Form */}
            {deliveryMethod === 'delivery' && (
              <form onSubmit={handleDeliverySubmit} className="delivery-subform step-enter">
                <h3 className="subform-title">Adresse de livraison</h3>
                <div className="c-form-grid">
                  <div className={`c-form-group full-width ${addressErrors.address ? 'has-error' : ''}`}>
                    <label htmlFor="del-address">
                      Adresse complète ou quartier / repère <span className="req">*</span>
                    </label>
                    <input
                      id="del-address"
                      type="text"
                      className="c-simple-input"
                      placeholder="Ex: Cocody Angré 8ème Tranche, près de la pharmacie"
                      value={deliveryAddress.address}
                      onChange={e => {
                        setDeliveryAddress({ ...deliveryAddress, address: e.target.value });
                        if (addressErrors.address) setAddressErrors({ ...addressErrors, address: null });
                      }}
                    />
                    {addressErrors.address && <span className="c-field-err">{addressErrors.address}</span>}
                  </div>

                  <div className={`c-form-group ${addressErrors.city ? 'has-error' : ''}`}>
                    <label htmlFor="del-city">
                      Ville <span className="req">*</span>
                    </label>
                    <input
                      id="del-city"
                      type="text"
                      className="c-simple-input"
                      value={deliveryAddress.city}
                      onChange={e => {
                        setDeliveryAddress({ ...deliveryAddress, city: e.target.value });
                        if (addressErrors.city) setAddressErrors({ ...addressErrors, city: null });
                      }}
                    />
                    {addressErrors.city && <span className="c-field-err">{addressErrors.city}</span>}
                  </div>

                  <div className="c-form-group">
                    <label htmlFor="del-postal">Code postal / Commune (optionnel)</label>
                    <input
                      id="del-postal"
                      type="text"
                      className="c-simple-input"
                      placeholder="Ex: Cocody"
                      value={deliveryAddress.postalCode}
                      onChange={e => setDeliveryAddress({ ...deliveryAddress, postalCode: e.target.value })}
                    />
                  </div>

                  <div className="c-form-group full-width">
                    <label htmlFor="del-notes">Instructions particulières pour le livreur (optionnel)</label>
                    <textarea
                      id="del-notes"
                      rows="2"
                      className="c-simple-textarea"
                      placeholder="Code portail, interphone, étage ou indication géographique..."
                      value={deliveryAddress.notes}
                      onChange={e => setDeliveryAddress({ ...deliveryAddress, notes: e.target.value })}
                    />
                  </div>
                </div>

                <div className="step-actions-footer">
                  <button type="submit" className="btn-primary btn-large ml-auto">
                    <span>Continuer vers le paiement</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            )}

            {/* If pickup: Salon Information Card */}
            {deliveryMethod === 'pickup' && (
              <div className="pickup-info-card step-enter">
                <div className="pickup-info-header">
                  <MapPin size={22} />
                  <h4>Point de retrait Glam'Or Beauty</h4>
                </div>
                <p className="pickup-address">
                  {settings?.address || '12 Boulevard de la Beauté, Cocody Ambassades, Abidjan'}
                </p>
                <div className="pickup-timings">
                  <strong>Horaires de retrait :</strong> Du Lundi au Samedi, 9h00 - 19h00.
                </div>
                <div className="pickup-note">
                  Votre commande sera préparée dans un élégant packaging siglé sous 2 heures.
                </div>

                <div className="step-actions-footer">
                  <button
                    type="button"
                    className="btn-primary btn-large ml-auto"
                    onClick={() => {
                      setCurrentStep(4);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <span>Continuer vers le paiement</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 4: PAYMENT METHOD                                    */}
        {/* ======================================================== */}
        {currentStep === 4 && (
          <div className="checkout-step-card step-enter">
            <div className="step-nav-bar">
              <button
                type="button"
                className="btn-back"
                onClick={() => {
                  setCurrentStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <ChevronLeft size={18} />
                <span>Retour à la livraison</span>
              </button>
            </div>

            <div className="step-header-compact">
              <span className="step-badge">Étape 4</span>
              <h2>Mode de Paiement</h2>
              <p>Sélectionnez votre moyen de règlement sécurisé</p>
            </div>

            <div className="payment-options-list">
              {/* Option 1: Carte bancaire */}
              <div
                className={`payment-method-card ${paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="option-radio-dot">
                  {paymentMethod === 'card' && <div className="dot-inner" />}
                </div>
                <div className="pm-icon-wrap">
                  <CreditCard size={24} />
                </div>
                <div className="pm-details">
                  <div className="pm-title-row">
                    <h3>Carte Bancaire</h3>
                    <span className="pm-badges">Visa • Mastercard</span>
                  </div>
                  <p>Paiement sécurisé crypté SSL haute conformité.</p>
                </div>
              </div>

              {/* Option 2: Mobile Money */}
              <div
                className={`payment-method-card ${paymentMethod === 'mobile_money' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('mobile_money')}
              >
                <div className="option-radio-dot">
                  {paymentMethod === 'mobile_money' && <div className="dot-inner" />}
                </div>
                <div className="pm-icon-wrap">
                  <Smartphone size={24} />
                </div>
                <div className="pm-details">
                  <div className="pm-title-row">
                    <h3>Mobile Money</h3>
                    <span className="pm-badges">Wave • Orange • MTN • Moov</span>
                  </div>
                  <p>Validation instantanée par notification push sur votre numéro.</p>
                </div>
              </div>

              {/* Option 3: Paiement à la livraison / retrait */}
              <div
                className={`payment-method-card ${paymentMethod === 'cash' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <div className="option-radio-dot">
                  {paymentMethod === 'cash' && <div className="dot-inner" />}
                </div>
                <div className="pm-icon-wrap">
                  <Banknote size={24} />
                </div>
                <div className="pm-details">
                  <div className="pm-title-row">
                    <h3>Paiement sur place / à la livraison</h3>
                    <span className="pm-badges">Espèces ou TPE</span>
                  </div>
                  <p>Réglez directement auprès du coursier ou lors du retrait au salon.</p>
                </div>
              </div>
            </div>

            {/* Demo Notice */}
            <div className="demo-payment-alert">
              <ShieldCheck size={20} />
              <div>
                <strong>Environnement de Démonstration :</strong>
                <p>Aucun paiement réel ni prélèvement bancaire ne sera effectué.</p>
              </div>
            </div>

            <div className="step-actions-footer">
              <button
                type="button"
                className="btn-primary btn-large ml-auto"
                onClick={() => {
                  setCurrentStep(5);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>Vérifier ma commande</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 5: ORDER REVIEW                                      */}
        {/* ======================================================== */}
        {currentStep === 5 && (
          <div className="checkout-step-card step-enter">
            <div className="step-nav-bar">
              <button
                type="button"
                className="btn-back"
                onClick={() => {
                  setCurrentStep(4);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <ChevronLeft size={18} />
                <span>Modifier le paiement</span>
              </button>
            </div>

            <div className="step-header-compact">
              <span className="step-badge">Étape 5</span>
              <h2>Récapitulatif de votre commande</h2>
              <p>Veuillez vérifier tous les éléments avant de lancer la simulation de paiement</p>
            </div>

            <div className="order-review-grid">
              {/* Section 1: Client */}
              <div className="recap-section-box">
                <div className="recap-header">
                  <div className="recap-title">
                    <User size={18} />
                    <span>Client & Contact</span>
                  </div>
                  <button type="button" className="recap-link" onClick={() => setCurrentStep(2)}>
                    Modifier
                  </button>
                </div>
                <div className="recap-body">
                  <p><strong>Nom :</strong> {clientForm.name}</p>
                  <p><strong>Téléphone :</strong> {clientForm.phone}</p>
                  <p><strong>Email :</strong> {clientForm.email}</p>
                </div>
              </div>

              {/* Section 2: Delivery */}
              <div className="recap-section-box">
                <div className="recap-header">
                  <div className="recap-title">
                    <Truck size={18} />
                    <span>Mode de réception</span>
                  </div>
                  <button type="button" className="recap-link" onClick={() => setCurrentStep(3)}>
                    Modifier
                  </button>
                </div>
                <div className="recap-body">
                  {deliveryMethod === 'delivery' ? (
                    <>
                      <p><strong>Méthode :</strong> Livraison à domicile</p>
                      <p><strong>Adresse :</strong> {deliveryAddress.address}, {deliveryAddress.city}</p>
                      {deliveryAddress.notes && <p><strong>Instructions :</strong> {deliveryAddress.notes}</p>}
                    </>
                  ) : (
                    <>
                      <p><strong>Méthode :</strong> Retrait au salon Glam'Or Beauty</p>
                      <p><strong>Lieu :</strong> {settings?.address || 'Cocody Ambassades, Abidjan'}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Section 3: Payment */}
              <div className="recap-section-box">
                <div className="recap-header">
                  <div className="recap-title">
                    <CreditCard size={18} />
                    <span>Moyen de paiement</span>
                  </div>
                  <button type="button" className="recap-link" onClick={() => setCurrentStep(4)}>
                    Modifier
                  </button>
                </div>
                <div className="recap-body">
                  <p>
                    <strong>Méthode : </strong>
                    {paymentMethod === 'card' && 'Carte bancaire (Visa / Mastercard)'}
                    {paymentMethod === 'mobile_money' && 'Mobile Money (Wave, Orange, MTN, Moov)'}
                    {paymentMethod === 'cash' && 'Paiement à la livraison / retrait'}
                  </p>
                </div>
              </div>

              {/* Section 4: Items & Totals */}
              <div className="recap-section-box full-span">
                <div className="recap-header">
                  <div className="recap-title">
                    <ShoppingBag size={18} />
                    <span>Articles ({cartItemsWithDetails.length})</span>
                  </div>
                  <button type="button" className="recap-link" onClick={() => setCurrentStep(1)}>
                    Modifier
                  </button>
                </div>
                <div className="recap-items-mini">
                  {cartItemsWithDetails.map(item => (
                    <div key={item.productId} className="mini-item-row">
                      <span className="m-name">{item.name} × {item.quantity}</span>
                      <span className="m-price">{formatPrice(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="recap-totals-summary">
                  <div className="t-row">
                    <span>Sous-total :</span>
                    <span>{formatPrice(liveSubtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="t-row t-discount">
                      <span>Réduction code promo :</span>
                      <span>- {formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="t-row">
                    <span>Frais de livraison :</span>
                    <span>{shippingFee === 0 ? 'Gratuit' : formatPrice(shippingFee)}</span>
                  </div>
                  <div className="t-divider" />
                  <div className="t-row t-grand-total">
                    <span>Total à régler :</span>
                    <span className="t-highlight">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="step-actions-footer">
              <button
                type="button"
                className="btn-confirm-order"
                onClick={handleStartPaymentSimulation}
              >
                <CheckCircle size={20} />
                <span>Confirmer et procéder au paiement ({formatPrice(finalTotal)})</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 6: PAYMENT SIMULATION                                */}
        {/* ======================================================== */}
        {currentStep === 6 && (
          <div className="checkout-step-card step-simulation">
            <div className="simulation-modal-body">
              <div className="simulation-scenario-picker">
                <span className="picker-title">Mode Démonstration : Choisissez l'issue</span>
                <div className="picker-buttons">
                  <button
                    type="button"
                    className={`scenario-btn ${simulationScenario === 'success' ? 'active-success' : ''}`}
                    onClick={() => setSimulationScenario('success')}
                  >
                    Succès (Réussi)
                  </button>
                  <button
                    type="button"
                    className={`scenario-btn ${simulationScenario === 'refused' ? 'active-danger' : ''}`}
                    onClick={() => setSimulationScenario('refused')}
                  >
                    Échec (Refusé)
                  </button>
                  <button
                    type="button"
                    className={`scenario-btn ${simulationScenario === 'pending' ? 'active-warning' : ''}`}
                    onClick={() => setSimulationScenario('pending')}
                  >
                    En attente (Pending)
                  </button>
                </div>
              </div>

              <div className="simulation-animation-area">
                <div className="sim-spinner-container">
                  <div className="sim-gold-spinner" />
                  <CreditCard size={28} className="sim-card-icon" />
                </div>

                <h2>Simulation du Paiement en cours...</h2>
                <p>Connexion à la passerelle de paiement et sécurisation du protocole 3D Secure...</p>

                <div className="sim-progress-track">
                  <div
                    className="sim-progress-bar"
                    style={{ width: `${simulationProgress}%` }}
                  />
                </div>
                <span className="sim-progress-text">{simulationProgress}% finalisé</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 7: CONFIRMATION                                      */}
        {/* ======================================================== */}
        {currentStep === 7 && orderResult && (
          <div className="checkout-step-card step-result-enter">
            {/* SUCCESS SCENARIO */}
            {orderResult.status === 'success' && (
              <div className="result-container success">
                <div className="result-icon-badge success-bg">
                  <CheckCircle size={54} />
                </div>
                <span className="result-eyebrow">Commande Validée</span>
                <h2 className="result-title">Merci pour votre confiance !</h2>
                <p className="result-message">
                  Votre commande a été traitée avec succès. Un email récapitulatif a été expédié à{' '}
                  <strong>{orderResult.clientEmail}</strong>.
                </p>

                <div className="result-ref-box">
                  <div className="ref-col">
                    <span className="r-label">Référence Commande</span>
                    <strong className="r-val">{orderResult.orderReference}</strong>
                  </div>
                  <div className="ref-col">
                    <span className="r-label">Statut Commande</span>
                    <span className="r-badge badge-green">Payée</span>
                  </div>
                  <div className="ref-col">
                    <span className="r-label">Statut Paiement</span>
                    <span className="r-badge badge-green">Réussi (simulation)</span>
                  </div>
                </div>

                <div className="result-details-recap">
                  <div className="detail-item">
                    <span className="d-label">Destinataire :</span>
                    <span className="d-val">{orderResult.clientName} ({orderResult.clientPhone})</span>
                  </div>
                  <div className="detail-item">
                    <span className="d-label">Mode de réception :</span>
                    <span className="d-val">
                      {orderResult.deliveryMethod === 'delivery'
                        ? `Livraison à ${orderResult.deliveryAddress.address}, ${orderResult.deliveryAddress.city}`
                        : 'Retrait au salon Glam\'Or Beauty'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="d-label">Montant Total :</span>
                    <span className="d-val gold-bold">{formatPrice(orderResult.total)}</span>
                  </div>
                </div>

                <div className="demo-disclaimer-box">
                  <AlertCircle size={18} />
                  <span>
                    Note de démonstration : Cette commande a été enregistrée dans la mémoire locale de l'application.
                    Aucun prélèvement réel n'a eu lieu.
                  </span>
                </div>

                <div className="result-actions">
                  <Link to="/" className="btn-secondary">
                    Retour à l'accueil
                  </Link>
                  <Link to="/boutique" className="btn-primary">
                    <Sparkles size={16} />
                    <span>Continuer mes achats</span>
                  </Link>
                </div>
              </div>
            )}

            {/* REFUSED SCENARIO */}
            {orderResult.status === 'refused' && (
              <div className="result-container refused">
                <div className="result-icon-badge error-bg">
                  <XCircle size={54} />
                </div>
                <span className="result-eyebrow text-error">Transaction Échouée</span>
                <h2 className="result-title">Paiement Refusé</h2>
                <p className="result-message">
                  {orderResult.message || 'La transaction n\'a pas pu aboutir. Votre compte bancaire n\'a pas été débité.'}
                </p>

                <div className="refused-options-box">
                  <p>Vous pouvez réessayer avec un autre moyen de paiement ou sélectionner un autre mode de règlement.</p>
                </div>

                <div className="result-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setSimulationScenario('success');
                      setCurrentStep(4);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <RefreshCw size={16} />
                    <span>Changer de moyen de paiement</span>
                  </button>
                  <Link to="/panier" className="btn-secondary">
                    Retourner au panier
                  </Link>
                </div>
              </div>
            )}

            {/* PENDING SCENARIO */}
            {orderResult.status === 'pending' && (
              <div className="result-container pending">
                <div className="result-icon-badge warning-bg">
                  <Clock size={54} />
                </div>
                <span className="result-eyebrow text-warning">En cours de traitement</span>
                <h2 className="result-title">Paiement en Attente de Validation</h2>
                <p className="result-message">
                  Votre transaction Mobile Money a été initiée sous la référence{' '}
                  <strong>{orderResult.orderReference}</strong>. Veuillez valider le code secret sur votre téléphone.
                </p>

                <div className="result-ref-box">
                  <div className="ref-col">
                    <span className="r-label">Référence</span>
                    <strong className="r-val">{orderResult.orderReference}</strong>
                  </div>
                  <div className="ref-col">
                    <span className="r-label">Statut</span>
                    <span className="r-badge badge-warning">En attente</span>
                  </div>
                  <div className="ref-col">
                    <span className="r-label">Montant</span>
                    <span className="r-val gold-bold">{formatPrice(orderResult.total)}</span>
                  </div>
                </div>

                <div className="demo-disclaimer-box">
                  <AlertCircle size={18} />
                  <span>
                    Note de démonstration : Le statut de commande restera en attente jusqu'à validation dans le panneau d'administration.
                  </span>
                </div>

                <div className="result-actions">
                  <Link to="/" className="btn-secondary">
                    Retour à l'accueil
                  </Link>
                  <Link to="/boutique" className="btn-primary">
                    Continuer mes achats
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
