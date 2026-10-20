// ==========================================
// JJ TECH - REAL PROJECTS SHOWCASE & FAQ ACCORDION
// ==========================================
import React, { useState, useMemo } from 'react';
import { 
  Camera, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  CheckCircle, 
  Send, 
  Calculator, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Eye, 
  Film, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { COMPANY_INFO } from '../../config/constants';
import { formatCOP } from '../../utils/formatters';
import { soundFx } from '../../utils/audioSynth';
import { useData } from '../../context/DataContext';
import './ProjectGallery.scss';

export const ProjectGallery = ({ setActiveTab }) => {
  const { projects = [] } = useData();
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [activeProjectModal, setActiveProjectModal] = useState(null);

  // FAQs
  const faqs = [
    {
      id: 1,
      q: '¿Qué sucede con el sistema domótico si se interrumpe la conexión a internet?',
      a: 'Nuestros sistemas JJ Tech se basan en arquitectura de comunicación local (Zigbee y red cableada NVR/LAN). Los interruptores de pared, controles remotos, sensores de presencia, cortinas y la grabación continua de seguridad siguen funcionando al 100% de manera autónoma, incluso sin conexión externa a internet.'
    },
    {
      id: 2,
      q: '¿Cómo funciona la regla de deducción de la Visita Técnica al contratar?',
      a: 'El valor de la visita técnica de diagnóstico y levantamiento 3D ($120.000 COP en Medellín o $250.000 COP en Guatapé) se descuenta y abona íntegramente al 100% en la factura final cuando decides ejecutar el proyecto con nosotros. ¡Tu asesoría inicial queda completamente gratis!'
    },
    {
      id: 3,
      q: '¿Qué marcas y fabricantes integran en centros de entretenimiento y seguridad?',
      a: 'Trabajamos exclusivamente con líderes globales certificados: Sony, Bose, Yamaha, Klipsch, Samsung en audio y proyección; Hikvision y Dahua en CCTV 4K; Tuya / SmartLife en automatización; y nuestra alianza oficial con TALUHA HOME para mobiliario VIP reclinable y textilería de lujo.'
    },
    {
      id: 4,
      q: '¿Tienen cobertura para casas de campo y fincas en Guatapé y el Oriente Antioqueño?',
      a: 'Sí. Contamos con cuadrillas de ingenieros e instaladores equipados con vehículos para atención en el Valle de San Nicolás (Rionegro, Llanogrande, El Retiro), la zona de embalses (Guatapé, El Peñol) y el Occidente Antioqueño (Santa Fe de Antioquia), con tarifas de viáticos transparentes calculadas en nuestro cotizador.'
    },
    {
      id: 5,
      q: '¿Ofrecen opciones de pago a cuotas o financiación en Colombia?',
      a: 'Por supuesto. Disponemos de simulador de pagos a cuotas (6, 12, 24 y 36 meses) con convenios directos con Bancolombia, Addi y todas las tarjetas de crédito sin trámites burocráticos.'
    }
  ];

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchZone = selectedZone === 'all' || p.zone === selectedZone;
      const matchType = selectedType === 'all' || p.category === selectedType;
      return matchZone && matchType;
    });
  }, [selectedZone, selectedType]);

  const toggleFaq = (id) => {
    soundFx.playSwitch(650);
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  return (
    <section className="section gallery-section">
      <div className="container">
        <div className="section__header">
          <span className="badge-sub">PORTAFOLIO DE OBRAS ENTREGADAS</span>
          <h2 className="title">
            Proyectos Reales en Medellín <br />
            <span className="highlight">y el Oriente Antioqueño</span>
          </h2>
          <p className="subtitle">
            Conoce casos de éxito ejecutados con ingeniería de precisión: salas de cine con Taluha Home, residencias campestres en Guatapé y penthouses inteligentes en El Poblado.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="gallery-filter-toolbar glass-card">
          <div className="filter-group">
            <span className="filter-label"><MapPin size={15} /> Zona Geográfica:</span>
            <div className="filter-chips">
              <button 
                className={`f-chip ${selectedZone === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedZone('all')}
              >
                Todas las Zonas
              </button>
              <button 
                className={`f-chip ${selectedZone === 'poblado' ? 'active' : ''}`}
                onClick={() => setSelectedZone('poblado')}
              >
                El Poblado
              </button>
              <button 
                className={`f-chip ${selectedZone === 'guatape' ? 'active' : ''}`}
                onClick={() => setSelectedZone('guatape')}
              >
                Guatapé
              </button>
              <button 
                className={`f-chip ${selectedZone === 'rionegro' ? 'active' : ''}`}
                onClick={() => setSelectedZone('rionegro')}
              >
                Llanogrande / Rionegro
              </button>
              <button 
                className={`f-chip ${selectedZone === 'laureles' ? 'active' : ''}`}
                onClick={() => setSelectedZone('laureles')}
              >
                Laureles
              </button>
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label"><Sliders size={15} /> Especialidad:</span>
            <div className="filter-chips">
              <button 
                className={`f-chip ${selectedType === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedType('all')}
              >
                Todas
              </button>
              <button 
                className={`f-chip ${selectedType === 'cine' ? 'active' : ''}`}
                onClick={() => setSelectedType('cine')}
              >
                Cine & Taluha Home
              </button>
              <button 
                className={`f-chip ${selectedType === 'seguridad' ? 'active' : ''}`}
                onClick={() => setSelectedType('seguridad')}
              >
                Seguridad 4K
              </button>
              <button 
                className={`f-chip ${selectedType === 'domotica' ? 'active' : ''}`}
                onClick={() => setSelectedType('domotica')}
              >
                Domótica & Confort
              </button>
            </div>
          </div>
        </div>

        {/* Projects Cards Grid */}
        <div className="projects-cards-grid">
          {filteredProjects.map((proj) => (
            <div key={proj.id} className="project-showcase-card glass-card">
              <div className="project-card-image-wrap" onClick={() => setActiveProjectModal(proj)}>
                <img src={proj.image} alt={proj.title} />
                <span className="project-badge-pill">{proj.categoryLabel}</span>
                <span className="project-zone-pill">📍 {proj.location}</span>
                <div className="card-hover-preview">
                  <Eye size={20} />
                  <span>Ver Ficha Técnica</span>
                </div>
              </div>

              <div className="project-card-content">
                <span className="proj-location">{proj.location}</span>
                <h3>{proj.title}</h3>
                <p className="proj-desc">{proj.description}</p>

                <div className="proj-equipment-preview">
                  <strong>Equipos Instalados:</strong>
                  <ul>
                    {proj.equipmentList.slice(0, 3).map((eq, i) => (
                      <li key={i}>
                        <Check size={12} className="check-cyan" />
                        <span>{eq}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="proj-footer-bar">
                  <div className="proj-investment">
                    <span>Inversión Aprox:</span>
                    <strong>{formatCOP(proj.investmentCOP)}</strong>
                  </div>

                  <button 
                    className="btn btn-accent btn-sm"
                    onClick={() => {
                      soundFx.playSuccess();
                      setActiveTab('cotizador');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <Calculator size={14} />
                    <span>Cotizar Similar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Detail Modal */}
        {activeProjectModal && (
          <div className="modal-overlay" onClick={() => setActiveProjectModal(null)}>
            <div className="modal-content project-detail-modal" onClick={(e) => e.stopPropagation()}>
              <div className="proj-modal-header">
                <span className="category-tag">{activeProjectModal.categoryLabel}</span>
                <h2>{activeProjectModal.title}</h2>
                <span className="loc-text">📍 {activeProjectModal.location}</span>
              </div>

              <div className="proj-modal-body">
                <img src={activeProjectModal.image} alt={activeProjectModal.title} className="proj-modal-banner" />
                <h4>{activeProjectModal.headline}</h4>
                <p className="full-desc">{activeProjectModal.description}</p>

                <div className="modal-equipment-box">
                  <h4>Especificaciones y Componentes del Proyecto:</h4>
                  <ul className="full-eq-list">
                    {activeProjectModal.equipmentList.map((eq, idx) => (
                      <li key={idx}>
                        <CheckCircle size={15} className="check-icon" />
                        <span>{eq}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="modal-budget-callout">
                  <div>
                    <span>Presupuesto Aproximado:</span>
                    <strong>{formatCOP(activeProjectModal.investmentCOP)}</strong>
                  </div>
                  <span className="legal-tag">Incluye diseño 3D, equipos, mano de obra y garantía</span>
                </div>
              </div>

              <div className="proj-modal-footer">
                <button className="btn btn-outline" onClick={() => setActiveProjectModal(null)}>
                  Cerrar
                </button>
                <a 
                  href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(`Hola JJ Tech, deseo solicitar un proyecto similar a "${activeProjectModal.title}" en Antioquia.`)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <Send size={16} />
                  <span>Consultar Este Proyecto por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Accordion Section */}
        <div className="faq-wrapper glass-card">
          <div className="faq-header">
            <HelpCircle size={22} className="icon-cyan" />
            <div>
              <h3>Preguntas Frecuentes sobre Domótica & Proyectos</h3>
              <p>Resolvemos las dudas más habituales sobre garantías, visitas técnicas y automatización.</p>
            </div>
          </div>

          <div className="faq-accordion-list">
            {faqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div key={faq.id} className={`faq-item ${isExpanded ? 'expanded' : ''}`}>
                  <button className="faq-question-btn" onClick={() => toggleFaq(faq.id)}>
                    <span>{faq.q}</span>
                    {isExpanded ? <ChevronUp size={18} className="chevron" /> : <ChevronDown size={18} className="chevron" />}
                  </button>
                  {isExpanded && (
                    <div className="faq-answer-panel">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
