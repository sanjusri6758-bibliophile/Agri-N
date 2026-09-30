import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  Award,
  Layers,
  Search,
  ExternalLink,
  Plus,
  Stethoscope,
  FlaskConical,
  Satellite
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { api } from '../../services/api.js';
import { StudentObservation } from '../../types/index.js';

export const StudentDashboard: React.FC = () => {
  const { user, showToast } = useApp();
  const [observations, setObservations] = useState<StudentObservation[]>([]);
  const [activeTab, setActiveSection] = useState<'diary' | 'library' | 'quiz' | 'internships'>('diary');

  // Observation form
  const [farmLocation, setFarmLocation] = useState('Angalakuduru Field Block, Tenali');
  const [crop, setCrop] = useState('Basmati Paddy (PB 1509)');
  const [observationText, setObservationText] = useState('');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quiz state
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  const loadObservations = async () => {
    try {
      const res = await api.getResearch();
      if (res.success) {
        setObservations(res.studentObservations);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadObservations();
  }, []);

  const handleSubmitObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!observationText.trim()) return;

    setIsSubmitting(true);
    try {
      const symptoms = symptomsInput.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.addStudentObservation({
        studentId: user?.id,
        studentName: user?.name || 'Aarav Sharma',
        institution: user?.institution || 'Acharya N.G. Ranga Agricultural University',
        farmLocation,
        crop,
        observationText,
        symptomsObserved: symptoms.length > 0 ? symptoms : ['Leaf Chlorosis', 'Canopy Inspection']
      });

      if (res.success) {
        showToast('Field observation submitted for researcher validation!', 'success');
        setObservationText('');
        setSymptomsInput('');
        loadObservations();
      }
    } catch (err: any) {
      showToast('Submission error', 'alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quizQuestions = [
    {
      q: 'Which satellite spectral index is most sensitive to leaf chlorophyll and canopy biomass?',
      options: ['NDVI (Normalized Difference Vegetation Index)', 'NDWI (Water Index)', 'SAVI without soil adjustment', 'Thermal infrared band'],
      correct: 0,
      explanation: 'NDVI utilizes the Red (chlorophyll absorption) and Near-Infrared (canopy scattering) wavelengths.'
    },
    {
      q: 'Why should pesticide spraying be immediately cancelled when thunderstorm probability exceeds 70%?',
      options: ['Pesticides lose color in rain', 'Foliar wash-off causes chemical runoff into water bodies & wasted input costs', 'Storms eliminate all pests permanently', 'Humidity prevents evaporation'],
      correct: 1,
      explanation: 'Rain wash-off causes environmental contamination and zero agrochemical absorption.'
    },
    {
      q: 'What is the benchmark Soil Organic Carbon (SOC) percentage for healthy tropical alluvial soils under BRICS AgrIn standards?',
      options: ['< 0.25%', '> 0.75%', 'Exactly 5.0%', '0.10%'],
      correct: 1,
      explanation: 'SOC above 0.75% provides adequate microbial activity and cation exchange capacity in tropical agricultural soils.'
    }
  ];

  const handleSelectQuizAnswer = (qIdx: number, optIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCalculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) score++;
    });
    setQuizScore(score);
    showToast(`Quiz completed! You scored ${score}/${quizQuestions.length}`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-amber-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>B.Sc (Hons) Agriculture Student Portal</span>
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/10 text-amber-100 border border-white/20">
              BRICS ACADEMIC NETWORK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Agricultural Learning & Field Diary
          </h1>
          <p className="text-sm text-amber-100/90 mt-1 leading-relaxed">
            Welcome, <strong>{user?.name || 'Aarav Sharma'}</strong> ({user?.institution || 'ANGRAU'}). Submit real farm observations to national researchers, explore the agronomy knowledge base, and prepare for agro-scientist certifications.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveSection('diary')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'diary' ? 'bg-amber-700 text-white shadow-xs' : 'bg-white text-stone-600 hover:bg-stone-100 border'
          }`}
        >
          Field Observation Diary
        </button>
        <button
          onClick={() => setActiveSection('library')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'library' ? 'bg-amber-700 text-white shadow-xs' : 'bg-white text-stone-600 hover:bg-stone-100 border'
          }`}
        >
          Knowledge Library & Pathology
        </button>
        <button
          onClick={() => setActiveSection('quiz')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'quiz' ? 'bg-amber-700 text-white shadow-xs' : 'bg-white text-stone-600 hover:bg-stone-100 border'
          }`}
        >
          AI Agronomy Tutor & Quizzes
        </button>
        <button
          onClick={() => setActiveSection('internships')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'internships' ? 'bg-amber-700 text-white shadow-xs' : 'bg-white text-stone-600 hover:bg-stone-100 border'
          }`}
        >
          BRICS Research Internships
        </button>
      </div>

      {/* 1. FIELD DIARY SECTION */}
      {activeTab === 'diary' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submit Observation Form */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <h3 className="font-bold text-base text-stone-900 mb-1 flex items-center gap-2">
              <Send className="w-4 h-4 text-amber-600" />
              <span>Submit Farm Observation</span>
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Your field notes are routed to ICAR and university researchers for validation.
            </p>

            <form onSubmit={handleSubmitObservation} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Farm / Block Location</label>
                <input
                  type="text"
                  value={farmLocation}
                  onChange={e => setFarmLocation(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Crop & Variety</label>
                <input
                  type="text"
                  value={crop}
                  onChange={e => setCrop(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Field Observation Notes</label>
                <textarea
                  placeholder="Record crop vigor, pest incidence, soil moisture, or nutrient deficiency symptoms observed..."
                  value={observationText}
                  onChange={e => setObservationText(e.target.value)}
                  required
                  rows={4}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Symptoms / Keywords (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Zinc deficiency, Marginal Chlorosis, Sheath Rot"
                  value={symptomsInput}
                  onChange={e => setSymptomsInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-amber-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting to Registry...' : 'Submit Observation for Review'}
              </button>
            </form>
          </div>

          {/* Observation History & Researcher Feedback */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-stone-900 mb-1">
                Student Field Diary & Researcher Validation
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                Observations verified by ICAR researchers become training ground truth.
              </p>

              <div className="space-y-3">
                {observations.map(obs => (
                  <div key={obs.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900">{obs.crop}</span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        obs.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {obs.status === 'verified' ? '✓ Verified by Researcher' : '⏳ Under Review'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed italic">
                      "{obs.observationText}"
                    </p>
                    <div className="text-[10px] text-stone-400">
                      📍 {obs.farmLocation} • {new Date(obs.submittedAt).toLocaleDateString()}
                    </div>

                    {obs.feedback && (
                      <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                        <span className="font-bold block text-[11px] text-emerald-800">
                          Verified by {obs.verifiedBy}:
                        </span>
                        <p className="text-[11px] mt-0.5">{obs.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. KNOWLEDGE LIBRARY SECTION */}
      {activeTab === 'library' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
            <div className="p-3 rounded-2xl bg-teal-100 text-teal-800 w-fit">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">Crop Pathology Reference</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Learn early visual diagnostic screening for Sheath Blight, Blast, Yellow Mosaic Virus, and Fall Armyworm with non-chemical bio-controls.
            </p>
            <ul className="text-xs text-stone-500 list-disc pl-4 space-y-1">
              <li>Rhizoctonia solani sclerotia lifecycle</li>
              <li>Trichoderma viride prophylactic seed coating</li>
              <li>Push-pull intercropping with Napier grass</li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-800 w-fit">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">Soil Organic Carbon Dynamics</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Understand carbon-to-nitrogen (C:N) ratios, mycorrhizal colonization, and how minimal tillage sequesters stable humus in oxisols and inceptisols.
            </p>
            <ul className="text-xs text-stone-500 list-disc pl-4 space-y-1">
              <li>Humic vs Fulvic acid decomposition fractions</li>
              <li>Biochar pyrolyzed at 450°C and porosity</li>
              <li>Jeevamrutha microbial colony counts (CFU/mL)</li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
            <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-800 w-fit">
              <Satellite className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">Satellite Remote Sensing</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Sentinel-2 multispectral MSI bands: B4 (Red 665nm) and B8 (NIR 842nm). Interpret NDVI curves to distinguish drought from nitrogen deficiency.
            </p>
            <ul className="text-xs text-stone-500 list-disc pl-4 space-y-1">
              <li>NDWI water stress index formulas</li>
              <li>Cloud masking and atmospheric correction</li>
              <li>10-meter pixel parcel boundary matching</li>
            </ul>
          </div>
        </div>
      )}

      {/* 3. AI TUTOR & QUIZ SECTION */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs max-w-3xl mx-auto space-y-6">
          <div>
            <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <span>AgriN Agro-Science Readiness Quiz</span>
            </h3>
            <p className="text-xs text-stone-500">
              Test your agronomic problem-solving skills across remote sensing, climate-resilient water management, and soil health.
            </p>
          </div>

          <div className="space-y-6">
            {quizQuestions.map((q, qIdx) => (
              <div key={qIdx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <span className="font-bold text-xs text-stone-900 block">
                  Question {qIdx + 1}: {q.q}
                </span>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswers[qIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectQuizAnswer(qIdx, optIdx)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors border flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-100/70 border-amber-500 font-semibold text-amber-950'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <span className="font-bold text-amber-700">●</span>}
                      </button>
                    );
                  })}
                </div>

                {quizScore !== null && (
                  <div className={`p-2.5 rounded-xl text-xs ${
                    userAnswers[qIdx] === q.correct
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    <strong>{userAnswers[qIdx] === q.correct ? '✓ Correct!' : '✗ Incorrect:'}</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-200">
            {quizScore !== null ? (
              <span className="text-sm font-bold text-amber-900">
                Final Score: {quizScore} / {quizQuestions.length} ({Math.round((quizScore / quizQuestions.length) * 100)}%)
              </span>
            ) : <span />}

            <button
              onClick={handleCalculateScore}
              disabled={Object.keys(userAnswers).length < quizQuestions.length}
              className="py-2.5 px-6 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50"
            >
              Submit Quiz Answers
            </button>
          </div>
        </div>
      )}

      {/* 4. INTERNSHIPS & RESEARCH CALLS */}
      {activeTab === 'internships' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              ICAR - IARI New Delhi
            </span>
            <h4 className="font-bold text-sm text-stone-900">Junior Research Fellow: Smallholder Satellite Phenology</h4>
            <p className="text-xs text-stone-600">
              6-month fellowship analyzing Sentinel-2 high resolution optical indices across Krishna and Godavari delta rice plots.
            </p>
            <div className="text-[11px] font-semibold text-emerald-700 pt-2 flex items-center gap-1 cursor-pointer hover:underline">
              <span>View Requirements & Apply via BRICS Academic Node</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
              Embrapa Soja (Brazil Exchange)
            </span>
            <h4 className="font-bold text-sm text-stone-900">Virtual Fellow: Tropical Oxisol Regenerative Carbon Modeling</h4>
            <p className="text-xs text-stone-600">
              Collaborative student research project linking Indian pulse rotation datasets with Brazilian zero-tillage field trials.
            </p>
            <div className="text-[11px] font-semibold text-indigo-700 pt-2 flex items-center gap-1 cursor-pointer hover:underline">
              <span>View BRICS AgrIn Student Exchange Portal</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
