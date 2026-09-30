import React, { useState, useRef } from 'react';
import {
  Stethoscope,
  Camera,
  Upload,
  Mic,
  MicOff,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  HelpCircle,
  PhoneCall,
  Info,
  Leaf
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { api } from '../../services/api.js';
import { CropDiagnosis } from '../../types/index.js';

export const CropDoctorModule: React.FC = () => {
  const { user, t, language, showToast } = useApp();
  const [cropName, setCropName] = useState('Basmati Paddy');
  const [symptoms, setSymptoms] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<CropDiagnosis | null>(null);
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Web Speech API Voice Input
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Web Speech API is not supported in this browser. Please type symptoms.', 'alert');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langMap: Record<string, string> = {
        en: 'en-IN',
        te: 'te-IN',
        hi: 'hi-IN',
        ta: 'ta-IN',
        kn: 'kn-IN'
      };
      recognition.lang = langMap[language] || 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Listening... Speak your crop symptoms now', 'info');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSymptoms(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
        showToast('Voice input captured!', 'success');
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      console.warn(err);
      setIsListening(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image file size must be under 10MB', 'alert');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRunScreening = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() && !imagePreview) {
      showToast('Please provide symptom details or upload a crop photo', 'alert');
      return;
    }

    setIsDiagnosing(true);
    try {
      const res = await api.diagnoseCrop({
        farmId: user?.farmId || 'farm-krishna-delta-01',
        userId: user?.id || 'user-farmer-01',
        cropName,
        symptoms,
        imageBase64: imagePreview || undefined
      });

      if (res.success) {
        setDiagnosis(res.diagnosis);
        showToast('AI Crop screening completed successfully', 'success');
      } else {
        showToast('Screening failed: ' + res.message, 'alert');
      }
    } catch (err: any) {
      showToast('Diagnostic error: ' + err.message, 'alert');
    } finally {
      setIsDiagnosing(false);
    }
  };

  const presetSymptoms = [
    { label: 'Leaf Spot / Brown Margins', text: 'Leaves are turning yellow with brown spots and concentric rings.' },
    { label: 'Yellow Mosaic / Cupping', text: 'Upper leaves show bright yellow mosaic patches and upward curling.' },
    { label: 'Stem Sheath Water-soaked', text: 'Lower leaf sheaths show oval water-soaked lesions near water line.' },
    { label: 'Midday Plant Wilting', text: 'Plants wilt and droop during hot hours despite adequate soil moisture.' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-teal-200 border border-white/20 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Plant Pathology & Disease Diagnostic Screening</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-stone-950 uppercase">
              AI FIELD SCREENING
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AgriN AI Crop Doctor
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-2xl leading-relaxed">
            Multi-spectral image analysis and voice-guided symptom diagnostic engine. Emphasizes organic, biological, and cultural disease management before chemical inputs.
          </p>
        </div>

        {/* Responsible AI Disclaimer badge */}
        <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs text-amber-200 max-w-sm flex items-start gap-2">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-300" />
          <span>
            <strong>Screening Disclaimer:</strong> AgriN AI provides field screening and early triage. It does not replace on-site physical confirmation by a certified agronomist.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* INPUT FORM: Photo & Symptoms */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
          <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-teal-600" />
            <span>Examine Crop Symptoms</span>
          </h3>

          <form onSubmit={handleRunScreening} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Target Crop</label>
              <select
                value={cropName}
                onChange={e => setCropName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="Basmati Paddy">Paddy Rice (Basmati / Common)</option>
                <option value="Green Gram">Green Gram (Moong Mung)</option>
                <option value="Red Chilli">Red Chilli (Guntur Sannam)</option>
                <option value="Cotton">Cotton (Medium / Long Staple)</option>
                <option value="Maize">Maize (Yellow / Sweet Corn)</option>
                <option value="Soybean">Soybean (Cerrado / Indian)</option>
                <option value="Wheat">Wheat (Sharbati / Durum)</option>
              </select>
            </div>

            {/* Photo upload / preview */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Upload or Take Leaf Photo (Optional)
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-stone-300 max-h-48 group">
                  <img src={imagePreview} alt="Leaf Preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 px-2.5 py-1 bg-black/70 hover:bg-black text-white text-xs font-bold rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center hover:border-teal-500 hover:bg-teal-50/30 transition-colors cursor-pointer"
                >
                  <Upload className="w-8 h-8 mx-auto text-stone-400 mb-2" />
                  <span className="text-xs font-bold text-stone-700 block">Click to upload photo or take picture</span>
                  <span className="text-[11px] text-stone-400">Supports JPG, PNG up to 10MB</span>
                </div>
              )}
            </div>

            {/* Symptom Description & Voice Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700">Describe Symptoms</label>
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-colors ${
                    isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListening ? 'Listening...' : 'Voice Input (Telugu / Hindi / En)'}</span>
                </button>
              </div>

              <textarea
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="e.g. Lower leaves show yellowing with small brown spots along the margins..."
                rows={3}
                className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                Quick Test Symptom Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {presetSymptoms.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSymptoms(p.text)}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isDiagnosing}
              className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isDiagnosing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Scanning Pathology Models...</span>
                </>
              ) : (
                <>
                  <Stethoscope className="w-4 h-4" />
                  <span>Run AI Disease Screening</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RESULTS CARD */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Diagnostic Screening Result</span>
              </h3>
              {diagnosis && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  AI Screening Verified
                </span>
              )}
            </div>

            {diagnosis ? (
              <div className="space-y-4">
                {/* Result banner */}
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                      Possible Disease Identified
                    </span>
                    <span className="font-mono font-extrabold text-sm text-teal-900">
                      {diagnosis.confidence}% Confidence
                    </span>
                  </div>
                  <h4 className="text-lg font-extrabold text-stone-900">
                    {diagnosis.possibleIssue}
                  </h4>
                  <p className="text-xs text-stone-600">
                    Target Crop: <strong>{diagnosis.cropName}</strong>
                  </p>
                </div>

                {/* Observed Symptoms */}
                <div>
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-1.5">
                    Observed Diagnostic Indicators:
                  </span>
                  <ul className="space-y-1">
                    {diagnosis.observedSymptoms.map((sym, idx) => (
                      <li key={idx} className="text-xs text-stone-700 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Actions */}
                <div>
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-1.5">
                    Recommended Non-Chemical & Bio-Control Actions:
                  </span>
                  <ul className="space-y-1.5">
                    {diagnosis.recommendedActions.map((act, idx) => (
                      <li key={idx} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Long term prevention */}
                <div>
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-1.5">
                    Soil Health & Long-Term Prevention:
                  </span>
                  <ul className="space-y-1">
                    {diagnosis.prevention.map((prev, idx) => (
                      <li key={idx} className="text-xs text-stone-600 flex items-start gap-2">
                        <Leaf className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                        <span>{prev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-72 flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <Stethoscope className="w-12 h-12 text-stone-300 mb-3" />
                <p className="text-sm font-semibold text-stone-600">No active diagnosis yet</p>
                <p className="text-xs text-stone-400 mt-1 max-w-xs">
                  Upload a photo of affected crop foliage or type your observations and click "Run AI Disease Screening".
                </p>
              </div>
            )}
          </div>

          {/* Expert Confirmation Disclaimer & Standards */}
          <div className="mt-5 space-y-2">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <PhoneCall className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>When to contact an agronomist:</strong> If lesions spread to upper leaves or yield-bearing panicles within 48 hours, contact your local KVK or extension officer immediately before chemical intervention.
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[10px] text-stone-500 flex items-center justify-between">
              <span>Standards: <strong>WHO/FAO Codex Alimentarius MRLs</strong> & <strong>ICAR IPM</strong></span>
              <span className="font-semibold text-teal-700">Gemini 3.8 Flash Powered</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
