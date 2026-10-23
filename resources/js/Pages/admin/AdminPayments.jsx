import { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Eye, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  X,
  FileText,
  User,
  ShoppingBag,
  Info
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import './AdminPayments.css';

const PAYMENT_METHODS = {
  card: 'Carte bancaire',
  mobile_money: 'Mobile Money',
  cash: 'Espèces'
};

const STATUS_CONFIG = {
  success: { label: 'Réussi', class: 'status-success', icon: CheckCircle },
  failed: { label: 'Échoué', class: 'status-failed', icon: XCircle },
  pending: { label: 'En attente', class: 'status-pending', icon: Clock },
  refunded: { label: 'Remboursé', class: 'status-refunded', icon: RotateCcw }
};

export default function AdminPayments() {
  const { transactions, orders, clients, dispatch } = useData();
  const { success, error, warning } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  // Modals
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [txnToRefund, setTxnToRefund] = useState(null);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('fr-FR').format(val || 0) + ' FCFA';
  };

  // Helper to get order and client from transaction
  const getTransactionContext = (txn) => {
    const order = orders?.find(o => o.reference === txn.orderReference || o.id === txn.orderId);
    let clientName = 'Inconnue';
    let clientPhone = '-';
    let clientEmail = '-';

    if (order) {
      const client = clients?.find(c => c.id === order.clientId);
      if (client) {
        clientName = client.name;
        clientPhone = client.phone;
        clientEmail = client.email;
      } else if (order.shippingAddress?.fullName) {
        clientName = order.shippingAddress.fullName;
        clientPhone = order.shippingAddress.phone || '-';
        clientEmail = order.shippingAddress.email || '-';
      }
    } else if (txn.clientId) {
      const client = clients?.find(c => c.id === txn.clientId);
      if (client) {
        clientName = client.name;
        clientPhone = client.phone;
        clientEmail = client.email;
      }
    }

    return { order, clientName, clientPhone, clientEmail };
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return (transactions || []).filter(txn => {
      const { order, clientName } = getTransactionContext(txn);

      const matchesSearch = 
        (txn.reference || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (txn.orderReference || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        clientName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
      const matchesMethod = methodFilter === 'all' || txn.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    }).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [transactions, orders, clients, searchQuery, statusFilter, methodFilter]);

  // Handle Refund Confirmation
  const handleOpenRefundModal = (txn) => {
    if (txn.status !== 'success') {
      error("Seule une transaction réussie peut faire l'objet d'un remboursement.");
      return;
    }
    setTxnToRefund(txn);
  };

  const handleConfirmRefund = () => {
    if (!txnToRefund) return;

    // 1. Update Transaction to 'refunded'
    dispatch({
      type: 'UPDATE_TRANSACTION',
      payload: {
        id: txnToRefund.id,
        data: { status: 'refunded', refundedAt: new Date().toISOString() }
      }
    });

    // 2. Update linked order to 'remboursee' if exists
    const order = orders?.find(o => o.reference === txnToRefund.orderReference || o.id === txnToRefund.orderId);
    if (order) {
      dispatch({
        type: 'UPDATE_ORDER',
        payload: {
          id: order.id,
          data: {
            status: 'remboursee',
            paymentStatus: 'refunded'
          }
        }
      });
    }

    success(`Remboursement simulé avec succès pour la transaction ${txnToRefund.reference}.`);
    
    if (selectedTxn && selectedTxn.id === txnToRefund.id) {
      setSelectedTxn(prev => ({ ...prev, status: 'refunded' }));
    }

    setTxnToRefund(null);
  };

  return (
    <div className="admin-payments-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Paiements & Transactions</h1>
          <p className="admin-page-subtitle">
            Suivi des flux financiers, validation des encaissements et remboursements clients.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card admin-filters-card">
        <div className="orders-search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par référence TXN, CMD ou nom cliente..."
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
            <option value="all">Tous les statuts</option>
            <option value="success">Réussi</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoué</option>
            <option value="refunded">Remboursé</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les modes de paiement</option>
            <option value="card">Carte bancaire</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="cash">Espèces</option>
          </select>

          {(statusFilter !== 'all' || methodFilter !== 'all' || searchQuery) && (
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setStatusFilter('all');
                setMethodFilter('all');
                setSearchQuery('');
              }}
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="admin-card admin-table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Réf. TXN</th>
                <th>Réf. CMD</th>
                <th>Date</th>
                <th>Cliente</th>
                <th>Montant</th>
                <th>Méthode</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="table-empty">
                    <CreditCard size={40} className="empty-icon" />
                    <p>Aucune transaction ne correspond à vos critères.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(txn => {
                  const { order, clientName } = getTransactionContext(txn);
                  const statusObj = STATUS_CONFIG[txn.status] || { label: txn.status, class: 'status-pending' };
                  const isRefundable = txn.status === 'success';

                  return (
                    <tr key={txn.id}>
                      <td>
                        <strong className="txn-ref-code" onClick={() => setSelectedTxn(txn)}>
                          {txn.reference}
                        </strong>
                      </td>
                      <td>
                        <span className="order-ref-badge">
                          {txn.orderReference || (order ? order.reference : '-')}
                        </span>
                      </td>
                      <td className="text-muted-sm">
                        {txn.date ? new Date(txn.date).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '-'}
                      </td>
                      <td>
                        <span className="client-name">{clientName}</span>
                      </td>
                      <td className="txn-amount">
                        {formatPrice(txn.amount)}
                      </td>
                      <td>
                        <span className="payment-pill">
                          {PAYMENT_METHODS[txn.method] || txn.method}
                        </span>
                      </td>
                      <td>
                        <span className={`txn-status-badge ${statusObj.class}`}>
                          {statusObj.label}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="action-buttons-group">
                          <button
                            className="action-icon-btn action-view"
                            title="Voir les détails complets"
                            onClick={() => setSelectedTxn(txn)}
                          >
                            <Eye size={16} />
                          </button>
                          {isRefundable && (
                            <button
                              className="action-icon-btn action-refund"
                              title="Simuler un remboursement"
                              onClick={() => handleOpenRefundModal(txn)}
                            >
                              <RotateCcw size={16} />
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
      {selectedTxn && (() => {
        const { order, clientName, clientPhone, clientEmail } = getTransactionContext(selectedTxn);
        const statusObj = STATUS_CONFIG[selectedTxn.status] || { label: selectedTxn.status, class: 'status-pending' };

        return (
          <div className="modal-backdrop">
            <div className="modal-content admin-modal-md">
              <div className="modal-header">
                <div className="order-modal-header-info">
                  <h3>Transaction {selectedTxn.reference}</h3>
                  <span className={`txn-status-badge ${statusObj.class}`}>
                    {statusObj.label}
                  </span>
                </div>
                <button className="modal-close" onClick={() => setSelectedTxn(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body txn-detail-body">
                {/* Simulation note alert */}
                <div className="simulation-banner">
                  <Info size={18} />
                  <span>Ceci est un environnement de démonstration pour le salon Glam'Or Beauty.</span>
                </div>

                <div className="detail-section">
                  <h4>Détails financiers</h4>
                  <div className="info-grid-2">
                    <div className="info-item">
                      <span className="label">Montant :</span>
                      <strong className="value-highlight">{formatPrice(selectedTxn.amount)}</strong>
                    </div>
                    <div className="info-item">
                      <span className="label">Mode de règlement :</span>
                      <span>{PAYMENT_METHODS[selectedTxn.method] || selectedTxn.method}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Date de transaction :</span>
                      <span>{new Date(selectedTxn.date).toLocaleString('fr-FR')}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Identifiant externe :</span>
                      <span>{selectedTxn.gatewayReference || selectedTxn.reference}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Cliente liée</h4>
                  <div className="info-grid-2">
                    <div className="info-item">
                      <span className="label">Nom :</span>
                      <span>{clientName}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Téléphone :</span>
                      <span>{clientPhone}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Email :</span>
                      <span>{clientEmail}</span>
                    </div>
                  </div>
                </div>

                {order && (
                  <div className="detail-section">
                    <h4>Commande associée ({order.reference})</h4>
                    <div className="linked-order-box">
                      <div className="linked-row">
                        <span>Statut commande :</span>
                        <strong>{order.status}</strong>
                      </div>
                      <div className="linked-row">
                        <span>Articles ({order.items?.length || 0}) :</span>
                        <span>{order.items?.map(i => i.name).join(', ') || 'N/A'}</span>
                      </div>
                      <div className="linked-row">
                        <span>Total commande :</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                {selectedTxn.status === 'success' && (
                  <button 
                    className="admin-btn admin-btn-danger"
                    onClick={() => {
                      const t = selectedTxn;
                      setSelectedTxn(null);
                      handleOpenRefundModal(t);
                    }}
                  >
                    <RotateCcw size={16} />
                    Simuler un remboursement
                  </button>
                )}
                <button className="admin-btn admin-btn-ghost" onClick={() => setSelectedTxn(null)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* REFUND CONFIRMATION MODAL */}
      {txnToRefund && (
        <div className="modal-backdrop">
          <div className="modal-content admin-modal-sm">
            <div className="modal-header">
              <h3>Confirmer le remboursement</h3>
              <button className="modal-close" onClick={() => setTxnToRefund(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body confirm-delete-body">
              <div className="refund-icon-wrapper">
                <RotateCcw size={36} />
              </div>
              <p>
                Êtes-vous sûr de vouloir procéder au remboursement de la transaction <strong>{txnToRefund.reference}</strong> d'un montant de <strong>{formatPrice(txnToRefund.amount)}</strong> ?
              </p>
              <div className="demo-notice-box">
                <p>Note : Ceci est une simulation. Aucun remboursement réel n'a été effectué sur un compte bancaire ou compte Mobile Money.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setTxnToRefund(null)}>
                Annuler
              </button>
              <button className="admin-btn admin-btn-danger" onClick={handleConfirmRefund}>
                Confirmer le remboursement (Simulation)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
