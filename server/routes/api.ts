import { Router } from 'express';
import { db } from '../db/database.js';
import { sendSMS } from '../services/smsService.js';
import { getFarmWeather, triggerThunderstormAlertEngine } from '../services/weatherService.js';
import { askAgriNAI } from '../services/aiService.js';
import { diagnoseCropDisease } from '../services/cropDoctorService.js';
import { calculateRegenerativeScore } from '../services/regenerativeScoreService.js';
import { User, FarmActivity, StudentObservation, ResearchNote, RegistryDataset } from '../../src/types/index.js';

export const apiRouter = Router();

// ==========================================
// 1. AUTHENTICATION & ONBOARDING
// ==========================================

apiRouter.post('/auth/request-otp', async (req, res) => {
  try {
    const { phone, countryCode = '+91', name, email } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 8) {
      return res.status(400).json({ success: false, message: 'Invalid phone number format' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    db.createOrUpdateOtp(cleanPhone, otp, 180);

    const message = `[AgriN Verification] Your OTP for AgriN Agricultural Network login is ${otp}. Valid for 3 minutes. Do not share this code.`;
    const smsResult = await sendSMS(`${countryCode}${cleanPhone}`, message);

    const isDemo = process.env.DEMO_MODE !== 'false';

    return res.json({
      success: true,
      message: 'OTP sent successfully',
      phone: cleanPhone,
      isDemo,
      // For demo mode, return the OTP so users can test immediately in preview mode
      demoOtp: isDemo ? otp : undefined,
      smsStatus: smsResult.status
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.post('/auth/verify-otp', (req, res) => {
  try {
    const { phone, otp, name, email } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    const verification = db.verifyOtp(phone, otp);
    if (!verification.success) {
      return res.status(400).json(verification);
    }

    // Check if user already exists
    let user = db.getUserByPhone(phone);
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      user = {
        id: 'user-' + Date.now(),
        phone: cleanPhone,
        countryCode: '+91',
        name: name || 'Agricultural Member',
        email: email || `${cleanPhone}@agrin-brics.org`,
        role: 'farmer',
        language: 'en',
        farmId: 'farm-krishna-delta-01',
        createdAt: new Date().toISOString()
      };
      db.createUser(user);
    } else if (name || email) {
      user = db.updateUser(user.id, {
        name: name || user.name,
        email: email || user.email
      }) || user;
    }

    return res.json({
      success: true,
      message: 'Authentication successful',
      user,
      isNewUser,
      token: 'agrin-token-' + user.id + '-' + Date.now()
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.post('/auth/set-role', (req, res) => {
  try {
    const { userId, role, language, name, email, institution } = req.body;
    if (!userId || !role) {
      return res.status(400).json({ success: false, message: 'userId and role are required' });
    }

    const user = db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updated = db.updateUser(userId, {
      role,
      language: language || user.language,
      name: name || user.name,
      email: email || user.email,
      institution: institution || user.institution
    });

    return res.json({ success: true, user: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.get('/auth/me/:userId', (req, res) => {
  const user = db.getUserById(req.params.userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  return res.json({ success: true, user });
});

// ==========================================
// 2. DASHBOARDS
// ==========================================

apiRouter.get('/dashboard/:userId', async (req, res) => {
  try {
    const user = db.getUserById(req.params.userId) || db.getRawData().users[0];
    const farm = db.getFarmByUserId(user.id) || db.getFarms()[0];
    const crops = db.getCropsByFarmId(farm.id);
    const soil = db.getSoilByFarmId(farm.id);
    const weather = await getFarmWeather(farm.id);
    const alerts = db.getAlerts(farm.id).filter(a => a.status === 'ACTIVE');
    const activities = db.getActivities(farm.id);
    const diagnoses = db.getDiagnoses(farm.id);
    const satellite = db.getSatellite(farm.id);
    const market = db.getMarketPrices().slice(0, 4);
    const notifications = db.getNotifications(user.id);
    const regenerativeScore = calculateRegenerativeScore(farm.id);

    return res.json({
      success: true,
      user,
      farm,
      crops,
      soil,
      weather,
      alerts,
      activities: activities.slice(0, 5),
      recentDiagnoses: diagnoses.slice(0, 3),
      satellite,
      market,
      unreadNotificationCount: notifications.filter(n => !n.read).length,
      regenerativeScore,
      isDemoMode: process.env.DEMO_MODE !== 'false'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 3. WEATHER & THUNDERSTORM ALERTS
// ==========================================

apiRouter.get('/weather', async (req, res) => {
  try {
    const farmId = (req.query.farmId as string) || 'farm-krishna-delta-01';
    const weather = await getFarmWeather(farmId);
    return res.json({ success: true, weather, isDemo: process.env.DEMO_MODE !== 'false' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.get('/alerts', (req, res) => {
  const farmId = req.query.farmId as string;
  const alerts = db.getAlerts(farmId);
  return res.json({ success: true, alerts });
});

apiRouter.post('/alerts/trigger-thunderstorm', async (req, res) => {
  try {
    const farmId = req.body.farmId || 'farm-krishna-delta-01';
    const severity = req.body.severity || 'HIGH';
    const result = await triggerThunderstormAlertEngine(farmId, { severity });
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.post('/alerts/resolve/:id', (req, res) => {
  const success = db.resolveAlert(req.params.id);
  return res.json({ success });
});

// ==========================================
// 4. SMS ALERT SYSTEM & LOGS
// ==========================================

apiRouter.post('/sms/send', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;
    if (!phoneNumber || !message) {
      return res.status(400).json({ success: false, message: 'phoneNumber and message required' });
    }
    const result = await sendSMS(phoneNumber, message);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.get('/sms/logs', (req, res) => {
  const logs = db.getSmsLogs();
  return res.json({ success: true, logs });
});

// ==========================================
// 5. SATELLITE MONITORING
// ==========================================

apiRouter.get('/satellite/:farmId', (req, res) => {
  const satellite = db.getSatellite(req.params.farmId);
  return res.json({
    success: true,
    satellite,
    dataSource: satellite?.dataSource || 'Sentinel-2 Multispectral Instrument',
    isDemo: process.env.DEMO_MODE !== 'false'
  });
});

// ==========================================
// 6. CROP DOCTOR
// ==========================================

apiRouter.post('/crop-doctor', async (req, res) => {
  try {
    const { farmId = 'farm-krishna-delta-01', userId = 'user-farmer-01', cropName = 'Paddy Rice', symptoms, imageBase64 } = req.body;
    if (!symptoms && !imageBase64) {
      return res.status(400).json({ success: false, message: 'Please provide symptom description or an image' });
    }

    const diagnosis = await diagnoseCropDisease({
      farmId,
      userId,
      cropName,
      symptoms: symptoms || 'Visual symptoms observed in uploaded leaf photograph',
      imageBase64
    });

    return res.json({ success: true, diagnosis });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.get('/crop-doctor/history', (req, res) => {
  const farmId = req.query.farmId as string;
  const history = db.getDiagnoses(farmId);
  return res.json({ success: true, history });
});

// ==========================================
// 7. AI AGRICULTURE ASSISTANT
// ==========================================

apiRouter.post('/ai/chat', async (req, res) => {
  try {
    const { message, userId = 'user-farmer-01', language = 'en', farmContext } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const answer = await askAgriNAI({ message, userId, language, farmContext });
    return res.json({ success: true, reply: answer });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.get('/ai/history/:userId', (req, res) => {
  const history = db.getChatHistory(req.params.userId);
  return res.json({ success: true, history });
});

// ==========================================
// 8. FARMER CALENDAR
// ==========================================

apiRouter.get('/calendar/:farmId', (req, res) => {
  const activities = db.getActivities(req.params.farmId);
  return res.json({ success: true, activities });
});

apiRouter.post('/calendar', (req, res) => {
  try {
    const { farmId, userId, activityType, title, description, dueDate, cropName, reminderSet } = req.body;
    if (!farmId || !title || !dueDate) {
      return res.status(400).json({ success: false, message: 'farmId, title, and dueDate are required' });
    }

    const newActivity: FarmActivity = {
      id: 'act-' + Date.now(),
      farmId,
      userId: userId || 'user-farmer-01',
      activityType: activityType || 'Irrigation',
      title,
      description: description || '',
      dueDate,
      cropName: cropName || '',
      completed: false,
      aiSuggested: false,
      reminderSet: !!reminderSet
    };

    const saved = db.addActivity(newActivity);
    return res.json({ success: true, activity: saved });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.put('/calendar/:id', (req, res) => {
  const updated = db.updateActivity(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Activity not found' });
  }
  return res.json({ success: true, activity: updated });
});

apiRouter.delete('/calendar/:id', (req, res) => {
  const deleted = db.deleteActivity(req.params.id);
  return res.json({ success: deleted });
});

// ==========================================
// 9. SOIL HEALTH & REGENERATIVE SCORE
// ==========================================

apiRouter.get('/soil/:farmId', (req, res) => {
  const soil = db.getSoilByFarmId(req.params.farmId);
  return res.json({ success: true, soil });
});

apiRouter.post('/soil', (req, res) => {
  try {
    const updated = db.updateSoil(req.body);
    return res.json({ success: true, soil: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.get('/regenerative-score/:farmId', (req, res) => {
  const score = calculateRegenerativeScore(req.params.farmId);
  return res.json({ success: true, regenerativeScore: score });
});

// ==========================================
// 10. FEDERATED REGISTRY (BRICS COOPERATION)
// ==========================================

apiRouter.get('/registry', (req, res) => {
  const { country, crop, dataType, search } = req.query;
  let datasets = db.getDatasets();

  if (country) {
    datasets = datasets.filter(d => d.country.toLowerCase() === (country as string).toLowerCase());
  }
  if (crop) {
    datasets = datasets.filter(d => d.crop.toLowerCase().includes((crop as string).toLowerCase()));
  }
  if (dataType) {
    datasets = datasets.filter(d => d.dataType.toLowerCase() === (dataType as string).toLowerCase());
  }
  if (search) {
    const q = (search as string).toLowerCase();
    datasets = datasets.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q) ||
      d.dataSource.toLowerCase().includes(q)
    );
  }

  return res.json({
    success: true,
    datasets,
    totalCount: datasets.length,
    federatedNodes: ['India Node (ICAR)', 'Brazil Node (Embrapa)', 'Russia Node (VIR)', 'China Node (CAAS)', 'South Africa Node (ARC)']
  });
});

apiRouter.post('/registry', (req, res) => {
  try {
    const dataset: RegistryDataset = {
      id: 'brics-ds-' + Date.now(),
      title: req.body.title,
      country: req.body.country || 'India',
      region: req.body.region || 'National',
      crop: req.body.crop || 'Multi-Crop',
      dataType: req.body.dataType || 'Soil',
      description: req.body.description || '',
      recordCount: Number(req.body.recordCount) || 10000,
      sharingLevel: req.body.sharingLevel || 'Public (Open BRICS)',
      dataSource: req.body.dataSource || 'Agricultural Research Department',
      lastUpdated: new Date().toISOString().split('T')[0],
      modelArchitecture: req.body.modelArchitecture || 'Standard BRICS AgrIn Schema',
      format: req.body.format || 'Parquet / GeoTIFF',
      nodeEndpoint: req.body.nodeEndpoint || 'https://agrin-node.brics.int/v1'
    };
    const saved = db.addDataset(dataset);
    return res.json({ success: true, dataset: saved });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 11. RESEARCH HUB & STUDENT FIELD DIARY
// ==========================================

apiRouter.get('/research', (req, res) => {
  const notes = db.getResearchNotes();
  const studentObservations = db.getStudentObservations();
  return res.json({ success: true, notes, studentObservations });
});

apiRouter.post('/research/notes', (req, res) => {
  try {
    const note: ResearchNote = {
      id: 'res-note-' + Date.now(),
      authorId: req.body.authorId || 'user-researcher-01',
      authorName: req.body.authorName || 'Dr. Priya Sundaram',
      authorRole: req.body.authorRole || 'Agricultural Scientist',
      institution: req.body.institution || 'ICAR - IARI',
      title: req.body.title,
      abstract: req.body.abstract,
      country: req.body.country || 'India',
      crop: req.body.crop || 'Paddy Rice',
      content: req.body.content || '',
      status: 'Published',
      tags: req.body.tags || ['Regenerative Agriculture', 'BRICS AgrIn'],
      publishedAt: new Date().toISOString().split('T')[0],
      citations: 0
    };
    const saved = db.addResearchNote(note);
    return res.json({ success: true, note: saved });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.post('/research/student-observations', (req, res) => {
  try {
    const obs: StudentObservation = {
      id: 'obs-' + Date.now(),
      studentId: req.body.studentId || 'user-student-01',
      studentName: req.body.studentName || 'Student Observer',
      institution: req.body.institution || 'Agricultural University',
      farmLocation: req.body.farmLocation || 'Field Block 4',
      crop: req.body.crop || 'Paddy Rice',
      observationText: req.body.observationText,
      symptomsObserved: req.body.symptomsObserved || [],
      status: 'pending_review',
      submittedAt: new Date().toISOString()
    };
    const saved = db.addStudentObservation(obs);
    return res.json({ success: true, observation: saved });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.put('/research/student-observations/:id/verify', (req, res) => {
  const { verifiedBy, feedback, status = 'verified' } = req.body;
  const updated = db.updateStudentObservation(req.params.id, {
    status,
    verifiedBy: verifiedBy || 'Dr. Priya Sundaram (ICAR)',
    feedback: feedback || 'Observation verified and incorporated into regional pest scouting model.'
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Observation not found' });
  }
  return res.json({ success: true, observation: updated });
});

// ==========================================
// 12. MARKET PRICES
// ==========================================

apiRouter.get('/market', (req, res) => {
  const prices = db.getMarketPrices();
  return res.json({
    success: true,
    prices,
    isDemo: process.env.DEMO_MODE !== 'false',
    source: 'National Mandi E-NAM & APMC Telemetry'
  });
});

// ==========================================
// 13. PM-KISAN & GOVERNMENT SCHEMES
// ==========================================

apiRouter.get('/pm-kisan', (req, res) => {
  const schemes = db.getGovernmentSchemes();
  return res.json({
    success: true,
    schemes,
    officialPortal: 'https://pmkisan.gov.in',
    disclaimer: 'Official information direct from Ministry of Agriculture & Farmers Welfare, Government of India.'
  });
});

// ==========================================
// 14. NOTIFICATIONS
// ==========================================

apiRouter.get('/notifications/:userId', (req, res) => {
  const notifications = db.getNotifications(req.params.userId);
  return res.json({ success: true, notifications });
});

apiRouter.put('/notifications/:id/read', (req, res) => {
  const success = db.markNotificationAsRead(req.params.id);
  return res.json({ success });
});

// ==========================================
// 15. FARMS LIST
// ==========================================

apiRouter.get('/farms', (req, res) => {
  const farms = db.getFarms();
  return res.json({ success: true, farms });
});
