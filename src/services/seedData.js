// ==========================================
// JJ TECH - SEED DATA (PRODUCTOS, SERVICIOS Y ANALÍTICA FINANCIERA)
// ==========================================

export const INITIAL_PRODUCTS = [
  // Cortinas y Persianas Motorizadas
  {
    id: "prod-cort-01",
    name: "Motor Tubular WiFi Inteligente para Persianas",
    category: "cortinas",
    brand: "JJ Tech Automation",
    price: 680000,
    cost: 340000,
    stock: 24,
    rating: 4.9,
    image: "/assets/images/banners-domotica-cinema.jpg",
    shortDesc: "Motor silencioso de 35mm para automatización de persianas enrollables y romanas.",
    features: [
      "Control por app Tuya / Smart Life",
      "Compatible con Alexa y Google Assistant",
      "Finales de carrera electrónicos ajustables",
      "Capacidad de carga hasta 25kg"
    ],
    inQuoteCalculator: true,
    installationLaborPoints: 1
  },
  {
    id: "prod-cort-02",
    name: "Cortina Blackout Motorizada Premium a la Medida",
    category: "cortinas",
    brand: "JJ Tech & Taluha Home",
    price: 1350000,
    cost: 675000,
    stock: 15,
    rating: 5.0,
    image: "/assets/images/master-bedroom-night.jpg",
    shortDesc: "Tejido 100% oscurecimiento con riel motorizado ultra silencioso.",
    features: [
      "Aislamiento térmico y acústico",
      "Control remoto por radiofrecuencia y app",
      "Automatización programable de amanecer/atardecer",
      "Tejido ignífugo de textura europea"
    ],
    inQuoteCalculator: true,
    installationLaborPoints: 2
  },
  {
    id: "prod-cort-03",
    name: "Persiana Sheer Elegance Motorizada Dúo",
    category: "cortinas",
    brand: "Taluha Home",
    price: 1580000,
    cost: 790000,
    stock: 10,
    rating: 4.8,
    image: "/assets/images/installation-technician.jpg",
    shortDesc: "Diseño moderno con bandas de tela translúcida y blackout para graduación precisa de luz.",
    features: [
      "Motorización a batería recargable con panel solar opcional",
      "Control de inclinación micrométrica",
      "Compatible con asistentes de voz",
      "Acabado de alta gama para salas y dormitorios"
    ],
    inQuoteCalculator: true,
    installationLaborPoints: 2
  },

  // Centros de Entretenimiento (en alianza con Taluha Home)
  {
    id: "prod-ent-01",
    name: "Sistema Home Theater 7.2 Dolby Atmos Klipsch Reference",
    category: "entretenimiento",
    brand: "Klipsch",
    price: 9450000,
    cost: 4725000,
    stock: 6,
    rating: 5.0,
    image: "/assets/images/banners-domotica-cinema.jpg",
    shortDesc: "Sonido envolvente cinematográfico de alta fidelidad con calibración acústica profesional.",
    features: [
      "2 Torres frontales de alta definición",
      "2 Subwoofers activos de 12 pulgadas",
      "4 Altavoces de efectos y techos Atmos",
      "Receptor AV multizona 8K/4K 120Hz"
    ],
    inQuoteCalculator: true,
    installationLaborPoints: 5
  },
  {
    id: "prod-ent-02",
    name: "Sillón Reclinable Cinema VIP Taluha Home",
    category: "entretenimiento",
    brand: "Taluha Home",
    price: 3200000,
    cost: 1600000,
    stock: 12,
    rating: 4.9,
    image: "/assets/images/brand-moodboard-services.jpg",
    shortDesc: "Mobiliario ergonómico premium para salas de cine privadas con posavasos e iluminación LED.",
    features: [
      "Reclinación eléctrica motorizada suave",
      "Tapizado en cuero sintético de microfibra de alto tráfico",
      "Puerto de carga USB integrado",
      "Soporte lumbar ergonómico"
    ],
    inQuoteCalculator: true,
    installationLaborPoints: 1
  },
  {
    id: "prod-ent-03",
    name: "Proyector Láser 4K Ultra HD Samsung The Premiere",
    category: "entretenimiento",
    brand: "Samsung",
    price: 14800000,
    cost: 7400000,
    stock: 4,
    rating: 5.0,
    image: "/assets/images/hero-smart-home.jpg",
    shortDesc: "Tiro ultracorto para pantallas de hasta 130 pulgadas a centímetros de la pared.",
    features: [
      "Resolución 4K nativa con tecnología láser triple",
      "2800 lúmenes ANSI para visualización con luz",
      "Audio potente de 40W 4.2Ch integrado",
      "Smart TV Tizen con apps de streaming"
    ],
    inQuoteCalculator: true,
    installationLaborPoints: 3
  },

  // Domótica & Iluminación Inteligente
  {
    id: "prod-dom-01",
    name: "Kit Tira LED COB Smart RGB+CCT 24V (5 Metros)",
    category: "domotica",
    brand: "JJ Tech",
    price: 395000,
    cost: 197500,
    stock: 45,
    rating: 4.9,
    image: "/assets/images/master-bedroom-night.jpg",
    shortDesc: "Iluminación lineal continua sin puntos visibles para techos, cortineros y cabeceros.",
    features: [
      "Densidad de 528 LEDs por metro sin sombras",
      "16 millones de colores y blancos ajustables (2700K - 6500K)",
      "Control por app, control remoto y voz",
      "Sincronización con música y escenas de cine"
    ],
    inQuoteCalculator: true,
    installationLaborPoints: 1
  },
  {
    id: "prod-dom-02",
    name: "Interruptor Táctil Inteligente Triple Cristal Templado",
    category: "domotica",
    brand: "JJ Tech",
    price: 185000,
    cost: 92500,
    stock: 60,
    rating: 4.8,
    image: "/assets/images/banners-domotica-cinema.jpg",
    shortDesc: "Control táctil de lujo con retroiluminación LED tenue para la noche.",
    features: [
      "Conexión WiFi directa sin hub requerido",
      "Panel de cristal templado anti-rayas",
      "Configuración de temporizadores y automatizaciones",
      "Compatible con Alexa y Google Home"
    ],
    inQuoteCalculator: true,
    installationLaborPoints: 1
  },
  {
    id: "prod-dom-03",
    name: "Pantalla Táctil de Pared Central Smart Home 8\"",
    category: "domotica",
    brand: "JJ Tech",
    price: 1980000,
    cost: 990000,
    stock: 8,
    rating: 5.0,
    image: "/assets/images/hero-smart-home.jpg",
    shortDesc: "Panel de control centralizado para toda la vivienda con interfaz personalizada.",
    features: [
      "Pantalla IPS HD de 8 pulgadas con sensor de proximidad",
      "Intercomunicador de video bidireccional",
      "Control de iluminación, clima, cortinas y seguridad",
      "Altavoces y micrófonos con cancelación de ruido"
    ],
    inQuoteCalculator: true,
    installationLaborPoints: 3
  },

  // Seguridad & CCTV
  {
    id: "prod-seg-01",
    name: "Cerradura Biométrica Inteligente JJ Tech SmartPro",
    category: "seguridad",
    brand: "JJ Tech",
    price: 1290000,
    cost: 645000,
    stock: 18,
    rating: 5.0,
    image: "/assets/images/brand-moodboard-services.jpg",
    shortDesc: "Seguridad máxima con 5 métodos de apertura: huella, PIN virtual, tarjeta, app y llave mecánica.",
    features: [
      "Lector de huella dactilar semiconductor 3D (0.3s)",
      "Generación de claves temporales para visitas o personal",
      "Cámara timbre visor con captura automática de fotos",
      "Alarma anti-manipulación y bloqueo automático"
    ],
    inQuoteCalculator: true,
    installationLaborPoints: 2
  },
  {
    id: "prod-seg-02",
    name: "Kit CCTV 4K ColorVu Hikvision 8 Cámaras + NVR",
    category: "seguridad",
    brand: "Hikvision",
    price: 4850000,
    cost: 2425000,
    stock: 12,
    rating: 4.9,
    image: "/assets/images/installation-technician.jpg",
    shortDesc: "Vigilancia en color 24/7 con inteligencia artificial y detección de personas y vehículos.",
    features: [
      "8 Cámaras bala/domo metálicas IP67 para exterior",
      "Visión nocturna a todo color en oscuridad absoluta",
      "Disco duro 4TB Western Digital Purple para grabación continua",
      "Notificaciones en tiempo real a tu celular"
    ],
    inQuoteCalculator: true,
    installationLaborPoints: 8
  },
  {
    id: "prod-seg-03",
    name: "Cámara PTZ Exterior 360° Smart WiFi con Auto-Tracking",
    category: "seguridad",
    brand: "JJ Tech Security",
    price: 490000,
    cost: 245000,
    stock: 30,
    rating: 4.7,
    image: "/assets/images/hero-smart-home.jpg",
    shortDesc: "Cámara motorizada para perímetro exterior con reflector disuasorio y sirena.",
    features: [
      "Giro horizontal 355° y vertical 90°",
      "Audio de dos vías para hablar y escuchar",
      "Seguimiento automático de intrusos",
      "Ranura MicroSD hasta 256GB y nube opcional"
    ],
    inQuoteCalculator: true,
    installationLaborPoints: 1
  },

  // Cómputo, Servidores & Redes
  {
    id: "prod-comp-01",
    name: "Servidor NAS Synology 4 Bahías para CCTV y Cloud Privada",
    category: "computo",
    brand: "Synology",
    price: 3890000,
    cost: 1945000,
    stock: 5,
    rating: 4.9,
    image: "/assets/images/brand-moodboard-services.jpg",
    shortDesc: "Almacenamiento masivo y redundante con copias automáticas y streaming doméstico.",
    features: [
      "Procesador Quad-Core con 4GB DDR4 actualizable",
      "Soporta arreglos RAID 0, 1, 5, 10 para protección de datos",
      "Gestión de hasta 40 cámaras IP de seguridad",
      "Nube privada accesible desde cualquier parte del mundo"
    ],
    inQuoteCalculator: true,
    installationLaborPoints: 3
  },
  {
    id: "prod-comp-02",
    name: "Estación de Trabajo JJ Tech Render 3D & Simulación",
    category: "computo",
    brand: "JJ Tech Pro Workstation",
    price: 8900000,
    cost: 4450000,
    stock: 4,
    rating: 5.0,
    image: "/assets/images/master-bedroom-night.jpg",
    shortDesc: "Equipo de cómputo ultra potente optimizado para diseño arquitectónico 3D y renderizado.",
    features: [
      "Procesador AMD Ryzen 9 7900X de 12 núcleos",
      "Tarjeta gráfica NVIDIA RTX 4070 Ti 12GB GDDR6X",
      "64GB RAM DDR5 6000MHz Kingston Fury",
      "Refrigeración líquida ARGB de 360mm y chasis térmico"
    ],
    inQuoteCalculator: false,
    installationLaborPoints: 2
  }
];

// Datos de Servicios de Mantenimiento
export const MAINTENANCE_SERVICES = [
  {
    id: "serv-mant-01",
    name: "Mantenimiento Preventivo de Cómputo & Redes",
    price: 160000,
    durationHours: 2,
    description: "Limpieza física profunda, pasta térmica premium, optimización de sistema operativo, eliminación de malware y diagnóstico de discos y memorias."
  },
  {
    id: "serv-mant-02",
    name: "Mantenimiento & Calibración de Domótica Residencial",
    price: 240000,
    durationHours: 3,
    description: "Revisión de conexiones de interruptores, actualización de firmware de actuadores, optimización de malla Zigbee/WiFi y verificación de escenas."
  },
  {
    id: "serv-mant-03",
    name: "Mantenimiento Preventivo de CCTV y Seguridad",
    price: 220000,
    durationHours: 3,
    description: "Limpieza y calibración de lentes de cámaras, ajuste de enfoques, verificación de grabación continua de NVR/DVR y pruebas de alarma."
  },
  {
    id: "serv-mant-04",
    name: "Visita Técnica de Diagnóstico y Levantamiento 3D",
    price: 120000,
    durationHours: 1.5,
    description: "Inspección profesional in situ en Medellín o municipios para cálculo de materiales, cableado y renderizado 3D previo. ¡100% deducible al contratar el proyecto!"
  }
];

// Métricas Financieras y Moodboard de Control (Tiempo Real)
export const INITIAL_FINANCIAL_METRICS = {
  totalRevenue: 184200000,
  operatingExpenses: 88000000,
  netProfit: 96200000,
  profitMarginPercentage: 52.2,
  completedProjects: 48,
  activeQuotations: 19,
  technicalVisitsScheduled: 26,
  conversionRatePercent: 84.6,

  // Desglose de Gastos Operativos por Categoría
  costBreakdown: [
    { category: "Materiales y Equipos", amount: 48500000, percentage: 55.1, color: "#0070F3" },
    { category: "Mano de Obra Especializada", amount: 24200000, percentage: 27.5, color: "#00E5FF" },
    { category: "Viáticos de Desplazamiento", amount: 6800000, percentage: 7.7, color: "#38BDF8" },
    { category: "Comisiones y Operación", amount: 8500000, percentage: 9.7, color: "#94A3B8" }
  ],

  // Ingresos por Línea de Negocio / Producto
  revenueByLine: [
    { line: "Centros de Entretenimiento (Taluha Home)", revenue: 54800000, color: "#00E5FF", count: 14 },
    { line: "Domótica & Confort", revenue: 42100000, color: "#0070F3", count: 21 },
    { line: "Seguridad & CCTV", revenue: 38400000, color: "#38BDF8", count: 28 },
    { line: "Cortinas & Persianas Motorizadas", revenue: 32600000, color: "#60A5FA", count: 18 },
    { line: "Mantenimientos & Cómputo", revenue: 16300000, color: "#93C5FD", count: 35 }
  ],

  // Evolución mensual 2026 (Pesos Colombianos)
  monthlyTrend: [
    { month: "Ene", revenue: 18500000, expenses: 9100000, profit: 9400000 },
    { month: "Feb", revenue: 21200000, expenses: 10200000, profit: 11000000 },
    { month: "Mar", revenue: 24800000, expenses: 11800000, profit: 13000000 },
    { month: "Abr", revenue: 19900000, expenses: 9600000, profit: 10300000 },
    { month: "May", revenue: 26500000, expenses: 12400000, profit: 14100000 },
    { month: "Jun", revenue: 23100000, expenses: 11000000, profit: 12100000 },
    { month: "Jul", revenue: 28700000, expenses: 13400000, profit: 15300000 },
    { month: "Ago", revenue: 31500000, expenses: 14500000, profit: 17000000 }
  ]
};

// Cotizaciones de muestra iniciales
export const INITIAL_QUOTES = [
  {
    id: "COT-2026-0089",
    customerName: "Carlos Restrepo",
    customerEmail: "carlos.restrepo@grupo-inversion.co",
    customerPhone: "+57 311 456 7890",
    date: "2026-08-28",
    status: "Aprobada",
    locationCity: "Guatapé (Casa Campestre Lago)",
    materialsTotal: 16800000,
    laborTotal: 3400000,
    marginAmount: 10100000,
    travelCost: 220000,
    technicalVisitCost: 250000,
    visitDiscount: 250000,
    grandTotal: 30270000,
    itemsCount: 12
  },
  {
    id: "COT-2026-0092",
    customerName: "Mariana Gómez Valencia",
    customerEmail: "mariana.gomez@arqmedellin.com",
    customerPhone: "+57 300 890 1234",
    date: "2026-09-01",
    status: "En Negociación",
    locationCity: "Medellín - El Poblado (Penthouse)",
    materialsTotal: 8900000,
    laborTotal: 1800000,
    marginAmount: 5350000,
    travelCost: 0,
    technicalVisitCost: 120000,
    visitDiscount: 120000,
    grandTotal: 16050000,
    itemsCount: 7
  },
  {
    id: "COT-2026-0095",
    customerName: "Empresas Antioquia S.A.S.",
    customerEmail: "gerencia@antioquiatech.com",
    customerPhone: "+57 315 789 4321",
    date: "2026-09-03",
    status: "Pendiente Visita",
    locationCity: "Rionegro - Llanogrande",
    materialsTotal: 12400000,
    laborTotal: 2600000,
    marginAmount: 7500000,
    travelCost: 120000,
    technicalVisitCost: 190000,
    visitDiscount: 190000,
    grandTotal: 22620000,
    itemsCount: 9
  }
];

// Citas de mantenimiento agendadas iniciales
export const INITIAL_BOOKINGS = [
  {
    id: "CIT-0041",
    name: "Alejandro Zuleta",
    phone: "+57 310 998 7766",
    city: "Medellín - Laureles",
    address: "Circular 4ta # 72-15 Apto 802",
    serviceType: "Mantenimiento & Calibración de Domótica Residencial",
    date: "2026-09-06",
    time: "10:00 AM",
    status: "Confirmado",
    notes: "Cortinas de la sala no responden al comando de voz con Alexa."
  },
  {
    id: "CIT-0042",
    name: "Daniela Londoño",
    phone: "+57 301 223 3445",
    city: "Envigado",
    address: "Calle 38 Sur # 43A-20",
    serviceType: "Mantenimiento Preventivo de CCTV y Seguridad",
    date: "2026-09-08",
    time: "02:30 PM",
    status: "Pendiente",
    notes: "Limpieza y calibración de 6 cámaras exteriores tras remodelación de fachada."
  }
];

// Obras Reales en Antioquia
export const INITIAL_PROJECTS = [
  {
    id: 'proj-01',
    title: 'Penthouse Torre Cristal - Sala de Cine VIP',
    location: 'Medellín - El Poblado',
    zone: 'poblado',
    category: 'cine',
    categoryLabel: 'Cine & Audio (Taluha Home)',
    investmentCOP: 38500000,
    image: '/assets/images/banners-domotica-cinema.jpg',
    headline: 'Sala de Cine Privada Dolby Atmos 7.2 con Butacas en Cuero Taluha',
    description: 'Diseño 3D acústico previo y posterior ejecución con proyector láser 4K Samsung, cielo estrellado fonoabsorbente y 2 sillones reclinables VIP en cuero italiano.',
    equipmentList: [
      'Proyector Láser Triple Samsung The Premiere 4K',
      'Sistema de Sonido Envolvente Klipsch Reference 7.2',
      '2 Sillones Reclinables Eléctricos Taluha Home',
      'Techo acústico Starlight de micro fibra óptica',
      'Iluminación perimetral regulable por voz'
    ]
  },
  {
    id: 'proj-02',
    title: 'Villa Campestre Lago - Seguridad & Audio Zonas Húmedas',
    location: 'Guatapé, Antioquia',
    zone: 'guatape',
    category: 'seguridad',
    categoryLabel: 'Seguridad 4K & CCTV',
    investmentCOP: 29800000,
    image: '/assets/images/installation-technician.jpg',
    headline: 'CCTV ColorVu con IA, Pérgola Bioclimática y Control Perimetral',
    description: 'Protección perimetral integral en casa de campo frente a la represa, con cámaras motorizadas solares, aviso inmediato al celular y sonido exterior para jacuzzi y muelle.',
    equipmentList: [
      'Kit de 8 Cámaras Metálicas IP67 ColorVu 4K',
      '2 Cámaras PTZ Exteriores 360° Solares',
      'Servidor NVR 4TB grabación continua 30 días',
      'Pérgola bioclimática con lamas motorizadas',
      'Parlantes para intemperie Bose FreeSpace'
    ]
  },
  {
    id: 'proj-03',
    title: 'Residencia Inteligente Llanogrande',
    location: 'Rionegro - Llanogrande',
    zone: 'rionegro',
    category: 'domotica',
    categoryLabel: 'Domótica & Cortinas Motorizadas',
    investmentCOP: 22400000,
    image: '/assets/images/master-bedroom-night.jpg',
    headline: 'Automatización de Dormitorio Master con Vista Nocturna a la Ciudad',
    description: 'Cortinas Blackout de oscurecimiento absoluto motorizadas con rieles ultra silenciosos (<30dB) coordinadas con iluminación lineal COB 24V y panel táctil central.',
    equipmentList: [
      '4 Cortinas Blackout motorizadas con rieles silenciosos',
      'Tiras LED COB continuo sin sombras (20 metros)',
      'Pantalla táctil de pared 8" con interfono',
      'Cerradura biométrica SmartPro con 5 métodos de apertura'
    ]
  },
  {
    id: 'proj-04',
    title: 'Apartamento de Lujo & Rentas Cortas',
    location: 'Medellín - Laureles',
    zone: 'laureles',
    category: 'domotica',
    categoryLabel: 'Control de Accesos & Confort',
    investmentCOP: 11200000,
    image: '/assets/images/hero-smart-home.jpg',
    headline: 'Cerraduras Biométricas con Claves Remotas e Iluminación por Voz',
    description: 'Puesta a punto de departamento para alquiler turístico de alto estándar, con cerraduras que generan claves de acceso temporales a distancia y apagado automático.',
    equipmentList: [
      '2 Cerraduras biométricas con código para huéspedes',
      'Switch táctiles triples de cristal templado',
      'Integración con Alexa ("Modo Bienvenida")',
      'Sensores inteligentes de humo y fuga de gas'
    ]
  }
];

