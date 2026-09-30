import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, LanguageCode, AppNotification, WeatherAlert } from '../types/index.js';
import { translations, Translations } from '../i18n/translations.js';
import { api } from '../services/api.js';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  activeAlerts: WeatherAlert[];
  isDemoMode: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (role?: UserRole) => void;
  closeAuthModal: () => void;
  loginWithUser: (user: User) => void;
  loginAsRole: (role: UserRole) => Promise<void>;
  logout: () => void;
  triggerThunderstormDemo: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  refreshAlertsAndNotifications: () => Promise<void>;
  toastMessage: { text: string; type: 'success' | 'alert' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'alert' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('agrin_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default active user session for immediate platform exploration
    return {
      id: 'user-farmer-01',
      phone: '9876543210',
      countryCode: '+91',
      name: 'Ramesh Patel',
      email: 'ramesh.patel@agrin-brics.org',
      role: 'farmer',
      language: 'en',
      farmId: 'farm-krishna-delta-01',
      createdAt: new Date().toISOString()
    };
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('agrin_lang') as LanguageCode) || 'en';
  });
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<WeatherAlert[]>([]);
  const [isDemoMode] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'alert' | 'info' } | null>(null);

  const t = translations[language] || translations.en;

  const showToast = (text: string, type: 'success' | 'alert' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 4500);
  };

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('agrin_lang', lang);
    if (user) {
      api.setRole({ userId: user.id, role: user.role, language: lang }).catch(() => {});
    }
  };

  const refreshAlertsAndNotifications = async () => {
    if (!user) return;
    try {
      const [notifsRes, alertsRes] = await Promise.all([
        api.getNotifications(user.id),
        api.getAlerts(user.farmId)
      ]);
      if (notifsRes.success) setNotifications(notifsRes.notifications);
      if (alertsRes.success) {
        setActiveAlerts(alertsRes.alerts.filter((a: WeatherAlert) => a.status === 'ACTIVE'));
      }
    } catch (e) {
      console.warn('Could not fetch notifications/alerts:', e);
    }
  };

  useEffect(() => {
    refreshAlertsAndNotifications();
    const interval = setInterval(refreshAlertsAndNotifications, 25000);
    return () => clearInterval(interval);
  }, [user]);

  const loginWithUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('agrin_user', JSON.stringify(newUser));
    if (newUser.language) {
      setLanguageState(newUser.language);
    }
    showToast(`Logged in as ${newUser.name} (${newUser.role.toUpperCase()})`, 'success');
    refreshAlertsAndNotifications();
  };

  const loginAsRole = async (role: UserRole) => {
    let mockUser: User;
    if (role === 'farmer') {
      mockUser = {
        id: 'user-farmer-01',
        phone: '9876543210',
        countryCode: '+91',
        name: 'Ramesh Patel',
        email: 'ramesh.patel@agrin-brics.org',
        role: 'farmer',
        language: language,
        farmId: 'farm-krishna-delta-01',
        createdAt: new Date().toISOString()
      };
    } else if (role === 'researcher') {
      mockUser = {
        id: 'user-researcher-01',
        phone: '9123456789',
        countryCode: '+91',
        name: 'Dr. Priya Sundaram',
        email: 'priya.sundaram@icar.gov.in',
        role: 'researcher',
        language: language,
        institution: 'ICAR - Indian Agricultural Research Institute',
        createdAt: new Date().toISOString()
      };
    } else {
      mockUser = {
        id: 'user-student-01',
        phone: '9988776655',
        countryCode: '+91',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@angrau.edu.in',
        role: 'student',
        language: language,
        institution: 'B.Sc (Hons) Agriculture, ANGRAU',
        createdAt: new Date().toISOString()
      };
    }

    loginWithUser(mockUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agrin_user');
    setActiveTab('dashboard');
    showToast('Logged out successfully', 'info');
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const triggerThunderstormDemo = async () => {
    const farmId = user?.farmId || 'farm-krishna-delta-01';
    try {
      const res = await api.triggerThunderstormAlert(farmId, 'CRITICAL');
      if (res.success) {
        showToast('⚡ Thunderstorm Alert Triggered! SMS dispatched & safety actions updated.', 'alert');
        await refreshAlertsAndNotifications();
        setActiveTab('weather');
      }
    } catch (err: any) {
      showToast('Failed to trigger storm simulation: ' + err.message, 'alert');
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    } catch (e) {
      console.warn(e);
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        t,
        notifications,
        unreadNotificationsCount,
        activeAlerts,
        isDemoMode,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginWithUser,
        loginAsRole,
        logout,
        triggerThunderstormDemo,
        markNotificationAsRead,
        refreshAlertsAndNotifications,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
