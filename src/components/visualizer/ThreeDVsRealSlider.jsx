// ==========================================
// JJ TECH - 3D VS REAL INTERACTIVE VISUALIZER & 3D ROOM HOTSPOTS
// ==========================================
import React, { useState, useRef } from 'react';
import { 
  Eye, 
  Layers, 
  Sparkles, 
  ArrowLeftRight, 
  CheckCircle2, 
  Send, 
  Sliders, 
  Maximize2,
  Info,
  X,
  Compass,
  Check,
  Calculator
} from 'lucide-react';
import { COMPANY_INFO } from '../../config/constants';
import { soundFx } from '../../utils/audioSynth';
import './ThreeDVsRealSlider.scss';

export const ThreeDVsRealSlider = ({ setActiveTab }) => {
  const [activeSpaceId, setActiveSpaceId] = useState('cinema');
  const [viewMode, setViewMode] = useState('slider'); // 'slider' or 'hotspots'
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const containerRef = useRef(null);

  const spaces = [
    {
      id: 'cinema',
      name: 'Sala de Cine Privada',
      category: 'Entretenimiento & Acústica',
      render3DDesc: 'Modelado volumétrico 3D, simulación acústica y cálculo de ángulos visuales.',
      realDesc: 'Instalación terminada: Sistema Dolby Atmos Klipsch, pantalla 4K y sillones Taluha Home.',
      img3D: '/assets/images/banners-domotica-cinema.jpg',
      imgReal: '/assets/images/brand-moodboard-services.jpg',
      specs: [
        'Renderizado previo con texturas de madera acústica',
        'Cálculo de tiro de proyector láser 4K Ultra HD',
        'Iluminación indirecta perimetral regulable',
        'Acabado exacto sin modificaciones de obra'
      ],
      hotspots: [
        {
          id: 'h-cin-1',
          x: 50,
          y: 72,
          title: 'Proyector Láser 4K Samsung',
          category: 'Cine & Proyección',
          price: '$ 14.800.000 COP',
          description: 'Tiro ultracorto que proyecta hasta 130 pulgadas a escasos centímetros de la pared con láser triple.',
          features: ['2800 lúmenes ANSI', 'Resolución 4K nativa', 'Sistema de audio potente integrado']
        },
        {
          id: 'h-cin-2',
          x: 48,
          y: 15,
          title: 'Cielo Estrellado & Techo Acústico',
          category: 'Acústica & Diseño',
          price: '$ 5.200.000 COP',
          description: 'Iluminación de micro fibra óptica con constelaciones simuladas y paneles de absorción de eco.',
          features: ['Constelaciones programables', 'Paneles fonoabsorbentes', 'Calibración acústica RT60']
        },
        {
          id: 'h-cin-3',
          x: 18,
          y: 42,
          title: 'Altavoces Klipsch Reference 7.2',
          category: 'Audio Envolvente',
          price: '$ 9.450.000 COP',
          description: 'Torres y altavoces Atmos empotrables con dispersión uniforme de 90°x90°.',
          features: ['Sonido Dolby Atmos & DTS:X', 'Subwoofers de 12"', 'Receptor AV 8K Multizona']
        },
        {
          id: 'h-cin-4',
          x: 78,
          y: 78,
          title: 'Sillones VIP Reclinables Taluha Home',
          category: 'Mobiliario de Lujo',
          price: '$ 3.200.000 COP c/u',
          description: 'Mobiliario ergonómico premium tapizado en cuero con reclinación eléctrica silenciosa.',
          features: ['Cargador USB integrado', 'Soporte lumbar ergonómico', 'Portavasos iluminado']
        }
      ]
    },
    {
      id: 'bedroom',
      name: 'Master Bedroom Medellín',
      category: 'Domótica & Cortinas',
      render3DDesc: 'Proyección 3D de cortineros con iluminación lineal COB y vista a la ciudad.',
      realDesc: 'Resultado real: Cortinas Blackout motorizadas sincronizadas con iluminación tenue.',
      img3D: '/assets/images/hero-smart-home.jpg',
      imgReal: '/assets/images/master-bedroom-night.jpg',
      specs: [
        'Aislamiento lumínico al 100% con rieles silenciosos',
        'Control de encendido de luces gradual para despertar',
        'Integración con asistente de voz y panel de pared',
        'Estética moderna en tonos oscuros y texturas de lino'
      ],
      hotspots: [
        {
          id: 'h-bed-1',
          x: 82,
          y: 35,
          title: 'Cortina Blackout Motorizada Premium',
          category: 'Cortinas & Persianas',
          price: '$ 1.350.000 COP',
          description: 'Tejido 100% oscurecimiento con riel motorizado controlado desde smartphone o comando de voz.',
          features: ['Aislamiento térmico y acústico', 'Motores ultra silenciosos <30dB', 'Horarios programables']
        },
        {
          id: 'h-bed-2',
          x: 46,
          y: 18,
          title: 'Iluminación Lineal COB Smart 24V',
          category: 'Iluminación Inteligente',
          price: '$ 395.000 COP',
          description: 'Luz continua de 528 LEDs por metro sin puntos visibles en cielo falso y cabecero.',
          features: ['Atenuación suave sin parpadeo', 'Temperatura cálida 2700K', 'Sincronización con despertador']
        },
        {
          id: 'h-bed-3',
          x: 20,
          y: 65,
          title: 'Interruptor Táctil Cristal Templado',
          category: 'Control de Pared',
          price: '$ 185.000 COP',
          description: 'Panel táctil retroiluminado para activar la escena "Buenas Noches" con 1 toque.',
          features: ['Cristal de seguridad anti-rayas', 'Conexión WiFi directa', 'Compatible con Alexa y Google']
        }
      ]
    },
    {
      id: 'terrace',
      name: 'Terraza & Fachada Inteligente',
      category: 'Seguridad & Pérgola Bioclimática',
      render3DDesc: 'Simulación tridimensional de cobertura de cámaras 4K y pérgolas motorizadas.',
      realDesc: 'Obra concluida: CCTV perimetral sin cables a la vista y control de persianas exteriores.',
      img3D: '/assets/images/brand-moodboard-services.jpg',
      imgReal: '/assets/images/installation-technician.jpg',
      specs: [
        'Cámaras ColorVu ubicadas en puntos estratégicos',
        'Motorización de persianas exteriores con resistencia al viento',
        'Iluminación exterior cálida automatizada por horario',
        'Monitoreo centralizado desde smartphone'
      ],
      hotspots: [
        {
          id: 'h-ter-1',
          x: 18,
          y: 38,
          title: 'Cámara Exterior 4K ColorVu Hikvision',
          category: 'CCTV & Seguridad',
          price: '$ 4.850.000 COP (Kit 8)',
          description: 'Vigilancia 24/7 a todo color con inteligencia artificial para personas y vehículos.',
          features: ['Visión nocturna a color real', 'Carcasa metálica IP67', 'Grabación continua en NVR 4TB']
        },
        {
          id: 'h-ter-2',
          x: 75,
          y: 28,
          title: 'Pérgola Bioclimática Motorizada',
          category: 'Arquitectura Exterior',
          price: '$ 8.900.000 COP',
          description: 'Lamas orientables de aluminio extruido que regulan luz, ventilación y protegen de la lluvia.',
          features: ['Sensor de lluvia y viento', 'Iluminación LED perimetral integrada', 'Control remoto multicanal']
        },
        {
          id: 'h-ter-3',
          x: 90,
          y: 72,
          title: 'Cerradura Biométrica SmartPro Exterior',
          category: 'Control de Acceso',
          price: '$ 1.290.000 COP',
          description: 'Cerradura de alta seguridad con lector de huella dactilar semiconductor 3D y visor de cámara.',
          features: ['Huella, PIN, tarjeta y app', 'Resistencia a la intemperie IP65', 'Registro de ingresos en tiempo real']
        }
      ]
    }
  ];

  const currentSpace = spaces.find(s => s.id === activeSpaceId) || spaces[0];

  // Mouse & Touch Drag Handlers for Split Slider
  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleHotspotClick = (hotspot) => {
    soundFx.playSwitch(850);
    setSelectedHotspot(hotspot);
  };

  return (
    <section className="section visualizer-section">
      <div className="container">
        <div className="section__header">
          <span className="badge-sub">MODELADO 3D PREVIO A LA INSTALACIÓN</span>
          <h2 className="title">
            Visualización Interactiva <br />
            <span className="highlight">"3D vs REAL" & Maqueta con Puntos de Interés</span>
          </h2>
          <p className="subtitle">
            Lo proyectamos primero en 3D para que veas con precisión milimétrica cómo quedará tu sala de cine, dormitorio o seguridad antes de realizar cualquier intervención física.
          </p>
        </div>

        {/* View Mode Switcher (Split Slider vs 3D Hotspot Explorer) */}
        <div className="visualizer-mode-bar">
          <div className="mode-pill-container">
            <button 
              className={`mode-btn ${viewMode === 'slider' ? 'active' : ''}`}
              onClick={() => {
                soundFx.playSwitch(600);
                setViewMode('slider');
              }}
            >
              <ArrowLeftRight size={16} />
              <span>Comparador 3D vs REAL (Slider)</span>
            </button>
            <button 
              className={`mode-btn ${viewMode === 'hotspots' ? 'active' : ''}`}
              onClick={() => {
                soundFx.playSwitch(600);
                setViewMode('hotspots');
              }}
            >
              <Compass size={16} />
              <span>Maqueta 3D con Puntos Interactivos</span>
            </button>
          </div>
        </div>

        {/* Space Selector Tabs */}
        <div className="visualizer-tabs">
          {spaces.map((space) => (
            <button 
              key={space.id}
              className={`visualizer-tab ${activeSpaceId === space.id ? 'active' : ''}`}
              onClick={() => {
                soundFx.playSwitch(700);
                setActiveSpaceId(space.id);
                setSliderPosition(50);
                setSelectedHotspot(null);
              }}
            >
              <Layers size={16} />
              <span>{space.name}</span>
            </button>
          ))}
        </div>

        {/* Main Visualizer Stage */}
        <div className="comparison-card glass-card">
          {viewMode === 'slider' ? (
            /* 1. SLIDER COMPARISON MODE */
            <div 
              className="comparison-stage"
              ref={containerRef}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* Real Image (Base Background) */}
              <div className="image-layer real-layer">
                <img src={currentSpace.imgReal} alt={`${currentSpace.name} Resultado Real`} />
                <div className="layer-tag tag-real">
                  <span className="dot-green"></span>
                  <strong>RESULTADO FINAL REAL</strong>
                </div>
                <div className="layer-caption right-caption">
                  <p>{currentSpace.realDesc}</p>
                </div>
              </div>

              {/* 3D Render Image (Clipped Layer on Top) */}
              <div 
                className="image-layer render-layer"
                style={{ width: `${sliderPosition}%` }}
              >
                <img src={currentSpace.img3D} alt={`${currentSpace.name} Diseño 3D`} />
                <div className="layer-tag tag-3d">
                  <span className="dot-cyan"></span>
                  <strong>PROYECTO EN RENDER 3D</strong>
                </div>
                <div className="layer-caption left-caption">
                  <p>{currentSpace.render3DDesc}</p>
                </div>
              </div>

              {/* Draggable Divider Handle */}
              <div 
                className="slider-handle"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="handle-line"></div>
                <div className="handle-knob">
                  <ArrowLeftRight size={18} />
                </div>
              </div>
            </div>
          ) : (
            /* 2. 3D HOTSPOT EXPLORER MODE */
            <div className="hotspot-stage">
              <img src={currentSpace.img3D} alt={`${currentSpace.name} Maqueta 3D`} className="hotspot-base-img" />
              <div className="hotspot-overlay-hint">
                <Sparkles size={16} />
                <span>Haz clic en los puntos luminosos para inspeccionar los equipos proyectados en 3D</span>
              </div>

              {/* Interactive Hotspots */}
              {currentSpace.hotspots.map((h) => (
                <div 
                  key={h.id}
                  className={`spatial-hotspot ${selectedHotspot?.id === h.id ? 'selected' : ''}`}
                  style={{ top: `${h.y}%`, left: `${h.x}%` }}
                  onClick={() => handleHotspotClick(h)}
                >
                  <span className="beacon-ring"></span>
                  <div className="hotspot-dot">
                    <Info size={14} />
                  </div>
                  <span className="hotspot-tooltip">{h.title}</span>
                </div>
              ))}

              {/* Selected Hotspot Floating Detail Card */}
              {selectedHotspot && (
                <div className="hotspot-detail-popup glass-card" onClick={(e) => e.stopPropagation()}>
                  <button className="popup-close" onClick={() => setSelectedHotspot(null)}>
                    <X size={16} />
                  </button>
                  <span className="pop-category">{selectedHotspot.category}</span>
                  <h4>{selectedHotspot.title}</h4>
                  <strong className="pop-price">{selectedHotspot.price}</strong>
                  <p className="pop-desc">{selectedHotspot.description}</p>
                  
                  <ul className="pop-features">
                    {selectedHotspot.features.map((f, i) => (
                      <li key={i}>
                        <Check size={12} className="check-icon" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    className="btn btn-accent btn-sm w-full"
                    onClick={() => {
                      soundFx.playSuccess();
                      setActiveTab('cotizador');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <Calculator size={14} />
                    <span>Incluir en mi Cotización</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bottom Information & Specs */}
          <div className="comparison-footer">
            <div className="space-info">
              <span className="space-category">{currentSpace.category}</span>
              <h3>{currentSpace.name}</h3>
              <div className="specs-list">
                {currentSpace.specs.map((spec, idx) => (
                  <div key={idx} className="spec-pill">
                    <CheckCircle2 size={15} className="spec-check" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-cta">
              <button 
                className="btn btn-accent"
                onClick={() => {
                  soundFx.playSuccess();
                  setActiveTab('cotizador');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <Sparkles size={18} />
                <span>Cotizar con Diseño 3D</span>
              </button>

              <a 
                href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(`Hola JJ Tech, me gustó mucho la proyección del espacio "${currentSpace.name}". Quisiera agendar una visita técnica de levantamiento en Medellín.`)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <Send size={16} />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
