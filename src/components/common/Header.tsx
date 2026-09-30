import React, { useState } from 'react';
import {
  Sprout,
  Globe,
  Bell,
  CloudLightning,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Info,
  Layers,
  Sparkles,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { LanguageCode } from '../../types/index.js';

interface HeaderProps {
  onOpenArchitecture: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenArchitecture }) => {
  const {
    user,
    language,
    setLanguage,
    t,
    notifications,
    unreadNotificationsCount,
    activeAlerts,
    isDemoMode,
    openAuthModal,
    logout,
    setActiveTab,
    triggerThunderstormDemo
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' }
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Active Thunderstorm Urgent Ticker if alerts exist */}
      {activeAlerts.length > 0 && (
        <div className="bg-amber-600 text-amber-50 px-4 py-1.5 text-xs font-medium flex items-center justify-between transition-all animate-pulse">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <CloudLightning className="w-4 h-4 shrink-0 text-amber-200 animate-bounce" />
            <span className="font-semibold uppercase tracking-wider bg-amber-700/60 px-1.5 py-0.5 rounded text-[10px]">
              Active Alert
            </span>
            <span className="truncate">{activeAlerts[0].title}</span>
          </div>
          <button
            onClick={() => setActiveTab('weather')}
            className="shrink-0 underline hover:text-white font-semibold ml-3 cursor-pointer"
          >
            View Advisory →
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-stone-900 group-hover:text-emerald-700 transition-colors">
                  AgriN
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  BRICS AgrIn
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block truncate max-w-[280px]">
                Regenerative Agricultural Intelligence Network
              </p>
            </div>
          </div>
        </div>

        {/* Middle / Differentiator Badges */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={onOpenArchitecture}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Digital Public Good Architecture</span>
          </button>

          {isDemoMode && (
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs"
              title="Demonstration Mode: Satellite, weather, and SMS data are realistic simulated telemetry."
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>DEMO MODE (Simulated Telemetry)</span>
            </div>
          )}
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Storm Sim button for testers/judges */}
          <button
            onClick={triggerThunderstormDemo}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-900 bg-amber-100/80 hover:bg-amber-200 border border-amber-300 transition-colors"
            title="Trigger real-time thunderstorm alert pipeline: Weather Engine → Alerts → In-app Notif → SMS Dispatch"
          >
            <CloudLightning className="w-3.5 h-3.5 text-amber-700" />
            <span>Simulate Storm</span>
          </button>

          {/* Multilingual Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-700 transition-colors"
              aria-label="Select language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold">{currentLang.native}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Select Language / భాష
                </div>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                      language === lang.code ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-stone-700'
                    }`}
                  >
                    <span>{lang.native}</span>
                    <span className="text-[10px] text-stone-400">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-stone-200 p-2 z-50 animate-in fade-in duration-150">
                <div className="flex items-center justify-between px-3 py-2 border-b border-stone-100">
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Notifications ({notifications.length})</span>
                  </span>
                  <button
                    onClick={() => {
                      setIsNotifOpen(false);
                      setActiveTab('notifications');
                    }}
                    className="text-[11px] font-semibold text-emerald-700 hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 mt-1">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-stone-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.slice(0, 4).map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          setIsNotifOpen(false);
                          setActiveTab('notifications');
                        }}
                        className={`p-3 text-xs cursor-pointer hover:bg-stone-50 rounded-lg transition-colors ${
                          !notif.read ? 'bg-emerald-50/40 font-medium' : 'text-stone-600'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            notif.severity === 'CRITICAL' || notif.severity === 'HIGH'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {notif.type}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="font-semibold text-stone-900 truncate">{notif.title}</p>
                        <p className="text-[11px] text-stone-500 line-clamp-1">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth Switcher */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-stone-900 leading-tight truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    {user.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-stone-200 p-2 z-50">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-900">{user.name}</p>
                    <p className="text-[11px] text-stone-500">{user.countryCode} {user.phone}</p>
                    <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Role: {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openAuthModal(user.role);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-lg flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-stone-500" />
                      <span>Switch Role / Account</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenArchitecture();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-lg flex items-center gap-2"
                    >
                      <Layers className="w-3.5 h-3.5 text-stone-500" />
                      <span>BRICS AgrIn Architecture</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
            >
              <span>Login with OTP</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
