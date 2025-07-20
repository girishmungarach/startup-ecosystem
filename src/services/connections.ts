import { supabase } from './supabase';

export interface Connection {
  id: string;
  user_id: string;
  connected_user_id: string;
  opportunity_id?: string;
  status: 'active' | 'pending' | 'declined';
  request_type?: 'direct' | 'questionnaire';
  waiting_days?: number;
  decline_reason?: string;
  created_at: string;
  updated_at: string;
  // Joined data from profiles
  connected_user?: {
    id: string;
    name: string;
    role: string;
    company: string;
    profile_image?: string;
  };
  opportunity?: {
    id: string;
    title: string;
    company: string;
  };
}

export interface ConnectionStats {
  active: number;
  pending: number;
  declined: number;
}

export const connectionsService = {
  // Get all connections for a user
  async getUserConnections(userId: string): Promise<Connection[]> {
    const { data, error } = await supabase
      .from('connections')
      .select(`
        *,
        connected_user:profiles!connections_connected_user_id_fkey(
          id,
          name,
          role,
          company,
          profile_image
        ),
        opportunity:opportunities(
          id,
          title,
          company
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching connections:', error);
      throw error;
    }

    return data || [];
  },

  // Share contact with a connection
  async shareContact(connectionId: string): Promise<void> {
    const { error } = await supabase
      .from('connections')
      .update({ 
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', connectionId);

    if (error) {
      console.error('Error sharing contact:', error);
      throw error;
    }
  },

  // Send questionnaire to a connection
  async sendQuestionnaire(connectionId: string, questionnaireId: string): Promise<void> {
    const { error } = await supabase
      .from('connection_questionnaires')
      .insert({
        connection_id: connectionId,
        questionnaire_id: questionnaireId,
        status: 'sent'
      });

    if (error) {
      console.error('Error sending questionnaire:', error);
      throw error;
    }
  },

  // Revoke access from a connection
  async revokeAccess(connectionId: string): Promise<void> {
    const { error } = await supabase
      .from('connections')
      .update({ 
        status: 'declined',
        decline_reason: 'Access revoked by user',
        updated_at: new Date().toISOString()
      })
      .eq('id', connectionId);

    if (error) {
      console.error('Error revoking access:', error);
      throw error;
    }
  },

  // Decline a connection request
  async declineConnection(connectionId: string, reason: string): Promise<void> {
    const { error } = await supabase
      .from('connections')
      .update({ 
        status: 'declined',
        decline_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', connectionId);

    if (error) {
      console.error('Error declining connection:', error);
      throw error;
    }
  },

  // Reconsider a declined connection
  async reconsiderConnection(connectionId: string): Promise<void> {
    const { error } = await supabase
      .from('connections')
      .update({ 
        status: 'pending',
        decline_reason: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', connectionId);

    if (error) {
      console.error('Error reconsidering connection:', error);
      throw error;
    }
  },

  // Get connection statistics
  async getConnectionStats(userId: string): Promise<ConnectionStats> {
    const { data, error } = await supabase
      .from('connections')
      .select('status')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching connection stats:', error);
      throw error;
    }

    const connections = data || [];
    return {
      active: connections.filter(c => c.status === 'active').length,
      pending: connections.filter(c => c.status === 'pending').length,
      declined: connections.filter(c => c.status === 'declined').length
    };
  }
}; 