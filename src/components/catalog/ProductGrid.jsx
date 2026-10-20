// ==========================================
// JJ TECH - E-COMMERCE PRODUCT CATALOG & GRID
// ==========================================
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  Sparkles, 
  Check, 
  Eye, 
  Calculator,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { PRODUCT_CATEGORIES } from '../../config/constants';
import { formatCOP } from '../../utils/formatters';
import './ProductGrid.scss';

export const ProductGrid = ({ setActiveTab }) => {
  const { products } = useData();
  const { addToCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high'
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [addedItemSuccess, setAddedItemSuccess] = useState(null);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand?.toLowerCase().includes(q) ||
        p.shortDesc?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedItemSuccess(product.id);
    setTimeout(() => setAddedItemSuccess(null), 2000);
  };

  return (
    <section className="section catalog-section">
      <div className="container">
        <div className="section__header">
          <span className="badge-sub">TIENDA ONLINE Y CATÁLOGO EXCLUSIVO</span>
          <h2 className="title">
            Venta Directa de Equipos <br />
            <span className="highlight">Domótica, Seguridad, Cine y Cómputo</span>
          </h2>
          <p className="subtitle">
            Equipos de última generación con garantía directa de fábrica y servicio de instalación certificada en Medellín y Antioquia.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="catalog-toolbar glass-card">
          {/* Search Input */}
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, marca (Sony, Bose, Klipsch, Tuya, etc.)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="sort-box">
            <ArrowUpDown size={16} className="sort-icon" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Destacados JJ Tech</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Category Chips Bar */}
        <div className="category-chips">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`cat-chip ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-products-found">
              <p>No se encontraron productos que coincidan con tu búsqueda.</p>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const isAdded = addedItemSuccess === product.id;
              const isTaluha = product.category === 'entretenimiento' || product.brand?.includes('Taluha');

              return (
                <div key={product.id} className="product-card glass-card">
                  {/* Image container */}
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} />
                    <div className="image-overlay-actions">
                      <button 
                        className="quick-view-btn"
                        onClick={() => setSelectedProductModal(product)}
                        title="Ver especificaciones técnicas"
                      >
                        <Eye size={16} />
                        <span>Ficha Técnica</span>
                      </button>
                    </div>

                    {isTaluha && (
                      <span className="partner-ribbon">
                        <Sparkles size={11} /> TALUHA HOME
                      </span>
                    )}
                  </div>

                  {/* Body info */}
                  <div className="product-card-body">
                    <div className="brand-rating-row">
                      <span className="product-brand">{product.brand}</span>
                      <div className="rating-stars">
                        <Star size={13} fill="#F59E0B" color="#F59E0B" />
                        <span>{product.rating || 5.0}</span>
                      </div>
                    </div>

                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-desc">{product.shortDesc}</p>

                    {/* Features checklist */}
                    {product.features && (
                      <ul className="product-mini-specs">
                        {product.features.slice(0, 2).map((feat, i) => (
                          <li key={i}>
                            <Check size={12} className="feat-check" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="product-price-row">
                      <div className="price-group">
                        <span className="price-label">Precio Final:</span>
                        <strong className="price-amount">{formatCOP(product.price)}</strong>
                      </div>
                      <span className="stock-pill">Stock: {product.stock} un.</span>
                    </div>

                    {/* Actions */}
                    <div className="product-card-actions">
                      <button 
                        className={`btn ${isAdded ? 'btn-accent' : 'btn-primary'} flex-1`}
                        onClick={() => handleAddToCart(product)}
                      >
                        {isAdded ? (
                          <>
                            <Check size={16} />
                            <span>¡Añadido!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={16} />
                            <span>Comprar</span>
                          </>
                        )}
                      </button>

                      <button 
                        className="btn btn-outline quote-add-btn"
                        onClick={() => {
                          setActiveTab('cotizador');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        title="Añadir a cotización con viáticos"
                      >
                        <Calculator size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Product Technical Specs Modal */}
        {selectedProductModal && (
          <div className="modal-overlay" onClick={() => setSelectedProductModal(null)}>
            <div className="modal-content product-spec-modal" onClick={(e) => e.stopPropagation()}>
              <div className="spec-modal-header">
                <span className="brand-tag">{selectedProductModal.brand}</span>
                <h2>{selectedProductModal.name}</h2>
                <strong className="modal-price">{formatCOP(selectedProductModal.price)}</strong>
              </div>

              <div className="spec-modal-body">
                <img src={selectedProductModal.image} alt={selectedProductModal.name} className="spec-modal-img" />
                <p className="modal-full-desc">{selectedProductModal.shortDesc}</p>

                <h4>Especificaciones & Características:</h4>
                <ul className="full-specs-list">
                  {selectedProductModal.features?.map((f, i) => (
                    <li key={i}>
                      <Check size={16} className="spec-check-icon" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="labor-info-pill">
                  <span>Puntos de Instalación y Calibración Estimados:</span>
                  <strong>{selectedProductModal.installationLaborPoints || 1} punto(s) técnico(s)</strong>
                </div>
              </div>

              <div className="spec-modal-footer">
                <button className="btn btn-outline" onClick={() => setSelectedProductModal(null)}>
                  Cerrar
                </button>
                <button 
                  className="btn btn-accent"
                  onClick={() => {
                    handleAddToCart(selectedProductModal);
                    setSelectedProductModal(null);
                  }}
                >
                  <ShoppingCart size={18} />
                  <span>Añadir al Carrito</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
