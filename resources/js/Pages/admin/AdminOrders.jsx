import { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  PackageCheck, 
  XCircle, 
  RotateCcw, 
  X, 
  CreditCard, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import './AdminOrders.css';

const ORDER_STATUSES = [
  { id: 'all', label: 'Tous les statuts' },
  { id: 'en_attente_paiement', label: 'En attente paiement' },
  { id: 'payee', label: 'Payée' },
  { id: 'en_preparation', label: 'En préparation' },
  { id: 'expediee', label: 'Expédiée' },
  { id: 'terminee', label: 'Terminée' },
  { id: 'annulee', label: 'Annulée' },
  { id: 'remboursee', label: 'Remboursée' }
];

const STATUS_LABELS = {
  en_attente_paiement: { label: 'En attente paiement', class: 'status-pending' },
  payee: { label: 'Payée', class: 'status-paid' },
  en_preparation: { label: 'En préparation', class: 'status-preparing' },
  expediee: { label: 'Expédiée', class: 'status-shipped' },
  terminee: { label: 'Terminée / Livrée', class: 'status-completed' },
  annulee: { label: 'Annulée', class: 'status-cancelled' },
  remboursee: { label: 'Remboursée', class: 'status-refunded' }
};

const PAYMENT_LABELS = {
  card: 'Carte bancaire',
  mobile_money: 'Mobile Money',
  cash: 'Espèces'
};

export default function AdminOrders() {
  const { orders, clients, dispatch } = useData();
  const { success, error, warning } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Cancel Confirmation Modal
  const [orderToCancel, setOrderToCancel] = useState(null);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return (orders || []).filter(order => {
      // Find client name
      const client = clients?.find(c => c.id === order.clientId);
      const clientName = client?.name || order.shippingAddress?.fullName || '';

      const matchesSearch = 
        (order.reference || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        clientName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || order.paymentMethod === paymentFilter;

      let matchesDate = true;
      if (dateFilter && order.createdAt) {
        matchesDate = order.createdAt.startsWith(dateFilter);
      }

      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [orders, clients, searchQuery, statusFilter, paymentFilter, dateFilter]);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('fr-FR').format(val || 0) + ' FCFA';
  };

  const getClientInfo = (clientId, shippingAddress) => {
    const client = clients?.find(c => c.id === clientId);
    if (client) return client;
    return {
      name: shippingAddress?.fullName || 'Cliente inconnue',
      phone: shippingAddress?.phone || 'Non renseigné',
      email: shippingAddress?.email || 'Non renseigné'
    };
  };

  // Validate and change status
  const handleStatusChange = (order, newStatus) => {
    const current = order.status;

    // Rules verification
    if (newStatus === 'payee' && order.paymentStatus !== 'paid' && order.paymentStatus !== 'success') {
      error("Impossible de marquer comme payée : le paiement n'a pas été validé.");
      return;
    }

    if (newStatus === 'expediee' && current !== 'en_preparation') {
      error("La commande doit être d'abord « En préparation » avant de pouvoir être expédiée.");
      return;
    }

    if (newStatus === 'terminee' && current !== 'expediee' && current !== 'en_preparation') {
      error("La commande doit être expédiée ou en préparation avant d'être terminée.");
      return;
    }

    if (newStatus === 'remboursee' && current !== 'terminee' && current !== 'payee') {
      error("Seule une commande payée ou terminée peut être remboursée.");
      return;
    }

    if (newStatus === 'annulee' && current === 'terminee') {
      error("Une commande terminée ne peut plus être annulée. Effectuez plutôt un remboursement.");
      return;
    }

    dispatch({
      type: 'UPDATE_ORDER',
      payload: {
        id: order.id,
        data: {
          status: newStatus,
          paymentStatus: newStatus === 'remboursee' ? 'refunded' : order.paymentStatus
        }
      }
    });

    if (selectedOrder && selectedOrder.id === order.id) {
      setSelectedOrder(prev => ({
        ...prev,
        status: newStatus,
        paymentStatus: newStatus === 'remboursee' ? 'refunded' : prev.paymentStatus
      }));
    }

    success(`Statut de la commande ${order.reference} mis à jour : ${STATUS_LABELS[newStatus]?.label || newStatus}.`);
  };

  const handleCancelClick = (order) => {
    if (order.status === 'terminee') {
      error("Impossible d'annuler une commande déjà livrée et terminée.");
      return;
    }
    setOrderToCancel(order);
  };

  const handleConfirmCancel = () => {
    if (orderToCancel) {
      dispatch({
        type: 'UPDATE_ORDER',
        payload: {
          id: orderToCancel.id,
          data: { status: 'annulee' }
        }
      });
      if (selectedOrder && selectedOrder.id === orderToCancel.id) {
        setSelectedOrder(prev => ({ ...prev, status: 'annulee' }));
      }
      success(`La commande ${orderToCancel.reference} a été annulée.`);
      setOrderToCancel(null);
    }
  };

  return (
    <div className="admin-orders-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Gestion des Commandes</h1>
          <p className="admin-page-subtitle">
            Suivez les commandes boutique, l'expédition des colis et la conformité des paiements.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-card admin-filters-card">
        <div className="orders-search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par référence (CMD-...) ou cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="orders-select-filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            {ORDER_STATUSES.map(st => (
              <option key={st.id} value={st.id}>{st.label}</option>
            ))}
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les modes de paiement</option>
            <option value="card">Carte bancaire</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="cash">Espèces</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-date-input"
            title="Filtrer par date"
          />

          {(statusFilter !== 'all' || paymentFilter !== 'all' || dateFilter || searchQuery) && (
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setStatusFilter('all');
                setPaymentFilter('all');
                setDateFilter('');
                setSearchQuery('');
              }}
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card admin-table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Date</th>
                <th>Cliente</th>
                <th>Articles</th>
                <th>Total</th>
                <th>Livraison</th>
                <th>Paiement</th>
                <th>Statut cmd</th>
                <th>Statut paiem.</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="10" className="table-empty">
                    <ShoppingBag size={40} className="empty-icon" />
                    <p>Aucune commande ne correspond aux filtres sélectionnés.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const client = getClientInfo(order.clientId, order.shippingAddress);
                  const itemCount = (order.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0);
                  const statusInfo = STATUS_LABELS[order.status] || { label: order.status, class: 'status-pending' };
                  
                  const isPaid = order.paymentStatus === 'paid' || order.paymentStatus === 'success';
                  const paymentBadgeClass = isPaid ? 'badge-success' : order.paymentStatus === 'refunded' ? 'badge-info' : 'badge-warning';

                  return (
                    <tr key={order.id}>
                      <td>
                        <strong className="order-ref-link" onClick={() => setSelectedOrder(order)}>
                          {order.reference}
                        </strong>
                      </td>
                      <td className="text-muted-sm">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }) : '-'}
                      </td>
                      <td>
                        <div className="client-cell">
                          <span className="client-name">{client.name}</span>
                          <span className="client-phone-sub">{client.phone}</span>
                        </div>
                      </td>
                      <td>
                        <span className="items-badge">
                          {itemCount} {itemCount > 1 ? 'articles' : 'article'}
                        </span>
                      </td>
                      <td className="order-total">{formatPrice(order.total)}</td>
                      <td>
                        <span className="shipping-type-pill">
                          {order.shippingMethod === 'pickup' ? 'Retrait salon' : 'Livraison express'}
                        </span>
                      </td>
                      <td>
                        <span className="payment-method-text">
                          {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${statusInfo.class}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>
                        <span className={`stock-badge ${paymentBadgeClass}`}>
                          {isPaid ? 'Payé' : order.paymentStatus === 'refunded' ? 'Remboursé' : 'En attente'}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="action-buttons-group">
                          <button
                            className="action-icon-btn action-view"
                            title="Voir le détail et gérer"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye size={16} />
                          </button>
                          {order.status !== 'annulee' && order.status !== 'terminee' && (
                            <button
                              className="action-icon-btn action-delete"
                              title="Annuler la commande"
                              onClick={() => handleCancelClick(order)}
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-content admin-modal-lg">
            <div className="modal-header">
              <div className="order-modal-header-info">
                <h3>Commande {selectedOrder.reference}</h3>
                <span className={`status-pill ${STATUS_LABELS[selectedOrder.status]?.class || 'status-pending'}`}>
                  {STATUS_LABELS[selectedOrder.status]?.label || selectedOrder.status}
                </span>
              </div>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body order-detail-body">
              {/* Order Status Timeline / Stepper */}
              <div className="order-timeline-card">
                <span className="timeline-title">Progression de la commande :</span>
                <div className="order-steps-container">
                  <div className={`step-item ${['en_attente_paiement', 'payee', 'en_preparation', 'expediee', 'terminee'].includes(selectedOrder.status) ? 'completed' : ''}`}>
                    <div className="step-circle"><Clock size={14} /></div>
                    <span>Créée</span>
                  </div>
                  <div className={`step-line ${['payee', 'en_preparation', 'expediee', 'terminee'].includes(selectedOrder.status) ? 'completed' : ''}`} />
                  
                  <div className={`step-item ${['payee', 'en_preparation', 'expediee', 'terminee'].includes(selectedOrder.status) ? 'completed' : ''}`}>
                    <div className="step-circle"><CreditCard size={14} /></div>
                    <span>Payée</span>
                  </div>
                  <div className={`step-line ${['en_preparation', 'expediee', 'terminee'].includes(selectedOrder.status) ? 'completed' : ''}`} />

                  <div className={`step-item ${['en_preparation', 'expediee', 'terminee'].includes(selectedOrder.status) ? 'completed' : ''}`}>
                    <div className="step-circle"><PackageCheck size={14} /></div>
                    <span>Préparation</span>
                  </div>
                  <div className={`step-line ${['expediee', 'terminee'].includes(selectedOrder.status) ? 'completed' : ''}`} />

                  <div className={`step-item ${['expediee', 'terminee'].includes(selectedOrder.status) ? 'completed' : ''}`}>
                    <div className="step-circle"><Truck size={14} /></div>
                    <span>Expédiée</span>
                  </div>
                  <div className={`step-line ${selectedOrder.status === 'terminee' ? 'completed' : ''}`} />

                  <div className={`step-item ${selectedOrder.status === 'terminee' ? 'completed' : ''}`}>
                    <div className="step-circle"><CheckCircle2 size={14} /></div>
                    <span>Terminée</span>
                  </div>
                </div>

                {/* Transition Action Buttons */}
                <div className="timeline-actions-bar">
                  <span className="actions-label">Changer le statut :</span>
                  {selectedOrder.status === 'en_attente_paiement' && (
                    <button 
                      className="admin-btn admin-btn-sm admin-btn-primary"
                      onClick={() => handleStatusChange(selectedOrder, 'payee')}
                    >
                      Valider le paiement (Payée)
                    </button>
                  )}
                  {selectedOrder.status === 'payee' && (
                    <button 
                      className="admin-btn admin-btn-sm admin-btn-primary"
                      onClick={() => handleStatusChange(selectedOrder, 'en_preparation')}
                    >
                      Passer en préparation
                    </button>
                  )}
                  {selectedOrder.status === 'en_preparation' && (
                    <button 
                      className="admin-btn admin-btn-sm admin-btn-primary"
                      onClick={() => handleStatusChange(selectedOrder, 'expediee')}
                    >
                      Marquer comme expédiée
                    </button>
                  )}
                  {selectedOrder.status === 'expediee' && (
                    <button 
                      className="admin-btn admin-btn-sm admin-btn-primary"
                      onClick={() => handleStatusChange(selectedOrder, 'terminee')}
                    >
                      Confirmer la livraison (Terminée)
                    </button>
                  )}
                  {selectedOrder.status === 'terminee' && (
                    <button 
                      className="admin-btn admin-btn-sm admin-btn-ghost"
                      onClick={() => handleStatusChange(selectedOrder, 'remboursee')}
                    >
                      <RotateCcw size={14} />
                      Simuler un remboursement
                    </button>
                  )}
                  {selectedOrder.status !== 'annulee' && selectedOrder.status !== 'terminee' && (
                    <button 
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => handleCancelClick(selectedOrder)}
                    >
                      Annuler la commande
                    </button>
                  )}
                </div>
              </div>

              {/* Two columns: Client & Shipping info */}
              <div className="order-details-grid">
                <div className="detail-box">
                  <h4>Informations cliente</h4>
                  {(() => {
                    const c = getClientInfo(selectedOrder.clientId, selectedOrder.shippingAddress);
                    return (
                      <div className="info-list">
                        <div className="info-row"><User size={15} /> <span>{c.name}</span></div>
                        <div className="info-row"><Phone size={15} /> <span>{c.phone}</span></div>
                        <div className="info-row"><Mail size={15} /> <span>{c.email}</span></div>
                      </div>
                    );
                  })()}
                </div>

                <div className="detail-box">
                  <h4>Livraison & Paiement</h4>
                  <div className="info-list">
                    <div className="info-row">
                      <Truck size={15} />
                      <span>{selectedOrder.shippingMethod === 'pickup' ? 'Retrait gratuit au salon' : 'Livraison à domicile'}</span>
                    </div>
                    {selectedOrder.shippingAddress && (
                      <div className="info-row">
                        <MapPin size={15} />
                        <span>
                          {selectedOrder.shippingAddress.address || 'Abidjan'}, {selectedOrder.shippingAddress.city || 'Côte d\'Ivoire'}
                        </span>
                      </div>
                    )}
                    <div className="info-row">
                      <CreditCard size={15} />
                      <span>
                        {PAYMENT_LABELS[selectedOrder.paymentMethod] || selectedOrder.paymentMethod} • Statut : <strong>{selectedOrder.paymentStatus}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="order-items-section">
                <h4>Articles commandés</h4>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Prix unitaire</th>
                      <th>Quantité</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedOrder.items || []).map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="item-name-cell">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="item-mini-thumb" />
                            )}
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td>{formatPrice(item.price)}</td>
                        <td>{item.quantity}</td>
                        <td className="text-right">{formatPrice(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation */}
              <div className="order-totals-summary">
                <div className="totals-row">
                  <span>Sous-total :</span>
                  <span>{formatPrice(selectedOrder.subtotal || selectedOrder.total)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="totals-row text-success">
                    <span>Remise promotionnelle :</span>
                    <span>-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="totals-row">
                  <span>Frais de livraison :</span>
                  <span>{selectedOrder.shippingFee ? formatPrice(selectedOrder.shippingFee) : 'Gratuit'}</span>
                </div>
                <div className="totals-row grand-total">
                  <span>Total payé / dû :</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setSelectedOrder(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM CANCEL MODAL */}
      {orderToCancel && (
        <div className="modal-backdrop">
          <div className="modal-content admin-modal-sm">
            <div className="modal-header">
              <h3>Annuler la commande</h3>
              <button className="modal-close" onClick={() => setOrderToCancel(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body confirm-delete-body">
              <div className="warning-icon-wrapper">
                <AlertTriangle size={36} />
              </div>
              <p>
                Confirmez-vous l'annulation de la commande <strong>{orderToCancel.reference}</strong> ?
              </p>
              <p className="subtext-note">
                Le statut passera en « Annulée ».
              </p>
            </div>
            <div className="modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setOrderToCancel(null)}>
                Retour
              </button>
              <button className="admin-btn admin-btn-danger" onClick={handleConfirmCancel}>
                Confirmer l'annulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
