// ==========================================
// JJ TECH - SERVICES & PILLARS GRID
// ==========================================
import React from 'react';
import { 
  ShieldAlert, 
  Lightbulb, 
  Film, 
  Armchair, 
  Cpu, 
  Camera, 
  KeyRound, 
  Volume2, 
  SlidersHorizontal, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import './ServicesGrid.scss';

export const ServicesGrid = ({ setActiveTab }) => {
  const pillars = [
    {
      id: 'seguridad',
      title: 'Seguridad Electrónica',
      icon: ShieldAlert,
      tagline: 'Protección 24/7 para tu familia y patrimonio',
      items: [
        'Cámaras de seguridad 4K ColorVu y cableadas',
        'Cerraduras biométricas con huella, PIN y App',
        'Sistemas de alarma inalámbrica y perimetral',
        'Detectores de humo, fuego y fuga de gas',
        'Controles de acceso corporativo y residencial'
      ],
      actionLabel: 'Ver Productos de Seguridad',
      tabTarget: 'catalogo',
      accentColor: '#38BDF8',
      image: '/assets/images/installation-technician.jpg'
    },
    {
      id: 'domotica',
      title: 'Domótica Inteligente',
      icon: Lightbulb,
      tagline: 'Control total, confort absoluto y eficiencia energética',
      items: [
        'Iluminación lineal inteligente y tiras LED COB',
        'Cortinas y persianas enrollables motorizadas',
        'Control por comandos de voz (Alexa y Google Home)',
        'Interruptores touch de cristal templado y dimmers',
        'Automatización de escenarios (Cine, Noche, Fiesta)'
      ],
      actionLabel: 'Probar Simulador Interactivo',
      tabTarget: 'simulador',
      accentColor: '#00E5FF',
      image: '/assets/images/master-bedroom-night.jpg'
    },
    {
      id: 'entretenimiento',
      title: 'Centros de Entretenimiento',
      icon: Film,
      tagline: 'Vive la magia del cine sin salir de tu casa',
      items: [
        'Salas de cine privadas con audio Dolby Atmos 7.2',
        'Pantallas gigantes 4K y proyectores láser de tiro corto',
        'Audio multiroom Yamaha / Bose en toda la casa',
        'Paneles acústicos decorativos con cielo estrellado',
        'Marcas líderes: Sony, Bose, Yamaha, Klipsch'
      ],
      actionLabel: 'Ver Soluciones de Cine',
      tabTarget: 'catalogo',
      accentColor: '#60A5FA',
      image: '/assets/images/banners-domotica-cinema.jpg'
    },
    {
      id: 'diseno-taluha',
      title: 'Diseño Integral & Taluha Home',
      icon: Armchair,
      tagline: 'Acabados de lujo, mobiliario a medida y lencería premium',
      isPartner: true,
      items: [
        'Sillones reclinables ergonómicos para cine en casa',
        'Cortinas blackout y persianas Sheer Elegance',
        'Muebles flotantes para equipos audiovisuales',
        'Levantamiento arquitectónico y renderizado 3D',
        'Decoración de interiores y lencería de cama'
      ],
      actionLabel: 'Ver Alianza Taluha Home',
      tabTarget: 'catalogo',
      accentColor: '#F59E0B',
      image: '/assets/images/brand-moodboard-services.jpg'
    }
  ];

  return (
    <section className="section services-section">
      <div className="container">
        <div className="section__header">
          <span className="badge-sub">NUESTROS SERVICIOS ESPECIALIZADOS</span>
          <h2 className="title">
            Tecnología y Confort para un <br />
            <span className="highlight">Hogar Verdaderamente Inteligente</span>
          </h2>
          <p className="subtitle">
            Ingeniería de vanguardia aplicada a la seguridad, la automatización y el diseño de espacios de lujo en el Área Metropolitana de Medellín y el Oriente Antioqueño.
          </p>
        </div>

        <div className="pillars-grid">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.id} className="pillar-card glass-card">
                <div className="pillar-image-thumb">
                  <img src={pillar.image} alt={pillar.title} />
                  <div className="image-tint"></div>
                  {pillar.isPartner && (
                    <span className="partner-badge">
                      <Sparkles size={12} /> ALIANZA TALUHA HOME
                    </span>
                  )}
                </div>

                <div className="pillar-body">
                  <div className="pillar-header">
                    <div className="icon-wrapper" style={{ color: pillar.accentColor }}>
                      <Icon size={26} />
                    </div>
                    <div>
                      <h3 className="pillar-title">{pillar.title}</h3>
                      <p className="pillar-tagline">{pillar.tagline}</p>
                    </div>
                  </div>

                  <ul className="pillar-checklist">
                    {pillar.items.map((item, idx) => (
                      <li key={idx}>
                        <span className="bullet-dot" style={{ backgroundColor: pillar.accentColor }}></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pillar-footer">
                    <button 
                      className="pillar-action-btn"
                      onClick={() => {
                        setActiveTab(pillar.tabTarget);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <span>{pillar.actionLabel}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
