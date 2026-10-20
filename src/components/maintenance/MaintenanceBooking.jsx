// ==========================================
// JJ TECH - MAINTENANCE & SERVICE BOOKING
// ==========================================
import React, { useState } from 'react';
import { 
  Wrench, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Send, 
  Cpu, 
  ShieldCheck, 
  Tv, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { MAINTENANCE_SERVICES } from '../../services/seedData';
import { LOCATIONS_ANTIOQUIA } from '../../config/constants';
import { formatCOP } from '../../utils/formatters';
import { createWhatsAppMaintenanceLink } from '../../utils/whatsappHelper';
import './MaintenanceBooking.scss';

export const MaintenanceBooking = () => {
  const { createBooking } = useData();
  const { currentUser } = useAuth();

  const [selectedServiceId, setSelectedServiceId] = useState(MAINTENANCE_SERVICES[0].id);
  const [selectedLocationCity, setSelectedLocationCity] = useState(LOCATIONS_ANTIOQUIA[0].city);
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('09:00 AM');
  const [name, setName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [submittedBooking, setSubmittedBooking] = useState(null);

  const selectedService = MAINTENANCE_SERVICES.find(s => s.id === selectedServiceId) || MAINTENANCE_SERVICES[0];

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert("Por favor completa tu nombre, teléfono y dirección.");
      return;
    }

    const bookingPayload = {
      serviceType: selectedService.name,
      servicePrice: selectedService.price,
      name: name,
      phone: phone,
      city: selectedLocationCity,
      address: address,
      preferredDate: date,
      preferredTime: timeSlot,
      issueDescription: description || "Mantenimiento preventivo programado."
    };

    const saved = createBooking(bookingPayload);
    setSubmittedBooking(saved);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Also open WhatsApp directly
    const whatsappLink = createWhatsAppMaintenanceLink(bookingPayload);
    window.open(whatsappLink, '_blank');
  };

  return (
    <section className="section maintenance-section">
      <div className="container">
        <div className="section__header">
          <span className="badge-sub">SOPORTE TÉCNICO & PUESTA A PUNTO</span>
          <h2 className="title">
            Agendamiento de Mantenimientos <br />
            <span className="highlight">Equipos de Cómputo, Domótica y CCTV</span>
          </h2>
          <p className="subtitle">
            Ingenieros y técnicos expertos en terreno en Medellín, Valle de Aburrá y municipios de Antioquia. Servicios preventivos, correctivos y visitas de diagnóstico.
          </p>
        </div>

        <div className="maintenance-layout">
          {/* Left Column: Services Showcase */}
          <div className="services-selector-column">
            <h3 className="column-title">1. Elige el Servicio Requerido</h3>
            
            <div className="services-options-list">
              {MAINTENANCE_SERVICES.map((serv) => {
                const isSelected = serv.id === selectedServiceId;
                return (
                  <div 
                    key={serv.id} 
                    className={`service-option-card glass-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedServiceId(serv.id)}
                  >
                    <div className="card-top">
                      <div className="icon-title">
                        <Wrench size={18} className="service-icon" />
                        <h4>{serv.name}</h4>
                      </div>
                      <span className="service-price">{formatCOP(serv.price)}</span>
                    </div>

                    <p className="service-desc">{serv.description}</p>

                    <div className="card-bottom">
                      <span className="duration-tag">⏱️ Duración estimada: {serv.durationHours} horas</span>
                      {serv.id === 'serv-mant-04' && (
                        <span className="bonus-tag">✨ 100% deducible si contratas</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coverage notification */}
            <div className="coverage-notice-card glass-card">
              <MapPin size={20} className="pin-icon" />
              <div>
                <h4>Desplazamiento a Domicilio</h4>
                <p>Cubrimos Medellín (Poblado, Laureles, Belén, Envigado), Rionegro, Llanogrande, El Peñol, Guatapé y Santa Fe de Antioquia.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Appointment Form */}
          <div className="booking-form-column glass-card">
            {submittedBooking ? (
              <div className="booking-success-card">
                <div className="success-icon-circle">
                  <CheckCircle2 size={42} />
                </div>
                <h3>¡Cita Solicitada con Éxito!</h3>
                <p>
                  Tu solicitud con número <strong>{submittedBooking.id}</strong> para <strong>{submittedBooking.serviceType}</strong> ha sido agendada.
                </p>
                
                <div className="booking-summary-box">
                  <div className="summary-line">
                    <span>Fecha y Hora:</span>
                    <strong>{submittedBooking.preferredDate} ({submittedBooking.preferredTime})</strong>
                  </div>
                  <div className="summary-line">
                    <span>Ubicación:</span>
                    <strong>{submittedBooking.city} - {submittedBooking.address}</strong>
                  </div>
                  <div className="summary-line">
                    <span>Tarifa Base del Servicio:</span>
                    <strong>{formatCOP(submittedBooking.servicePrice)}</strong>
                  </div>
                </div>

                <p className="sub-note">
                  Se ha generado un chat en WhatsApp con nuestro coordinador técnico para confirmar tu franja horaria.
                </p>

                <button 
                  className="btn btn-outline w-full"
                  onClick={() => setSubmittedBooking(null)}
                >
                  Agendar Otro Servicio
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="booking-form">
                <div className="form-header">
                  <Calendar size={20} className="icon-cyan" />
                  <div>
                    <h3>2. Programa Fecha y Dirección</h3>
                    <p>Servicio seleccionado: <strong>{selectedService.name}</strong></p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Tu Nombre Completo *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ej. Santiago Mejía"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Teléfono Celular / WhatsApp *</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="+57 300 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Ciudad / Municipio en Antioquia *</label>
                    <select 
                      value={selectedLocationCity}
                      onChange={(e) => setSelectedLocationCity(e.target.value)}
                    >
                      {LOCATIONS_ANTIOQUIA.map((l) => (
                        <option key={l.id} value={l.city}>
                          {l.city} ({l.zone})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Dirección Exacta (con unidad/apto) *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Cra 43A # 1-50, Edificio..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Fecha Preferida *</label>
                    <input 
                      type="date" 
                      required 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="form-group">
                    <label>Franja Horaria *</label>
                    <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                      <option value="08:00 AM">08:00 AM - 10:00 AM</option>
                      <option value="10:00 AM">10:00 AM - 12:00 M</option>
                      <option value="02:00 PM">02:00 PM - 04:00 PM</option>
                      <option value="04:00 PM">04:00 PM - 06:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Describe los síntomas del problema o el requerimiento:</label>
                  <textarea 
                    rows="3" 
                    placeholder="Ej. El NVR dejó de grabar, el servidor hace ruidos extraños o las luces del living no responden a la app..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-whatsapp w-full submit-booking-btn">
                  <Send size={18} />
                  <span>Confirmar y Enviar Solicitud por WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
