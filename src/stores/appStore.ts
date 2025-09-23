import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
}

interface AppState {
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // Notifications
  notifications: Notification[];
  
  // Modals
  modals: {
    upload: boolean;
    imageDetail: boolean;
    settings: boolean;
  };
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Modal actions
  openModal: (modal: keyof AppState['modals']) => void;
  closeModal: (modal: keyof AppState['modals']) => void;
  closeAllModals: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  sidebarOpen: false,
  theme: 'system',
  notifications: [],
  modals: {
    upload: false,
    imageDetail: false,
    settings: false,
  },

  // UI Actions
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },

  setTheme: (theme: 'light' | 'dark' | 'system') => {
    set({ theme });
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },

  // Notification actions
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto remove notification after duration
    if (notification.duration !== 0) {
      const duration = notification.duration || 5000;
      setTimeout(() => {
        get().removeNotification(newNotification.id);
      }, duration);
    }
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  // Modal actions
  openModal: (modal) => {
    set((state) => ({
      modals: { ...state.modals, [modal]: true },
    }));
  },

  closeModal: (modal) => {
    set((state) => ({
      modals: { ...state.modals, [modal]: false },
    }));
  },

  closeAllModals: () => {
    set({
      modals: {
        upload: false,
        imageDetail: false,
        settings: false,
      },
    });
  },
}));
