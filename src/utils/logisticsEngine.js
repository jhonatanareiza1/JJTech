// =========================================================================
// JJ TECH - ANTIOQUIA LOGISTICS & VIÁTICOS ENGINE (MARKET PRICING 2026)
// =========================================================================
// Basado en tarifas oficiales de peajes de Antioquia (INVÍAS / ANI / Concesiones)
// y precios de referencia de combustible en Medellín a Octubre de 2026 ($16.297 COP/galón).

export const MARKET_BENCHMARKS_2026 = {
  fuelGasolineCOPPerGallon: 16297, // Precio oficial referencia Medellín
  fuelDieselCOPPerGallon: 11641,
  vehicleKmPerGallonAverage: 32,    // Camioneta / furgoneta utilitaria con carga de equipos
  vehicleWearCOPPerKm: 380,         // Desgaste de llantas, aceite y suspensión por km
  techCrewDailyFoodCOP: 45000,      // Almuerzo e hidratación cuadrilla 2 técnicos (fuera de Valle Aburrá)
  techCrewLongDistanceFoodCOP: 75000,// Jornada completa alimentación (distancia > 100km)
  techCrewOvernightCOP: 180000,     // Hospedaje + cena cuadrilla en distancias extremas (> 200km)
  baseTechnicalDiagnosticFee: 120000 // Honorarios profesionales de diagnóstico previo
};

// Tarifas oficiales peajes 2026 por sentido (Categoría I)
export const TOLL_RATES_ANTIOQUIA_2026 = {
  tunelOriente: { name: "Túnel de Oriente", oneWay: 26300 },
  tunelOccidente: { name: "Túnel de Occidente (Aburrá)", oneWay: 27300 },
  variantePalmas: { name: "Variante Las Palmas", oneWay: 20200 },
  palmasRetiro: { name: "Las Palmas (El Retiro)", oneWay: 13600 },
  santaElena: { name: "Santa Elena", oneWay: 15100 },
  copacabanaGuarne: { name: "Copacabana - Guarne", oneWay: 18600 },
  amagaPacifico: { name: "Amagá (Pacífico 1)", oneWay: 25900 },
  trapicheNorte: { name: "El Trapiche / Cabildo", oneWay: 16800 },
  cisnerosNus: { name: "Cisneros / Vías del Nus", oneWay: 18000 },
  puertoTriunfo: { name: "Corredor Autopista Medellín-Bogotá (2 peajes)", oneWay: 34800 },
  bajoCauca: { name: "Corredor Norte - Bajo Cauca (3 peajes)", oneWay: 48500 },
  uraba: { name: "Corredor Mar 1 & 2 Urabá (4 peajes)", oneWay: 62000 }
};

// Las 9 Subregiones oficiales del departamento de Antioquia con municipios representativos y cobertura total
export const ANTIOQUIA_SUBREGIONS = [
  { id: "aburra", name: "Valle de Aburrá (Área Metropolitana)" },
  { id: "oriente", name: "Oriente Antioqueño (Altiplano, Embalses y Páramo)" },
  { id: "occidente", name: "Occidente Antioqueño (Túnel & Zona Turística)" },
  { id: "suroeste", name: "Suroeste Antioqueño (Pacífico 1 & Zona Cafetera)" },
  { id: "norte", name: "Norte Antioqueño (Zona Lechera & Cuivá)" },
  { id: "nordeste", name: "Nordeste Antioqueño (Vías del Nus & Minería)" },
  { id: "magdalena", name: "Magdalena Medio (Doradal / Puerto Triunfo)" },
  { id: "bajocauca", name: "Bajo Cauca (Caucasia / Tarazá)" },
  { id: "uraba", name: "Urabá Antioqueño (Apartadó / Turbo / Necoclí)" }
];

/**
 * Función que calcula con rigor de mercado los viáticos reales a cualquier punto:
 * Viáticos = Peajes I/V + Combustible I/V + Logística Alimentación/Pernoctada + Desgaste Vehicular
 */
export const computeMarketViaticos = ({
  distanceKmOneWay,
  roundTripTollCost,
  tollNames = [],
  requiresOvernight = false,
  isMetropolitan = false
}) => {
  const roundTripKm = distanceKmOneWay * 2;

  // 1. Combustible (Gasolina Corriente Octubre 2026: $16.297 COP)
  const gallonsNeeded = roundTripKm / MARKET_BENCHMARKS_2026.vehicleKmPerGallonAverage;
  const fuelCostCOP = Math.round(gallonsNeeded * MARKET_BENCHMARKS_2026.fuelGasolineCOPPerGallon);

  // 2. Peajes
  const tollsCOP = roundTripTollCost;

  // 3. Alimentación / Hospedaje cuadrilla técnica
  let crewFoodAndLodgingCOP = 0;
  if (isMetropolitan) {
    crewFoodAndLodgingCOP = 0; // Dentro del área metropolitana
  } else if (requiresOvernight || distanceKmOneWay > 200) {
    crewFoodAndLodgingCOP = MARKET_BENCHMARKS_2026.techCrewOvernightCOP + MARKET_BENCHMARKS_2026.techCrewLongDistanceFoodCOP;
  } else if (distanceKmOneWay > 90) {
    crewFoodAndLodgingCOP = MARKET_BENCHMARKS_2026.techCrewLongDistanceFoodCOP;
  } else {
    crewFoodAndLodgingCOP = MARKET_BENCHMARKS_2026.techCrewDailyFoodCOP;
  }

  // 4. Desgaste y amortización utilitario
  const wearAndTearCOP = Math.round(roundTripKm * MARKET_BENCHMARKS_2026.vehicleWearCOPPerKm);

  // Total Viático logístico de traslado
  const rawTravelTotal = isMetropolitan && distanceKmOneWay <= 8 
    ? 0 
    : isMetropolitan 
      ? Math.round(fuelCostCOP + wearAndTearCOP) 
      : Math.round(tollsCOP + fuelCostCOP + crewFoodAndLodgingCOP + wearAndTearCOP);

  // Redondeo comercial a múltiplos de $5.000 COP
  const travelCost = Math.ceil(rawTravelTotal / 5000) * 5000;

  // Valor visita técnica previa de diagnóstico (Deducible 100% al contratar el proyecto)
  const baseVisit = MARKET_BENCHMARKS_2026.baseTechnicalDiagnosticFee;
  const technicalVisitCost = isMetropolitan && distanceKmOneWay <= 8
    ? baseVisit
    : Math.ceil((baseVisit + (travelCost * 0.65)) / 10000) * 10000;

  return {
    travelCost,
    technicalVisitCost,
    breakdown: {
      roundTripKm,
      tollsCOP,
      tollNames,
      fuelCostCOP,
      crewFoodAndLodgingCOP,
      wearAndTearCOP
    }
  };
};

// Base exhaustiva de municipios de las 9 subregiones de Antioquia calculados por mercado
export const EXTENDED_ANTIOQUIA_LOCATIONS = [
  // 1. VALLE DE ABURRÁ
  {
    id: "med-poblado",
    subregionId: "aburra",
    subregionName: "Valle de Aburrá",
    zone: "Valle de Aburrá",
    city: "Medellín - El Poblado / Las Lomas",
    distanceKm: 5,
    estimatedDistanceKm: 5,
    tollsRoundTrip: 0,
    tollCount: 0,
    tollDetails: "Perímetro urbano sin peajes",
    travelCost: 0,
    technicalVisitCost: 120000,
    isMetropolitan: true
  },
  {
    id: "med-laureles",
    subregionId: "aburra",
    subregionName: "Valle de Aburrá",
    zone: "Valle de Aburrá",
    city: "Medellín - Laureles / Conquistadores / Belén",
    distanceKm: 6,
    estimatedDistanceKm: 6,
    tollsRoundTrip: 0,
    tollCount: 0,
    tollDetails: "Perímetro urbano sin peajes",
    travelCost: 0,
    technicalVisitCost: 120000,
    isMetropolitan: true
  },
  {
    id: "aburra-med-norte",
    subregionId: "aburra",
    subregionName: "Valle de Aburrá",
    zone: "Valle de Aburrá",
    city: "Medellín - Robledo / Castilla / Aranjuez",
    distanceKm: 8,
    estimatedDistanceKm: 8,
    tollsRoundTrip: 0,
    tollCount: 0,
    tollDetails: "Perímetro urbano sin peajes",
    travelCost: 0,
    technicalVisitCost: 120000,
    isMetropolitan: true
  },
  {
    id: "med-envigado",
    subregionId: "aburra",
    subregionName: "Valle de Aburrá",
    zone: "Valle de Aburrá",
    city: "Envigado (Zuñiga, Loma del Chocho, Escobero)",
    distanceKm: 12,
    estimatedDistanceKm: 12,
    tollsRoundTrip: 0,
    tollCount: 0,
    tollDetails: "Corredor sur sin peajes",
    travelCost: 25000,
    technicalVisitCost: 130000,
    isMetropolitan: true
  },
  {
    id: "aburra-sabaneta",
    subregionId: "aburra",
    subregionName: "Valle de Aburrá",
    zone: "Valle de Aburrá",
    city: "Sabaneta / La Doctora",
    distanceKm: 14,
    estimatedDistanceKm: 14,
    tollsRoundTrip: 0,
    tollCount: 0,
    tollDetails: "Corredor sur metropolitano",
    travelCost: 25000,
    technicalVisitCost: 130000,
    isMetropolitan: true
  },
  {
    id: "aburra-itagui",
    subregionId: "aburra",
    subregionName: "Valle de Aburrá",
    zone: "Valle de Aburrá",
    city: "Itagüí / Ditaires / San Antonio de Prado",
    distanceKm: 15,
    estimatedDistanceKm: 15,
    tollsRoundTrip: 0,
    tollCount: 0,
    tollDetails: "Corredor sur metropolitano",
    travelCost: 25000,
    technicalVisitCost: 130000,
    isMetropolitan: true
  },
  {
    id: "aburra-laestrella",
    subregionId: "aburra",
    subregionName: "Valle de Aburrá",
    zone: "Valle de Aburrá",
    city: "La Estrella / Caldas (Sur Metropolitano)",
    distanceKm: 22,
    estimatedDistanceKm: 22,
    tollsRoundTrip: 0,
    tollCount: 0,
    tollDetails: "Límite sur Valle de Aburrá",
    travelCost: 35000,
    technicalVisitCost: 140000,
    isMetropolitan: true
  },
  {
    id: "med-bello",
    subregionId: "aburra",
    subregionName: "Valle de Aburrá",
    zone: "Valle de Aburrá",
    city: "Bello (Niquía, Cabañas, Navarra)",
    distanceKm: 16,
    estimatedDistanceKm: 16,
    tollsRoundTrip: 0,
    tollCount: 0,
    tollDetails: "Corredor norte metropolitano",
    travelCost: 30000,
    technicalVisitCost: 135000,
    isMetropolitan: true
  },
  {
    id: "aburra-copacabana",
    subregionId: "aburra",
    subregionName: "Valle de Aburrá",
    zone: "Valle de Aburrá",
    city: "Copacabana / Girardota / Barbosa",
    distanceKm: 32,
    estimatedDistanceKm: 32,
    tollsRoundTrip: 0,
    tollCount: 0,
    tollDetails: "Norte metropolitano / Peaje El Trapiche exento según retorno",
    travelCost: 45000,
    technicalVisitCost: 150000,
    isMetropolitan: true
  },

  // 2. ORIENTE ANTIOQUEÑO
  {
    id: "oriente-rionegro",
    subregionId: "oriente",
    subregionName: "Oriente Antioqueño",
    zone: "Oriente Antioqueño",
    city: "Rionegro / Llanogrande / San Antonio de Pereira",
    distanceKm: 38,
    estimatedDistanceKm: 38,
    tollsRoundTrip: 52600, // Túnel de Oriente x 2 ($26.300 x 2)
    tollCount: 1,
    tollDetails: "Túnel de Oriente ($26.300 ida + vuelta)",
    travelCost: 125000,
    technicalVisitCost: 195000,
    isMetropolitan: false
  },
  {
    id: "oriente-elretiro",
    subregionId: "oriente",
    subregionName: "Oriente Antioqueño",
    zone: "Oriente Antioqueño",
    city: "El Retiro / Fizebad / Represa La Fe",
    distanceKm: 34,
    estimatedDistanceKm: 34,
    tollsRoundTrip: 27200, // Las Palmas El Retiro x 2 ($13.600 x 2)
    tollCount: 1,
    tollDetails: "Peaje Palmas El Retiro ($13.600 ida + vuelta)",
    travelCost: 105000,
    technicalVisitCost: 185000,
    isMetropolitan: false
  },
  {
    id: "oriente-laceja",
    subregionId: "oriente",
    subregionName: "Oriente Antioqueño",
    zone: "Oriente Antioqueño",
    city: "La Ceja / Carmen de Viboral / San Vicente",
    distanceKm: 46,
    estimatedDistanceKm: 46,
    tollsRoundTrip: 52600,
    tollCount: 1,
    tollDetails: "Túnel de Oriente / Palmas",
    travelCost: 135000,
    technicalVisitCost: 205000,
    isMetropolitan: false
  },
  {
    id: "oriente-guarne-marinilla",
    subregionId: "oriente",
    subregionName: "Oriente Antioqueño",
    zone: "Oriente Antioqueño",
    city: "Guarne / Marinilla / El Santuario",
    distanceKm: 42,
    estimatedDistanceKm: 42,
    tollsRoundTrip: 37200, // Copacabana-Guarne x 2 ($18.600 x 2)
    tollCount: 1,
    tollDetails: "Peaje Copacabana-Guarne ($18.600 ida + vuelta)",
    travelCost: 120000,
    technicalVisitCost: 195000,
    isMetropolitan: false
  },
  {
    id: "oriente-penol",
    subregionId: "oriente",
    subregionName: "Oriente Antioqueño",
    zone: "Oriente Antioqueño",
    city: "El Peñol (Zona Embalses)",
    distanceKm: 65,
    estimatedDistanceKm: 65,
    tollsRoundTrip: 37200,
    tollCount: 1,
    tollDetails: "Peaje Copacabana-Guarne + tramo montaña",
    travelCost: 185000,
    technicalVisitCost: 235000,
    isMetropolitan: false
  },
  {
    id: "oriente-guatape",
    subregionId: "oriente",
    subregionName: "Oriente Antioqueño",
    zone: "Oriente Antioqueño",
    city: "Guatapé (Pueblo de Zócalos & Fincas en Represa)",
    distanceKm: 80,
    estimatedDistanceKm: 80,
    tollsRoundTrip: 37200,
    tollCount: 1,
    tollDetails: "Peaje Autopista + corredor embalse + acceso náutico/fincas",
    travelCost: 225000,
    technicalVisitCost: 255000,
    isMetropolitan: false
  },
  {
    id: "oriente-sanrafael-sancarlos",
    subregionId: "oriente",
    subregionName: "Oriente Antioqueño",
    zone: "Oriente Antioqueño",
    city: "San Rafael / San Carlos / Granada",
    distanceKm: 110,
    estimatedDistanceKm: 110,
    tollsRoundTrip: 37200,
    tollCount: 1,
    tollDetails: "Zona Embalses lejana / vías secundarias",
    travelCost: 280000,
    technicalVisitCost: 310000,
    isMetropolitan: false
  },
  {
    id: "oriente-sonson-abejorral",
    subregionId: "oriente",
    subregionName: "Oriente Antioqueño",
    zone: "Oriente Antioqueño",
    city: "Sonsón / Abejorral / La Unión / Cocorná",
    distanceKm: 115,
    estimatedDistanceKm: 115,
    tollsRoundTrip: 37200,
    tollCount: 1,
    tollDetails: "Páramo & Bosques del Oriente",
    travelCost: 295000,
    technicalVisitCost: 320000,
    isMetropolitan: false
  },

  // 3. OCCIDENTE ANTIOQUEÑO
  {
    id: "occ-sanjeronimo-sopetran",
    subregionId: "occidente",
    subregionName: "Occidente Antioqueño",
    zone: "Occidente Antioqueño",
    city: "San Jerónimo / Sopetrán (Condominios & Fincas)",
    distanceKm: 42,
    estimatedDistanceKm: 42,
    tollsRoundTrip: 54600, // Túnel de Occidente x 2 ($27.300 x 2)
    tollCount: 1,
    tollDetails: "Túnel de Occidente Aburrá ($27.300 ida + vuelta)",
    travelCost: 165000,
    technicalVisitCost: 220000,
    isMetropolitan: false
  },
  {
    id: "occ-santafedeantioquia",
    subregionId: "occidente",
    subregionName: "Occidente Antioqueño",
    zone: "Occidente Antioqueño",
    city: "Santa Fe de Antioquia (Ciudad Colonial & Parcelaciones)",
    distanceKm: 58,
    estimatedDistanceKm: 58,
    tollsRoundTrip: 54600,
    tollCount: 1,
    tollDetails: "Túnel de Occidente + Corredor Río Cauca",
    travelCost: 210000,
    technicalVisitCost: 250000,
    isMetropolitan: false
  },
  {
    id: "occ-olaya-liborina",
    subregionId: "occidente",
    subregionName: "Occidente Antioqueño",
    zone: "Occidente Antioqueño",
    city: "Olaya / Sucre / Liborina / Sabanalarga",
    distanceKm: 85,
    estimatedDistanceKm: 85,
    tollsRoundTrip: 54600,
    tollCount: 1,
    tollDetails: "Túnel de Occidente + Puente de Occidente",
    travelCost: 260000,
    technicalVisitCost: 295000,
    isMetropolitan: false
  },
  {
    id: "occ-dabeiba-frontino",
    subregionId: "occidente",
    subregionName: "Occidente Antioqueño",
    zone: "Occidente Antioqueño",
    city: "Cañasgordas / Frontino / Dabeiba / Uramita",
    distanceKm: 145,
    estimatedDistanceKm: 145,
    tollsRoundTrip: 54600,
    tollCount: 1,
    tollDetails: "Cañón de La Llorona / Vía al Mar",
    travelCost: 360000,
    technicalVisitCost: 390000,
    isMetropolitan: false
  },

  // 4. SUROESTE ANTIOQUEÑO
  {
    id: "sur-amaga-titiribi",
    subregionId: "suroeste",
    subregionName: "Suroeste Antioqueño",
    zone: "Suroeste Antioqueño",
    city: "Amagá / Angelópolis / Titiribí / Venecia",
    distanceKm: 45,
    estimatedDistanceKm: 45,
    tollsRoundTrip: 51800, // Peaje Amagá Pacífico 1 x 2 ($25.900 x 2)
    tollCount: 1,
    tollDetails: "Peaje Amagá Pacífico 1 ($25.900 ida + vuelta)",
    travelCost: 155000,
    technicalVisitCost: 215000,
    isMetropolitan: false
  },
  {
    id: "sur-fredonia-jerico",
    subregionId: "suroeste",
    subregionName: "Suroeste Antioqueño",
    zone: "Suroeste Antioqueño",
    city: "Fredonia / Jericó / Tarso / Pueblorrico",
    distanceKm: 85,
    estimatedDistanceKm: 85,
    tollsRoundTrip: 51800,
    tollCount: 1,
    tollDetails: "Pacífico 1 + tramo montañoso cafetero",
    travelCost: 245000,
    technicalVisitCost: 285000,
    isMetropolitan: false
  },
  {
    id: "sur-andes-jardin",
    subregionId: "suroeste",
    subregionName: "Suroeste Antioqueño",
    zone: "Suroeste Antioqueño",
    city: "Andes / Jardín / Ciudad Bolívar / Hispania",
    distanceKm: 135,
    estimatedDistanceKm: 135,
    tollsRoundTrip: 51800,
    tollCount: 1,
    tollDetails: "Peaje Amagá + Corredor Río San Juan",
    travelCost: 320000,
    technicalVisitCost: 350000,
    isMetropolitan: false
  },
  {
    id: "sur-tamesis-valparaiso",
    subregionId: "suroeste",
    subregionName: "Suroeste Antioqueño",
    zone: "Suroeste Antioqueño",
    city: "Támesis / Valparaíso / La Pintada / Caramanta",
    distanceKm: 110,
    estimatedDistanceKm: 110,
    tollsRoundTrip: 51800,
    tollCount: 1,
    tollDetails: "Pacífico 2 / Vía Cauca",
    travelCost: 285000,
    technicalVisitCost: 320000,
    isMetropolitan: false
  },
  {
    id: "sur-urrao",
    subregionId: "suroeste",
    subregionName: "Suroeste Antioqueño",
    zone: "Suroeste Antioqueño",
    city: "Urrao / Betulia / Concordia / Salgar",
    distanceKm: 130,
    estimatedDistanceKm: 130,
    tollsRoundTrip: 51800,
    tollCount: 1,
    tollDetails: "Peaje Amagá + Cordillera Occidental",
    travelCost: 310000,
    technicalVisitCost: 345000,
    isMetropolitan: false
  },

  // 5. NORTE ANTIOQUEÑO
  {
    id: "norte-sanpedro-entrerrios",
    subregionId: "norte",
    subregionName: "Norte Antioqueño",
    zone: "Norte Antioqueño",
    city: "San Pedro de los Milagros / Entrerríos / Belmira",
    distanceKm: 48,
    estimatedDistanceKm: 48,
    tollsRoundTrip: 33600, // Peaje El Trapiche x 2
    tollCount: 1,
    tollDetails: "Peaje El Trapiche / Altiplano Norte",
    travelCost: 165000,
    technicalVisitCost: 225000,
    isMetropolitan: false
  },
  {
    id: "norte-santarosa-donmatias",
    subregionId: "norte",
    subregionName: "Norte Antioqueño",
    zone: "Norte Antioqueño",
    city: "Donmatías / Santa Rosa de Osos / Gómez Plata",
    distanceKm: 75,
    estimatedDistanceKm: 75,
    tollsRoundTrip: 33600,
    tollCount: 1,
    tollDetails: "Troncal del Norte / Llanos de Cuivá",
    travelCost: 215000,
    technicalVisitCost: 265000,
    isMetropolitan: false
  },
  {
    id: "norte-yarumal-ituango",
    subregionId: "norte",
    subregionName: "Norte Antioqueño",
    zone: "Norte Antioqueño",
    city: "Yarumal / Angostura / Ituango / Valdivia",
    distanceKm: 165,
    estimatedDistanceKm: 165,
    tollsRoundTrip: 33600,
    tollCount: 1,
    tollDetails: "Troncal Occidental Norte / Hidroituango",
    travelCost: 395000,
    technicalVisitCost: 420000,
    isMetropolitan: false
  },

  // 6. NORDESTE ANTIOQUEÑO
  {
    id: "nordeste-cisneros-sanroque",
    subregionId: "nordeste",
    subregionName: "Nordeste Antioqueño",
    zone: "Nordeste Antioqueño",
    city: "Santo Domingo / Cisneros / San Roque (Túnel La Quiebra)",
    distanceKm: 85,
    estimatedDistanceKm: 85,
    tollsRoundTrip: 36000,
    tollCount: 1,
    tollDetails: "Vías del Nus / Túnel de La Quiebra ($18.000 x 2)",
    travelCost: 235000,
    technicalVisitCost: 280000,
    isMetropolitan: false
  },
  {
    id: "nordeste-yolombo-amalfi",
    subregionId: "nordeste",
    subregionName: "Nordeste Antioqueño",
    zone: "Nordeste Antioqueño",
    city: "Yolombó / Yalí / Vegachí / Amalfi",
    distanceKm: 135,
    estimatedDistanceKm: 135,
    tollsRoundTrip: 36000,
    tollCount: 1,
    tollDetails: "Corredor Nordeste / Vías secundarias",
    travelCost: 330000,
    technicalVisitCost: 365000,
    isMetropolitan: false
  },
  {
    id: "nordeste-segovia-remedios",
    subregionId: "nordeste",
    subregionName: "Nordeste Antioqueño",
    zone: "Nordeste Antioqueño",
    city: "Segovia / Remedios / Anorí",
    distanceKm: 210,
    estimatedDistanceKm: 210,
    tollsRoundTrip: 36000,
    tollCount: 1,
    tollDetails: "Límite Nordeste / Desplazamiento extendido",
    travelCost: 440000,
    technicalVisitCost: 470000,
    isMetropolitan: false
  },

  // 7. MAGDALENA MEDIO ANTIOQUEÑO
  {
    id: "magdalena-puertotriunfo",
    subregionId: "magdalena",
    subregionName: "Magdalena Medio",
    zone: "Magdalena Medio",
    city: "Puerto Triunfo / Doradal (Hacienda Nápoles)",
    distanceKm: 180,
    estimatedDistanceKm: 180,
    tollsRoundTrip: 69600, // 2 peajes Autopista x 2
    tollCount: 2,
    tollDetails: "Autopista Medellín - Bogotá (Copacabana + Cocorná)",
    travelCost: 385000,
    technicalVisitCost: 410000,
    isMetropolitan: false
  },
  {
    id: "magdalena-puertoberrio",
    subregionId: "magdalena",
    subregionName: "Magdalena Medio",
    zone: "Magdalena Medio",
    city: "Puerto Berrío / Puerto Nare / Yondó / Maceo",
    distanceKm: 220,
    estimatedDistanceKm: 220,
    tollsRoundTrip: 69600,
    tollCount: 2,
    tollDetails: "Corredor Magdalena Medio / Ribera del Río",
    travelCost: 460000,
    technicalVisitCost: 490000,
    isMetropolitan: false
  },

  // 8. BAJO CAUCA ANTIOQUEÑO
  {
    id: "bajocauca-caucasia",
    subregionId: "bajocauca",
    subregionName: "Bajo Cauca",
    zone: "Bajo Cauca",
    city: "Caucasia / Tarazá / Cáceres / El Bagre / Zaragoza",
    distanceKm: 285,
    estimatedDistanceKm: 285,
    tollsRoundTrip: 97000, // 3 peajes corredor norte
    tollCount: 3,
    tollDetails: "Límite norte de Antioquia (requiere pernoctada de cuadrilla)",
    travelCost: 560000,
    technicalVisitCost: 590000,
    isMetropolitan: false
  },

  // 9. URABÁ ANTIOQUEÑO
  {
    id: "uraba-apartado-turbo",
    subregionId: "uraba",
    subregionName: "Urabá Antioqueño",
    zone: "Urabá Antioqueño",
    city: "Apartadó / Turbo / Carepa / Chigorodó / Mutatá",
    distanceKm: 310,
    estimatedDistanceKm: 310,
    tollsRoundTrip: 124000, // 4 peajes Autopistas Mar 1 & 2
    tollCount: 4,
    tollDetails: "Corredor Mar 1 & Mar 2 Urabá (requiere pernoctada de cuadrilla)",
    travelCost: 640000,
    technicalVisitCost: 680000,
    isMetropolitan: false
  },
  {
    id: "uraba-necocli-arboletes",
    subregionId: "uraba",
    subregionName: "Urabá Antioqueño",
    zone: "Urabá Antioqueño",
    city: "Necoclí / Arboletes / San Juan de Urabá (Costas)",
    distanceKm: 380,
    estimatedDistanceKm: 380,
    tollsRoundTrip: 124000,
    tollCount: 4,
    tollDetails: "Costas del Caribe Antioqueño / Límite departamental",
    travelCost: 720000,
    technicalVisitCost: 760000,
    isMetropolitan: false
  }
];
