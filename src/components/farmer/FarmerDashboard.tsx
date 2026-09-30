import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  CloudLightning,
  FlaskConical,
  Satellite,
  BotMessageSquare,
  TrendingUp,
  CalendarDays,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Wind,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Camera,
  Plus,
  Bell,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Clock,
  HardDriveDownload
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import { useApp } from '../../context/AppContext.js';
import { useOffline } from '../../context/OfflineContext.js';
import { api } from '../../services/api.js';
import { FarmActivity, MarketPrice } from '../../types/index.js';

export const FarmerDashboard: React.FC = () => {
  const { user, t, setActiveTab, triggerThunderstormDemo, showToast } = useApp();
  const { isOffline, openVault, queueOfflineAction } = useOffline();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [quickActivityTitle, setQuickActivityTitle] = useState('');
  const [isAddingActivity, setIsAddingActivity] = useState(false);

  const fetchDashboard = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await api.getDashboard(user.id);
      if (data.success) {
        setDashboardData(data);
      }
    } catch (e) {
      console.warn('Could not load dashboard data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  const handleAddQuickActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickActivityTitle.trim() || !dashboardData?.farm?.id) return;
    try {
      const res = await api.addActivity({
        farmId: dashboardData.farm.id,
        userId: user?.id,
        title: quickActivityTitle,
        activityType: 'Irrigation',
        dueDate: new Date().toISOString().split('T')[0],
        cropName: dashboardData?.crops?.[0]?.cropName || 'Paddy'
      });
      if (res.success) {
        showToast('Activity added to farm calendar', 'success');
        setQuickActivityTitle('');
        setIsAddingActivity(false);
        fetchDashboard();
      }
    } catch (err) {
      showToast('Failed to add activity', 'alert');
    }
  };

  const handleToggleActivity = async (activity: FarmActivity) => {
    // If offline, queue in IndexedDB and optimistically update local UI
    if (isOffline) {
      await queueOfflineAction('COMPLETE_ACTIVITY', { activityId: activity.id, completed: !activity.completed });
      setDashboardData((prev: any) => ({
        ...prev,
        activities: prev.activities.map((a: FarmActivity) =>
          a.id === activity.id ? { ...a, completed: !a.completed } : a
        )
      }));
      showToast('📡 Offline: Activity updated and queued in IndexedDB for auto-sync!', 'info');
      return;
    }

    try {
      await api.updateActivity(activity.id, { completed: !activity.completed });
      setDashboardData((prev: any) => ({
        ...prev,
        activities: prev.activities.map((a: FarmActivity) =>
          a.id === activity.id ? { ...a, completed: !a.completed } : a
        )
      }));
      showToast(activity.completed ? 'Activity marked pending' : 'Activity completed!', 'success');
    } catch (e) {
      // Network failed: fallback to offline queue
      await queueOfflineAction('COMPLETE_ACTIVITY', { activityId: activity.id, completed: !activity.completed });
      setDashboardData((prev: any) => ({
        ...prev,
        activities: prev.activities.map((a: FarmActivity) =>
          a.id === activity.id ? { ...a, completed: !a.completed } : a
        )
      }));
      showToast('📡 Network unavailable: Queued in IndexedDB for auto-sync.', 'info');
    }
  };

  if (isLoading && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs font-semibold text-stone-500">Loading Farm Telemetry & Satellite Data...</p>
        </div>
      </div>
    );
  }

  const farm = dashboardData?.farm || {
    name: 'Krishna Delta Eco-Farm',
    locationName: 'Tenali, Guntur District',
    state: 'Andhra Pradesh',
    country: 'India',
    areaHectares: 3.8,
    soilType: 'Alluvial Clay Loam',
    irrigationType: 'Sub-surface Drip & Canal'
  };

  const currentCrop = dashboardData?.crops?.[0] || {
    cropName: 'Basmati Paddy (PB 1509)',
    stage: 'Panicle Initiation (Day 58)',
    healthScore: 88,
    activeAreaHectares: 2.5
  };

  const weather = dashboardData?.weather;
  const activeAlert = dashboardData?.alerts?.[0];
  const soil = dashboardData?.soil;
  const satellite = dashboardData?.satellite;
  const market = dashboardData?.market || [];
  const activities = dashboardData?.activities || [];
  const regenerativeScore = dashboardData?.regenerativeScore;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. WELCOME & FARM HERO HEADER */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute right-12 top-6 hidden lg:block opacity-15">
          <Satellite className="w-44 h-44 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md border border-white/20 text-emerald-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AgriN Smart Farm Telemetry</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-stone-950 uppercase tracking-wider">
              DEMO DATA
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.dashboard.welcome}, {user?.name || 'Ramesh Patel'}!
          </h1>
          <p className="text-sm text-emerald-100/90 mt-1.5 leading-relaxed">
            Real-time agro-intelligence for <strong className="text-white">{farm.name}</strong> ({farm.locationName}, {farm.state}).
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-600/60 text-xs">
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <span className="text-emerald-200 text-[11px] block">{t.dashboard.currentCrop}</span>
              <span className="font-bold text-sm text-white truncate block">{currentCrop.cropName}</span>
              <span className="text-[10px] text-emerald-200/80">{currentCrop.stage}</span>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <span className="text-emerald-200 text-[11px] block">{t.dashboard.farmArea}</span>
              <span className="font-bold text-sm text-white">{farm.areaHectares} Hectares</span>
              <span className="text-[10px] text-emerald-200/80">{farm.soilType}</span>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <span className="text-emerald-200 text-[11px] block">Satellite Health</span>
              <span className="font-bold text-sm text-white">NDVI {satellite?.ndvi || 0.74}</span>
              <span className="text-[10px] text-emerald-300">Vigorous Canopy</span>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <span className="text-emerald-200 text-[11px] block">{t.dashboard.regenerativeRating}</span>
              <span className="font-bold text-sm text-amber-300">
                {regenerativeScore?.overallScore || 78}/100
              </span>
              <span className="text-[10px] text-emerald-200/80">Resilient Soil</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
          <span>{t.dashboard.quickActions}:</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('aiAssistant')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <BotMessageSquare className="w-3.5 h-3.5" />
            <span>{t.dashboard.askAi}</span>
          </button>
          <button
            onClick={() => setActiveTab('cropDoctor')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-teal-600" />
            <span>{t.dashboard.diagnoseCrop}</span>
          </button>
          <button
            onClick={() => setActiveTab('weather')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <CloudSun className="w-3.5 h-3.5 text-sky-600" />
            <span>{t.dashboard.viewForecast}</span>
          </button>
          <button
            onClick={() => setActiveTab('satellite')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Satellite className="w-3.5 h-3.5 text-stone-600" />
            <span>View Satellite (NDVI)</span>
          </button>
          <button
            onClick={() => setActiveTab('marketPrices')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-stone-600" />
            <span>Market Prices</span>
          </button>
          <button
            onClick={openVault}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-bold shadow-xs transition-colors cursor-pointer"
            title="Open IndexedDB Offline Agro-Vault for low-connectivity field access"
          >
            <HardDriveDownload className="w-3.5 h-3.5 text-amber-400" />
            <span>Offline Vault</span>
          </button>
          <button
            onClick={triggerThunderstormDemo}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors cursor-pointer"
            title="Simulate severe storm radar telemetry & send demo SMS"
          >
            <CloudLightning className="w-3.5 h-3.5 text-amber-600" />
            <span>Simulate Storm</span>
          </button>
        </div>
      </div>

      {/* 2. CRITICAL THUNDERSTORM ALERT CARD (if active) */}
      {activeAlert && (
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border-2 border-amber-500/60 rounded-3xl p-5 sm:p-6 shadow-md transition-all animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-300/40">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-600 text-white shadow-md animate-bounce">
                <CloudLightning className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-600 text-white tracking-wider">
                    {activeAlert.severity} PRIORITY
                  </span>
                  <span className="text-xs font-bold text-amber-900">
                    Thunderstorm Advisory
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    DEMO ALERT
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-0.5">
                  {activeAlert.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right text-[11px] text-stone-600">
                <span className="font-semibold text-emerald-800 flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>DEMO SMS Dispatched</span>
                </span>
                <span className="text-stone-400 font-mono text-[10px]">
                  {activeAlert.smsRecipient}
                </span>
              </div>
              <button
                onClick={() => setActiveTab('weather')}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
              >
                Emergency Actions →
              </button>
            </div>
          </div>

          <p className="text-xs text-stone-700 mt-3.5 leading-relaxed font-medium">
            {activeAlert.description}
          </p>

          {/* Action pills */}
          <div className="mt-4 pt-3 border-t border-amber-200/60 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {activeAlert.actions.slice(0, 4).map((action: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span className="text-stone-800 font-semibold">{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CORE TELEMETRY DASHBOARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* CARD 1: WEATHER & RADAR */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Local Weather Radar</h3>
                  <p className="text-[11px] text-stone-500">Tenali Doppler Telemetry</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                DEMO DATA
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-2">
              <div>
                <span className="text-3xl font-extrabold text-stone-900">
                  {weather?.temperature || 29.5}°C
                </span>
                <span className="text-xs text-stone-500 block font-medium">
                  {weather?.condition || 'Thunderstorm Approaching'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-rose-600 block">
                  ⚡ Rain Risk: {weather?.rainProb || 90}%
                </span>
                <span className="text-[11px] text-stone-500">
                  Thunderstorm: {weather?.thunderstormProb || 85}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5 p-3 rounded-2xl bg-stone-50 border border-stone-100 text-center text-xs">
              <div>
                <span className="text-[10px] text-stone-400 block font-medium">Humidity</span>
                <span className="font-bold text-stone-800">{weather?.humidity || 84}%</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block font-medium">Wind Gusts</span>
                <span className="font-bold text-stone-800">{weather?.windSpeed || 38} km/h</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block font-medium">Rainfall 24h</span>
                <span className="font-bold text-stone-800">{weather?.rainfall || 18.4} mm</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('weather')}
            className="w-full mt-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View 7-Day Forecast & Storm Protocol</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* CARD 2: SOIL HEALTH & MOISTURE */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Soil Health & Moisture</h3>
                  <p className="text-[11px] text-stone-500">Block A Multi-depth Sensor</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Score: {soil?.soilHealthScore || 82}/100
              </span>
            </div>

            <div className="space-y-3 mt-3">
              {/* Soil Moisture Bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-stone-600">Root Zone Moisture</span>
                  <span className="font-bold text-emerald-700">{soil?.moisture || 48}% (Adequate)</span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full"
                    style={{ width: `${soil?.moisture || 48}%` }}
                  />
                </div>
              </div>

              {/* Grid of Soil Chem */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="p-2 rounded-xl bg-stone-50 border border-stone-100 text-center">
                  <span className="text-[10px] text-stone-400 block font-medium">pH Level</span>
                  <span className="font-bold text-stone-800 text-xs">{soil?.ph || 6.8} (Neutral)</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-50 border border-stone-100 text-center">
                  <span className="text-[10px] text-stone-400 block font-medium">Organic C</span>
                  <span className="font-bold text-stone-800 text-xs">{soil?.organicCarbon || 0.88}%</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-50 border border-stone-100 text-center">
                  <span className="text-[10px] text-stone-400 block font-medium">Nitrogen (N)</span>
                  <span className="font-bold text-stone-800 text-xs">{soil?.nitrogen || 245} kg/ha</span>
                </div>
              </div>

              {/* Actionable advisory */}
              <p className="text-[11px] text-stone-600 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 mt-2">
                💡 <strong>Advisory:</strong> Soil moisture is sufficient. Imminent storm will replenish root zone; do not pump irrigation.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('soilHealth')}
            className="w-full mt-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Full Soil Analysis & Amendments</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* CARD 3: SATELLITE CROP HEALTH (NDVI) */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                  <Satellite className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Satellite Crop Health</h3>
                  <p className="text-[11px] text-stone-500">Sentinel-2 10m Multi-Spectral</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                NDVI {satellite?.ndvi || 0.74}
              </span>
            </div>

            <p className="text-xs text-stone-600 font-medium mb-3">
              Vegetation canopy is <strong className="text-emerald-700">Vigorous & Dense</strong>. Water stress index (NDWI: 0.38) indicates optimal hydration.
            </p>

            {/* Recharts NDVI Trend Mini Chart */}
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={satellite?.historicalData || [
                    { date: '10 Aug', ndvi: 0.32 },
                    { date: '20 Aug', ndvi: 0.44 },
                    { date: '30 Aug', ndvi: 0.58 },
                    { date: '09 Sep', ndvi: 0.67 },
                    { date: '19 Sep', ndvi: 0.71 },
                    { date: '27 Sep', ndvi: 0.74 }
                  ]}
                  margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#a8a29e" />
                  <YAxis domain={[0.2, 0.9]} tick={{ fontSize: 9 }} stroke="#a8a29e" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                    formatter={(val: any) => [`${val}`, 'NDVI Score']}
                  />
                  <Area type="monotone" dataKey="ndvi" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#ndviGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] text-stone-400 text-center mt-1">
              Sentinel-2 NDVI Growth Curve (+6% over 15-day average)
            </div>
          </div>

          <button
            onClick={() => setActiveTab('satellite')}
            className="w-full mt-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Explore Satellite Multispectral Layers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* CARD 4: CONTEXTUAL AI AGRO-RECOMMENDATION */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <BotMessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">AgriN AI Live Recommendation</h3>
                  <p className="text-[11px] text-stone-500">Autonomous Agro-Advisor</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Context Injected</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Priority Agro-Directive:</span>
              </div>
              <p className="text-stone-700 leading-relaxed">
                "Severe thunderstorm expected within 2 hours. Soil moisture is currently <strong>48%</strong>.
                <strong> Do not irrigate or spray fungicides today.</strong> Inspect field drainage trenches to allow free run-off."
              </p>
              <div className="pt-2 border-t border-stone-200 text-[11px] text-emerald-800 font-semibold flex items-center justify-between">
                <span>Conserved: ~32,000L groundwater</span>
                <span className="text-stone-400">Risk avoided: 100%</span>
              </div>
            </div>

            {/* Quick suggested prompt buttons */}
            <div className="mt-3 space-y-1.5">
              <button
                onClick={() => setActiveTab('aiAssistant')}
                className="w-full text-left p-2 rounded-xl bg-stone-50 hover:bg-emerald-50 text-[11px] text-stone-700 hover:text-emerald-900 border border-stone-200 transition-colors flex items-center justify-between"
              >
                <span>Should I apply organic fertilizer this week?</span>
                <span className="text-emerald-600 font-bold">Ask →</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('aiAssistant')}
            className="w-full mt-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <BotMessageSquare className="w-4 h-4" />
            <span>Chat with AgriN AI</span>
          </button>
        </div>

        {/* CARD 5: MARKET PRICE TELEMETRY */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Mandi Price Telemetry</h3>
                  <p className="text-[11px] text-stone-500">APMC Guntur & Tenali</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                DEMO DATA
              </span>
            </div>

            <div className="space-y-2.5">
              {market.slice(0, 3).map((item: MarketPrice) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100 hover:bg-stone-100/70 transition-colors"
                >
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">{item.crop}</span>
                    <span className="text-[10px] text-stone-400">{item.marketName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-xs text-stone-900 block">
                      ₹{item.currentPrice.toLocaleString()} / qtl
                    </span>
                    <span className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${
                      item.priceTrend === 'UP' ? 'text-emerald-600' : item.priceTrend === 'DOWN' ? 'text-rose-600' : 'text-stone-500'
                    }`}>
                      {item.priceTrend === 'UP' ? <ArrowUpRight className="w-3 h-3" /> : item.priceTrend === 'DOWN' ? <ArrowDownRight className="w-3 h-3" /> : '•'}
                      <span>{item.changePercent > 0 ? `+${item.changePercent}%` : `${item.changePercent}%`}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('marketPrices')}
            className="w-full mt-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View All Regional Mandi Prices</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* CARD 6: UPCOMING FARM ACTIVITIES */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Farmer Calendar</h3>
                  <p className="text-[11px] text-stone-500">Upcoming Field Tasks</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddingActivity(!isAddingActivity)}
                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {isAddingActivity && (
              <form onSubmit={handleAddQuickActivity} className="mb-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <input
                  type="text"
                  placeholder="Task title (e.g., Apply Jeevamrutha)"
                  value={quickActivityTitle}
                  onChange={e => setQuickActivityTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingActivity(false)}
                    className="px-2.5 py-1 text-xs text-stone-500 hover:text-stone-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-bold"
                  >
                    Save Task
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {activities.slice(0, 3).map((act: FarmActivity) => (
                <div
                  key={act.id}
                  onClick={() => handleToggleActivity(act)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                    act.completed
                      ? 'bg-stone-50/70 border-stone-200 text-stone-400 line-through'
                      : 'bg-white border-stone-200 hover:border-emerald-400 shadow-2xs'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={act.completed}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-stone-800 truncate">{act.title}</span>
                      {act.aiSuggested && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 shrink-0">
                          AI
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-500 truncate">{act.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('calendar')}
            className="w-full mt-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open Smart Agricultural Calendar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 4. REGENERATIVE PRACTICES & GOVERNMENT SCHEMES ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* REGENERATIVE SCORE BANNER */}
        <div className="bg-gradient-to-br from-emerald-950 to-stone-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Regenerative Farm Index
              </span>
              <span className="text-2xl font-black text-amber-400">
                {regenerativeScore?.overallScore || 78} / 100
              </span>
            </div>

            <h3 className="text-lg font-bold">Climate-Resilient & Ecological Farming</h3>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              Your farm maintains high in-situ straw mulching and biological soil inoculants. Green gram legume rotation naturally fixes ~42 kg Nitrogen/ha.
            </p>

            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-stone-400 block">Soil Carbon</span>
                <span className="font-bold text-xs text-emerald-300">0.88% (Healthy)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-stone-400 block">Water Saved</span>
                <span className="font-bold text-xs text-teal-300">36% vs Flood</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-stone-400 block">Chemical Cut</span>
                <span className="font-bold text-xs text-amber-300">-58% Synthetic</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('regenerativeScore')}
            className="mt-6 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center transition-colors cursor-pointer"
          >
            View Regenerative Carbon & Bio-Diversity Breakdown →
          </button>
        </div>

        {/* PM-KISAN & SCHEMES CARD */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Government Support & PM-KISAN</h3>
                  <p className="text-[11px] text-stone-500">Direct Income & Organic Subsidies</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Govt Verified
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900">PM-KISAN 17th Installment Status</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Active DBT
                </span>
              </div>
              <p className="text-[11px] text-stone-600">
                Aadhaar e-KYC and land seeding confirmed. ₹2,000 scheduled for transfer into verified bank account.
              </p>
              <div className="text-[10px] text-stone-500 pt-1">
                Official Portal: <a href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-semibold underline">pmkisan.gov.in</a>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-stone-600 px-1">
              <span>PKVY Organic Cluster Scheme:</span>
              <span className="font-bold text-emerald-700">Eligible (Up to ₹50,000/ha)</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('pmKisan')}
            className="w-full mt-6 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View All Eligible Schemes & Official Links</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
