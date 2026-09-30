import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  offlineStorage,
  OfflineAdvisory,
  OfflineSavedMap,
  QueuedSyncAction
} from '../services/offlineStorage.js';
import { api } from '../services/api.js';

interface OfflineContextType {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  isOffline: boolean; // true if real offline OR simulated
  toggleSimulatedOffline: () => void;
  cachedAdvisories: OfflineAdvisory[];
  savedMaps: OfflineSavedMap[];
  pendingActions: QueuedSyncAction[];
  isVaultOpen: boolean;
  openVault: () => void;
  closeVault: () => void;
  saveMapForOffline: (map: OfflineSavedMap) => Promise<void>;
  removeSavedMap: (id: string) => Promise<void>;
  saveAdvisoryForOffline: (adv: OfflineAdvisory) => Promise<void>;
  queueOfflineAction: (type: QueuedSyncAction['type'], payload: any) => Promise<string>;
  syncPendingActions: () => Promise<{ success: boolean; syncedCount: number }>;
  lastSyncTime: string | null;
  refreshOfflineData: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [cachedAdvisories, setCachedAdvisories] = useState<OfflineAdvisory[]>([]);
  const [savedMaps, setSavedMaps] = useState<OfflineSavedMap[]>([]);
  const [pendingActions, setPendingActions] = useState<QueuedSyncAction[]>([]);
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    return localStorage.getItem('agrin_last_sync') || new Date().toISOString();
  });

  const isOffline = !isOnline || isSimulatedOffline;

  const refreshOfflineData = async () => {
    try {
      const [advs, maps, actions] = await Promise.all([
        offlineStorage.getAllAdvisories(),
        offlineStorage.getAllSavedMaps(),
        offlineStorage.getPendingActions()
      ]);
      setCachedAdvisories(advs);
      setSavedMaps(maps);
      setPendingActions(actions);
    } catch (err) {
      console.warn('[OfflineContext] Failed to load offline cache:', err);
    }
  };

  useEffect(() => {
    refreshOfflineData();

    const handleOnline = () => {
      setIsOnline(true);
      // Auto-flush pending queue when reconnecting
      syncPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline(prev => !prev);
  };

  const saveMapForOffline = async (map: OfflineSavedMap) => {
    await offlineStorage.saveMap(map);
    await refreshOfflineData();
  };

  const removeSavedMap = async (id: string) => {
    await offlineStorage.deleteSavedMap(id);
    await refreshOfflineData();
  };

  const saveAdvisoryForOffline = async (adv: OfflineAdvisory) => {
    await offlineStorage.saveAdvisory(adv);
    await refreshOfflineData();
  };

  const queueOfflineAction = async (type: QueuedSyncAction['type'], payload: any) => {
    const actionId = await offlineStorage.queueAction(type, payload);
    await refreshOfflineData();
    return actionId;
  };

  const syncPendingActions = async () => {
    if (isOffline) {
      return { success: false, syncedCount: 0 };
    }

    try {
      const pending = await offlineStorage.getPendingActions();
      let syncedCount = 0;

      for (const action of pending) {
        try {
          if (action.type === 'COMPLETE_ACTIVITY') {
            await api.updateActivity(action.payload.activityId, { completed: action.payload.completed });
          } else if (action.type === 'ADD_ACTIVITY') {
            await api.addActivity(action.payload);
          }
          await offlineStorage.markActionSynced(action.id);
          syncedCount++;
        } catch (err) {
          console.warn(`[Sync Engine] Failed to sync action ${action.id}:`, err);
        }
      }

      const now = new Date().toISOString();
      setLastSyncTime(now);
      localStorage.setItem('agrin_last_sync', now);
      await refreshOfflineData();

      return { success: true, syncedCount };
    } catch (err) {
      console.error('[Sync Engine] Batch sync error:', err);
      return { success: false, syncedCount: 0 };
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        isSimulatedOffline,
        isOffline,
        toggleSimulatedOffline,
        cachedAdvisories,
        savedMaps,
        pendingActions,
        isVaultOpen,
        openVault: () => setIsVaultOpen(true),
        closeVault: () => setIsVaultOpen(false),
        saveMapForOffline,
        removeSavedMap,
        saveAdvisoryForOffline,
        queueOfflineAction,
        syncPendingActions,
        lastSyncTime,
        refreshOfflineData
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
