import { GoogleGenAI, Type } from '@google/genai';
import { db } from '../db/database.js';
import { CropDiagnosis } from '../../src/types/index.js';

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' }
      }
    });
  }
  return geminiClient;
}

export interface DiagnoseRequest {
  farmId: string;
  userId: string;
  cropName: string;
  symptoms: string;
  imageBase64?: string;
  mimeType?: string;
}

export async function diagnoseCropDisease(payload: DiagnoseRequest): Promise<CropDiagnosis> {
  const { farmId, userId, cropName, symptoms, imageBase64, mimeType = 'image/jpeg' } = payload;
  const client = getGeminiClient();

  if (client) {
    try {
      const prompt = `You are a plant pathologist and agro-diagnostic expert assisting a farmer.
Crop: ${cropName}
Symptoms reported by farmer: "${symptoms}"

Analyze the symptoms (and image if provided). Return a structured screening JSON.
IMPORTANT RULES:
- Never claim 100% certainty. State "Possible disease", "AI screening", and "Requires expert confirmation".
- Provide confidence between 65% and 92%.
- Offer regenerative and bio-control actions (e.g. neem oil, trichoderma, cultural practices) before synthetic chemicals.`;

      let parts: any[] = [];
      if (imageBase64) {
        // Strip data:image/...;base64, prefix if present
        const cleanBase64 = imageBase64.includes('base64,') ? imageBase64.split('base64,')[1] : imageBase64;
        parts.push({
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType
          }
        });
      }
      parts.push({ text: prompt });

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              possibleIssue: { type: Type.STRING },
              confidence: { type: Type.INTEGER },
              observedSymptoms: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              recommendedActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              prevention: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              contactAgronomist: { type: Type.BOOLEAN }
            },
            required: ['possibleIssue', 'confidence', 'observedSymptoms', 'recommendedActions', 'prevention', 'contactAgronomist']
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        const diagnosis: CropDiagnosis = {
          id: 'diag-' + Date.now(),
          farmId,
          userId,
          cropName,
          symptoms,
          imageUrl: imageBase64 ? 'stored_image' : undefined,
          possibleIssue: parsed.possibleIssue || 'Possible Leaf Spot or Blight',
          confidence: Math.min(95, Math.max(60, parsed.confidence || 78)),
          observedSymptoms: parsed.observedSymptoms || ['Chlorotic lesions', 'Marginal necrosis'],
          recommendedActions: parsed.recommendedActions || ['Inspect surrounding plants', 'Avoid overhead irrigation'],
          prevention: parsed.prevention || ['Crop rotation', 'Bio-fungicide seed treatment'],
          contactAgronomist: true,
          createdAt: new Date().toISOString(),
          isAiScreening: true
        };
        db.addDiagnosis(diagnosis);
        return diagnosis;
      }
    } catch (err: any) {
      console.warn('[Crop Doctor] Gemini API diagnosis failed, using deterministic pathology engine:', err.message);
    }
  }

  // Deterministic Agronomy Screening Engine (DEMO MODE & Fallback)
  const lower = symptoms.toLowerCase();
  let issue = 'Possible Leaf Spot (Cercospora / Alternaria)';
  let confidence = 78;
  let observed = [
    'Yellowish circular haloes around necrotic leaf margins',
    'Concentric rings on older foliage',
    'Reduced photosynthetic leaf surface'
  ];
  let actions = [
    'Inspect surrounding plants across a 5-meter radius to assess spread.',
    'Remove severely affected lower leaves and safely compost away from crop rows.',
    'Improve canopy airflow by clearing companion weed growth.',
    'Avoid overhead sprinkler irrigation; switch to targeted drip lines to keep foliage dry.',
    'Consult an agronomist before initiating any chemical treatment.'
  ];
  let prevention = [
    'Use certified disease-resistant seeds for next season.',
    'Practice 3-season crop rotation with leguminous pulse crops (e.g., Green Gram).',
    'Apply prophylactic bio-fungicide (Trichoderma harzianum @ 5g/kg seed).'
  ];

  if (lower.includes('yellow') && (lower.includes('curl') || lower.includes('mosaic') || lower.includes('crinkle'))) {
    issue = 'Possible Yellow Mosaic Virus (YMV) or Whitefly Vectoring';
    confidence = 82;
    observed = [
      'Irregular chlorotic yellow patches interspersed with green tissue',
      'Upward leaf cupping and reduced leaf lamina size',
      'Presence of tiny sucking pests on leaf undersides'
    ];
    actions = [
      'Install yellow sticky traps (15 per hectare) to monitor and trap whitefly vectors.',
      'Foliar spray with Neem Seed Kernel Extract (NSKE 5%) or Neem Oil (10,000 ppm @ 2ml/L).',
      'Rogue out and bury severely stunted plants to prevent secondary transmission.',
      'Consult an agronomist to confirm viral screening.'
    ];
    prevention = [
      'Grow barrier crops like maize or sorghum around field borders.',
      'Avoid continuous pulse-after-pulse monoculture.',
      'Use resistant varieties such as IPM 205-7 (Virat).'
    ];
  } else if (lower.includes('blast') || lower.includes('spindle') || lower.includes('lesion') || lower.includes('sheath')) {
    issue = 'Possible Rice Blast / Sheath Blight (Pyricularia / Rhizoctonia)';
    confidence = 85;
    observed = [
      'Spindle-shaped lesions with grayish centers and brown borders',
      'Collar rot and water-soaked elliptical spots near waterline',
      'Microclimate humidity > 80% favoring mycelial spread'
    ];
    actions = [
      'Drain standing floodwater to reduce humidity around the plant base.',
      'Apply bio-fungicide (Pseudomonas fluorescens @ 2.5kg/ha dissolved in water).',
      'Hold back all supplemental urea/nitrogen applications until new leaves emerge clean.',
      'Seek physical inspection by local Krishi Vigyan Kendra (KVK) agronomist.'
    ];
    prevention = [
      'Treat seeds with Trichoderma viride @ 4g/kg seed.',
      'Adopt wider transplanting spacing for enhanced solar penetration.'
    ];
  } else if (lower.includes('wilt') || lower.includes('droop') || lower.includes('dry')) {
    issue = 'Possible Fusarium Wilt or Root Rot Complex';
    confidence = 74;
    observed = [
      'Midday flaccidity and yellowing progressing from lower to upper leaves',
      'Vascular discoloration (browning) when lower stem is sliced lengthwise',
      'Compacted subsoil restricting root respiration'
    ];
    actions = [
      'Drench infected root zones with bio-agent solution (Trichoderma viride in cow dung slurry).',
      'Aerate wet soil by shallow hoeing along furrow lines.',
      'Mark affected patch and isolate irrigation drainage to prevent spore dissemination.'
    ];
    prevention = [
      'Incorporate green manure crops like Sesbania or Sunn Hemp.',
      'Apply well-decomposed FYM (Farm Yard Manure) enriched with mycorrhizae.'
    ];
  }

  const diagnosis: CropDiagnosis = {
    id: 'diag-' + Date.now(),
    farmId,
    userId,
    cropName,
    symptoms,
    imageUrl: imageBase64 ? 'stored_image' : undefined,
    possibleIssue: issue,
    confidence,
    observedSymptoms: observed,
    recommendedActions: actions,
    prevention,
    contactAgronomist: true,
    createdAt: new Date().toISOString(),
    isAiScreening: true
  };

  db.addDiagnosis(diagnosis);
  return diagnosis;
}
