import React, { useState, useEffect } from 'react';
import {
  Building2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Info,
  Layers
} from 'lucide-react';
import { api } from '../../services/api.js';
import { GovernmentScheme } from '../../types/index.js';

export const GovernmentSchemesModule: React.FC = () => {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);

  useEffect(() => {
    api.getGovernmentSchemes().then(res => {
      if (res.success) setSchemes(res.schemes);
    });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-200 border border-white/20 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Government Direct Benefit Transfers & Welfare</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            PM-KISAN & Agricultural Support Schemes
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
            Official government programs for income support, organic farming transitions, and micro-irrigation subsidies. Always links directly to the official Government of India portal.
          </p>
        </div>

        <a
          href="https://pmkisan.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <span>Official PM-KISAN Portal</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Official disclaimer banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong>Official Transparency Notice:</strong> AgriN does not invent or simulate live beneficiary DBT payouts. All changing government beneficiary information, e-KYC status, and installment disbursement details must be verified directly through the official Government of India portal (<a href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer" className="font-bold underline text-amber-950">pmkisan.gov.in</a>).
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {schemes.map(scheme => (
          <div
            key={scheme.id}
            className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:border-emerald-300 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {scheme.category}
                </span>
                <span className="text-[10px] font-bold text-stone-400 uppercase">
                  {scheme.country}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-stone-900 leading-snug">
                {scheme.schemeName}
              </h3>

              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {scheme.description}
              </p>

              {/* Benefits */}
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950">
                <strong className="block text-[11px] uppercase tracking-wider text-emerald-800 mb-1">
                  Financial Benefit & Coverage:
                </strong>
                {scheme.benefits}
              </div>

              {/* Eligibility */}
              <div className="mt-4 space-y-1.5">
                <strong className="text-xs font-bold text-stone-800 block uppercase tracking-wider">
                  Key Eligibility Criteria:
                </strong>
                {scheme.eligibility.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-stone-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Mandatory Documents */}
              <div className="mt-4 space-y-1 text-xs text-stone-500">
                <strong className="font-bold text-stone-700 block">Required Verification Documents:</strong>
                <ul className="list-disc pl-4 space-y-0.5">
                  {scheme.documentsRequired.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100">
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Visit Official Government Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
