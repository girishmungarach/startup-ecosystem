import { supabase } from './supabase';

export interface Bookmark {
  id: string;
  user_id: string;
  bookmarked_user_id: string;
  bookmark_type: 'profile' | 'opportunity';
  opportunity_id?: string;
  notes?: string;
  created_at: string;
  // Joined data
  bookmarked_profile?: any;
  opportunity?: any;
}

export interface BookmarkFilters {
  type?: 'profile' | 'opportunity';
  search?: string;
  date_range?: {
    start: string;
    end: string;
  };
}

export const bookmarksService = {
  // Get all bookmarks for a user with optional filters
  async getBookmarks(userId: string, filters?: BookmarkFilters): Promise<Bookmark[]> {
    let query = supabase
      .from('bookmarks')
      .select(`
        *,
        bookmarked_profile:profiles!bookmarks_bookmarked_user_id_fkey (
          id,
          full_name,
          email,
          company,
          role,
          building,
          interests,
          avatar_url,
          bio,
          location
        ),
        opportunity:opportunities (
          id,
          title,
          type,
          company,
          description,
          location
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Apply type filter
    if (filters?.type) {
      query = query.eq('bookmark_type', filters.type);
    }

    // Apply date range filter
    if (filters?.date_range) {
      query = query
        .gte('created_at', filters.date_range.start)
        .lte('created_at', filters.date_range.end);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching bookmarks:', error);
      throw error;
    }

    return data || [];
  },

  // Get bookmarks by type
  async getBookmarksByType(userId: string, type: 'profile' | 'opportunity'): Promise<Bookmark[]> {
    const { data, error } = await supabase
      .from('bookmarks')
      .select(`
        *,
        bookmarked_profile:profiles!bookmarks_bookmarked_user_id_fkey (
          id,
          full_name,
          email,
          company,
          role,
          building,
          interests,
          avatar_url,
          bio,
          location
        ),
        opportunity:opportunities (
          id,
          title,
          type,
          company,
          description,
          location
        )
      `)
      .eq('user_id', userId)
      .eq('bookmark_type', type)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching ${type} bookmarks:`, error);
      throw error;
    }

    return data || [];
  },

  // Add a bookmark
  async addBookmark(userId: string, bookmarkedUserId: string, bookmarkType: 'profile' | 'opportunity', opportunityId?: string): Promise<void> {
    const { error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        bookmarked_user_id: bookmarkedUserId,
        bookmark_type: bookmarkType,
        opportunity_id: opportunityId
      });

    if (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  },

  // Remove a bookmark
  async removeBookmark(userId: string, bookmarkedUserId: string, bookmarkType: 'profile' | 'opportunity', opportunityId?: string): Promise<void> {
    let query = supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('bookmarked_user_id', bookmarkedUserId)
      .eq('bookmark_type', bookmarkType);

    if (opportunityId) {
      query = query.eq('opportunity_id', opportunityId);
    }

    const { error } = await query;

    if (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  },

  // Toggle bookmark (add if not exists, remove if exists)
  async toggleBookmark(userId: string, bookmarkedUserId: string, bookmarkType: 'profile' | 'opportunity', opportunityId?: string): Promise<boolean> {
    // Check if bookmark exists
    let query = supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('bookmarked_user_id', bookmarkedUserId)
      .eq('bookmark_type', bookmarkType);

    if (opportunityId) {
      query = query.eq('opportunity_id', opportunityId);
    }

    const { data: existingBookmark } = await query.single();

    if (existingBookmark) {
      // Remove bookmark
      await this.removeBookmark(userId, bookmarkedUserId, bookmarkType, opportunityId);
      return false; // Bookmark was removed
    } else {
      // Add bookmark
      await this.addBookmark(userId, bookmarkedUserId, bookmarkType, opportunityId);
      return true; // Bookmark was added
    }
  },

  // Check if an item is bookmarked
  async isBookmarked(userId: string, bookmarkedUserId: string, bookmarkType: 'profile' | 'opportunity', opportunityId?: string): Promise<boolean> {
    let query = supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('bookmarked_user_id', bookmarkedUserId)
      .eq('bookmark_type', bookmarkType);

    if (opportunityId) {
      query = query.eq('opportunity_id', opportunityId);
    }

    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking bookmark status:', error);
      throw error;
    }

    return !!data;
  },

  // Get bookmark statistics
  async getBookmarkStats(userId: string): Promise<{
    total: number;
    byType: Record<string, number>;
    recent: number; // Last 7 days
  }> {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('bookmark_type, created_at')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching bookmark stats:', error);
      throw error;
    }

    const bookmarks = data || [];
    const byType: Record<string, number> = {};
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    bookmarks.forEach(bookmark => {
      byType[bookmark.bookmark_type] = (byType[bookmark.bookmark_type] || 0) + 1;
    });

    const recent = bookmarks.filter(bookmark => 
      new Date(bookmark.created_at) > sevenDaysAgo
    ).length;

    return {
      total: bookmarks.length,
      byType,
      recent
    };
  },

  // Bulk operations
  async bulkRemoveBookmarks(userId: string, bookmarkIds: string[]): Promise<void> {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .in('id', bookmarkIds);

    if (error) {
      console.error('Error bulk removing bookmarks:', error);
      throw error;
    }
  },

  // Export bookmarks (for future feature)
  async exportBookmarks(userId: string, format: 'json' | 'csv' = 'json'): Promise<any> {
    const bookmarks = await this.getBookmarks(userId);
    
    if (format === 'json') {
      return bookmarks;
    } else if (format === 'csv') {
      // Convert to CSV format
      const headers = ['Type', 'Title', 'Description', 'Date Added'];
      const rows = bookmarks.map(bookmark => {
        const item = bookmark.profile || bookmark.job || bookmark.investment || bookmark.event;
        return [
          bookmark.type,
          item?.title || item?.name || 'N/A',
          item?.description || 'N/A',
          new Date(bookmark.created_at).toLocaleDateString()
        ];
      });
      
      return [headers, ...rows];
    }
  }
}; 