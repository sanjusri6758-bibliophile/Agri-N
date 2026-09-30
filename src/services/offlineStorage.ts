/**
 * AgriN Offline Storage & IndexedDB State Sync Engine
 * Enables seamless offline access to critical agro-advisories, saved satellite farm maps,
 * weather hazards, and queues field operations until connectivity is restored.
 */

export interface OfflineAdvisory {
  id: string;
  category: 'THUNDERSTORM' | 'IRRIGATION' | 'DISEASE' | 'SOIL' | 'REGENERATIVE';
  severity: 'CRITICAL' | 'WARNING' | 'ADVISORY' | 'INFO';
  title: string;
  crop: string;
  content: string;
  actions: string[];
  issuedAt: string;
  validUntil: string;
  source: string;
  isPreloaded?: boolean;
}

export interface OfflineSavedMap {
  id: string;
  farmId: string;
  farmName: string;
  parcelName: string;
  coordinates: {
    lat: number;
    lng: number;
    polygonCoords: [number, number][];
  };
  areaHectares: number;
  crop: string;
  ndviScore: number;
  ndwiScore: number;
  canopyStatus: string;
  lastSatellitePass: string;
  satelliteConstellation: string;
  spectralBands: {
    ndviSvgPath?: string;
    ndwiSvgPath?: string;
  };
  savedAt: string;
  notes?: string;
}

export interface QueuedSyncAction {
  id: string;
  type: 'COMPLETE_ACTIVITY' | 'ADD_ACTIVITY' | 'SUBMIT_OBSERVATION' | 'CROP_NOTE';
  payload: any;
  timestamp: string;
  retryCount: number;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
}

const DB_NAME = 'agrin_offline_vault';
const DB_VERSION = 1;

class OfflineStorageEngine {
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      this.initDB();
    }
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. Advisories Store
        if (!db.objectStoreNames.contains('advisories')) {
          const advStore = db.createObjectStore('advisories', { keyPath: 'id' });
          advStore.createIndex('category', 'category', { unique: false });
          advStore.createIndex('severity', 'severity', { unique: false });
          advStore.createIndex('issuedAt', 'issuedAt', { unique: false });
        }

        // 2. Saved Maps Store
        if (!db.objectStoreNames.contains('savedMaps')) {
          const mapStore = db.createObjectStore('savedMaps', { keyPath: 'id' });
          mapStore.createIndex('farmId', 'farmId', { unique: false });
          mapStore.createIndex('savedAt', 'savedAt', { unique: false });
        }

        // 3. Offline Weather & Farm Telemetry Snapshot
        if (!db.objectStoreNames.contains('telemetryCache')) {
          db.createObjectStore('telemetryCache', { keyPath: 'key' });
        }

        // 4. Background Sync Queue
        if (!db.objectStoreNames.contains('syncQueue')) {
          const queueStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          queueStore.createIndex('status', 'status', { unique: false });
          queueStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('[IndexedDB] Failed to open AgriN Offline Vault:', request.error);
        reject(request.error);
      };
    });

    // Seed default offline pack on first setup
    this.seedDefaultOfflinePacks();

    return this.dbPromise;
  }

  private async getDB(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      return this.initDB();
    }
    return this.dbPromise;
  }

  // ----------------------------------------------------
  // ADVISORIES
  // ----------------------------------------------------

  async saveAdvisory(advisory: OfflineAdvisory): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('advisories', 'readwrite');
      const store = tx.objectStore('advisories');
      const req = store.put(advisory);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getAllAdvisories(): Promise<OfflineAdvisory[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('advisories', 'readonly');
      const store = tx.objectStore('advisories');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async deleteAdvisory(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('advisories', 'readwrite');
      const store = tx.objectStore('advisories');
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // ----------------------------------------------------
  // SAVED MAPS
  // ----------------------------------------------------

  async saveMap(map: OfflineSavedMap): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('savedMaps', 'readwrite');
      const store = tx.objectStore('savedMaps');
      const req = store.put(map);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getAllSavedMaps(): Promise<OfflineSavedMap[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('savedMaps', 'readonly');
      const store = tx.objectStore('savedMaps');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async deleteSavedMap(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('savedMaps', 'readwrite');
      const store = tx.objectStore('savedMaps');
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // ----------------------------------------------------
  // TELEMETRY CACHE (Weather, Soil, Farm Details)
  // ----------------------------------------------------

  async cacheTelemetry(key: string, data: any): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('telemetryCache', 'readwrite');
      const store = tx.objectStore('telemetryCache');
      const req = store.put({ key, data, cachedAt: new Date().toISOString() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getCachedTelemetry<T>(key: string): Promise<T | null> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('telemetryCache', 'readonly');
      const store = tx.objectStore('telemetryCache');
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.data : null);
      req.onerror = () => reject(req.error);
    });
  }

  // ----------------------------------------------------
  // OFFLINE QUEUE (BACKGROUND SYNC)
  // ----------------------------------------------------

  async queueAction(type: QueuedSyncAction['type'], payload: any): Promise<string> {
    const db = await this.getDB();
    const action: QueuedSyncAction = {
      id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      payload,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      status: 'PENDING'
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction('syncQueue', 'readwrite');
      const store = tx.objectStore('syncQueue');
      const req = store.put(action);
      req.onsuccess = () => resolve(action.id);
      req.onerror = () => reject(req.error);
    });
  }

  async getPendingActions(): Promise<QueuedSyncAction[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('syncQueue', 'readonly');
      const store = tx.objectStore('syncQueue');
      const index = store.index('status');
      const req = index.getAll('PENDING');
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async markActionSynced(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('syncQueue', 'readwrite');
      const store = tx.objectStore('syncQueue');
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        if (getReq.result) {
          const updated = { ...getReq.result, status: 'SYNCED' };
          store.put(updated);
        }
        resolve();
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }

  // ----------------------------------------------------
  // PRE-LOADED OFFLINE PACKS (CRITICAL AGRO-SAFETY)
  // ----------------------------------------------------

  async seedDefaultOfflinePacks(): Promise<void> {
    try {
      const existing = await this.getAllAdvisories();
      if (existing.length === 0) {
        const defaultAdvisories: OfflineAdvisory[] = [
          {
            id: 'adv-offline-storm-01',
            category: 'THUNDERSTORM',
            severity: 'CRITICAL',
            title: 'Emergency Convective Squall & Hail Protocol',
            crop: 'Paddy Rice & Standing Field Crops',
            content: 'Doppler Radar telemetry indicates severe thunderstorm cell approaching coastal deltas with gusts exceeding 45 km/h.',
            actions: [
              'Clear field drainage sluice gates immediately to avoid root inundation.',
              'De-energize electric borewells and submersible pump starters to prevent surge burnout.',
              'Secure farm tarpaulins over harvested grain bags and threshing floors.',
              'Strictly postpone foliar chemical spraying or top-dressing until squall line clears.'
            ],
            issuedAt: new Date().toISOString(),
            validUntil: new Date(Date.now() + 86400000 * 2).toISOString(),
            source: 'IMD Doppler Radar & AgriN Emergency Rule Engine',
            isPreloaded: true
          },
          {
            id: 'adv-offline-irrig-02',
            category: 'IRRIGATION',
            severity: 'ADVISORY',
            title: 'Pre-Rainfall Irrigation Skip Advisory',
            crop: 'Basmati Paddy (PB 1509)',
            content: 'Soil root zone moisture currently at 48% (adequate field capacity). Convective clouds provide 25-40mm natural precipitation.',
            actions: [
              'Skip scheduled canal/borewell pumping cycle for the next 48 hours.',
              'Preserves ~32,000 Litres of groundwater per hectare.',
              'Prevents waterlogging-induced lodging in tillering paddy hills.'
            ],
            issuedAt: new Date().toISOString(),
            validUntil: new Date(Date.now() + 86400000 * 3).toISOString(),
            source: 'AgriN Soil-Moisture Balance Model',
            isPreloaded: true
          },
          {
            id: 'adv-offline-disease-03',
            category: 'DISEASE',
            severity: 'WARNING',
            title: 'Sheath Blight & Blast Humid Weather Management',
            crop: 'Paddy Rice',
            content: 'Relative humidity > 80% creates high sporulation risk for Rhizoctonia solani (Sheath Blight).',
            actions: [
              'Maintain 2cm standing water layer; avoid deep submergence.',
              'Avoid excess nitrogen urea; use split application with neem coating.',
              'Bio-control: Foliar spray of Pseudomonas fluorescens @ 5g/L on calm mornings.'
            ],
            issuedAt: new Date().toISOString(),
            validUntil: new Date(Date.now() + 86400000 * 5).toISOString(),
            source: 'ICAR Integrated Pest Management Guide',
            isPreloaded: true
          },
          {
            id: 'adv-offline-regen-04',
            category: 'REGENERATIVE',
            severity: 'INFO',
            title: 'In-Situ Jeevamrutha Organic Bio-Ferment Recipe',
            crop: 'All Crops',
            content: 'Enhance soil microbial biodiversity and organic carbon assimilation using farm-sourced natural inputs.',
            actions: [
              'Mix 10kg desi cow dung + 10L cow urine + 2kg jaggery + 2kg pulse flour + handful of fertile soil in 200L water.',
              'Stir clockwise twice daily for 48 hours in shade.',
              'Apply through irrigation channel or 10% foliar spray for root resilience.'
            ],
            issuedAt: new Date().toISOString(),
            validUntil: new Date(Date.now() + 86400000 * 30).toISOString(),
            source: 'National Project on Organic Farming (NPOF)',
            isPreloaded: true
          }
        ];

        for (const adv of defaultAdvisories) {
          await this.saveAdvisory(adv);
        }
      }

      const existingMaps = await this.getAllSavedMaps();
      if (existingMaps.length === 0) {
        const defaultMap: OfflineSavedMap = {
          id: 'map-offline-tenali-01',
          farmId: 'farm-krishna-delta-01',
          farmName: 'Krishna Delta Eco-Farm',
          parcelName: 'Block A (Main Canal Parcel #402)',
          coordinates: {
            lat: 16.2437,
            lng: 80.6400,
            polygonCoords: [
              [16.2445, 80.6390],
              [16.2448, 80.6415],
              [16.2425, 80.6418],
              [16.2422, 80.6392]
            ]
          },
          areaHectares: 3.8,
          crop: 'Basmati Paddy (PB 1509)',
          ndviScore: 0.74,
          ndwiScore: 0.38,
          canopyStatus: 'Vigorous Crop Canopy',
          lastSatellitePass: '2026-09-27',
          satelliteConstellation: 'ISRO Bhuvan (Resourcesat-2A) & Sentinel-2',
          spectralBands: {},
          savedAt: new Date().toISOString(),
          notes: 'Pre-cached high-resolution spectral baseline. Available with zero cellular signal.'
        };

        await this.saveMap(defaultMap);
      }
    } catch (err) {
      console.warn('[AgriN Offline Vault] Seed init warning:', err);
    }
  }
}

export const offlineStorage = new OfflineStorageEngine();
