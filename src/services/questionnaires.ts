import { supabase } from './supabase';

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'multiple_choice' | 'yes_no';
  options?: string[];
  required?: boolean;
  order?: number;
}

export interface Questionnaire {
  id: string;
  opportunity_id: string;
  sender_id: string;
  recipient_id: string;
  questions: Question[];
  status: 'draft' | 'sent' | 'completed' | 'expired';
  created_at: string;
  sent_at?: string;
  completed_at?: string;
  expires_at?: string;
}

export interface QuestionnaireResponse {
  id: string;
  questionnaire_id: string;
  respondent_id: string;
  answers: Record<string, string>;
  submitted_at: string;
  status: 'draft' | 'submitted';
}

export interface QuestionnaireTemplate {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
  created_by: string;
  created_at: string;
  is_public: boolean;
}

export const questionnairesService = {
  // Create a new questionnaire
  async createQuestionnaire(data: {
    opportunity_id: string;
    recipient_id: string;
    questions: Question[];
    expires_in_days?: number;
  }): Promise<Questionnaire> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const expires_at = data.expires_in_days 
      ? new Date(Date.now() + data.expires_in_days * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // Default 7 days

    const { data: questionnaire, error } = await supabase
      .from('questionnaires')
      .insert({
        opportunity_id: data.opportunity_id,
        sender_id: user.id,
        recipient_id: data.recipient_id,
        questions: data.questions,
        status: 'sent',
        sent_at: new Date().toISOString(),
        expires_at
      })
      .select()
      .single();

    if (error) throw error;
    return questionnaire;
  },

  // Send a questionnaire to a recipient
  async sendQuestionnaire(questionnaireId: string): Promise<void> {
    const { error } = await supabase
      .from('questionnaires')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', questionnaireId);

    if (error) throw error;
  },

  // Get questionnaires sent by the current user
  async getSentQuestionnaires(): Promise<Questionnaire[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('questionnaires')
      .select(`
        *,
        opportunity:opportunities(title, company),
        recipient:profiles!questionnaires_recipient_id_fkey(name, role, company)
      `)
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get questionnaires received by the current user
  async getReceivedQuestionnaires(): Promise<Questionnaire[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('questionnaires')
      .select(`
        *,
        opportunity:opportunities(title, company),
        sender:profiles!questionnaires_sender_id_fkey(name, role, company)
      `)
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get a specific questionnaire by ID
  async getQuestionnaire(id: string): Promise<Questionnaire | null> {
    const { data, error } = await supabase
      .from('questionnaires')
      .select(`
        *,
        opportunity:opportunities(title, company, description),
        sender:profiles!questionnaires_sender_id_fkey(name, role, company),
        recipient:profiles!questionnaires_recipient_id_fkey(name, role, company)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Submit a questionnaire response
  async submitResponse(data: {
    questionnaire_id: string;
    answers: Record<string, string>;
  }): Promise<QuestionnaireResponse> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: response, error } = await supabase
      .from('questionnaire_responses')
      .insert({
        questionnaire_id: data.questionnaire_id,
        respondent_id: user.id,
        answers: data.answers,
        submitted_at: new Date().toISOString(),
        status: 'submitted'
      })
      .select()
      .single();

    if (error) throw error;

    // Update questionnaire status to completed
    await supabase
      .from('questionnaires')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', data.questionnaire_id);

    return response;
  },

  // Save a draft response
  async saveDraftResponse(data: {
    questionnaire_id: string;
    answers: Record<string, string>;
  }): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if draft already exists
    const { data: existingDraft } = await supabase
      .from('questionnaire_responses')
      .select('id')
      .eq('questionnaire_id', data.questionnaire_id)
      .eq('respondent_id', user.id)
      .eq('status', 'draft')
      .single();

    if (existingDraft) {
      // Update existing draft
      const { error } = await supabase
        .from('questionnaire_responses')
        .update({
          answers: data.answers,
          submitted_at: new Date().toISOString()
        })
        .eq('id', existingDraft.id);

      if (error) throw error;
    } else {
      // Create new draft
      const { error } = await supabase
        .from('questionnaire_responses')
        .insert({
          questionnaire_id: data.questionnaire_id,
          respondent_id: user.id,
          answers: data.answers,
          submitted_at: new Date().toISOString(),
          status: 'draft'
        });

      if (error) throw error;
    }
  },

  // Get a questionnaire response
  async getResponse(questionnaireId: string): Promise<QuestionnaireResponse | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('questionnaire_id', questionnaireId)
      .eq('respondent_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Get responses for questionnaires sent by the current user
  async getQuestionnaireResponses(): Promise<Array<Questionnaire & { response?: QuestionnaireResponse }>> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('questionnaires')
      .select(`
        *,
        opportunity:opportunities(title, company),
        recipient:profiles!questionnaires_recipient_id_fkey(name, role, company),
        response:questionnaire_responses(*)
      `)
      .eq('sender_id', user.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create a questionnaire template
  async createTemplate(data: {
    name: string;
    description?: string;
    questions: Question[];
    is_public?: boolean;
  }): Promise<QuestionnaireTemplate> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: template, error } = await supabase
      .from('questionnaire_templates')
      .insert({
        name: data.name,
        description: data.description,
        questions: data.questions,
        created_by: user.id,
        is_public: data.is_public || false
      })
      .select()
      .single();

    if (error) throw error;
    return template;
  },

  // Get questionnaire templates
  async getTemplates(): Promise<QuestionnaireTemplate[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('questionnaire_templates')
      .select('*')
      .or(`created_by.eq.${user.id},is_public.eq.true`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Delete a questionnaire template
  async deleteTemplate(templateId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('questionnaire_templates')
      .delete()
      .eq('id', templateId)
      .eq('created_by', user.id);

    if (error) throw error;
  },

  // Share contact details after reviewing questionnaire response
  async shareContactAfterReview(questionnaireId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get the questionnaire to find the recipient
    const questionnaire = await this.getQuestionnaire(questionnaireId);
    if (!questionnaire) throw new Error('Questionnaire not found');

    // Create a connection record
    const { error } = await supabase
      .from('connections')
      .insert({
        user_id: user.id,
        connected_user_id: questionnaire.recipient_id,
        opportunity_id: questionnaire.opportunity_id,
        status: 'active',
        connection_type: 'questionnaire_response'
      });

    if (error) throw error;
  },

  // Decline to share contact after reviewing questionnaire response
  async declineContactAfterReview(questionnaireId: string, reason?: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get the questionnaire to find the recipient
    const questionnaire = await this.getQuestionnaire(questionnaireId);
    if (!questionnaire) throw new Error('Questionnaire not found');

    // Create a declined connection record
    const { error } = await supabase
      .from('connections')
      .insert({
        user_id: user.id,
        connected_user_id: questionnaire.recipient_id,
        opportunity_id: questionnaire.opportunity_id,
        status: 'declined',
        connection_type: 'questionnaire_response',
        decline_reason: reason
      });

    if (error) throw error;
  }
}; 