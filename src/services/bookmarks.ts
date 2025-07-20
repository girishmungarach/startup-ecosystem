import { supabase } from './supabase';

export interface Bookmark {
  id: string;
  user_id: string;
  item_id: string;
  type: 'profile' | 'job' | 'investment' | 'event';
  created_at: string;
  // Joined data
  profile?: any;
  job?: any;
  investment?: any;
  event?: any;
}

export interface BookmarkFilters {
  type?: 'profile' | 'job' | 'investment' | 'event';
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
        profiles!inner(*),
        jobs!inner(*),
        investments!inner(*),
        events!inner(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Apply type filter
    if (filters?.type) {
      query = query.eq('type', filters.type);
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
  async getBookmarksByType(userId: string, type: 'profile' | 'job' | 'investment' | 'event'): Promise<Bookmark[]> {
    const { data, error } = await supabase
      .from('bookmarks')
      .select(`
        *,
        ${type}s!inner(*)
      `)
      .eq('user_id', userId)
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching ${type} bookmarks:`, error);
      throw error;
    }

    return data || [];
  },

  // Add a bookmark
  async addBookmark(userId: string, itemId: string, itemType: 'profile' | 'job' | 'investment' | 'event'): Promise<void> {
    const { error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        item_id: itemId,
        type: itemType
      });

    if (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  },

  // Remove a bookmark
  async removeBookmark(userId: string, itemId: string, itemType: 'profile' | 'job' | 'investment' | 'event'): Promise<void> {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .eq('type', itemType);

    if (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  },

  // Toggle bookmark (add if not exists, remove if exists)
  async toggleBookmark(userId: string, itemId: string, itemType: 'profile' | 'job' | 'investment' | 'event'): Promise<boolean> {
    // Check if bookmark exists
    const { data: existingBookmark } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .eq('type', itemType)
      .single();

    if (existingBookmark) {
      // Remove bookmark
      await this.removeBookmark(userId, itemId, itemType);
      return false; // Bookmark was removed
    } else {
      // Add bookmark
      await this.addBookmark(userId, itemId, itemType);
      return true; // Bookmark was added
    }
  },

  // Check if an item is bookmarked
  async isBookmarked(userId: string, itemId: string, itemType: 'profile' | 'job' | 'investment' | 'event'): Promise<boolean> {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .eq('type', itemType)
      .single();

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
      .select('type, created_at')
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
      byType[bookmark.type] = (byType[bookmark.type] || 0) + 1;
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