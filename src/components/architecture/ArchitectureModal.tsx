import React from 'react';
import {
  X,
  Layers,
  Sprout,
  BotMessageSquare,
  Satellite,
  CloudSun,
  FlaskConical,
  Network,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Database
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const layers = [
    {
      name: '1. Local Farm Intelligence',
      icon: Sprout,
      color: 'from-emerald-700 to-emerald-900',
      description: 'On-farm sensors measuring soil moisture at root depth, parcel coordinates, planting date, and crop variety (PB 1509 Paddy).'
    },
    {
      name: '2. Multi-Spectral Satellite (Copernicus / ISRO)',
      icon: Satellite,
      color: 'from-indigo-700 to-indigo-900',
      description: 'Sentinel-2 MSI 10m optical passes calculating Normalized Difference Vegetation Index (NDVI: 0.74) and water stress (NDWI: 0.38).'
    },
    {
      name: '3. Micro-Meteorology & Thunderstorm Engine',
      icon: CloudSun,
      color: 'from-sky-700 to-sky-900',
      description: 'Doppler radar telemetry anticipating convective squalls, triggering pre-storm alerts, and dispatching automated farmer SMS notifications.'
    },
    {
      name: '4. Bio-Chemical Soil & Carbon Analytics',
      icon: FlaskConical,
      color: 'from-amber-700 to-amber-900',
      description: 'Quantifying Soil Organic Carbon (SOC 0.88%), pH reaction (6.8), and macronutrients (N-P-K) to prevent synthetic over-application.'
    },
    {
      name: '5. Contextual AgriN AI Model',
      icon: BotMessageSquare,
      color: 'from-teal-700 to-teal-900',
      description: 'Google GenAI server-side model synthesizing farm context (crop stage + storm risk + soil moisture) into localized voice & text advisories.'
    },
    {
      name: '6. Regenerative Farm Score Standard',
      icon: ShieldCheck,
      color: 'from-emerald-800 to-stone-900',
      description: 'Objective 0-100 ecological index rewarding in-situ residue mulching, minimal tillage, and legume rotation (Green Gram).'
    },
    {
      name: '7. BRICS AgrIn Federated Public Good',
      icon: Network,
      color: 'from-stone-800 to-stone-950',
      description: 'Decentralized metadata catalog connecting India (ICAR), Brazil (Embrapa), Russia (VIR), China (CAAS), and South Africa (ARC).'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-teal-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Core Digital Public Good Architectural Pillar</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            The AgriN Architectural Stack
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
            Bridging hyper-local farm sensors with planetary earth observation and intergovernmental federated knowledge sharing.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Formula Callout */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
              Integrated Architectural Formula:
            </span>
            <div className="text-xs sm:text-sm font-extrabold text-stone-900 flex flex-wrap items-center justify-center gap-2">
              <span className="bg-white px-2 py-1 rounded-lg border shadow-2xs">FARM TELEMETRY</span>
              <span className="text-emerald-700">+</span>
              <span className="bg-white px-2 py-1 rounded-lg border shadow-2xs">SATELLITE NDVI</span>
              <span className="text-emerald-700">+</span>
              <span className="bg-white px-2 py-1 rounded-lg border shadow-2xs">WEATHER RADAR</span>
              <span className="text-emerald-700">+</span>
              <span className="bg-white px-2 py-1 rounded-lg border shadow-2xs">REGENERATIVE AI</span>
              <span className="text-emerald-700">+</span>
              <span className="bg-emerald-700 text-white px-2 py-1 rounded-lg shadow-xs">BRICS FEDERATED REGISTRY</span>
            </div>
          </div>

          {/* Layer by Layer Breakdown */}
          <div className="space-y-3">
            {layers.map((layer, idx) => {
              const Icon = layer.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-start gap-4 hover:border-emerald-400 transition-colors"
                >
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${layer.color} text-white shrink-0 shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-stone-900">{layer.name}</h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{layer.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Digital Public Good Principles */}
          <div className="p-5 rounded-2xl bg-stone-900 text-white space-y-2">
            <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
              <Globe2 className="w-4 h-4" />
              <span>Why This is a True Digital Public Good (DPG)</span>
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Unlike proprietary multinational precision platforms that lock farmers into chemical monocultures, AgriN is open, interoperable, and federated. Sovereign nations retain total authority over national databases while exchanging anonymized climate models to fortify global food security.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
};
