import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { api } from '../../services/api.js';
import { MarketPrice } from '../../types/index.js';

export const MarketPricesModule: React.FC = () => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<MarketPrice | null>(null);

  useEffect(() => {
    api.getMarketPrices().then(res => {
      if (res.success) {
        setPrices(res.prices);
        if (res.prices.length > 0) setSelectedCrop(res.prices[0]);
      }
    });
  }, []);

  const filtered = prices.filter(p =>
    !search ||
    p.crop.toLowerCase().includes(search.toLowerCase()) ||
    p.marketName.toLowerCase().includes(search.toLowerCase()) ||
    p.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-200 border border-white/20 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real-Time APMC Mandi Telemetry</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-stone-950 uppercase">
              DEMO DATA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Agricultural Commodity Prices & Market Trends
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
            Integration-ready with National e-NAM API and state agricultural marketing boards. Provides price realization forecasts to help farmers time harvesting and storage.
          </p>
        </div>

        <div className="text-right text-xs bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shrink-0">
          <div className="text-stone-300">Telemetry Feed:</div>
          <div className="font-bold text-emerald-300">National Mandi e-NAM Protocol</div>
          <div className="text-[10px] text-stone-400">Updated: Today 09:30 IST</div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs flex items-center gap-3">
        <div className="flex items-center bg-stone-50 rounded-xl px-3 py-2 border border-stone-200 text-xs flex-1">
          <Search className="w-3.5 h-3.5 text-stone-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search crop or mandi market (e.g. Paddy, Guntur Chilli Yard, Cotton)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent focus:outline-none w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mandi Cards List */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(p => {
            const isSelected = selectedCrop?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedCrop(p)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50/50 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                    : 'bg-white border-stone-200 hover:border-emerald-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-extrabold text-stone-900 text-sm">{p.crop}</span>
                    <span className={`text-xs font-extrabold flex items-center gap-0.5 ${
                      p.priceTrend === 'UP' ? 'text-emerald-600' : p.priceTrend === 'DOWN' ? 'text-rose-600' : 'text-stone-500'
                    }`}>
                      {p.priceTrend === 'UP' ? <ArrowUpRight className="w-4 h-4" /> : p.priceTrend === 'DOWN' ? <ArrowDownRight className="w-4 h-4" /> : '•'}
                      <span>{p.changePercent > 0 ? `+${p.changePercent}%` : `${p.changePercent}%`}</span>
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 block">{p.marketName}, {p.state}</span>

                  <div className="my-4">
                    <span className="text-3xl font-black text-stone-900">₹{p.currentPrice.toLocaleString()}</span>
                    <span className="text-xs text-stone-500 ml-1 font-medium">/ {p.unit.split('/')[1] || 'Quintal'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                    <div>
                      <span className="text-stone-400 block">Min - Max Range</span>
                      <span className="font-bold text-stone-700">₹{p.minPrice} - ₹{p.maxPrice}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Modal Price</span>
                      <span className="font-bold text-stone-700">₹{p.modalPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 text-[10px] text-stone-400 flex items-center justify-between border-t border-stone-100">
                  <span>Updated: {p.updatedAt}</span>
                  <span className="font-bold text-emerald-700">View 7-Day Trend →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Crop Historical Chart Drawer */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs h-fit space-y-4">
          {selectedCrop ? (
            <>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Price History Trendline
                </span>
                <h3 className="font-extrabold text-lg text-stone-900 mt-0.5">
                  {selectedCrop.crop}
                </h3>
                <p className="text-xs text-stone-500">
                  {selectedCrop.marketName}, {selectedCrop.state}
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs flex items-center justify-between">
                <span>Current Realization:</span>
                <span className="text-lg font-black text-emerald-800">
                  ₹{selectedCrop.currentPrice.toLocaleString()} {selectedCrop.unit}
                </span>
              </div>

              {/* Chart */}
              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedCrop.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#78716c" />
                    <YAxis domain={['dataMin - 100', 'dataMax + 100']} tick={{ fontSize: 10 }} stroke="#78716c" />
                    <Tooltip contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="price" name="Mandi Price (₹)" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 text-xs text-emerald-900 border border-emerald-200">
                <strong>AgriN Market Timing Advisor:</strong> Price for {selectedCrop.crop} shows an upward trend (+{selectedCrop.changePercent}%). If storage facility is moisture-controlled, holding stock for another 10 days is recommended.
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-xs text-stone-400">
              Select a commodity to view price history
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
