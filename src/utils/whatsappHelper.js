// ==========================================
// JJ TECH - WHATSAPP INTEGRATION HELPER
// ==========================================
import { COMPANY_INFO } from '../config/constants';
import { formatCOP } from './formatters';

export const createWhatsAppOrderLink = (cartItems, total, customerInfo = {}) => {
  let message = `*¡Hola JJ Tech! Quisiera realizar un pedido desde la web oficial*\n\n`;
  if (customerInfo.name) {
    message += `*Cliente:* ${customerInfo.name}\n`;
  }
  if (customerInfo.city) {
    message += `*Ubicación:* ${customerInfo.city}\n`;
  }
  message += `\n*Detalle de Productos:*\n`;

  cartItems.forEach((item, index) => {
    message += `${index + 1}. *${item.name}* (x${item.quantity}) - ${formatCOP(item.price * item.quantity)}\n`;
  });

  message += `\n*TOTAL ESTIMADO:* ${formatCOP(total)}\n`;
  message += `\n_Quedo atento a la confirmación de inventario y método de pago._`;

  return `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(message)}`;
};

export const createWhatsAppQuoteLink = (quoteData) => {
  const {
    selectedItems,
    location,
    materialsTotal,
    laborTotal,
    marginAmount,
    travelCost,
    technicalVisitCost,
    subtotalWithMargin,
    grandTotal,
    customerName,
    notes
  } = quoteData;

  let message = `*¡Hola JJ Tech! Deseo formalizar una Cotización Inteligente*\n\n`;
  if (customerName) message += `*Cliente:* ${customerName}\n`;
  message += `*Ubicación de Instalación:* ${location.city} (${location.zone})\n\n`;

  message += `*ITEMS SELECCIONADOS:*\n`;
  selectedItems.forEach((item, idx) => {
    message += `${idx + 1}. ${item.name} (x${item.quantity}) - ${formatCOP(item.price * item.quantity)}\n`;
  });

  message += `\n*RESUMEN DE COSTES Y PRECIOS:*\n`;
  message += `• Costo Equipos/Materiales: ${formatCOP(materialsTotal)}\n`;
  message += `• Mano de Obra Especializada: ${formatCOP(laborTotal)}\n`;
  message += `• Margen Comercial (50% libre de imp.): ${formatCOP(marginAmount)}\n`;
  message += `• Viáticos de Desplazamiento (${location.city}): ${formatCOP(travelCost)}\n`;
  message += `• Visita Técnica Inicial: ${formatCOP(technicalVisitCost)}\n`;
  message += `• *Bono 100% Descuento Visita Técnica:* -${formatCOP(technicalVisitCost)} (Abonable al contratar)\n`;
  message += `\n*VALOR FINAL DEL PROYECTO:* ${formatCOP(grandTotal)}\n`;

  if (notes) {
    message += `\n*Observaciones:* ${notes}\n`;
  }

  message += `\n_Generado desde la plataforma web JJ Tech Medellín._`;

  return `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(message)}`;
};

export const createWhatsAppMaintenanceLink = (bookingData) => {
  const { serviceType, name, phone, city, address, preferredDate, preferredTime, issueDescription } = bookingData;
  let message = `*¡Hola JJ Tech! Deseo agendar un Mantenimiento / Servicio Técnico*\n\n`;
  message += `*Servicio:* ${serviceType}\n`;
  message += `*Solicitante:* ${name}\n`;
  message += `*Teléfono:* ${phone}\n`;
  message += `*Ciudad/Municipio:* ${city}\n`;
  message += `*Dirección:* ${address}\n`;
  message += `*Fecha Solicitada:* ${preferredDate} (${preferredTime})\n`;
  message += `*Descripción del caso:* ${issueDescription}\n\n`;
  message += `_Por favor confirmar disponibilidad del equipo técnico._`;

  return `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(message)}`;
};

export const createDirectWhatsAppInquiry = (topic = "Asesoría General") => {
  const message = `*¡Hola JJ Tech!* Vengo de su página web y me gustaría recibir asesoría sobre *${topic}* en Medellín / Antioquia.`;
  return `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(message)}`;
};
