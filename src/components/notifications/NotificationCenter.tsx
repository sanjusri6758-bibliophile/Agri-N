import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  CloudLightning,
  Droplets,
  CalendarDays,
  GraduationCap,
  Building2,
  TrendingUp,
  Check,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { api } from '../../services/api.js';
import { AppNotification, NotificationType } from '../../types/index.js';

export const NotificationCenter: React.FC = () => {
  const { user, notifications, markNotificationAsRead, setActiveTab } = useApp();
  const [filterType, setFilterType] = useState<string>('All');

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'thunderstorm':
        return <CloudLightning className="w-5 h-5 text-amber-600" />;
      case 'weather':
        return <AlertTriangle className="w-5 h-5 text-sky-600" />;
      case 'irrigation':
        return <Droplets className="w-5 h-5 text-teal-600" />;
      case 'calendar':
        return <CalendarDays className="w-5 h-5 text-indigo-600" />;
      case 'research':
        return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      case 'government_scheme':
        return <Building2 className="w-5 h-5 text-emerald-600" />;
      case 'market':
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      default:
        return <Bell className="w-5 h-5 text-stone-600" />;
    }
  };

  const filtered = notifications.filter(n => {
    if (filterType === 'All') return true;
    if (filterType === 'Unread') return !n.read;
    return n.type === filterType;
  });

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-200 border border-white/20 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              <span>Multi-Channel Agro-Alerts</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            Weather alerts, smart irrigation schedules, and government scheme updates.
          </p>
        </div>

        <div className="text-center p-3 rounded-2xl bg-white/10 backdrop-blur-md">
          <span className="text-2xl font-black text-amber-400">
            {notifications.filter(n => !n.read).length}
          </span>
          <span className="text-[10px] text-stone-300 block font-semibold uppercase">Unread</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        {['All', 'Unread', 'thunderstorm', 'weather', 'irrigation', 'calendar', 'government_scheme'].map(f => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
              filterType === f
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400 bg-white rounded-3xl border">
            No notifications matching current filter
          </div>
        ) : (
          filtered.map(notif => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                !notif.read
                  ? 'bg-white border-amber-300/80 shadow-md ring-1 ring-amber-400/40'
                  : 'bg-stone-50/70 border-stone-200 text-stone-600'
              }`}
            >
              <div className="p-3 rounded-2xl bg-stone-100 shrink-0">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      notif.severity === 'CRITICAL' || notif.severity === 'HIGH'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {notif.severity}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {new Date(notif.timestamp).toLocaleString()}
                    </span>
                  </div>

                  {!notif.read && (
                    <button
                      onClick={() => markNotificationAsRead(notif.id)}
                      className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Read</span>
                    </button>
                  )}
                </div>

                <h4 className="font-bold text-sm text-stone-900">{notif.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
