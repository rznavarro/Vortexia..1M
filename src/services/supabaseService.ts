import { supabase } from '../lib/supabase';
import { Lead, Interaction, UserSettings, LeadStatus } from '../types';

const DEFAULT_SETTINGS: UserSettings = {
  miamiGoalClients: 20,
  miamiLifeCost: 8000,
  setupPrice: 500,
  retainerPrice: 300,
  followUpAlertHours: 48,
  dailyDmGoal: 40
};

// Simple service without authentication - single user mode
export const supabaseService = {
  // Test connection
  testConnection: async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        console.error('Supabase connection error:', error);
        return false;
      }
      
      console.log('Supabase connected successfully');
      return true;
    } catch (error) {
      console.error('Supabase connection failed:', error);
      return false;
    }
  },
  // Leads
  getLeads: async (): Promise<Lead[]> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        return [];
      }

      return data.map(lead => ({
        id: lead.id, // Keep the UUID from Supabase
        handle: lead.handle,
        name: lead.name,
        specialty: lead.specialty || undefined,
        location: lead.location || undefined,
        status: lead.status as LeadStatus,
        lastInteractionAt: new Date(lead.last_interaction_at).getTime(),
        notes: lead.notes || undefined,
        estimatedValue: lead.estimated_value || undefined,
        createdAt: new Date(lead.created_at).getTime()
      }));
    } catch (error) {
      console.error('Unexpected error fetching leads:', error);
      return [];
    }
  },

  saveLeads: async (leads: Lead[]) => {
    // This method is kept for compatibility but individual operations are preferred
    console.warn('saveLeads is deprecated, use addLead, updateLead, deleteLead instead');
  },

  addLead: async (lead: Lead): Promise<boolean> => {
    try {
      // Check if lead already exists
      const { data: existing } = await supabase
        .from('leads')
        .select('id')
        .eq('handle', lead.handle)
        .single();

      if (existing) {
        // Update existing lead
        return supabaseService.updateLead(lead);
      }

      // Let Supabase generate the UUID automatically
      const { error } = await supabase
        .from('leads')
        .insert({
          handle: lead.handle,
          name: lead.name,
          specialty: lead.specialty,
          location: lead.location,
          status: lead.status,
          last_interaction_at: new Date(lead.lastInteractionAt).toISOString(),
          notes: lead.notes,
          estimated_value: lead.estimatedValue,
          created_at: new Date(lead.createdAt).toISOString()
        });

      if (error) {
        console.error('Error adding lead:', error);
        alert(`Error al guardar lead: ${error.message}`);
        return false;
      }

      console.log('Lead guardado exitosamente');
      return true;
    } catch (error) {
      console.error('Unexpected error adding lead:', error);
      alert(`Error inesperado: ${error}`);
      return false;
    }
  },

  updateLead: async (lead: Lead): Promise<boolean> => {
    try {
      // Find the lead by handle first to get the correct UUID
      const { data: existing } = await supabase
        .from('leads')
        .select('id')
        .eq('handle', lead.handle)
        .single();

      if (!existing) {
        console.error('Lead not found for update');
        return false;
      }

      const { error } = await supabase
        .from('leads')
        .update({
          handle: lead.handle,
          name: lead.name,
          specialty: lead.specialty,
          location: lead.location,
          status: lead.status,
          last_interaction_at: new Date(lead.lastInteractionAt).toISOString(),
          notes: lead.notes,
          estimated_value: lead.estimatedValue
        })
        .eq('id', existing.id);

      if (error) {
        console.error('Error updating lead:', error);
        alert(`Error al actualizar lead: ${error.message}`);
        return false;
      }

      console.log('Lead actualizado exitosamente');
      return true;
    } catch (error) {
      console.error('Unexpected error updating lead:', error);
      alert(`Error inesperado: ${error}`);
      return false;
    }
  },

  deleteLead: async (leadId: string): Promise<boolean> => {
    try {
      // Since leadId might be a timestamp, we need to find by handle or use the actual UUID
      // For now, let's find by the lead data we have
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) {
        console.error('Error deleting lead:', error);
        alert(`Error al eliminar lead: ${error.message}`);
        return false;
      }

      console.log('Lead eliminado exitosamente');
      return true;
    } catch (error) {
      console.error('Unexpected error deleting lead:', error);
      alert(`Error inesperado: ${error}`);
      return false;
    }
  },

  // Settings - single row approach
  getSettings: async (): Promise<UserSettings> => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      return DEFAULT_SETTINGS;
    }

    return {
      miamiGoalClients: data.miami_goal_clients,
      miamiLifeCost: data.miami_life_cost,
      setupPrice: data.setup_price,
      retainerPrice: data.retainer_price,
      followUpAlertHours: data.follow_up_alert_hours,
      dailyDmGoal: data.daily_dm_goal,
      openaiKey: data.openai_key || undefined
    };
  },

  saveSettings: async (settings: UserSettings): Promise<boolean> => {
    // First check if settings exist
    const { data: existing } = await supabase
      .from('user_settings')
      .select('id')
      .limit(1)
      .single();

    const settingsData = {
      miami_goal_clients: settings.miamiGoalClients,
      miami_life_cost: settings.miamiLifeCost,
      setup_price: settings.setupPrice,
      retainer_price: settings.retainerPrice,
      follow_up_alert_hours: settings.followUpAlertHours,
      daily_dm_goal: settings.dailyDmGoal,
      openai_key: settings.openaiKey
    };

    let error;
    if (existing) {
      // Update existing settings
      ({ error } = await supabase
        .from('user_settings')
        .update(settingsData)
        .eq('id', existing.id));
    } else {
      // Insert new settings
      ({ error } = await supabase
        .from('user_settings')
        .insert(settingsData));
    }

    if (error) {
      console.error('Error saving settings:', error);
      return false;
    }

    return true;
  },

  // Initialization
  isInitialized: async (): Promise<boolean> => {
    const { data } = await supabase
      .from('user_settings')
      .select('id')
      .limit(1)
      .single();

    return !!data;
  },

  setInitialized: async (): Promise<boolean> => {
    const settingsData = {
      miami_goal_clients: DEFAULT_SETTINGS.miamiGoalClients,
      miami_life_cost: DEFAULT_SETTINGS.miamiLifeCost,
      setup_price: DEFAULT_SETTINGS.setupPrice,
      retainer_price: DEFAULT_SETTINGS.retainerPrice,
      follow_up_alert_hours: DEFAULT_SETTINGS.followUpAlertHours,
      daily_dm_goal: DEFAULT_SETTINGS.dailyDmGoal,
      openai_key: DEFAULT_SETTINGS.openaiKey
    };

    const { error } = await supabase
      .from('user_settings')
      .insert(settingsData);

    return !error;
  },

  // Interactions
  addInteraction: async (interaction: Interaction): Promise<boolean> => {
    const { error } = await supabase
      .from('interactions')
      .insert({
        id: interaction.id,
        lead_id: interaction.leadId,
        type: interaction.type,
        notes: interaction.notes,
        result: interaction.result,
        created_at: new Date(interaction.timestamp).toISOString()
      });

    if (error) {
      console.error('Error adding interaction:', error);
      return false;
    }

    return true;
  },

  getInteractions: async (leadId: string): Promise<Interaction[]> => {
    const { data, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching interactions:', error);
      return [];
    }

    return data.map(interaction => ({
      id: interaction.id,
      leadId: interaction.lead_id,
      type: interaction.type as LeadStatus,
      notes: interaction.notes || undefined,
      result: interaction.result || undefined,
      timestamp: new Date(interaction.created_at).getTime()
    }));
  },

  // Migration helper - move localStorage data to Supabase
  migrateFromLocalStorage: async (): Promise<boolean> => {
    try {
      // Migrate leads
      const localLeads = localStorage.getItem('vx_leads');
      if (localLeads) {
        const leads: Lead[] = JSON.parse(localLeads);
        for (const lead of leads) {
          await supabaseService.addLead(lead);
        }
      }

      // Migrate settings
      const localSettings = localStorage.getItem('vx_settings');
      if (localSettings) {
        const settings: UserSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(localSettings) };
        await supabaseService.saveSettings(settings);
      }

      // Mark as initialized
      await supabaseService.setInitialized();

      return true;
    } catch (error) {
      console.error('Migration error:', error);
      return false;
    }
  }
};