import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  CloudLightning,
  CloudRain,
  Wind,
  Droplets,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  RefreshCw,
  Sparkles,
  PhoneCall,
  History
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { useApp } from '../../context/AppContext.js';
import { api } from '../../services/api.js';
import { WeatherAlert, WeatherRecord } from '../../types/index.js';

export const WeatherModule: React.FC = () => {
  const { user, triggerThunderstormDemo, showToast } = useApp();
  const [weather, setWeather] = useState<WeatherRecord | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [smsLogs, setSmsLogs] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<'HIGH' | 'CRITICAL'>('HIGH');

  const loadWeatherData = async () => {
    try {
      const [wRes, aRes, smsRes] = await Promise.all([
        api.getWeather(user?.farmId),
        api.getAlerts(user?.farmId),
        api.getSmsLogs()
      ]);
      if (wRes.success) setWeather(wRes.weather);
      if (aRes.success) setAlerts(aRes.alerts);
      if (smsRes.success) setSmsLogs(smsRes.logs);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, [user]);

  const handleTriggerStorm = async () => {
    setIsSimulating(true);
    try {
      const res = await api.triggerThunderstormAlert(user?.farmId || 'farm-krishna-delta-01', selectedSeverity);
      if (res.success) {
        showToast(`⚡ ${selectedSeverity} Thunderstorm Alert generated & SMS sent to farmer!`, 'alert');
        loadWeatherData();
      }
    } catch (e: any) {
      showToast('Error: ' + e.message, 'alert');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      await api.resolveAlert(id);
      showToast('Alert marked as resolved', 'success');
      loadWeatherData();
    } catch (e) {
      showToast('Failed to resolve alert', 'alert');
    }
  };

  const forecast = weather?.forecast || [
    { day: 'Today', date: '28 Sep', tempMax: 31, tempMin: 24, condition: 'Thunderstorm', rainProb: 90, thunderstormProb: 85, windSpeed: 42 },
    { day: 'Tomorrow', date: '29 Sep', tempMax: 30, tempMin: 23, condition: 'Moderate Rain', rainProb: 75, thunderstormProb: 40, windSpeed: 24 },
    { day: 'Wed', date: '30 Sep', tempMax: 32, tempMin: 24, condition: 'Partly Cloudy', rainProb: 30, thunderstormProb: 15, windSpeed: 16 },
    { day: 'Thu', date: '01 Oct', tempMax: 33, tempMin: 25, condition: 'Sunny / Clear', rainProb: 10, thunderstormProb: 5, windSpeed: 12 },
    { day: 'Fri', date: '02 Oct', tempMax: 34, tempMin: 25, condition: 'Sunny / Clear', rainProb: 15, thunderstormProb: 5, windSpeed: 14 },
    { day: 'Sat', date: '03 Oct', tempMax: 33, tempMin: 24, condition: 'Scattered Showers', rainProb: 45, thunderstormProb: 20, windSpeed: 18 },
    { day: 'Sun', date: '04 Oct', tempMax: 32, tempMin: 24, condition: 'Partly Cloudy', rainProb: 25, thunderstormProb: 10, windSpeed: 15 }
  ];

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Weather Header */}
      <div className="bg-gradient-to-r from-sky-900 via-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-sky-200 border border-white/20 flex items-center gap-1.5">
              <CloudSun className="w-3.5 h-3.5" />
              <span>Agro-Meteorological Telemetry</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-stone-950 uppercase tracking-wider">
              DEMO DATA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Weather Intelligence & Thunderstorm Alert System
          </h1>
          <p className="text-xs sm:text-sm text-sky-100/90 mt-1 max-w-2xl leading-relaxed">
            Automated severe storm detection pipeline. Automatically maps Doppler radar convection cells to farm boundaries, issues emergency advisories, and dispatches SMS alerts.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-sky-200">
            <span className="font-semibold text-white">Public Meteorological Feeds:</span>
            <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20">⛈️ IMD Doppler Radar (Machilipatnam DWR)</span>
            <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20">📋 Gramin Krishi Mausam Sewa (GKMS)</span>
          </div>
        </div>

        {/* Simulator controls */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shrink-0 space-y-2">
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
            ⚡ Thunderstorm Engine Simulator:
          </span>
          <div className="flex items-center gap-2">
            <select
              value={selectedSeverity}
              onChange={e => setSelectedSeverity(e.target.value as any)}
              className="bg-stone-900 text-white text-xs p-2 rounded-xl border border-white/20"
            >
              <option value="HIGH">High Severity</option>
              <option value="CRITICAL">Critical Severity</option>
            </select>
            <button
              onClick={handleTriggerStorm}
              disabled={isSimulating}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CloudLightning className="w-3.5 h-3.5" />}
              <span>Trigger Alert Loop</span>
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE THUNDERSTORM ALERTS SECTION */}
      {activeAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
              <CloudLightning className="w-5 h-5 text-amber-600 animate-bounce" />
              <span>Active Thunderstorm Warnings ({activeAlerts.length})</span>
            </h3>
            <span className="text-xs text-stone-500">Live Convective Radar Track</span>
          </div>

          {activeAlerts.map(alert => (
            <div
              key={alert.id}
              className="bg-amber-50/80 border-2 border-amber-500 rounded-3xl p-6 shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-300">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-600 text-white shadow-md">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-700 text-white">
                        {alert.severity} SEVERITY
                      </span>
                      <span className="text-[11px] font-bold text-stone-500">
                        Issued: {new Date(alert.issuedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-stone-900 mt-0.5">{alert.title}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    <span className="font-bold text-emerald-800 flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>DEMO SMS Sent</span>
                    </span>
                    <span className="text-stone-500 text-[10px] font-mono">{alert.smsRecipient}</span>
                  </div>
                  <button
                    onClick={() => handleResolveAlert(alert.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                {alert.description}
              </p>

              {/* Action Checklist */}
              <div>
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-2">
                  Emergency Pre-Storm Field Protocol:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {alert.actions.map((act, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-amber-200">
                      <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span className="text-xs text-stone-800 font-semibold">{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7-DAY FORECAST CARDS */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-sky-600" />
            <span>7-Day Agro-Meteorological Forecast</span>
          </h3>
          <span className="text-xs text-stone-400">Tenali Coordinates (16.24°N, 80.64°E)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecast.map((f, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border text-center flex flex-col justify-between transition-colors ${
                idx === 0
                  ? 'bg-amber-50/70 border-amber-300 font-medium'
                  : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-stone-900 block">{f.day}</span>
                <span className="text-[10px] text-stone-400 block">{f.date}</span>

                <div className="my-3 flex justify-center">
                  {f.thunderstormProb > 50 ? (
                    <CloudLightning className="w-7 h-7 text-amber-600" />
                  ) : f.rainProb > 40 ? (
                    <CloudRain className="w-7 h-7 text-sky-600" />
                  ) : (
                    <CloudSun className="w-7 h-7 text-amber-500" />
                  )}
                </div>

                <div className="text-xs font-extrabold text-stone-900">
                  {f.tempMax}° / <span className="text-stone-400 font-normal">{f.tempMin}°</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-200/70 text-[10px] text-stone-500 space-y-0.5">
                <div className="font-semibold text-sky-700">Rain: {f.rainProb}%</div>
                <div className="text-amber-800">Storm: {f.thunderstormProb}%</div>
                <div>{f.windSpeed} km/h</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RAIN & THUNDERSTORM PROBABILITY CHART */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
        <h3 className="font-bold text-base text-stone-900 mb-1">Precipitation & Storm Probability Trend</h3>
        <p className="text-xs text-stone-500 mb-4">
          Convective storm dynamics vs ambient rainfall volume over the upcoming 7 days.
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="stormGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#78716c" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#78716c" unit="%" />
              <Tooltip contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="thunderstormProb" name="Thunderstorm Probability (%)" stroke="#d97706" strokeWidth={2.5} fillOpacity={1} fill="url(#stormGradient)" />
              <Area type="monotone" dataKey="rainProb" name="Rain Probability (%)" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#rainGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ALERT & SMS AUDIT LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical Alerts */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
          <h3 className="font-bold text-sm text-stone-900 mb-3 flex items-center gap-2">
            <History className="w-4 h-4 text-stone-600" />
            <span>Alert History Log</span>
          </h3>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <p className="text-xs text-stone-400">No alerts logged</p>
            ) : (
              alerts.map(a => (
                <div key={a.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-extrabold text-[10px] px-2 py-0.5 rounded uppercase ${
                      a.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {a.severity}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(a.issuedAt).toLocaleDateString()} {new Date(a.issuedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="font-bold text-stone-900">{a.title}</div>
                  <div className="text-[11px] text-stone-500 line-clamp-1">{a.description}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SMS Dispatch Log */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-600" />
              <span>Automated SMS Dispatch Log</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              DEMO SMS SENT
            </span>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {smsLogs.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-stone-700">{log.phone}</span>
                  <span className="font-bold text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                    {log.status}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 font-mono bg-white p-2 rounded-lg border border-stone-200">
                  {log.message}
                </p>
                <div className="text-[10px] text-stone-400">
                  Timestamp: {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
