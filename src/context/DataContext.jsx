// ==========================================
// JJ TECH - GLOBAL DATA CONTEXT (HYBRID CLOUD & LOCAL)
// ==========================================
import React, { createContext, useContext, useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [finances, setFinances] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCloudActive, setIsCloudActive] = useState(dataService.isCloudActive());

  const refreshData = () => {
    setProducts(dataService.getProducts());
    setFinances(dataService.getFinancialMetrics());
    setQuotes(dataService.getQuotes());
    setBookings(dataService.getBookings());
    setProjects(dataService.getProjects());
    setIsCloudActive(dataService.isCloudActive());
    setLoading(false);
  };

  useEffect(() => {
    refreshData();

    // Sincronización en tiempo real con Firestore
    const unsubscribe = dataService.subscribeToCloudSync((cloudData) => {
      if (cloudData.products) setProducts(cloudData.products);
      if (cloudData.projects) setProjects(cloudData.projects);
      if (cloudData.quotes) setQuotes(cloudData.quotes);
      if (cloudData.bookings) setBookings(cloudData.bookings);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const addOrUpdateProduct = async (product) => {
    const updated = await dataService.saveProduct(product);
    setProducts(updated);
  };

  const removeProduct = async (productId) => {
    const updated = await dataService.deleteProduct(productId);
    setProducts(updated);
  };

  const addOrUpdateProject = async (project) => {
    const updated = await dataService.saveProject(project);
    setProjects(updated);
  };

  const removeProject = async (projectId) => {
    const updated = await dataService.deleteProject(projectId);
    setProjects(updated);
  };

  const createQuote = async (quoteData) => {
    const newQuote = await dataService.saveQuote(quoteData);
    setQuotes(dataService.getQuotes());
    return newQuote;
  };

  const changeQuoteStatus = async (quoteId, status) => {
    const updated = await dataService.updateQuoteStatus(quoteId, status);
    setQuotes(updated);

    // Si la cotización es aprobada, registrar automáticamente en finanzas
    if (status === "Aprobada") {
      const quote = updated.find(q => q.id === quoteId);
      if (quote) {
        await dataService.recordTransaction(
          quote.grandTotal,
          quote.materialsTotal + quote.laborTotal + quote.travelCost,
          "Cotización Aprobada",
          "Domótica"
        );
        setFinances(dataService.getFinancialMetrics());
      }
    }
  };

  const createBooking = async (bookingData) => {
    const newBooking = await dataService.saveBooking(bookingData);
    setBookings(dataService.getBookings());
    return newBooking;
  };

  const changeBookingStatus = async (bookingId, status) => {
    const updated = await dataService.updateBookingStatus(bookingId, status);
    setBookings(updated);
  };

  const resetAllData = () => {
    const initial = dataService.resetToSeed();
    setProducts(initial.products);
    setFinances(initial.finances);
    setQuotes(initial.quotes);
    setBookings(initial.bookings);
    setProjects(initial.projects);
  };

  return (
    <DataContext.Provider
      value={{
        products,
        finances,
        quotes,
        bookings,
        projects,
        loading,
        isCloudActive,
        refreshData,
        addOrUpdateProduct,
        removeProduct,
        addOrUpdateProject,
        removeProject,
        createQuote,
        changeQuoteStatus,
        createBooking,
        changeBookingStatus,
        resetAllData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
