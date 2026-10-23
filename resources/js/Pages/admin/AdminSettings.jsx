import { useState } from 'react';
import { 
  Settings, 
  Clock, 
  Calendar, 
  Sliders, 
  Truck, 
  CreditCard, 
  Tag, 
  AlertTriangle, 
  RefreshCw, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle,
  Building,
  Phone,
  Mail,
  MapPin,
  X
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import './AdminSettings.css';

const WEEKDAYS = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' }
];

export default function AdminSettings() {
  const { settings, dispatch } = useData();
  const { success, error, warning } = useToast();

  // 1. Salon Info Form State
  const [salonInfo, setSalonInfo] = useState({
    name: settings?.name || "Glam'Or Beauty",
    tagline: settings?.tagline || "Salon de Beauté & Institut d'Élégance",
    phone: settings?.phone || "+225 27 22 45 67 89",
    email: settings?.email || "contact@glamor-beauty.com",
    address: settings?.address || "Cocody Riviera Golf, Boulevard François Mitterrand, Abidjan"
  });

  // 2. Opening Hours State
  const [openingHours, setOpeningHours] = useState(() => {
    return settings?.openingHours || {
      monday: { open: '09:00', close: '19:00', isOpen: true },
      tuesday: { open: '09:00', close: '19:00', isOpen: true },
      wednesday: { open: '09:00', close: '19:00', isOpen: true },
      thursday: { open: '09:00', close: '19:00', isOpen: true },
      friday: { open: '09:00', close: '20:00', isOpen: true },
      saturday: { open: '09:00', close: '20:00', isOpen: true },
      sunday: { open: '10:00', close: '18:00', isOpen: false }
    };
  });

  // 3. Closed Dates State
  const [closedDates, setClosedDates] = useState(() => settings?.closedDates || ['2026-12-25', '2026-01-01', '2026-05-01', '2026-08-07']);
  const [newClosedDate, setNewClosedDate] = useState('');

  // 4. Booking Settings
  const [slotDuration, setSlotDuration] = useState(settings?.slotDuration || 30);

  // 5. Shipping & Payment
  const [shippingFee, setShippingFee] = useState(settings?.shippingFee ?? 2500);
  const [freePickup, setFreePickup] = useState(settings?.freePickup ?? true);
  const [paymentMethods, setPaymentMethods] = useState(() => {
    return settings?.paymentMethods || [
      { id: 'card', name: 'Carte bancaire (Visa / Mastercard)', active: true },
      { id: 'mobile_money', name: 'Mobile Money (Wave, Orange, MTN, Moov)', active: true },
      { id: 'cash', name: 'Paiement au salon / à la livraison', active: true }
    ];
  });

  // 6. Promo Codes
  const [promoCodes, setPromoCodes] = useState(() => settings?.promoCodes || []);
  const [isAddPromoModalOpen, setIsAddPromoModalOpen] = useState(false);
  const [newPromo, setNewPromo] = useState({
    code: '',
    discount: '',
    type: 'percentage', // 'percentage' | 'fixed'
    minOrderAmount: 0,
    description: ''
  });

  // 7. Stock Threshold
  const [stockAlertThreshold, setStockAlertThreshold] = useState(settings?.stockAlertThreshold ?? 5);

  // 8. Reset Modal
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // === HANDLERS ===

  // Save Salon Info
  const handleSaveInfo = (e) => {
    e.preventDefault();
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { ...salonInfo }
    });
    success('Informations générales du salon mises à jour.');
  };

  // Save Opening Hours
  const handleSaveHours = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { openingHours }
    });
    success('Horaires d\'ouverture enregistrés.');
  };

  const handleToggleDayOpen = (dayKey) => {
    setOpeningHours(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        isOpen: !prev[dayKey]?.isOpen
      }
    }));
  };

  const handleHourTimeChange = (dayKey, field, val) => {
    setOpeningHours(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: val
      }
    }));
  };

  // Closed Dates
  const handleAddClosedDate = (e) => {
    e.preventDefault();
    if (!newClosedDate) return;
    if (closedDates.includes(newClosedDate)) {
      warning('Cette date de fermeture est déjà enregistrée.');
      return;
    }
    const updated = [...closedDates, newClosedDate].sort();
    setClosedDates(updated);
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { closedDates: updated }
    });
    setNewClosedDate('');
    success('Jour de fermeture exceptionnel ajouté.');
  };

  const handleDeleteClosedDate = (dateToDelete) => {
    const updated = closedDates.filter(d => d !== dateToDelete);
    setClosedDates(updated);
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { closedDates: updated }
    });
    success('Date de fermeture supprimée.');
  };

  // Booking settings
  const handleSaveBookingSettings = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { slotDuration: Number(slotDuration) }
    });
    success(`Durée standard des créneaux mise à jour : ${slotDuration} minutes.`);
  };

  // Shipping & Payment
  const handleTogglePaymentMethod = (methodId) => {
    setPaymentMethods(prev => 
      prev.map(pm => pm.id === methodId ? { ...pm, active: !pm.active } : pm)
    );
  };

  const handleSaveDeliveryAndPayment = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        shippingFee: Number(shippingFee),
        freePickup,
        paymentMethods
      }
    });
    success('Paramètres de livraison et de paiement sauvegardés.');
  };

  // Promo Codes
  const handleAddPromoCode = (e) => {
    e.preventDefault();
    if (!newPromo.code.trim()) {
      error('Le code promotionnel est requis.');
      return;
    }
    const discountVal = Number(newPromo.discount);
    if (isNaN(discountVal) || discountVal <= 0) {
      error('Veuillez entrer une réduction valide.');
      return;
    }

    const codeUpper = newPromo.code.trim().toUpperCase();
    if (promoCodes.some(p => p.code === codeUpper)) {
      error(`Le code promo ${codeUpper} existe déjà.`);
      return;
    }

    const created = {
      ...newPromo,
      code: codeUpper,
      discount: discountVal,
      minOrderAmount: Number(newPromo.minOrderAmount || 0)
    };

    const updated = [...promoCodes, created];
    setPromoCodes(updated);
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { promoCodes: updated }
    });

    success(`Code promotionnel "${codeUpper}" créé avec succès.`);
    setIsAddPromoModalOpen(false);
    setNewPromo({
      code: '',
      discount: '',
      type: 'percentage',
      minOrderAmount: 0,
      description: ''
    });
  };

  const handleDeletePromo = (codeToDelete) => {
    const updated = promoCodes.filter(p => p.code !== codeToDelete);
    setPromoCodes(updated);
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { promoCodes: updated }
    });
    success(`Code promotionnel "${codeToDelete}" supprimé.`);
  };

  // Stock Threshold
  const handleSaveStockAlert = () => {
    const val = Number(stockAlertThreshold);
    if (isNaN(val) || val < 1) {
      error('Veuillez définir un seuil valide (minimum 1).');
      return;
    }
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { stockAlertThreshold: val }
    });
    success(`Seuil d'alerte stock par défaut défini à ${val} unités.`);
  };

  // Reset Demo Data
  const handleResetData = () => {
    dispatch({ type: 'RESET_DATA' });
    setIsResetConfirmOpen(false);
    success('Les données de démonstration ont été entièrement réinitialisées.');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="admin-settings-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Configuration & Paramètres du Salon</h1>
          <p className="admin-page-subtitle">
            Personnalisez vos coordonnées, vos horaires, règles de réservation et offres promotionnelles.
          </p>
        </div>
      </div>

      <div className="settings-sections-container">
        {/* Section 1: Salon Information */}
        <div className="admin-card settings-card">
          <div className="settings-card-header">
            <Building className="settings-section-icon" size={20} />
            <div>
              <h3>Informations du salon</h3>
              <p>Nom officiel, slogan et coordonnées affichés sur le site public.</p>
            </div>
          </div>
          <form onSubmit={handleSaveInfo} className="settings-card-body">
            <div className="admin-form-grid">
              <div className="form-group">
                <label>Nom de l'établissement *</label>
                <input
                  type="text"
                  required
                  value={salonInfo.name}
                  onChange={(e) => setSalonInfo({ ...salonInfo, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Slogan / Accroche</label>
                <input
                  type="text"
                  value={salonInfo.tagline}
                  onChange={(e) => setSalonInfo({ ...salonInfo, tagline: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Téléphone principal *</label>
                <input
                  type="text"
                  required
                  value={salonInfo.phone}
                  onChange={(e) => setSalonInfo({ ...salonInfo, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email de contact *</label>
                <input
                  type="email"
                  required
                  value={salonInfo.email}
                  onChange={(e) => setSalonInfo({ ...salonInfo, email: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <label>Adresse physique (Abidjan) *</label>
                <input
                  type="text"
                  required
                  value={salonInfo.address}
                  onChange={(e) => setSalonInfo({ ...salonInfo, address: e.target.value })}
                />
              </div>
            </div>
            <div className="settings-actions-footer">
              <button type="submit" className="admin-btn admin-btn-primary">
                <Save size={16} />
                <span>Enregistrer les coordonnées</span>
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Opening Hours */}
        <div className="admin-card settings-card">
          <div className="settings-card-header">
            <Clock className="settings-section-icon" size={20} />
            <div>
              <h3>Horaires d'ouverture</h3>
              <p>Plages de travail hebdomadaires pour les prises de rendez-vous en ligne.</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="hours-config-table">
              {WEEKDAYS.map(day => {
                const dayState = openingHours[day.key] || { open: '09:00', close: '19:00', isOpen: true };

                return (
                  <div key={day.key} className="hour-config-row">
                    <span className="day-title">{day.label}</span>
                    
                    <div className="hour-config-inputs">
                      {dayState.isOpen ? (
                        <>
                          <input
                            type="time"
                            value={dayState.open || '09:00'}
                            onChange={(e) => handleHourTimeChange(day.key, 'open', e.target.value)}
                          />
                          <span>à</span>
                          <input
                            type="time"
                            value={dayState.close || '19:00'}
                            onChange={(e) => handleHourTimeChange(day.key, 'close', e.target.value)}
                          />
                        </>
                      ) : (
                        <span className="closed-label">Fermé toute la journée</span>
                      )}
                    </div>

                    <button
                      type="button"
                      className={`toggle-day-btn ${dayState.isOpen ? 'open' : 'closed'}`}
                      onClick={() => handleToggleDayOpen(day.key)}
                    >
                      {dayState.isOpen ? 'Ouvert' : 'Fermé'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="settings-actions-footer">
              <button type="button" className="admin-btn admin-btn-primary" onClick={handleSaveHours}>
                <Save size={16} />
                <span>Enregistrer les horaires</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Closed Dates */}
        <div className="admin-card settings-card">
          <div className="settings-card-header">
            <Calendar className="settings-section-icon" size={20} />
            <div>
              <h3>Jours de fermeture exceptionnels</h3>
              <p>Jours fériés ou fermetures temporaires où aucune réservation n'est possible.</p>
            </div>
          </div>
          <div className="settings-card-body">
            <form onSubmit={handleAddClosedDate} className="add-closed-date-form">
              <input
                type="date"
                required
                value={newClosedDate}
                onChange={(e) => setNewClosedDate(e.target.value)}
                className="date-input"
              />
              <button type="submit" className="admin-btn admin-btn-ghost">
                <Plus size={16} />
                <span>Ajouter cette date</span>
              </button>
            </form>

            <div className="closed-dates-list">
              {closedDates.map(d => (
                <div key={d} className="closed-date-badge">
                  <span>{new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' })}</span>
                  <button type="button" className="delete-badge-btn" onClick={() => handleDeleteClosedDate(d)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Booking Settings */}
        <div className="admin-card settings-card">
          <div className="settings-card-header">
            <Sliders className="settings-section-icon" size={20} />
            <div>
              <h3>Paramètres de réservation</h3>
              <p>Configurez la durée de granularité des créneaux horaires proposés aux clientes.</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="form-group" style={{ maxWidth: '320px' }}>
              <label>Durée unitaire d'un créneau</label>
              <select
                value={slotDuration}
                onChange={(e) => setSlotDuration(e.target.value)}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes (Recommandé)</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
            <div className="settings-actions-footer">
              <button type="button" className="admin-btn admin-btn-primary" onClick={handleSaveBookingSettings}>
                <Save size={16} />
                <span>Sauvegarder</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 5: Delivery & Payment */}
        <div className="admin-card settings-card">
          <div className="settings-card-header">
            <Truck className="settings-section-icon" size={20} />
            <div>
              <h3>Livraison et paiement</h3>
              <p>Frais d'expédition pour la boutique et modes de règlement activés.</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="admin-form-grid">
              <div className="form-group">
                <label>Frais de livraison standard (FCFA)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                />
              </div>

              <div className="form-group checkbox-group" style={{ marginTop: '1.8rem' }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={freePickup}
                    onChange={(e) => setFreePickup(e.target.checked)}
                  />
                  <span>Autoriser le retrait gratuit direct au salon</span>
                </label>
              </div>
            </div>

            <h4 className="sub-settings-heading">Moyens de paiement acceptés</h4>
            <div className="payment-methods-toggle-list">
              {paymentMethods.map(pm => (
                <label key={pm.id} className="payment-toggle-card">
                  <input
                    type="checkbox"
                    checked={pm.active}
                    onChange={() => handleTogglePaymentMethod(pm.id)}
                  />
                  <span>{pm.name}</span>
                </label>
              ))}
            </div>

            <div className="settings-actions-footer">
              <button type="button" className="admin-btn admin-btn-primary" onClick={handleSaveDeliveryAndPayment}>
                <Save size={16} />
                <span>Enregistrer la livraison & paiements</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 6: Promo Codes */}
        <div className="admin-card settings-card">
          <div className="settings-card-header">
            <Tag className="settings-section-icon" size={20} />
            <div>
              <h3>Codes promotionnels</h3>
              <p>Offres spéciales et réductions applicables dans le panier boutique.</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="section-header-flex">
              <span className="text-muted-sm">{promoCodes.length} code(s) actif(s)</span>
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setIsAddPromoModalOpen(true)}>
                <Plus size={15} />
                <span>Ajouter un code promo</span>
              </button>
            </div>

            <div className="table-responsive">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Réduction</th>
                    <th>Type</th>
                    <th>Montant min.</th>
                    <th>Description</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {promoCodes.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--color-gray)' }}>
                        Aucun code promotionnel actif.
                      </td>
                    </tr>
                  ) : (
                    promoCodes.map(pc => (
                      <tr key={pc.code}>
                        <td><strong className="promo-code-tag">{pc.code}</strong></td>
                        <td><strong>{pc.type === 'percentage' ? `${pc.discount}%` : `${new Intl.NumberFormat('fr-FR').format(pc.discount)} FCFA`}</strong></td>
                        <td>{pc.type === 'percentage' ? 'Pourcentage' : 'Montant fixe'}</td>
                        <td>{pc.minOrderAmount ? `${new Intl.NumberFormat('fr-FR').format(pc.minOrderAmount)} FCFA` : 'Aucun'}</td>
                        <td className="text-muted-sm">{pc.description || '-'}</td>
                        <td className="text-right">
                          <button
                            className="action-icon-btn action-delete"
                            title="Supprimer ce code"
                            onClick={() => handleDeletePromo(pc.code)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 7: Stock Alert Threshold */}
        <div className="admin-card settings-card">
          <div className="settings-card-header">
            <AlertTriangle className="settings-section-icon" size={20} />
            <div>
              <h3>Seuils d'alerte stock</h3>
              <p>Quantité minimale déclenchant les alertes de réapprovisionnement par défaut.</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="form-group" style={{ maxWidth: '320px' }}>
              <label>Seuil d'alerte par défaut (unités)</label>
              <input
                type="number"
                min="1"
                value={stockAlertThreshold}
                onChange={(e) => setStockAlertThreshold(e.target.value)}
              />
            </div>
            <div className="settings-actions-footer">
              <button type="button" className="admin-btn admin-btn-primary" onClick={handleSaveStockAlert}>
                <Save size={16} />
                <span>Enregistrer le seuil</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 8: Demo Data Reset */}
        <div className="admin-card settings-card reset-card">
          <div className="settings-card-header">
            <RefreshCw className="settings-section-icon text-danger" size={20} />
            <div>
              <h3>Données de démonstration</h3>
              <p>Remettre l'ensemble de la base de données locale à son état d'origine.</p>
            </div>
          </div>
          <div className="settings-card-body">
            <p className="reset-notice-text">
              Ceci réinitialisera toutes les données à leur état initial de démonstration (rendez-vous, commandes, stocks, clients et modifications récentes).
            </p>
            <div className="settings-actions-footer" style={{ border: 'none', padding: 0 }}>
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={() => setIsResetConfirmOpen(true)}
              >
                <RefreshCw size={16} />
                <span>Réinitialiser les données de démonstration</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: ADD PROMO CODE */}
      {isAddPromoModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content admin-modal-md">
            <div className="modal-header">
              <h3>Créer un code promotionnel</h3>
              <button className="modal-close" onClick={() => setIsAddPromoModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddPromoCode}>
              <div className="modal-body admin-form-grid">
                <div className="form-group">
                  <label>Code (ex: ETE2026) *</label>
                  <input
                    type="text"
                    required
                    style={{ textTransform: 'uppercase' }}
                    value={newPromo.code}
                    onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                    placeholder="BEAUTY20"
                  />
                </div>

                <div className="form-group">
                  <label>Type de réduction *</label>
                  <select
                    value={newPromo.type}
                    onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}
                  >
                    <option value="percentage">Pourcentage (%)</option>
                    <option value="fixed">Montant fixe (FCFA)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Valeur de la réduction *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newPromo.discount}
                    onChange={(e) => setNewPromo({ ...newPromo, discount: e.target.value })}
                    placeholder={newPromo.type === 'percentage' ? 'Ex: 15' : 'Ex: 5000'}
                  />
                </div>

                <div className="form-group">
                  <label>Montant min. d'achats (FCFA)</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={newPromo.minOrderAmount}
                    onChange={(e) => setNewPromo({ ...newPromo, minOrderAmount: e.target.value })}
                    placeholder="Ex: 20000"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description publique</label>
                  <input
                    type="text"
                    value={newPromo.description}
                    onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
                    placeholder="Ex: 15% de remise pour tout achat"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setIsAddPromoModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Créer le code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET CONFIRMATION MODAL */}
      {isResetConfirmOpen && (
        <div className="modal-backdrop">
          <div className="modal-content admin-modal-sm">
            <div className="modal-header">
              <h3>Réinitialiser les données</h3>
              <button className="modal-close" onClick={() => setIsResetConfirmOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body confirm-delete-body">
              <div className="warning-icon-wrapper">
                <AlertTriangle size={36} />
              </div>
              <p>
                Confirmez-vous la réinitialisation intégrale des données de l'application ?
              </p>
              <p className="subtext-note">
                Ceci réinitialisera toutes les données à leur état initial de démonstration.
              </p>
            </div>
            <div className="modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setIsResetConfirmOpen(false)}>
                Annuler
              </button>
              <button className="admin-btn admin-btn-danger" onClick={handleResetData}>
                Confirmer la réinitialisation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
