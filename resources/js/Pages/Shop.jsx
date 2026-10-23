import { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Sparkles, 
  X, 
  Check, 
  Eye, 
  SlidersHorizontal, 
  AlertCircle,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import { products as defaultProducts } from '../data/demoData';
import { useData } from '../contexts/DataContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import './Shop.css';

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
};

const categoryTabs = [
  { id: 'all', label: 'Tous' },
  { id: 'capillaire', label: 'Capillaire' },
  { id: 'manucure', label: 'Manucure' },
  { id: 'soins-pieds', label: 'Soins pieds' },
  { id: 'accessoires', label: 'Accessoires' },
];

export default function Shop() {
  const data = useData();
  const { addItem } = useCart();
  const { success } = useToast();

  const productsList = useMemo(() => {
    return (data?.products || defaultProducts).filter(p => p.status === 'active');
  }, [data?.products]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'under10k', '10kTo25k', 'above25k'
  const [selectedProduct, setSelectedProduct] = useState(null); // Detail modal

  // Featured products list (displayed in highlighted section at the top)
  const featuredProducts = useMemo(() => {
    return productsList.filter(p => p.featured);
  }, [productsList]);

  // Filtered products list for main grid
  const filteredProducts = useMemo(() => {
    return productsList.filter(product => {
      // Category match (allow both 'soins-pieds' and 'pedicure' variations if any)
      const matchCategory = selectedCategory === 'all' || 
        product.category === selectedCategory ||
        (selectedCategory === 'soins-pieds' && product.category === 'pedicure');

      // Search match
      const matchSearch = searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Price match
      let matchPrice = true;
      if (priceFilter === 'under10k') {
        matchPrice = product.price < 10000;
      } else if (priceFilter === '10kTo25k') {
        matchPrice = product.price >= 10000 && product.price <= 25000;
      } else if (priceFilter === 'above25k') {
        matchPrice = product.price > 25000;
      }

      return matchCategory && matchSearch && matchPrice;
    });
  }, [productsList, selectedCategory, searchQuery, priceFilter]);

  const handleAddToCart = (product, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (product.stock <= 0) return;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      maxStock: product.stock
    });

    success(`"${product.name}" ajouté au panier avec succès !`);
  };

  const renderStockBadge = (product) => {
    if (product.stock <= 0) {
      return <span className="stock-pill stock-pill-out">Rupture de stock</span>;
    }
    if (product.stock <= (product.alertThreshold || 5)) {
      return (
        <span className="stock-pill stock-pill-low">
          Plus que {product.stock} en stock !
        </span>
      );
    }
    return <span className="stock-pill stock-pill-in">En stock ({product.stock})</span>;
  };

  return (
    <div className="shop-page">
      {/* 1. HEADER */}
      <section className="shop-header">
        <div className="container text-center">
          <div className="shop-badge">
            <Sparkles size={16} />
            <span>Cosmétique & Soins d'Exception</span>
          </div>
          <h1 className="shop-title">Notre Boutique</h1>
          <p className="shop-subtitle">
            Découvrez nos soins de haute technologie, huiles précieuses et accessoires professionnels sélectionnés pour sublimer vos rituels beauté.
          </p>
        </div>
      </section>

      {/* 2. REASSURANCE BAR */}
      <div className="shop-perks-bar">
        <div className="container perks-container">
          <div className="perk-item">
            <Truck size={18} className="perk-icon" />
            <span>Livraison express à Abidjan & retrait salon gratuit</span>
          </div>
          <div className="perk-item">
            <ShieldCheck size={18} className="perk-icon" />
            <span>100% Produits d'origine certifiée</span>
          </div>
          <div className="perk-item">
            <RotateCcw size={18} className="perk-icon" />
            <span>Conseils personnalisés de nos praticiennes</span>
          </div>
        </div>
      </div>

      {/* 3. FEATURED PRODUCTS (SECTION RECOMMANDÉE EN HAUT) */}
      {selectedCategory === 'all' && !searchQuery && priceFilter === 'all' && featuredProducts.length > 0 && (
        <section className="shop-featured-section section">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Sélection Prestige</span>
              <h2 className="section-title">Produits Recommandés par nos Expertes</h2>
              <p className="section-description">
                Les soins plébiscités en salon pour prolonger les bénéfices de vos rituels.
              </p>
            </div>

            <div className="featured-products-grid">
              {featuredProducts.map((product) => {
                const isOutOfStock = product.stock <= 0;
                return (
                  <div 
                    key={product.id} 
                    className="featured-product-card"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="featured-badge-ribbon">Coup de Cœur</div>
                    <div className="featured-img-wrap">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="featured-img" 
                        loading="lazy"
                      />
                    </div>
                    <div className="featured-info">
                      <div className="featured-top-row">
                        <span className="featured-cat">{product.category}</span>
                        {renderStockBadge(product)}
                      </div>
                      <h3 className="featured-name">{product.name}</h3>
                      <p className="featured-price">{formatPrice(product.price)}</p>
                      
                      <div className="featured-card-actions">
                        <button
                          type="button"
                          className="btn-quick-view"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                          }}
                        >
                          <Eye size={15} />
                          <span>Voir le produit</span>
                        </button>

                        <button
                          type="button"
                          disabled={isOutOfStock}
                          className={`btn ${isOutOfStock ? 'btn-disabled' : 'btn-primary'} add-cart-btn`}
                          onClick={(e) => handleAddToCart(product, e)}
                        >
                          <ShoppingBag size={16} />
                          <span>{isOutOfStock ? 'Épuisé' : 'Ajouter'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. CONTROLS (TABS, SEARCH & PRICE FILTER) */}
      <section className="shop-controls-bar">
        <div className="container">
          <div className="shop-controls-row">
            {/* Category tabs */}
            <div className="shop-category-tabs">
              {categoryTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`shop-tab-btn ${selectedCategory === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Filter controls: Search + Price filter */}
            <div className="shop-filters-wrap">
              <div className="shop-search-box">
                <Search size={17} className="search-box-icon" />
                <input
                  type="text"
                  placeholder="Rechercher un soin..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="shop-search-input"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="shop-search-clear"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="price-filter-select-wrap">
                <SlidersHorizontal size={15} className="price-filter-icon" />
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="price-filter-select"
                >
                  <option value="all">Tous les prix</option>
                  <option value="under10k">Moins de 10 000 FCFA</option>
                  <option value="10kTo25k">10 000 à 25 000 FCFA</option>
                  <option value="above25k">Plus de 25 000 FCFA</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MAIN PRODUCTS GRID */}
      <section className="shop-catalog-section section">
        <div className="container">
          <div className="catalog-meta-row">
            <h2 className="catalog-title">
              {selectedCategory === 'all' 
                ? 'Tous les Produits' 
                : categoryTabs.find(t => t.id === selectedCategory)?.label || 'Produits'}
            </h2>
            <span className="catalog-count">
              {filteredProducts.length} référence{filteredProducts.length > 1 ? 's' : ''} trouvée{filteredProducts.length > 1 ? 's' : ''}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            /* EMPTY STATE */
            <div className="shop-empty-state">
              <div className="empty-state-icon">
                <ShoppingBag size={42} />
              </div>
              <h3 className="empty-state-title">Aucun produit ne correspond à votre sélection</h3>
              <p className="empty-state-desc">
                Essayez de modifier votre recherche ou de réinitialiser vos critères de prix et de catégorie.
              </p>
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setPriceFilter('all');
                }}
                className="btn btn-outline"
              >
                Réinitialiser la boutique
              </button>
            </div>
          ) : (
            /* PRODUCT GRID */
            <div className="shop-products-grid">
              {filteredProducts.map(product => {
                const isOutOfStock = product.stock <= 0;

                return (
                  <div 
                    key={product.id} 
                    className="shop-card"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="shop-card-media">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="shop-card-img" 
                        loading="lazy"
                      />
                      <span className="shop-category-tag">{product.category}</span>
                      <div className="shop-stock-overlay">
                        {renderStockBadge(product)}
                      </div>
                    </div>

                    <div className="shop-card-content">
                      <h3 className="shop-card-name">{product.name}</h3>
                      <p className="shop-card-desc">{product.description}</p>
                      
                      <div className="shop-card-price-row">
                        <span className="shop-card-price">{formatPrice(product.price)}</span>
                      </div>

                      <div className="shop-card-actions">
                        <button
                          type="button"
                          className="shop-card-detail-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                          }}
                        >
                          <Eye size={15} />
                          <span>Voir le produit</span>
                        </button>

                        <button
                          type="button"
                          disabled={isOutOfStock}
                          className={`btn ${isOutOfStock ? 'btn-disabled' : 'btn-primary'} shop-add-btn`}
                          onClick={(e) => handleAddToCart(product, e)}
                        >
                          <ShoppingBag size={16} />
                          <span>{isOutOfStock ? 'Épuisé' : 'Ajouter'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 6. DETAIL MODAL */}
      {selectedProduct && (
        <div className="product-modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              className="product-modal-close" 
              onClick={() => setSelectedProduct(null)}
              aria-label="Fermer la vue produit"
            >
              <X size={20} />
            </button>

            <div className="product-modal-layout">
              <div className="product-modal-img-container">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="product-modal-image" 
                />
              </div>

              <div className="product-modal-info">
                <span className="modal-category-label">{selectedProduct.category}</span>
                <h3 className="product-modal-title">{selectedProduct.name}</h3>
                
                <div className="product-modal-pricing">
                  <span className="modal-price">{formatPrice(selectedProduct.price)}</span>
                  {renderStockBadge(selectedProduct)}
                </div>

                <div className="product-modal-description-section">
                  <h4 className="description-subtitle">Description & Propriétés</h4>
                  <p className="description-body">{selectedProduct.description}</p>
                </div>

                <div className="product-modal-benefits">
                  <div className="benefit-row">
                    <Check size={16} className="benefit-check" />
                    <span>Formule salon professionnelle haute efficacité</span>
                  </div>
                  <div className="benefit-row">
                    <Check size={16} className="benefit-check" />
                    <span>Convient à tous types de cheveux & peaux</span>
                  </div>
                  <div className="benefit-row">
                    <Check size={16} className="benefit-check" />
                    <span>Garantie authenticité & fraîcheur Glam'Or Beauty</span>
                  </div>
                </div>

                <div className="modal-cta-area">
                  <button
                    disabled={selectedProduct.stock <= 0}
                    className={`btn w-full ${selectedProduct.stock <= 0 ? 'btn-disabled' : 'btn-primary'} modal-add-cart-btn`}
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    <ShoppingBag size={18} />
                    <span>
                      {selectedProduct.stock <= 0 ? 'Produit actuellement en rupture' : 'Ajouter au panier'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
