import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Droplets,
  Sprout,
  Thermometer,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { api } from '../../services/api.js';
import { SoilRecord } from '../../types/index.js';

export const SoilHealthModule: React.FC = () => {
  const { user } = useApp();
  const [soil, setSoil] = useState<SoilRecord | null>(null);

  useEffect(() => {
    api.getSoil(user?.farmId || 'farm-krishna-delta-01').then(res => {
      if (res.success) setSoil(res.soil);
    });
  }, [user]);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-amber-200 border border-white/20 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Bio-Chemical Soil Telemetry</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-stone-950 uppercase">
              DEMO SENSOR
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Soil Health Card & Microbiome Analytics
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
            Continuously monitors Soil Organic Carbon (SOC), macronutrients (N-P-K), active acidity (pH), and sub-surface moisture.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
          <span className="text-stone-300 text-xs block font-medium">Composite Soil Health Score</span>
          <span className="text-3xl font-black text-amber-400">{soil?.soilHealthScore || 82} / 100</span>
          <span className="text-[11px] text-emerald-300 block font-semibold">Tier 1: High Agro-Ecological Fertility</span>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-400">Soil pH Reaction</span>
          <div className="text-2xl font-black text-stone-900">{soil?.ph || 6.8}</div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
            Near Neutral (Optimal)
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-400">Organic Carbon (SOC)</span>
          <div className="text-2xl font-black text-stone-900">{soil?.organicCarbon || 0.88}%</div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
            Target &gt; 0.75% Met
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-400">Subsoil Moisture</span>
          <div className="text-2xl font-black text-stone-900">{soil?.moisture || 48}%</div>
          <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded inline-block">
            Field Capacity Adequate
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-400">Soil Temperature</span>
          <div className="text-2xl font-black text-stone-900">{soil?.soilTemperature || 26.4}°C</div>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded inline-block">
            Active Microbial Zone
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-400">Available Nitrogen (N)</span>
          <div className="text-2xl font-black text-stone-900">{soil?.nitrogen || 245} <span className="text-xs font-normal">kg/ha</span></div>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block">
            Medium-Low Tier
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-400">Available Phosphorus (P)</span>
          <div className="text-2xl font-black text-stone-900">{soil?.phosphorus || 28} <span className="text-xs font-normal">kg/ha</span></div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
            Optimal Bioavailability
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-400">Available Potassium (K)</span>
          <div className="text-2xl font-black text-stone-900">{soil?.potassium || 310} <span className="text-xs font-normal">kg/ha</span></div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
            High Reserve
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-400">Microbial Respiration</span>
          <div className="text-2xl font-black text-stone-900">142 <span className="text-xs font-normal">mg C/kg</span></div>
          <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded inline-block">
            Vigorous Biomass
          </span>
        </div>
      </div>

      {/* ACTIONABLE AMENDMENT RECOMMENDATIONS */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
          <Sprout className="w-5 h-5 text-emerald-600" />
          <span>Regenerative Soil Health Directives</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {soil?.recommendations.map((rec, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-stone-800 leading-relaxed font-medium">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
