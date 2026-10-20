// ==========================================
// JJ TECH - SHOPPING CART DRAWER & CHECKOUT
// ==========================================
import React, { useState } from 'react';
import { 
  X, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Send, 
  ShieldCheck, 
  ArrowRight,
  MapPin,
  CheckCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { LOCATIONS_ANTIOQUIA } from '../../config/constants';
import { formatCOP } from '../../utils/formatters';
import { createWhatsAppOrderLink } from '../../utils/whatsappHelper';
import './CartDrawer.scss';

export const CartDrawer = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    cartSubtotal,
    totalItemsCount
  } = useCart();
  const { currentUser } = useAuth();

  const [customerName, setCustomerName] = useState(currentUser?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedCity, setSelectedCity] = useState('Medellín - El Poblado');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  if (!isCartOpen) return null;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const customerInfo = {
      name: customerName || currentUser?.displayName || 'Cliente Web',
      city: selectedCity,
      phone: customerPhone,
      notes: deliveryNotes
    };

    const link = createWhatsAppOrderLink(cart, cartSubtotal, customerInfo);
    window.open(link, '_blank');
  };

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="header-title-box">
            <ShoppingCart size={20} className="icon-cyan" />
            <h3>Tu Carrito de Compras</h3>
            <span className="items-count">({totalItemsCount})</span>
          </div>
          <button 
            className="close-drawer-btn" 
            onClick={() => setIsCartOpen(false)}
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body: Items List */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <ShoppingCart size={48} className="empty-cart-icon" />
              <h4>Tu carrito está vacío</h4>
              <p>Explora nuestro catálogo de domótica, cortinas y sonido de alta fidelidad.</p>
              <button 
                className="btn btn-accent btn-sm"
                onClick={() => setIsCartOpen(false)}
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img src={item.image} alt={item.name} className="cart-item-thumb" />
                  
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <span className="cart-item-unit">{formatCOP(item.price)} c/u</span>

                    <div className="cart-item-bottom">
                      <div className="cart-qty-pill">
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <strong className="cart-item-total">
                        {formatCOP(item.price * item.quantity)}
                      </strong>

                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        title="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="clear-cart-row">
                <button className="clear-cart-btn" onClick={clearCart}>
                  Vaciar Carrito
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer: Subtotal & WhatsApp Checkout */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="checkout-inputs">
              <div className="input-group-row">
                <input 
                  type="text" 
                  placeholder="Tu Nombre Completo..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                  {LOCATIONS_ANTIOQUIA.map((l) => (
                    <option key={l.id} value={l.city}>
                      {l.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="cart-subtotal-box">
              <div className="subtotal-row">
                <span>Total Estimado:</span>
                <strong className="subtotal-price">{formatCOP(cartSubtotal)}</strong>
              </div>
              <span className="shipping-note">
                📍 Despacho asegurado en Medellín y municipios de Antioquia
              </span>
            </div>

            <button 
              className="btn btn-whatsapp w-full checkout-btn"
              onClick={handleCheckout}
            >
              <Send size={18} />
              <span>Finalizar Pedido vía WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
