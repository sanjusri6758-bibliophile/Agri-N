import React, { useState, useEffect } from 'react';
import {
  Network,
  Globe2,
  Search,
  Filter,
  Download,
  ExternalLink,
  Layers,
  Sparkles,
  Share2,
  Lock,
  Unlock,
  CheckCircle2,
  Building2,
  Database,
  Copy,
  Check,
  Code2,
  FileCode,
  ShieldCheck,
  Radio,
  BookOpen
} from 'lucide-react';
import { api } from '../../services/api.js';
import { RegistryDataset, BRICSCountry } from '../../types/index.js';

export const FederatedRegistryModule: React.FC = () => {
  const [datasets, setDatasets] = useState<RegistryDataset[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedPortal, setSelectedPortal] = useState<string>('All');
  const [activeDataset, setActiveDataset] = useState<RegistryDataset | null>(null);
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);

  useEffect(() => {
    api.getRegistryDatasets().then(res => {
      if (res.success) {
        setDatasets(res.datasets);
        if (res.datasets.length > 0) setActiveDataset(res.datasets[0]);
      }
    });
  }, []);

  const portals = [
    { id: 'All', label: 'All Portals' },
    { id: 'data.gov.in', label: '🏛️ data.gov.in (India OGD)' },
    { id: 'ISRO/Bhuvan', label: '🛰️ ISRO / Bhuvan Satellite' },
    { id: 'IMD', label: '⛈️ IMD Weather Radar' },
    { id: 'FAO', label: '🌐 UN FAOSTAT & GAEZ' },
    { id: 'WHO', label: '🩺 WHO Health & Codex' },
    { id: 'BRICS Node', label: '🌍 Sovereign BRICS Nodes' }
  ];

  const filtered = datasets.filter(d => {
    const matchCountry = selectedCountry === 'All' || d.country === selectedCountry;
    const matchType = selectedType === 'All' || d.dataType === selectedType;
    const matchPortal = selectedPortal === 'All' || d.sourcePortal === selectedPortal;
    const matchSearch = !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      d.crop.toLowerCase().includes(search.toLowerCase()) ||
      (d.dataSource && d.dataSource.toLowerCase().includes(search.toLowerCase()));
    return matchCountry && matchType && matchPortal && matchSearch;
  });

  const handleCopyEndpoint = (endpoint: string) => {
    navigator.clipboard?.writeText(endpoint);
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  const getPortalBadge = (portal?: string) => {
    switch (portal) {
      case 'data.gov.in':
        return { label: 'data.gov.in OGD', bg: 'bg-orange-100 text-orange-800 border-orange-200' };
      case 'ISRO/Bhuvan':
        return { label: 'ISRO / Bhuvan', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'IMD':
        return { label: 'IMD Mausam / GKMS', bg: 'bg-sky-100 text-sky-800 border-sky-200' };
      case 'FAO':
        return { label: 'UN FAOSTAT', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'WHO':
        return { label: 'WHO Codex', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      default:
        return { label: 'BRICS Node', bg: 'bg-stone-100 text-stone-800 border-stone-200' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-stone-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5" />
              <span>BRICS AgrIn Federated Data Registry</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-400 text-stone-950 uppercase">
              DIGITAL PUBLIC GOOD
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Interoperable Agricultural Public Data Registry
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
            Federated open catalog indexing authoritative public datasets from <strong>data.gov.in</strong>, <strong>ISRO Bhuvan</strong>, <strong>India Meteorological Department (IMD)</strong>, <strong>UN FAO</strong>, and <strong>WHO</strong> alongside sovereign BRICS research institutions.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs text-stone-300 shrink-0 space-y-1">
          <div className="text-stone-400 font-bold uppercase text-[10px]">Open Public Data Ingestion:</div>
          <div className="text-emerald-300 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>data.gov.in & ISRO Bhuvan Connected</span>
          </div>
          <div className="text-sky-300 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
            <span>IMD Radar & FAO / WHO Guidelines Active</span>
          </div>
        </div>
      </div>

      {/* PUBLIC DATASET PORTAL FILTER CHIPS */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-2xl border border-stone-200 shadow-xs">
        <span className="text-xs font-bold text-stone-500 mr-2 flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Source Portal:</span>
        </span>
        {portals.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPortal(p.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedPortal === p.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* FEDERATION ARCHITECTURE PIPELINE CARDS */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
        <h3 className="font-bold text-sm text-stone-900 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Public Data & Federated Architecture Pipeline</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-extrabold text-stone-400 block uppercase">Step 1</span>
            <span className="font-bold text-xs text-stone-800 block mt-0.5">Public Open APIs</span>
            <p className="text-[10px] text-stone-500 mt-1">Daily ingest: data.gov.in, IMD radar, ISRO Bhuvan, FAO</p>
          </div>
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-extrabold text-stone-400 block uppercase">Step 2</span>
            <span className="font-bold text-xs text-stone-800 block mt-0.5">Data Anonymization</span>
            <p className="text-[10px] text-stone-500 mt-1">Strips sovereign PII, geohashes at 100m raster grid resolution</p>
          </div>
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-extrabold text-stone-400 block uppercase">Step 3</span>
            <span className="font-bold text-xs text-stone-800 block mt-0.5">Harmonized Schema</span>
            <p className="text-[10px] text-stone-500 mt-1">REST / OGC / Parquet metadata catalog sync across BRICS</p>
          </div>
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-extrabold text-stone-400 block uppercase">Step 4</span>
            <span className="font-bold text-xs text-stone-800 block mt-0.5">AgriN Registry</span>
            <p className="text-[10px] text-stone-500 mt-1">Cross-border discovery, search & climate model benchmarking</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300">
            <span className="text-[10px] font-extrabold text-emerald-800 block uppercase">Step 5</span>
            <span className="font-bold text-xs text-emerald-950 block mt-0.5">Local Farmer Impact</span>
            <p className="text-[10px] text-emerald-800 mt-1">Early thunderstorm warnings, soil carbon advice & pest alerts</p>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center bg-stone-50 rounded-xl px-3 py-2 border border-stone-200 text-xs flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-stone-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search by title, crop, agency (e.g. data.gov.in, ISRO, IMD, FAO)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent focus:outline-none w-full"
          />
        </div>

        <select
          value={selectedCountry}
          onChange={e => setSelectedCountry(e.target.value)}
          className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 focus:outline-none"
        >
          <option value="All">All Nations / Global</option>
          <option value="India">🇮🇳 India (data.gov.in / ISRO / IMD)</option>
          <option value="Brazil">🇧🇷 Brazil (Embrapa Node)</option>
          <option value="Russia">🇷🇺 Russia (VIR Node)</option>
          <option value="China">🇨🇳 China (CAAS Node)</option>
          <option value="South Africa">🇿🇦 South Africa (ARC Node)</option>
        </select>

        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 focus:outline-none"
        >
          <option value="All">All Categories</option>
          <option value="Market">Market & Mandi Prices (data.gov.in)</option>
          <option value="Satellite">Satellite & Earth Observation (ISRO / Sentinel)</option>
          <option value="Weather">Weather & Doppler Radar (IMD)</option>
          <option value="Soil">Soil Health & Soil Organic Carbon</option>
          <option value="Yield">Yield & Production Statistics (FAO)</option>
          <option value="Disease">Crop Disease & Residue Limits (WHO)</option>
          <option value="Regenerative agriculture">Regenerative Agriculture</option>
        </select>
      </div>

      {/* DATASETS GRID & DETAIL DRAWER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
              <Database className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-stone-500">No public datasets matched your filter.</p>
              <button
                onClick={() => { setSelectedPortal('All'); setSelectedCountry('All'); setSelectedType('All'); setSearch(''); }}
                className="mt-3 text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            filtered.map(ds => {
              const isSelected = activeDataset?.id === ds.id;
              const badge = getPortalBadge(ds.sourcePortal);
              return (
                <div
                  key={ds.id}
                  onClick={() => setActiveDataset(ds)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/40 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                      : 'bg-white border-stone-200 hover:border-emerald-300 shadow-xs'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-extrabold px-2.5 py-0.5 rounded-full border text-[11px] ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <span className="font-semibold text-stone-600 text-[11px]">
                        {ds.country}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-stone-400">
                      Updated {ds.lastUpdated}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-stone-900 leading-snug">{ds.title}</h4>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">{ds.description}</p>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-stone-500">
                      <strong>{ds.recordCount.toLocaleString()}</strong> records • <strong>{ds.crop}</strong>
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {ds.sharingLevel}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Dataset Detail Sidebar */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs h-fit space-y-4">
          {activeDataset ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  {activeDataset.sourcePortal || activeDataset.country} Public Feed
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {activeDataset.dataType}
                </span>
              </div>

              <h3 className="font-bold text-base text-stone-900 leading-snug">
                {activeDataset.title}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed">
                {activeDataset.description}
              </p>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5 text-stone-700">
                <div><strong>Authoritative Source:</strong> {activeDataset.dataSource}</div>
                <div><strong>Coverage Region:</strong> {activeDataset.region}</div>
                <div><strong>Format / Serialization:</strong> {activeDataset.format}</div>
                <div><strong>Algorithm / Processing:</strong> {activeDataset.modelArchitecture}</div>
                <div><strong>License:</strong> {activeDataset.officialLicense || 'Open Public Good'}</div>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] uppercase tracking-wider block text-indigo-800">
                    Endpoint URL:
                  </span>
                  <button
                    onClick={() => handleCopyEndpoint(activeDataset.nodeEndpoint)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer"
                  >
                    {copiedEndpoint ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEndpoint ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <code className="text-[10px] font-mono block break-all text-indigo-950 bg-white/70 p-2 rounded-lg border border-indigo-150">
                  {activeDataset.nodeEndpoint}
                </code>
              </div>

              <button
                onClick={() => setShowAccessModal(true)}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>View API Integration Code</span>
              </button>
            </>
          ) : (
            <div className="text-center py-12 text-xs text-stone-400">
              Select a dataset to view metadata and API endpoints
            </div>
          )}
        </div>
      </div>

      {/* API INTEGRATION CODE MODAL */}
      {showAccessModal && activeDataset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                  Federated Public Good API Connector
                </span>
                <h3 className="font-bold text-base text-stone-900 mt-0.5">
                  {activeDataset.title}
                </h3>
              </div>
              <button
                onClick={() => setShowAccessModal(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              This dataset is ingested via the AgriN federated protocol using open REST / OGC protocols. Use the cURL or Python code below to query this public resource.
            </p>

            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-700 block">Python (requests):</span>
              <pre className="p-3 rounded-xl bg-stone-900 text-stone-100 text-[11px] font-mono overflow-x-auto leading-relaxed">
{`import requests

url = "${activeDataset.nodeEndpoint}"
headers = {
    "Accept": "application/json",
    "User-Agent": "AgriN-BRICS-FederatedClient/1.0"
}
response = requests.get(url, headers=headers)
data = response.json()
print("Received records from ${activeDataset.sourcePortal}:", len(data.get("records", [])))`}
              </pre>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-700 block">cURL:</span>
              <pre className="p-3 rounded-xl bg-stone-900 text-emerald-300 text-[11px] font-mono overflow-x-auto">
{`curl -X GET "${activeDataset.nodeEndpoint}" \\
  -H "Accept: application/json" \\
  -H "X-AgriN-Federation: open-public-good"`}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-stone-500">
                License: <strong>{activeDataset.officialLicense || 'Open Government License'}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopyEndpoint(activeDataset.nodeEndpoint)}
                  className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedEndpoint ? 'Endpoint Copied' : 'Copy Endpoint'}</span>
                </button>
                <button
                  onClick={() => setShowAccessModal(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
