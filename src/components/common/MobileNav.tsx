import React, { useState } from 'react';
import {
  LayoutDashboard,
  CloudSun,
  Stethoscope,
  BotMessageSquare,
  Menu,
  X,
  Satellite,
  FlaskConical,
  Sprout,
  Network,
  TrendingUp,
  GraduationCap,
  Building2,
  Bell,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';

interface MobileNavProps {
  onOpenArchitecture: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenArchitecture }) => {
  const { activeTab, setActiveTab, t, unreadNotificationsCount } = useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'cropDoctor', label: 'Doctor', icon: Stethoscope },
    { id: 'aiAssistant', label: 'AI', icon: BotMessageSquare },
  ];

  const secondaryTabs = [
    { id: 'satellite', label: t.nav.satellite, icon: Satellite },
    { id: 'calendar', label: t.nav.calendar, icon: LayoutDashboard },
    { id: 'soilHealth', label: t.nav.soilHealth, icon: FlaskConical },
    { id: 'regenerativeScore', label: t.nav.regenerativeScore, icon: Sprout },
    { id: 'federatedRegistry', label: t.nav.federatedRegistry, icon: Network },
    { id: 'marketPrices', label: t.nav.marketPrices, icon: TrendingUp },
    { id: 'researchHub', label: t.nav.researchHub, icon: GraduationCap },
    { id: 'pmKisan', label: t.nav.pmKisan, icon: Building2 },
    { id: 'notifications', label: t.nav.notifications, icon: Bell, badge: unreadNotificationsCount }
  ];

  return (
    <>
      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-stone-900/80 backdrop-blur-xs md:hidden animate-in fade-in">
          <div className="mt-auto bg-stone-900 text-white rounded-t-3xl p-5 border-t border-stone-800 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <span className="font-bold text-sm text-stone-200">All Modules & Networks</span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-full bg-stone-800 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 py-4">
              {secondaryTabs.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsDrawerOpen(false);
                    }}
                    className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                      isActive
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setIsDrawerOpen(false);
                onOpenArchitecture();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 text-xs font-bold text-white border border-emerald-600 mt-2"
            >
              <Layers className="w-4 h-4" />
              <span>View BRICS Architecture</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Floating Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 py-2 flex items-center justify-around shadow-lg">
        {mainTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
                isActive ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] scale-110' : ''} transition-transform`} />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setIsDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-stone-500 hover:text-stone-800`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </nav>
    </>
  );
};
