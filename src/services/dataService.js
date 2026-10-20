// ==========================================
// JJ TECH - DATA SERVICE (HYBRID CLOUD & LOCAL PERSISTENCE ENGINE)
// ==========================================
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db, isFirebaseConnected, uploadMediaToStorage } from '../config/firebase';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_FINANCIAL_METRICS, 
  INITIAL_QUOTES, 
  INITIAL_BOOKINGS, 
  INITIAL_PROJECTS 
} from './seedData';

const STORAGE_KEYS = {
  PRODUCTS: 'jjtech_products_v1',
  FINANCES: 'jjtech_finances_v1',
  QUOTES: 'jjtech_quotes_v1',
  BOOKINGS: 'jjtech_bookings_v1',
  USER_QUOTES: 'jjtech_user_quotes_v1',
  PROJECTS: 'jjtech_projects_v1'
};

const COLLECTIONS = {
  PRODUCTS: 'jjtech_products',
  FINANCES: 'jjtech_settings',
  QUOTES: 'jjtech_quotes',
  BOOKINGS: 'jjtech_bookings',
  PROJECTS: 'jjtech_projects'
};

// Safe LocalStorage helpers
const getStoredData = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading localStorage key ${key}:`, e);
    return fallback;
  }
};

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error saving localStorage key ${key}:`, e);
  }
};

const sanitizeForFirestore = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForFirestore(item));
  }
  const clean = {};
  Object.keys(obj).forEach(key => {
    const val = obj[key];
    if (val !== undefined) {
      if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
        clean[key] = sanitizeForFirestore(val);
      } else {
        clean[key] = val;
      }
    }
  });
  return clean;
};

export const dataService = {
  isCloudActive: () => isFirebaseConnected,

  // ==========================================
  // CLOUD SYNC & REALTIME SUBSCRIPTION
  // ==========================================
  subscribeToCloudSync: (onUpdateCallback) => {
    if (!isFirebaseConnected || !db) {
      return () => {};
    }

    const unsubscribers = [];

    try {
      // 1. Productos en Tiempo Real
      const prodCol = collection(db, COLLECTIONS.PRODUCTS);
      const unsubProd = onSnapshot(prodCol, (snapshot) => {
        if (!snapshot.empty) {
          const cloudProducts = [];
          snapshot.forEach(docSnap => cloudProducts.push({ id: docSnap.id, ...docSnap.data() }));
          setStoredData(STORAGE_KEYS.PRODUCTS, cloudProducts);
          onUpdateCallback({ products: cloudProducts });
        } else {
          // Si la base en la nube está vacía, sembramos el catálogo inicial JJ Tech
          dataService.seedCloudIfEmpty();
        }
      }, (error) => {
        console.warn("Firestore snapshot products warning:", error.message);
      });
      unsubscribers.push(unProdSafe(unsubProd));

      // 2. Proyectos / Portafolio en Tiempo Real
      const projCol = collection(db, COLLECTIONS.PROJECTS);
      const unsubProj = onSnapshot(projCol, (snapshot) => {
        if (!snapshot.empty) {
          const cloudProjects = [];
          snapshot.forEach(docSnap => cloudProjects.push({ id: docSnap.id, ...docSnap.data() }));
          setStoredData(STORAGE_KEYS.PROJECTS, cloudProjects);
          onUpdateCallback({ projects: cloudProjects });
        }
      }, (error) => {
        console.warn("Firestore snapshot projects warning:", error.message);
      });
      unsubscribers.push(unProdSafe(unsubProj));

      // 3. Cotizaciones en Tiempo Real
      const quotesCol = collection(db, COLLECTIONS.QUOTES);
      const unsubQuotes = onSnapshot(quotesCol, (snapshot) => {
        if (!snapshot.empty) {
          const cloudQuotes = [];
          snapshot.forEach(docSnap => cloudQuotes.push({ id: docSnap.id, ...docSnap.data() }));
          setStoredData(STORAGE_KEYS.QUOTES, cloudQuotes);
          onUpdateCallback({ quotes: cloudQuotes });
        }
      }, (error) => {
        console.warn("Firestore snapshot quotes warning:", error.message);
      });
      unsubscribers.push(unProdSafe(unsubQuotes));

      // 4. Mantenimientos / Bookings en Tiempo Real
      const bookingsCol = collection(db, COLLECTIONS.BOOKINGS);
      const unsubBookings = onSnapshot(bookingsCol, (snapshot) => {
        if (!snapshot.empty) {
          const cloudBookings = [];
          snapshot.forEach(docSnap => cloudBookings.push({ id: docSnap.id, ...docSnap.data() }));
          setStoredData(STORAGE_KEYS.BOOKINGS, cloudBookings);
          onUpdateCallback({ bookings: cloudBookings });
        }
      }, (error) => {
        console.warn("Firestore snapshot bookings warning:", error.message);
      });
      unsubscribers.push(unProdSafe(unsubBookings));

    } catch (e) {
      console.warn("Error configurando observadores Firestore:", e.message);
    }

    return () => {
      unsubscribers.forEach(fn => {
        try { if (typeof fn === 'function') fn(); } catch (_) {}
      });
    };
  },

  // Si Firestore está recién creado y vacío, migra automáticamente el catálogo
  seedCloudIfEmpty: async () => {
    if (!isFirebaseConnected || !db) return;
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
      if (snap.empty) {
        console.log("🚀 Sincronizando catálogo inicial JJ Tech a Google Firestore...");
        const batch = writeBatch(db);
        for (const prod of INITIAL_PRODUCTS) {
          batch.set(doc(db, COLLECTIONS.PRODUCTS, prod.id), sanitizeForFirestore(prod));
        }
        for (const proj of INITIAL_PROJECTS) {
          batch.set(doc(db, COLLECTIONS.PROJECTS, proj.id), sanitizeForFirestore(proj));
        }
        batch.set(doc(db, COLLECTIONS.FINANCES, 'financial_metrics'), sanitizeForFirestore(INITIAL_FINANCIAL_METRICS));
        
        await Promise.race([
          batch.commit(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout al escribir en Firestore")), 4500))
        ]);
        console.log("✅ Catálogo inicial sincronizado en Firestore exitosamente.");
      }
    } catch (err) {
      console.warn("Nota Firestore: Si ves error de permisos, asegúrate de activar las reglas en Firebase Console:", err.message);
    }
  },

  // Subida de archivos / fotos a Firebase Storage con fallback a Base64
  uploadMedia: async (fileOrDataUrl, path) => {
    return await uploadMediaToStorage(fileOrDataUrl, path);
  },

  // ==========================================
  // PRODUCTS CRUD (HYBRID)
  // ==========================================
  getProducts: () => {
    return getStoredData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  saveProduct: async (product) => {
    const products = dataService.getProducts();
    let updated;
    let finalProduct = { ...product };

    if (finalProduct.id) {
      updated = products.map(p => p.id === finalProduct.id ? { ...p, ...finalProduct } : p);
    } else {
      finalProduct.id = `prod-${Date.now()}`;
      finalProduct.rating = finalProduct.rating || 5.0;
      updated = [finalProduct, ...products];
    }
    setStoredData(STORAGE_KEYS.PRODUCTS, updated);

    // Sync to Firestore en background sin bloquear la interfaz
    if (isFirebaseConnected && db) {
      try {
        const cleanProduct = sanitizeForFirestore(finalProduct);
        Promise.race([
          setDoc(doc(db, COLLECTIONS.PRODUCTS, finalProduct.id), cleanProduct, { merge: true }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout Firestore")), 3500))
        ]).catch(err => {
          console.warn("Aviso Firestore productos (guardado localmente):", err.message);
        });
      } catch (err) {
        console.warn("Error guardando producto en Firestore:", err);
      }
    }

    return updated;
  },

  deleteProduct: async (productId) => {
    const products = dataService.getProducts();
    const updated = products.filter(p => p.id !== productId);
    setStoredData(STORAGE_KEYS.PRODUCTS, updated);

    if (isFirebaseConnected && db) {
      try {
        Promise.race([
          deleteDoc(doc(db, COLLECTIONS.PRODUCTS, productId)),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout Firestore")), 3500))
        ]).catch(err => {
          console.warn("Aviso eliminando en Firestore:", err.message);
        });
      } catch (err) {
        console.warn("Error eliminando producto en Firestore:", err);
      }
    }

    return updated;
  },

  // ==========================================
  // FINANCIAL ANALYTICS & MOODBOARD
  // ==========================================
  getFinancialMetrics: () => {
    return getStoredData(STORAGE_KEYS.FINANCES, INITIAL_FINANCIAL_METRICS);
  },

  recordTransaction: async (amount, cost, category, line) => {
    const metrics = dataService.getFinancialMetrics();
    const net = amount - cost;

    metrics.totalRevenue += amount;
    metrics.operatingExpenses += cost;
    metrics.netProfit += net;
    metrics.profitMarginPercentage = Number(((metrics.netProfit / metrics.totalRevenue) * 100).toFixed(1));

    const lineItem = metrics.revenueByLine.find(l => l.line.toLowerCase().includes(line.toLowerCase()));
    if (lineItem) {
      lineItem.revenue += amount;
      lineItem.count += 1;
    }

    setStoredData(STORAGE_KEYS.FINANCES, metrics);

    if (isFirebaseConnected && db) {
      try {
        await setDoc(doc(db, COLLECTIONS.FINANCES, 'financial_metrics'), metrics, { merge: true });
      } catch (err) {
        console.error("Error guardando finanzas en Firestore:", err);
      }
    }

    return metrics;
  },

  // ==========================================
  // QUOTES (COTIZACIONES)
  // ==========================================
  getQuotes: () => {
    return getStoredData(STORAGE_KEYS.QUOTES, INITIAL_QUOTES);
  },

  saveQuote: async (quote) => {
    const quotes = dataService.getQuotes();
    const newQuote = {
      ...quote,
      id: quote.id || `COT-${new Date().getFullYear()}-${String(quotes.length + 1).padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: quote.status || "Guardada"
    };
    const updated = [newQuote, ...quotes];
    setStoredData(STORAGE_KEYS.QUOTES, updated);

    if (isFirebaseConnected && db) {
      try {
        await setDoc(doc(db, COLLECTIONS.QUOTES, newQuote.id), newQuote, { merge: true });
      } catch (err) {
        console.error("Error guardando cotización en Firestore:", err);
      }
    }

    return newQuote;
  },

  updateQuoteStatus: async (quoteId, status) => {
    const quotes = dataService.getQuotes();
    let targetQuote = null;
    const updated = quotes.map(q => {
      if (q.id === quoteId) {
        targetQuote = { ...q, status };
        return targetQuote;
      }
      return q;
    });
    setStoredData(STORAGE_KEYS.QUOTES, updated);

    if (isFirebaseConnected && db && targetQuote) {
      try {
        await setDoc(doc(db, COLLECTIONS.QUOTES, quoteId), { status }, { merge: true });
      } catch (err) {
        console.error("Error actualizando cotización en Firestore:", err);
      }
    }

    return updated;
  },

  // ==========================================
  // BOOKINGS (MANTENIMIENTOS)
  // ==========================================
  getBookings: () => {
    return getStoredData(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },

  saveBooking: async (booking) => {
    const bookings = dataService.getBookings();
    const newBooking = {
      ...booking,
      id: booking.id || `CIT-${String(bookings.length + 1).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      status: "Confirmado"
    };
    const updated = [newBooking, ...bookings];
    setStoredData(STORAGE_KEYS.BOOKINGS, updated);

    if (isFirebaseConnected && db) {
      try {
        await setDoc(doc(db, COLLECTIONS.BOOKINGS, newBooking.id), newBooking, { merge: true });
      } catch (err) {
        console.error("Error guardando cita en Firestore:", err);
      }
    }

    return newBooking;
  },

  updateBookingStatus: async (bookingId, status) => {
    const bookings = dataService.getBookings();
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status } : b);
    setStoredData(STORAGE_KEYS.BOOKINGS, updated);

    if (isFirebaseConnected && db) {
      try {
        await setDoc(doc(db, COLLECTIONS.BOOKINGS, bookingId), { status }, { merge: true });
      } catch (err) {
        console.error("Error actualizando cita en Firestore:", err);
      }
    }

    return updated;
  },

  // ==========================================
  // REAL PROJECTS / OBRAS
  // ==========================================
  getProjects: () => {
    return getStoredData(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  },

  saveProject: async (project) => {
    const projects = dataService.getProjects();
    let updated;
    let finalProject = { ...project };

    if (finalProject.id) {
      updated = projects.map(p => p.id === finalProject.id ? { ...p, ...finalProject } : p);
    } else {
      finalProject.id = `proj-${Date.now()}`;
      updated = [finalProject, ...projects];
    }
    setStoredData(STORAGE_KEYS.PROJECTS, updated);

    if (isFirebaseConnected && db) {
      try {
        const cleanProject = sanitizeForFirestore(finalProject);
        Promise.race([
          setDoc(doc(db, COLLECTIONS.PROJECTS, finalProject.id), cleanProject, { merge: true }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout Firestore")), 3500))
        ]).catch(err => {
          console.warn("Aviso Firestore proyectos (guardado localmente):", err.message);
        });
      } catch (err) {
        console.warn("Error guardando proyecto en Firestore:", err);
      }
    }

    return updated;
  },

  deleteProject: async (projectId) => {
    const projects = dataService.getProjects();
    const updated = projects.filter(p => p.id !== projectId);
    setStoredData(STORAGE_KEYS.PROJECTS, updated);

    if (isFirebaseConnected && db) {
      try {
        Promise.race([
          deleteDoc(doc(db, COLLECTIONS.PROJECTS, projectId)),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout Firestore")), 3500))
        ]).catch(err => {
          console.warn("Aviso eliminando obra en Firestore:", err.message);
        });
      } catch (err) {
        console.warn("Error eliminando proyecto en Firestore:", err);
      }
    }

    return updated;
  },

  // Reset to initial demo data
  resetToSeed: () => {
    setStoredData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setStoredData(STORAGE_KEYS.FINANCES, INITIAL_FINANCIAL_METRICS);
    setStoredData(STORAGE_KEYS.QUOTES, INITIAL_QUOTES);
    setStoredData(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    setStoredData(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    return {
      products: INITIAL_PRODUCTS,
      finances: INITIAL_FINANCIAL_METRICS,
      quotes: INITIAL_QUOTES,
      bookings: INITIAL_BOOKINGS,
      projects: INITIAL_PROJECTS
    };
  }
};

function unProdSafe(fn) {
  return typeof fn === 'function' ? fn : () => {};
}
