import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  Trash2,
  Check,
  Filter,
  AlertCircle,
  Bell
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { api } from '../../services/api.js';
import { FarmActivity, ActivityType } from '../../types/index.js';

export const CalendarModule: React.FC = () => {
  const { user, showToast } = useApp();
  const [activities, setActivities] = useState<FarmActivity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('All');

  // Form state
  const [title, setTitle] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('Irrigation');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [cropName, setCropName] = useState('Basmati Paddy');
  const [reminderSet, setReminderSet] = useState(true);

  const loadActivities = async () => {
    try {
      const res = await api.getCalendar(user?.farmId || 'farm-krishna-delta-01');
      if (res.success) setActivities(res.activities);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [user]);

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await api.addActivity({
        farmId: user?.farmId || 'farm-krishna-delta-01',
        userId: user?.id,
        title,
        activityType,
        description,
        dueDate,
        cropName,
        reminderSet
      });
      if (res.success) {
        showToast('Activity added to farm calendar!', 'success');
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
        loadActivities();
      }
    } catch (e) {
      showToast('Error saving activity', 'alert');
    }
  };

  const handleToggleComplete = async (act: FarmActivity) => {
    try {
      await api.updateActivity(act.id, { completed: !act.completed });
      setActivities(prev => prev.map(a => a.id === act.id ? { ...a, completed: !a.completed } : a));
      showToast(act.completed ? 'Activity marked pending' : 'Activity completed!', 'success');
    } catch (e) {
      showToast('Could not update activity', 'alert');
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      await api.deleteActivity(id);
      setActivities(prev => prev.filter(a => a.id !== id));
      showToast('Activity removed', 'info');
    } catch (e) {
      showToast('Delete error', 'alert');
    }
  };

  const filtered = activities.filter(a => {
    if (filterType === 'All') return true;
    if (filterType === 'Pending') return !a.completed;
    if (filterType === 'Completed') return a.completed;
    if (filterType === 'AI Suggested') return a.aiSuggested;
    return a.activityType === filterType;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-200 border border-white/20 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Smart Agricultural Calendar</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-stone-950 uppercase">
              AI OPTIMIZED
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Field Operations & Phenology Schedule
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
            AI-suggested schedule driven by plant growth stages, Doppler rain forecasts, and soil moisture telemetry.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Farm Activity</span>
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        {['All', 'Pending', 'Completed', 'AI Suggested', 'Irrigation', 'Fertilization', 'Pest scouting'].map(f => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterType === f
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ACTIVITIES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(act => (
          <div
            key={act.id}
            className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
              act.completed
                ? 'bg-stone-50 border-stone-200 opacity-75'
                : 'bg-white border-stone-200 hover:border-emerald-400 shadow-xs hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-extrabold text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                  {act.activityType}
                </span>
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{act.dueDate}</span>
                </span>
              </div>

              <h4 className={`font-bold text-sm text-stone-900 ${act.completed ? 'line-through text-stone-400' : ''}`}>
                {act.title}
              </h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {act.description}
              </p>

              {act.aiSuggested && (
                <div className="mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Auto-Recommended based on Storm Telemetry</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => handleToggleComplete(act)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  act.completed
                    ? 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{act.completed ? 'Mark Pending' : 'Mark Complete'}</span>
              </button>

              <button
                onClick={() => handleDeleteActivity(act.id)}
                className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE ACTIVITY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-stone-900">Add Field Operation Task</h3>

            <form onSubmit={handleCreateActivity} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Drip Pulse Irrigation #15"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Activity Type</label>
                  <select
                    value={activityType}
                    onChange={e => setActivityType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border text-xs bg-stone-50"
                  >
                    <option value="Irrigation">Irrigation</option>
                    <option value="Fertilization">Fertilization</option>
                    <option value="Pest scouting">Pest scouting</option>
                    <option value="Weeding">Weeding</option>
                    <option value="Sowing">Sowing</option>
                    <option value="Harvest">Harvest</option>
                    <option value="Soil testing">Soil testing</option>
                    <option value="Compost application">Compost application</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    required
                    className="w-full p-2 rounded-xl border text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description / Notes</label>
                <textarea
                  placeholder="Additional field parameters..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="reminder"
                  checked={reminderSet}
                  onChange={e => setReminderSet(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <label htmlFor="reminder" className="text-xs text-stone-700 font-medium">
                  Set automated SMS/push notification reminder
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
                >
                  Save to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
