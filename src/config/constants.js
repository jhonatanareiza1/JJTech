// ==========================================
// JJ TECH - CONSTANTS & BUSINESS CONFIGURATION
// ==========================================

export const COMPANY_INFO = {
  name: "JJ Tech",
  tagline: "Seguridad | Domótica | Diseño",
  slogan: "Seguridad, Confort y Tecnología en un solo lugar",
  location: "Medellín, Colombia",
  address: "Medellín, Antioquia, Colombia",
  phone: "+57 302 576 9589",
  whatsappRaw: "573025769589",
  secondaryPhone: "+57 301 123 4567",
  email: "contacto@jjtech.com",
  adminEmail: "admin@jjtech.com",
  socials: {
    instagram: "https://instagram.com/jjtech_domotica",
    facebook: "https://facebook.com/jjtechcolombia",
    tiktok: "https://tiktok.com/@jjtech_domotica",
    youtube: "https://youtube.com/@jjtech_seguridad"
  },
  partner: {
    name: "Taluha Home",
    role: "Alianza Estratégica en Muebles, Cortinas y Acabados de Alta Gama"
  }
};

// Cotizador y Reglas de Negocio Financieras
export const QUOTATION_RULES = {
  profitMarginPercent: 50, // 50% de margen de ganancia libre de impuestos
  baseLaborPointCost: 65000, // COP por punto de instalación/calibración
  discountVisitOnAcceptance: true // 100% de abono/descuento de visita técnica al aceptar el proyecto
};

import { 
  EXTENDED_ANTIOQUIA_LOCATIONS, 
  ANTIOQUIA_SUBREGIONS, 
  MARKET_BENCHMARKS_2026, 
  TOLL_RATES_ANTIOQUIA_2026,
  computeMarketViaticos 
} from '../utils/logisticsEngine';

export { 
  ANTIOQUIA_SUBREGIONS, 
  MARKET_BENCHMARKS_2026, 
  TOLL_RATES_ANTIOQUIA_2026,
  computeMarketViaticos 
};

// Ubicaciones geográficas en Antioquia (9 subregiones completas con cálculo real de mercado 2026)
export const LOCATIONS_ANTIOQUIA = EXTENDED_ANTIOQUIA_LOCATIONS;

export const PRODUCT_CATEGORIES = [
  { id: "all", label: "Todos los Productos" },
  { id: "cortinas", label: "Cortinas y Persianas Motorizadas" },
  { id: "entretenimiento", label: "Salas de Cine & Audio (Taluha Home)" },
  { id: "domotica", label: "Domótica & Iluminación Inteligente" },
  { id: "seguridad", label: "Seguridad & Cerraduras Biométricas" },
  { id: "computo", label: "Cómputo, Servidores & Redes" }
];
