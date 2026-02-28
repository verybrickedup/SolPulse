/**
 * Alert Store — Zustand state management
 * Manages price alerts, wallet alerts, and notification history
 */

import { create } from 'zustand';
import { Alert, AlertType, AlertOperator } from '../types/token';

interface AlertHistory {
  alertId: string;
  alertName: string;
  triggeredAt: number;
  message: string;
}

interface AlertState {
  // Data
  alerts: Alert[];
  history: AlertHistory[];

  // Actions
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => string;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  deleteAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  getActiveAlerts: () => Alert[];
  getAlertsByType: (type: AlertType) => Alert[];
  addToHistory: (entry: AlertHistory) => void;
  clearHistory: () => void;
}

const generateId = () => `alert_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],
  history: [],

  addAlert: (alertData) => {
    const id = generateId();
    const alert: Alert = {
      ...alertData,
      id,
      createdAt: Date.now(),
    };
    set((state) => ({ alerts: [...state.alerts, alert] }));
    return id;
  },

  updateAlert: (id, updates) => {
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    }));
  },

  deleteAlert: (id) => {
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    }));
  },

  toggleAlert: (id) => {
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, enabled: !a.enabled } : a
      ),
    }));
  },

  getActiveAlerts: () => {
    return get().alerts.filter((a) => a.enabled);
  },

  getAlertsByType: (type) => {
    return get().alerts.filter((a) => a.type === type);
  },

  addToHistory: (entry) => {
    set((state) => ({
      history: [entry, ...state.history].slice(0, 100), // Keep last 100
    }));
  },

  clearHistory: () => set({ history: [] }),
}));

export default useAlertStore;
