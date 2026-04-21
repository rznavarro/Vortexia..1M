export type LeadStatus = 
  | 'ENVIÉ DM' 
  | 'RESPONDIÓ' 
  | 'AGENDÓ CITA' 
  | 'NO RESPONDIÓ' 
  | 'INTERESADO' 
  | 'NO INTERESADO' 
  | 'CALIFICADO'
  | 'CITAS'
  | 'PROPUESTAS'
  | 'CERRADOS' 
  | 'PERDIDOS';

export interface Lead {
  id: string;
  handle: string; // Instagram handle
  name: string;
  specialty?: string;
  location?: string;
  status: LeadStatus;
  lastInteractionAt: number; // timestamp
  notes?: string;
  estimatedValue?: number;
  createdAt: number;
}

export interface Interaction {
  id: string;
  leadId: string;
  type: LeadStatus;
  notes?: string;
  timestamp: number;
  result?: string;
}

export interface UserSettings {
  miamiGoalClients: number;
  miamiLifeCost: number;
  setupPrice: number;
  retainerPrice: number;
  followUpAlertHours: number;
  dailyDmGoal: number;
  openaiKey?: string;
}
