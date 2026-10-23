import { useState, useMemo } from 'react';
import { 
  UserCheck, 
  Plus, 
  Edit2, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Ban, 
  X, 
  Eye, 
  EyeOff, 
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import './AdminStaff.css';

const WEEKDAYS = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' }
];

const DEFAULT_HOURS = {
  monday: { start: '09:00', end: '18:00' },
  tuesday: { start: '09:00', end: '18:00' },
  wednesday: { start: '09:00', end: '18:00' },
  thursday: { start: '09:00', end: '18:00' },
  friday: { start: '09:00', end: '19:00' },
  saturday: { start: '09:00', end: '19:00' },
  sunday: null
};

export default function AdminStaff() {
  const { professionals, services, appointments, dispatch } = useData();
  const { success, error, warning } = useToast();

  // Modals state
  const [isProfModalOpen, setIsProfModalOpen] = useState(false);
  const [editingProf, setEditingProf] = useState(null);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleProf, setScheduleProf] = useState(null);

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockProf, setBlockProf] = useState(null);
  const [blockData, setBlockData] = useState({
    date: new Date().toISOString().split('T')[0],
    start: '12:00',
    end: '14:00',
    reason: ''
  });

  // Add / Edit Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    photo: '',
    services: [],
    workingHours: DEFAULT_HOURS,
    breaks: [{ start: '13:00', end: '14:00' }],
    daysOff: ['sunday'],
    status: 'active'
  });

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingProf(null);
    setFormData({
      name: '',
      role: '',
      phone: '',
      email: '',
      photo: '',
      services: [],
      workingHours: JSON.parse(JSON.stringify(DEFAULT_HOURS)),
      breaks: [{ start: '13:00', end: '14:00' }],
      daysOff: ['sunday'],
      status: 'active'
    });
    setIsProfModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (prof) => {
    setEditingProf(prof);
    setFormData({
      name: prof.name || '',
      role: prof.role || '',
      phone: prof.phone || '',
      email: prof.email || '',
      photo: prof.photo || '',
      services: prof.services || [],
      workingHours: prof.workingHours ? JSON.parse(JSON.stringify(prof.workingHours)) : DEFAULT_HOURS,
      breaks: prof.breaks && prof.breaks.length > 0 ? prof.breaks : [{ start: '13:00', end: '14:00' }],
      daysOff: prof.daysOff || ['sunday'],
      status: prof.status || 'active'
    });
    setIsProfModalOpen(true);
  };

  // Toggle Service selection in form
  const handleToggleService = (serviceId) => {
    setFormData(prev => {
      const exists = prev.services.includes(serviceId);
      return {
        ...prev,
        services: exists 
          ? prev.services.filter(id => id !== serviceId)
          : [...prev.services, serviceId]
      };
    });
  };

  // Toggle Day Off in form
  const handleToggleDayOff = (dayKey) => {
    setFormData(prev => {
      const isOff = prev.daysOff.includes(dayKey);
      const updatedDaysOff = isOff 
        ? prev.daysOff.filter(d => d !== dayKey)
        : [...prev.daysOff, dayKey];

      const updatedWorkingHours = { ...prev.workingHours };
      if (!isOff) {
        // Now it's a day off
        updatedWorkingHours[dayKey] = null;
      } else {
        // Restoring default
        updatedWorkingHours[dayKey] = { start: '09:00', end: '18:00' };
      }

      return {
        ...prev,
        daysOff: updatedDaysOff,
        workingHours: updatedWorkingHours
      };
    });
  };

  // Handle Working Hours Change
  const handleHoursChange = (dayKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [dayKey]: {
          ...(prev.workingHours[dayKey] || { start: '09:00', end: '18:00' }),
          [field]: value
        }
      }
    }));
  };

  // Save Professional
  const handleSaveProf = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) {
      error('Le nom et la spécialité / rôle sont obligatoires.');
      return;
    }

    if (editingProf) {
      dispatch({
        type: 'UPDATE_PROFESSIONAL',
        payload: {
          id: editingProf.id,
          data: {
            ...formData,
            photo: formData.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80'
          }
        }
      });
      success(`Professionnel(le) "${formData.name}" mis(e) à jour.`);
    } else {
      dispatch({
        type: 'ADD_PROFESSIONAL',
        payload: {
          ...formData,
          photo: formData.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
          blockedSlots: []
        }
      });
      success(`Professionnel(le) "${formData.name}" ajouté(e).`);
    }
    setIsProfModalOpen(false);
  };

  // Toggle Active/Inactive Status
  const handleToggleStatus = (prof) => {
    const newStatus = prof.status === 'active' ? 'inactive' : 'active';
    dispatch({
      type: 'UPDATE_PROFESSIONAL',
      payload: {
        id: prof.id,
        data: { status: newStatus }
      }
    });
    success(`${prof.name} est désormais ${newStatus === 'active' ? 'actif(ve)' : 'inactif(ve) (non réservable)'}.`);
  };

  // Schedule planning modal
  const handleOpenSchedule = (prof) => {
    setScheduleProf(prof);
    setIsScheduleModalOpen(true);
  };

  // Block time slot modal
  const handleOpenBlockModal = (prof) => {
    setBlockProf(prof);
    setBlockData({
      date: new Date().toISOString().split('T')[0],
      start: '12:00',
      end: '14:00',
      reason: ''
    });
    setIsBlockModalOpen(true);
  };

  const handleSaveBlockSlot = (e) => {
    e.preventDefault();
    if (!blockData.reason.trim()) {
      error('Veuillez préciser le motif du blocage (ex: Congé, Formation, Pause imprévue).');
      return;
    }

    const currentSlots = blockProf.blockedSlots || [];
    const newSlots = [...currentSlots, { ...blockData, id: Date.now() }];

    dispatch({
      type: 'UPDATE_PROFESSIONAL',
      payload: {
        id: blockProf.id,
        data: { blockedSlots: newSlots }
      }
    });

    success(`Créneau bloqué avec succès pour ${blockProf.name}.`);
    setIsBlockModalOpen(false);
  };

  return (
    <div className="admin-staff-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Gestion du Personnel & Planning</h1>
          <p className="admin-page-subtitle">
            Configurez vos coiffeuses, prothésistes, leurs horaires hebdomadaires et leurs indisponibilités.
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>Ajouter un(e) professionnel(le)</span>
        </button>
      </div>

      {/* Staff List Table */}
      <div className="admin-card admin-table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Professionnel(le)</th>
                <th>Spécialité / Rôle</th>
                <th>Contact</th>
                <th>Prestations attribuées</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(professionals || []).length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-empty">
                    <UserCheck size={40} className="empty-icon" />
                    <p>Aucun professionnel configuré.</p>
                  </td>
                </tr>
              ) : (
                professionals.map(prof => {
                  const assignedServicesCount = (prof.services || []).length;
                  const isActive = prof.status === 'active';

                  return (
                    <tr key={prof.id}>
                      <td>
                        <div className="staff-member-cell">
                          <img
                            src={prof.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80'}
                            alt={prof.name}
                            className="staff-avatar"
                          />
                          <div>
                            <strong className="staff-name">{prof.name}</strong>
                            <span className="staff-breaks-sub">
                              Pause : {prof.breaks?.[0] ? `${prof.breaks[0].start} - ${prof.breaks[0].end}` : 'Non définie'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="staff-role-badge">{prof.role}</span>
                      </td>
                      <td>
                        <div className="contact-col">
                          <span className="contact-info-cell"><Phone size={14} className="cell-icon" /> {prof.phone || '-'}</span>
                          <span className="contact-info-cell"><Mail size={14} className="cell-icon" /> {prof.email || '-'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="services-count-tag">
                          {assignedServicesCount} {assignedServicesCount > 1 ? 'prestations' : 'prestation'}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`status-toggle-btn ${isActive ? 'active' : 'inactive'}`}
                          onClick={() => handleToggleStatus(prof)}
                          title="Changer le statut actif/inactif"
                        >
                          {isActive ? (
                            <>
                              <Eye size={14} />
                              <span>Actif</span>
                            </>
                          ) : (
                            <>
                              <EyeOff size={14} />
                              <span>Inactif</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="text-right">
                        <div className="action-buttons-group">
                          <button
                            className="action-icon-btn action-view"
                            title="Voir le planning hebdomadaire"
                            onClick={() => handleOpenSchedule(prof)}
                          >
                            <Calendar size={16} />
                          </button>
                          <button
                            className="action-icon-btn action-block"
                            title="Bloquer un créneau horaire"
                            onClick={() => handleOpenBlockModal(prof)}
                          >
                            <Ban size={16} />
                          </button>
                          <button
                            className="action-icon-btn action-edit"
                            title="Modifier les informations"
                            onClick={() => handleOpenEditModal(prof)}
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

      {/* MODAL: ADD / EDIT PROFESSIONAL */}
      {isProfModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content admin-modal-lg">
            <div className="modal-header">
              <h3>{editingProf ? `Modifier ${editingProf.name}` : 'Nouveau professionnel'}</h3>
              <button className="modal-close" onClick={() => setIsProfModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveProf}>
              <div className="modal-body admin-staff-form">
                {/* Basic info */}
                <h4 className="form-subheading">Informations personnelles</h4>
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label>Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Aminata Diallo"
                    />
                  </div>

                  <div className="form-group">
                    <label>Spécialité / Titre *</label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Ex: Coiffeuse Visagiste, Styliste Ongulaire"
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
                    <label>Email professionnel</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="aminata@glamor-beauty.com"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>URL de la photo</label>
                    <input
                      type="url"
                      value={formData.photo}
                      onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                {/* Prestations assignées */}
                <h4 className="form-subheading">Prestations réalisables</h4>
                <div className="services-checkbox-grid">
                  {(services || []).map(svc => {
                    const isChecked = formData.services.includes(svc.id);
                    return (
                      <label key={svc.id} className={`service-check-card ${isChecked ? 'selected' : ''}`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleService(svc.id)}
                        />
                        <div className="service-check-text">
                          <span className="svc-name">{svc.name}</span>
                          <span className="svc-cat">{svc.category} • {svc.duration} min</span>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Working hours per weekday */}
                <h4 className="form-subheading">Horaires de travail hebdomadaires</h4>
                <div className="working-hours-grid">
                  {WEEKDAYS.map(day => {
                    const isDayOff = formData.daysOff.includes(day.key);
                    const hours = formData.workingHours?.[day.key] || { start: '09:00', end: '18:00' };

                    return (
                      <div key={day.key} className={`day-hours-row ${isDayOff ? 'is-off' : ''}`}>
                        <div className="day-name-col">
                          <strong>{day.label}</strong>
                          <label className="off-checkbox">
                            <input
                              type="checkbox"
                              checked={isDayOff}
                              onChange={() => handleToggleDayOff(day.key)}
                            />
                            <span>Repos</span>
                          </label>
                        </div>

                        {!isDayOff ? (
                          <div className="hours-inputs-row">
                            <input
                              type="time"
                              value={hours.start}
                              onChange={(e) => handleHoursChange(day.key, 'start', e.target.value)}
                            />
                            <span>à</span>
                            <input
                              type="time"
                              value={hours.end}
                              onChange={(e) => handleHoursChange(day.key, 'end', e.target.value)}
                            />
                          </div>
                        ) : (
                          <span className="day-off-text">Jour de repos (Fermé)</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Breaks & Status */}
                <h4 className="form-subheading">Pause déjeuner & Statut</h4>
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label>Début de pause</label>
                    <input
                      type="time"
                      value={formData.breaks[0]?.start || '13:00'}
                      onChange={(e) => {
                        const newBreaks = [{ ...formData.breaks[0], start: e.target.value, end: formData.breaks[0]?.end || '14:00' }];
                        setFormData({ ...formData, breaks: newBreaks });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Fin de pause</label>
                    <input
                      type="time"
                      value={formData.breaks[0]?.end || '14:00'}
                      onChange={(e) => {
                        const newBreaks = [{ ...formData.breaks[0], end: e.target.value, start: formData.breaks[0]?.start || '13:00' }];
                        setFormData({ ...formData, breaks: newBreaks });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Statut</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Actif (Réservable en ligne)</option>
                      <option value="inactive">Inactif (Indisponible)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setIsProfModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingProf ? 'Enregistrer les modifications' : 'Créer le profil'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PLANNING / SCHEDULE VIEW */}
      {isScheduleModalOpen && scheduleProf && (() => {
        const profAppointments = (appointments || []).filter(a => 
          a.professionalId === scheduleProf.id && a.status !== 'cancelled'
        );

        return (
          <div className="modal-backdrop">
            <div className="modal-content admin-modal-lg">
              <div className="modal-header">
                <div>
                  <h3>Planning & Disponibilités : {scheduleProf.name}</h3>
                  <span className="modal-subhead">{scheduleProf.role}</span>
                </div>
                <button className="modal-close" onClick={() => setIsScheduleModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body schedule-body">
                {/* Weekly Hours Overview */}
                <div className="schedule-section">
                  <h4>Horaires de présence réguliers</h4>
                  <div className="week-grid-view">
                    {WEEKDAYS.map(day => {
                      const isOff = scheduleProf.daysOff?.includes(day.key);
                      const hours = scheduleProf.workingHours?.[day.key];

                      return (
                        <div key={day.key} className={`day-card ${isOff ? 'off' : ''}`}>
                          <strong className="day-name">{day.label}</strong>
                          {isOff || !hours ? (
                            <span className="status-off">Repos</span>
                          ) : (
                            <div className="day-time-badge">
                              {hours.start} - {hours.end}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="pause-indication">
                    <Clock size={14} />
                    <span>Pause quotidienne : <strong>{scheduleProf.breaks?.[0]?.start || '13:00'} - {scheduleProf.breaks?.[0]?.end || '14:00'}</strong></span>
                  </div>
                </div>

                {/* Blocked Slots */}
                <div className="schedule-section">
                  <div className="section-header-flex">
                    <h4>Créneaux d'indisponibilité bloqués ({(scheduleProf.blockedSlots || []).length})</h4>
                    <button 
                      className="admin-btn admin-btn-sm admin-btn-ghost"
                      onClick={() => {
                        const p = scheduleProf;
                        setIsScheduleModalOpen(false);
                        handleOpenBlockModal(p);
                      }}
                    >
                      <Ban size={14} />
                      Bloquer un créneau
                    </button>
                  </div>

                  {(scheduleProf.blockedSlots || []).length === 0 ? (
                    <p className="no-data-msg">Aucun créneau exceptionnellement bloqué.</p>
                  ) : (
                    <div className="blocked-slots-list">
                      {scheduleProf.blockedSlots.map((slot, idx) => (
                        <div key={slot.id || idx} className="blocked-slot-item">
                          <Ban size={16} className="text-danger" />
                          <div className="blocked-info">
                            <strong>{slot.date} de {slot.start} à {slot.end}</strong>
                            <span>{slot.reason}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Booked Appointments */}
                <div className="schedule-section">
                  <h4>Rendez-vous programmés actifs ({profAppointments.length})</h4>
                  {profAppointments.length === 0 ? (
                    <p className="no-data-msg">Aucun rendez-vous planifié pour l'instant.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="items-table">
                        <thead>
                          <tr>
                            <th>Réf.</th>
                            <th>Date & Heure</th>
                            <th>Prestation</th>
                            <th>Cliente</th>
                            <th>Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {profAppointments.map(a => (
                            <tr key={a.id}>
                              <td><strong>{a.reference || `RDV-${a.id}`}</strong></td>
                              <td>{a.date} à {a.startTime}</td>
                              <td>{a.serviceName || `Service #${a.serviceId}`}</td>
                              <td>{a.clientName || 'Cliente'}</td>
                              <td>
                                <span className={`stock-badge ${a.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
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
              </div>

              <div className="modal-footer">
                <button className="admin-btn admin-btn-ghost" onClick={() => setIsScheduleModalOpen(false)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL: BLOCK TIME SLOT */}
      {isBlockModalOpen && blockProf && (
        <div className="modal-backdrop">
          <div className="modal-content admin-modal-md">
            <div className="modal-header">
              <h3>Bloquer un créneau : {blockProf.name}</h3>
              <button className="modal-close" onClick={() => setIsBlockModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveBlockSlot}>
              <div className="modal-body admin-form-grid">
                <div className="form-group full-width">
                  <label>Date *</label>
                  <input
                    type="date"
                    required
                    value={blockData.date}
                    onChange={(e) => setBlockData({ ...blockData, date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Heure de début *</label>
                  <input
                    type="time"
                    required
                    value={blockData.start}
                    onChange={(e) => setBlockData({ ...blockData, start: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Heure de fin *</label>
                  <input
                    type="time"
                    required
                    value={blockData.end}
                    onChange={(e) => setBlockData({ ...blockData, end: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Motif de l'indisponibilité *</label>
                  <input
                    type="text"
                    required
                    value={blockData.reason}
                    onChange={(e) => setBlockData({ ...blockData, reason: e.target.value })}
                    placeholder="Ex: Formation continue, Rendez-vous personnel, Absence exceptionnelle..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setIsBlockModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="admin-btn admin-btn-danger">
                  Bloquer ce créneau
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
