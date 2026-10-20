// ==========================================
// JJ TECH - CORPORATE FOOTER
// ==========================================
import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  Youtube, 
  ShieldCheck, 
  Award, 
  Clock, 
  Headphones,
  ExternalLink
} from 'lucide-react';
import { COMPANY_INFO } from '../../config/constants';
import './Footer.scss';

export const Footer = ({ setActiveTab }) => {
  return (
    <footer className="footer-main">
      {/* Value Proposition Badges */}
      <div className="footer-badges-bar">
        <div className="container badges-grid">
          <div className="badge-card">
            <ShieldCheck className="badge-icon" size={26} />
            <div>
              <h4>Seguridad Garantizada</h4>
              <p>Equipos certificados y respaldo integral</p>
            </div>
          </div>
          <div className="badge-card">
            <Award className="badge-icon" size={26} />
            <div>
              <h4>Tecnología de Punta</h4>
              <p>Compatibilidad con Alexa y Google Home</p>
            </div>
          </div>
          <div className="badge-card">
            <Clock className="badge-icon" size={26} />
            <div>
              <h4>Diseño 3D Previo</h4>
              <p>Sin sorpresas. Sin improvisaciones</p>
            </div>
          </div>
          <div className="badge-card">
            <Headphones className="badge-icon" size={26} />
            <div>
              <h4>Soporte Técnico Local</h4>
              <p>Atención directa en Medellín y Antioquia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-content">
        <div className="container footer-columns">
          {/* Column 1: Brand & Bio */}
          <div className="footer-col col-brand">
            <div className="footer-logo">
              <span className="j-mark">JJ</span>
              <span className="brand-title">TECH</span>
            </div>
            <p className="footer-bio">
              Líderes en integración de domótica residencial, centros de entretenimiento cinematográficos, cortinas motorizadas y sistemas de seguridad avanzada en Medellín y todo el departamento de Antioquia.
            </p>
            <div className="taluha-partnership-pill">
              <span className="spark">✨</span>
              <span>En alianza estratégica con <strong>TALUHA HOME</strong></span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h3 className="col-title">Navegación</h3>
            <ul className="footer-links">
              <li><button onClick={() => { setActiveTab('catalogo'); window.scrollTo(0,0); }}>Catálogo & Tienda</button></li>
              <li><button onClick={() => { setActiveTab('simulador'); window.scrollTo(0,0); }}>Simulador Domótico en Vivo</button></li>
              <li><button onClick={() => { setActiveTab('cotizador'); window.scrollTo(0,0); }}>Calculadora de Cotización</button></li>
              <li><button onClick={() => { setActiveTab('visualizador'); window.scrollTo(0,0); }}>Proyección 3D vs REAL</button></li>
              <li><button onClick={() => { setActiveTab('galeria'); window.scrollTo(0,0); }}>Obras Reales & FAQ</button></li>
              <li><button onClick={() => { setActiveTab('servicios'); window.scrollTo(0,0); }}>Agendar Mantenimiento</button></li>
            </ul>
          </div>

          {/* Column 3: Soluciones */}
          <div className="footer-col">
            <h3 className="col-title">Soluciones</h3>
            <ul className="footer-links">
              <li><span>Cortinas & Persianas Motorizadas</span></li>
              <li><span>Home Theaters & Salas de Cine</span></li>
              <li><span>Audio Multiroom & Acústica</span></li>
              <li><span>Iluminación Lineal COB & Escenas</span></li>
              <li><span>CCTV 4K & Cerraduras Biométricas</span></li>
              <li><span>Redes & Servidores NAS CCTV</span></li>
            </ul>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="footer-col col-contact">
            <h3 className="col-title">Contacto Directo</h3>
            <ul className="contact-list">
              <li>
                <MapPin size={18} className="contact-icon" />
                <span>{COMPANY_INFO.location}</span>
              </li>
              <li>
                <Phone size={18} className="contact-icon" />
                <a href={`https://wa.me/${COMPANY_INFO.whatsappRaw}`} target="_blank" rel="noopener noreferrer">
                  {COMPANY_INFO.phone} (WhatsApp Oficial)
                </a>
              </li>
              <li>
                <Mail size={18} className="contact-icon" />
                <a href={`mailto:${COMPANY_INFO.email}`}>
                  {COMPANY_INFO.email}
                </a>
              </li>
            </ul>

            <div className="social-links">
              <a href={COMPANY_INFO.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-btn">
                <Instagram size={18} />
              </a>
              <a href={COMPANY_INFO.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-btn">
                <Facebook size={18} />
              </a>
              <a href={COMPANY_INFO.socials.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-btn">
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container bottom-inner">
          <p>© {new Date().getFullYear()} JJ Tech - Seguridad | Domótica | Diseño. Todos los derechos reservados. Medellín, Colombia.</p>
          <div className="coverage-text">
            <span>Cobertura: Medellín • Poblado • Laureles • Envigado • Rionegro • Guatapé</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
