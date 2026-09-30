import React, { useState } from 'react';
import {
  X,
  Database,
  HardDriveDownload,
  Satellite,
  AlertTriangle,
  CloudLightning,
  Droplets,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Trash2,
  RefreshCw,
  MapPin,
  Layers,
  Sprout,
  Send,
  HelpCircle,
  WifiOff,
  Wifi
} from 'lucide-react';
import { useOffline } from '../../context/OfflineContext.js';
import { useApp } from '../../context/AppContext.js';
import { OfflineAdvisory, OfflineSavedMap } from '../../services/offlineStorage.js';

export const OfflineVaultModal: React.FC = () => {
  const {
    isVaultOpen,
    closeVault,
    isOffline,
    isSimulatedOffline,
    toggleSimulatedOffline,
    cachedAdvisories,
    savedMaps,
    pendingActions,
    syncPendingActions,
    removeSavedMap,
    lastSyncTime
  } = useOffline();

  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'advisories' | 'maps' | 'queue' | 'guides'>('advisories');
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedMap, setSelectedMap] = useState<OfflineSavedMap | null>(savedMaps[0] || null);

  if (!isVaultOpen) return null;

  const handleSyncNow = async () => {
    if (isOffline) {
      showToast('Cannot sync while in offline mode. Please exit offline mode first.', 'alert');
      return;
    }
    setIsSyncing(true);
    try {
      const res = await syncPendingActions();
      if (res.success) {
        showToast(`Synced ${res.syncedCount} queued actions successfully!`, 'success');
      } else {
        showToast('Sync completed with no pending actions', 'info');
      }
    } catch (e: any) {
      showToast('Sync error: ' + e.message, 'alert');
    } finally {
      setIsSyncing(false);
    }
  };

  const getSeverityBadge = (sev: OfflineAdvisory['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'WARNING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'ADVISORY':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-teal-950 p-6 text-white relative">
          <button
            onClick={closeVault}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
              <Database className="w-3.5 h-3.5" />
              <span>AgriN Offline Agro-Vault (IndexedDB)</span>
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              isOffline ? 'bg-amber-400 text-stone-950' : 'bg-emerald-400 text-stone-950'
            }`}>
              {isOffline ? 'OFFLINE ACTIVE' : 'LOCAL CACHE SYNCED'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Low-Connectivity Field Resilience Center
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
            All data below is persisted directly in your browser's <strong>IndexedDB storage</strong> and cached by the <strong>AgriN Service Worker</strong>. Accessible in deep rural fields with zero cellular connectivity.
          </p>

          {/* Quick connectivity switcher inside modal */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-300">
              <span>Status:</span>
              <span className="font-bold text-white flex items-center gap-1">
                {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
                {isOffline ? 'Offline Mode' : 'Online / Connected'}
              </span>
              <span className="text-stone-500">•</span>
              <span className="text-[11px] text-stone-400">
                Last Sync: {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString() : 'Recent'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleSimulatedOffline}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer border border-white/20"
              >
                {isSimulatedOffline ? 'Restore Online Status' : 'Simulate Zero-Connectivity Field'}
              </button>
              <button
                onClick={handleSyncNow}
                disabled={isSyncing || isOffline}
                className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Pending'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-2.5 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveTab('advisories')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'advisories'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Critical Advisories ({cachedAdvisories.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('maps')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'maps'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Saved Farm Maps ({savedMaps.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'queue'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Sync Queue ({pendingActions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('guides')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guides'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Offline Field Guides</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
          
          {/* TAB 1: ADVISORIES */}
          {activeTab === 'advisories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
                <span>Cached in IndexedDB for offline emergency lookup:</span>
                <span className="font-semibold text-emerald-800">
                  {cachedAdvisories.length} Ready Without Internet
                </span>
              </div>

              {cachedAdvisories.map(adv => (
                <div
                  key={adv.id}
                  className="p-5 rounded-2xl border border-stone-200 bg-white hover:border-emerald-300 transition-colors shadow-2xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getSeverityBadge(adv.severity)}`}>
                        {adv.severity} • {adv.category}
                      </span>
                      <span className="text-xs font-bold text-stone-600">
                        Crop: {adv.crop}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400">
                      Valid until: {new Date(adv.validUntil).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base text-stone-900">{adv.title}</h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{adv.content}</p>
                  </div>

                  {/* Actions Checklist */}
                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block">
                      Offline Action Protocol:
                    </span>
                    <ul className="space-y-1.5">
                      {adv.actions.map((act, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-stone-800 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                    <span>Source: {adv.source}</span>
                    <span className="text-emerald-700 font-semibold">IndexedDB Offline Ready</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: SAVED SATELLITE MAPS */}
          {activeTab === 'maps' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
                <span>Cached high-resolution parcel boundaries & spectral health indexes:</span>
                <span className="font-semibold text-emerald-800">{savedMaps.length} Maps Stored</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Maps List */}
                <div className="space-y-2.5 md:col-span-1">
                  {savedMaps.map(m => {
                    const isSelected = selectedMap?.id === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMap(m)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                            : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1">
                          <span className="font-bold text-emerald-800 uppercase">NDVI {m.ndviScore}</span>
                          <span>{new Date(m.savedAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-bold text-xs text-stone-900 leading-snug">{m.parcelName}</h4>
                        <p className="text-[11px] text-stone-500 mt-0.5 truncate">{m.farmName}</p>
                        <div className="mt-2 text-[10px] text-stone-400 flex items-center justify-between">
                          <span>{m.areaHectares} Ha • {m.crop}</span>
                          <span className="text-emerald-700 font-semibold">Offline</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Map Detailed Canvas View */}
                <div className="md:col-span-2 bg-stone-900 rounded-2xl p-4 text-white space-y-3 relative overflow-hidden flex flex-col justify-between">
                  {selectedMap ? (
                    <>
                      <div>
                        <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-2">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                              Cached Spectral Field Map
                            </span>
                            <h3 className="font-bold text-sm text-white">{selectedMap.parcelName}</h3>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                            NDVI {selectedMap.ndviScore}
                          </span>
                        </div>

                        {/* Simulated Vector Boundary Map (Renderable Offline with SVG) */}
                        <div className="relative w-full h-48 rounded-xl bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 border border-stone-700 overflow-hidden flex items-center justify-center p-2">
                          <svg className="w-full h-full" viewBox="0 0 400 200">
                            {/* Farm Boundary Polygon */}
                            <polygon
                              points="60,30 340,20 370,170 40,160"
                              fill="rgba(16, 185, 129, 0.2)"
                              stroke="#34d399"
                              strokeWidth="2.5"
                              strokeDasharray="4 2"
                            />
                            {/* Sub-plots */}
                            <line x1="200" y1="25" x2="205" y2="165" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                            <line x1="50" y1="95" x2="355" y2="90" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                            {/* Labels */}
                            <text x="80" y="65" fill="#a7f3d0" fontSize="10" fontWeight="bold">Plot A: Basmati Paddy (0.76)</text>
                            <text x="220" y="65" fill="#a7f3d0" fontSize="10" fontWeight="bold">Plot B: Green Gram (0.72)</text>
                            <text x="80" y="135" fill="#6ee7b7" fontSize="10">Sub-surface Drip Line</text>
                            <text x="220" y="135" fill="#6ee7b7" fontSize="10">Residue Mulch Bed</text>
                          </svg>

                          <div className="absolute bottom-2 left-2 bg-stone-950/80 px-2 py-1 rounded text-[9px] font-mono text-stone-300">
                            GPS: {selectedMap.coordinates.lat}° N, {selectedMap.coordinates.lng}° E
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3">
                          <div className="p-2 rounded-xl bg-stone-800/60 border border-stone-700">
                            <span className="text-[10px] text-stone-400 block">NDVI Canopy</span>
                            <span className="font-bold text-emerald-400 text-sm">{selectedMap.ndviScore}</span>
                          </div>
                          <div className="p-2 rounded-xl bg-stone-800/60 border border-stone-700">
                            <span className="text-[10px] text-stone-400 block">NDWI Hydration</span>
                            <span className="font-bold text-sky-400 text-sm">{selectedMap.ndwiScore}</span>
                          </div>
                          <div className="p-2 rounded-xl bg-stone-800/60 border border-stone-700">
                            <span className="text-[10px] text-stone-400 block">Constellation</span>
                            <span className="font-bold text-stone-200 text-[10px] truncate block mt-0.5">ISRO / Sentinel</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-stone-400 mt-2 italic leading-relaxed">
                          "{selectedMap.notes}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-[11px] text-stone-400">
                        <span>Cached locally in IndexedDB</span>
                        <button
                          onClick={() => removeSavedMap(selectedMap.id)}
                          className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove Map</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-12 text-center text-xs text-stone-500">
                      Select a map from the left to view details
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QUEUE & BACKGROUND SYNC */}
          {activeTab === 'queue' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
                <span>Operations performed while offline are held here until connection returns:</span>
                <span className="font-semibold text-emerald-800">{pendingActions.length} Pending</span>
              </div>

              {pendingActions.length === 0 ? (
                <div className="p-12 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="font-bold text-stone-800">All Field Operations Synced!</p>
                  <p className="text-stone-400 mt-1 max-w-sm mx-auto">
                    Any activities marked done or notes added while offline in the field will automatically appear here and sync when connectivity returns.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pendingActions.map(action => (
                    <div key={action.id} className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <span className="font-bold text-stone-900">{action.type.replace('_', ' ')}</span>
                          <p className="text-[11px] text-stone-600">
                            Queued at: {new Date(action.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold text-[10px] uppercase">
                        {action.status}
                      </span>
                    </div>
                  ))}

                  <div className="pt-2">
                    <button
                      onClick={handleSyncNow}
                      disabled={isOffline || isSyncing}
                      className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Syncing with Server...' : 'Flush & Sync Queue Now'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: OFFLINE FIELD GUIDES */}
          {activeTab === 'guides' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="font-bold text-xs text-stone-900 mb-1 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <span>Drought Survival Strategy for Rice Paddies</span>
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Adopt Alternate Wetting & Drying (AWD). Install a 20cm perforated PVC field pipe to monitor subsurface water depth. Re-irrigate only when water drops 15cm below the soil surface, conserving 38% water without yield reduction.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="font-bold text-xs text-stone-900 mb-1 flex items-center gap-1.5">
                  <CloudLightning className="w-4 h-4 text-amber-600" />
                  <span>Lightning & Squall Safety Checklist</span>
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Never seek shelter under isolated trees in open paddy fields. Disconnect aluminum irrigation siphon pipes. Keep cattle away from wire fences. Seek shelter in a concrete pump shed or low-lying ditch if caught in open fields.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="font-bold text-xs text-stone-900 mb-1 flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>Neem Seed Kernel Extract (NSKE 5%) Formulation</span>
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Pound 5kg dried neem seed kernels into coarse powder. Tie loosely in a muslin cloth bag and soak in 10L water overnight. Squeeze the bag to extract azadirachtin. Dilute to 100L water and add 100g khadi soap powder as emulsifier before morning spray.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-3 flex items-center justify-between text-xs text-stone-500">
          <span>Engine: <strong>IndexedDB State Sync v1.0 + Service Worker</strong></span>
          <button
            onClick={closeVault}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 font-bold text-stone-800 transition-colors cursor-pointer"
          >
            Close Vault
          </button>
        </div>

      </div>
    </div>
  );
};
