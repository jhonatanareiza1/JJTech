// ==========================================
// JJ TECH - AUTHENTICATION MODALS (CLIENT & ADMIN)
// ==========================================
import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
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
  const [city, setCity] = useState(LOCATIONS_ANTIOQUIA[0].city);
  const [error, setError] = useState(null);

  const { loginClient, registerClient, quickDemoLogin, authLoading } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (tab === 'login') {
      const res = await loginClient(email, password);
      if (res.success) onClose();
      else setError(res.error);
    } else {
      const res = await registerClient(name, email, password, city);
      if (res.success) onClose();
      else setError(res.error);
    }
  };

  const handleDemoClient = () => {
    quickDemoLogin('client');
    onClose();
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
          <h3>{tab === 'login' ? 'Bienvenido a JJ Tech' : 'Crea tu Cuenta de Cliente'}</h3>
          <p>
            {tab === 'login' 
              ? 'Accede para guardar cotizaciones y gestionar tus citas.' 
              : 'Regístrate para guardar cotizaciones y recibir soporte en Medellín.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tab-switch">
          <button 
            className={`switch-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
          >
            Iniciar Sesión
          </button>
          <button 
            className={`switch-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => setTab('register')}
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
                <label>Ciudad / Municipio en Antioquia *</label>
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
                placeholder="cliente@ejemplo.com"
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={authLoading}>
            <span>{tab === 'login' ? 'Entrar a Mi Cuenta' : 'Registrarme'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-demo-shortcut">
          <span className="divider-text">o prueba con un clic</span>
          <button className="btn btn-outline w-full demo-client-btn" onClick={handleDemoClient}>
            <Sparkles size={16} />
            <span>Acceso Instantáneo como Cliente Demo</span>
          </button>
        </div>

        <div className="auth-switch-to-admin">
          <span>¿Eres del equipo técnico o gerencia?</span>
          <button onClick={() => { onClose(); onSwitchToAdmin(); }}>
            Acceso Administrativo
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@jjtech.com');
  const [password, setPassword] = useState('admin');
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

  const handleFastAdminLogin = async () => {
    const res = await loginAdmin('admin@jjtech.com', 'admin');
    if (res.success) {
      onClose();
      if (onLoginSuccess) onLoginSuccess();
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

        <div className="quick-admin-login-bar">
          <button className="btn btn-outline w-full fast-admin-btn" onClick={handleFastAdminLogin}>
            <Sparkles size={16} />
            <span>Ingresar con 1 Clic (Credenciales Demo admin/admin)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
