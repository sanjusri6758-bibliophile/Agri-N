import React, { useState, useEffect } from 'react';
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  Droplets,
  Layers,
  Sparkles,
  ArrowUpRight,
  Leaf,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { api } from '../../services/api.js';
import { RegenerativeFarmScore } from '../../types/index.js';

export const RegenerativeScoreModule: React.FC = () => {
  const { user } = useApp();
  const [scoreData, setScoreData] = useState<RegenerativeFarmScore | null>(null);

  useEffect(() => {
    api.getRegenerativeScore(user?.farmId || 'farm-krishna-delta-01').then(res => {
      if (res.success) setScoreData(res.regenerativeScore);
    });
  }, [user]);

  if (!scoreData) return null;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5" />
              <span>Regenerative Agriculture Standard (BRICS AgrIn Framework)</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Regenerative Farm Score: {scoreData.overallScore} / 100
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
            Rating: <strong className="text-emerald-400">{scoreData.ratingText}</strong>. Evaluates in-situ soil biology, water conservation, botanical diversity, and reduced synthetic dependency.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
          <span className="text-[11px] text-stone-300 block font-semibold uppercase">Overall Resilience</span>
          <span className="text-4xl font-black text-amber-400">{scoreData.overallScore}</span>
          <span className="text-[11px] text-emerald-300 block font-bold mt-0.5">Top 12% in Krishna Delta</span>
        </div>
      </div>

      {/* 6 SUB-DIMENSION PROGRESS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Soil Organic Carbon */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900">1. Soil Organic Carbon (SOC)</span>
            <span className="text-xs font-black text-emerald-700">{scoreData.soilOrganicCarbon.score}/100</span>
          </div>
          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${scoreData.soilOrganicCarbon.score}%` }} />
          </div>
          <p className="text-xs text-stone-600">
            Current SOC: <strong>{scoreData.soilOrganicCarbon.value}%</strong> (Target: &gt;1.0%). Contributes heavily to microbial biodiversity and soil moisture retention.
          </p>
        </div>

        {/* 2. Crop Diversity & Rotation */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900">2. Crop Diversity & Rotation</span>
            <span className="text-xs font-black text-emerald-700">{scoreData.cropDiversity.score}/100</span>
          </div>
          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 rounded-full" style={{ width: `${scoreData.cropDiversity.score}%` }} />
          </div>
          <p className="text-xs text-stone-600">
            {scoreData.cropDiversity.rotationsPerCycle} seasonal crop rotations with companion legumes (Green Gram) interrupting pest cycles and fixing nitrogen.
          </p>
        </div>

        {/* 3. Water Use Efficiency */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900">3. Water Efficiency & Micro-Drip</span>
            <span className="text-xs font-black text-sky-700">{scoreData.waterEfficiency.score}/100</span>
          </div>
          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-sky-600 rounded-full" style={{ width: `${scoreData.waterEfficiency.score}%` }} />
          </div>
          <p className="text-xs text-stone-600">
            <strong>{scoreData.waterEfficiency.savingPercentage}% water savings</strong> achieved using sub-surface drip lateral automation over conventional flood basins.
          </p>
        </div>

        {/* 4. Soil Cover & Residues */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900">4. Ground Cover & Minimal Till</span>
            <span className="text-xs font-black text-amber-700">{scoreData.soilCover.score}/100</span>
          </div>
          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-600 rounded-full" style={{ width: `${scoreData.soilCover.score}%` }} />
          </div>
          <p className="text-xs text-stone-600">
            {scoreData.soilCover.mulchCoverage}% surface mulch coverage shields soil from solar baking and reduces evaporation.
          </p>
        </div>

        {/* 5. Biological Inputs */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900">5. Fermented Bio-Inoculants</span>
            <span className="text-xs font-black text-emerald-700">{scoreData.biologicalInputs.score}/100</span>
          </div>
          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${scoreData.biologicalInputs.score}%` }} />
          </div>
          <p className="text-xs text-stone-600">
            Application of Jeevamrutha and compost provides {scoreData.biologicalInputs.organicMatterPerHa} tons/ha organic matter, revitalizing indigenous earthworms.
          </p>
        </div>

        {/* 6. Chemical Reduction */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900">6. Chemical Dependency Reduction</span>
            <span className="text-xs font-black text-emerald-700">{scoreData.chemicalReduction.score}/100</span>
          </div>
          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 rounded-full" style={{ width: `${scoreData.chemicalReduction.score}%` }} />
          </div>
          <p className="text-xs text-stone-600">
            <strong>{scoreData.chemicalReduction.reductionVsConventional}% reduction</strong> in synthetic fertilizers and toxic class-II pesticides compared to district mean.
          </p>
        </div>
      </div>

      {/* STRENGTHS & OPPORTUNITIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
          <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>What is Driving Your Score Up</span>
          </h3>
          <ul className="space-y-2">
            {scoreData.strengths.map((str, idx) => (
              <li key={idx} className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-stone-800 leading-relaxed font-medium">
                {str}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
          <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <span>Opportunities to Reach 90+ Score</span>
          </h3>
          <ul className="space-y-2">
            {scoreData.opportunities.map((opp, idx) => (
              <li key={idx} className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs text-stone-800 leading-relaxed font-medium">
                {opp}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
