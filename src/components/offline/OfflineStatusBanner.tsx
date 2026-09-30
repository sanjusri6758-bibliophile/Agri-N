import React from 'react';
import {
  WifiOff,
  Wifi,
  Database,
  CloudLightning,
  MapPin,
  RefreshCw,
  HardDriveDownload,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useOffline } from '../../context/OfflineContext.js';

export const OfflineStatusBanner: React.FC = () => {
  const {
    isOffline,
    isSimulatedOffline,
    toggleSimulatedOffline,
    cachedAdvisories,
    savedMaps,
    pendingActions,
    openVault,
    syncPendingActions
  } = useOffline();

  return (
    <>
      {/* Active Offline Notice Banner */}
      {isOffline ? (
        <div className="bg-amber-600 text-stone-950 px-4 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs animate-in slide-in-from-top">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded-lg bg-stone-950 text-amber-400">
              <WifiOff className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold uppercase tracking-wide">
                {isSimulatedOffline ? 'Simulated Field Low-Connectivity Mode' : 'Offline Mode Active (Low/No Connectivity)'}
              </span>
              <p className="text-[11px] text-stone-950/80 font-medium">
                Serving from <strong>IndexedDB State Sync & Service Worker Cache</strong>. {cachedAdvisories.length} critical advisories and {savedMaps.length} satellite maps accessible offline.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openVault}
              className="px-3 py-1 rounded-xl bg-stone-950 text-white font-bold text-xs hover:bg-stone-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <HardDriveDownload className="w-3.5 h-3.5 text-amber-400" />
              <span>Open Offline Agro-Vault</span>
            </button>

            {isSimulatedOffline && (
              <button
                onClick={toggleSimulatedOffline}
                className="px-2.5 py-1 rounded-xl bg-white/80 hover:bg-white text-stone-900 font-semibold text-[11px] transition-colors cursor-pointer"
              >
                Exit Offline Test
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Subtle Online Readiness Bar in Header / Top */
        <div className="bg-emerald-950/40 border-b border-emerald-900/30 px-4 py-1.5 text-[11px] text-emerald-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>IndexedDB & Service Worker Ready:</span>
            </span>
            <span className="text-emerald-100/80">
              {cachedAdvisories.length} Agro-Advisories & {savedMaps.length} Farm Maps Cached Offline
            </span>
            {pendingActions.length > 0 && (
              <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                {pendingActions.length} Pending Actions Queued
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openVault}
              className="text-emerald-300 hover:text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Database className="w-3 h-3" />
              <span>Offline Vault</span>
            </button>
            <span className="text-emerald-700">|</span>
            <button
              onClick={toggleSimulatedOffline}
              className="px-2 py-0.5 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 font-medium text-[10px] transition-colors cursor-pointer border border-emerald-700/50"
              title="Test low connectivity offline state behavior"
            >
              Simulate Field Offline
            </button>
          </div>
        </div>
      )}
    </>
  );
};
