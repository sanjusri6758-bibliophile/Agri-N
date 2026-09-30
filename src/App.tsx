/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.js';
import { Header } from './components/common/Header.js';
import { Sidebar } from './components/common/Sidebar.js';
import { MobileNav } from './components/common/MobileNav.js';
import { AuthModal } from './components/auth/AuthModal.js';
import { ArchitectureModal } from './components/architecture/ArchitectureModal.js';
import { LandingPage } from './components/landing/LandingPage.js';

// Dashboards
import { FarmerDashboard } from './components/farmer/FarmerDashboard.js';
import { ResearcherDashboard } from './components/researcher/ResearcherDashboard.js';
import { StudentDashboard } from './components/student/StudentDashboard.js';

// Feature Modules
import { WeatherModule } from './components/weather/WeatherModule.js';
import { SatelliteModule } from './components/satellite/SatelliteModule.js';
import { CropDoctorModule } from './components/cropdoctor/CropDoctorModule.js';
import { AIAssistantModule } from './components/assistant/AIAssistantModule.js';
import { CalendarModule } from './components/calendar/CalendarModule.js';
import { SoilHealthModule } from './components/soil/SoilHealthModule.js';
import { RegenerativeScoreModule } from './components/regenerative/RegenerativeScoreModule.js';
import { FederatedRegistryModule } from './components/registry/FederatedRegistryModule.js';
import { MarketPricesModule } from './components/market/MarketPricesModule.js';
import { GovernmentSchemesModule } from './components/government/GovernmentSchemesModule.js';
import { NotificationCenter } from './components/notifications/NotificationCenter.js';
import { OfflineProvider } from './context/OfflineContext.js';
import { OfflineStatusBanner } from './components/offline/OfflineStatusBanner.js';
import { OfflineVaultModal } from './components/offline/OfflineVaultModal.js';

function MainApp() {
  const {
    user,
    isAuthenticated,
    activeTab,
    isAuthModalOpen,
    closeAuthModal,
    toastMessage
  } = useApp();

  const [isArchOpen, setIsArchOpen] = useState(false);

  // Render role-specific dashboard or default landing
  const renderDashboard = () => {
    if (!user) {
      return <LandingPage onOpenArchitecture={() => setIsArchOpen(true)} />;
    }
    if (user.role === 'researcher') {
      return <ResearcherDashboard />;
    }
    if (user.role === 'student') {
      return <StudentDashboard />;
    }
    return <FarmerDashboard />;
  };

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'weather':
        return <WeatherModule />;
      case 'satellite':
        return <SatelliteModule />;
      case 'cropDoctor':
        return <CropDoctorModule />;
      case 'calendar':
        return <CalendarModule />;
      case 'aiAssistant':
        return <AIAssistantModule />;
      case 'soilHealth':
        return <SoilHealthModule />;
      case 'regenerativeScore':
        return <RegenerativeScoreModule />;
      case 'federatedRegistry':
        return <FederatedRegistryModule />;
      case 'marketPrices':
        return <MarketPricesModule />;
      case 'researchHub':
        return <ResearcherDashboard />;
      case 'pmKisan':
        return <GovernmentSchemesModule />;
      case 'notifications':
        return <NotificationCenter />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md animate-in slide-in-from-top-4 fade-in duration-200">
          <div className={`p-4 rounded-2xl shadow-xl border text-xs font-semibold flex items-center gap-2.5 ${
            toastMessage.type === 'alert'
              ? 'bg-amber-600 text-white border-amber-500'
              : toastMessage.type === 'success'
              ? 'bg-emerald-700 text-white border-emerald-600'
              : 'bg-stone-900 text-white border-stone-800'
          }`}>
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Top Header */}
      <Header onOpenArchitecture={() => setIsArchOpen(true)} />

      {/* Offline Status & Low Connectivity Resilience Banner */}
      <OfflineStatusBanner />

      {/* Main Body with Sidebar + Workspace Content */}
      <div className="flex-1 flex overflow-hidden">
        {user && <Sidebar onOpenArchitecture={() => setIsArchOpen(true)} />}

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 max-w-7xl mx-auto w-full">
          {renderActiveModule()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {user && <MobileNav onOpenArchitecture={() => setIsArchOpen(true)} />}

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />

      {/* BRICS Architecture Modal */}
      <ArchitectureModal isOpen={isArchOpen} onClose={() => setIsArchOpen(false)} />

      {/* Offline Agro-Vault Modal */}
      <OfflineVaultModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <OfflineProvider>
        <MainApp />
      </OfflineProvider>
    </AppProvider>
  );
}
