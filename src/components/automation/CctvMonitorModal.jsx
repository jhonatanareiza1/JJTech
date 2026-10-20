// ==========================================
// JJ TECH - MULTI-CHANNEL CCTV 4K MONITOR MODAL
// ==========================================
import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  X, 
  Maximize2, 
  Eye, 
  Moon, 
  Sun, 
  ShieldAlert, 
  RotateCw, 
  Volume2, 
  Radio, 
  Sparkles,
  Download
} from 'lucide-react';
import { soundFx } from '../../utils/audioSynth';
import './CctvMonitorModal.scss';

export const CctvMonitorModal = ({ isOpen, onClose }) => {
  const [nightVision, setNightVision] = useState(false);
  const [selectedCam, setSelectedCam] = useState(null); // null = 4-grid, 1-4 = single cam
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const cameras = [
    {
      id: 1,
      name: 'CAM 01 - Entrada Principal & Cerradura',
      location: 'Acceso Peatonal',
      fps: 30,
      bitrate: '4.2 Mbps 4K',
      image: '/assets/images/hero-smart-home.jpg',
      motionDetected: false
    },
    {
      id: 2,
      name: 'CAM 02 - Fachada & Pérgola Bioclimática',
      location: 'Perímetro Exterior',
      fps: 30,
      bitrate: '3.8 Mbps 4K',
      image: '/assets/images/installation-technician.jpg',
      motionDetected: true
    },
    {
      id: 3,
      name: 'CAM 03 - Sala de Entretenimiento (Cine)',
      location: 'Zona Social Interior',
      fps: 30,
      bitrate: '4.5 Mbps 4K',
      image: '/assets/images/banners-domotica-cinema.jpg',
      motionDetected: false
    },
    {
      id: 4,
      name: 'CAM 04 - Master Suite & Ventanal',
      location: 'Habitación Principal',
      fps: 30,
      bitrate: '3.9 Mbps 4K',
      image: '/assets/images/master-bedroom-night.jpg',
      motionDetected: false
    }
  ];

  const handleSnapshot = (camName) => {
    soundFx.playSuccess();
    alert(`📸 Captura instantánea de alta resolución guardada para ${camName}`);
  };

  const displayedCameras = selectedCam ? cameras.filter(c => c.id === selectedCam) : cameras;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content cctv-monitor-modal" onClick={(e) => e.stopPropagation()}>
        {/* Top NVR Bar */}
        <div className="cctv-nvr-topbar">
          <div className="nvr-brand">
            <Radio size={18} className="nvr-pulse-dot" />
            <div>
              <h3>JJ Tech Security NVR 4K ColorVu</h3>
              <span className="nvr-sub">Sistema Hikvision / Dahua Pro • Medellín, Colombia</span>
            </div>
          </div>

          <div className="nvr-controls">
            <button 
              className={`nvr-btn ${nightVision ? 'active' : ''}`}
              onClick={() => {
                soundFx.playSwitch(500);
                setNightVision(!nightVision);
              }}
              title="Alternar Visión Nocturna Infrarroja"
            >
              {nightVision ? <Moon size={16} /> : <Sun size={16} />}
              <span>{nightVision ? 'Visión Nocturna IR' : 'ColorVu 24/7'}</span>
            </button>

            {selectedCam && (
              <button 
                className="nvr-btn"
                onClick={() => setSelectedCam(null)}
              >
                Ver 4 Cámaras
              </button>
            )}

            <button className="nvr-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Security Alert Banner */}
        <div className="cctv-motion-banner">
          <ShieldAlert size={16} />
          <span>Inteligencia Artificial Activa: Detección perimetral de personas y vehículos sin falsas alarmas.</span>
        </div>

        {/* Grid Cameras Feed */}
        <div className={`cctv-grid ${selectedCam ? 'single-feed' : 'quad-feed'}`}>
          {displayedCameras.map((cam) => (
            <div 
              key={cam.id} 
              className={`cam-box ${nightVision ? 'night-vision-filter' : ''}`}
              onClick={() => {
                if (!selectedCam) {
                  soundFx.playSwitch(600);
                  setSelectedCam(cam.id);
                }
              }}
            >
              <img src={cam.image} alt={cam.name} className="cam-video-feed" />

              {/* HUD Overlay */}
              <div className="cam-hud-top">
                <div className="rec-indicator">
                  <span className="rec-dot"></span>
                  <strong>REC</strong>
                </div>
                <span className="cam-name-tag">{cam.name}</span>
                <span className="cam-clock">{currentTime}</span>
              </div>

              {cam.motionDetected && (
                <div className="motion-detected-tag">
                  <ShieldAlert size={14} />
                  <span>MOVIMIENTO DETECTADO</span>
                </div>
              )}

              <div className="cam-hud-bottom">
                <span>{cam.bitrate} • {cam.fps} FPS</span>
                <div className="cam-action-icons">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSnapshot(cam.name);
                    }}
                    title="Capturar Foto"
                  >
                    <Camera size={14} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCam(selectedCam ? null : cam.id);
                    }}
                    title="Pantalla Completa"
                  >
                    <Maximize2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="cctv-nvr-bottombar">
          <div className="storage-status">
            <span>Almacenamiento NAS: <strong>3.2 TB / 4.0 TB Usados (Grabación continua 30 días)</strong></span>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            Cerrar Monitoreo
          </button>
        </div>
      </div>
    </div>
  );
};
