import { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Eye, 
  Calendar, 
  ShoppingBag, 
  Phone, 
  Mail, 
  Clock, 
  DollarSign, 
  Heart, 
  X,
  UserCheck
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import './AdminClients.css';

export default function AdminClients() {
  const { clients, appointments, orders, dispatch } = useData();
  const { success, error, warning } = useToast();

  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferences: '',
    notes: ''
  });

  const formatPrice = (val) => {
    return new Intl.NumberFormat('fr-FR').format(val || 0) + ' FCFA';
  };

  // Helper to get stats for a client
  const getClientStats = (clientId, clientEmail, clientPhone) => {
    const clientAppts = (appointments || []).filter(a => 
      a.clientId === clientId ||
      (a.clientEmail && a.clientEmail.toLowerCase() === (clientEmail || '').toLowerCase()) ||
      (a.clientPhone && a.clientPhone === clientPhone)
    );

    const clientOrders = (orders || []).filter(o => 
      o.clientId === clientId ||
      (o.shippingAddress?.email && o.shippingAddress.email.toLowerCase() === (clientEmail || '').toLowerCase()) ||
      (o.shippingAddress?.phone && o.shippingAddress.phone === clientPhone)
    );

    // Total spent (successful / completed orders)
    const totalSpent = clientOrders
      .filter(o => o.status !== 'annulee' && o.status !== 'remboursee')
      .reduce((acc, o) => acc + (o.total || 0), 0);

    return {
      appointmentsCount: clientAppts.length,
      ordersCount: clientOrders.length,
      appointments: clientAppts,
      orders: clientOrders,
      totalSpent
    };
  };

  // Filtered clients list
  const filteredClients = useMemo(() => {
    return (clients || []).filter(client => {
      const q = searchQuery.toLowerCase();
      return (
        (client.name || '').toLowerCase().includes(q) ||
        (client.phone || '').toLowerCase().includes(q) ||
        (client.email || '').toLowerCase().includes(q)
      );
    });
  }, [clients, searchQuery]);

  // Open Add modal
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      preferences: '',
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEditModal = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      phone: client.phone || '',
      email: client.email || '',
      preferences: client.preferences || '',
      notes: client.notes || ''
    });
    setIsEditModalOpen(true);
  };

  // Submit Add Client
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error('Le nom de la cliente est requis.');
      return;
    }
    if (!formData.phone.trim() && !formData.email.trim()) {
      error('Veuillez renseigner au moins un numéro de téléphone ou une adresse email.');
      return;
    }

    // Check duplicates
    const duplicate = clients?.find(c => 
      (formData.email && c.email?.toLowerCase() === formData.email.trim().toLowerCase()) ||
      (formData.phone && c.phone?.trim() === formData.phone.trim())
    );

    if (duplicate) {
      error(`Une cliente existe déjà avec ce téléphone ou cet email (${duplicate.name}).`);
      return;
    }

    dispatch({
      type: 'ADD_CLIENT',
      payload: {
        ...formData,
        lastVisit: new Date().toISOString()
      }
    });

    success(`La cliente "${formData.name}" a été ajoutée avec succès.`);
    setIsAddModalOpen(false);
  };

  // Submit Edit Client
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error('Le nom de la cliente est requis.');
      return;
    }

    // Check duplicate with OTHER clients
    const duplicate = clients?.find(c => 
      c.id !== editingClient.id && (
        (formData.email && c.email?.toLowerCase() === formData.email.trim().toLowerCase()) ||
        (formData.phone && c.phone?.trim() === formData.phone.trim())
      )
    );

    if (duplicate) {
      error(`Le numéro ou l'email est déjà utilisé par une autre cliente (${duplicate.name}).`);
      return;
    }

    dispatch({
      type: 'UPDATE_CLIENT',
      payload: {
        id: editingClient.id,
        data: formData
      }
    });

    if (selectedClient && selectedClient.id === editingClient.id) {
      setSelectedClient(prev => ({ ...prev, ...formData }));
    }

    success(`Fiche de la cliente "${formData.name}" mise à jour.`);
    setIsEditModalOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="admin-clients-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Fichier Clientes & Fidélité</h1>
          <p className="admin-page-subtitle">
            Consultez les coordonnées, l'historique de présence, les achats et les préférences personnalisées.
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>Nouvelle cliente</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="admin-card admin-filters-card">
        <div className="orders-search-wrapper" style={{ maxWidth: '450px' }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone ou email..."
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
      </div>

      {/* Clients Table */}
      <div className="admin-card admin-table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom de la cliente</th>
                <th>Téléphone</th>
                <th>Email</th>
                <th>Dernière visite</th>
                <th>Nb RDV</th>
                <th>Nb commandes</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="table-empty">
                    <Users size={40} className="empty-icon" />
                    <p>Aucune cliente enregistrée correspondant à votre recherche.</p>
                  </td>
                </tr>
              ) : (
                filteredClients.map(client => {
                  const stats = getClientStats(client.id, client.email, client.phone);

                  return (
                    <tr key={client.id}>
                      <td>
                        <strong className="client-name-bold" onClick={() => setSelectedClient(client)}>
                          {client.name}
                        </strong>
                        {client.preferences && (
                          <span className="client-pref-preview">
                            <Heart size={12} className="heart-pref" /> {client.preferences}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="contact-info-cell">
                          <Phone size={14} className="cell-icon" />
                          {client.phone || '-'}
                        </span>
                      </td>
                      <td>
                        <span className="contact-info-cell">
                          <Mail size={14} className="cell-icon" />
                          {client.email || '-'}
                        </span>
                      </td>
                      <td className="text-muted-sm">
                        {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }) : 'Jamais'}
                      </td>
                      <td>
                        <span className="count-pill appt-pill">
                          {stats.appointmentsCount} RDV
                        </span>
                      </td>
                      <td>
                        <span className="count-pill order-pill">
                          {stats.ordersCount} cmd
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="action-buttons-group">
                          <button
                            className="action-icon-btn action-view"
                            title="Consulter le profil et l'historique"
                            onClick={() => setSelectedClient(client)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="action-icon-btn action-edit"
                            title="Modifier les coordonnées"
                            onClick={() => handleOpenEditModal(client)}
                          >
                            <Edit2 size={16} />
                          </button>
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

      {/* DETAIL MODAL / PANEL */}
      {selectedClient && (() => {
        const stats = getClientStats(selectedClient.id, selectedClient.email, selectedClient.phone);

        return (
          <div className="modal-backdrop">
            <div className="modal-content admin-modal-lg">
              <div className="modal-header">
                <div className="client-modal-header-info">
                  <h3>Fiche Cliente : {selectedClient.name}</h3>
                  <span className="client-badge-vip">Fidélité active</span>
                </div>
                <button className="modal-close" onClick={() => setSelectedClient(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body client-profile-body">
                {/* Top Metrics Cards */}
                <div className="client-stats-cards">
                  <div className="stat-card">
                    <span className="stat-label">Total dépensé</span>
                    <strong className="stat-value text-gold">{formatPrice(stats.totalSpent)}</strong>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">Rendez-vous salon</span>
                    <strong className="stat-value">{stats.appointmentsCount}</strong>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">Commandes boutique</span>
                    <strong className="stat-value">{stats.ordersCount}</strong>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">Dernière visite</span>
                    <strong className="stat-value" style={{ fontSize: '0.95rem' }}>
                      {selectedClient.lastVisit ? new Date(selectedClient.lastVisit).toLocaleDateString('fr-FR') : 'N/A'}
                    </strong>
                  </div>
                </div>

                {/* Contact and Preferences */}
                <div className="client-details-grid">
                  <div className="detail-box">
                    <h4>Coordonnées</h4>
                    <div className="info-list">
                      <div className="info-row"><Phone size={15} /> <span>{selectedClient.phone || 'Non renseigné'}</span></div>
                      <div className="info-row"><Mail size={15} /> <span>{selectedClient.email || 'Non renseigné'}</span></div>
                    </div>
                  </div>

                  <div className="detail-box">
                    <h4>Préférences & Notes privées</h4>
                    <div className="pref-content">
                      <p><strong>Préférences :</strong> {selectedClient.preferences || 'Aucune préférence enregistrée'}</p>
                      {selectedClient.notes && (
                        <p className="internal-notes"><strong>Notes salon :</strong> {selectedClient.notes}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Appointment History */}
                <div className="history-section">
                  <h4>Historique des rendez-vous ({stats.appointments.length})</h4>
                  {stats.appointments.length === 0 ? (
                    <p className="no-history-sub">Aucun rendez-vous passé ou futur enregistré.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="items-table">
                        <thead>
                          <tr>
                            <th>Réf.</th>
                            <th>Date & Heure</th>
                            <th>Prestation</th>
                            <th>Professionnel</th>
                            <th>Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.appointments.map(a => (
                            <tr key={a.id}>
                              <td><strong>{a.reference || `RDV-${a.id}`}</strong></td>
                              <td>{a.date} à {a.startTime}</td>
                              <td>{a.serviceName || `Service #${a.serviceId}`}</td>
                              <td>{a.professionalName || `Spécialiste #${a.professionalId}`}</td>
                              <td>
                                <span className={`stock-badge ${a.status === 'confirmed' ? 'badge-success' : a.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                                  {a.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Order History */}
                <div className="history-section">
                  <h4>Historique des commandes ({stats.orders.length})</h4>
                  {stats.orders.length === 0 ? (
                    <p className="no-history-sub">Aucune commande boutique enregistrée.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="items-table">
                        <thead>
                          <tr>
                            <th>Réf.</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Paiement</th>
                            <th>Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.orders.map(o => (
                            <tr key={o.id}>
                              <td><strong>{o.reference}</strong></td>
                              <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('fr-FR') : '-'}</td>
                              <td><strong>{formatPrice(o.total)}</strong></td>
                              <td>{o.paymentMethod}</td>
                              <td>
                                <span className="status-pill status-paid">{o.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="admin-btn admin-btn-primary"
                  onClick={() => {
                    const c = selectedClient;
                    setSelectedClient(null);
                    handleOpenEditModal(c);
                  }}
                >
                  <Edit2 size={16} />
                  Modifier la fiche
                </button>
                <button className="admin-btn admin-btn-ghost" onClick={() => setSelectedClient(null)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content admin-modal-md">
            <div className="modal-header">
              <h3>Ajouter une nouvelle cliente</h3>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body admin-form-grid">
                <div className="form-group full-width">
                  <label>Nom et Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Awa Diop"
                  />
                </div>

                <div className="form-group">
                  <label>Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+225 07..."
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="awa.diop@example.com"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Préférences esthétiques / Soins</label>
                  <textarea
                    rows={2}
                    value={formData.preferences}
                    onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                    placeholder="Ex: Teinte caramel préférée, cuir chevelu sensible, thé à la menthe..."
                  />
                </div>

                <div className="form-group full-width">
                  <label>Notes internes du salon</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Remarques spécifiques de l'équipe..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setIsAddModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Enregistrer la cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content admin-modal-md">
            <div className="modal-header">
              <h3>Modifier les coordonnées de {editingClient?.name}</h3>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body admin-form-grid">
                <div className="form-group full-width">
                  <label>Nom et Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Préférences esthétiques</label>
                  <textarea
                    rows={2}
                    value={formData.preferences}
                    onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Notes internes</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setIsEditModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Sauvegarder les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
