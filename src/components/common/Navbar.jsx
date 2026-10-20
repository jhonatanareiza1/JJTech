// ==========================================
// JJ TECH - MAIN NAVIGATION BAR
// ==========================================
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Tv, 
  Home, 
  Calculator, 
  Eye, 
  Wrench, 
  ShoppingCart, 
  User, 
  Lock, 
  Menu, 
  X, 
  Sparkles,
  PhoneCall,
  Camera
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { COMPANY_INFO } from '../../config/constants';
import './Navbar.scss';

export const Navbar = ({ activeTab, setActiveTab, onOpenAuthModal, onOpenAdminModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { currentUser, isAdmin, isClient, logout } = useAuth();

  const navLinks = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'catalogo', label: 'Catálogo & Tienda', icon: Tv },
    { id: 'simulador', label: 'Domótica en Vivo', icon: Sparkles, badge: 'Interactivo' },
    { id: 'cotizador', label: 'Cotizador Inteligente', icon: Calculator },
    { id: 'visualizador', label: '3D vs REAL', icon: Eye },
    { id: 'galeria', label: 'Proyectos & FAQ', icon: Camera },
    { id: 'servicios', label: 'Mantenimiento & Citas', icon: Wrench }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="navbar-header">
      {/* Top microbar */}
      <div className="navbar-microbar">
        <div className="container microbar-inner">
          <div className="microbar-left">
            <span className="location-tag">📍 Medellín, Antioquia</span>
            <span className="divider-dot">•</span>
            <span className="highlight-text">Alianza Oficial con <strong>TALUHA HOME</strong></span>
          </div>
          <div className="microbar-right">
            <a href={`https://wa.me/${COMPANY_INFO.whatsappRaw}`} target="_blank" rel="noopener noreferrer" className="microbar-link">
              <PhoneCall size={13} />
              <span>WhatsApp: +57 302 576 9589</span>
            </a>
            <span className="divider-dot">•</span>
            {isAdmin ? (
              <button onClick={() => setActiveTab('admin')} className="admin-status-pill">
                <ShieldCheck size={13} />
                <span>Panel Administrador Activo</span>
              </button>
            ) : (
              <button onClick={onOpenAdminModal} className="admin-access-btn">
                <Lock size={12} />
                <span>Acceso Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <nav className="navbar-main">
        <div className="container navbar-container">
          {/* Brand Logo */}
          <div className="navbar-brand" onClick={() => handleNavClick('inicio')}>
            <div className="logo-symbol">
              <span className="j-first">J</span>
              <span className="j-second">J</span>
            </div>
            <div className="logo-text-group">
              <span className="brand-name">TECH</span>
              <span className="brand-tagline">SEGURIDAD | DOMÓTICA | DISEÑO</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <ul className="navbar-nav desktop-only">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <li key={link.id} className="nav-item">
                  <button 
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(link.id)}
                  >
                    <Icon size={16} />
                    <span>{link.label}</span>
                    {link.badge && <span className="nav-badge">{link.badge}</span>}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Action Buttons */}
          <div className="navbar-actions">
            {/* Cart Button */}
            <button 
              className="action-btn cart-btn" 
              onClick={() => setIsCartOpen(true)}
              aria-label="Ver Carrito de Compras"
            >
              <ShoppingCart size={20} />
              {totalItemsCount > 0 && (
                <span className="cart-badge">{totalItemsCount}</span>
              )}
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="user-profile-menu">
                <button 
                  className="user-profile-btn"
                  onClick={() => isAdmin ? setActiveTab('admin') : setActiveTab('perfil')}
                  title={`Conectado como ${currentUser.displayName || currentUser.email}`}
                >
                  <User size={18} />
                  <span className="user-name">{currentUser.displayName?.split(' ')[0] || 'Mi Cuenta'}</span>
                  {isAdmin && <span className="admin-tag">ADMIN</span>}
                </button>
                <button onClick={logout} className="logout-btn" title="Cerrar Sesión">
                  <X size={15} />
                </button>
              </div>
            ) : (
              <button className="btn btn-outline btn-sm login-trigger" onClick={onOpenAuthModal}>
                <User size={16} />
                <span>Ingresar</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button 
              className="mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menú Móvil"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Menú JJ Tech</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>
            <ul className="mobile-nav-list">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.id}>
                    <button 
                      className={`mobile-nav-link ${activeTab === link.id ? 'active' : ''}`}
                      onClick={() => handleNavClick(link.id)}
                    >
                      <Icon size={20} />
                      <span>{link.label}</span>
                    </button>
                  </li>
                );
              })}
              {isAdmin && (
                <li>
                  <button 
                    className={`mobile-nav-link admin ${activeTab === 'admin' ? 'active' : ''}`}
                    onClick={() => handleNavClick('admin')}
                  >
                    <ShieldCheck size={20} />
                    <span>Panel Financiero / Admin</span>
                  </button>
                </li>
              )}
            </ul>
            <div className="mobile-menu-footer">
              <button 
                className="btn btn-primary w-full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
              >
                <User size={18} />
                <span>{currentUser ? `Perfil (${currentUser.displayName})` : 'Iniciar Sesión / Registro'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
