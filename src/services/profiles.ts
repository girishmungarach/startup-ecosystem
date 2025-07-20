import { supabase } from './supabase';
import { bookmarksService } from './bookmarks';

export interface Profile {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  role: string;
  company: string;
  building: string;
  interests: string[];
  opportunities: string[];
  avatar_url?: string;
  bio?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  location?: string;
  experience_years?: number;
  skills: string[];
  is_verified: boolean;
  is_public: boolean;
  last_active: string;
  created_at: string;
  updated_at: string;
  // Computed fields for UI
  name?: string;
  current_project?: string;
  building_status?: 'Actively building' | 'Exploring ideas' | 'Looking for opportunities';
  profile_image?: string;
  github_url?: string;
  // Joined data for bookmarks
  is_bookmarked?: boolean;
}

export interface ProfileFilters {
  search?: string;
  roles?: string[];
  interests?: string[];
  building_status?: string[];
}

export const profilesService = {
  // Get all profiles with optional filters
  async getProfiles(filters?: ProfileFilters, userId?: string): Promise<Profile[]> {
    let query = supabase
      .from('profiles')
      .select(`
        *,
        bookmarks!inner(user_id)
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,company.ilike.%${filters.search}%,current_project.ilike.%${filters.search}%`);
    }

    if (filters?.roles && filters.roles.length > 0) {
      query = query.in('role', filters.roles);
    }

    if (filters?.interests && filters.interests.length > 0) {
      query = query.overlaps('interests', filters.interests);
    }

    if (filters?.building_status && filters.building_status.length > 0) {
      query = query.in('building_status', filters.building_status);
    }

    // Filter by user bookmarks if userId provided
    if (userId) {
      query = query.eq('bookmarks.user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }

    return data || [];
  },

  // Get a single profile by ID
  async getProfileById(profileId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    if (!data) return null;

    // Transform database fields to UI fields
    return {
      ...data,
      name: data.full_name,
      current_project: data.building,
      building_status: 'Actively building', // Default value since we don't have this field
      profile_image: data.avatar_url,
      github_url: undefined, // We don't have this field in DB
    };
  },

  // Get profiles with bookmark status for a user
  async getProfilesWithBookmarks(userId: string, filters?: ProfileFilters): Promise<Profile[]> {
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,company.ilike.%${filters.search}%,building.ilike.%${filters.search}%`);
    }

    if (filters?.roles && filters.roles.length > 0) {
      query = query.in('role', filters.roles);
    }

    if (filters?.interests && filters.interests.length > 0) {
      query = query.overlaps('interests', filters.interests);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching profiles with bookmarks:', error);
      throw error;
    }

    // Transform and get bookmark status for each profile
    const profiles = data || [];
    const profilesWithBookmarks = await Promise.all(
      profiles.map(async (profile) => {
        const isBookmarked = await bookmarksService.isBookmarked(userId, profile.id, 'profile');
        
        // Transform database fields to UI fields
        return {
          ...profile,
          name: profile.full_name,
          current_project: profile.building,
          building_status: 'Actively building', // Default value since we don't have this field
          profile_image: profile.avatar_url,
          github_url: undefined, // We don't have this field in DB
          is_bookmarked: isBookmarked
        };
      })
    );

    return profilesWithBookmarks;
  },



  // Get available roles
  async getAvailableRoles(): Promise<string[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .not('role', 'is', null);

    if (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }

    const roles = data?.map(item => item.role) || [];
    return [...new Set(roles)]; // Remove duplicates
  },

  // Get available interests
  async getAvailableInterests(): Promise<string[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('interests')
      .not('interests', 'is', null);

    if (error) {
      console.error('Error fetching interests:', error);
      throw error;
    }

    const allInterests = data?.flatMap(item => item.interests || []) || [];
    return [...new Set(allInterests)]; // Remove duplicates
  },

  // Get profile statistics
  async getProfileStats(): Promise<{
    total: number;
    byRole: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    const { data, error } = await supabase
      .from('profiles')
      .select('role, building_status');

    if (error) {
      console.error('Error fetching profile stats:', error);
      throw error;
    }

    const profiles = data || [];
    const byRole: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    profiles.forEach(profile => {
      byRole[profile.role] = (byRole[profile.role] || 0) + 1;
      byStatus[profile.building_status] = (byStatus[profile.building_status] || 0) + 1;
    });

    return {
      total: profiles.length,
      byRole,
      byStatus
    };
  }
}; 