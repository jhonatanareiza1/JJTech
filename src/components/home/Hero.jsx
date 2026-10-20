// ==========================================
// JJ TECH - HERO SECTION
// ==========================================
import React from 'react';
import { 
  Sparkles, 
  Calculator, 
  Tv, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sliders,
  Eye
} from 'lucide-react';
import './Hero.scss';

export const Hero = ({ setActiveTab }) => {
  return (
    <section className="hero-section">
      <div className="hero-ambient-glow"></div>
      
      <div className="container hero-container">
        <div className="hero-grid">
          {/* Left Content */}
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="pulse-dot"></span>
              <span className="badge-text">DOMÓTICA & SEGURIDAD DE ALTO NIVEL EN MEDELLÍN</span>
            </div>

            <h1 className="hero-title">
              SEGURIDAD, CONFORT <br />
              <span className="hero-gradient-text">Y TECNOLOGÍA</span> <br />
              <span className="hero-subline">EN UN SOLO LUGAR</span>
            </h1>

            <p className="hero-lead">
              Transformamos residencias y centros de entretenimiento en Medellín y Antioquia con automatización inteligente, cortinas motorizadas, acústica de cine y sistemas de seguridad 4K con proyección 3D previa.
            </p>

            {/* Value Points */}
            <div className="hero-highlights">
              <div className="highlight-item">
                <CheckCircle2 size={18} className="check-icon" />
                <span><strong>Visita técnica 100% deducible</strong> al contratar</span>
              </div>
              <div className="highlight-item">
                <CheckCircle2 size={18} className="check-icon" />
                <span><strong>Margen comercial del 50%</strong> transparente y justo</span>
              </div>
              <div className="highlight-item">
                <CheckCircle2 size={18} className="check-icon" />
                <span><strong>Alianza oficial TALUHA HOME</strong> para cines y muebles</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hero-cta-group">
              <button 
                className="btn btn-accent btn-lg"
                onClick={() => setActiveTab('simulador')}
              >
                <Sliders size={20} />
                <span>Probar Domótica en Vivo</span>
              </button>

              <button 
                className="btn btn-outline btn-lg"
                onClick={() => setActiveTab('cotizador')}
              >
                <Calculator size={20} />
                <span>Cotizar con Viáticos</span>
              </button>

              <button 
                className="btn btn-outline btn-lg secondary-cta"
                onClick={() => setActiveTab('visualizador')}
              >
                <Eye size={20} />
                <span>3D vs REAL</span>
              </button>
            </div>
          </div>

          {/* Right Visual: Smart Home Showcase */}
          <div className="hero-visual">
            <div className="visual-card-wrapper">
              <div className="visual-image-frame">
                <img 
                  src="/assets/images/hero-smart-home.jpg" 
                  alt="JJ Tech Tu Hogar Inteligente Comenzó Aquí" 
                  className="hero-main-img"
                />
                <div className="image-overlay-gradient"></div>
              </div>

              {/* Floating Interactive Badge 1: Temperature & Climate */}
              <div className="floating-metric metric-climate">
                <div className="metric-icon-box">
                  <Sparkles size={18} />
                </div>
                <div>
                  <span className="metric-label">Clima Automatizado</span>
                  <strong className="metric-value">22°C • Confort Óptimo</strong>
                </div>
              </div>

              {/* Floating Interactive Badge 2: Security */}
              <div className="floating-metric metric-security">
                <div className="metric-icon-box security">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <span className="metric-label">Perímetro JJ Tech</span>
                  <strong className="metric-value">Sistema Armado & Activo</strong>
                </div>
              </div>

              {/* Floating Interactive Badge 3: 3D Preview */}
              <div className="floating-banner-bottom" onClick={() => setActiveTab('visualizador')}>
                <div className="banner-left">
                  <span className="tag">SIN SORPRESAS</span>
                  <h4>Lo diseñamos primero en 3D</h4>
                  <p>Para que veas exactamente cómo quedará tu espacio</p>
                </div>
                <div className="banner-arrow">
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
