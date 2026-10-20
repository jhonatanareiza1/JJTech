// ==========================================
// JJ TECH - SMART QUOTATION CALCULATOR & FINANCING
// ==========================================
import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  MapPin, 
  CheckCircle, 
  Plus, 
  Minus, 
  Trash2, 
  Save, 
  Send, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle,
  FileText,
  AlertCircle,
  CreditCard,
  Film,
  Lightbulb,
  Armchair,
  Check,
  Fuel,
  Navigation,
  Info,
  Sliders,
  Car
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  LOCATIONS_ANTIOQUIA, 
  QUOTATION_RULES, 
  ANTIOQUIA_SUBREGIONS, 
  MARKET_BENCHMARKS_2026, 
  TOLL_RATES_ANTIOQUIA_2026, 
  computeMarketViaticos 
} from '../../config/constants';
import { formatCOP } from '../../utils/formatters';
import { createWhatsAppQuoteLink } from '../../utils/whatsappHelper';
import { soundFx } from '../../utils/audioSynth';
import './QuoteCalculator.scss';

// Preconfigured Combos Llave en Mano
const PRESET_COMBOS = [
  {
    id: 'combo-cine',
    name: 'Combo Cine en Casa VIP (Taluha Home)',
    badge: 'Más Vendido Medellín',
    desc: 'Audio 7.2 Klipsch, proyector láser 4K, sillones reclinables Taluha y tiras LED COB.',
    icon: Film,
    items: [
      { id: 'prod-ent-01', qty: 1 },
      { id: 'prod-ent-02', qty: 2 },
      { id: 'prod-ent-03', qty: 1 },
      { id: 'prod-dom-01', qty: 2 }
    ]
  },
  {
    id: 'combo-seguridad',
    name: 'Combo Seguridad Perimetral 360°',
    badge: 'Protección Integral',
    desc: 'Kit 8 cámaras ColorVu 4K, cerradura biométrica 5 en 1 y cámara exterior PTZ.',
    icon: ShieldCheck,
    items: [
      { id: 'prod-seg-01', qty: 1 },
      { id: 'prod-seg-02', qty: 1 },
      { id: 'prod-seg-03', qty: 2 }
    ]
  },
  {
    id: 'combo-domotica',
    name: 'Combo Domótica & Iluminación Confort',
    badge: 'Hogar Inteligente',
    desc: 'Cortinas motorizadas a la medida, pantalla táctil central 8" y tiras LED COB.',
    icon: Sparkles,
    items: [
      { id: 'prod-cort-02', qty: 2 },
      { id: 'prod-dom-01', qty: 3 },
      { id: 'prod-dom-02', qty: 4 },
      { id: 'prod-dom-03', qty: 1 }
    ]
  }
];

export const QuoteCalculator = ({ onOpenAuthModal }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const { products, createQuote } = useData();

  // Location selector state & Antioquia 9 subregions
  const [selectedSubregion, setSelectedSubregion] = useState('all');
  const [selectedLocationId, setSelectedLocationId] = useState('med-poblado');
  const [isCustomDistanceMode, setIsCustomDistanceMode] = useState(false);
  const [customDistanceKm, setCustomDistanceKm] = useState(45);
  const [customCorridor, setCustomCorridor] = useState('tunelOriente');

  // Filtered locations by subregion
  const filteredLocations = useMemo(() => {
    if (selectedSubregion === 'all') return LOCATIONS_ANTIOQUIA;
    return LOCATIONS_ANTIOQUIA.filter(loc => loc.subregionId === selectedSubregion);
  }, [selectedSubregion]);

  const selectedLocation = useMemo(() => {
    if (isCustomDistanceMode) {
      const tollInfo = TOLL_RATES_ANTIOQUIA_2026[customCorridor] || { name: 'Sin Peaje', oneWay: 0 };
      const computed = computeMarketViaticos({
        distanceKmOneWay: customDistanceKm,
        roundTripTollCost: tollInfo.oneWay * 2,
        tollNames: [tollInfo.name],
        requiresOvernight: customDistanceKm > 200,
        isMetropolitan: customDistanceKm <= 15 && customCorridor === 'ninguno'
      });

      return {
        id: 'custom-location',
        zone: customDistanceKm > 200 ? 'Límite Departamental Extremo' : 'Zona Rural / Finca Privada',
        city: `Finca o Vereda Personalizada (~${customDistanceKm} km)`,
        travelCost: computed.travelCost,
        technicalVisitCost: computed.technicalVisitCost,
        estimatedDistanceKm: customDistanceKm,
        distanceKm: customDistanceKm,
        tollsRoundTrip: tollInfo.oneWay * 2,
        tollDetails: `${tollInfo.name} (${formatCOP(tollInfo.oneWay * 2)} I/V)`,
        marketBreakdown: computed.breakdown
      };
    }

    const found = LOCATIONS_ANTIOQUIA.find(loc => loc.id === selectedLocationId) || LOCATIONS_ANTIOQUIA[0];
    
    if (!found.marketBreakdown) {
      const computed = computeMarketViaticos({
        distanceKmOneWay: found.distanceKm || found.estimatedDistanceKm || 10,
        roundTripTollCost: found.tollsRoundTrip || 0,
        tollNames: [found.tollDetails || 'Corredor vial'],
        requiresOvernight: (found.distanceKm || 0) > 200,
        isMetropolitan: found.isMetropolitan || false
      });
      return { ...found, marketBreakdown: computed.breakdown };
    }

    return found;
  }, [isCustomDistanceMode, customDistanceKm, customCorridor, selectedLocationId]);

  // Selected quotation items with quantity
  const [quoteItems, setQuoteItems] = useState([
    {
      productId: 'prod-cort-02',
      name: 'Cortina Blackout Motorizada Premium a la Medida',
      category: 'cortinas',
      price: 1350000,
      cost: 675000,
      laborPoints: 2,
      quantity: 2
    },
    {
      productId: 'prod-dom-01',
      name: 'Kit Tira LED COB Smart RGB+CCT 24V (5 Metros)',
      category: 'domotica',
      price: 395000,
      cost: 197500,
      laborPoints: 1,
      quantity: 3
    },
    {
      productId: 'prod-seg-01',
      name: 'Cerradura Biométrica Inteligente JJ Tech SmartPro',
      category: 'seguridad',
      price: 1290000,
      cost: 645000,
      laborPoints: 2,
      quantity: 1
    }
  ]);

  // Installment Financing State
  const [installments, setInstallments] = useState(12);

  // Client additional notes
  const [notes, setNotes] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);

  // Available products for adding to quote
  const availableProducts = useMemo(() => {
    return products.filter(p => p.inQuoteCalculator !== false);
  }, [products]);

  const [selectedAddProductId, setSelectedAddProductId] = useState('');

  // Calculations
  const calculations = useMemo(() => {
    // 1. Materials Direct Cost
    const materialsCost = quoteItems.reduce((acc, item) => acc + (item.cost * item.quantity), 0);
    // Materials Retail / Value
    const materialsRetail = quoteItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // 2. Qualified Labor
    const totalLaborPoints = quoteItems.reduce((acc, item) => acc + (item.laborPoints * item.quantity), 0);
    const laborCost = totalLaborPoints * QUOTATION_RULES.baseLaborPointCost;

    // 3. Direct Cost Base
    const directBaseCost = materialsCost + laborCost;

    // 4. Configured Profit Margin of 50% tax-free
    const marginAmount = directBaseCost * (QUOTATION_RULES.profitMarginPercent / 100);
    const subtotalWithMargin = directBaseCost + marginAmount;

    // 5. Travel / Viáticos
    const travelCost = selectedLocation.travelCost;

    // 6. Technical Visit Fee & 100% Rebate / Abono
    const technicalVisitCost = selectedLocation.technicalVisitCost;
    const visitDiscount = QUOTATION_RULES.discountVisitOnAcceptance ? technicalVisitCost : 0;

    // 7. Grand Total for the client
    const grandTotal = subtotalWithMargin + travelCost;

    // 8. Monthly financing quota
    const monthlyInstallment = Math.round(grandTotal / installments);

    return {
      materialsCost,
      materialsRetail,
      totalLaborPoints,
      laborCost,
      directBaseCost,
      marginAmount,
      subtotalWithMargin,
      travelCost,
      technicalVisitCost,
      visitDiscount,
      grandTotal,
      monthlyInstallment
    };
  }, [quoteItems, selectedLocation, installments]);

  // Handlers
  const handleLoadCombo = (combo) => {
    soundFx.playSuccess();
    const newItems = [];
    combo.items.forEach(({ id, qty }) => {
      const prod = products.find(p => p.id === id);
      if (prod) {
        newItems.push({
          productId: prod.id,
          name: prod.name,
          category: prod.category,
          price: prod.price,
          cost: prod.cost,
          laborPoints: prod.installationLaborPoints || 1,
          quantity: qty
        });
      }
    });

    if (newItems.length > 0) {
      setQuoteItems(newItems);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!selectedAddProductId) return;

    const prod = products.find(p => p.id === selectedAddProductId);
    if (!prod) return;

    soundFx.playSwitch();
    const existingIndex = quoteItems.findIndex(i => i.productId === prod.id);
    if (existingIndex > -1) {
      const updated = [...quoteItems];
      updated[existingIndex].quantity += 1;
      setQuoteItems(updated);
    } else {
      setQuoteItems(prev => [
        ...prev,
        {
          productId: prod.id,
          name: prod.name,
          category: prod.category,
          price: prod.price,
          cost: prod.cost,
          laborPoints: prod.installationLaborPoints || 1,
          quantity: 1
        }
      ]);
    }
    setSelectedAddProductId('');
  };

  const handleUpdateQuantity = (index, delta) => {
    soundFx.playSwitch(500);
    setQuoteItems(prev => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    soundFx.playSwitch(300);
    setQuoteItems(prev => prev.filter((_, i) => i !== index));
  };

  // Save Quotation Handler
  const handleSaveQuote = () => {
    if (!isAuthenticated) {
      onOpenAuthModal();
      return;
    }

    const quoteData = {
      customerName: currentUser.displayName || currentUser.email,
      customerEmail: currentUser.email,
      locationCity: `${selectedLocation.city} (${selectedLocation.zone})`,
      materialsTotal: calculations.materialsCost,
      laborTotal: calculations.laborCost,
      marginAmount: calculations.marginAmount,
      travelCost: calculations.travelCost,
      technicalVisitCost: calculations.technicalVisitCost,
      visitDiscount: calculations.visitDiscount,
      grandTotal: calculations.grandTotal,
      itemsCount: quoteItems.reduce((sum, item) => sum + item.quantity, 0),
      notes: notes,
      items: quoteItems
    };

    const saved = createQuote(quoteData);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    setSaveSuccessMsg(`¡Cotización ${saved.id} guardada exitosamente en tu perfil!`);
    setTimeout(() => setSaveSuccessMsg(null), 5000);
  };

  // WhatsApp Dispatch
  const handleWhatsAppDispatch = () => {
    const quotePayload = {
      selectedItems: quoteItems,
      location: selectedLocation,
      materialsTotal: calculations.materialsCost,
      laborTotal: calculations.laborCost,
      marginAmount: calculations.marginAmount,
      travelCost: calculations.travelCost,
      technicalVisitCost: calculations.technicalVisitCost,
      subtotalWithMargin: calculations.subtotalWithMargin,
      grandTotal: calculations.grandTotal,
      customerName: currentUser?.displayName || '',
      notes: notes
    };

    const link = createWhatsAppQuoteLink(quotePayload);
    window.open(link, '_blank');
  };

  const handleWhatsAppFinancingDispatch = () => {
    const msg = `*¡Hola JJ Tech! Deseo consultar financiación a ${installments} cuotas*\n\n` +
      `*Monto Total:* ${formatCOP(calculations.grandTotal)}\n` +
      `*Cuota Estimada:* ${formatCOP(calculations.monthlyInstallment)} / mes (${installments} meses)\n` +
      `*Ubicación:* ${selectedLocation.city}\n\n` +
      `_¿Cuáles son los requisitos de aprobación inmediata con Bancolombia / Addi / Tarjeta?_`;
    window.open(`https://wa.me/573025769589?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section className="section calculator-section">
      <div className="container">
        <div className="section__header">
          <span className="badge-sub">PRESUPUESTOS DE ALTA PRECISIÓN</span>
          <h2 className="title">
            Calculadora de Cotización <br />
            <span className="highlight">Inteligente con Viáticos, Margen 50% y Cuotas</span>
          </h2>
          <p className="subtitle">
            Cotiza tu proyecto con total transparencia: costo real de materiales, mano de obra certificada, viáticos calculados para Medellín o municipios alejados (Guatapé, Oriente) y visita técnica 100% abonable.
          </p>
        </div>

        {/* 0. Preconfigured Turnkey Packages */}
        <div className="preset-combos-wrapper glass-card">
          <div className="combos-header">
            <Sparkles size={18} className="icon-cyan" />
            <div>
              <h3>Paquetes Llave en Mano Populares en Antioquia</h3>
              <p>Carga una solución completa con 1 solo clic y ajusta los detalles a tu gusto.</p>
            </div>
          </div>

          <div className="combos-grid">
            {PRESET_COMBOS.map((combo) => {
              const Icon = combo.icon;
              return (
                <div key={combo.id} className="combo-card" onClick={() => handleLoadCombo(combo)}>
                  <div className="combo-top">
                    <Icon size={20} className="combo-icon" />
                    <span className="combo-badge">{combo.badge}</span>
                  </div>
                  <h4>{combo.name}</h4>
                  <p>{combo.desc}</p>
                  <span className="load-label">
                    <Check size={14} /> Cargar Este Paquete
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="calculator-layout">
          {/* Left Column: Configuration & Equipment Picker */}
          <div className="calculator-controls glass-card">
            {/* 1. Location in Antioquia (All 9 Subregions & 2026 Market Calculator) */}
            <div className="calc-card-section location-card-section">
              <div className="section-title-box">
                <MapPin className="icon-accent" size={20} />
                <div>
                  <h3>1. Cobertura & Viáticos Reales en Antioquia</h3>
                  <p>
                    Calculados con tarifas oficiales de peajes 2026, gasolina corriente a {formatCOP(MARKET_BENCHMARKS_2026.fuelGasolineCOPPerGallon)}/galón y logística de cuadrilla técnica.
                  </p>
                </div>
              </div>

              {/* Mode Switcher: Municipality vs Custom Finca / Km */}
              <div className="location-mode-switcher">
                <button 
                  type="button" 
                  className={`mode-btn ${!isCustomDistanceMode ? 'active' : ''}`}
                  onClick={() => setIsCustomDistanceMode(false)}
                >
                  <MapPin size={15} />
                  <span>Municipios de Antioquia (9 Subregiones)</span>
                </button>
                <button 
                  type="button" 
                  className={`mode-btn ${isCustomDistanceMode ? 'active' : ''}`}
                  onClick={() => setIsCustomDistanceMode(true)}
                >
                  <Sliders size={15} />
                  <span>Finca Rural / Kilometraje Exacto</span>
                </button>
              </div>

              {!isCustomDistanceMode ? (
                <>
                  {/* Subregion filter chips */}
                  <div className="subregion-chips-wrapper">
                    <span className="chips-label">Filtrar Subregión:</span>
                    <div className="subregion-chips-scroll">
                      <button 
                        type="button" 
                        className={`s-chip ${selectedSubregion === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedSubregion('all')}
                      >
                        Todas las Subregiones ({LOCATIONS_ANTIOQUIA.length})
                      </button>
                      {ANTIOQUIA_SUBREGIONS.map(sub => (
                        <button 
                          key={sub.id} 
                          type="button" 
                          className={`s-chip ${selectedSubregion === sub.id ? 'active' : ''}`}
                          onClick={() => setSelectedSubregion(sub.id)}
                        >
                          {sub.name.split(' (')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="location-picker-grid">
                    <div className="form-group">
                      <label>Municipio o Corredor de Destino ({filteredLocations.length} disponibles):</label>
                      <select 
                        value={selectedLocationId}
                        onChange={(e) => setSelectedLocationId(e.target.value)}
                        className="location-select"
                      >
                        {filteredLocations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.city} • {loc.subregionName || loc.zone} (Viáticos: {loc.travelCost === 0 ? 'Sin recargo local' : formatCOP(loc.travelCost)})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                /* Custom Distance & Corridor Mode */
                <div className="custom-distance-box">
                  <div className="custom-distance-grid">
                    <div className="form-group">
                      <label>
                        Distancia estimada desde Medellín (Km ida): <strong>{customDistanceKm} km</strong> (~{customDistanceKm * 2} km ida y vuelta)
                      </label>
                      <input 
                        type="range" 
                        min="5" 
                        max="400" 
                        step="5"
                        value={customDistanceKm}
                        onChange={(e) => setCustomDistanceKm(Number(e.target.value))}
                        className="distance-range-slider"
                      />
                      <div className="slider-range-labels">
                        <span>5 km (Urbano)</span>
                        <span>40 km (Oriente/Occidente)</span>
                        <span>120 km (Suroeste)</span>
                        <span>400 km (Límite Urabá/Costa)</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Corredor Vial / Peaje Principal de Acceso:</label>
                      <select 
                        value={customCorridor}
                        onChange={(e) => setCustomCorridor(e.target.value)}
                        className="location-select"
                      >
                        <option value="tunelOriente">Túnel de Oriente ($26.300/sentido - Rionegro/Llanogrande)</option>
                        <option value="tunelOccidente">Túnel de Occidente ($27.300/sentido - Santa Fe/Sopetrán)</option>
                        <option value="variantePalmas">Variante Las Palmas ($20.200/sentido)</option>
                        <option value="palmasRetiro">Las Palmas El Retiro ($13.600/sentido)</option>
                        <option value="copacabanaGuarne">Autopista Copacabana-Guarne ($18.600/sentido)</option>
                        <option value="amagaPacifico">Pacífico 1 Peaje Amagá ($25.900/sentido - Suroeste)</option>
                        <option value="trapicheNorte">Troncal Norte Peaje El Trapiche ($16.800/sentido)</option>
                        <option value="cisnerosNus">Vías del Nus / Túnel La Quiebra ($18.000/sentido)</option>
                        <option value="puertoTriunfo">Autopista Medellín - Bogotá 2 Peajes ($34.800/sentido)</option>
                        <option value="bajoCauca">Troncal Norte Bajo Cauca 3 Peajes ($48.500/sentido)</option>
                        <option value="uraba">Autopistas Mar 1 & 2 Urabá 4 Peajes ($62.000/sentido)</option>
                        <option value="ninguno">Vía secundaria local sin peajes</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Real-time Market Transparency Card */}
              <div className="market-breakdown-card">
                <div className="market-breakdown-header">
                  <div className="breakdown-title">
                    <Fuel size={16} className="cyan-icon" />
                    <strong>Desglose Logístico de Mercado (Ida y Vuelta):</strong>
                  </div>
                  <span className="market-live-tag">⚡ Tarifas Octubre 2026</span>
                </div>

                <div className="breakdown-items-grid">
                  <div className="b-chip">
                    <span>🛣️ Peajes del Corredor:</span>
                    <strong>{formatCOP(selectedLocation.tollsRoundTrip || selectedLocation.marketBreakdown?.tollsCOP || 0)}</strong>
                    <small>{selectedLocation.tollDetails || 'Sin peaje'}</small>
                  </div>
                  <div className="b-chip">
                    <span>⛽ Combustible Estimado:</span>
                    <strong>{formatCOP(selectedLocation.marketBreakdown?.fuelCostCOP || 0)}</strong>
                    <small>~{selectedLocation.marketBreakdown?.roundTripKm || (selectedLocation.estimatedDistanceKm * 2)} km I/V @ $16.297/gal</small>
                  </div>
                  <div className="b-chip">
                    <span>👷 Logística Cuadrilla:</span>
                    <strong>{formatCOP(selectedLocation.marketBreakdown?.crewFoodAndLodgingCOP || 0)}</strong>
                    <small>{(selectedLocation.distanceKm || selectedLocation.estimatedDistanceKm) > 200 ? 'Hospedaje + alimentación' : (selectedLocation.distanceKm || selectedLocation.estimatedDistanceKm) > 90 ? 'Alimentación completa' : (selectedLocation.distanceKm || selectedLocation.estimatedDistanceKm) > 15 ? 'Almuerzo e hidratación' : 'Perímetro metropolitano'}</small>
                  </div>
                  <div className="b-chip total-chip">
                    <span>🚗 Viáticos de Traslado:</span>
                    <strong className="cyan-highlight">{formatCOP(selectedLocation.travelCost)}</strong>
                    <small>Furgón con herramientas de precisión</small>
                  </div>
                </div>

                <div className="visit-rebate-notice">
                  <div className="notice-left">
                    <Info size={16} className="info-icon" />
                    <div>
                      <span>Valor Visita Técnica Previa: <strong>{formatCOP(selectedLocation.technicalVisitCost)}</strong></span>
                      <p>Diagnóstico en el predio y modelado 3D de ingeniería.</p>
                    </div>
                  </div>
                  <div className="notice-badge">
                    <Check size={14} />
                    <span>100% Deducible al Contratar</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Equipment Selection */}
            <div className="calc-card-section">
              <div className="section-title-box">
                <Sparkles className="icon-accent" size={20} />
                <div>
                  <h3>2. Equipos y Componentes del Sistema</h3>
                  <p>Añade los elementos para tu solución domótica, de cine o seguridad.</p>
                </div>
              </div>

              {/* Add item bar */}
              <form className="add-item-form" onSubmit={handleAddItem}>
                <select 
                  value={selectedAddProductId}
                  onChange={(e) => setSelectedAddProductId(e.target.value)}
                  className="product-selector"
                >
                  <option value="">-- Seleccionar producto para agregar --</option>
                  {availableProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} [{p.category.toUpperCase()}] - {formatCOP(p.price)}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn btn-accent btn-sm" disabled={!selectedAddProductId}>
                  <Plus size={16} />
                  <span>Añadir</span>
                </button>
              </form>

              {/* Items List Table */}
              <div className="quote-items-table">
                {quoteItems.length === 0 ? (
                  <div className="empty-table">
                    <AlertCircle size={24} />
                    <p>No has agregado ningún equipo aún. Selecciona uno del menú superior o carga un paquete.</p>
                  </div>
                ) : (
                  quoteItems.map((item, idx) => (
                    <div key={idx} className="quote-item-row">
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <div className="item-meta">
                          <span className="category-tag">{item.category}</span>
                          <span className="unit-price">{formatCOP(item.price)} c/u</span>
                          <span className="labor-points">🛠️ {item.laborPoints} ptos instal.</span>
                        </div>
                      </div>

                      <div className="item-qty-controls">
                        <button 
                          className="qty-btn"
                          onClick={() => handleUpdateQuantity(idx, -1)}
                          aria-label="Disminuir"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => handleUpdateQuantity(idx, 1)}
                          aria-label="Aumentar"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="item-row-total">
                        <strong>{formatCOP(item.price * item.quantity)}</strong>
                      </div>

                      <button 
                        className="delete-item-btn"
                        onClick={() => handleRemoveItem(idx)}
                        title="Eliminar ítem"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="calc-card-section notes-section">
              <label>Observaciones o requerimientos especiales del inmueble:</label>
              <textarea 
                rows="2" 
                placeholder="Ej. Casa de 2 niveles, techos en drywall, se requiere ductería adicional..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Right Column: Financial Breakdown & Financing Simulator */}
          <div className="calculator-summary glass-card">
            <div className="summary-header">
              <FileText size={20} className="icon-cyan" />
              <div>
                <h3>Desglose Financiero Oficial</h3>
                <span className="badge-regla">Margen del 50% Libre de Impuestos</span>
              </div>
            </div>

            <div className="breakdown-list">
              {/* Materiales Directos */}
              <div className="breakdown-row">
                <div>
                  <span>1. Costo Base de Materiales</span>
                  <small>Equipos, cableado y componentes de fábrica</small>
                </div>
                <strong>{formatCOP(calculations.materialsCost)}</strong>
              </div>

              {/* Mano de Obra */}
              <div className="breakdown-row">
                <div>
                  <span>2. Mano de Obra Calificada</span>
                  <small>{calculations.totalLaborPoints} puntos técnicos x {formatCOP(QUOTATION_RULES.baseLaborPointCost)}</small>
                </div>
                <strong>{formatCOP(calculations.laborCost)}</strong>
              </div>

              {/* Margen Comercial 50% */}
              <div className="breakdown-row margin-row">
                <div>
                  <span className="margin-title">3. Margen Comercial (50%)</span>
                  <small>Utilidad bruta libre de impuestos sobre costos directos</small>
                </div>
                <strong className="margin-val">+{formatCOP(calculations.marginAmount)}</strong>
              </div>

              <div className="divider-line"></div>

              {/* Subtotal con Margen */}
              <div className="breakdown-row subtotal-row">
                <span>Subtotal Solución Instalada</span>
                <strong>{formatCOP(calculations.subtotalWithMargin)}</strong>
              </div>

              {/* Viáticos Traslado */}
              <div className="breakdown-row">
                <div>
                  <span>Viáticos de Desplazamiento</span>
                  <small>{selectedLocation.city} ({selectedLocation.estimatedDistanceKm} km)</small>
                </div>
                <strong>+{formatCOP(calculations.travelCost)}</strong>
              </div>

              {/* Visita Técnica y Regla de Abono */}
              <div className="breakdown-row visit-box">
                <div className="visit-detail">
                  <span className="visit-title">Visita Técnica Inicial: {formatCOP(calculations.technicalVisitCost)}</span>
                  <span className="visit-bonus">
                    <CheckCircle size={14} /> ¡Abono 100% Deducible al Contratar!
                  </span>
                </div>
                <strong className="visit-discount-tag">-$0 NETO</strong>
              </div>

              <div className="grand-total-box">
                <span className="total-label">VALOR TOTAL ESTIMADO DEL PROYECTO</span>
                <span className="total-number">{formatCOP(calculations.grandTotal)}</span>
                <span className="total-legal">Incluye materiales, programación, garantía y visita técnica deducible</span>
              </div>

              {/* 4. Financing Installment Simulator */}
              <div className="financing-simulator-box">
                <div className="fin-header">
                  <CreditCard size={16} className="icon-cyan" />
                  <h4>Paga a Cuotas en Colombia</h4>
                </div>

                <div className="installments-selector">
                  {[6, 12, 24, 36].map((num) => (
                    <button
                      key={num}
                      className={`inst-btn ${installments === num ? 'active' : ''}`}
                      onClick={() => setInstallments(num)}
                    >
                      {num} Meses
                    </button>
                  ))}
                </div>

                <div className="quota-display">
                  <span>Cuota mensual estimada ({installments} meses):</span>
                  <strong>{formatCOP(calculations.monthlyInstallment)} / mes</strong>
                </div>

                <span className="fin-partner-text">
                  Convenios con Bancolombia, Tarjetas de Crédito y Addi sin papeleo.
                </span>

                <button 
                  className="btn btn-outline btn-sm w-full financing-cta-btn"
                  onClick={handleWhatsAppFinancingDispatch}
                >
                  <CreditCard size={14} />
                  <span>Pre-aprobar Cuotas por WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Notification alert */}
            {saveSuccessMsg && (
              <div className="save-alert">
                <CheckCircle size={18} />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Actions Buttons */}
            <div className="summary-actions">
              <button 
                className="btn btn-whatsapp w-full"
                onClick={handleWhatsAppDispatch}
              >
                <Send size={18} />
                <span>Enviar Cotización por WhatsApp (+57 302...)</span>
              </button>

              <div className="secondary-action-row">
                <button 
                  className="btn btn-outline flex-1"
                  onClick={handleSaveQuote}
                >
                  <Save size={16} />
                  <span>{isAuthenticated ? 'Guardar en Mi Cuenta' : 'Ingresar para Guardar'}</span>
                </button>

                <button 
                  className="btn btn-outline"
                  onClick={() => window.print()}
                  title="Imprimir o guardar PDF"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
