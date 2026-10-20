// ==========================================
// JJ TECH - CLIENT PROFILE PORTAL & SAVED QUOTES
// ==========================================
import React, { useState } from 'react';
import { 
  User, 
  FileText, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  LogOut,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatCOP, formatDate } from '../../utils/formatters';
import { createWhatsAppQuoteLink } from '../../utils/whatsappHelper';
import './UserProfile.scss';

export const UserProfile = ({ setActiveTab, onOpenAuthModal }) => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { quotes, bookings } = useData();

  const [activeSubtab, setActiveSubtab] = useState('quotes'); // 'quotes' or 'bookings'

  // If not logged in, prompt to log in
  if (!isAuthenticated) {
    return (
      <section className="section user-profile-section">
        <div className="container">
          <div className="guest-prompt-card glass-card">
            <div className="icon-circle">
              <User size={40} />
            </div>
            <h2>Acceso a Mi Portal JJ Tech</h2>
            <p>
              Inicia sesión o regístrate como cliente para consultar tus cotizaciones guardadas, hacer seguimiento a tus visitas técnicas y gestionar tus servicios.
            </p>
            <button className="btn btn-accent btn-lg" onClick={onOpenAuthModal}>
              Iniciar Sesión / Registro
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Filter quotes for this user or show all customer quotes in demo mode
  const userQuotes = quotes;
  const userBookings = bookings;

  return (
    <section className="section user-profile-section">
      <div className="container">
        {/* Profile Header Bar */}
        <div className="profile-header-card glass-card">
          <div className="profile-user-info">
            <div className="profile-avatar">
              <span>{currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'C'}</span>
            </div>
            <div className="profile-names">
              <span className="client-badge">CLIENTE VERIFICADO JJ TECH</span>
              <h2>{currentUser.displayName || 'Cliente Distinguido'}</h2>
              <div className="profile-meta">
                <span><Mail size={13} /> {currentUser.email}</span>
                <span><MapPin size={13} /> {currentUser.city || 'Medellín, Antioquia'}</span>
              </div>
            </div>
          </div>

          <div className="profile-header-actions">
            <button 
              className="btn btn-accent btn-sm"
              onClick={() => setActiveTab('cotizador')}
            >
              <Plus size={16} />
              <span>Nueva Cotización</span>
            </button>

            <button className="btn btn-outline btn-sm" onClick={logout}>
              <LogOut size={16} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="profile-tabs-nav">
          <button 
            className={`profile-tab-btn ${activeSubtab === 'quotes' ? 'active' : ''}`}
            onClick={() => setActiveSubtab('quotes')}
          >
            <FileText size={18} />
            <span>Mis Cotizaciones Guardadas ({userQuotes.length})</span>
          </button>
          <button 
            className={`profile-tab-btn ${activeSubtab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveSubtab('bookings')}
          >
            <Calendar size={18} />
            <span>Mis Servicios & Mantenimientos ({userBookings.length})</span>
          </button>
        </div>

        {/* Tab 1: Saved Quotes */}
        {activeSubtab === 'quotes' && (
          <div className="saved-quotes-container">
            {userQuotes.length === 0 ? (
              <div className="empty-profile-state glass-card">
                <FileText size={42} />
                <h3>No tienes cotizaciones guardadas</h3>
                <p>Usa nuestra calculadora inteligente para presupuestar tu proyecto en Medellín o municipios.</p>
                <button className="btn btn-accent btn-sm" onClick={() => setActiveTab('cotizador')}>
                  Ir al Cotizador Inteligente
                </button>
              </div>
            ) : (
              <div className="profile-quotes-grid">
                {userQuotes.map((q) => (
                  <div key={q.id} className="profile-quote-card glass-card">
                    <div className="quote-top">
                      <div>
                        <span className="quote-code">{q.id}</span>
                        <h4>{q.customerName || 'Cotización JJ Tech'}</h4>
                        <span className="quote-place">📍 {q.locationCity}</span>
                      </div>
                      <span className={`status-pill ${q.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {q.status}
                      </span>
                    </div>

                    <div className="quote-breakdown-mini">
                      <div className="b-row">
                        <span>Costo Equipos & Mano Obra:</span>
                        <strong>{formatCOP(q.materialsTotal + q.laborTotal)}</strong>
                      </div>
                      <div className="b-row">
                        <span>Margen 50% Libre Imp.:</span>
                        <strong className="cyan-text">+{formatCOP(q.marginAmount)}</strong>
                      </div>
                      <div className="b-row">
                        <span>Viáticos de Desplazamiento:</span>
                        <strong>+{formatCOP(q.travelCost)}</strong>
                      </div>
                      <div className="b-row bonus">
                        <span>Visita Técnica 100% Deducible:</span>
                        <strong>-{formatCOP(q.visitDiscount || q.technicalVisitCost || 120000)}</strong>
                      </div>
                      <div className="b-row grand-total">
                        <span>TOTAL DEL PROYECTO:</span>
                        <strong>{formatCOP(q.grandTotal)}</strong>
                      </div>
                    </div>

                    <div className="quote-card-footer">
                      <button 
                        className="btn btn-whatsapp btn-sm w-full"
                        onClick={() => {
                          const link = `https://wa.me/573025769589?text=${encodeURIComponent(`Hola JJ Tech, deseo formalizar la cotización guardada número ${q.id} por un valor de ${formatCOP(q.grandTotal)} para ${q.locationCity}.`)}`;
                          window.open(link, '_blank');
                        }}
                      >
                        <Send size={15} />
                        <span>Re-enviar por WhatsApp (+57 302...)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Bookings */}
        {activeSubtab === 'bookings' && (
          <div className="saved-bookings-container">
            {userBookings.length === 0 ? (
              <div className="empty-profile-state glass-card">
                <Calendar size={42} />
                <h3>No tienes citas de servicio agendadas</h3>
                <p>Programa mantenimientos preventivos o visitas de diagnóstico cuando lo necesites.</p>
                <button className="btn btn-accent btn-sm" onClick={() => setActiveTab('servicios')}>
                  Agendar Mantenimiento
                </button>
              </div>
            ) : (
              <div className="profile-bookings-grid">
                {userBookings.map((b) => (
                  <div key={b.id} className="profile-booking-card glass-card">
                    <div className="b-top">
                      <div>
                        <span className="booking-code">{b.id}</span>
                        <h4>{b.serviceType}</h4>
                      </div>
                      <span className="b-status-pill">{b.status}</span>
                    </div>

                    <div className="b-details">
                      <div className="b-line">
                        <span>Fecha y Horario:</span>
                        <strong>{b.preferredDate || b.date} ({b.preferredTime || b.time})</strong>
                      </div>
                      <div className="b-line">
                        <span>Dirección:</span>
                        <strong>{b.city} - {b.address}</strong>
                      </div>
                      <div className="b-line">
                        <span>Contacto:</span>
                        <strong>{b.phone}</strong>
                      </div>
                    </div>

                    <div className="b-footer">
                      <a 
                        href={`https://wa.me/573025769589?text=${encodeURIComponent(`Hola JJ Tech, deseo consultar el estado de mi cita técnica ${b.id} programada para el ${b.preferredDate || b.date}.`)}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm w-full"
                      >
                        <Phone size={14} />
                        <span>Consultar Estado por WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
