// ==========================================
// JJ TECH - MAIN PLATFORM APPLICATION
// ==========================================
import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { DataProvider } from './context/DataContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { CartDrawer } from './components/cart/CartDrawer';

import { Hero } from './components/home/Hero';
import { ServicesGrid } from './components/home/ServicesGrid';
import { TaluhaAlliance } from './components/home/TaluhaAlliance';

import { ProductGrid } from './components/catalog/ProductGrid';
import { SmartHomeSimulator } from './components/automation/SmartHomeSimulator';
import { QuoteCalculator } from './components/calculator/QuoteCalculator';
import { ThreeDVsRealSlider } from './components/visualizer/ThreeDVsRealSlider';
import { MaintenanceBooking } from './components/maintenance/MaintenanceBooking';
import { ProjectGallery } from './components/gallery/ProjectGallery';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserProfile } from './components/profile/UserProfile';
import { ClientAuthModal, AdminLoginModal } from './components/auth/AuthModals';

import './App.scss';

function MainContent() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const handleOpenAuthModal = () => setIsAuthModalOpen(true);
  const handleOpenAdminModal = () => setIsAdminModalOpen(true);

  return (
    <div className="jj-tech-app">
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenAdminModal={handleOpenAdminModal}
      />

      {/* Main View Switcher */}
      <main className="main-content-flow">
        {activeTab === 'inicio' && (
          <>
            <Hero setActiveTab={setActiveTab} />
            <ServicesGrid setActiveTab={setActiveTab} />
            <SmartHomeSimulator />
            <ThreeDVsRealSlider setActiveTab={setActiveTab} />
            <ProjectGallery setActiveTab={setActiveTab} />
            <TaluhaAlliance setActiveTab={setActiveTab} />
          </>
        )}

        {activeTab === 'catalogo' && (
          <ProductGrid setActiveTab={setActiveTab} />
        )}

        {activeTab === 'simulador' && (
          <SmartHomeSimulator />
        )}

        {activeTab === 'cotizador' && (
          <QuoteCalculator onOpenAuthModal={handleOpenAuthModal} />
        )}

        {activeTab === 'visualizador' && (
          <ThreeDVsRealSlider setActiveTab={setActiveTab} />
        )}

        {activeTab === 'galeria' && (
          <ProjectGallery setActiveTab={setActiveTab} />
        )}

        {activeTab === 'servicios' && (
          <MaintenanceBooking />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard onOpenAdminLogin={handleOpenAdminModal} />
        )}

        {activeTab === 'perfil' && (
          <UserProfile setActiveTab={setActiveTab} onOpenAuthModal={handleOpenAuthModal} />
        )}
      </main>

      {/* Shopping Cart Drawer */}
      <CartDrawer />

      {/* Persistent Floating WhatsApp Channel */}
      <WhatsAppButton />

      {/* Corporate Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Authentication Modals */}
      <ClientAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSwitchToAdmin={handleOpenAdminModal}
      />

      <AdminLoginModal 
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLoginSuccess={() => setActiveTab('admin')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <CartProvider>
          <MainContent />
        </CartProvider>
      </DataProvider>
    </AuthProvider>
  );
}
