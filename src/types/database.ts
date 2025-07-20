export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          company: string | null
          role: string | null
          interests: string[] | null
          building: string | null
          opportunities: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          company?: string | null
          role?: string | null
          interests?: string[] | null
          building?: string | null
          opportunities?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          company?: string | null
          role?: string | null
          interests?: string[] | null
          building?: string | null
          opportunities?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      opportunities: {
        Row: {
          id: string
          user_id: string
          title: string
          type: string
          location: string | null
          description: string
          requirements: string | null
          compensation: string | null
          contact_preference: string
          screening_questions: any | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          type: string
          location?: string | null
          description: string
          requirements?: string | null
          compensation?: string | null
          contact_preference: string
          screening_questions?: any | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          type?: string
          location?: string | null
          description?: string
          requirements?: string | null
          compensation?: string | null
          contact_preference?: string
          screening_questions?: any | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      opportunity_grabs: {
        Row: {
          id: string
          opportunity_id: string
          user_id: string
          status: string
          questionnaire_responses: any | null
          created_at: string
        }
        Insert: {
          id?: string
          opportunity_id: string
          user_id: string
          status?: string
          questionnaire_responses?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          opportunity_id?: string
          user_id?: string
          status?: string
          questionnaire_responses?: any | null
          created_at?: string
        }
      }
      connections: {
        Row: {
          id: string
          requester_id: string
          responder_id: string
          opportunity_id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          responder_id: string
          opportunity_id: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          responder_id?: string
          opportunity_id?: string
          status?: string
          created_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          profile_id: string
          tags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          profile_id: string
          tags?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          profile_id?: string
          tags?: string[] | null
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Opportunity = Database['public']['Tables']['opportunities']['Row']
export type OpportunityGrab = Database['public']['Tables']['opportunity_grabs']['Row']
export type Connection = Database['public']['Tables']['connections']['Row']
export type Bookmark = Database['public']['Tables']['bookmarks']['Row'] 