import { db } from '../db/database.js';
import { WeatherAlert, WeatherRecord, AppNotification } from '../../src/types/index.js';
import { sendSMS } from './smsService.js';

export async function getFarmWeather(farmId: string): Promise<WeatherRecord> {
  const existing = db.getWeatherByFarmId(farmId);
  if (existing) {
    return existing;
  }

  // Fallback default weather
  return {
    id: `weather-${farmId}`,
    farmId,
    temperature: 28.5,
    humidity: 78,
    rainfall: 12.0,
    windSpeed: 22,
    condition: 'Partly Cloudy',
    uvIndex: 5,
    rainProb: 60,
    thunderstormProb: 45,
    recordedAt: new Date().toISOString(),
    forecast: [
      { day: 'Today', date: '28 Sep', tempMax: 31, tempMin: 24, condition: 'Thunderstorm', icon: 'cloud-lightning', rainProb: 85, thunderstormProb: 80, windSpeed: 38 },
      { day: 'Tomorrow', date: '29 Sep', tempMax: 30, tempMin: 23, condition: 'Rain', icon: 'cloud-rain', rainProb: 70, thunderstormProb: 35, windSpeed: 22 },
      { day: 'Wed', date: '30 Sep', tempMax: 32, tempMin: 24, condition: 'Partly Cloudy', icon: 'cloud-sun', rainProb: 30, thunderstormProb: 15, windSpeed: 14 }
    ]
  };
}

export async function triggerThunderstormAlertEngine(
  farmId: string,
  options?: { severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; customTitle?: string }
): Promise<{ alert: WeatherAlert; notification: AppNotification; smsResult: any }> {
  const farm = db.getFarms().find(f => f.id === farmId) || db.getFarms()[0];
  const user = db.getUserById(farm.userId) || db.getRawData().users[0];

  const severity = options?.severity || 'HIGH';
  const alertId = `alert-${farmId}-${Date.now()}`;

  const recommendedActions = [
    'AVOID spraying all pesticides and liquid fertilizers immediately (run-off risk & worker safety).',
    'Power off and unplug electric drip pump sets and submersibles to avoid lightning surge damage.',
    'Secure tarpaulins, loose farm shade structures, and nursery plastic tunnels.',
    'Clear drainage furrows and ditch gates to channel flash deluge away from vulnerable seedling beds.',
    'Move field laborers and draft animals inside sturdy shelter.'
  ];

  const alert: WeatherAlert = {
    id: alertId,
    farmId,
    alertType: 'thunderstorm',
    severity,
    title: options?.customTitle || `⚡ THUNDERSTORM ALERT: Severe Squall Detected over ${farm.name}`,
    description: `High-resolution Doppler radar and AgriN weather telemetry indicate severe convective storm cell moving across ${farm.locationName} with lightning risk, wind gusts up to 48 km/h, and 25-35mm rain expected.`,
    actions: recommendedActions,
    isThunderstorm: true,
    issuedAt: new Date().toISOString(),
    status: 'ACTIVE',
    smsSent: false,
    smsRecipient: `${user.countryCode} ${user.phone}`
  };

  db.addAlert(alert);

  // In-app Notification
  const notification: AppNotification = {
    id: `notif-${Date.now()}`,
    userId: user.id,
    title: `⚡ CRITICAL: Thunderstorm Alert for ${farm.name}`,
    message: `Thunderstorm detected near your farm. Avoid pesticide spraying. Turn off electric motors and check drainage.`,
    severity,
    type: 'thunderstorm',
    timestamp: new Date().toISOString(),
    read: false,
    actionUrl: '/weather'
  };
  db.addNotification(notification);

  // Send SMS
  const smsMessage = `[AgriN ALERT] Severe Thunderstorm detected near ${farm.name}. Do NOT spray pesticides. Power down electric irrigation motors. Check field drainage immediately.`;
  const smsResult = await sendSMS(`${user.countryCode}${user.phone}`, smsMessage);

  if (smsResult.success) {
    alert.smsSent = true;
    db.commit();
  }

  return { alert, notification, smsResult };
}
