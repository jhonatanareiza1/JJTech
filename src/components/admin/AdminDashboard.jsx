// ==========================================
// JJ TECH - ADMIN DASHBOARD & FINANCIAL MOODBOARD
// ==========================================
import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  RotateCcw, 
  Sparkles, 
  PieChart, 
  Layers, 
  Percent, 
  AlertCircle,
  Truck,
  Users,
  Upload,
  Image as ImageIcon,
  Camera,
  MapPin,
  Cloud,
  CloudOff,
  Database,
  Key,
  Copy,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { formatCOP, formatNumber } from '../../utils/formatters';
import { PRODUCT_CATEGORIES } from '../../config/constants';
import { compressImage } from '../../utils/imageOptimizer';
import './AdminDashboard.scss';

const PRESET_IMAGES = [
  '/assets/images/hero-smart-home.jpg',
  '/assets/images/banners-domotica-cinema.jpg',
  '/assets/images/master-bedroom-night.jpg',
  '/assets/images/installation-technician.jpg',
  '/assets/images/brand-moodboard-services.jpg'
];

export const AdminDashboard = ({ onOpenAdminLogin }) => {
  const { isAdmin, currentUser, logout } = useAuth();
  const { 
    products, 
    finances, 
    quotes, 
    bookings, 
    projects = [],
    isCloudActive,
    addOrUpdateProduct, 
    removeProduct, 
    addOrUpdateProject, 
    removeProject,
    changeQuoteStatus, 
    changeBookingStatus,
    resetAllData 
  } = useData();

  const [activeAdminTab, setActiveAdminTab] = useState('moodboard'); // 'moodboard', 'inventory', 'projects', 'quotes', 'bookings'
  
  // Firebase Setup Modal State
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  // File Input Refs para disparo 100% confiable
  const productFileInputRef = React.useRef(null);
  const projectFileInputRef = React.useRef(null);

  // Product Edit / Create Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productImagePreview, setProductImagePreview] = useState('/assets/images/hero-smart-home.jpg');
  const [isUploadingProductImage, setIsUploadingProductImage] = useState(false);

  // Real Projects Edit / Create Modal State
  const [editingProject, setEditingProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectImagePreview, setProjectImagePreview] = useState('/assets/images/banners-domotica-cinema.jpg');
  const [isUploadingProjImage, setIsUploadingProjImage] = useState(false);

  // If user is not admin, show secure access gate
  if (!isAdmin) {
    return (
      <section className="section admin-lock-section">
        <div className="container">
          <div className="lock-card glass-card">
            <div className="lock-icon-circle">
              <ShieldCheck size={48} />
            </div>
            <h2>Módulo Administrativo Exclusivo</h2>
            <p>
              El Moodboard Financiero, la analítica gerencial y la gestión de inventario están restringidos para el equipo de ingeniería y administración de JJ Tech.
            </p>
            <div className="lock-credentials-hint">
              <span>Credenciales Demo de Administrador:</span>
              <code>Usuario: admin@jjtech.com / Clave: admin</code>
            </div>
            <button className="btn btn-accent btn-lg" onClick={onOpenAdminLogin}>
              Ingresar al Panel Administrativo
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Product modal form submission
  const handleSaveProductForm = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const prodData = {
        ...(editingProduct || {}),
        name: formData.get('name') || 'Nuevo Producto JJ Tech',
        category: formData.get('category') || 'domotica',
        brand: formData.get('brand') || 'JJ Tech',
        price: Number(formData.get('price')) || 0,
        cost: Number(formData.get('cost')) || 0,
        stock: Number(formData.get('stock')) || 1,
        shortDesc: formData.get('shortDesc') || '',
        image: productImagePreview || '/assets/images/hero-smart-home.jpg',
        installationLaborPoints: Number(formData.get('laborPoints') || 1)
      };

      await addOrUpdateProduct(prodData);
      setIsProductModalOpen(false);
      setEditingProduct(null);
      alert("✅ ¡Producto guardado exitosamente!");
    } catch (err) {
      console.error("Error guardando producto:", err);
      alert("Error al guardar: " + err.message);
    }
  };

  const handleProductFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      setIsUploadingProductImage(true);
      // 1. Vista previa local inmediata en 50ms
      const optimized = await compressImage(file, 900, 900, 0.85);
      setProductImagePreview(optimized);

      // 2. Intento de subida a la nube con fallback
      try {
        const uploadedUrl = await dataService.uploadMedia(optimized, `products/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
        if (uploadedUrl && typeof uploadedUrl === 'string' && uploadedUrl.startsWith('http')) {
          setProductImagePreview(uploadedUrl);
        }
      } catch (cloudErr) {
        console.warn("Storage cloud fallback, usando copia optimizada:", cloudErr);
      }
    } catch (err) {
      console.error("Error optimizando imagen:", err);
      alert("Error al procesar la imagen: " + err.message);
    } finally {
      setIsUploadingProductImage(false);
      if (e.target) e.target.value = '';
    }
  };

  // Project modal form submission
  const handleSaveProjectForm = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const rawEquipment = formData.get('equipmentList') || '';
      const equipmentList = rawEquipment
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const projCategory = formData.get('category') || 'cine';
      let categoryLabel = 'Domótica & Confort';
      if (projCategory === 'cine') categoryLabel = 'Cine & Audio (Taluha Home)';
      else if (projCategory === 'seguridad') categoryLabel = 'Seguridad 4K & CCTV';

      const projData = {
        ...(editingProject || {}),
        title: formData.get('title') || 'Obra Residencial JJ Tech',
        location: formData.get('location') || 'Medellín',
        zone: formData.get('zone') || 'poblado',
        category: projCategory,
        categoryLabel: categoryLabel,
        investmentCOP: Number(formData.get('investmentCOP') || 0),
        headline: formData.get('headline') || '',
        description: formData.get('description') || '',
        image: projectImagePreview || '/assets/images/banners-domotica-cinema.jpg',
        equipmentList: equipmentList.length > 0 ? equipmentList : ['Instalación profesional JJ Tech']
      };

      await addOrUpdateProject(projData);
      setIsProjectModalOpen(false);
      setEditingProject(null);
      alert("✅ ¡Obra publicada exitosamente en el portafolio!");
    } catch (err) {
      console.error("Error guardando proyecto:", err);
      alert("Error al guardar obra: " + err.message);
    }
  };

  const handleProjectFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      setIsUploadingProjImage(true);
      // 1. Vista previa local inmediata en 50ms
      const optimized = await compressImage(file, 1200, 1200, 0.85);
      setProjectImagePreview(optimized);

      // 2. Intento de subida a la nube con fallback
      try {
        const uploadedUrl = await dataService.uploadMedia(optimized, `projects/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
        if (uploadedUrl && typeof uploadedUrl === 'string' && uploadedUrl.startsWith('http')) {
          setProjectImagePreview(uploadedUrl);
        }
      } catch (cloudErr) {
        console.warn("Storage cloud fallback, usando copia optimizada:", cloudErr);
      }
    } catch (err) {
      console.error("Error optimizando imagen de obra:", err);
      alert("Error al procesar la imagen: " + err.message);
    } finally {
      setIsUploadingProjImage(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <section className="section admin-section">
      <div className="container">
        {/* Admin Header */}
        <div className="admin-header-bar glass-card">
          <div className="admin-brand-status">
            <div className="admin-avatar-box">
              <ShieldCheck size={24} className="icon-cyan" />
            </div>
            <div>
              <span className="admin-badge-label">PANEL DE CONTROL CORPORATIVO</span>
              <h2>Consola de Gestión JJ Tech</h2>
              <span className="user-welcome">Conectado como: <strong>{currentUser?.email}</strong></span>
            </div>
          </div>

          <div className="admin-header-actions">
            <button 
              className={`btn btn-sm cloud-status-btn ${isCloudActive ? 'cloud-active' : 'cloud-local'}`}
              onClick={() => setIsFirebaseModalOpen(true)}
              title="Estado de sincronización en la nube con Google Firebase"
            >
              {isCloudActive ? <Cloud size={14} /> : <CloudOff size={14} />}
              <span>{isCloudActive ? 'Firebase Activo' : 'Modo Local (Conectar Firebase)'}</span>
            </button>
            <button className="btn btn-outline btn-sm reset-btn" onClick={() => { if(confirm('¿Restablecer datos demo iniciales?')) resetAllData(); }}>
              <RotateCcw size={14} />
              <span>Restablecer Datos</span>
            </button>
            <button className="btn btn-outline btn-sm" onClick={logout}>
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button 
            className={`tab-btn ${activeAdminTab === 'moodboard' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('moodboard')}
          >
            <BarChart3 size={18} />
            <span>Moodboard Financiero & Analítica</span>
          </button>
          <button 
            className={`tab-btn ${activeAdminTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('inventory')}
          >
            <Package size={18} />
            <span>Gestión de Inventario ({products.length})</span>
          </button>
          <button 
            className={`tab-btn ${activeAdminTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('projects')}
          >
            <Camera size={18} />
            <span>Obras & Portafolio ({projects.length})</span>
          </button>
          <button 
            className={`tab-btn ${activeAdminTab === 'quotes' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('quotes')}
          >
            <FileText size={18} />
            <span>Cotizaciones de Clientes ({quotes.length})</span>
          </button>
          <button 
            className={`tab-btn ${activeAdminTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('bookings')}
          >
            <Calendar size={18} />
            <span>Agendamientos ({bookings.length})</span>
          </button>
        </div>

        {/* 1. FINANCIAL MOODBOARD ANALYTICS */}
        {activeAdminTab === 'moodboard' && finances && (
          <div className="moodboard-container">
            {/* KPI Cards Grid */}
            <div className="kpis-grid">
              {/* Total Revenue */}
              <div className="kpi-card glass-card">
                <div className="kpi-header">
                  <span className="kpi-title">Ingresos Totales (2026)</span>
                  <div className="kpi-icon-box cyan">
                    <DollarSign size={20} />
                  </div>
                </div>
                <strong className="kpi-value">{formatCOP(finances.totalRevenue)}</strong>
                <div className="kpi-trend positive">
                  <TrendingUp size={14} />
                  <span>+18.5% vs trimestre anterior</span>
                </div>
              </div>

              {/* Operating Expenses */}
              <div className="kpi-card glass-card">
                <div className="kpi-header">
                  <span className="kpi-title">Gastos Operativos</span>
                  <div className="kpi-icon-box orange">
                    <TrendingUp size={20} />
                  </div>
                </div>
                <strong className="kpi-value">{formatCOP(finances.operatingExpenses)}</strong>
                <span className="kpi-subtext">Materiales, mano de obra, viáticos y comisiones</span>
              </div>

              {/* Net Profit */}
              <div className="kpi-card glass-card highlight-kpi">
                <div className="kpi-header">
                  <span className="kpi-title">Ganancias Netas Reales</span>
                  <div className="kpi-icon-box green">
                    <Sparkles size={20} />
                  </div>
                </div>
                <strong className="kpi-value green-text">{formatCOP(finances.netProfit)}</strong>
                <div className="kpi-trend positive">
                  <span>Margen Neto: <strong>{finances.profitMarginPercentage}%</strong></span>
                </div>
              </div>

              {/* Conversion & Projects */}
              <div className="kpi-card glass-card">
                <div className="kpi-header">
                  <span className="kpi-title">Proyectos & Conversión</span>
                  <div className="kpi-icon-box purple">
                    <Percent size={20} />
                  </div>
                </div>
                <strong className="kpi-value">{finances.completedProjects} Obras</strong>
                <span className="kpi-subtext">{finances.conversionRatePercent}% conversión de visitas a contratos</span>
              </div>
            </div>

            {/* Financial Visual Charts Grid */}
            <div className="charts-grid">
              {/* Chart 1: Cost Breakdown (Donut / Progress Breakdown) */}
              <div className="chart-card glass-card">
                <div className="chart-header">
                  <PieChart size={18} className="icon-cyan" />
                  <div>
                    <h3>Desglose de Costes por Categoría</h3>
                    <p>Distribución de egresos directos de operación</p>
                  </div>
                </div>

                <div className="cost-breakdown-bars">
                  {finances.costBreakdown.map((item, idx) => (
                    <div key={idx} className="cost-item-block">
                      <div className="cost-item-label">
                        <span className="name">{item.category}</span>
                        <span className="val">{formatCOP(item.amount)} ({item.percentage}%)</span>
                      </div>
                      <div className="progress-track">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${item.percentage}%`,
                            backgroundColor: item.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cost-summary-pills">
                  <div className="pill-item">
                    <Truck size={14} />
                    <span>Viáticos Medellín & Guatapé: <strong>{formatCOP(6800000)}</strong></span>
                  </div>
                  <div className="pill-item">
                    <Users size={14} />
                    <span>Mano de Obra Local: <strong>{formatCOP(24200000)}</strong></span>
                  </div>
                </div>
              </div>

              {/* Chart 2: Revenue by Product / Service Line */}
              <div className="chart-card glass-card">
                <div className="chart-header">
                  <Layers size={18} className="icon-cyan" />
                  <div>
                    <h3>Ingresos por Línea de Producto / Servicio</h3>
                    <p>Rendimiento comercial por especialidad</p>
                  </div>
                </div>

                <div className="revenue-lines-list">
                  {finances.revenueByLine.map((line, idx) => (
                    <div key={idx} className="revenue-line-row">
                      <div className="line-info">
                        <div className="line-color-dot" style={{ backgroundColor: line.color }}></div>
                        <div>
                          <strong className="line-name">{line.line}</strong>
                          <span className="line-count">{line.count} contratos concluidos</span>
                        </div>
                      </div>
                      <strong className="line-revenue">{formatCOP(line.revenue)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Trend Table */}
            <div className="trend-card glass-card">
              <div className="chart-header">
                <TrendingUp size={18} className="icon-cyan" />
                <div>
                  <h3>Evolución Mensual 2026 (Pesos Colombianos)</h3>
                  <p>Balance consolidado de facturación, egresos y utilidad mensual</p>
                </div>
              </div>

              <div className="trend-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th>Ingresos Totales</th>
                      <th>Gastos Operativos</th>
                      <th>Utilidad Neta</th>
                      <th>Rentabilidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finances.monthlyTrend.map((m, i) => {
                      const margin = ((m.profit / m.revenue) * 100).toFixed(1);
                      return (
                        <tr key={i}>
                          <td><strong>{m.month} 2026</strong></td>
                          <td className="cyan-text">{formatCOP(m.revenue)}</td>
                          <td className="muted-text">{formatCOP(m.expenses)}</td>
                          <td className="green-text"><strong>{formatCOP(m.profit)}</strong></td>
                          <td>
                            <span className="margin-badge">{margin}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. INVENTORY & CONTENT MANAGEMENT */}
        {activeAdminTab === 'inventory' && (
          <div className="inventory-management-container">
            <div className="inventory-actions-bar">
              <div>
                <h3>Catálogo de Productos ({products.length} ítems)</h3>
                <p>Modifica precios, costos base, existencias y añade nuevos equipos.</p>
              </div>
              <button 
                className="btn btn-accent btn-sm"
                onClick={() => {
                  setEditingProduct(null);
                  setProductImagePreview('/assets/images/hero-smart-home.jpg');
                  setIsProductModalOpen(true);
                }}
              >
                <Plus size={16} />
                <span>Crear Nuevo Producto</span>
              </button>
            </div>

            <div className="inventory-table-card glass-card">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Precio Venta</th>
                      <th>Costo Base</th>
                      <th>Margen Bruto</th>
                      <th>Stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const marginPct = (((p.price - p.cost) / p.cost) * 100).toFixed(0);
                      return (
                        <tr key={p.id}>
                          <td>
                            <div className="table-prod-cell">
                              <img src={p.image} alt={p.name} className="table-thumb" />
                              <div>
                                <strong>{p.name}</strong>
                                <span className="brand-sub">{p.brand}</span>
                              </div>
                            </div>
                          </td>
                          <td><span className="category-pill">{p.category}</span></td>
                          <td><strong>{formatCOP(p.price)}</strong></td>
                          <td className="muted-text">{formatCOP(p.cost)}</td>
                          <td><span className="margin-badge">+{marginPct}%</span></td>
                          <td><span className="stock-badge">{p.stock} un.</span></td>
                          <td>
                            <div className="table-actions">
                              <button 
                                className="icon-action-btn edit"
                                onClick={() => {
                                  setEditingProduct(p);
                                  setProductImagePreview(p.image || '/assets/images/hero-smart-home.jpg');
                                  setIsProductModalOpen(true);
                                }}
                                title="Editar"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className="icon-action-btn delete"
                                onClick={() => {
                                  if (confirm(`¿Eliminar producto "${p.name}"?`)) removeProduct(p.id);
                                }}
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. PROJECTS & PORTFOLIO MANAGEMENT */}
        {activeAdminTab === 'projects' && (
          <div className="projects-management-container">
            <div className="inventory-actions-bar">
              <div>
                <h3>Portafolio de Obras Reales ({projects.length} proyectos en Antioquia)</h3>
                <p>Sube fotos de alta calidad, presupuestos y especificaciones de proyectos entregados.</p>
              </div>
              <button 
                className="btn btn-accent btn-sm"
                onClick={() => {
                  setEditingProject(null);
                  setProjectImagePreview('/assets/images/banners-domotica-cinema.jpg');
                  setIsProjectModalOpen(true);
                }}
              >
                <Plus size={16} />
                <span>Subir Nueva Obra Real</span>
              </button>
            </div>

            <div className="inventory-table-card glass-card">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Proyecto & Obra</th>
                      <th>Ubicación</th>
                      <th>Especialidad</th>
                      <th>Inversión Aprox</th>
                      <th>Equipos</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((proj) => (
                      <tr key={proj.id}>
                        <td>
                          <div className="table-prod-cell">
                            <img src={proj.image} alt={proj.title} className="table-thumb" />
                            <div>
                              <strong>{proj.title}</strong>
                              <span className="brand-sub">{proj.headline}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="location-pill-mini">📍 {proj.location}</span>
                        </td>
                        <td>
                          <span className="category-pill">{proj.categoryLabel || proj.category}</span>
                        </td>
                        <td>
                          <strong className="cyan-text">{formatCOP(proj.investmentCOP)}</strong>
                        </td>
                        <td>
                          <span className="stock-badge">{proj.equipmentList?.length || 0} equipos</span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button 
                              className="icon-action-btn edit"
                              onClick={() => {
                                setEditingProject(proj);
                                setProjectImagePreview(proj.image || '/assets/images/banners-domotica-cinema.jpg');
                                setIsProjectModalOpen(true);
                              }}
                              title="Editar Obra"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="icon-action-btn delete"
                              onClick={() => {
                                if (confirm(`¿Eliminar la obra "${proj.title}"?`)) removeProject(proj.id);
                              }}
                              title="Eliminar Obra"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. QUOTATIONS MANAGEMENT */}
        {activeAdminTab === 'quotes' && (
          <div className="quotes-management-container">
            <div className="tab-intro">
              <h3>Solicitudes de Cotización de Clientes</h3>
              <p>Al marcar una cotización como "Aprobada", se contabiliza automáticamente en el Moodboard Financiero.</p>
            </div>

            <div className="quotes-grid">
              {quotes.map((q) => (
                <div key={q.id} className="admin-quote-card glass-card">
                  <div className="quote-card-top">
                    <div>
                      <span className="quote-id">{q.id}</span>
                      <h4>{q.customerName}</h4>
                      <span className="quote-loc">📍 {q.locationCity}</span>
                    </div>
                    <span className={`status-pill ${q.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {q.status}
                    </span>
                  </div>

                  <div className="quote-financials-mini">
                    <div>
                      <span>Equipos & Mano Obra:</span>
                      <strong>{formatCOP(q.materialsTotal + q.laborTotal)}</strong>
                    </div>
                    <div>
                      <span>Margen 50%:</span>
                      <strong className="cyan-text">{formatCOP(q.marginAmount)}</strong>
                    </div>
                    <div>
                      <span>Viáticos Traslado:</span>
                      <strong>{formatCOP(q.travelCost)}</strong>
                    </div>
                    <div className="grand-total-row">
                      <span>Valor Total del Proyecto:</span>
                      <strong>{formatCOP(q.grandTotal)}</strong>
                    </div>
                  </div>

                  <div className="quote-status-actions">
                    <span className="label">Cambiar Estado:</span>
                    <button 
                      className={`status-btn approve ${q.status === 'Aprobada' ? 'active' : ''}`}
                      onClick={() => changeQuoteStatus(q.id, 'Aprobada')}
                    >
                      <Check size={14} /> Aprobar
                    </button>
                    <button 
                      className={`status-btn neg ${q.status === 'En Negociación' ? 'active' : ''}`}
                      onClick={() => changeQuoteStatus(q.id, 'En Negociación')}
                    >
                      En Negociación
                    </button>
                    <button 
                      className={`status-btn pend ${q.status === 'Pendiente Visita' ? 'active' : ''}`}
                      onClick={() => changeQuoteStatus(q.id, 'Pendiente Visita')}
                    >
                      Pendiente
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. BOOKINGS MANAGEMENT */}
        {activeAdminTab === 'bookings' && (
          <div className="bookings-management-container">
            <div className="tab-intro">
              <h3>Agendamientos de Mantenimiento y Visitas Técnicas</h3>
              <p>Seguimiento de visitas de diagnóstico y reparaciones programadas en Medellín y municipios.</p>
            </div>

            <div className="bookings-grid">
              {bookings.map((b) => (
                <div key={b.id} className="admin-booking-card glass-card">
                  <div className="booking-card-top">
                    <div>
                      <span className="booking-id">{b.id}</span>
                      <h4>{b.name}</h4>
                      <span className="phone-tag">📞 {b.phone}</span>
                    </div>
                    <span className={`booking-status-tag ${b.status?.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="booking-details-list">
                    <div className="b-line">
                      <span>Servicio:</span>
                      <strong>{b.serviceType}</strong>
                    </div>
                    <div className="b-line">
                      <span>Fecha & Hora:</span>
                      <strong>{b.preferredDate || b.date} ({b.preferredTime || b.time})</strong>
                    </div>
                    <div className="b-line">
                      <span>Dirección:</span>
                      <strong>{b.city} - {b.address}</strong>
                    </div>
                    {b.notes && (
                      <div className="b-line notes">
                        <span>Notas del cliente:</span>
                        <p>{b.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="booking-actions">
                    <button 
                      className="status-btn confirm"
                      onClick={() => changeBookingStatus(b.id, 'Confirmado')}
                    >
                      Confirmar
                    </button>
                    <button 
                      className="status-btn complete"
                      onClick={() => changeBookingStatus(b.id, 'Completado')}
                    >
                      Completar
                    </button>
                    <button 
                      className="status-btn cancel"
                      onClick={() => changeBookingStatus(b.id, 'Cancelado')}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Add / Edit Modal */}
        {isProductModalOpen && (
          <div className="modal-overlay" onClick={() => setIsProductModalOpen(false)}>
            <div className="modal-content product-edit-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}</h3>
                <button className="close-btn" onClick={() => setIsProductModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProductForm} className="product-form">
                <div className="form-group">
                  <label>Nombre del Producto *</label>
                  <input 
                    name="name" 
                    type="text" 
                    required 
                    defaultValue={editingProduct?.name || ''} 
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Categoría *</label>
                    <select name="category" defaultValue={editingProduct?.category || 'domotica'}>
                      {PRODUCT_CATEGORIES.filter(c => c.id !== 'all').map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Marca Fabricante *</label>
                    <input 
                      name="brand" 
                      type="text" 
                      required 
                      defaultValue={editingProduct?.brand || 'JJ Tech'} 
                    />
                  </div>
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label>Precio de Venta (COP) *</label>
                    <input 
                      name="price" 
                      type="number" 
                      required 
                      defaultValue={editingProduct?.price || ''} 
                    />
                  </div>

                  <div className="form-group">
                    <label>Costo Base Fábrica (COP) *</label>
                    <input 
                      name="cost" 
                      type="number" 
                      required 
                      defaultValue={editingProduct?.cost || ''} 
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock Disponible *</label>
                    <input 
                      name="stock" 
                      type="number" 
                      required 
                      defaultValue={editingProduct?.stock || 10} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Puntos de Instalación (Labor Points) *</label>
                  <input 
                    name="laborPoints" 
                    type="number" 
                    defaultValue={editingProduct?.installationLaborPoints || 1} 
                  />
                </div>

                <div className="form-group">
                  <label>Descripción Corta *</label>
                  <textarea 
                    name="shortDesc" 
                    rows="2" 
                    defaultValue={editingProduct?.shortDesc || ''} 
                  />
                </div>

                {/* Product Image Uploader */}
                <div className="form-group image-upload-group">
                  <label>Fotografía del Producto *</label>
                  <div className="image-uploader-wrapper">
                    <div className="image-preview-box">
                      <img src={productImagePreview || '/assets/images/hero-smart-home.jpg'} alt="Preview" />
                      {isUploadingProductImage && <span className="uploading-badge">Optimizando...</span>}
                    </div>

                    <div className="uploader-controls">
                      <div 
                        className="file-upload-dropzone"
                        onClick={() => productFileInputRef.current && productFileInputRef.current.click()}
                        role="button"
                        tabIndex={0}
                        style={{ cursor: 'pointer' }}
                      >
                        <input 
                          ref={productFileInputRef}
                          type="file" 
                          accept="image/*" 
                          onChange={handleProductFileChange} 
                          style={{ display: 'none' }}
                        />
                        <Upload size={22} className="upload-icon" />
                        <div className="dropzone-text">
                          <strong>Subir foto desde tu dispositivo</strong>
                          <span>JPG, PNG, WEBP (Haz clic para seleccionar)</span>
                        </div>
                      </div>

                      <div className="preset-images-picker">
                        <span>O seleccionar foto de muestra oficial JJ Tech:</span>
                        <div className="preset-thumbnails">
                          {PRESET_IMAGES.map((img, i) => (
                            <img 
                              key={i} 
                              src={img} 
                              alt={`Preset ${i}`} 
                              className={`preset-thumb ${productImagePreview === img ? 'selected' : ''}`}
                              onClick={() => setProductImagePreview(img)}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="url-fallback-input">
                        <input 
                          type="text" 
                          placeholder="O escribe o pega una URL externa..." 
                          value={productImagePreview}
                          onChange={(e) => setProductImagePreview(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setIsProductModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-accent" disabled={isUploadingProductImage}>
                    {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Real Project Add / Edit Modal */}
        {isProjectModalOpen && (
          <div className="modal-overlay" onClick={() => setIsProjectModalOpen(false)}>
            <div className="modal-content product-edit-modal project-edit-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingProject ? 'Editar Obra / Proyecto' : 'Subir Nueva Obra al Portafolio'}</h3>
                <button className="close-btn" onClick={() => setIsProjectModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProjectForm} className="product-form">
                <div className="form-group">
                  <label>Título del Proyecto / Obra *</label>
                  <input 
                    name="title" 
                    type="text" 
                    required 
                    placeholder="Ej: Penthouse Torre Cristal - Sala de Cine VIP"
                    defaultValue={editingProject?.title || ''} 
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Ubicación Geográfica *</label>
                    <input 
                      name="location" 
                      type="text" 
                      required 
                      placeholder="Ej: Medellín - El Poblado"
                      defaultValue={editingProject?.location || ''} 
                    />
                  </div>

                  <div className="form-group">
                    <label>Zona para Filtro *</label>
                    <select name="zone" defaultValue={editingProject?.zone || 'poblado'}>
                      <option value="poblado">El Poblado</option>
                      <option value="guatape">Guatapé</option>
                      <option value="rionegro">Llanogrande / Rionegro</option>
                      <option value="laureles">Laureles</option>
                      <option value="envigado">Envigado</option>
                      <option value="santafedeantioquia">Santa Fe de Antioquia</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Especialidad *</label>
                    <select name="category" defaultValue={editingProject?.category || 'cine'}>
                      <option value="cine">Cine & Audio (Taluha Home)</option>
                      <option value="seguridad">Seguridad 4K & CCTV</option>
                      <option value="domotica">Domótica & Cortinas Motorizadas</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Inversión Aprox (COP) *</label>
                    <input 
                      name="investmentCOP" 
                      type="number" 
                      required 
                      placeholder="35000000"
                      defaultValue={editingProject?.investmentCOP || ''} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Titular Destacado *</label>
                  <input 
                    name="headline" 
                    type="text" 
                    required 
                    placeholder="Ej: Sala de Cine Dolby Atmos 7.2 con Butacas Taluha en Cuero"
                    defaultValue={editingProject?.headline || ''} 
                  />
                </div>

                <div className="form-group">
                  <label>Descripción de la Obra *</label>
                  <textarea 
                    name="description" 
                    rows="2" 
                    required 
                    placeholder="Detalles de la integración y ejecución del proyecto..."
                    defaultValue={editingProject?.description || ''} 
                  />
                </div>

                <div className="form-group">
                  <label>Equipos Instalados (uno por renglón) *</label>
                  <textarea 
                    name="equipmentList" 
                    rows="3" 
                    placeholder="Proyector Láser Triple Samsung 4K&#10;Home Theater Klipsch 7.2&#10;2 Sillones Reclinables VIP Taluha"
                    defaultValue={editingProject?.equipmentList ? editingProject.equipmentList.join('\n') : ''} 
                  />
                </div>

                {/* Project Image Uploader */}
                <div className="form-group image-upload-group">
                  <label>Fotografía de la Obra *</label>
                  <div className="image-uploader-wrapper">
                    <div className="image-preview-box">
                      <img src={projectImagePreview || '/assets/images/banners-domotica-cinema.jpg'} alt="Preview" />
                      {isUploadingProjImage && <span className="uploading-badge">Optimizando...</span>}
                    </div>

                    <div className="uploader-controls">
                      <div 
                        className="file-upload-dropzone"
                        onClick={() => projectFileInputRef.current && projectFileInputRef.current.click()}
                        role="button"
                        tabIndex={0}
                        style={{ cursor: 'pointer' }}
                      >
                        <input 
                          ref={projectFileInputRef}
                          type="file" 
                          accept="image/*" 
                          onChange={handleProjectFileChange} 
                          style={{ display: 'none' }}
                        />
                        <Upload size={22} className="upload-icon" />
                        <div className="dropzone-text">
                          <strong>Subir foto de la obra desde tu equipo</strong>
                          <span>JPG, PNG, WEBP (Haz clic para seleccionar)</span>
                        </div>
                      </div>

                      <div className="preset-images-picker">
                        <span>O seleccionar foto de muestra oficial JJ Tech:</span>
                        <div className="preset-thumbnails">
                          {PRESET_IMAGES.map((img, i) => (
                            <img 
                              key={i} 
                              src={img} 
                              alt={`Preset ${i}`} 
                              className={`preset-thumb ${projectImagePreview === img ? 'selected' : ''}`}
                              onClick={() => setProjectImagePreview(img)}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="url-fallback-input">
                        <input 
                          type="text" 
                          placeholder="O escribe o pega una URL de imagen..." 
                          value={projectImagePreview}
                          onChange={(e) => setProjectImagePreview(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setIsProjectModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-accent" disabled={isUploadingProjImage}>
                    {editingProject ? 'Guardar Cambios' : 'Publicar Obra'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Firebase Cloud Connection Modal */}
        {isFirebaseModalOpen && (
          <div className="admin-modal-overlay" onClick={() => setIsFirebaseModalOpen(false)}>
            <div className="admin-modal-box glass-card firebase-setup-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title-with-icon">
                  <Database size={22} className="icon-cyan" />
                  <div>
                    <h3>Conexión Cloud: Google Firebase</h3>
                    <span className="subtitle">Sincronización en tiempo real de productos, obras y fotos</span>
                  </div>
                </div>
                <button className="close-btn" onClick={() => setIsFirebaseModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="firebase-status-banner">
                {isCloudActive ? (
                  <div className="status-pill connected">
                    <CheckCircle2 size={18} />
                    <div>
                      <strong>Google Firebase Conectado y Operativo</strong>
                      <p>Los productos, obras del portafolio y fotos se sincronizan automáticamente en la nube (Firestore y Storage).</p>
                    </div>
                  </div>
                ) : (
                  <div className="status-pill pending">
                    <AlertCircle size={18} />
                    <div>
                      <strong>Modo Local Activo (Almacenamiento en Navegador)</strong>
                      <p>La tienda y el cotizador funcionan al 100%, pero los productos y fotos nuevos solo se guardan en este dispositivo. Para sincronizarlos con todos tus clientes y celulares, conecta tus llaves de Firebase.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="setup-steps-guide">
                <h4>Pasos para conectar Google Firebase (100% Gratuito):</h4>
                <ol className="steps-list">
                  <li>
                    <span className="step-num">1</span>
                    <div>
                      <strong>Crear Proyecto en Google Firebase</strong>
                      <p>Ingresa a <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">console.firebase.google.com <ExternalLink size={12} /></a> y crea un proyecto nuevo (ej. <em>jjtech-medellin</em>).</p>
                    </div>
                  </li>
                  <li>
                    <span className="step-num">2</span>
                    <div>
                      <strong>Activar Firestore & Storage</strong>
                      <p>En el menú lateral activa <strong>Firestore Database</strong> (en modo de prueba o con reglas públicas) y <strong>Storage</strong> para las fotos.</p>
                    </div>
                  </li>
                  <li>
                    <span className="step-num">3</span>
                    <div>
                      <strong>Añadir App Web</strong>
                      <p>En la pantalla de bienvenida o en <em>Configuración del proyecto</em>, haz clic en el ícono Web <code>&lt;/&gt;</code> y copia las claves.</p>
                    </div>
                  </li>
                  <li>
                    <span className="step-num">4</span>
                    <div>
                      <strong>Crear o editar el archivo .env</strong>
                      <p>Copia el bloque de variables a continuación en un archivo llamado <code>.env</code> en la raíz del proyecto y reinicia Vite:</p>
                    </div>
                  </li>
                </ol>

                <div className="env-code-box">
                  <div className="env-code-header">
                    <span>Plantilla .env (Configuración de Firebase)</span>
                    <button 
                      type="button" 
                      className="btn-copy-env"
                      onClick={() => {
                        const envContent = `# ==========================================\nVITE_FIREBASE_API_KEY=tu_api_key_aqui\nVITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com\nVITE_FIREBASE_PROJECT_ID=tu-proyecto\nVITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com\nVITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id\nVITE_FIREBASE_APP_ID=tu_app_id`;
                        navigator.clipboard.writeText(envContent);
                        setCopiedEnv(true);
                        setTimeout(() => setCopiedEnv(false), 2500);
                      }}
                    >
                      {copiedEnv ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedEnv ? '¡Copiado!' : 'Copiar Plantilla'}</span>
                    </button>
                  </div>
                  <pre className="env-code-content">
{`VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=jjtech-medellin.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=jjtech-medellin
VITE_FIREBASE_STORAGE_BUCKET=jjtech-medellin.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456`}
                  </pre>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setIsFirebaseModalOpen(false)}>
                  Entendido / Cerrar
                </button>
                <a 
                  href="https://console.firebase.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-accent"
                >
                  <ExternalLink size={14} />
                  <span>Abrir Consola de Firebase</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
