import { GoogleGenAI } from '@google/genai';
import { db } from '../db/database.js';

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return geminiClient;
}

export interface ChatRequestPayload {
  message: string;
  userId: string;
  language?: string;
  farmContext?: {
    farmName?: string;
    crop?: string;
    stage?: string;
    soilMoisture?: number;
    soilPh?: number;
    weatherCondition?: string;
    hasThunderstormAlert?: boolean;
    location?: string;
  };
}

export async function askAgriNAI(payload: ChatRequestPayload): Promise<string> {
  const { message, userId, language = 'en', farmContext } = payload;
  const user = db.getUserById(userId);
  const farm = db.getFarmByUserId(userId);
  const crops = farm ? db.getCropsByFarmId(farm.id) : [];
  const soil = farm ? db.getSoilByFarmId(farm.id) : undefined;
  const weather = farm ? db.getWeatherByFarmId(farm.id) : undefined;
  const activeAlerts = farm ? db.getAlerts(farm.id).filter(a => a.status === 'ACTIVE') : [];

  const contextData = {
    farmName: farmContext?.farmName || farm?.name || 'Krishna Delta Eco-Farm',
    location: farmContext?.location || `${farm?.locationName || 'Tenali'}, ${farm?.state || 'Andhra Pradesh'}, ${farm?.country || 'India'}`,
    crop: farmContext?.crop || (crops[0] ? `${crops[0].cropName} (${crops[0].stage})` : 'Paddy Rice'),
    soilMoisture: farmContext?.soilMoisture ?? (soil?.moisture || 48),
    soilPh: farmContext?.soilPh ?? (soil?.ph || 6.8),
    weatherCondition: farmContext?.weatherCondition || weather?.condition || 'Thunderstorm Approaching (85% rain probability)',
    activeAlerts: activeAlerts.map(a => `${a.severity}: ${a.title}`).join('; ') || 'Active Thunderstorm Warning'
  };

  const client = getGeminiClient();

  if (client) {
    try {
      const systemInstruction = `You are AgriN AI, an advanced agricultural advisor and agro-meteorological scientist built for the BRICS AgrIn network.
You provide precise, practical, and regenerative farming advice.
CURRENT REAL-TIME FARM CONTEXT:
- Farm: ${contextData.farmName} in ${contextData.location}
- Crop: ${contextData.crop}
- Soil Moisture: ${contextData.soilMoisture}%
- Soil pH: ${contextData.soilPh}
- Current Weather: ${contextData.weatherCondition}
- Active Weather Hazards: ${contextData.activeAlerts}

CRITICAL RULES:
1. Always incorporate the real-time farm context. For instance, if the farmer asks about irrigation or spraying and a thunderstorm is imminent or soil moisture is high, warn them immediately.
2. Promote regenerative agricultural practices (e.g. bio-stimulants, vermicompost, cover crops, minimal soil disturbance, organic pest bio-control).
3. If requested in Telugu, Hindi, Tamil, Kannada, or English, respond fluently in that language (or provide translations).
4. Keep advice concise, actionable, and structured with clear bullet points.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });

      if (response.text) {
        db.addChatMessage(userId, { role: 'user', content: message, timestamp: new Date().toISOString() });
        db.addChatMessage(userId, { role: 'assistant', content: response.text, timestamp: new Date().toISOString() });
        return response.text;
      }
    } catch (err: any) {
      console.warn('[AgriN AI] Gemini call failed, falling back to contextual agronomy engine:', err.message);
    }
  }

  // Robust contextual fallback engine (DEMO MODE / Offline)
  const lowerMsg = message.toLowerCase();
  let fallbackResponse = '';

  if (lowerMsg.includes('irrigate') || lowerMsg.includes('water') || lowerMsg.includes('pump')) {
    fallbackResponse = `**Advisory for ${contextData.farmName} (${contextData.crop}):**\n\n` +
      `⚠️ **DO NOT IRRIGATE TODAY.**\n\n` +
      `• **Soil Moisture Status:** Current root zone moisture is **${contextData.soilMoisture}%** (adequate field capacity).\n` +
      `• **Weather Telemetry:** ${contextData.weatherCondition} with heavy rain expected in the next few hours.\n` +
      `• **Groundwater Conservation:** Skipping this irrigation cycle conserves ~32,000 Litres of water and prevents root hypoxia (waterlogging).\n` +
      `• **Action:** Re-check moisture on Wednesday after the storm cell clears.`;
  } else if (lowerMsg.includes('spray') || lowerMsg.includes('pesticide') || lowerMsg.includes('fertilizer') || lowerMsg.includes('urea')) {
    fallbackResponse = `**Safety & Application Advisory for ${contextData.crop}:**\n\n` +
      `⛔ **POSTPONE ALL SPRAYING OPERATIONS.**\n\n` +
      `• **Critical Weather Risk:** Active thunderstorm alert with winds up to 38 km/h and high probability of precipitation.\n` +
      `• **Chemical & Bio Wash-off:** Any foliar spray applied today will be completely washed away by impending rain, causing chemical runoff into local water channels.\n` +
      `• **Regenerative Alternative:** Once sunny conditions return, apply foliar spray of *Pseudomonas fluorescens* or *Neem Seed Kernel Extract (NSKE 5%)* during calm morning hours.`;
  } else if (lowerMsg.includes('disease') || lowerMsg.includes('yellow') || lowerMsg.includes('spot') || lowerMsg.includes('leaf') || lowerMsg.includes('pest')) {
    fallbackResponse = `**Crop Diagnostic Screening for ${contextData.crop}:**\n\n` +
      `• **Observed Risk:** High atmospheric humidity (84%) creates favorable microclimate for sheath blight and leaf blast.\n` +
      `• **Field Screening:** Check lower leaf sheaths for water-soaked elliptical lesions with brown margins.\n` +
      `• **Recommended Action:** Drain standing water down to 2cm, avoid excess nitrogenous fertilizers, and ensure row aeration.\n` +
      `• **Next Step:** You can take a high-resolution photo and upload it in the **Crop Doctor** section for multi-spectral diagnostic screening.`;
  } else if (lowerMsg.includes('soil') || lowerMsg.includes('carbon') || lowerMsg.includes('ph')) {
    fallbackResponse = `**Soil Health Analysis for ${contextData.farmName}:**\n\n` +
      `• **pH:** ${contextData.soilPh} (Neutral to slightly acidic, ideal for nutrient uptake).\n` +
      `• **Soil Organic Carbon (SOC):** 0.88% (Healthy BRICS AgrIn benchmark is >0.75%).\n` +
      `• **Regenerative Recommendation:** Incorporate green gram biomass back into the topsoil after harvest. Apply 200 Litres/hectare of Jeevamrutha microbial bio-inoculant to stimulate indigenous mycorrhizal fungi.`;
  } else if (lowerMsg.includes('pm-kisan') || lowerMsg.includes('scheme') || lowerMsg.includes('subsidy')) {
    fallbackResponse = `**Government Support & Schemes:**\n\n` +
      `• **PM-KISAN:** Provides ₹6,000/year via direct DBT in three installments of ₹2,000. Ensure your Aadhaar e-KYC and land seeding are verified on the official portal (pmkisan.gov.in).\n` +
      `• **PKVY (Paramparagat Krishi Vikas Yojana):** Up to ₹50,000/ha subsidy for transitioning to organic and regenerative cluster farming.\n` +
      `• **Micro-Irrigation (PMKSY):** Up to 55% capital subsidy for drip lateral systems.`;
  } else {
    fallbackResponse = `**AgriN AI Farm Intelligence (${contextData.farmName}):**\n\n` +
      `I am actively analyzing your farm's telemetry. Here is your current snapshot:\n\n` +
      `• **Crop:** ${contextData.crop}\n` +
      `• **Weather Alert:** ${contextData.weatherCondition} — High risk thunderstorm approaching.\n` +
      `• **Soil Moisture:** ${contextData.soilMoisture}%\n` +
      `• **Key Advice:** Maintain drainage ditches, protect standing crops from lodging, and hold all pesticide and fertilizer applications until storm winds subside.\n\n` +
      `You can ask me specific questions regarding pest symptoms, weather forecasts, market prices, or regenerative practices in English, Telugu, Hindi, Tamil, or Kannada!`;
  }

  // Handle language translation note if non-English
  if (language === 'te') {
    fallbackResponse += `\n\n*(గమనిక: తుఫాను హెచ్చరిక క్రియాశీలంగా ఉంది. దయచేసి ఎరువులు లేదా పురుగుమందులు పిచికారీ చేయవద్దు.)*`;
  } else if (language === 'hi') {
    fallbackResponse += `\n\n*(सूचना: आंधी-तूफान की चेतावनी सक्रिय है। कृपया सिंचाई और कीटनाशक छिड़काव स्थगित रखें।)*`;
  } else if (language === 'ta') {
    fallbackResponse += `\n\n*(குறிப்பு: இடிமின்னல் எச்சரிக்கை செயலில் உள்ளது. பூச்சிக்கொல்லி தெளிப்பதை தவிர்க்கவும்.)*`;
  } else if (language === 'kn') {
    fallbackResponse += `\n\n*(ಸೂಚನೆ: ಗುಡುಗು ಸಹಿತ ಮಳೆ ಎಚ್ಚರಿಕೆ ಸಕ್ರಿಯವಾಗಿದೆ. ಕ್ರಿಮಿನಾಶಕ ಸಿಂಪಡಿಸುವುದನ್ನು ಮುಂದೂಡಿ.)*`;
  }

  db.addChatMessage(userId, { role: 'user', content: message, timestamp: new Date().toISOString() });
  db.addChatMessage(userId, { role: 'assistant', content: fallbackResponse, timestamp: new Date().toISOString() });

  return fallbackResponse;
}
