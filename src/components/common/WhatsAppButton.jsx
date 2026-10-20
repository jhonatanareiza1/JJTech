// ==========================================
// JJ TECH - FLOATING WHATSAPP BUTTON & QUICK MODAL
// ==========================================
import React, { useState } from 'react';
import { MessageCircle, X, Send, Shield, Sparkles, MapPin } from 'lucide-react';
import { COMPANY_INFO } from '../../config/constants';
import { createDirectWhatsAppInquiry } from '../../utils/whatsappHelper';
import './WhatsAppButton.scss';

export const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const quickTopics = [
    "Cotización de Domótica Residencial",
    "Salas de Cine & Audio Taluha Home",
    "Cámaras de Seguridad y CCTV 4K",
    "Visita Técnica en Medellín o Guatapé",
    "Mantenimiento de Cómputo"
  ];

  const handleSendCustom = (e) => {
    e.preventDefault();
    const topic = message.trim() || "Asesoría General";
    window.open(createDirectWhatsAppInquiry(topic), '_blank');
    setMessage('');
    setIsOpen(false);
  };

  const handleQuickTopic = (topic) => {
    window.open(createDirectWhatsAppInquiry(topic), '_blank');
    setIsOpen(false);
  };

  return (
    <div className="whatsapp-floating-wrapper">
      {isOpen && (
        <div className="whatsapp-chat-card">
          <div className="chat-card-header">
            <div className="chat-agent-info">
              <div className="agent-avatar">
                <span className="j-badge">JJ</span>
                <span className="online-indicator"></span>
              </div>
              <div className="agent-meta">
                <h4>Asesoría JJ Tech</h4>
                <p><MapPin size={11} /> Medellín, Colombia • En Línea</p>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="chat-card-body">
            <div className="incoming-bubble">
              <p>
                ¡Hola! 👋 Bienvenido a <strong>JJ Tech</strong>. ¿En qué proyecto de seguridad, domótica o diseño de entretenimiento te podemos asesorar hoy?
              </p>
              <span className="bubble-time">Hoy {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <div className="quick-topics-label">
              <Sparkles size={13} />
              <span>Opciones rápidas de atención:</span>
            </div>

            <div className="quick-topics-list">
              {quickTopics.map((topic, i) => (
                <button 
                  key={i} 
                  className="quick-topic-chip"
                  onClick={() => handleQuickTopic(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <form className="chat-card-footer" onSubmit={handleSendCustom}>
            <input 
              type="text" 
              placeholder="Escribe tu consulta..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="send-btn" aria-label="Enviar por WhatsApp">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        className="whatsapp-fab-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir chat de WhatsApp JJ Tech"
      >
        <span className="fab-pulse-ring"></span>
        <MessageCircle size={28} />
        <span className="fab-tooltip">Chat Oficial (+57 302 576 9589)</span>
      </button>
    </div>
  );
};
