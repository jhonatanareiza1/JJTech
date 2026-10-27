// ==========================================
// JJ TECH - AUTHENTICATION MODALS (CLIENT & ADMIN)
// ==========================================
import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone,
  ShieldCheck, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LOCATIONS_ANTIOQUIA } from '../../config/constants';
import './AuthModals.scss';

export const ClientAuthModal = ({ isOpen, onClose, onSwitchToAdmin }) => {
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(LOCATIONS_ANTIOQUIA[0].city);
  const [error, setError] = useState(null);

  const { loginClient, registerClient, authLoading } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (tab === 'login') {
      const res = await loginClient(email, password);
      if (res.success) onClose();
      else setError(res.error);
    } else {
      const res = await registerClient(name, email, password, phone, city);
      if (res.success) onClose();
      else setError(res.error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="auth-modal-header">
          <div className="auth-brand-glyph">
            <span>JJ</span>
          </div>
          <h3>{tab === 'login' ? 'Iniciar Sesión en JJ Tech' : 'Crea tu Cuenta de Usuario'}</h3>
          <p>
            {tab === 'login' 
              ? 'Ingresa tu correo y contraseña para acceder a tus cotizaciones y servicios.' 
              : 'Regístrate con tus datos para guardar cotizaciones y programar instalaciones en Antioquia.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tab-switch">
          <button 
            type="button"
            className={`switch-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(null); }}
          >
            Iniciar Sesión
          </button>
          <button 
            type="button"
            className={`switch-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(null); }}
          >
            Crear Cuenta
          </button>
        </div>

        {error && (
          <div className="auth-error-pill">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {tab === 'register' && (
            <>
              <div className="form-group">
                <label>Nombre y Apellido *</label>
                <div className="input-with-icon">
                  <User size={16} className="field-icon" />
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. Juan Camilo Arango"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Teléfono / WhatsApp *</label>
                <div className="input-with-icon">
                  <Phone size={16} className="field-icon" />
                  <input 
                    type="tel" 
                    required 
                    placeholder="Ej. 302 576 9589"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Municipio en Antioquia *</label>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  {LOCATIONS_ANTIOQUIA.map((l) => (
                    <option key={l.id} value={l.city}>{l.city}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Correo Electrónico *</label>
            <div className="input-with-icon">
              <Mail size={16} className="field-icon" />
              <input 
                type="email" 
                required 
                placeholder="tu.correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña *</label>
            <div className="input-with-icon">
              <Lock size={16} className="field-icon" />
              <input 
                type="password" 
                required 
                placeholder="Ingresa tu clave de seguridad"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={authLoading}>
            <span>{tab === 'login' ? 'Entrar a Mi Cuenta' : 'Crear Mi Cuenta'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-switch-to-admin">
          <span>¿Equipo técnico o gerencial de JJ Tech?</span>
          <button type="button" onClick={() => { onClose(); onSwitchToAdmin(); }}>
            Acceso Administrativo
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { loginAdmin, authLoading } = useAuth();

  if (!isOpen) return null;

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await loginAdmin(email, password);
    if (res.success) {
      onClose();
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content admin-auth-box" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="auth-modal-header">
          <div className="admin-lock-glyph">
            <ShieldCheck size={32} />
          </div>
          <h3>Acceso Administrativo</h3>
          <p>Consola de Moodboard Financiero e Inventarios JJ Tech</p>
        </div>

        {error && (
          <div className="auth-error-pill">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdminSubmit} className="auth-form">
          <div className="form-group">
            <label>Correo de Administrador</label>
            <div className="input-with-icon">
              <Mail size={16} className="field-icon" />
              <input 
                type="email" 
                required 
                placeholder="correo@jjtech.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Clave de Seguridad</label>
            <div className="input-with-icon">
              <Lock size={16} className="field-icon" />
              <input 
                type="password" 
                required 
                placeholder="Ingresa tu clave de acceso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-accent w-full" disabled={authLoading}>
            <ShieldCheck size={18} />
            <span>Ingresar a la Consola</span>
          </button>
        </form>
      </div>
    </div>
  );
};
