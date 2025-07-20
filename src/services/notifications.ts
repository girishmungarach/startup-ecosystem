import { supabase } from './supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: 'opportunity_grab' | 'connection_request' | 'questionnaire_sent' | 'contact_shared' | 'opportunity_update' | 'system';
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  is_email_sent: boolean;
  created_at: string;
}

export const notificationService = {
  // Get user notifications
  async getUserNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }

    return data || [];
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Create a new notification
  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .insert(notification);

    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }

    return count || 0;
  },

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}; 