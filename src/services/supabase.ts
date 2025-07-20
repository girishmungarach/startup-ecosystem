import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
    })
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  },

  signInWithGoogle: async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  },

  signOut: async () => {
    return await supabase.auth.signOut()
  },

  getCurrentUser: async () => {
    return await supabase.auth.getUser()
  },

  getSession: async () => {
    return await supabase.auth.getSession()
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Profile helpers
export const profiles = {
  getProfile: async (userId: string) => {
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
  },

  createProfile: async (profile: Database['public']['Tables']['profiles']['Insert']) => {
    return await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()
  },

  updateProfile: async (userId: string, updates: Database['public']['Tables']['profiles']['Update']) => {
    return await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
  }
}

// Opportunities helpers
export const opportunities = {
  getAll: async () => {
    return await supabase
      .from('opportunities')
      .select(`
        *,
        profiles!opportunities_user_id_fkey (
          full_name,
          company,
          role
        )
      `)
      .order('created_at', { ascending: false })
  },

  getByUser: async (userId: string) => {
    return await supabase
      .from('opportunities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  create: async (opportunity: Database['public']['Tables']['opportunities']['Insert']) => {
    return await supabase
      .from('opportunities')
      .insert(opportunity)
      .select()
      .single()
  },

  update: async (id: string, updates: Database['public']['Tables']['opportunities']['Update']) => {
    return await supabase
      .from('opportunities')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
  },

  delete: async (id: string) => {
    return await supabase
      .from('opportunities')
      .delete()
      .eq('id', id)
  }
}

// Opportunity grabs helpers
export const opportunityGrabs = {
  create: async (grab: Database['public']['Tables']['opportunity_grabs']['Insert']) => {
    return await supabase
      .from('opportunity_grabs')
      .insert(grab)
      .select()
      .single()
  },

  getByOpportunity: async (opportunityId: string) => {
    return await supabase
      .from('opportunity_grabs')
      .select(`
        *,
        profiles!opportunity_grabs_user_id_fkey (
          full_name,
          company,
          role,
          building
        )
      `)
      .eq('opportunity_id', opportunityId)
      .order('created_at', { ascending: false })
  },

  update: async (id: string, updates: Database['public']['Tables']['opportunity_grabs']['Update']) => {
    return await supabase
      .from('opportunity_grabs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
  }
}

// Connections helpers
export const connections = {
  create: async (connection: Database['public']['Tables']['connections']['Insert']) => {
    return await supabase
      .from('connections')
      .insert(connection)
      .select()
      .single()
  },

  getByUser: async (userId: string) => {
    return await supabase
      .from('connections')
      .select(`
        *,
        profiles!connections_requester_id_fkey (
          full_name,
          company,
          role
        ),
        profiles!connections_responder_id_fkey (
          full_name,
          company,
          role
        ),
        opportunities!connections_opportunity_id_fkey (
          title,
          type
        )
      `)
      .or(`requester_id.eq.${userId},responder_id.eq.${userId}`)
      .order('created_at', { ascending: false })
  }
}

// Bookmarks helpers
export const bookmarks = {
  create: async (bookmark: Database['public']['Tables']['bookmarks']['Insert']) => {
    return await supabase
      .from('bookmarks')
      .insert(bookmark)
      .select()
      .single()
  },

  getByUser: async (userId: string) => {
    return await supabase
      .from('bookmarks')
      .select(`
        *,
        profiles!bookmarks_profile_id_fkey (
          full_name,
          company,
          role,
          building
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  delete: async (id: string) => {
    return await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
  }
} 