import React from 'react';
import {
  Sprout,
  Satellite,
  CloudSun,
  FlaskConical,
  Network,
  BotMessageSquare,
  ShieldCheck,
  Globe2,
  ArrowRight,
  Sparkles,
  Tractor,
  GraduationCap,
  Microscope,
  CheckCircle2,
  Layers,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { UserRole } from '../../types/index.js';

interface LandingPageProps {
  onOpenArchitecture: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenArchitecture }) => {
  const { openAuthModal, loginAsRole, setActiveTab } = useApp();

  return (
    <div className="space-y-16 py-8 animate-in fade-in">
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 text-white p-8 sm:p-14 shadow-2xl overflow-hidden border border-emerald-900/60">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-12 top-12 hidden lg:block opacity-10">
          <Satellite className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold shadow-xs">
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span>Inspired by the BRICS AgrIn Digital Public Good Initiative</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Intelligence for every farm. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Cooperation for a resilient food future.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
            AgriN connects AI, weather intelligence, satellite monitoring, soil health and federated agricultural knowledge to support climate-resilient farming across emerging economies.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={() => openAuthModal()}
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-900/40 transition-all flex items-center gap-2 cursor-pointer group"
            >
              <span>Get Started with Mobile OTP</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenArchitecture}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Explore BRICS Architecture</span>
            </button>
          </div>

          {/* Instant Role Explorer Bar */}
          <div className="pt-6 border-t border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-2">
              ⚡ Live Platform Role Quick-Start:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => loginAsRole('farmer')}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
              >
                <Tractor className="w-3.5 h-3.5 text-emerald-400" />
                <span>Launch Farmer Dashboard (Ramesh Patel)</span>
              </button>
              <button
                onClick={() => loginAsRole('researcher')}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
              >
                <Microscope className="w-3.5 h-3.5 text-indigo-400" />
                <span>Launch Researcher Hub (Dr. Priya Sundaram)</span>
              </button>
              <button
                onClick={() => loginAsRole('student')}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>Launch Student Diary (Aarav Sharma)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM & SOLUTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="p-8 rounded-3xl bg-rose-50/50 border border-rose-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
              The Critical Challenge
            </span>
            <h3 className="text-xl font-bold text-stone-900 mt-2">
              The Digital Divide in Emerging Agriculture
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 mt-2 leading-relaxed">
              Small and marginal farmers across emerging economies lack access to data-driven agricultural guidance. They rely on traditional uncalibrated methods instead of satellite telemetry, soil health analytics, and climate forecasting — leading to crop failure and threats to food security.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
              Furthermore, the absence of interoperable digital public infrastructure blocks cross-border collaboration on climate-resilient farming models between countries facing identical weather risks.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-rose-200 text-xs text-rose-900 font-medium">
            ⚠️ 40%+ of input costs are wasted when farmers spray pesticides right before unpredicted squalls or over-irrigate fields that already have high sub-surface moisture.
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-emerald-50/50 border border-emerald-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              The AgriN Public Good Solution
            </span>
            <h3 className="text-xl font-bold text-stone-900 mt-2">
              Interoperable Digital Agricultural Public Good
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 mt-2 leading-relaxed">
              AgriN delivers real-time, localized agro-advisories powered by context-aware AI. It connects Doppler radar thunderstorm alerts with Copernicus Sentinel-2 satellite NDVI and in-situ soil chemistry telemetry.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
              Designed as a scalable digital public good enabling BRICS nations to share agricultural data models and strengthen multilateral cooperation on sustainable food production.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-emerald-200 text-xs text-emerald-900 font-medium">
            🌱 32,000L water saved per irrigation cycle and -58% synthetic chemical dependency achieved through regenerative agro-intelligence.
          </div>
        </div>
      </section>

      {/* 3. CORE ARCHITECTURAL PILLARS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Comprehensive Digital Public Good Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            How AgriN Powers Climate-Resilient Agriculture
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Eight interconnected modules working in harmony to protect crops and rejuvenate topsoil.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:border-emerald-400 transition-colors space-y-2.5">
            <div className="p-3 rounded-2xl bg-sky-100 text-sky-800 w-fit">
              <CloudSun className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">Thunderstorm Early Warning</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Automated Doppler squall detection engine identifies affected farm polygons and dispatches SMS alerts to hold chemical spraying.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:border-emerald-400 transition-colors space-y-2.5">
            <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-800 w-fit">
              <Satellite className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">Sentinel-2 Multi-Spectral</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              10-meter optical NDVI and NDWI vegetation canopy scoring with historical growth trajectory curves and cloud filtering.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:border-emerald-400 transition-colors space-y-2.5">
            <div className="p-3 rounded-2xl bg-teal-100 text-teal-800 w-fit">
              <BotMessageSquare className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">Contextual AgriN AI</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Multilingual generative AI advisor incorporating live root moisture, storm risk, and growth stages with voice input in 5 regional languages.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:border-emerald-400 transition-colors space-y-2.5">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 w-fit">
              <Sprout className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">Regenerative Farm Score</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Objective 0-100 rating based on Soil Organic Carbon (SOC), cover crops, water saving drip laterals, and bio-inoculants.
            </p>
          </div>
        </div>
      </section>

      {/* 4. THREE DISTINCT USER ROLES */}
      <section className="bg-stone-100 rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Tailored Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Three Specialized Role-Based Dashboards
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Designed for the entire agricultural ecosystem from smallholder fields to university laboratories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Farmer */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 w-fit mb-3">
                <Tractor className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-stone-900">Farmer Dashboard</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Hyper-local weather radar, thunderstorm SMS warnings, Sentinel-2 NDVI canopy scans, AI Crop Doctor screening, and APMC mandi market pricing.
              </p>
            </div>
            <button
              onClick={() => loginAsRole('farmer')}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors"
            >
              Open Farmer Portal →
            </button>
          </div>

          {/* Researcher */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-800 w-fit mb-3">
                <Microscope className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-stone-900">Researcher Dashboard</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Federated BRICS registry datasets (India, Brazil, Russia, China, South Africa), cross-country agronomy trends, and student observation validation.
              </p>
            </div>
            <button
              onClick={() => loginAsRole('researcher')}
              className="w-full py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs transition-colors"
            >
              Open Researcher Hub →
            </button>
          </div>

          {/* Student */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-800 w-fit mb-3">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-stone-900">B.Sc Agriculture Student</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Agro-pathology learning library, field diary observation submission to ICAR scientists, AI readiness quizzes, and BRICS academic exchange.
              </p>
            </div>
            <button
              onClick={() => loginAsRole('student')}
              className="w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition-colors"
            >
              Open Student Diary →
            </button>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Ready to experience the future of digital public agriculture?
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
          Log in with your mobile number to receive live thunderstorm advisories, satellite crop health reports, and regenerative soil recommendations.
        </p>
        <div className="pt-2">
          <button
            onClick={() => openAuthModal()}
            className="px-8 py-3.5 rounded-2xl bg-stone-950 hover:bg-stone-900 text-white font-bold text-sm shadow-xl transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Launch AgriN Public Good Network</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
