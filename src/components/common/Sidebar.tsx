import React from 'react';
import {
  LayoutDashboard,
  CloudSun,
  Satellite,
  Stethoscope,
  CalendarDays,
  BotMessageSquare,
  FlaskConical,
  Sprout,
  Network,
  TrendingUp,
  GraduationCap,
  Building2,
  Bell,
  Layers,
  Sparkles,
  BookOpen,
  HardDriveDownload,
  WifiOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { useOffline } from '../../context/OfflineContext.js';

interface SidebarProps {
  onOpenArchitecture: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenArchitecture }) => {
  const { activeTab, setActiveTab, t, user, unreadNotificationsCount } = useApp();
  const { isOffline, openVault, cachedAdvisories, savedMaps } = useOffline();

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'weather', label: t.nav.weather, icon: CloudSun, badge: 'Radar' },
    { id: 'satellite', label: t.nav.satellite, icon: Satellite },
    { id: 'cropDoctor', label: t.nav.cropDoctor, icon: Stethoscope, badge: 'AI' },
    { id: 'calendar', label: t.nav.calendar, icon: CalendarDays },
    { id: 'aiAssistant', label: t.nav.aiAssistant, icon: BotMessageSquare, highlight: true },
    { id: 'soilHealth', label: t.nav.soilHealth, icon: FlaskConical },
    { id: 'regenerativeScore', label: t.nav.regenerativeScore, icon: Sprout, badge: '78/100' },
    { id: 'federatedRegistry', label: t.nav.federatedRegistry, icon: Network, badge: 'BRICS' },
    { id: 'marketPrices', label: t.nav.marketPrices, icon: TrendingUp },
    { id: 'researchHub', label: t.nav.researchHub, icon: GraduationCap },
    { id: 'pmKisan', label: t.nav.pmKisan, icon: Building2 },
    {
      id: 'notifications',
      label: t.nav.notifications,
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? String(unreadNotificationsCount) : undefined
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-stone-900 text-stone-300 border-r border-stone-800 shrink-0 select-none">
      {/* Role Context Bar */}
      <div className="p-4 border-b border-stone-800 bg-stone-950/50">
        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
          <span>Active Interface</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80">
            {user?.role || 'Farmer'}
          </span>
        </div>
        <div className="mt-1 text-xs font-semibold text-white truncate">
          {user?.role === 'farmer' && 'Krishna Delta Eco-Farm'}
          {user?.role === 'researcher' && 'ICAR Research Portal'}
          {user?.role === 'student' && 'Field Agro-Diary & Learning'}
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 font-bold'
                  : item.highlight
                  ? 'text-emerald-300 hover:bg-stone-800/80 bg-emerald-950/20'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-emerald-400' : 'text-stone-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold tracking-wide ${
                    isActive
                      ? 'bg-emerald-700 text-white'
                      : item.badge === 'BRICS'
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                      : item.badge === 'AI'
                      ? 'bg-teal-950 text-teal-300 border border-teal-800'
                      : 'bg-stone-800 text-stone-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Offline Agro-Vault Card */}
      <div className="px-3 pt-2">
        <button
          onClick={openVault}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-950/30 border border-amber-600/30 text-left hover:border-amber-500 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <HardDriveDownload className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-200 group-hover:text-amber-100 transition-colors flex items-center gap-1.5">
                <span>Offline Vault</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[10px] text-stone-400">
                {cachedAdvisories.length} Advisories • {savedMaps.length} Maps
              </div>
            </div>
          </div>
          <span className="text-amber-400 text-xs font-bold">→</span>
        </button>
      </div>

      {/* Differentiator Architecture Card */}
      <div className="p-3 border-t border-stone-800 bg-stone-950/60 space-y-2">
        <button
          onClick={onOpenArchitecture}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-700/40 text-left hover:border-emerald-500/70 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                BRICS AgrIn Model
              </div>
              <div className="text-[10px] text-stone-400">
                Federated Public Good
              </div>
            </div>
          </div>
          <span className="text-emerald-400 text-xs font-bold">→</span>
        </button>
      </div>
    </aside>
  );
};
