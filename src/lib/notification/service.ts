import { getSupabaseAdminClient } from '@/lib/supabase/server';
import {
  Notification,
  CreateNotificationInput,
  NotificationFilter,
  NotificationStats,
  NotificationPreferences,
} from './types';

export class NotificationService {
  static async getNotifications(
    userId: string,
    filter: NotificationFilter = {},
    page: number = 1,
    limit: number = 20
  ) {
    const supabase = getSupabaseAdminClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filter.type) {
      if (Array.isArray(filter.type)) {
        query = query.in('type', filter.type);
      } else {
        query = query.eq('type', filter.type);
      }
    }

    if (filter.read !== undefined) {
      query = query.eq('read', filter.read);
    }

    if (filter.priority) {
      if (Array.isArray(filter.priority)) {
        query = query.in('priority', filter.priority);
      } else {
        query = query.eq('priority', filter.priority);
      }
    }

    if (filter.from) {
      query = query.gte('created_at', filter.from);
    }

    if (filter.to) {
      query = query.lte('created_at', filter.to);
    }

    if (filter.search) {
      query = query.or(`title.ilike.%${filter.search}%,message.ilike.%${filter.search}%`);
    }

    query = query.range(from, to);

    const { data: notifications, count, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch notifications: ${error.message}`);
    }

    return {
      notifications: notifications || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: count ? Math.ceil(count / limit) : 0,
      },
    };
  }

  static async createNotification(input: CreateNotificationInput): Promise<Notification> {
    const supabase = getSupabaseAdminClient();
    
    const notificationData = {
      user_id: input.user_id,
      type: input.type,
      title: input.title,
      message: input.message,
      priority: input.priority || 'medium',
      read: false,
      data: input.data || {},
      link: input.link || null,
      sender_id: input.sender_id || null,
      sender_name: input.sender_name || null,
      sender_avatar: input.sender_avatar || null,
      expires_at: input.expires_at || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: notification, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }

    return notification;
  }

  static async markAsRead(userId: string, notificationIds: string[]): Promise<number> {
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        read: true, 
        read_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .in('id', notificationIds)
      .eq('user_id', userId)
      .select();

    if (error) {
      throw new Error(`Failed to mark notifications as read: ${error.message}`);
    }

    return data?.length || 0;
  }

  static async markAllAsRead(userId: string): Promise<number> {
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        read: true, 
        read_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('read', false)
      .select();

    if (error) {
      throw new Error(`Failed to mark all notifications as read: ${error.message}`);
    }

    return data?.length || 0;
  }

  static async deleteNotification(userId: string, notificationId: string): Promise<boolean> {
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId)
      .select();

    if (error) {
      throw new Error(`Failed to delete notification: ${error.message}`);
    }

    return (data?.length || 0) > 0;
  }

  static async deleteAllNotifications(userId: string): Promise<number> {
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .select();

    if (error) {
      throw new Error(`Failed to delete all notifications: ${error.message}`);
    }

    return data?.length || 0;
  }

  static async getStats(userId: string): Promise<NotificationStats> {
    const supabase = getSupabaseAdminClient();

    // Get total and unread counts
    const { data: totalData, error: totalError, count: totalCount } = await supabase
      .from('notifications')
      .select('id', { count: 'exact' })
      .eq('user_id', userId);

    if (totalError) {
      throw new Error(`Failed to get stats: ${totalError.message}`);
    }

    const { data: unreadData, error: unreadError, count: unreadCount } = await supabase
      .from('notifications')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('read', false);

    if (unreadError) {
      throw new Error(`Failed to get stats: ${unreadError.message}`);
    }

    // Get counts by type
    const { data: typeData, error: typeError } = await supabase
      .from('notifications')
      .select('type')
      .eq('user_id', userId);

    if (typeError) {
      throw new Error(`Failed to get stats by type: ${typeError.message}`);
    }

    const byType = typeData?.reduce((acc: any, curr: any) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {});

    // Get counts by priority
    const { data: priorityData, error: priorityError } = await supabase
      .from('notifications')
      .select('priority')
      .eq('user_id', userId);

    if (priorityError) {
      throw new Error(`Failed to get stats by priority: ${priorityError.message}`);
    }

    const byPriority = priorityData?.reduce((acc: any, curr: any) => {
      acc[curr.priority] = (acc[curr.priority] || 0) + 1;
      return acc;
    }, {});

    const stats: NotificationStats = {
      total: totalCount || 0,
      unread: unreadCount || 0,
      by_type: byType || {},
      by_priority: byPriority || {},
    };

    return stats;
  }

  static async getPreferences(userId: string): Promise<NotificationPreferences | null> {
    const supabase = getSupabaseAdminClient();
    
    const { data: preferences, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get preferences: ${error.message}`);
    }

    return preferences;
  }

  static async updatePreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const supabase = getSupabaseAdminClient();
    const now = new Date().toISOString();
    
    // Check if preferences exist
    const existing = await this.getPreferences(userId);
    
    let result;
    if (existing) {
      const { data, error } = await supabase
        .from('notification_preferences')
        .update({
          ...preferences,
          updated_at: now
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update preferences: ${error.message}`);
      }
      result = data;
    } else {
      const { data, error } = await supabase
        .from('notification_preferences')
        .insert({
          user_id: userId,
          email: preferences.email ?? true,
          push: preferences.push ?? true,
          in_app: preferences.in_app ?? true,
          types: preferences.types || {},
          quiet_hours: preferences.quiet_hours || null,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create preferences: ${error.message}`);
      }
      result = data;
    }

    return result;
  }

  static async getUnreadCount(userId: string): Promise<number> {
    const supabase = getSupabaseAdminClient();
    
    const { data, error, count } = await supabase
      .from('notifications')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      throw new Error(`Failed to get unread count: ${error.message}`);
    }

    return count || 0;
  }

  static async cleanupExpired(): Promise<number> {
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('notifications')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select();

    if (error) {
      throw new Error(`Failed to cleanup expired notifications: ${error.message}`);
    }

    return data?.length || 0;
  }
}