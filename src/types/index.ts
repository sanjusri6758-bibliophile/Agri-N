export type UserRole = 'farmer' | 'researcher' | 'student';

export type LanguageCode = 'en' | 'te' | 'hi' | 'ta' | 'kn';

export interface User {
  id: string;
  phone: string;
  countryCode: string;
  name: string;
  email: string;
  role: UserRole;
  language: LanguageCode;
  farmId?: string;
  institution?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Farm {
  id: string;
  userId: string;
  name: string;
  locationName: string;
  district: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  areaHectares: number;
  soilType: string;
  irrigationType: string;
  establishedYear: number;
}

export interface FarmCrop {
  id: string;
  farmId: string;
  cropName: string;
  variety: string;
  sowingDate: string;
  stage: string;
  expectedHarvest: string;
  healthScore: number;
  activeAreaHectares: number;
}

export interface SoilRecord {
  id: string;
  farmId: string;
  ph: number;
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  organicCarbon: number; // %
  moisture: number; // %
  soilTemperature: number; // °C
  soilHealthScore: number; // 0-100
  recommendations: string[];
  recordedAt: string;
}

export interface WeatherDayForecast {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: string;
  rainProb: number;
  thunderstormProb: number;
  windSpeed: number;
}

export interface WeatherRecord {
  id: string;
  farmId: string;
  temperature: number;
  humidity: number;
  rainfall: number; // mm in last 24h
  windSpeed: number; // km/h
  condition: string;
  uvIndex: number;
  rainProb: number;
  thunderstormProb: number;
  recordedAt: string;
  forecast: WeatherDayForecast[];
}

export interface WeatherAlert {
  id: string;
  farmId: string;
  alertType: 'thunderstorm' | 'heatwave' | 'heavy_rainfall' | 'pest_risk' | 'frost';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  actions: string[];
  isThunderstorm: boolean;
  issuedAt: string;
  status: 'ACTIVE' | 'RESOLVED';
  smsSent: boolean;
  smsRecipient?: string;
}

export type NotificationType =
  | 'weather'
  | 'thunderstorm'
  | 'crop_disease'
  | 'irrigation'
  | 'calendar'
  | 'research'
  | 'government_scheme'
  | 'market';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: NotificationType;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export type ActivityType =
  | 'Sowing'
  | 'Irrigation'
  | 'Fertilization'
  | 'Pest scouting'
  | 'Weeding'
  | 'Harvest'
  | 'Soil testing'
  | 'Crop rotation'
  | 'Compost application';

export interface FarmActivity {
  id: string;
  farmId: string;
  userId: string;
  activityType: ActivityType;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  aiSuggested: boolean;
  reminderSet: boolean;
  cropName?: string;
}

export interface CropDiagnosis {
  id: string;
  farmId: string;
  userId: string;
  cropName: string;
  symptoms: string;
  imageUrl?: string;
  possibleIssue: string;
  confidence: number;
  observedSymptoms: string[];
  recommendedActions: string[];
  prevention: string[];
  contactAgronomist: boolean;
  createdAt: string;
  isAiScreening: boolean;
}

export interface SatelliteObservation {
  id: string;
  farmId: string;
  ndvi: number; // Normalized Difference Vegetation Index: -1 to 1 (usually 0.2 to 0.9 for crops)
  ndwi: number; // Normalized Difference Water Index
  vegetationHealth: string; // e.g. "Healthy vegetation"
  waterStress: string; // "Low Stress" | "Moderate Stress" | "Severe Stress"
  cropStress: string;
  growthTrend: string; // "Accelerating" | "Steady" | "Slowing"
  cloudCoverage: number; // %
  dataSource: string; // "Sentinel-2 L2A (10m ESA Copernicus) via BRICS AgrIn Node"
  sensorName?: string; // "ISRO Bhuvan LISS-IV" | "Sentinel-2 MSI" | "ISRO EOS-04 SAR"
  resolutionMeters?: number; // 5.8m or 10m
  agencyName?: string; // "ISRO / NRSC" or "BRICS AgrIn Global Sentinel"
  bhuvanTileId?: string;
  observedDate: string;
  historicalData: {
    date: string;
    ndvi: number;
    ndwi: number;
    moisture: number;
  }[];
}

export type BRICSCountry = 'India' | 'Brazil' | 'Russia' | 'China' | 'South Africa';

export interface RegistryDataset {
  id: string;
  title: string;
  country: BRICSCountry;
  region: string;
  crop: string;
  dataType:
    | 'Soil'
    | 'Weather'
    | 'Crop health'
    | 'Satellite'
    | 'Yield'
    | 'Disease'
    | 'Market'
    | 'Climate'
    | 'Regenerative agriculture';
  description: string;
  recordCount: number;
  sharingLevel: 'Public (Open BRICS)' | 'Federated Research' | 'Restricted Intergovernmental';
  dataSource: string;
  lastUpdated: string;
  modelArchitecture: string;
  format: string;
  downloadUrl?: string;
  nodeEndpoint: string;
  sourcePortal?: 'data.gov.in' | 'ISRO/Bhuvan' | 'IMD' | 'FAO' | 'WHO' | 'BRICS Node' | 'Other';
  officialLicense?: string;
}

export interface ResearchNote {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  institution: string;
  title: string;
  abstract: string;
  country: BRICSCountry;
  crop: string;
  content: string;
  status: 'Published' | 'Peer Review' | 'Draft';
  tags: string[];
  publishedAt: string;
  citations: number;
}

export interface StudentObservation {
  id: string;
  studentId: string;
  studentName: string;
  institution: string;
  farmLocation: string;
  crop: string;
  observationText: string;
  symptomsObserved: string[];
  imageUrl?: string;
  status: 'pending_review' | 'verified' | 'flagged';
  verifiedBy?: string;
  feedback?: string;
  submittedAt: string;
}

export interface MarketPrice {
  id: string;
  crop: string;
  marketName: string;
  state: string;
  country: string;
  currentPrice: number; // e.g. INR / Quintal
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  priceTrend: 'UP' | 'DOWN' | 'STABLE';
  changePercent: number;
  unit: string;
  updatedAt: string;
  sourcePortal?: string;
  history: { date: string; price: number }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  context?: {
    farmName?: string;
    crop?: string;
    soilMoisture?: number;
    weather?: string;
  };
}

export interface GovernmentScheme {
  id: string;
  schemeName: string;
  shortName: string;
  category: string;
  country: string;
  description: string;
  eligibility: string[];
  benefits: string;
  documentsRequired: string[];
  officialUrl: string;
  isLive: boolean;
  statusText: string;
}

export interface RegenerativeFarmScore {
  overallScore: number; // 0 - 100
  ratingText: string;
  soilOrganicCarbon: {
    value: number; // %
    score: number;
    target: number;
    status: 'Optimal' | 'Good' | 'Needs Improvement';
  };
  cropDiversity: {
    score: number;
    rotationsPerCycle: number;
    companionCrops: number;
  };
  waterEfficiency: {
    score: number;
    savingPercentage: number;
    dripCoverage: number;
  };
  soilCover: {
    score: number;
    mulchCoverage: number;
    tillageType: string;
  };
  biologicalInputs: {
    score: number;
    organicMatterPerHa: number; // tons
    bioFertilizerPercent: number;
  };
  chemicalReduction: {
    score: number;
    reductionVsConventional: number; // %
  };
  strengths: string[];
  opportunities: string[];
}
