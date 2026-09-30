import React, { useState, useEffect } from 'react';
import {
  Satellite,
  Layers,
  Calendar,
  CloudSun,
  Droplets,
  Activity,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Info,
  Maximize2,
  HardDriveDownload
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { useApp } from '../../context/AppContext.js';
import { useOffline } from '../../context/OfflineContext.js';
import { api } from '../../services/api.js';
import { SatelliteObservation } from '../../types/index.js';

export const SatelliteModule: React.FC = () => {
  const { user, showToast } = useApp();
  const { saveMapForOffline } = useOffline();
  const [satellite, setSatellite] = useState<SatelliteObservation | null>(null);
  const [activeBand, setActiveBand] = useState<'ndvi' | 'ndwi' | 'rgb'>('ndvi');
  const [satelliteProvider, setSatelliteProvider] = useState<'sentinel' | 'isro_bhuvan' | 'isro_sar'>('isro_bhuvan');

  const handleSaveMapOffline = async () => {
    await saveMapForOffline({
      id: `map-tenali-${Date.now()}`,
      farmId: user?.farmId || 'farm-krishna-delta-01',
      farmName: 'Krishna Delta Eco-Farm',
      parcelName: `Tenali Parcel #402 (${satelliteProvider === 'isro_bhuvan' ? 'ISRO LISS-IV' : 'Sentinel-2'})`,
      coordinates: {
        lat: 16.2437,
        lng: 80.6400,
        polygonCoords: [[16.2445, 80.6390], [16.2448, 80.6415], [16.2425, 80.6418], [16.2422, 80.6392]]
      },
      areaHectares: 3.8,
      crop: 'Basmati Paddy (PB 1509)',
      ndviScore: satellite?.ndvi || 0.74,
      ndwiScore: satellite?.ndwi || 0.38,
      canopyStatus: satellite?.vegetationHealth || 'Vigorous Crop Canopy',
      lastSatellitePass: satellite?.observedDate || '2026-09-27',
      satelliteConstellation: satelliteProvider === 'isro_bhuvan' ? 'ISRO Resourcesat-2A (5.8m)' : 'Copernicus Sentinel-2',
      spectralBands: {},
      savedAt: new Date().toISOString(),
      notes: `Cached ${activeBand.toUpperCase()} spectral layer for offline field navigation in low-connectivity zones.`
    });
    showToast('🗺️ Map cached to IndexedDB Offline Vault! Accessible in the field with zero signal.', 'success');
  };

  useEffect(() => {
    api.getSatellite(user?.farmId || 'farm-krishna-delta-01').then(res => {
      if (res.success) setSatellite(res.satellite);
    });
  }, [user]);

  const historyData = satellite?.historicalData || [
    { date: '10 Aug', ndvi: 0.32, ndwi: 0.15, moisture: 35 },
    { date: '20 Aug', ndvi: 0.44, ndwi: 0.22, moisture: 38 },
    { date: '30 Aug', ndvi: 0.58, ndwi: 0.29, moisture: 42 },
    { date: '09 Sep', ndvi: 0.67, ndwi: 0.34, moisture: 45 },
    { date: '19 Sep', ndvi: 0.71, ndwi: 0.36, moisture: 47 },
    { date: '27 Sep', ndvi: 0.74, ndwi: 0.38, moisture: 48 }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 via-indigo-950 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-indigo-300 border border-white/20 flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5" />
              <span>Multi-Spectral Satellite Telemetry</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-stone-950 uppercase">
              DEMO SIMULATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Earth Observation & Crop Canopy Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
            10-meter spatial resolution data integrated with Copernicus Sentinel-2 MSI and ISRO Bhuvan open federated nodes.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-xs space-y-1">
          <div className="text-stone-300">Active Satellite Source:</div>
          <div className="font-bold text-emerald-300">
            {satelliteProvider === 'isro_bhuvan' && 'ISRO Bhuvan LISS-IV (5.8m)'}
            {satelliteProvider === 'sentinel' && 'Copernicus Sentinel-2 L2A (10m)'}
            {satelliteProvider === 'isro_sar' && 'ISRO EOS-04 C-Band SAR (All-Weather)'}
          </div>
          <div className="text-[11px] text-stone-400">
            {satelliteProvider === 'isro_sar' ? 'Active Microwave Radar • Cloud-Penetrating' : `Cloud Cover: ${satellite?.cloudCoverage || 12}% • Pass: 27 Sep 2026`}
          </div>
        </div>
      </div>

      {/* SATELLITE CONSTELLATION SELECTOR */}
      <div className="bg-white rounded-2xl p-3 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
          <Satellite className="w-3.5 h-3.5 text-indigo-600" />
          <span>Earth Observation Feed:</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSatelliteProvider('isro_bhuvan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              satelliteProvider === 'isro_bhuvan'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            🇮🇳 ISRO Bhuvan (Resourcesat-2A 5.8m)
          </button>
          <button
            onClick={() => setSatelliteProvider('sentinel')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              satelliteProvider === 'sentinel'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            🇪🇺 Sentinel-2 MSI (10m Optical)
          </button>
          <button
            onClick={() => setSatelliteProvider('isro_sar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              satelliteProvider === 'isro_sar'
                ? 'bg-sky-800 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            🛰️ ISRO EOS-04 (RISAT-1A SAR Radar)
          </button>
        </div>
      </div>

      {/* KEY SATELLITE METRICS TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span>NDVI Index</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Healthy
            </span>
          </div>
          <div className="text-3xl font-extrabold text-stone-900">{satellite?.ndvi || 0.74}</div>
          <p className="text-xs text-stone-500 mt-1 font-medium">{satellite?.vegetationHealth || 'Vigorous Crop Canopy'}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span>NDWI Water Index</span>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
              Hydrated
            </span>
          </div>
          <div className="text-3xl font-extrabold text-stone-900">{satellite?.ndwi || 0.38}</div>
          <p className="text-xs text-stone-500 mt-1 font-medium">{satellite?.waterStress || 'Low Stress (Adequate Hydration)'}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span>Canopy Biomass Trend</span>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              +6% Growth
            </span>
          </div>
          <div className="text-xl font-extrabold text-stone-900">{satellite?.growthTrend || 'Accelerating'}</div>
          <p className="text-xs text-stone-500 mt-1 font-medium">{satellite?.cropStress || 'Optimal Biomass Accumulation'}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span>Spatial Ground Resolution</span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              {satelliteProvider === 'isro_bhuvan' ? '5.8 Meters' : satelliteProvider === 'sentinel' ? '10 Meters' : '12 Meters (SAR)'}
            </span>
          </div>
          <div className="text-xl font-extrabold text-stone-900">
            {satelliteProvider === 'isro_bhuvan' && 'ISRO LISS-IV'}
            {satelliteProvider === 'sentinel' && 'Sentinel-2 MSI'}
            {satelliteProvider === 'isro_sar' && 'RISAT-1A SAR'}
          </div>
          <p className="text-xs text-stone-500 mt-1 font-medium">
            {satelliteProvider === 'isro_bhuvan' && 'ISRO Bhuvan Open Geo-Platform Feed'}
            {satelliteProvider === 'sentinel' && 'B4 (Red) & B8 (NIR) calibrated'}
            {satelliteProvider === 'isro_sar' && 'C-Band HH/HV Dual Polarimetric Radar'}
          </p>
        </div>
      </div>

      {/* SATELLITE MAP & SPECTRAL HEATMAP DISPLAY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Farm Parcel Map with NDVI Overlay */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-stone-900">
                Farm Boundary & Spectral Heatmap (Tenali Parcel #402)
              </h3>
              <p className="text-xs text-stone-500">
                Coordinates: 16.2437° N, 80.6400° E • 3.8 Hectares Alluvial Delta Block
              </p>
            </div>

            {/* Controls & Band selector */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSaveMapOffline}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                title="Persist this map and spectral telemetry to IndexedDB for zero-connectivity field use"
              >
                <HardDriveDownload className="w-3.5 h-3.5" />
                <span>Save Map Offline</span>
              </button>

              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
                <button
                  onClick={() => setActiveBand('ndvi')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeBand === 'ndvi' ? 'bg-emerald-700 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  NDVI Heatmap
                </button>
                <button
                  onClick={() => setActiveBand('ndwi')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeBand === 'ndwi' ? 'bg-sky-700 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  NDWI Moisture
                </button>
                <button
                  onClick={() => setActiveBand('rgb')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeBand === 'rgb' ? 'bg-stone-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  True Color RGB
                </button>
              </div>
            </div>
          </div>

          {/* Visual Canvas Representation */}
          <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-stone-300 shadow-inner flex items-center justify-center bg-stone-900">
            {/* Background Satellite Grid Simulation */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                activeBand === 'ndvi'
                  ? 'bg-gradient-to-br from-emerald-900 via-emerald-600 to-teal-700 opacity-90'
                  : activeBand === 'ndwi'
                  ? 'bg-gradient-to-br from-sky-900 via-cyan-600 to-teal-800 opacity-90'
                  : 'bg-gradient-to-br from-stone-800 via-amber-950 to-stone-900 opacity-90'
              }`}
            />

            {/* Simulated farm field boundaries SVG */}
            <svg className="absolute inset-0 w-full h-full p-6" viewBox="0 0 500 300">
              <polygon
                points="80,50 420,40 460,250 60,240"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
              {/* Internal plots */}
              <line x1="250" y1="45" x2="260" y2="245" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="70" y1="150" x2="440" y2="145" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 3" />

              {/* Labels */}
              <text x="120" y="100" fill="#ffffff" fontSize="12" fontWeight="bold">Plot A: Basmati Paddy (NDVI: 0.76)</text>
              <text x="280" y="100" fill="#ffffff" fontSize="12" fontWeight="bold">Plot B: Green Gram (NDVI: 0.72)</text>
              <text x="120" y="200" fill="#ffffff" fontSize="12" fontWeight="bold">Plot C: Sub-surface Drip Lateral</text>
              <text x="280" y="200" fill="#ffffff" fontSize="12" fontWeight="bold">Plot D: Border Agro-Forestry</text>
            </svg>

            {/* Overlay badge */}
            <div className="absolute bottom-4 left-4 bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-xs flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Simulated Sentinel-2 Parcel Boundary (Tenali Block A)</span>
            </div>

            <div className="absolute bottom-4 right-4 bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-[11px]">
              Active Filter: <strong className="uppercase text-amber-300">{activeBand}</strong>
            </div>
          </div>

          {/* Scale Legend */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-2">
            <span>Barren Soil (0.1)</span>
            <div className="flex-1 mx-4 h-3 rounded-full bg-gradient-to-r from-red-500 via-amber-400 via-teal-400 to-emerald-600" />
            <span>Dense Vigorous Canopy (0.9)</span>
          </div>
        </div>

        {/* NDVI Historical Time-Series Chart */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-stone-900 mb-1">
              Multi-Week NDVI Trajectory
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Canopy development from transplanting to panicle initiation.
            </p>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#78716c" />
                  <YAxis domain={[0.2, 0.9]} tick={{ fontSize: 10 }} stroke="#78716c" />
                  <Tooltip contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="ndvi" name="NDVI Index" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="ndwi" name="NDWI Water" stroke="#0284c7" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 mt-4">
            <span className="font-bold text-stone-900 block mb-1">Scientific Agronomic Interpretation:</span>
            NDVI curve reflects healthy vegetative biomass accumulation. No signs of nitrogen deficiency or lodging stress detected.
          </div>
        </div>
      </div>
    </div>
  );
};
