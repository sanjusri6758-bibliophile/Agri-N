import {
  User,
  Farm,
  FarmCrop,
  SoilRecord,
  WeatherRecord,
  WeatherAlert,
  AppNotification,
  FarmActivity,
  CropDiagnosis,
  SatelliteObservation,
  RegistryDataset,
  ResearchNote,
  StudentObservation,
  MarketPrice,
  GovernmentScheme,
  RegenerativeFarmScore
} from '../types/index.js';

const API_BASE = '/api';

export const api = {
  // Auth
  requestOtp: async (phone: string, countryCode = '+91', name?: string, email?: string) => {
    const res = await fetch(`${API_BASE}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, countryCode, name, email })
    });
    return res.json();
  },

  verifyOtp: async (phone: string, otp: string, name?: string, email?: string) => {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, name, email })
    });
    return res.json();
  },

  setRole: async (payload: { userId: string; role: string; language?: string; name?: string; email?: string; institution?: string }) => {
    const res = await fetch(`${API_BASE}/auth/set-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  getUser: async (userId: string) => {
    const res = await fetch(`${API_BASE}/auth/me/${userId}`);
    return res.json();
  },

  // Dashboard
  getDashboard: async (userId: string) => {
    const res = await fetch(`${API_BASE}/dashboard/${userId}`);
    return res.json();
  },

  // Weather & Alerts
  getWeather: async (farmId?: string) => {
    const url = farmId ? `${API_BASE}/weather?farmId=${farmId}` : `${API_BASE}/weather`;
    const res = await fetch(url);
    return res.json();
  },

  getAlerts: async (farmId?: string) => {
    const url = farmId ? `${API_BASE}/alerts?farmId=${farmId}` : `${API_BASE}/alerts`;
    const res = await fetch(url);
    return res.json();
  },

  triggerThunderstormAlert: async (farmId: string, severity = 'HIGH') => {
    const res = await fetch(`${API_BASE}/alerts/trigger-thunderstorm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ farmId, severity })
    });
    return res.json();
  },

  resolveAlert: async (alertId: string) => {
    const res = await fetch(`${API_BASE}/alerts/resolve/${alertId}`, {
      method: 'POST'
    });
    return res.json();
  },

  // SMS
  sendSms: async (phoneNumber: string, message: string) => {
    const res = await fetch(`${API_BASE}/sms/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, message })
    });
    return res.json();
  },

  getSmsLogs: async () => {
    const res = await fetch(`${API_BASE}/sms/logs`);
    return res.json();
  },

  // Satellite
  getSatellite: async (farmId: string) => {
    const res = await fetch(`${API_BASE}/satellite/${farmId}`);
    return res.json();
  },

  // Crop Doctor
  diagnoseCrop: async (payload: { farmId: string; userId: string; cropName: string; symptoms?: string; imageBase64?: string }) => {
    const res = await fetch(`${API_BASE}/crop-doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  getCropDiagnoses: async (farmId?: string) => {
    const url = farmId ? `${API_BASE}/crop-doctor/history?farmId=${farmId}` : `${API_BASE}/crop-doctor/history`;
    const res = await fetch(url);
    return res.json();
  },

  // AI Assistant
  askAI: async (payload: { message: string; userId: string; language?: string; farmContext?: any }) => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  getChatHistory: async (userId: string) => {
    const res = await fetch(`${API_BASE}/ai/history/${userId}`);
    return res.json();
  },

  // Calendar
  getCalendar: async (farmId: string) => {
    const res = await fetch(`${API_BASE}/calendar/${farmId}`);
    return res.json();
  },

  addActivity: async (activity: Partial<FarmActivity>) => {
    const res = await fetch(`${API_BASE}/calendar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity)
    });
    return res.json();
  },

  updateActivity: async (id: string, updates: Partial<FarmActivity>) => {
    const res = await fetch(`${API_BASE}/calendar/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  deleteActivity: async (id: string) => {
    const res = await fetch(`${API_BASE}/calendar/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Soil & Regenerative
  getSoil: async (farmId: string) => {
    const res = await fetch(`${API_BASE}/soil/${farmId}`);
    return res.json();
  },

  getRegenerativeScore: async (farmId: string) => {
    const res = await fetch(`${API_BASE}/regenerative-score/${farmId}`);
    return res.json();
  },

  // Registry
  getRegistryDatasets: async (params?: { country?: string; crop?: string; dataType?: string; search?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/registry?${q}`);
    return res.json();
  },

  addRegistryDataset: async (dataset: Partial<RegistryDataset>) => {
    const res = await fetch(`${API_BASE}/registry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataset)
    });
    return res.json();
  },

  // Research
  getResearch: async () => {
    const res = await fetch(`${API_BASE}/research`);
    return res.json();
  },

  addResearchNote: async (note: Partial<ResearchNote>) => {
    const res = await fetch(`${API_BASE}/research/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    });
    return res.json();
  },

  addStudentObservation: async (obs: Partial<StudentObservation>) => {
    const res = await fetch(`${API_BASE}/research/student-observations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obs)
    });
    return res.json();
  },

  verifyStudentObservation: async (id: string, feedback: string, verifiedBy: string) => {
    const res = await fetch(`${API_BASE}/research/student-observations/${id}/verify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback, verifiedBy })
    });
    return res.json();
  },

  // Market & Schemes
  getMarketPrices: async () => {
    const res = await fetch(`${API_BASE}/market`);
    return res.json();
  },

  getGovernmentSchemes: async () => {
    const res = await fetch(`${API_BASE}/pm-kisan`);
    return res.json();
  },

  // Notifications
  getNotifications: async (userId: string) => {
    const res = await fetch(`${API_BASE}/notifications/${userId}`);
    return res.json();
  },

  markNotificationRead: async (notifId: string) => {
    const res = await fetch(`${API_BASE}/notifications/${notifId}/read`, {
      method: 'PUT'
    });
    return res.json();
  }
};
