import { supabase } from './supabase';

export interface Connection {
  id: string;
  requester_id: string;
  responder_id: string;
  opportunity_id?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  connection_type?: 'professional' | 'mentorship' | 'investment' | 'partnership' | 'friendship';
  message?: string;
  mutual_connection_count?: number;
  created_at: string;
  updated_at: string;
  // Computed fields for UI
  user_id?: string;
  connected_user_id?: string;
  request_type?: 'direct' | 'questionnaire';
  waiting_days?: number;
  decline_reason?: string;
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
        requester_profile:profiles!connections_requester_id_fkey(
          id,
          full_name,
          role,
          company,
          avatar_url
        ),
        responder_profile:profiles!connections_responder_id_fkey(
          id,
          full_name,
          role,
          company,
          avatar_url
        ),
        opportunity:opportunities(
          id,
          title,
          company
        )
      `)
      .or(`requester_id.eq.${userId},responder_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching connections:', error);
      throw error;
    }

    // Transform data to match UI expectations
    const connections = (data || []).map(connection => {
      const isRequester = connection.requester_id === userId;
      const otherUser = isRequester ? connection.responder_profile : connection.requester_profile;
      
      return {
        ...connection,
        user_id: userId,
        connected_user_id: isRequester ? connection.responder_id : connection.requester_id,
        connected_user: otherUser ? {
          id: otherUser.id,
          name: otherUser.full_name,
          role: otherUser.role,
          company: otherUser.company,
          profile_image: otherUser.avatar_url
        } : undefined,
        // Map status to UI expectations
        status: connection.status === 'accepted' ? 'active' : 
                connection.status === 'rejected' ? 'declined' : 
                connection.status === 'pending' ? 'pending' : 'declined'
      };
    });

    return connections;
  },

  // Share contact with a connection
  async shareContact(connectionId: string): Promise<void> {
    // First get the connection details
    const { data: connection, error: fetchError } = await supabase
      .from('connections')
      .select('*')
      .eq('id', connectionId)
      .single();

    if (fetchError) {
      console.error('Error fetching connection:', fetchError);
      throw fetchError;
    }

    // Update the connection status
    const { error } = await supabase
      .from('connections')
      .update({ 
        status: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', connectionId);

    if (error) {
      console.error('Error sharing contact:', error);
      throw error;
    }

    // Create notification for the requester
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: connection.requester_id,
          type: 'contact_shared',
          title: 'Contact Shared',
          message: 'Your contact information has been shared with the opportunity poster.',
          data: { connection_id: connectionId, opportunity_id: connection.opportunity_id },
          is_read: false,
          is_email_sent: false
        });
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Don't throw here as the main action succeeded
    }
  },

  // Send questionnaire to a connection
  async sendQuestionnaire(connectionId: string, questionnaireId: string): Promise<void> {
    // First get the connection details
    const { data: connection, error: fetchError } = await supabase
      .from('connections')
      .select('*')
      .eq('id', connectionId)
      .single();

    if (fetchError) {
      console.error('Error fetching connection:', fetchError);
      throw fetchError;
    }

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

    // Create notification for the requester
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: connection.requester_id,
          type: 'questionnaire_sent',
          title: 'Questionnaire Sent',
          message: 'A questionnaire has been sent for your opportunity application.',
          data: { connection_id: connectionId, questionnaire_id: questionnaireId },
          is_read: false,
          is_email_sent: false
        });
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Don't throw here as the main action succeeded
    }
  },

  // Revoke access from a connection
  async revokeAccess(connectionId: string): Promise<void> {
    const { error } = await supabase
      .from('connections')
      .update({ 
        status: 'rejected',
        message: 'Access revoked by user',
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
        status: 'rejected',
        message: reason,
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
        message: null,
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
      .or(`requester_id.eq.${userId},responder_id.eq.${userId}`);

    if (error) {
      console.error('Error fetching connection stats:', error);
      throw error;
    }

    const connections = data || [];
    return {
      active: connections.filter(c => c.status === 'accepted').length,
      pending: connections.filter(c => c.status === 'pending').length,
      declined: connections.filter(c => c.status === 'rejected' || c.status === 'blocked').length
    };
  }
}; 