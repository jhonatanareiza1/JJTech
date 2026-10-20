// ==========================================
// JJ TECH - TALUHA HOME STRATEGIC ALLIANCE & SHOWCASE
// ==========================================
import React, { useState } from 'react';
import { 
  Sparkles, 
  Armchair, 
  Layers, 
  Volume2, 
  Play, 
  ExternalLink, 
  MessageCircle,
  Instagram,
  CheckCircle
} from 'lucide-react';
import { COMPANY_INFO } from '../../config/constants';
import './TaluhaAlliance.scss';

export const TaluhaAlliance = ({ setActiveTab }) => {
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  const videoProjects = [
    {
      id: "vid-1",
      title: "Salas de Cine en Casa Dolby Atmos",
      category: "Entretenimiento & Taluha Home",
      duration: "0:45",
      location: "El Poblado, Medellín",
      thumbnail: "/assets/images/banners-domotica-cinema.jpg",
      description: "Instalación de sistema 7.2 Klipsch con proyector 4K Samsung y butacas motorizadas Taluha Home en cuero."
    },
    {
      id: "vid-2",
      title: "Master Suite Automatizada con Vista Panorámica",
      category: "Domótica & Cortinas",
      duration: "0:30",
      location: "Llanogrande, Rionegro",
      thumbnail: "/assets/images/master-bedroom-night.jpg",
      description: "Cortinas blackout y Sheer Elegance motorizadas sincronizadas con iluminación lineal cálida y control de voz."
    },
    {
      id: "vid-3",
      title: "Seguridad Integral Perimetral y CCTV 4K",
      category: "Seguridad & CCTV",
      duration: "0:35",
      location: "Guatapé, Antioquia",
      thumbnail: "/assets/images/installation-technician.jpg",
      description: "Cámaras ColorVu con detección de intrusos por IA, cerraduras biométricas y control de accesos."
    }
  ];

  return (
    <section className="section taluha-alliance-section">
      <div className="container">
        {/* Partnership Header */}
        <div className="partnership-box glass-card">
          <div className="partnership-grid">
            <div className="partnership-info">
              <div className="alliance-pill">
                <Sparkles size={14} className="spark" />
                <span>ALIANZA ESTRATÉGICA DE ALTO NIVEL</span>
              </div>
              <h2 className="partnership-title">
                JJ TECH & <span>TALUHA HOME</span>
              </h2>
              <p className="partnership-desc">
                Unimos la más alta ingeniería en automatización, domótica y seguridad electrónica con el diseño mobiliario, cortinas de alta gama, paneles acústicos y confort de <strong>Taluha Home</strong>. El resultado: espacios inteligentes con estética contemporánea insuperable.
              </p>

              <div className="partner-capabilities">
                <div className="cap-item">
                  <Armchair size={18} className="cap-icon" />
                  <span>Sillones VIP Reclinables para Cines Privados</span>
                </div>
                <div className="cap-item">
                  <Layers size={18} className="cap-icon" />
                  <span>Cortinas Motorizadas, Sábanas y Textilería de Lujo</span>
                </div>
                <div className="cap-item">
                  <Volume2 size={18} className="cap-icon" />
                  <span>Paneles Acústicos Decorativos y Cielo Estrellado</span>
                </div>
              </div>

              <div className="partnership-actions">
                <button 
                  className="btn btn-accent"
                  onClick={() => {
                    setActiveTab('cotizador');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <Sparkles size={18} />
                  <span>Cotizar Proyecto Integral</span>
                </button>
                <a 
                  href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent("Hola JJ Tech, me interesa conocer las soluciones integradas con TALUHA HOME para salas de cine y mobiliario.")}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <MessageCircle size={18} />
                  <span>Consultar Catálogo Taluha</span>
                </a>
              </div>
            </div>

            <div className="partnership-visual">
              <div className="visual-frame">
                <img 
                  src="/assets/images/brand-moodboard-services.jpg" 
                  alt="Alianza JJ Tech y Taluha Home" 
                />
                <div className="stamp-overlay">
                  <span>EXPERIENCIA 360°</span>
                  <strong>DISEÑO + DOMÓTICA</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Gallery Preview */}
        <div className="video-showcase-header">
          <div>
            <span className="badge-sub">PROYECTOS EN VÍDEO</span>
            <h3 className="sub-heading">Recorridos de Obras Finalizadas</h3>
          </div>
          <a 
            href={COMPANY_INFO.socials.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="instagram-feed-btn"
          >
            <Instagram size={18} />
            <span>Ver más en Instagram @jjtech_domotica</span>
          </a>
        </div>

        <div className="video-projects-grid">
          {videoProjects.map((project) => (
            <div key={project.id} className="video-project-card glass-card">
              <div className="video-thumb-container" onClick={() => setActiveVideoModal(project)}>
                <img src={project.thumbnail} alt={project.title} />
                <div className="play-button-overlay">
                  <div className="play-circle">
                    <Play size={20} fill="#060911" color="#060911" />
                  </div>
                </div>
                <span className="duration-pill">{project.duration}</span>
                <span className="location-pill">📍 {project.location}</span>
              </div>

              <div className="video-card-info">
                <span className="project-category">{project.category}</span>
                <h4 className="project-title">{project.title}</h4>
                <p className="project-desc">{project.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Video Simulation Modal */}
        {activeVideoModal && (
          <div className="modal-overlay" onClick={() => setActiveVideoModal(null)}>
            <div className="modal-content video-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="video-player-mock">
                <img src={activeVideoModal.thumbnail} alt={activeVideoModal.title} className="video-full-img" />
                <div className="mock-playback-ui">
                  <div className="pulse-beacon">
                    <Play size={36} fill="#00E5FF" color="#00E5FF" />
                  </div>
                  <h3>{activeVideoModal.title}</h3>
                  <p>📍 {activeVideoModal.location} • Proyecto Oficial JJ Tech</p>
                  <span className="badge-demo">Demostración Multimedia HD</span>
                </div>
              </div>
              <div className="modal-footer-action">
                <button className="btn btn-outline" onClick={() => setActiveVideoModal(null)}>
                  Cerrar
                </button>
                <a 
                  href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(`Hola JJ Tech, vi el proyecto de vídeo "${activeVideoModal.title}" y deseo una cotización similar.`)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <MessageCircle size={18} />
                  <span>Cotizar Este Proyecto por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
