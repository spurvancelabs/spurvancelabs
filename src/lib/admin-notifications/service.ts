import { getSupabaseAdminClient } from '@/lib/supabase/server';
import {
  AdminNotification,
  AdminNotificationFilter,
  AdminNotificationStats,
  CreateAdminNotificationInput,
} from './types';

export class AdminNotificationService {
  /**
   * Fan out a notification to every admin user in admin_users.
   * Best effort: callers should wrap in try/catch so notification failures
   * never break the main business flow.
   */
  static async notifyAdmins(input: CreateAdminNotificationInput): Promise<number> {
    const supabase = getSupabaseAdminClient();

    const { data: admins } = await supabase
      .from('admin_users')
      .select('user_id');

    const ids = (admins || [])
      .map((a: any) => a.user_id)
      .filter((id: unknown): id is string => typeof id === 'string' && id.length > 0);

    if (ids.length === 0) return 0;

    const now = new Date().toISOString();
    const rows = ids.map((recipient_user_id) => ({
      recipient_user_id,
      type: input.type,
      title: input.title,
      message: input.message,
      priority: input.priority || 'medium',
      link: input.link || null,
      data: input.data || {},
      created_at: now,
      updated_at: now,
    }));

    const { error } = await supabase.from('admin_notifications').insert(rows);
    if (error) {
      throw new Error(`Failed to create admin notifications: ${error.message}`);
    }

    return rows.length;
  }

  static async getNotifications(
    recipientUserId: string,
    filter: AdminNotificationFilter = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{ notifications: AdminNotification[]; total: number; totalPages: number }> {
    const supabase = getSupabaseAdminClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('admin_notifications')
      .select('*', { count: 'exact' })
      .eq('recipient_user_id', recipientUserId)
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

    if (filter.search) {
      query = query.or(`title.ilike.%${filter.search}%,message.ilike.%${filter.search}%`);
    }

    query = query.range(from, to) as any;

    const { data, count, error } = await query;
    if (error) {
      throw new Error(`Failed to fetch admin notifications: ${error.message}`);
    }

    return {
      notifications: (data || []) as AdminNotification[],
      total: count || 0,
      totalPages: count ? Math.ceil(count / limit) : 0,
    };
  }

  static async getStats(recipientUserId: string): Promise<AdminNotificationStats> {
    const supabase = getSupabaseAdminClient();

    const { count: total, error: totalError } = await supabase
      .from('admin_notifications')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_user_id', recipientUserId);

    if (totalError) {
      throw new Error(`Failed to fetch admin notification stats: ${totalError.message}`);
    }

    const { count: unread, error: unreadError } = await supabase
      .from('admin_notifications')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_user_id', recipientUserId)
      .eq('read', false);

    if (unreadError) {
      throw new Error(`Failed to fetch admin notification stats: ${unreadError.message}`);
    }

    return {
      total: total || 0,
      unread: unread || 0,
    };
  }

  static async markAsRead(recipientUserId: string, notificationIds: string[]): Promise<number> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from('admin_notifications')
      .update({
        read: true,
        read_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .in('id', notificationIds)
      .eq('recipient_user_id', recipientUserId)
      .select();

    if (error) {
      throw new Error(`Failed to mark admin notifications as read: ${error.message}`);
    }

    return data?.length || 0;
  }

  static async markAllAsRead(recipientUserId: string): Promise<number> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from('admin_notifications')
      .update({
        read: true,
        read_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('recipient_user_id', recipientUserId)
      .eq('read', false)
      .select();

    if (error) {
      throw new Error(`Failed to mark all admin notifications as read: ${error.message}`);
    }

    return data?.length || 0;
  }

  static async deleteNotification(recipientUserId: string, notificationId: string): Promise<boolean> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from('admin_notifications')
      .delete()
      .eq('id', notificationId)
      .eq('recipient_user_id', recipientUserId)
      .select();

    if (error) {
      throw new Error(`Failed to delete admin notification: ${error.message}`);
    }

    return (data?.length || 0) > 0;
  }

  static async deleteAllNotifications(recipientUserId: string): Promise<number> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from('admin_notifications')
      .delete()
      .eq('recipient_user_id', recipientUserId)
      .select();

    if (error) {
      throw new Error(`Failed to delete all admin notifications: ${error.message}`);
    }

    return data?.length || 0;
  }
}
