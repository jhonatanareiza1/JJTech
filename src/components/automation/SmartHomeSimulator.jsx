// ==========================================
// JJ TECH - SMART HOME AUTOMATION SIMULATOR
// ==========================================
import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sliders, 
  Tv, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Mic, 
  Sun, 
  Moon, 
  Sparkles, 
  Camera, 
  Volume2, 
  Thermometer, 
  Wifi, 
  Power,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  VolumeX
} from 'lucide-react';
import { soundFx } from '../../utils/audioSynth';
import { CctvMonitorModal } from './CctvMonitorModal';
import './SmartHomeSimulator.scss';

export const SmartHomeSimulator = () => {
  const [isCctvModalOpen, setIsCctvModalOpen] = useState(false);
  // Current active room
  const [activeRoom, setActiveRoom] = useState('living'); // 'living', 'cinema', 'master', 'terrace'

  // Room states
  const [roomStates, setRoomStates] = useState({
    living: {
      lightsOn: true,
      brightness: 75,
      lightColor: '#00E5FF', // JJ Tech Cyan
      curtainsOpenPercent: 80,
      audioPlaying: false,
      audioVolume: 40,
      temperature: 22
    },
    cinema: {
      lightsOn: false,
      brightness: 15,
      lightColor: '#0070F3',
      curtainsOpenPercent: 0, // 100% Blackout
      audioPlaying: true,
      audioVolume: 85,
      temperature: 20
    },
    master: {
      lightsOn: true,
      brightness: 45,
      lightColor: '#FFB74D', // Warm luxury
      curtainsOpenPercent: 50,
      audioPlaying: false,
      audioVolume: 20,
      temperature: 21
    },
    terrace: {
      lightsOn: true,
      brightness: 90,
      lightColor: '#FFFFFF',
      curtainsOpenPercent: 100, // Louver open
      audioPlaying: false,
      audioVolume: 30,
      temperature: 23
    }
  });

  // Global Security System State
  const [securityArmed, setSecurityArmed] = useState(true);
  const [doorLocked, setDoorLocked] = useState(true);
  const [cctvLiveView, setCctvLiveView] = useState(true);

  // Voice Assistant Simulation
  const [voiceLog, setVoiceLog] = useState("Listo para escuchar. Selecciona un comando o activa un escenario.");
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Audio feedback state
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const toggleSoundFx = () => {
    const next = !isAudioEnabled;
    setIsAudioEnabled(next);
    soundFx.toggleSound(next);
  };

  const currentRoomState = roomStates[activeRoom];

  const updateCurrentRoom = (updates) => {
    soundFx.playSwitch();
    setRoomStates(prev => ({
      ...prev,
      [activeRoom]: {
        ...prev[activeRoom],
        ...updates
      }
    }));
  };

  // Voice command execution
  const executeVoiceCommand = (command, actionCallback) => {
    setIsVoiceActive(true);
    soundFx.playVoiceChime();
    setVoiceLog(`🎙️ Escuchando: "${command}"...`);

    setTimeout(() => {
      actionCallback();
      soundFx.playSuccess();
      setVoiceLog(`✅ Ejecutado por JJ Tech Home Engine: "${command}"`);
      setIsVoiceActive(false);
    }, 800);
  };

  // Preset voice commands
  const handleCinemaModeCommand = () => {
    executeVoiceCommand("Alexa, activa Modo Cine en casa", () => {
      setActiveRoom('cinema');
      setRoomStates(prev => ({
        ...prev,
        cinema: {
          ...prev.cinema,
          lightsOn: true,
          brightness: 12,
          lightColor: '#0070F3',
          curtainsOpenPercent: 0,
          audioPlaying: true,
          audioVolume: 80
        }
      }));
    });
  };

  const handleGoodNightCommand = () => {
    executeVoiceCommand("Hey Google, buenas noches JJ Tech", () => {
      setSecurityArmed(true);
      setDoorLocked(true);
      setRoomStates(prev => ({
        living: { ...prev.living, lightsOn: false, curtainsOpenPercent: 0, audioPlaying: false },
        cinema: { ...prev.cinema, lightsOn: false, curtainsOpenPercent: 0, audioPlaying: false },
        master: { ...prev.master, lightsOn: true, brightness: 10, lightColor: '#FFB74D', curtainsOpenPercent: 0 },
        terrace: { ...prev.terrace, lightsOn: false }
      }));
    });
  };

  const handleAllLightsOn = () => {
    executeVoiceCommand("Alexa, enciende todas las luces al 100%", () => {
      setRoomStates(prev => ({
        living: { ...prev.living, lightsOn: true, brightness: 100 },
        cinema: { ...prev.cinema, lightsOn: true, brightness: 100 },
        master: { ...prev.master, lightsOn: true, brightness: 100 },
        terrace: { ...prev.terrace, lightsOn: true, brightness: 100 }
      }));
    });
  };

  // Room Image mapping
  const roomBackgrounds = {
    living: '/assets/images/hero-smart-home.jpg',
    cinema: '/assets/images/banners-domotica-cinema.jpg',
    master: '/assets/images/master-bedroom-night.jpg',
    terrace: '/assets/images/installation-technician.jpg'
  };

  return (
    <section className="section simulator-section">
      <div className="container">
        <div className="section__header">
          <span className="badge-sub">MÓDULO INTERACTIVO EN TIEMPO REAL</span>
          <h2 className="title">
            Control de Automatización <br />
            <span className="highlight">Simulador Residencial JJ Tech</span>
          </h2>
          <p className="subtitle">
            Interactúa directamente con la consola inteligente: regula la intensidad de luces, mueve cortinas motorizadas, activa el cine en casa y gestiona la seguridad perimetral.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="simulator-grid">
          {/* Left / Top: Interactive Room Visualizer */}
          <div className="simulator-stage glass-card">
            <div className="stage-header">
              <div className="room-tabs">
                <button 
                  className={`room-tab ${activeRoom === 'living' ? 'active' : ''}`}
                  onClick={() => setActiveRoom('living')}
                >
                  Sala Principal
                </button>
                <button 
                  className={`room-tab ${activeRoom === 'cinema' ? 'active' : ''}`}
                  onClick={() => setActiveRoom('cinema')}
                >
                  🎬 Sala de Cine (Taluha)
                </button>
                <button 
                  className={`room-tab ${activeRoom === 'master' ? 'active' : ''}`}
                  onClick={() => setActiveRoom('master')}
                >
                  Master Suite
                </button>
                <button 
                  className={`room-tab ${activeRoom === 'terrace' ? 'active' : ''}`}
                  onClick={() => setActiveRoom('terrace')}
                >
                  Terraza & CCTV
                </button>
              </div>

              <div className="system-pill">
                <Wifi size={14} className="wifi-icon" />
                <span>JJ Tech Smart Hub • Online</span>
              </div>
            </div>

            {/* Room Visual Canvas */}
            <div className="room-viewport">
              <img 
                src={roomBackgrounds[activeRoom]} 
                alt="Espacio Inteligente" 
                className="viewport-bg-img"
              />

              {/* Dynamic Light Overlay */}
              <div 
                className="lighting-effect-overlay"
                style={{
                  opacity: currentRoomState.lightsOn ? (currentRoomState.brightness / 100) * 0.7 : 0.85,
                  backgroundColor: currentRoomState.lightsOn ? currentRoomState.lightColor : '#040711',
                  mixBlendMode: currentRoomState.lightsOn ? 'soft-light' : 'multiply'
                }}
              ></div>

              {/* Simulated Curtain Drape Indicator */}
              <div className="curtain-visual-indicator">
                <div 
                  className="curtain-sheet left"
                  style={{ width: `${(100 - currentRoomState.curtainsOpenPercent) / 2}%` }}
                ></div>
                <div 
                  className="curtain-sheet right"
                  style={{ width: `${(100 - currentRoomState.curtainsOpenPercent) / 2}%` }}
                ></div>
              </div>

              {/* Live Status HUD Overlay */}
              <div className="viewport-hud">
                <div className="hud-badge temp">
                  <Thermometer size={14} />
                  <span>{currentRoomState.temperature}°C Clima</span>
                </div>
                <div className="hud-badge light">
                  <Lightbulb size={14} />
                  <span>{currentRoomState.lightsOn ? `${currentRoomState.brightness}% Luz` : 'Luces Apagadas'}</span>
                </div>
                <div className="hud-badge curtains">
                  <Sliders size={14} />
                  <span>{currentRoomState.curtainsOpenPercent}% Cortinas</span>
                </div>
                {activeRoom === 'cinema' && currentRoomState.audioPlaying && (
                  <div className="hud-badge audio">
                    <Volume2 size={14} />
                    <span>Dolby Atmos 7.2 Activo</span>
                  </div>
                )}
              </div>
            </div>

            {/* Voice Assistant Strip */}
            <div className="voice-assistant-bar">
              <div className="voice-icon-box">
                <Mic size={18} className={isVoiceActive ? 'pulsing' : ''} />
              </div>
              <div className="voice-info">
                <span className="voice-label">Asistente de Voz Compatible (Alexa / Google Home):</span>
                <p className="voice-text">{voiceLog}</p>
              </div>
              <div className="voice-presets">
                <button className="voice-chip" onClick={handleCinemaModeCommand}>
                  "Alexa, Modo Cine"
                </button>
                <button className="voice-chip" onClick={handleGoodNightCommand}>
                  "Google, Buenas Noches"
                </button>
                <button className="voice-chip" onClick={handleAllLightsOn}>
                  "Alexa, Luces al 100%"
                </button>
              </div>
            </div>
          </div>

          {/* Right: Wall Mounted Touch Tablet UI */}
          <div className="simulator-console glass-card">
            <div className="console-tablet-frame">
              {/* Tablet Topbar */}
              <div className="tablet-topbar">
                <div className="tablet-brand">
                  <span className="tablet-logo">JJ TECH</span>
                  <span className="tablet-zone">Medellín, CO</span>
                </div>
                <div className="tablet-status">
                  <button 
                    className="tablet-sound-toggle" 
                    onClick={toggleSoundFx}
                    title={isAudioEnabled ? "Silenciar audio táctil" : "Activar audio táctil"}
                  >
                    {isAudioEnabled ? <Volume2 size={14} className="icon-cyan" /> : <VolumeX size={14} className="icon-muted" />}
                  </button>
                  <Wifi size={14} />
                  <span>22°C</span>
                  <span className="battery-pill">AC 100%</span>
                </div>
              </div>

              {/* Console Body */}
              <div className="console-body">
                {/* 1. Lighting Control */}
                <div className="control-card">
                  <div className="control-header">
                    <div className="control-title-group">
                      <Lightbulb size={18} className="icon-cyan" />
                      <h4>Iluminación Inteligente</h4>
                    </div>
                    <button 
                      className={`power-toggle ${currentRoomState.lightsOn ? 'on' : 'off'}`}
                      onClick={() => updateCurrentRoom({ lightsOn: !currentRoomState.lightsOn })}
                    >
                      <Power size={14} />
                      <span>{currentRoomState.lightsOn ? 'ENCENDIDA' : 'APAGADA'}</span>
                    </button>
                  </div>

                  {currentRoomState.lightsOn && (
                    <div className="control-details">
                      <div className="slider-row">
                        <span>Intensidad Dimmer: {currentRoomState.brightness}%</span>
                        <input 
                          type="range" 
                          min="5" 
                          max="100" 
                          value={currentRoomState.brightness} 
                          onChange={(e) => updateCurrentRoom({ brightness: Number(e.target.value) })}
                          className="range-slider"
                        />
                      </div>

                      <div className="scene-color-row">
                        <span className="row-label">Escenas de Color:</span>
                        <div className="color-dots">
                          <button 
                            className={`color-dot warm ${currentRoomState.lightColor === '#FFB74D' ? 'selected' : ''}`}
                            title="Blanco Cálido 2700K"
                            onClick={() => updateCurrentRoom({ lightColor: '#FFB74D' })}
                          ></button>
                          <button 
                            className={`color-dot cool ${currentRoomState.lightColor === '#FFFFFF' ? 'selected' : ''}`}
                            title="Blanco Neutro 6500K"
                            onClick={() => updateCurrentRoom({ lightColor: '#FFFFFF' })}
                          ></button>
                          <button 
                            className={`color-dot cyan ${currentRoomState.lightColor === '#00E5FF' ? 'selected' : ''}`}
                            title="Azul JJ Tech"
                            onClick={() => updateCurrentRoom({ lightColor: '#00E5FF' })}
                          ></button>
                          <button 
                            className={`color-dot purple ${currentRoomState.lightColor === '#A855F7' ? 'selected' : ''}`}
                            title="Modo Fiesta Púrpura"
                            onClick={() => updateCurrentRoom({ lightColor: '#A855F7' })}
                          ></button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Motorized Curtains */}
                <div className="control-card">
                  <div className="control-header">
                    <div className="control-title-group">
                      <Sliders size={18} className="icon-cyan" />
                      <h4>Cortinas & Persianas Motorizadas</h4>
                    </div>
                    <span className="status-val">{currentRoomState.curtainsOpenPercent}% Abierta</span>
                  </div>

                  <div className="control-details">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={currentRoomState.curtainsOpenPercent} 
                      onChange={(e) => updateCurrentRoom({ curtainsOpenPercent: Number(e.target.value) })}
                      className="range-slider"
                    />
                    <div className="preset-buttons">
                      <button 
                        className="preset-btn"
                        onClick={() => updateCurrentRoom({ curtainsOpenPercent: 0 })}
                      >
                        Blackout Total (0%)
                      </button>
                      <button 
                        className="preset-btn"
                        onClick={() => updateCurrentRoom({ curtainsOpenPercent: 50 })}
                      >
                        Semi-Abierta (50%)
                      </button>
                      <button 
                        className="preset-btn"
                        onClick={() => updateCurrentRoom({ curtainsOpenPercent: 100 })}
                      >
                        Abierta (100%)
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Entertainment & Audio */}
                <div className="control-card">
                  <div className="control-header">
                    <div className="control-title-group">
                      <Tv size={18} className="icon-cyan" />
                      <h4>Audio Multiroom & Cine</h4>
                    </div>
                    <button 
                      className={`power-toggle ${currentRoomState.audioPlaying ? 'on' : 'off'}`}
                      onClick={() => updateCurrentRoom({ audioPlaying: !currentRoomState.audioPlaying })}
                    >
                      <Volume2 size={14} />
                      <span>{currentRoomState.audioPlaying ? 'SONANDO' : 'MUTED'}</span>
                    </button>
                  </div>

                  {currentRoomState.audioPlaying && (
                    <div className="control-details">
                      <div className="slider-row">
                        <span>Volumen de Salida: {currentRoomState.audioVolume}%</span>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={currentRoomState.audioVolume} 
                          onChange={(e) => updateCurrentRoom({ audioVolume: Number(e.target.value) })}
                          className="range-slider"
                        />
                      </div>
                      <span className="audio-mode-tag">🔊 Sistema Klipsch 7.2 • Streaming Spotify Connect</span>
                    </div>
                  )}
                </div>

                {/* 4. Perimetral Security & Smart Lock */}
                <div className="control-card security-card">
                  <div className="control-header">
                    <div className="control-title-group">
                      <ShieldCheck size={18} className="icon-cyan" />
                      <h4>Seguridad Avanzada & Acceso</h4>
                    </div>
                  </div>

                  <div className="security-controls-grid">
                    <button 
                      className={`sec-button ${securityArmed ? 'armed' : 'disarmed'}`}
                      onClick={() => {
                        const next = !securityArmed;
                        setSecurityArmed(next);
                        soundFx.playSecurityChime(next);
                      }}
                    >
                      {securityArmed ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                      <div>
                        <strong>{securityArmed ? 'Alarma ARMADA' : 'Alarma DESARMADA'}</strong>
                        <span>{securityArmed ? 'Sensores activos 24/7' : 'Modo en casa'}</span>
                      </div>
                    </button>

                    <button 
                      className={`sec-button ${doorLocked ? 'locked' : 'unlocked'}`}
                      onClick={() => {
                        const next = !doorLocked;
                        setDoorLocked(next);
                        soundFx.playSwitch(350);
                      }}
                    >
                      {doorLocked ? <Lock size={20} /> : <Unlock size={20} />}
                      <div>
                        <strong>{doorLocked ? 'Cerradura BLOQUEADA' : 'Cerradura ABIERTA'}</strong>
                        <span>Biométrica JJ Pro</span>
                      </div>
                    </button>
                  </div>

                  <button 
                    className="cctv-modal-trigger-btn"
                    onClick={() => {
                      soundFx.playSwitch(600);
                      setIsCctvModalOpen(true);
                    }}
                  >
                    <Camera size={16} className="icon-cyan" />
                    <span>Ver Monitoreo CCTV 4K en Vivo (4 Cámaras)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Multi-Camera NVR Modal */}
        <CctvMonitorModal 
          isOpen={isCctvModalOpen}
          onClose={() => setIsCctvModalOpen(false)}
        />
      </div>
    </section>
  );
};
