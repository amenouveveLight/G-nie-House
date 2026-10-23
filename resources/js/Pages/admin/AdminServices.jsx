import { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import {
  Scissors,
  Plus,
  Search,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  Users,
  Image as ImageIcon
} from 'lucide-react';
import './AdminServices.css';

const formatFCFA = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount || 0) + ' FCFA';
};

const CATEGORIES = [
  { id: 'all', label: 'Toutes les catégories' },
  { id: 'coiffure', label: 'Coiffure' },
  { id: 'manucure', label: 'Manucure & Ongles' },
  { id: 'pedicure', label: 'Pédicure & Pieds' },
];

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80';

export default function AdminServices() {
  const { services = [], professionals = [], dispatch } = useData();
  const { success, error, info } = useToast();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedService, setSelectedService] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    category: 'coiffure',
    description: '',
    price: 15000,
    duration: 45,
    image: DEFAULT_IMAGE,
    professionals: [1],
    status: 'active',
  });

  // Professional Map
  const professionalMap = useMemo(() => {
    const map = {};
    professionals.forEach((p) => { map[p.id] = p; });
    return map;
  }, [professionals]);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      if (activeCategory !== 'all' && s.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesDesc = s.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    });
  }, [services, activeCategory, searchQuery]);

  // Handle open Add Modal
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      category: activeCategory !== 'all' ? activeCategory : 'coiffure',
      description: '',
      price: 15000,
      duration: 45,
      image: DEFAULT_IMAGE,
      professionals: professionals.length > 0 ? [professionals[0].id] : [],
      status: 'active',
    });
    setIsAddModalOpen(true);
  };

  // Handle open Edit Modal
  const handleOpenEditModal = (service) => {
    setSelectedService(service);
    setFormData({
      name: service.name || '',
      category: service.category || 'coiffure',
      description: service.description || '',
      price: service.price || 0,
      duration: service.duration || 30,
      image: service.image || DEFAULT_IMAGE,
      professionals: service.professionals || [],
      status: service.status || 'active',
    });
    setIsEditModalOpen(true);
  };

  // Handle open Delete Dialog
  const handleOpenDeleteModal = (service) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  // Toggle Service Active Status directly
  const handleToggleStatus = (service) => {
    const newStatus = service.status === 'active' ? 'inactive' : 'active';
    dispatch({
      type: 'UPDATE_SERVICE',
      payload: {
        id: service.id,
        data: { status: newStatus },
      },
    });
    if (newStatus === 'active') {
      success(`Le service "${service.name}" est désormais actif.`);
    } else {
      info(`Le service "${service.name}" a été désactivé.`);
    }
  };

  // Toggle Professional selection in form
  const handleToggleProfInForm = (profId) => {
    setFormData((prev) => {
      const exists = prev.professionals.includes(profId);
      const updated = exists
        ? prev.professionals.filter((id) => id !== profId)
        : [...prev.professionals, profId];
      return { ...prev, professionals: updated };
    });
  };

  // Submit Add
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error('Veuillez renseigner un intitulé de prestation.');
      return;
    }
    if (formData.professionals.length === 0) {
      error('Veuillez assigner au moins une praticienne qualifiée pour cette prestation.');
      return;
    }

    dispatch({
      type: 'ADD_SERVICE',
      payload: {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        price: Number(formData.price),
        duration: Number(formData.duration),
        image: formData.image.trim() || DEFAULT_IMAGE,
        professionals: formData.professionals,
        status: formData.status,
      },
    });

    success(`La prestation "${formData.name}" a été créée avec succès !`);
    setIsAddModalOpen(false);
  };

  // Submit Edit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedService) return;
    if (!formData.name.trim()) {
      error('Veuillez renseigner un intitulé valide.');
      return;
    }

    dispatch({
      type: 'UPDATE_SERVICE',
      payload: {
        id: selectedService.id,
        data: {
          name: formData.name.trim(),
          category: formData.category,
          description: formData.description.trim(),
          price: Number(formData.price),
          duration: Number(formData.duration),
          image: formData.image.trim() || DEFAULT_IMAGE,
          professionals: formData.professionals,
          status: formData.status,
        },
      },
    });

    success(`La prestation "${formData.name}" a été modifiée.`);
    setIsEditModalOpen(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!selectedService) return;
    dispatch({
      type: 'DELETE_SERVICE',
      payload: selectedService.id,
    });
    success(`Le service "${selectedService.name}" a été supprimé.`);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="admin-services-page">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Prestations & Services</h2>
          <p className="page-subtitle">
            Configurez le catalogue de soins, les tarifs en FCFA et les praticiennes habilitées.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenAddModal}
        >
          <Plus size={18} />
          <span>Ajouter une prestation</span>
        </button>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="services-toolbar-card">
        {/* Category Tabs */}
        <div className="category-tabs-list">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cat-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
              <span className="tab-count">
                {cat.id === 'all'
                  ? services.length
                  : services.filter((s) => s.category === cat.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="search-bar-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom de soin ou mot-clé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Services Table */}
      <div className="card table-wrapper-card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Aperçu</th>
                <th>Prestation</th>
                <th>Catégorie</th>
                <th>Tarif (FCFA)</th>
                <th>Durée</th>
                <th>Praticiennes</th>
                <th>Statut</th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => {
                  const isInactive = service.status === 'inactive';
                  return (
                    <tr key={service.id} className={isInactive ? 'row-inactive' : ''}>
                      <td>
                        <div className="service-img-wrapper">
                          <img
                            src={service.image || DEFAULT_IMAGE}
                            alt={service.name}
                            className="service-thumb"
                            onError={(e) => {
                              e.target.src = DEFAULT_IMAGE;
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="service-name-cell">
                          <strong>{service.name}</strong>
                          <p className="service-desc-snippet">{service.description}</p>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-cat badge-cat-${service.category}`}>
                          {service.category}
                        </span>
                      </td>
                      <td>
                        <strong className="service-price-tag">
                          {formatFCFA(service.price)}
                        </strong>
                      </td>
                      <td>
                        <div className="service-duration-badge">
                          <Clock size={13} />
                          <span>{service.duration} min</span>
                        </div>
                      </td>
                      <td>
                        <div className="profs-assigned-list">
                          {service.professionals && service.professionals.length > 0 ? (
                            service.professionals.map((pid) => {
                              const prof = professionalMap[pid];
                              return (
                                <span
                                  key={pid}
                                  className="prof-micro-tag"
                                  title={prof?.role || 'Praticienne'}
                                >
                                  {prof ? prof.name.split(' ')[0] : `#${pid}`}
                                </span>
                              );
                            })
                          ) : (
                            <span className="no-prof-hint">Aucun</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="status-toggle-btn"
                          onClick={() => handleToggleStatus(service)}
                          title="Cliquer pour changer de statut"
                        >
                          {service.status === 'active' ? (
                            <span className="badge badge-success">
                              <CheckCircle size={12} /> Actif
                            </span>
                          ) : (
                            <span className="badge badge-gray">
                              <XCircle size={12} /> Inactif
                            </span>
                          )}
                        </button>
                      </td>
                      <td>
                        <div className="table-actions-cell">
                          <button
                            type="button"
                            className="action-icon-btn edit"
                            title="Modifier"
                            onClick={() => handleOpenEditModal(service)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            className="action-icon-btn delete"
                            title="Supprimer"
                            onClick={() => handleOpenDeleteModal(service)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="empty-state-cell">
                    <Scissors size={40} />
                    <h3>Aucune prestation trouvée</h3>
                    <p>
                      {searchQuery
                        ? 'Aucun résultat ne correspond à votre recherche.'
                        : 'Aucune prestation enregistrée dans cette catégorie.'}
                    </p>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={handleOpenAddModal}
                    >
                      Ajouter une nouvelle prestation
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD SERVICE MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal modal-service-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ajouter une nouvelle prestation</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsAddModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nom du service / soin *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Tissage Brésilien & Soin Protecteur"
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Catégorie *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="coiffure">Coiffure</option>
                      <option value="manucure">Manucure</option>
                      <option value="pedicure">Pédicure</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Statut *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Actif (affiché en ligne)</option>
                      <option value="inactive">Inactif (masqué)</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Prix (en FCFA) *</label>
                    <input
                      type="number"
                      min="500"
                      step="500"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Durée estimée (minutes) *</label>
                    <input
                      type="number"
                      min="10"
                      step="5"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">URL de l'image d'illustration</label>
                  <div className="image-input-wrap">
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description du soin</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Détaillez le déroulement, les produits utilisés et les bénéfices..."
                  />
                </div>

                {/* Professional Selection */}
                <div className="form-group">
                  <label className="form-label">Praticiennes habilitées *</label>
                  <div className="profs-selection-grid">
                    {professionals.map((prof) => {
                      const isChecked = formData.professionals.includes(prof.id);
                      return (
                        <label
                          key={prof.id}
                          className={`prof-checkbox-item ${isChecked ? 'checked' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleProfInForm(prof.id)}
                          />
                          <span>{prof.name}</span>
                          <small>({prof.role})</small>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Créer la prestation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SERVICE MODAL */}
      {isEditModalOpen && selectedService && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal modal-service-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Modifier : {selectedService.name}</h3>
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
                  <label className="form-label">Nom du service *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Catégorie *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="coiffure">Coiffure</option>
                      <option value="manucure">Manucure</option>
                      <option value="pedicure">Pédicure</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Statut *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Prix (FCFA) *</label>
                    <input
                      type="number"
                      min="500"
                      step="500"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Durée (minutes) *</label>
                    <input
                      type="number"
                      min="10"
                      step="5"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">URL de l'image</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Praticiennes habilitées</label>
                  <div className="profs-selection-grid">
                    {professionals.map((prof) => {
                      const isChecked = formData.professionals.includes(prof.id);
                      return (
                        <label
                          key={prof.id}
                          className={`prof-checkbox-item ${isChecked ? 'checked' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleProfInForm(prof.id)}
                          />
                          <span>{prof.name}</span>
                          <small>({prof.role})</small>
                        </label>
                      );
                    })}
                  </div>
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

      {/* DELETE CONFIRMATION DIALOG */}
      {isDeleteModalOpen && selectedService && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="dialog-title-danger">
                <AlertTriangle size={22} color="var(--color-error)" />
                <h3>Supprimer la prestation</h3>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p>
                Êtes-vous sûr de vouloir supprimer définitivement le service{' '}
                <strong>"{selectedService.name}"</strong> ?
              </p>
              <p className="danger-subtext">
                Cette action supprimera la prestation du catalogue. Les rendez-vous déjà passés conserveront leur historique.
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
