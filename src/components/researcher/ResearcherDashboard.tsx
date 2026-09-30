import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Network,
  Share2,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
  Sparkles,
  BarChart3,
  Layers,
  Globe2,
  FileText,
  UserCheck,
  Plus
} from 'lucide-react';
import {
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
import { RegistryDataset, ResearchNote, StudentObservation } from '../../types/index.js';

export const ResearcherDashboard: React.FC = () => {
  const { user, showToast } = useApp();
  const [datasets, setDatasets] = useState<RegistryDataset[]>([]);
  const [researchNotes, setResearchNotes] = useState<ResearchNote[]>([]);
  const [studentObservations, setStudentObservations] = useState<StudentObservation[]>([]);
  const [countryFilter, setCountryFilter] = useState<string>('All');
  const [dataTypeFilter, setDataTypeFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPublishingNote, setIsPublishingNote] = useState<boolean>(false);
  const [newNoteTitle, setNewNoteTitle] = useState<string>('');
  const [newNoteAbstract, setNewNoteAbstract] = useState<string>('');
  const [newNoteCountry, setNewNoteCountry] = useState<string>('India');
  const [validatingObsId, setValidatingObsId] = useState<string | null>(null);
  const [validationFeedback, setValidationFeedback] = useState<string>('');

  const loadData = async () => {
    try {
      const [registryRes, researchRes] = await Promise.all([
        api.getRegistryDatasets(),
        api.getResearch()
      ]);
      if (registryRes.success) setDatasets(registryRes.datasets);
      if (researchRes.success) {
        setResearchNotes(researchRes.notes);
        setStudentObservations(researchRes.studentObservations);
      }
    } catch (e) {
      console.warn('Could not load researcher data:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleValidateObservation = async (obsId: string) => {
    try {
      await api.verifyStudentObservation(
        obsId,
        validationFeedback || 'Verified by lead agronomist. Data incorporated into regional pest scouting baseline.',
        user?.name || 'Dr. Priya Sundaram (ICAR)'
      );
      showToast('Student observation verified and added to research registry!', 'success');
      setValidatingObsId(null);
      setValidationFeedback('');
      loadData();
    } catch (err: any) {
      showToast('Validation failed', 'alert');
    }
  };

  const handlePublishNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    try {
      await api.addResearchNote({
        authorId: user?.id,
        authorName: user?.name || 'Dr. Priya Sundaram',
        authorRole: 'Agricultural Scientist',
        institution: user?.institution || 'ICAR - IARI',
        title: newNoteTitle,
        abstract: newNoteAbstract,
        country: newNoteCountry as any,
        crop: 'Multi-crop Systems',
        content: newNoteAbstract,
        tags: ['BRICS AgrIn', 'Soil Organic Carbon', 'Digital Public Good']
      });
      showToast('Research note published to BRICS federated registry!', 'success');
      setIsPublishingNote(false);
      setNewNoteTitle('');
      setNewNoteAbstract('');
      loadData();
    } catch (e) {
      showToast('Failed to publish note', 'alert');
    }
  };

  const filteredDatasets = datasets.filter(ds => {
    const matchesCountry = countryFilter === 'All' || ds.country === countryFilter;
    const matchesType = dataTypeFilter === 'All' || ds.dataType === dataTypeFilter;
    const matchesSearch = !searchQuery ||
      ds.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.crop.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesType && matchesSearch;
  });

  // Cross-country agricultural metrics for comparative graph
  const comparativeData = [
    { country: 'India', socMean: 0.82, waterEff: 68, yieldIndex: 112 },
    { country: 'Brazil', socMean: 1.15, waterEff: 82, yieldIndex: 128 },
    { country: 'Russia', socMean: 1.45, waterEff: 74, yieldIndex: 104 },
    { country: 'China', socMean: 1.05, waterEff: 88, yieldIndex: 132 },
    { country: 'South Africa', socMean: 0.65, waterEff: 71, yieldIndex: 98 }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Researcher Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-stone-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5" />
              <span>BRICS AgrIn Federated Research Node</span>
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              FEDERATION-READY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Agricultural Researcher Workspace
          </h1>
          <p className="text-sm text-stone-300 mt-1 leading-relaxed">
            Welcome, <strong>{user?.name || 'Dr. Priya Sundaram'}</strong> ({user?.institution || 'ICAR - IARI'}). Share cross-border data models, monitor multi-country climate telemetry, and peer-review student field observations.
          </p>
        </div>
      </div>

      {/* Cross-Country Soil & Yield Comparative Chart */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>Cross-BRICS Agro-Telemetry Benchmarking</span>
            </h3>
            <p className="text-xs text-stone-500">
              Comparative analysis of mean Soil Organic Carbon (SOC %), Water Efficiency (%), and Relative Yield Index across federated partner nodes.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-stone-400 bg-stone-50 px-2.5 py-1 rounded-lg border">
            Node Frequency: Daily Federated Batch
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparativeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="country" tick={{ fontSize: 11, fontWeight: 600 }} stroke="#78716c" />
              <YAxis tick={{ fontSize: 11 }} stroke="#78716c" />
              <Tooltip contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="socMean" name="Soil Organic Carbon (Mean %)" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="waterEff" name="Water Efficiency Rating (%)" fill="#0284c7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="yieldIndex" name="Relative Yield Index" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-Column Grid: Student Observation Review + Published Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. STUDENT FIELD OBSERVATION VALIDATION QUEUE */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Student Field Observation Validation</h3>
                  <p className="text-[11px] text-stone-500">Student → Researcher Knowledge Loop</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                {studentObservations.filter(o => o.status === 'pending_review').length} Pending Review
              </span>
            </div>

            <div className="space-y-3">
              {studentObservations.map(obs => (
                <div key={obs.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900">{obs.studentName} ({obs.crop})</span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      obs.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {obs.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed italic">
                    "{obs.observationText}"
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {obs.symptomsObserved.map((sym, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-white border text-stone-700">
                        {sym}
                      </span>
                    ))}
                  </div>

                  {obs.status === 'verified' ? (
                    <div className="pt-2 border-t border-stone-200 text-[11px] text-emerald-800 font-medium">
                      <strong>Agronomist Feedback:</strong> {obs.feedback}
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-stone-200">
                      {validatingObsId === obs.id ? (
                        <div className="space-y-2">
                          <textarea
                            placeholder="Add scientific diagnosis feedback or advisory recommendations..."
                            value={validationFeedback}
                            onChange={e => setValidationFeedback(e.target.value)}
                            rows={2}
                            className="w-full p-2 text-xs rounded-xl border border-stone-300 focus:outline-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setValidatingObsId(null)}
                              className="px-2.5 py-1 text-xs text-stone-500"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleValidateObservation(obs.id)}
                              className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-bold"
                            >
                              Approve & Publish Feedback
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setValidatingObsId(obs.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          Review & Validate Observation
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. PUBLISH & BROWSE RESEARCH NOTES */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Peer-Reviewed Research Notes</h3>
                  <p className="text-[11px] text-stone-500">Cross-Border Open Agricultural Papers</p>
                </div>
              </div>
              <button
                onClick={() => setIsPublishingNote(!isPublishingNote)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-700 text-white text-xs font-bold hover:bg-indigo-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish Note</span>
              </button>
            </div>

            {isPublishingNote && (
              <form onSubmit={handlePublishNote} className="mb-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
                <input
                  type="text"
                  placeholder="Research Title (e.g. Cross-Border Sentinel-2 Calibration)"
                  value={newNoteTitle}
                  onChange={e => setNewNoteTitle(e.target.value)}
                  required
                  className="w-full p-2.5 text-xs rounded-xl border border-stone-300 bg-white"
                />
                <textarea
                  placeholder="Abstract & key agronomic findings..."
                  value={newNoteAbstract}
                  onChange={e => setNewNoteAbstract(e.target.value)}
                  required
                  rows={3}
                  className="w-full p-2.5 text-xs rounded-xl border border-stone-300 bg-white"
                />
                <div className="flex items-center justify-between">
                  <select
                    value={newNoteCountry}
                    onChange={e => setNewNoteCountry(e.target.value)}
                    className="text-xs p-2 rounded-xl border bg-white"
                  >
                    <option value="India">India</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Russia">Russia</option>
                    <option value="China">China</option>
                    <option value="South Africa">South Africa</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPublishingNote(false)}
                      className="px-3 py-1.5 text-xs text-stone-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-indigo-700 text-white font-bold text-xs"
                    >
                      Publish
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {researchNotes.map(note => (
                <div key={note.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900">{note.title}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      {note.country}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-2">{note.abstract}</p>
                  <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                    <span>{note.authorName} • {note.institution}</span>
                    <span className="font-semibold text-indigo-700">{note.citations} citations</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 3. FEDERATED DATASETS EXPLORER */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <Network className="w-5 h-5 text-emerald-600" />
              <span>Federated Agricultural Datasets (BRICS AgrIn Nodes)</span>
            </h3>
            <p className="text-xs text-stone-500">
              Interoperable schemas shared across India (ICAR), Brazil (Embrapa), Russia (VIR), China (CAAS), and South Africa (ARC).
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {filteredDatasets.length} Datasets Available
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <div className="flex items-center bg-stone-50 rounded-xl px-3 py-2 border border-stone-200 text-xs flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-stone-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search datasets, crops, or algorithms..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent focus:outline-none w-full"
            />
          </div>

          <select
            value={countryFilter}
            onChange={e => setCountryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none"
          >
            <option value="All">All BRICS Countries</option>
            <option value="India">India</option>
            <option value="Brazil">Brazil</option>
            <option value="Russia">Russia</option>
            <option value="China">China</option>
            <option value="South Africa">South Africa</option>
          </select>

          <select
            value={dataTypeFilter}
            onChange={e => setDataTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none"
          >
            <option value="All">All Data Types</option>
            <option value="Soil">Soil</option>
            <option value="Crop health">Crop health</option>
            <option value="Climate">Climate</option>
            <option value="Regenerative agriculture">Regenerative agriculture</option>
          </select>
        </div>

        {/* Dataset Table / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredDatasets.map(ds => (
            <div key={ds.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-400 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {ds.country} Node
                  </span>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    {ds.dataType}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-stone-900 leading-snug">{ds.title}</h4>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2">{ds.description}</p>

                <div className="mt-3 pt-2 border-t border-stone-200 text-[11px] space-y-1 text-stone-500">
                  <div><strong>Crop & Region:</strong> {ds.crop} • {ds.region}</div>
                  <div><strong>Records:</strong> {ds.recordCount.toLocaleString()} observations</div>
                  <div className="truncate"><strong>Model:</strong> {ds.modelArchitecture}</div>
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-stone-400 truncate max-w-[200px]">
                  {ds.format}
                </span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1 hover:underline cursor-pointer">
                  <span>Explore Federated API</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
