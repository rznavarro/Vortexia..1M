import { Lead, Interaction, UserSettings } from '../types';

const STORAGE_KEYS = {
  LEADS: 'vx_leads',
  SETTINGS: 'vx_settings',
  METRICS: 'vx_metrics',
  INITIALIZED: 'vx_initialized'
};

const DEFAULT_SETTINGS: UserSettings = {
  miamiGoalClients: 20,
  miamiLifeCost: 8000,
  setupPrice: 500,
  retainerPrice: 300,
  followUpAlertHours: 48,
  dailyDmGoal: 40
};

export const storageService = {
  getLeads: (): Lead[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LEADS);
    return data ? JSON.parse(data) : [];
  },

  saveLeads: (leads: Lead[]) => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  },

  getSettings: (): UserSettings => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  },

  saveSettings: (settings: UserSettings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  isInitialized: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.INITIALIZED) === 'true';
  },

  setInitialized: () => {
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  },

  addLead: (lead: Lead) => {
    const leads = storageService.getLeads();
    const existingIndex = leads.findIndex(l => l.handle === lead.handle);
    if (existingIndex > -1) {
      leads[existingIndex] = { ...leads[existingIndex], ...lead };
    } else {
      leads.push(lead);
    }
    storageService.saveLeads(leads);
  }
};
