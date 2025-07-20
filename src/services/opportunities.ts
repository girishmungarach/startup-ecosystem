import { supabase } from './supabase';

export interface OpportunityGrabber {
  id: string;
  opportunity_id: string;
  user_id: string;
  status: 'pending' | 'contact_shared' | 'questionnaire_sent' | 'declined';
  created_at: string;
  updated_at: string;
  // Joined data from profiles
  user?: {
    id: string;
    name: string;
    role: string;
    company: string;
    profile_image?: string;
    current_project?: string;
  };
  questionnaire_response?: {
    id: string;
    status: 'completed' | 'pending';
    submitted_at?: string;
  };
}

export interface OpportunityStats {
  pending: number;
  contact_shared: number;
  questionnaire_sent: number;
  declined: number;
}

export const opportunitiesService = {
  // Get all grabbers for an opportunity
  async getOpportunityGrabbers(opportunityId: string): Promise<OpportunityGrabber[]> {
    const { data, error } = await supabase
      .from('opportunity_grabbers')
      .select(`
        *,
        user:profiles!opportunity_grabbers_user_id_fkey(
          id,
          name,
          role,
          company,
          profile_image,
          current_project
        ),
        questionnaire_response:questionnaire_responses(
          id,
          status,
          submitted_at
        )
      `)
      .eq('opportunity_id', opportunityId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching opportunity grabbers:', error);
      throw error;
    }

    return data || [];
  },

  // Share contact with a grabber
  async shareContact(grabberId: string): Promise<void> {
    const { error } = await supabase
      .from('opportunity_grabbers')
      .update({ 
        status: 'contact_shared',
        updated_at: new Date().toISOString()
      })
      .eq('id', grabberId);

    if (error) {
      console.error('Error sharing contact:', error);
      throw error;
    }
  },

  // Send questionnaire to a grabber
  async sendQuestionnaire(grabberId: string, questionnaireId: string): Promise<void> {
    const { error } = await supabase
      .from('opportunity_grabbers')
      .update({ 
        status: 'questionnaire_sent',
        updated_at: new Date().toISOString()
      })
      .eq('id', grabberId);

    if (error) {
      console.error('Error sending questionnaire:', error);
      throw error;
    }

    // Create questionnaire response record
    const { error: responseError } = await supabase
      .from('questionnaire_responses')
      .insert({
        opportunity_grabber_id: grabberId,
        questionnaire_id: questionnaireId,
        status: 'pending'
      });

    if (responseError) {
      console.error('Error creating questionnaire response:', responseError);
      throw responseError;
    }
  },

  // Decline a grabber
  async declineGrabber(grabberId: string, reason?: string): Promise<void> {
    const { error } = await supabase
      .from('opportunity_grabbers')
      .update({ 
        status: 'declined',
        updated_at: new Date().toISOString()
      })
      .eq('id', grabberId);

    if (error) {
      console.error('Error declining grabber:', error);
      throw error;
    }
  },

  // Batch share contact with multiple grabbers
  async batchShareContact(grabberIds: string[]): Promise<void> {
    const { error } = await supabase
      .from('opportunity_grabbers')
      .update({ 
        status: 'contact_shared',
        updated_at: new Date().toISOString()
      })
      .in('id', grabberIds);

    if (error) {
      console.error('Error batch sharing contact:', error);
      throw error;
    }
  },

  // Batch send questionnaire to multiple grabbers
  async batchSendQuestionnaire(grabberIds: string[], questionnaireId: string): Promise<void> {
    const { error } = await supabase
      .from('opportunity_grabbers')
      .update({ 
        status: 'questionnaire_sent',
        updated_at: new Date().toISOString()
      })
      .in('id', grabberIds);

    if (error) {
      console.error('Error batch sending questionnaire:', error);
      throw error;
    }

    // Create questionnaire response records for all grabbers
    const responseRecords = grabberIds.map(grabberId => ({
      opportunity_grabber_id: grabberId,
      questionnaire_id: questionnaireId,
      status: 'pending'
    }));

    const { error: responseError } = await supabase
      .from('questionnaire_responses')
      .insert(responseRecords);

    if (responseError) {
      console.error('Error creating batch questionnaire responses:', responseError);
      throw responseError;
    }
  },

  // Get opportunity statistics
  async getOpportunityStats(opportunityId: string): Promise<OpportunityStats> {
    const { data, error } = await supabase
      .from('opportunity_grabbers')
      .select('status')
      .eq('opportunity_id', opportunityId);

    if (error) {
      console.error('Error fetching opportunity stats:', error);
      throw error;
    }

    const grabbers = data || [];
    return {
      pending: grabbers.filter(g => g.status === 'pending').length,
      contact_shared: grabbers.filter(g => g.status === 'contact_shared').length,
      questionnaire_sent: grabbers.filter(g => g.status === 'questionnaire_sent').length,
      declined: grabbers.filter(g => g.status === 'declined').length
    };
  },

  // Get pending grabbers for an opportunity
  async getPendingGrabbers(opportunityId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('opportunity_grabbers')
      .select('id')
      .eq('opportunity_id', opportunityId)
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching pending grabbers:', error);
      throw error;
    }

    return data?.map(g => g.id) || [];
  }
}; 