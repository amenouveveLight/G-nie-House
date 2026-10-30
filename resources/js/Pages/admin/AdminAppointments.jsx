import { useState, useMemo } from 'react';
import { useData } from '../../Contexts/DataContext';
import { useToast } from '../../Contexts/ToastContext';
import {
  Calendar as CalendarIcon,
  List,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Scissors,
  DollarSign,
  AlertTriangle,
  X,
  Check
} from 'lucide-react';
import './AdminAppointments.css';

const formatFCFA = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount || 0) + ' FCFA';
};

const calculateEndTime = (startTime, durationMinutes = 45) => {
  if (!startTime) return '11:00';
  const [h, m] = startTime.split(':').map(Number);
  const total = h * 60 + m + Number(durationMinutes);
  const endH = Math.floor(total / 60) % 24;
  const endM = total % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
};

export default function AdminAppointments() {
  const {
    appointments = [],
    services = [],
    professionals = [],
    clients = [],
    dispatch,
    isSlotAvailable,
    findOrCreateClient,
  } = useData();

  const { success, error, warning } = useToast();

  // View state: 'list' | 'calendar'
  const [viewMode, setViewMode] = useState('list');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Calendar State (year and month 0-indexed)
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(2026, 9, 1)); // Oct 2026

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Form states for Create/Edit
  const [formData, setFormData] = useState({
    clientId: '',
    isNewClient: false,
    newClientName: '',
    newClientPhone: '',
    newClientEmail: '',
    serviceId: '',
    professionalId: '',
    date: '2026-10-15',
    startTime: '10:00',
    notes: '',
    status: 'confirmed',
  });

  // Lookup maps
  const clientMap = useMemo(() => {
    const map = {};
    clients.forEach((c) => { map[c.id] = c; });
    return map;
  }, [clients]);

  const serviceMap = useMemo(() => {
    const map = {};
    services.forEach((s) => { map[s.id] = s; });
    return map;
  }, [services]);

  const professionalMap = useMemo(() => {
    const map = {};
    professionals.forEach((p) => { map[p.id] = p; });
    return map;
  }, [professionals]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const client = clientMap[apt.clientId];
      const clientName = client?.name?.toLowerCase() || '';
      const ref = apt.reference?.toLowerCase() || '';
      const query = searchQuery.toLowerCase().trim();

      if (query && !clientName.includes(query) && !ref.includes(query)) {
        return false;
      }
      if (selectedProfessional && String(apt.professionalId) !== String(selectedProfessional)) {
        return false;
      }
      if (selectedService && String(apt.serviceId) !== String(selectedService)) {
        return false;
      }
      if (selectedStatus && apt.status !== selectedStatus) {
        return false;
      }
      if (selectedDate && apt.date !== selectedDate) {
        return false;
      }
      return true;
    }).sort((a, b) => new Date(`${b.date}T${b.startTime || '00:00'}`) - new Date(`${a.date}T${a.startTime || '00:00'}`));
  }, [appointments, clientMap, searchQuery, selectedProfessional, selectedService, selectedStatus, selectedDate]);

  // Paginated List
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage) || 1;
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAppointments.slice(start, start + itemsPerPage);
  }, [filteredAppointments, currentPage]);

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge badge-info"><Clock size={12} /> Confirmé</span>;
      case 'completed':
        return <span className="badge badge-success"><CheckCircle2 size={12} /> Terminé</span>;
      case 'pending':
        return <span className="badge badge-warning"><AlertCircle size={12} /> En attente</span>;
      case 'cancelled':
        return <span className="badge badge-error"><XCircle size={12} /> Annulé</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  // Status Change directly from quick action
  const handleQuickStatusChange = (appointment, newStatus) => {
    dispatch({
      type: 'UPDATE_APPOINTMENT',
      payload: {
        id: appointment.id,
        data: { status: newStatus }
      }
    });
    success(`Statut du rendez-vous mis à jour en "${newStatus}".`);
  };

  // Open Create Modal
  const handleOpenCreateModal = (defaultDate = '2026-10-15') => {
    const firstService = services[0];
    const firstProf = professionals[0];
    setFormData({
      clientId: clients[0]?.id || '',
      isNewClient: false,
      newClientName: '',
      newClientPhone: '',
      newClientEmail: '',
      serviceId: firstService?.id || '',
      professionalId: firstProf?.id || '',
      date: defaultDate,
      startTime: '10:00',
      notes: '',
      status: 'confirmed',
    });
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (apt) => {
    setSelectedAppointment(apt);
    setFormData({
      clientId: apt.clientId,
      isNewClient: false,
      newClientName: '',
      newClientPhone: '',
      newClientEmail: '',
      serviceId: apt.serviceId,
      professionalId: apt.professionalId,
      date: apt.date,
      startTime: apt.startTime,
      notes: apt.notes || '',
      status: apt.status,
    });
    setIsEditModalOpen(true);
  };

  // Open Detail Modal
  const handleOpenDetailModal = (apt) => {
    setSelectedAppointment(apt);
    setIsDetailModalOpen(true);
  };

  // Open Cancel Dialog
  const handleOpenCancelDialog = (apt) => {
    setSelectedAppointment(apt);
    setIsCancelConfirmOpen(true);
  };

  // Submit Create Appointment
  const handleCreateSubmit = (e) => {
    e.preventDefault();

    let finalClientId = formData.clientId;
    if (formData.isNewClient) {
      if (!formData.newClientName.trim() || !formData.newClientPhone.trim()) {
        error('Veuillez renseigner le nom et le numéro de téléphone de la cliente.');
        return;
      }
      const newClient = findOrCreateClient({
        name: formData.newClientName.trim(),
        phone: formData.newClientPhone.trim(),
        email: formData.newClientEmail.trim() || `${formData.newClientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      });
      finalClientId = newClient.id;
    }

    const srv = serviceMap[formData.serviceId];
    const duration = srv ? srv.duration : 45;
    const computedEnd = calculateEndTime(formData.startTime, duration);

    // Validate slot availability
    const available = isSlotAvailable(
      Number(formData.professionalId),
      formData.date,
      formData.startTime,
      computedEnd
    );

    if (!available) {
      warning('Ce créneau horaire est déjà occupé pour cette professionnelle. Veuillez choisir une autre heure.');
      return;
    }

    dispatch({
      type: 'ADD_APPOINTMENT',
      payload: {
        clientId: Number(finalClientId),
        serviceId: Number(formData.serviceId),
        professionalId: Number(formData.professionalId),
        date: formData.date,
        startTime: formData.startTime,
        endTime: computedEnd,
        price: srv?.price || 0,
        status: formData.status,
        notes: formData.notes,
      }
    });

    success('Le rendez-vous a été enregistré avec succès !');
    setIsCreateModalOpen(false);
  };

  // Submit Edit Appointment
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    const srv = serviceMap[formData.serviceId];
    const duration = srv ? srv.duration : 45;
    const computedEnd = calculateEndTime(formData.startTime, duration);

    // Check slot availability (excluding current appointment id)
    const available = isSlotAvailable(
      Number(formData.professionalId),
      formData.date,
      formData.startTime,
      computedEnd,
      selectedAppointment.id
    );

    if (!available) {
      warning('Le créneau est en conflit avec un autre rendez-vous existant.');
      return;
    }

    dispatch({
      type: 'UPDATE_APPOINTMENT',
      payload: {
        id: selectedAppointment.id,
        data: {
          clientId: Number(formData.clientId),
          serviceId: Number(formData.serviceId),
          professionalId: Number(formData.professionalId),
          date: formData.date,
          startTime: formData.startTime,
          endTime: computedEnd,
          price: srv?.price || selectedAppointment.price,
          status: formData.status,
          notes: formData.notes,
        }
      }
    });

    success('Le rendez-vous a été mis à jour.');
    setIsEditModalOpen(false);
  };

  // Confirm Cancel
  const handleConfirmCancel = () => {
    if (!selectedAppointment) return;
    dispatch({
      type: 'CANCEL_APPOINTMENT',
      payload: selectedAppointment.id,
    });
    success(`Le rendez-vous ${selectedAppointment.reference} a été annulé.`);
    setIsCancelConfirmOpen(false);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedProfessional('');
    setSelectedService('');
    setSelectedStatus('');
    setSelectedDate('');
    setCurrentPage(1);
  };

  // Calendar Helpers
  const calendarDays = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sun
    const adjustedFirstDay = (firstDay + 6) % 7; // 0 is Mon
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push({ dayNumber: null, isCurrentMonth: false, dateStr: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}`;
      days.push({ dayNumber: d, isCurrentMonth: true, dateStr });
    }
    return days;
  }, [currentCalendarDate]);

  const appointmentsByDate = useMemo(() => {
    const map = {};
    appointments.forEach((apt) => {
      if (!map[apt.date]) map[apt.date] = [];
      map[apt.date].push(apt);
    });
    return map;
  }, [appointments]);

  return (
    <div className="admin-appointments-page">
      {/* Top Header & Actions */}
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Gestion des Rendez-vous</h2>
          <p className="page-subtitle">
            Planifiez, modifiez et suivez toutes les réservations en temps réel.
          </p>
        </div>

        <div className="header-actions">
          {/* View Mode Toggle */}
          <div className="view-mode-toggle">
            <button
              type="button"
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
              <span>Liste</span>
            </button>
            <button
              type="button"
              className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              <CalendarIcon size={16} />
              <span>Calendrier</span>
            </button>
          </div>

          {/* New Appointment Button */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleOpenCreateModal()}
          >
            <Plus size={18} />
            <span>Nouveau rendez-vous</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters-card">
        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par cliente ou référence..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="filter-selects-row">
          <select
            value={selectedProfessional}
            onChange={(e) => {
              setSelectedProfessional(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Toutes les praticiennes</option>
            {professionals.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Toutes les prestations</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Tous les statuts</option>
            <option value="confirmed">Confirmé</option>
            <option value="pending">En attente</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setCurrentPage(1);
            }}
            className="date-filter-input"
          />

          {(searchQuery || selectedProfessional || selectedService || selectedStatus || selectedDate) && (
            <button
              type="button"
              className="btn btn-outline btn-sm reset-filter-btn"
              onClick={handleResetFilters}
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* MAIN VIEW: LIST OR CALENDAR */}
      {viewMode === 'list' ? (
        <div className="card table-wrapper-card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Date & Heure</th>
                  <th>Cliente</th>
                  <th>Prestation</th>
                  <th>Praticienne</th>
                  <th>Prix</th>
                  <th>Statut</th>
                  <th className="actions-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAppointments.length > 0 ? (
                  paginatedAppointments.map((apt) => {
                    const client = clientMap[apt.clientId];
                    const service = serviceMap[apt.serviceId];
                    const prof = professionalMap[apt.professionalId];
                    return (
                      <tr key={apt.id}>
                        <td>
                          <span className="ref-tag">{apt.reference}</span>
                        </td>
                        <td>
                          <div className="td-datetime">
                            <strong>{apt.date}</strong>
                            <span>{apt.startTime} - {apt.endTime}</span>
                          </div>
                        </td>
                        <td>
                          <div className="td-client-info">
                            <strong>{client?.name || 'Cliente'}</strong>
                            <span className="client-phone">{client?.phone}</span>
                          </div>
                        </td>
                        <td>
                          <span className="td-service-title">{service?.name || `Service #${apt.serviceId}`}</span>
                        </td>
                        <td>{prof?.name || 'Assignation...'}</td>
                        <td>
                          <strong className="td-price">{formatFCFA(apt.price)}</strong>
                        </td>
                        <td>{renderStatusBadge(apt.status)}</td>
                        <td>
                          <div className="table-actions-cell">
                            <button
                              type="button"
                              className="action-icon-btn view"
                              title="Détails"
                              onClick={() => handleOpenDetailModal(apt)}
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              type="button"
                              className="action-icon-btn edit"
                              title="Modifier"
                              onClick={() => handleOpenEditModal(apt)}
                            >
                              <Edit2 size={16} />
                            </button>

                            {apt.status === 'pending' && (
                              <button
                                type="button"
                                className="action-icon-btn confirm"
                                title="Confirmer le rdv"
                                onClick={() => handleQuickStatusChange(apt, 'confirmed')}
                              >
                                <Check size={16} />
                              </button>
                            )}

                            {apt.status === 'confirmed' && (
                              <button
                                type="button"
                                className="action-icon-btn complete"
                                title="Marquer terminé"
                                onClick={() => handleQuickStatusChange(apt, 'completed')}
                              >
                                <CheckCircle2 size={16} />
                              </button>
                            )}

                            {apt.status !== 'cancelled' && (
                              <button
                                type="button"
                                className="action-icon-btn cancel"
                                title="Annuler le rdv"
                                onClick={() => handleOpenCancelDialog(apt)}
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="empty-table-state">
                      <CalendarIcon size={36} />
                      <p>Aucun rendez-vous trouvé pour ces critères.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <span className="pagination-info">
                Page {currentPage} sur {totalPages} ({filteredAppointments.length} résultats)
              </span>
              <div className="pagination-buttons">
                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    type="button"
                    className={`page-num-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* CALENDAR VIEW */
        <div className="card calendar-container-card">
          <div className="calendar-header">
            <h3 className="calendar-month-title">
              {currentCalendarDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="calendar-nav-controls">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() =>
                  setCurrentCalendarDate(
                    new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1)
                  )
                }
              >
                <ChevronLeft size={16} /> Mois précédent
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() =>
                  setCurrentCalendarDate(
                    new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1)
                  )
                }
              >
                Mois suivant <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="calendar-grid">
            <div className="calendar-weekday">Lun</div>
            <div className="calendar-weekday">Mar</div>
            <div className="calendar-weekday">Mer</div>
            <div className="calendar-weekday">Jeu</div>
            <div className="calendar-weekday">Ven</div>
            <div className="calendar-weekday">Sam</div>
            <div className="calendar-weekday">Dim</div>

            {calendarDays.map((cell, idx) => {
              if (!cell.isCurrentMonth) {
                return <div key={idx} className="calendar-day empty"></div>;
              }

              const dayApts = appointmentsByDate[cell.dateStr] || [];

              return (
                <div
                  key={idx}
                  className={`calendar-day active-day ${dayApts.length > 0 ? 'has-appointments' : ''}`}
                  onClick={() => {
                    if (dayApts.length > 0) {
                      setSelectedDate(cell.dateStr);
                      setViewMode('list');
                    } else {
                      handleOpenCreateModal(cell.dateStr);
                    }
                  }}
                >
                  <div className="day-number-header">
                    <span className="day-number">{cell.dayNumber}</span>
                    {dayApts.length > 0 && (
                      <span className="day-count-badge">{dayApts.length}</span>
                    )}
                  </div>

                  <div className="day-appointment-dots">
                    {dayApts.map((a) => (
                      <div
                        key={a.id}
                        className={`day-apt-pill status-${a.status}`}
                        title={`${a.startTime} - ${clientMap[a.clientId]?.name || 'Cliente'}`}
                      >
                        <span className="pill-time">{a.startTime}</span>
                        <span className="pill-name">{clientMap[a.clientId]?.name?.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE APPOINTMENT MODAL */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nouveau Rendez-vous</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsCreateModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                {/* Client Choice */}
                <div className="form-group">
                  <div className="client-toggle-tabs">
                    <button
                      type="button"
                      className={`tab-btn ${!formData.isNewClient ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, isNewClient: false })}
                    >
                      Cliente existante
                    </button>
                    <button
                      type="button"
                      className={`tab-btn ${formData.isNewClient ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, isNewClient: true })}
                    >
                      Nouvelle cliente
                    </button>
                  </div>
                </div>

                {!formData.isNewClient ? (
                  <div className="form-group">
                    <label className="form-label">Sélectionner la cliente</label>
                    <select
                      value={formData.clientId}
                      onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                      required
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.phone})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="new-client-box">
                    <div className="form-group">
                      <label className="form-label">Nom complet *</label>
                      <input
                        type="text"
                        value={formData.newClientName}
                        onChange={(e) => setFormData({ ...formData, newClientName: e.target.value })}
                        placeholder="Ex: Amina Touré"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Téléphone *</label>
                      <input
                        type="tel"
                        value={formData.newClientPhone}
                        onChange={(e) => setFormData({ ...formData, newClientPhone: e.target.value })}
                        placeholder="+225 07 00 00 00 00"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email (optionnel)</label>
                      <input
                        type="email"
                        value={formData.newClientEmail}
                        onChange={(e) => setFormData({ ...formData, newClientEmail: e.target.value })}
                        placeholder="amina@example.com"
                      />
                    </div>
                  </div>
                )}

                {/* Prestation */}
                <div className="form-group">
                  <label className="form-label">Prestation / Service</label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    required
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} - {formatFCFA(s.price)} ({s.duration} min)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Praticienne */}
                <div className="form-group">
                  <label className="form-label">Praticienne</label>
                  <select
                    value={formData.professionalId}
                    onChange={(e) => setFormData({ ...formData, professionalId: e.target.value })}
                    required
                  >
                    {professionals.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Start Time */}
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Heure de début</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Statut & Notes */}
                <div className="form-group">
                  <label className="form-label">Statut initial</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="confirmed">Confirmé</option>
                    <option value="pending">En attente</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes & Recommandations</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Remarques particulières, allergies, préférences..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Valider le rendez-vous
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT APPOINTMENT MODAL */}
      {isEditModalOpen && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Modifier le rendez-vous {selectedAppointment.reference}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Cliente</label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    required
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Prestation</label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    required
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} - {formatFCFA(s.price)} ({s.duration} min)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Praticienne</label>
                  <select
                    value={formData.professionalId}
                    onChange={(e) => setFormData({ ...formData, professionalId: e.target.value })}
                    required
                  >
                    {professionals.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Heure</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="completed">Terminé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {isDetailModalOpen && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Fiche Rendez-vous : {selectedAppointment.reference}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsDetailModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body detail-modal-content">
              <div className="detail-status-banner">
                <span>Statut actuel :</span>
                {renderStatusBadge(selectedAppointment.status)}
              </div>

              <div className="detail-info-block">
                <h4>Informations Cliente</h4>
                <p><strong>Nom :</strong> {clientMap[selectedAppointment.clientId]?.name}</p>
                <p><strong>Téléphone :</strong> {clientMap[selectedAppointment.clientId]?.phone}</p>
                <p><strong>Email :</strong> {clientMap[selectedAppointment.clientId]?.email}</p>
                {clientMap[selectedAppointment.clientId]?.preferences && (
                  <p className="detail-prefs"><strong>Préférences :</strong> {clientMap[selectedAppointment.clientId]?.preferences}</p>
                )}
              </div>

              <div className="detail-info-block">
                <h4>Prestation & Praticienne</h4>
                <p><strong>Soin :</strong> {serviceMap[selectedAppointment.serviceId]?.name}</p>
                <p><strong>Praticienne :</strong> {professionalMap[selectedAppointment.professionalId]?.name}</p>
                <p><strong>Date :</strong> {selectedAppointment.date}</p>
                <p><strong>Créneau :</strong> {selectedAppointment.startTime} - {selectedAppointment.endTime}</p>
                <p><strong>Tarif :</strong> {formatFCFA(selectedAppointment.price)}</p>
              </div>

              {selectedAppointment.notes && (
                <div className="detail-info-block">
                  <h4>Notes</h4>
                  <p>{selectedAppointment.notes}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleOpenEditModal(selectedAppointment);
                }}
              >
                <Edit2 size={16} /> Modifier
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL CONFIRMATION DIALOG */}
      {isCancelConfirmOpen && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setIsCancelConfirmOpen(false)}>
          <div className="modal confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="dialog-title-danger">
                <AlertTriangle size={22} color="var(--color-error)" />
                <h3>Confirmer l'annulation</h3>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsCancelConfirmOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p>
                Êtes-vous sûr de vouloir annuler le rendez-vous{' '}
                <strong>{selectedAppointment.reference}</strong> pour{' '}
                <strong>{clientMap[selectedAppointment.clientId]?.name}</strong> ?
              </p>
              <p className="danger-subtext">
                Cette action changera le statut en "Annulé". La cliente en sera notifiée.
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsCancelConfirmOpen(false)}
              >
                Retour
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmCancel}
              >
                Oui, annuler le rdv
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
