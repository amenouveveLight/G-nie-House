import { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  History,
  Star,
  Sliders
} from 'lucide-react';
import { useData } from '../../Contexts/DataContext';
import { useToast } from '../../Contexts/ToastContext';
import './AdminProducts.css';

const CATEGORIES = [
  { id: 'all', label: 'Tous' },
  { id: 'capillaire', label: 'Capillaire' },
  { id: 'manucure', label: 'Manucure' },
  { id: 'soins-pieds', label: 'Soins pieds' },
  { id: 'accessoires', label: 'Accessoires' }
];

export default function AdminProducts() {
  const { products, stockMovements, dispatch } = useData();
  const { success, error, warning } = useToast();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockProduct, setStockProduct] = useState(null);
  const [stockAdjustment, setStockAdjustment] = useState({
    type: 'entry', // 'entry' | 'exit' | 'adjustment'
    quantity: 1,
    note: ''
  });

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyProduct, setHistoryProduct] = useState(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'capillaire',
    price: '',
    image: '',
    stock: '',
    alertThreshold: 5,
    status: 'active',
    featured: false
  });

  // Filtered products
  const filteredProducts = useMemo(() => {
    return (products || []).filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('fr-FR').format(val || 0) + ' FCFA';
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: 'capillaire',
      price: '',
      image: '',
      stock: '',
      alertThreshold: 5,
      status: 'active',
      featured: false
    });
    setIsProductModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category,
      price: product.price,
      image: product.image || '',
      stock: product.stock,
      alertThreshold: product.alertThreshold ?? 5,
      status: product.status || 'active',
      featured: !!product.featured
    });
    setIsProductModalOpen(true);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error('Le nom du produit est obligatoire.');
      return;
    }
    const priceNum = Number(formData.price);
    const stockNum = Number(formData.stock);
    const alertThresholdNum = Number(formData.alertThreshold);

    if (isNaN(priceNum) || priceNum < 0) {
      error('Veuillez entrer un prix valide.');
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      error('Veuillez entrer une quantité en stock valide.');
      return;
    }

    if (editingProduct) {
      dispatch({
        type: 'UPDATE_PRODUCT',
        payload: {
          id: editingProduct.id,
          data: {
            ...formData,
            price: priceNum,
            stock: stockNum,
            alertThreshold: alertThresholdNum,
            image: formData.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
          }
        }
      });
      success(`Le produit "${formData.name}" a été mis à jour.`);
    } else {
      dispatch({
        type: 'ADD_PRODUCT',
        payload: {
          ...formData,
          price: priceNum,
          stock: stockNum,
          alertThreshold: alertThresholdNum,
          image: formData.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
        }
      });
      success(`Le produit "${formData.name}" a été ajouté.`);
    }
    setIsProductModalOpen(false);
  };

  // Toggle visibility status
  const handleToggleStatus = (product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    dispatch({
      type: 'UPDATE_PRODUCT',
      payload: {
        id: product.id,
        data: { status: newStatus }
      }
    });
    success(`Le produit est maintenant ${newStatus === 'active' ? 'actif (visible)' : 'inactif (masqué)'}.`);
  };

  // Confirm delete
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      dispatch({
        type: 'DELETE_PRODUCT',
        payload: productToDelete.id
      });
      success(`Le produit "${productToDelete.name}" a été supprimé.`);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  // Stock Adjustment
  const handleOpenStockModal = (product) => {
    setStockProduct(product);
    setStockAdjustment({
      type: 'entry',
      quantity: 1,
      note: ''
    });
    setIsStockModalOpen(true);
  };

  const handleSaveStockAdjustment = (e) => {
    e.preventDefault();
    const qty = Number(stockAdjustment.quantity);
    if (isNaN(qty) || qty < 0) {
      error('Veuillez entrer une quantité valide.');
      return;
    }
    if (stockAdjustment.type === 'exit' && qty > stockProduct.stock) {
      warning('La quantité de sortie dépasse le stock disponible.');
    }

    dispatch({
      type: 'UPDATE_STOCK',
      payload: {
        productId: stockProduct.id,
        quantity: qty,
        type: stockAdjustment.type,
        note: stockAdjustment.note || 'Ajustement manuel admin'
      }
    });

    success(`Stock mis à jour pour "${stockProduct.name}".`);
    setIsStockModalOpen(false);
  };

  // History Modal
  const handleOpenHistoryModal = (product) => {
    setHistoryProduct(product);
    setIsHistoryModalOpen(true);
  };

  const productMovements = useMemo(() => {
    if (!historyProduct || !stockMovements) return [];
    return stockMovements
      .filter(m => m.productId === historyProduct.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [historyProduct, stockMovements]);

  return (
    <div className="admin-products-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Gestion des Produits & Stock</h1>
          <p className="admin-page-subtitle">
            Gérez votre inventaire, les niveaux d'alerte et les mouvements de stock en temps réel.
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>Ajouter un produit</span>
        </button>
      </div>

      {/* Control Bar: Categories & Search */}
      <div className="admin-card admin-controls-card">
        <div className="category-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`category-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="admin-search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom ou description..."
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

      {/* Products Table */}
      <div className="admin-card admin-table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Seuil d'alerte</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="table-empty">
                    <Package size={40} className="empty-icon" />
                    <p>Aucun produit ne correspond à votre recherche.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const isRupture = product.stock === 0;
                  const isLow = product.stock <= (product.alertThreshold ?? 5) && !isRupture;
                  const badgeClass = isRupture ? 'badge-danger' : isLow ? 'badge-warning' : 'badge-success';
                  const badgeText = isRupture ? 'Rupture (0)' : isLow ? `Faible (${product.stock})` : `${product.stock} en stock`;

                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="product-info-cell">
                          <img
                            src={product.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'}
                            alt={product.name}
                            className="product-thumbnail"
                          />
                          <div>
                            <div className="product-name-row">
                              <span className="product-name">{product.name}</span>
                              {product.featured && (
                                <span className="featured-star" title="Produit vedette">
                                  <Star size={14} />
                                </span>
                              )}
                            </div>
                            <span className="product-desc-preview">
                              {product.description?.slice(0, 50)}
                              {product.description?.length > 50 ? '...' : ''}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="category-pill">
                          {CATEGORIES.find(c => c.id === product.category)?.label || product.category}
                        </span>
                      </td>
                      <td className="product-price">{formatPrice(product.price)}</td>
                      <td>
                        <span className={`stock-badge ${badgeClass}`}>
                          {badgeText}
                        </span>
                      </td>
                      <td>
                        <span className="alert-threshold-text">
                          {product.alertThreshold ?? 5} unités
                        </span>
                      </td>
                      <td>
                        <button
                          className={`status-toggle-btn ${product.status === 'active' ? 'active' : 'inactive'}`}
                          onClick={() => handleToggleStatus(product)}
                          title="Cliquer pour changer la visibilité"
                        >
                          {product.status === 'active' ? (
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
                            className="action-icon-btn action-stock"
                            title="Ajuster le stock"
                            onClick={() => handleOpenStockModal(product)}
                          >
                            <Sliders size={16} />
                          </button>
                          <button
                            className="action-icon-btn action-history"
                            title="Historique des mouvements"
                            onClick={() => handleOpenHistoryModal(product)}
                          >
                            <History size={16} />
                          </button>
                          <button
                            className="action-icon-btn action-edit"
                            title="Modifier"
                            onClick={() => handleOpenEditModal(product)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="action-icon-btn action-delete"
                            title="Supprimer"
                            onClick={() => handleDeleteClick(product)}
                          >
                            <Trash2 size={16} />
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

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content admin-modal-lg">
            <div className="modal-header">
              <h3>{editingProduct ? 'Modifier le produit' : 'Nouveau produit'}</h3>
              <button className="modal-close" onClick={() => setIsProductModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveProduct}>
              <div className="modal-body admin-form-grid">
                <div className="form-group full-width">
                  <label>Nom du produit *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Masque Nourrissant Argan & Miel"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description détaillée du produit, composition, vertus..."
                  />
                </div>

                <div className="form-group">
                  <label>Catégorie *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="capillaire">Soins Capillaires</option>
                    <option value="manucure">Beauté des Mains (Manucure)</option>
                    <option value="soins-pieds">Soins des Pieds</option>
                    <option value="accessoires">Accessoires & Outils</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Prix (FCFA) *</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Ex: 15000"
                  />
                </div>

                <div className="form-group">
                  <label>Stock initial *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="Ex: 20"
                  />
                </div>

                <div className="form-group">
                  <label>Seuil d'alerte stock</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.alertThreshold}
                    onChange={(e) => setFormData({ ...formData, alertThreshold: e.target.value })}
                    placeholder="Ex: 5"
                  />
                </div>

                <div className="form-group full-width">
                  <label>URL de l'image</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="form-group">
                  <label>Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Actif (Visible en boutique)</option>
                    <option value="inactive">Inactif (Masqué)</option>
                  </select>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <span>Mettre en avant sur la page d'accueil (Produit Star)</span>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setIsProductModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingProduct ? 'Enregistrer les modifications' : 'Créer le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STOCK ADJUSTMENT */}
      {isStockModalOpen && stockProduct && (
        <div className="modal-backdrop">
          <div className="modal-content admin-modal-md">
            <div className="modal-header">
              <h3>Ajuster le stock : {stockProduct.name}</h3>
              <button className="modal-close" onClick={() => setIsStockModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveStockAdjustment}>
              <div className="modal-body">
                <div className="current-stock-info">
                  <span>Stock actuel :</span>
                  <strong>{stockProduct.stock} unités</strong>
                </div>

                <div className="form-group">
                  <label>Type de mouvement</label>
                  <div className="stock-type-selector">
                    <label className={`type-btn ${stockAdjustment.type === 'entry' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="stockType"
                        value="entry"
                        checked={stockAdjustment.type === 'entry'}
                        onChange={(e) => setStockAdjustment({ ...stockAdjustment, type: e.target.value })}
                      />
                      <TrendingUp size={16} />
                      <span>Entrée (+)</span>
                    </label>
                    <label className={`type-btn ${stockAdjustment.type === 'exit' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="stockType"
                        value="exit"
                        checked={stockAdjustment.type === 'exit'}
                        onChange={(e) => setStockAdjustment({ ...stockAdjustment, type: e.target.value })}
                      />
                      <TrendingDown size={16} />
                      <span>Sortie (-)</span>
                    </label>
                    <label className={`type-btn ${stockAdjustment.type === 'adjustment' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="stockType"
                        value="adjustment"
                        checked={stockAdjustment.type === 'adjustment'}
                        onChange={(e) => setStockAdjustment({ ...stockAdjustment, type: e.target.value })}
                      />
                      <RefreshCw size={16} />
                      <span>Inventaire exact (=)</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    {stockAdjustment.type === 'adjustment' ? 'Nouveau stock total *' : 'Quantité *'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stockAdjustment.quantity}
                    onChange={(e) => setStockAdjustment({ ...stockAdjustment, quantity: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Motif / Note</label>
                  <input
                    type="text"
                    value={stockAdjustment.note}
                    onChange={(e) => setStockAdjustment({ ...stockAdjustment, note: e.target.value })}
                    placeholder="Ex: Réapprovisionnement fournisseur, Casse, Inventaire mensuel..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setIsStockModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Valider le mouvement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STOCK HISTORY */}
      {isHistoryModalOpen && historyProduct && (
        <div className="modal-backdrop">
          <div className="modal-content admin-modal-md">
            <div className="modal-header">
              <h3>Historique des mouvements : {historyProduct.name}</h3>
              <button className="modal-close" onClick={() => setIsHistoryModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {productMovements.length === 0 ? (
                <div className="empty-history-text">
                  <p>Aucun mouvement de stock enregistré pour ce produit.</p>
                </div>
              ) : (
                <div className="movement-list">
                  {productMovements.map((mov, idx) => {
                    const isEntry = mov.type === 'entry';
                    const isExit = mov.type === 'exit' || mov.type === 'order';
                    const iconColor = isEntry ? 'text-success' : isExit ? 'text-danger' : 'text-warning';
                    
                    return (
                      <div key={mov.id || idx} className="movement-item">
                        <div className={`movement-icon ${iconColor}`}>
                          {isEntry ? <TrendingUp size={18} /> : isExit ? <TrendingDown size={18} /> : <RefreshCw size={18} />}
                        </div>
                        <div className="movement-details">
                          <div className="movement-header">
                            <strong className="movement-type">
                              {mov.type === 'entry' ? 'Entrée de stock' : mov.type === 'exit' ? 'Sortie manuelle' : mov.type === 'order' ? 'Vente commande' : 'Ajustement inventaire'}
                            </strong>
                            <span className="movement-qty">
                              {mov.type === 'entry' ? `+${mov.quantity}` : mov.type === 'adjustment' ? `Fixé à ${mov.quantity}` : `-${mov.quantity}`}
                            </span>
                          </div>
                          <p className="movement-note">{mov.note || 'Aucune note'}</p>
                          <span className="movement-date">
                            {new Date(mov.date).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setIsHistoryModalOpen(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {isDeleteModalOpen && productToDelete && (
        <div className="modal-backdrop">
          <div className="modal-content admin-modal-sm">
            <div className="modal-header">
              <h3>Supprimer le produit</h3>
              <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body confirm-delete-body">
              <div className="warning-icon-wrapper">
                <AlertTriangle size={36} />
              </div>
              <p>
                Êtes-vous sûr de vouloir supprimer définitivement le produit <strong>"{productToDelete.name}"</strong> ?
              </p>
              <p className="subtext-note">Cette action est irréversible.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setIsDeleteModalOpen(false)}>
                Annuler
              </button>
              <button type="button" className="admin-btn admin-btn-danger" onClick={handleConfirmDelete}>
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
