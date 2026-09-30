import fs from 'fs';
import path from 'path';
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
} from '../../src/types/index.js';

interface OtpVerification {
  id: string;
  phone: string;
  otp: string;
  expiresAt: number;
  verified: boolean;
  attempts: number;
}

interface DatabaseSchema {
  users: User[];
  farms: Farm[];
  farm_crops: FarmCrop[];
  soil_records: SoilRecord[];
  weather_records: WeatherRecord[];
  weather_alerts: WeatherAlert[];
  notifications: AppNotification[];
  otp_verifications: OtpVerification[];
  farm_activities: FarmActivity[];
  crop_diagnoses: CropDiagnosis[];
  satellite_observations: SatelliteObservation[];
  registry_datasets: RegistryDataset[];
  research_notes: ResearchNote[];
  student_observations: StudentObservation[];
  market_prices: MarketPrice[];
  ai_conversations: Record<string, { role: string; content: string; timestamp: string }[]>;
  government_schemes: GovernmentScheme[];
  sms_logs: { id: string; phone: string; message: string; timestamp: string; isDemo: boolean; status: string }[];
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.resolve(DATA_DIR, 'agrin_db.json');

function getInitialData(): DatabaseSchema {
  const defaultFarmId = 'farm-krishna-delta-01';
  const farmerUserId = 'user-farmer-01';
  const researcherUserId = 'user-researcher-01';
  const studentUserId = 'user-student-01';

  return {
    users: [
      {
        id: farmerUserId,
        phone: '9876543210',
        countryCode: '+91',
        name: 'Ramesh Patel',
        email: 'ramesh.patel@agrin-brics.org',
        role: 'farmer',
        language: 'en',
        farmId: defaultFarmId,
        createdAt: new Date().toISOString()
      },
      {
        id: researcherUserId,
        phone: '9123456789',
        countryCode: '+91',
        name: 'Dr. Priya Sundaram',
        email: 'priya.sundaram@icar.gov.in',
        role: 'researcher',
        language: 'en',
        institution: 'ICAR - Indian Agricultural Research Institute, New Delhi',
        createdAt: new Date().toISOString()
      },
      {
        id: studentUserId,
        phone: '9988776655',
        countryCode: '+91',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@angrau.edu.in',
        role: 'student',
        language: 'en',
        institution: 'B.Sc (Hons) Agriculture, Acharya N.G. Ranga Agricultural University',
        createdAt: new Date().toISOString()
      }
    ],

    farms: [
      {
        id: defaultFarmId,
        userId: farmerUserId,
        name: 'Krishna Delta Eco-Farm',
        locationName: 'Tenali, Guntur District',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        country: 'India',
        latitude: 16.2437,
        longitude: 80.6400,
        areaHectares: 3.8,
        soilType: 'Alluvial Clay Loam',
        irrigationType: 'Sub-surface Drip & Canal Conjunctive',
        establishedYear: 2014
      }
    ],

    farm_crops: [
      {
        id: 'crop-rice-01',
        farmId: defaultFarmId,
        cropName: 'Basmati Paddy (PB 1509)',
        variety: 'Pusa Basmati 1509 (Climate Resilient)',
        sowingDate: '2026-07-15',
        stage: 'Panicle Initiation (Day 58)',
        expectedHarvest: '2026-10-25',
        healthScore: 88,
        activeAreaHectares: 2.5
      },
      {
        id: 'crop-pulse-02',
        farmId: defaultFarmId,
        cropName: 'Green Gram (Moong Mung)',
        variety: 'IPM 205-7 (Virat - Biofortified)',
        sowingDate: '2026-08-01',
        stage: 'Vegetative & Nitrogen Fixation',
        expectedHarvest: '2026-10-10',
        healthScore: 92,
        activeAreaHectares: 1.3
      }
    ],

    soil_records: [
      {
        id: 'soil-krishna-01',
        farmId: defaultFarmId,
        ph: 6.8,
        nitrogen: 245,
        phosphorus: 28,
        potassium: 310,
        organicCarbon: 0.88,
        moisture: 48,
        soilTemperature: 26.4,
        soilHealthScore: 82,
        recommendations: [
          'Organic Carbon is at 0.88% (Healthy tier: >0.75%). Continue mulching with paddy straw residues.',
          'Nitrogen is in medium-low range. Apply Azospirillum bio-inoculants or Jeevamrutha foliar spray.',
          'Phosphorus bioavailability is optimal at pH 6.8. Avoid synthetic superphosphate.',
          'Subsoil moisture is adequate (48%). Hold planned irrigation due to imminent thunderstorm.'
        ],
        recordedAt: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ],

    weather_records: [
      {
        id: 'weather-krishna-01',
        farmId: defaultFarmId,
        temperature: 29.5,
        humidity: 84,
        rainfall: 18.4,
        windSpeed: 38,
        condition: 'Thunderstorm Approaching',
        uvIndex: 4,
        rainProb: 90,
        thunderstormProb: 85,
        recordedAt: new Date().toISOString(),
        forecast: [
          { day: 'Today', date: '28 Sep', tempMax: 31, tempMin: 24, condition: 'Thunderstorm', icon: 'cloud-lightning', rainProb: 90, thunderstormProb: 85, windSpeed: 42 },
          { day: 'Tomorrow', date: '29 Sep', tempMax: 30, tempMin: 23, condition: 'Moderate Rain', icon: 'cloud-rain', rainProb: 75, thunderstormProb: 40, windSpeed: 24 },
          { day: 'Wed', date: '30 Sep', tempMax: 32, tempMin: 24, condition: 'Partly Cloudy', icon: 'cloud-sun', rainProb: 30, thunderstormProb: 15, windSpeed: 16 },
          { day: 'Thu', date: '01 Oct', tempMax: 33, tempMin: 25, condition: 'Sunny / Clear', icon: 'sun', rainProb: 10, thunderstormProb: 5, windSpeed: 12 },
          { day: 'Fri', date: '02 Oct', tempMax: 34, tempMin: 25, condition: 'Sunny / Clear', icon: 'sun', rainProb: 15, thunderstormProb: 5, windSpeed: 14 },
          { day: 'Sat', date: '03 Oct', tempMax: 33, tempMin: 24, condition: 'Scattered Showers', icon: 'cloud-drizzle', rainProb: 45, thunderstormProb: 20, windSpeed: 18 },
          { day: 'Sun', date: '04 Oct', tempMax: 32, tempMin: 24, condition: 'Partly Cloudy', icon: 'cloud-sun', rainProb: 25, thunderstormProb: 10, windSpeed: 15 }
        ]
      }
    ],

    weather_alerts: [
      {
        id: 'alert-krishna-thunder-01',
        farmId: defaultFarmId,
        alertType: 'thunderstorm',
        severity: 'HIGH',
        title: 'High-Risk Thunderstorm & Squall Alert Detected',
        description: 'Doppler Radar & BRICS AgrIn Climate Model predict severe convection with wind gusts exceeding 45 km/h and intense lightning strikes in Guntur/Tenali delta within the next 2-3 hours.',
        actions: [
          'AVOID spraying all chemical or bio-pesticides (run-off wastage & lightning hazard).',
          'Switch off and unplug electric drip automation pumps and borewell motors.',
          'Secure field equipment, tarpaulins, and nursery shade nets.',
          'Check primary field drainage channels to prevent waterlogging at panicle base.',
          'Halt all manual weeding and field labor until thunderstorm passes.'
        ],
        isThunderstorm: true,
        issuedAt: new Date(Date.now() - 1800000).toISOString(),
        status: 'ACTIVE',
        smsSent: true,
        smsRecipient: '+91 9876543210'
      }
    ],

    notifications: [
      {
        id: 'notif-01',
        userId: farmerUserId,
        title: '⚡ CRITICAL: Thunderstorm Alert for Krishna Delta Eco-Farm',
        message: 'Severe thunderstorm with 85% probability in Tenali. Postpone irrigation and pesticide spraying immediately.',
        severity: 'HIGH',
        type: 'thunderstorm',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        read: false
      },
      {
        id: 'notif-02',
        userId: farmerUserId,
        title: '🛰️ Sentinel-2 Satellite Multi-Spectral Pass Synced',
        message: 'Farm NDVI updated to 0.74 (Healthy Crop Canopy). Moisture index indicates sub-surface retention is strong.',
        severity: 'LOW',
        type: 'weather',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: false
      },
      {
        id: 'notif-03',
        userId: farmerUserId,
        title: '💧 Smart Irrigation Advisor: Cancel Cycle #14',
        message: 'Predicted rain (18-24mm) exceeds soil field capacity deficit. System saved ~32,000 Litres of groundwater.',
        severity: 'MEDIUM',
        type: 'irrigation',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        read: true
      },
      {
        id: 'notif-04',
        userId: farmerUserId,
        title: '🏛️ PM-KISAN 17th Installment Verification Active',
        message: 'Direct benefit transfer eligibility linked to Aadhaar e-KYC. Verify land seeding status.',
        severity: 'LOW',
        type: 'government_scheme',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true
      }
    ],

    otp_verifications: [],

    farm_activities: [
      {
        id: 'act-01',
        farmId: defaultFarmId,
        userId: farmerUserId,
        activityType: 'Irrigation',
        title: 'Sub-surface Drip Pulse Irrigation',
        description: 'Auto-paused by AgriN AI due to 90% rain probability and approaching thunderstorm.',
        dueDate: new Date().toISOString().split('T')[0],
        completed: false,
        aiSuggested: true,
        reminderSet: true,
        cropName: 'Basmati Paddy (PB 1509)'
      },
      {
        id: 'act-02',
        farmId: defaultFarmId,
        userId: farmerUserId,
        activityType: 'Pest scouting',
        title: 'Scout for Yellow Stem Borer & Leaf Folder',
        description: 'Inspect 20 random hills across Block A for egg masses and dead hearts.',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        completed: false,
        aiSuggested: true,
        reminderSet: true,
        cropName: 'Basmati Paddy (PB 1509)'
      },
      {
        id: 'act-03',
        farmId: defaultFarmId,
        userId: farmerUserId,
        activityType: 'Compost application',
        title: 'Apply Jeevamrutha Organic Bio-ferment',
        description: 'Drench soil root zone with 200L Jeevamrutha after rain cessations for microbial vigor.',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        completed: false,
        aiSuggested: true,
        reminderSet: true,
        cropName: 'Green Gram (Moong Mung)'
      },
      {
        id: 'act-04',
        farmId: defaultFarmId,
        userId: farmerUserId,
        activityType: 'Weeding',
        title: 'Cono-weeder inter-row pass in Paddy',
        description: 'Incorporate weed biomass into wet soil to enhance in-situ green manuring.',
        dueDate: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
        completed: true,
        aiSuggested: false,
        reminderSet: false,
        cropName: 'Basmati Paddy (PB 1509)'
      }
    ],

    crop_diagnoses: [
      {
        id: 'diag-01',
        farmId: defaultFarmId,
        userId: farmerUserId,
        cropName: 'Basmati Paddy',
        symptoms: 'Lower leaf sheaths show oval water-soaked lesions with grayish-white centers and dark brown margins.',
        imageUrl: '',
        possibleIssue: 'Sheath Blight (Rhizoctonia solani)',
        confidence: 84,
        observedSymptoms: [
          'Elliptical or oval lesions on leaf sheaths near water line',
          'Grayish center with irregular reddish-brown borders',
          'Early sclerotia formation on infected stems'
        ],
        recommendedActions: [
          'Drain excess water from the paddy plot to reduce microclimate humidity.',
          'Foliar spray of Trichoderma viride or Pseudomonas fluorescens @ 5g/L.',
          'Avoid excess nitrogenous urea top-dressing which exacerbates fungal spread.',
          'Ensure canopy aeration by skipping one hill every 8-10 rows.'
        ],
        prevention: [
          'Seed treatment with carbendazim or bio-fungicide in future sowings.',
          'Adopt System of Rice Intensification (SRI) spacing (25cm x 25cm).',
          'Practice green manuring with Sesbania (Daincha) prior to transplanting.'
        ],
        contactAgronomist: true,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        isAiScreening: true
      }
    ],

    satellite_observations: [
      {
        id: 'sat-krishna-01',
        farmId: defaultFarmId,
        ndvi: 0.74,
        ndwi: 0.38,
        vegetationHealth: 'Vigorous Crop Canopy',
        waterStress: 'Low Stress (Adequate Hydration)',
        cropStress: 'Optimal Biomass Accumulation',
        growthTrend: 'Accelerating (+6% over 15-day mean)',
        cloudCoverage: 12,
        dataSource: 'Sentinel-2 Multispectral Instrument (MSI) Level-2A via BRICS AgrIn Node',
        observedDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        historicalData: [
          { date: '2026-08-10', ndvi: 0.32, ndwi: 0.15, moisture: 35 },
          { date: '2026-08-20', ndvi: 0.44, ndwi: 0.22, moisture: 38 },
          { date: '2026-08-30', ndvi: 0.58, ndwi: 0.29, moisture: 42 },
          { date: '2026-09-09', ndvi: 0.67, ndwi: 0.34, moisture: 45 },
          { date: '2026-09-19', ndvi: 0.71, ndwi: 0.36, moisture: 47 },
          { date: '2026-09-27', ndvi: 0.74, ndwi: 0.38, moisture: 48 }
        ]
      }
    ],

    registry_datasets: [
      {
        id: 'ds-datagov-01',
        title: 'data.gov.in: Daily Mandi Wholesale Arrivals & Modal Prices (AGMARKNET)',
        country: 'India',
        region: 'National Coverage (3,200+ Regulated Markets across 28 States)',
        crop: 'Paddy, Wheat, Maize, Cotton, Pulses, Oilseeds, Vegetables',
        dataType: 'Market',
        description: 'Official open government dataset published daily by Directorate of Marketing & Inspection (DMI), Ministry of Agriculture & Farmers Welfare via data.gov.in OGD platform. Real-time modal prices, minimum/maximum price quotes, and daily arrivals in metric tonnes.',
        recordCount: 14500000,
        sharingLevel: 'Public (Open BRICS)',
        dataSource: 'Ministry of Agriculture & Farmers Welfare, Govt of India (data.gov.in OGD API)',
        lastUpdated: '2026-09-28',
        modelArchitecture: 'Automated Daily Agmarknet ETL with Mandi Price Trend Smoothing',
        format: 'JSON / CSV API / OGD Data Service',
        nodeEndpoint: 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
        sourcePortal: 'data.gov.in',
        officialLicense: 'Government Open Data License - India (GODL)'
      },
      {
        id: 'ds-datagov-02',
        title: 'data.gov.in: National Soil Health Card (SHC) District-Level Macro & Micronutrient Registry',
        country: 'India',
        region: 'Pan-India (718 Agricultural Districts)',
        crop: 'Multi-crop Baseline',
        dataType: 'Soil',
        description: 'Comprehensive soil chemical profiling from over 230 million Soil Health Cards issued to Indian farmers. Covers Nitrogen (N), Phosphorus (P2O5), Potassium (K2O), Organic Carbon (SOC %), pH, Electrical Conductivity, Zinc, Boron, and Iron status across soil typologies.',
        recordCount: 23200000,
        sharingLevel: 'Public (Open BRICS)',
        dataSource: 'Department of Agriculture & Farmers Welfare (DA&FW), data.gov.in',
        lastUpdated: '2026-09-18',
        modelArchitecture: 'Kriging Spatial Soil Interpolation & Nutrient Index Algorithm',
        format: 'REST API / GeoJSON / CSV',
        nodeEndpoint: 'https://data.gov.in/resource/soil-health-card-district-parameters-2026',
        sourcePortal: 'data.gov.in',
        officialLicense: 'Government Open Data License - India (GODL)'
      },
      {
        id: 'ds-bhuvan-01',
        title: 'ISRO Bhuvan: Resourcesat-2A LISS-IV 5.8m High-Resolution NDVI Composite Grid',
        country: 'India',
        region: 'Krishna-Godavari, Indo-Gangetic, and Cauvery River Basins',
        crop: 'Paddy Rice, Cotton & Sugarcane',
        dataType: 'Satellite',
        description: 'National Remote Sensing Centre (NRSC / ISRO) Bhuvan open geo-platform 10-day composite surface reflectance and multi-spectral vegetation indices. 5.8-meter spatial resolution enables field-boundary-level crop vigor, green canopy fraction, and chlorophyll absorption tracking.',
        recordCount: 3800000,
        sharingLevel: 'Public (Open BRICS)',
        dataSource: 'National Remote Sensing Centre (NRSC), Indian Space Research Organisation (ISRO)',
        lastUpdated: '2026-09-25',
        modelArchitecture: 'Bhuvan Atmospheric Correction & Multi-temporal Cloud Masking Engine',
        format: 'Cloud-Optimized GeoTIFF (COG) / OGC WMS/WCS / GeoPackage',
        nodeEndpoint: 'https://bhuvan-app1.nrsc.gov.in/bhuvan2d/bhuvan/agrin_node.php',
        sourcePortal: 'ISRO/Bhuvan',
        officialLicense: 'ISRO Open Remote Sensing Data Policy (NRSC)'
      },
      {
        id: 'ds-bhuvan-02',
        title: 'ISRO Bhuvan: EOS-04 (RISAT-1A) C-Band SAR All-Weather Soil Moisture & Water Inundation',
        country: 'India',
        region: 'Tropical & Sub-tropical Agro-climatic Zones',
        crop: 'Rice Paddies & Wetland Agro-ecosystems',
        dataType: 'Soil',
        description: 'Cloud-penetrating Synthetic Aperture Radar (SAR) backscatter observations providing volumetric soil moisture (m3/m3) and floodwater extent even through heavy monsoon cloud cover. Calibrated against in-situ ISRO automated weather stations (AWS) and flux towers.',
        recordCount: 1950000,
        sharingLevel: 'Public (Open BRICS)',
        dataSource: 'Space Applications Centre (SAC / ISRO) & NRSC Bhuvan',
        lastUpdated: '2026-09-27',
        modelArchitecture: 'Integral Equation Model (IEM) Soil Dielectric Constant Inversion',
        format: 'HDF5 / NetCDF-4 / GeoTIFF',
        nodeEndpoint: 'https://bhuvan.nrsc.gov.in/data/eos04/soil_moisture_cband',
        sourcePortal: 'ISRO/Bhuvan',
        officialLicense: 'ISRO Remote Sensing Data Sharing Policy'
      },
      {
        id: 'ds-imd-01',
        title: 'IMD Mausam: Doppler Weather Radar (DWR) Convective Squall & Thunderstorm Telemetry',
        country: 'India',
        region: 'Bay of Bengal Coastal Belt (Machilipatnam, Chennai, Visakhapatnam Radar Network)',
        crop: 'All Kharif & Rabi Crops',
        dataType: 'Weather',
        description: 'High-frequency 10-minute Doppler radar volumetric reflectivity (dBZ), radial velocity, and storm cell centroid tracking operated by India Meteorological Department (IMD). Drives the AgriN Thunderstorm Alert Engine to detect severe gusts and hail risk.',
        recordCount: 8900000,
        sharingLevel: 'Public (Open BRICS)',
        dataSource: 'India Meteorological Department (IMD), Ministry of Earth Sciences (MoES)',
        lastUpdated: '2026-09-28',
        modelArchitecture: 'IMD Severe Convective Storm Warning Algorithm (TITAN / SCIT)',
        format: 'BUFR / NetCDF / REST API Feed',
        nodeEndpoint: 'https://mausam.imd.gov.in/radar/dwr_telemetry/agrin_api',
        sourcePortal: 'IMD',
        officialLicense: 'Ministry of Earth Sciences Open Data Policy'
      },
      {
        id: 'ds-imd-02',
        title: 'IMD GKMS: Gramin Krishi Mausam Sewa District Agromet Advisory Bulletins',
        country: 'India',
        region: 'Pan-India 700+ District Agro-Meteorological Units (DAMUs)',
        crop: 'Major Field & Horticultural Crops',
        dataType: 'Climate',
        description: 'Bi-weekly expert weather-based crop advisories jointly prepared by IMD and state agricultural universities (SAUs/ICAR). Contains 5-day weather forecasts, pest/disease risk alerts, spray advisories, and micro-irrigation guidance tailored to local agro-climatic subzones.',
        recordCount: 520000,
        sharingLevel: 'Public (Open BRICS)',
        dataSource: 'Gramin Krishi Mausam Sewa (GKMS) / IMD / ICAR',
        lastUpdated: '2026-09-26',
        modelArchitecture: 'Agromet Decision Support System (ADSS) Rule-Based Inferences',
        format: 'JSON / XML / PDF Bulletin Feed',
        nodeEndpoint: 'https://imdagrimet.gov.in/gkms/bulletin_feed/v3',
        sourcePortal: 'IMD',
        officialLicense: 'Government Open Data License - India (GODL)'
      },
      {
        id: 'ds-fao-01',
        title: 'FAOSTAT: Global Food & Agricultural Production, Yields & Land Use Dynamics',
        country: 'India',
        region: 'Global / BRICS Comparative Benchmarks (1961-2026)',
        crop: 'Paddy Rice, Wheat, Coarse Grains, Oil Crops, Pulses',
        dataType: 'Yield',
        description: 'Official UN Food and Agriculture Organization (FAO) statistical database measuring agricultural area harvested, production volume, yield trends (hg/ha), and agricultural inputs across 245 countries and territories. Standardized for international agronomic comparisons.',
        recordCount: 9400000,
        sharingLevel: 'Public (Open BRICS)',
        dataSource: 'Statistics Division, Food and Agriculture Organization of the United Nations (FAO, Rome)',
        lastUpdated: '2026-08-30',
        modelArchitecture: 'UN FAO Harmonized Commodity & Production Accounts Engine',
        format: 'REST API / Parquet / CSV',
        nodeEndpoint: 'https://fenixservices.fao.org/faostat/api/v1/en/data/QCL',
        sourcePortal: 'FAO',
        officialLicense: 'Creative Commons Attribution-NonCommercial 3.0 IGO (CC BY-NC 3.0 IGO)'
      },
      {
        id: 'ds-fao-02',
        title: 'FAO GAEZ v4: Global Agro-Ecological Zones Soil Suitability & Crop Water Requirements',
        country: 'Brazil',
        region: 'Tropical South America & BRICS Agro-Ecological Zones',
        crop: 'Soybean, Maize, Sorghum, Cassava, Rice',
        dataType: 'Regenerative agriculture',
        description: 'FAO/IIASA Global Agro-Ecological Zones (GAEZ v4) multi-criteria assessment of rainfed and irrigated crop yield potentials, agro-climatic constraints, soil workability, and evapotranspiration under baseline and projected climate scenarios.',
        recordCount: 4200000,
        sharingLevel: 'Public (Open BRICS)',
        dataSource: 'Land and Water Division, FAO & IIASA',
        lastUpdated: '2026-09-05',
        modelArchitecture: 'Eco-physiological Crop Growth & Soil Moisture Water Balance Model',
        format: 'GeoTIFF / NetCDF-4 / OGC WCS',
        nodeEndpoint: 'https://gaez.fao.org/pages/data-access-download',
        sourcePortal: 'FAO',
        officialLicense: 'FAO Open Access Data Policy'
      },
      {
        id: 'ds-who-01',
        title: 'WHO / FAO Codex Alimentarius: Maximum Residue Limits (MRLs) & Agro-Chemical Safety Matrix',
        country: 'India',
        region: 'Global Standards & Food Safety Harmonization',
        crop: 'Cereals, Pulses, Fruits, Vegetables & Spices',
        dataType: 'Disease',
        description: 'World Health Organization (WHO) and FAO joint standard on Maximum Residue Limits (MRLs) for pesticides, safe pre-harvest intervals (PHI in days), and occupational exposure safety levels. Integrated into AgriN Crop Doctor to evaluate bio-rational alternatives.',
        recordCount: 680000,
        sharingLevel: 'Public (Open BRICS)',
        dataSource: 'World Health Organization (WHO) & Codex Alimentarius Commission',
        lastUpdated: '2026-09-10',
        modelArchitecture: 'Toxicological Risk Assessment & Dietary Intake Evaluation (IEDI)',
        format: 'JSON / REST API / SQLite',
        nodeEndpoint: 'https://www.fao.org/fao-who-codexalimentarius/codex-api/mrls',
        sourcePortal: 'WHO',
        officialLicense: 'WHO / UN Codex Public Good License'
      },
      {
        id: 'ds-who-02',
        title: 'WHO Health Guidelines: Safe Agricultural Use of Irrigation Water & Agro-Worker Protection',
        country: 'South Africa',
        region: 'Semi-arid & Developing Basin Irrigation Schemes',
        crop: 'Food Crops for Direct Human Consumption',
        dataType: 'Soil',
        description: 'World Health Organization microbiological water safety guidelines (E. coli, helminth egg thresholds), heavy metal limits in irrigation runoff, and personal protective protocols for smallholder agro-chemical applicators to prevent acute poisoning.',
        recordCount: 125000,
        sharingLevel: 'Public (Open BRICS)',
        dataSource: 'Department of Public Health, Environmental and Social Determinants of Health, WHO, Geneva',
        lastUpdated: '2026-08-15',
        modelArchitecture: 'Quantitative Microbial Risk Assessment (QMRA)',
        format: 'JSON / PDF / Open Data API',
        nodeEndpoint: 'https://who.int/teams/environment-climate-change-and-health/water-sanitation-and-health/agri_safety',
        sourcePortal: 'WHO',
        officialLicense: 'WHO Open Access Guidelines'
      },
      {
        id: 'brics-ds-01',
        title: 'ICAR All-India 100m Soil Organic Carbon & Bulk Density Raster Dataset',
        country: 'India',
        region: 'Indo-Gangetic Plains & Krishna-Godavari Basins',
        crop: 'Paddy, Wheat & Pulses',
        dataType: 'Soil',
        description: 'Comprehensive georeferenced raster dataset measuring soil organic carbon stocks (0-30cm and 30-100cm depths) calibrated across 12,000 ground truthing benchmark soil profiles.',
        recordCount: 450000,
        sharingLevel: 'Public (Open BRICS)',
        dataSource: 'Indian Council of Agricultural Research (ICAR) & National Bureau of Soil Survey (NBSS&LUP)',
        lastUpdated: '2026-09-15',
        modelArchitecture: 'Random Forest Ensemble with Sentinel-2 Surface Reflectance and SRTM Topography',
        format: 'GeoTIFF / NetCDF-4 / OGC WCS',
        nodeEndpoint: 'https://brics-agrin.icar.gov.in/federated/v2/datasets/soil-soc-100m',
        sourcePortal: 'BRICS Node',
        officialLicense: 'ICAR Open Agriculture Data Policy'
      },
      {
        id: 'brics-ds-02',
        title: 'Embrapa Cerrado Regenerative No-Till Soy-Maize Rotation & Evapotranspiration Matrix',
        country: 'Brazil',
        region: 'Mato Grosso & Goiás (Cerrado Biome)',
        crop: 'Soybean & Corn (Safrinha)',
        dataType: 'Regenerative agriculture',
        description: 'Continuous 8-year lysimeter and eddy covariance flux tower dataset analyzing water use efficiency, cover crop biomass (Brachiaria ruziziensis), and carbon sequestration in tropical oxisols.',
        recordCount: 820000,
        sharingLevel: 'Public (Open BRICS)',
        dataSource: 'Embrapa Soja & Ministry of Agriculture and Livestock (MAPA), Brazil',
        lastUpdated: '2026-09-20',
        modelArchitecture: 'Biome-BGC Micro-meteorological Crop Simulator v4.2',
        format: 'Parquet / HDF5 / REST API',
        nodeEndpoint: 'https://dados.embrapa.br/agrin-node/cerrado-flux-no-till',
        sourcePortal: 'BRICS Node',
        officialLicense: 'Brazilian Open Government Data License'
      },
      {
        id: 'brics-ds-03',
        title: 'Vavilov Institute Frost & Drought Tolerant Spring Wheat Phenomics Repository',
        country: 'Russia',
        region: 'Altai Krai & Southern Urals',
        crop: 'Spring Wheat & Barley',
        dataType: 'Crop health',
        description: 'Multi-year hyperspectral drone imaging and phenological time-series capturing early-vigor canopy development, root depth architecture, and frost recovery under continental climate extremes.',
        recordCount: 290000,
        sharingLevel: 'Federated Research',
        dataSource: 'N.I. Vavilov All-Russian Institute of Plant Genetic Resources (VIR), St. Petersburg',
        lastUpdated: '2026-09-08',
        modelArchitecture: 'Vision Transformer (ViT-H) Hyperspectral Leaf-Area Index Pipeline',
        format: 'Zarr / GeoParquet',
        nodeEndpoint: 'https://vir.nw.ru/brics-agrin/phenomics-wheat-altai',
        sourcePortal: 'BRICS Node',
        officialLicense: 'Russian Academy of Sciences Open Repository'
      },
      {
        id: 'brics-ds-04',
        title: 'CAAS Yangtze Basin Alternate Wetting & Drying (AWD) Methane Abatement Model',
        country: 'China',
        region: 'Hunan & Jiangxi Provinces',
        crop: 'Paddy Rice',
        dataType: 'Climate',
        description: 'Field experimental dataset quantifying 38% greenhouse gas (CH4 + N2O) reductions via controlled intermittent paddy drainage without yield penalties, paired with high-res SAR backscatter.',
        recordCount: 610000,
        sharingLevel: 'Public (Open BRICS)',
        dataSource: 'Chinese Academy of Agricultural Sciences (CAAS) Institute of Agricultural Resources',
        lastUpdated: '2026-09-22',
        modelArchitecture: 'DNDC (DeNitrification-DeComposition) Biogeochemical Model',
        format: 'NetCDF / CSV / GeoJSON',
        nodeEndpoint: 'https://agridata.caas.cn/federation/brics/awd-ch4-paddy',
        sourcePortal: 'BRICS Node',
        officialLicense: 'CAAS Academic Data Exchange Protocol'
      },
      {
        id: 'brics-ds-05',
        title: 'ARC Karoo Semi-Arid Soil Moisture Retention & Rangeland Regeneration Registry',
        country: 'South Africa',
        region: 'Eastern Cape & Great Karoo Basin',
        crop: 'Sorghum, Pearl Millet & Native Pasture',
        dataType: 'Soil',
        description: 'Decentralized sensor network data evaluating keyline contour swales, biochar amendment, and holistic rotational grazing on water infiltration and soil microbial diversity.',
        recordCount: 175000,
        sharingLevel: 'Public (Open BRICS)',
        dataSource: 'Agricultural Research Council (ARC) - Soil, Climate and Water, Pretoria',
        lastUpdated: '2026-09-12',
        modelArchitecture: 'Hydrus-1D Soil Unsaturated Flow Simulation',
        format: 'GeoPackage / Parquet',
        nodeEndpoint: 'https://arc.agric.za/brics/karoo-moisture-network',
        sourcePortal: 'BRICS Node',
        officialLicense: 'South African Open Science Framework'
      }
    ],

    research_notes: [
      {
        id: 'res-note-01',
        authorId: researcherUserId,
        authorName: 'Dr. Priya Sundaram',
        authorRole: 'Lead Principal Scientist',
        institution: 'ICAR - IARI, New Delhi',
        title: 'Cross-Border Harmonization of Sentinel-2 NDVI Thresholds for Tropical Paddy Phenology',
        abstract: 'This paper establishes a cross-calibrated NDVI reference scale unifying Indian and Brazilian rice systems. By integrating localized soil moisture telemetry with optical satellite reflectance, false positives for nitrogen stress are reduced by 41%.',
        country: 'India',
        crop: 'Paddy Rice',
        content: `### Executive Summary
Satellite-based remote sensing using Sentinel-2 MSI provides 10-meter spatial resolution suitable for smallholder landholdings in emerging nations. However, conventional uncalibrated NDVI indices often mistake standing water during tillering for bare ground or low biomass.

### Methodology
1. **Coupled Telemetry**: Soil moisture sensors deployed at 15cm and 30cm depth in Krishna delta and Mato Grosso.
2. **BRICS AgrIn Normalization Filter**: Multi-spectral water index (NDWI) is computed synchronously to isolate ponded floodwater from vegetative canopy reflectance.
3. **Machine Learning Model**: XGBoost regression trained on 4,200 harvest sample cuts across Andhra Pradesh and Punjab.

### Results & Field Implications
The harmonized index demonstrates an R² of 0.89 against destructive dry biomass yield cuts. Farmer advisory recommendations can now accurately advise on nitrogen top-dressing timing up to 12 days before visible symptoms appear.`,
        status: 'Published',
        tags: ['Satellite Remote Sensing', 'Sentinel-2', 'Rice Phenology', 'NDVI Calibration', 'BRICS AgrIn'],
        publishedAt: '2026-09-24',
        citations: 14
      },
      {
        id: 'res-note-02',
        authorId: 'res-brazil-02',
        authorName: 'Dr. Carlos Mendez da Silva',
        authorRole: 'Senior Agronomic Modeler',
        institution: 'Embrapa Meio Ambiente, Jaguariúna, Brazil',
        title: 'Bio-Char and No-Till Synergies in Oxisol Cation Exchange Capacity Enhancement',
        abstract: 'Long-term trials in central Brazil prove that combining sugar-cane bagasse biochar with zero-tillage legumes elevates Soil Organic Carbon by 0.35 percentage points over 36 months, doubling microbial respiration.',
        country: 'Brazil',
        crop: 'Soybean & Green Cover',
        content: `Oxisols suffer from intense weathering and rapid organic matter turnover under high tropical temperatures. Through cooperative data exchange with Indian alluvial basin researchers, we replicated fermented biological inoculant treatments (similar to Jeevamrutha) alongside biochar amendments.

Key Findings:
- Soil cation exchange capacity (CEC) increased from 8.2 to 14.6 cmolc/kg.
- Bulk density decreased from 1.34 to 1.18 g/cm³, significantly enhancing rainwater percolation during torrential downpours.`,
        status: 'Published',
        tags: ['Regenerative Agriculture', 'Biochar', 'Soil Organic Carbon', 'Zero Tillage'],
        publishedAt: '2026-09-18',
        citations: 28
      }
    ],

    student_observations: [
      {
        id: 'obs-01',
        studentId: studentUserId,
        studentName: 'Aarav Sharma',
        institution: 'Acharya N.G. Ranga Agricultural University',
        farmLocation: 'Angalakuduru Field Block, Tenali',
        crop: 'Paddy (BPT 5204)',
        observationText: 'Observed marginal chlorosis and upward leaf curling in 12 hills out of 50 sampled along field borders. Soil moisture is currently 52%. No evident fungal hyphae under 10x field loupe.',
        symptomsObserved: ['Marginal Chlorosis', 'Upward Leaf Cupping', 'Stunted Tiller Emergence'],
        imageUrl: '',
        status: 'verified',
        verifiedBy: 'Dr. Priya Sundaram (ICAR)',
        feedback: 'Excellent field observation. Symptoms match initial Zinc deficiency induced by alkaline canal irrigation flushes rather than viral infection. Advise farmer on zinc sulphate heptahydrate (ZnSO4 21%) foliar spray @ 0.5% with lime.',
        submittedAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: 'obs-02',
        studentId: studentUserId,
        studentName: 'Aarav Sharma',
        institution: 'Acharya N.G. Ranga Agricultural University',
        farmLocation: 'Burripalem Road Farm, Guntur',
        crop: 'Green Gram (Moong)',
        observationText: 'Noticed prolific nodulation on root systems treated with local Rhizobium culture compared to untreated control plot. Average nodule count: 34 per plant vs 11 in control.',
        symptomsObserved: ['Healthy Pink Nodules (Active Leghaemoglobin)', 'Dark Green Foliage'],
        imageUrl: '',
        status: 'pending_review',
        submittedAt: new Date(Date.now() - 3600000 * 6).toISOString()
      }
    ],

    market_prices: [
      {
        id: 'mkt-paddy-01',
        crop: 'Paddy (Common / Basmati)',
        marketName: 'Tenali AMC Mandi',
        state: 'Andhra Pradesh',
        country: 'India',
        currentPrice: 2480,
        modalPrice: 2450,
        minPrice: 2200,
        maxPrice: 2620,
        priceTrend: 'UP',
        changePercent: 3.2,
        unit: '₹ / Quintal',
        updatedAt: '2026-09-28 08:30 IST',
        history: [
          { date: '22 Sep', price: 2350 },
          { date: '23 Sep', price: 2380 },
          { date: '24 Sep', price: 2410 },
          { date: '25 Sep', price: 2400 },
          { date: '26 Sep', price: 2440 },
          { date: '27 Sep', price: 2460 },
          { date: '28 Sep', price: 2480 }
        ]
      },
      {
        id: 'mkt-maize-02',
        crop: 'Maize (Kharif Yellow)',
        marketName: 'Guntur Mirchi Yard & Grain Yard',
        state: 'Andhra Pradesh',
        country: 'India',
        currentPrice: 2150,
        modalPrice: 2120,
        minPrice: 1980,
        maxPrice: 2240,
        priceTrend: 'STABLE',
        changePercent: 0.5,
        unit: '₹ / Quintal',
        updatedAt: '2026-09-28 08:30 IST',
        history: [
          { date: '22 Sep', price: 2140 },
          { date: '23 Sep', price: 2140 },
          { date: '24 Sep', price: 2150 },
          { date: '25 Sep', price: 2160 },
          { date: '26 Sep', price: 2150 },
          { date: '27 Sep', price: 2150 },
          { date: '28 Sep', price: 2150 }
        ]
      },
      {
        id: 'mkt-cotton-03',
        crop: 'Cotton (Medium Staple)',
        marketName: 'Warangal Cotton Market',
        state: 'Telangana',
        country: 'India',
        currentPrice: 7320,
        modalPrice: 7250,
        minPrice: 6900,
        maxPrice: 7550,
        priceTrend: 'UP',
        changePercent: 2.1,
        unit: '₹ / Quintal',
        updatedAt: '2026-09-28 09:15 IST',
        history: [
          { date: '22 Sep', price: 7100 },
          { date: '23 Sep', price: 7150 },
          { date: '24 Sep', price: 7200 },
          { date: '25 Sep', price: 7220 },
          { date: '26 Sep', price: 7280 },
          { date: '27 Sep', price: 7300 },
          { date: '28 Sep', price: 7320 }
        ]
      },
      {
        id: 'mkt-chilli-04',
        crop: 'Red Chilli (Teja / Guntur Sannam)',
        marketName: 'Guntur Asia Largest Chilli Yard',
        state: 'Andhra Pradesh',
        country: 'India',
        currentPrice: 19400,
        modalPrice: 19000,
        minPrice: 17500,
        maxPrice: 21000,
        priceTrend: 'DOWN',
        changePercent: -1.8,
        unit: '₹ / Quintal',
        updatedAt: '2026-09-28 09:30 IST',
        history: [
          { date: '22 Sep', price: 20200 },
          { date: '23 Sep', price: 20000 },
          { date: '24 Sep', price: 19800 },
          { date: '25 Sep', price: 19600 },
          { date: '26 Sep', price: 19500 },
          { date: '27 Sep', price: 19450 },
          { date: '28 Sep', price: 19400 }
        ]
      },
      {
        id: 'mkt-wheat-05',
        crop: 'Wheat (Sharbati / Mill Quality)',
        marketName: 'Khanna Mandi, Ludhiana',
        state: 'Punjab',
        country: 'India',
        currentPrice: 2540,
        modalPrice: 2510,
        minPrice: 2400,
        maxPrice: 2600,
        priceTrend: 'UP',
        changePercent: 1.4,
        unit: '₹ / Quintal',
        updatedAt: '2026-09-28 08:45 IST',
        history: [
          { date: '22 Sep', price: 2490 },
          { date: '23 Sep', price: 2500 },
          { date: '24 Sep', price: 2510 },
          { date: '25 Sep', price: 2520 },
          { date: '26 Sep', price: 2530 },
          { date: '27 Sep', price: 2535 },
          { date: '28 Sep', price: 2540 }
        ]
      },
      {
        id: 'mkt-soy-06',
        crop: 'Soybean (Yellow)',
        marketName: 'Indore Mandi',
        state: 'Madhya Pradesh',
        country: 'India',
        currentPrice: 4680,
        modalPrice: 4620,
        minPrice: 4400,
        maxPrice: 4850,
        priceTrend: 'UP',
        changePercent: 1.9,
        unit: '₹ / Quintal',
        updatedAt: '2026-09-28 09:00 IST',
        history: [
          { date: '22 Sep', price: 4550 },
          { date: '23 Sep', price: 4580 },
          { date: '24 Sep', price: 4600 },
          { date: '25 Sep', price: 4620 },
          { date: '26 Sep', price: 4640 },
          { date: '27 Sep', price: 4660 },
          { date: '28 Sep', price: 4680 }
        ]
      }
    ],

    ai_conversations: {
      [farmerUserId]: [
        {
          role: 'assistant',
          content: 'Namaste Ramesh ji! I am AgriN AI, your multilingual agro-intelligence advisor. I am actively monitoring Krishna Delta Eco-Farm. Right now, a high-severity thunderstorm is approaching Tenali. I have automatically paused your drip cycle to conserve 32,000L of water and protect your crop. How may I assist your farm today?',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ]
    },

    government_schemes: [
      {
        id: 'scheme-pmkisan-01',
        schemeName: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
        shortName: 'PM-KISAN',
        category: 'Direct Income Support',
        country: 'India',
        description: 'Central sector scheme providing ₹6,000 per year in three equal instalments of ₹2,000 directly into the bank accounts of all landholding farmer families across the country.',
        eligibility: [
          'All small and marginal landholding farmer families with cultivable land in their names.',
          'Subject to exclusion criteria (e.g. institutional landholders, constitutional post holders, income tax payees).',
          'Mandatory Aadhaar e-KYC and land registry record seeding in State DBT portal.'
        ],
        benefits: '₹6,000 per annum paid directly to bank account via DBT every 4 months (April-July, August-November, December-March).',
        documentsRequired: [
          'Aadhaar Card linked to active Mobile Number',
          'Land Ownership Record (Khatauni / RoR / Patta Passbook)',
          'Bank Account Details (Aadhaar Seeded & NPCI Active)'
        ],
        officialUrl: 'https://pmkisan.gov.in',
        isLive: true,
        statusText: 'Official Portal Active • Direct Link to Govt of India'
      },
      {
        id: 'scheme-pkvy-02',
        schemeName: 'Paramparagat Krishi Vikas Yojana (PKVY) - Organic & Regenerative Farming',
        shortName: 'PKVY Organic Mission',
        category: 'Regenerative Agriculture',
        country: 'India',
        description: 'Supports chemical-free organic farming through cluster formation and Participatory Guarantee System (PGS) certification, offering financial assistance for bio-inputs and on-farm composting.',
        eligibility: [
          'Farmers willing to form clusters of 20-50 hectares for certified organic cultivation.',
          'Small and marginal farmers prioritizing soil microbial rejuvenation.'
        ],
        benefits: '₹50,000 per hectare over 3 years, of which ₹31,000 is directly provided for organic inputs (seeds, bio-fertilizers, vermicompost).',
        documentsRequired: ['Aadhaar Card', 'Land holding documents', 'Cluster membership agreement'],
        officialUrl: 'https://pgsindia-ncof.gov.in',
        isLive: true,
        statusText: 'Official Central Portal Active'
      },
      {
        id: 'scheme-pmksy-03',
        schemeName: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY - Per Drop More Crop)',
        shortName: 'PMKSY Micro-Irrigation',
        category: 'Water Conservation',
        country: 'India',
        description: 'Promotes micro-irrigation technologies such as Drip and Sprinkler systems to maximize water use efficiency and fertilizer distribution (fertigation).',
        eligibility: ['All farmers owning cultivable agricultural land.'],
        benefits: 'Up to 55% subsidy for small/marginal farmers and 45% for other farmers for installing drip and sprinkler systems.',
        documentsRequired: ['Land Records', 'Aadhaar Card', 'Soil & Water test report'],
        officialUrl: 'https://pmksy.gov.in',
        isLive: true,
        statusText: 'Ministry of Agriculture & Farmers Welfare'
      }
    ],

    sms_logs: [
      {
        id: 'sms-log-01',
        phone: '+91 9876543210',
        message: '[AgriN DEMO SMS] CRITICAL ALERT: Severe Thunderstorm approaching Krishna Delta Eco-Farm within 2 hours. Do NOT spray pesticides. Power down electric irrigation motors.',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        isDemo: true,
        status: 'DEMO SMS SENT'
      }
    ]
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read existing database, re-initializing seed data:', err);
    }

    const initial = getInitialData();
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write to database file:', err);
    }
  }

  public getRawData(): DatabaseSchema {
    return this.data;
  }

  public commit() {
    this.saveData(this.data);
  }

  // User methods
  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByPhone(phone: string): User | undefined {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return this.data.users.find(u => u.phone.replace(/[^0-9]/g, '') === cleanPhone);
  }

  public createUser(user: User): User {
    this.data.users.push(user);
    this.commit();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.commit();
      return this.data.users[idx];
    }
    return undefined;
  }

  // Farm methods
  public getFarmByUserId(userId: string): Farm | undefined {
    return this.data.farms.find(f => f.userId === userId) || this.data.farms[0];
  }

  public getFarms(): Farm[] {
    return this.data.farms;
  }

  public createFarm(farm: Farm): Farm {
    this.data.farms.push(farm);
    this.commit();
    return farm;
  }

  // Crops
  public getCropsByFarmId(farmId: string): FarmCrop[] {
    return this.data.farm_crops.filter(c => c.farmId === farmId);
  }

  // Soil
  public getSoilByFarmId(farmId: string): SoilRecord | undefined {
    return this.data.soil_records.find(s => s.farmId === farmId) || this.data.soil_records[0];
  }

  public updateSoil(record: SoilRecord): SoilRecord {
    const idx = this.data.soil_records.findIndex(s => s.farmId === record.farmId);
    if (idx !== -1) {
      this.data.soil_records[idx] = record;
    } else {
      this.data.soil_records.push(record);
    }
    this.commit();
    return record;
  }

  // Weather & Alerts
  public getWeatherByFarmId(farmId: string): WeatherRecord | undefined {
    return this.data.weather_records.find(w => w.farmId === farmId) || this.data.weather_records[0];
  }

  public getAlerts(farmId?: string): WeatherAlert[] {
    if (farmId) {
      return this.data.weather_alerts.filter(a => a.farmId === farmId);
    }
    return this.data.weather_alerts;
  }

  public addAlert(alert: WeatherAlert): WeatherAlert {
    this.data.weather_alerts.unshift(alert);
    this.commit();
    return alert;
  }

  public resolveAlert(id: string): boolean {
    const alert = this.data.weather_alerts.find(a => a.id === id);
    if (alert) {
      alert.status = 'RESOLVED';
      this.commit();
      return true;
    }
    return false;
  }

  // Notifications
  public getNotifications(userId: string): AppNotification[] {
    return this.data.notifications.filter(n => n.userId === userId || n.userId === 'all');
  }

  public addNotification(notification: AppNotification): AppNotification {
    this.data.notifications.unshift(notification);
    this.commit();
    return notification;
  }

  public markNotificationAsRead(id: string): boolean {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.commit();
      return true;
    }
    return false;
  }

  // OTP
  public createOrUpdateOtp(phone: string, otp: string, ttlSeconds = 180): OtpVerification {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const expiresAt = Date.now() + ttlSeconds * 1000;
    const existing = this.data.otp_verifications.find(o => o.phone === cleanPhone);

    if (existing) {
      existing.otp = otp;
      existing.expiresAt = expiresAt;
      existing.verified = false;
      existing.attempts = 0;
      this.commit();
      return existing;
    }

    const record: OtpVerification = {
      id: 'otp-' + Math.random().toString(36).substring(2, 9),
      phone: cleanPhone,
      otp,
      expiresAt,
      verified: false,
      attempts: 0
    };
    this.data.otp_verifications.push(record);
    this.commit();
    return record;
  }

  public verifyOtp(phone: string, enteredOtp: string): { success: boolean; message: string } {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const record = this.data.otp_verifications.find(o => o.phone === cleanPhone);

    // Allow master demo code "123456" in demo mode
    if (process.env.DEMO_MODE !== 'false' && enteredOtp === '123456') {
      return { success: true, message: 'Verified via demo master code' };
    }

    if (!record) {
      return { success: false, message: 'No OTP requested for this phone number' };
    }

    if (Date.now() > record.expiresAt) {
      return { success: false, message: 'OTP has expired. Please request a new one.' };
    }

    if (record.attempts >= 5) {
      return { success: false, message: 'Maximum attempts exceeded. Please request a new OTP.' };
    }

    record.attempts += 1;
    if (record.otp === enteredOtp.trim()) {
      record.verified = true;
      this.commit();
      return { success: true, message: 'OTP verified successfully' };
    }

    this.commit();
    return { success: false, message: 'Incorrect OTP. Please try again.' };
  }

  // Farm Activities
  public getActivities(farmId: string): FarmActivity[] {
    return this.data.farm_activities.filter(a => a.farmId === farmId);
  }

  public addActivity(act: FarmActivity): FarmActivity {
    this.data.farm_activities.push(act);
    this.commit();
    return act;
  }

  public updateActivity(id: string, updates: Partial<FarmActivity>): FarmActivity | undefined {
    const idx = this.data.farm_activities.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.data.farm_activities[idx] = { ...this.data.farm_activities[idx], ...updates };
      this.commit();
      return this.data.farm_activities[idx];
    }
    return undefined;
  }

  public deleteActivity(id: string): boolean {
    const initialLen = this.data.farm_activities.length;
    this.data.farm_activities = this.data.farm_activities.filter(a => a.id !== id);
    if (this.data.farm_activities.length !== initialLen) {
      this.commit();
      return true;
    }
    return false;
  }

  // Crop Diagnoses
  public getDiagnoses(farmId?: string): CropDiagnosis[] {
    if (farmId) {
      return this.data.crop_diagnoses.filter(d => d.farmId === farmId);
    }
    return this.data.crop_diagnoses;
  }

  public addDiagnosis(diag: CropDiagnosis): CropDiagnosis {
    this.data.crop_diagnoses.unshift(diag);
    this.commit();
    return diag;
  }

  // Satellite
  public getSatellite(farmId: string): SatelliteObservation | undefined {
    return this.data.satellite_observations.find(s => s.farmId === farmId) || this.data.satellite_observations[0];
  }

  // Registry Datasets
  public getDatasets(): RegistryDataset[] {
    return this.data.registry_datasets;
  }

  public addDataset(ds: RegistryDataset): RegistryDataset {
    this.data.registry_datasets.unshift(ds);
    this.commit();
    return ds;
  }

  // Research Notes
  public getResearchNotes(): ResearchNote[] {
    return this.data.research_notes;
  }

  public addResearchNote(note: ResearchNote): ResearchNote {
    this.data.research_notes.unshift(note);
    this.commit();
    return note;
  }

  // Student Observations
  public getStudentObservations(): StudentObservation[] {
    return this.data.student_observations;
  }

  public addStudentObservation(obs: StudentObservation): StudentObservation {
    this.data.student_observations.unshift(obs);
    this.commit();
    return obs;
  }

  public updateStudentObservation(id: string, updates: Partial<StudentObservation>): StudentObservation | undefined {
    const idx = this.data.student_observations.findIndex(o => o.id === id);
    if (idx !== -1) {
      this.data.student_observations[idx] = { ...this.data.student_observations[idx], ...updates };
      this.commit();
      return this.data.student_observations[idx];
    }
    return undefined;
  }

  // Market Prices
  public getMarketPrices(): MarketPrice[] {
    return this.data.market_prices;
  }

  // Government Schemes
  public getGovernmentSchemes(): GovernmentScheme[] {
    return this.data.government_schemes;
  }

  // AI Chat History
  public getChatHistory(userId: string): { role: string; content: string; timestamp: string }[] {
    return this.data.ai_conversations[userId] || [];
  }

  public addChatMessage(userId: string, message: { role: string; content: string; timestamp: string }) {
    if (!this.data.ai_conversations[userId]) {
      this.data.ai_conversations[userId] = [];
    }
    this.data.ai_conversations[userId].push(message);
    this.commit();
  }

  // SMS Logs
  public addSmsLog(phone: string, message: string, isDemo = true): { id: string; status: string } {
    const log = {
      id: 'sms-' + Date.now(),
      phone,
      message,
      timestamp: new Date().toISOString(),
      isDemo,
      status: isDemo ? 'DEMO SMS SENT' : 'DELIVERED'
    };
    this.data.sms_logs.unshift(log);
    this.commit();
    return log;
  }

  public getSmsLogs() {
    return this.data.sms_logs;
  }
}

export const db = new Database();
