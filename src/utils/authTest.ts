import { supabase } from '../services/supabase'

export const testSupabaseConnection = async () => {
  console.log('Testing Supabase connection...')
  
  try {
    // Test 1: Check if environment variables are loaded
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    console.log('Environment variables:')
    console.log('- VITE_SUPABASE_URL:', url ? '✅ Set' : '❌ Missing')
    console.log('- VITE_SUPABASE_ANON_KEY:', key ? '✅ Set' : '❌ Missing')
    
    if (!url || !key) {
      throw new Error('Missing Supabase environment variables')
    }

    // Test 2: Check if we can connect to Supabase
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Supabase connection error:', error)
      throw error
    }
    
    console.log('✅ Supabase connection successful')
    console.log('Current session:', data.session)
    
    return { success: true, session: data.session }
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return { success: false, error }
  }
}

export const testGoogleAuth = async () => {
  console.log('Testing Google OAuth configuration...')
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) {
      console.error('Google OAuth error:', error)
      throw error
    }
    
    console.log('✅ Google OAuth initiated successfully')
    console.log('OAuth data:', data)
    
    return { success: true, data }
  } catch (error) {
    console.error('❌ Google OAuth failed:', error)
    return { success: false, error }
  }
} 