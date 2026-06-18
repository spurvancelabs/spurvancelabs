import { createBrowserClient } from '@/lib/supabase/client';
import { Notification, NotificationWebSocketMessage } from './types';

export class RealtimeNotificationManager {
  private static instance: RealtimeNotificationManager;
  private channels: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): RealtimeNotificationManager {
    if (!this.instance) {
      this.instance = new RealtimeNotificationManager();
    }
    return this.instance;
  }

  subscribeToUser(userId: string, callback: (notification: Notification) => void) {
    const supabase = createBrowserClient();
    const channelKey = `user:${userId}`;
    
    if (this.channels.has(channelKey)) {
      return this.channels.get(channelKey);
    }

    const channel = supabase
      .channel(channelKey)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload: any) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    this.channels.set(channelKey, channel);
    return channel;
  }

  unsubscribeFromUser(userId: string) {
    const supabase = createBrowserClient();
    const channelKey = `user:${userId}`;
    const channel = this.channels.get(channelKey);
    
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelKey);
    }
  }

  async sendToUser(userId: string, notification: Notification) {
    const supabase = createBrowserClient();
    const channel = supabase.channel(`user:${userId}`);
    await channel.subscribe();
    
    const message: NotificationWebSocketMessage = {
      type: 'notification',
      payload: notification,
    };

    await channel.send({
      type: 'broadcast',
      event: 'notification',
      payload: message,
    });

    await supabase.removeChannel(channel);
  }

  async sendToUsers(userIds: string[], notification: Notification) {
    const promises = userIds.map(userId => this.sendToUser(userId, notification));
    await Promise.all(promises);
  }

  async broadcastToAll(notification: Notification) {
    const supabase = createBrowserClient();
    const channel = supabase.channel('broadcast');
    await channel.subscribe();
    
    const message: NotificationWebSocketMessage = {
      type: 'notification',
      payload: notification,
    };

    await channel.send({
      type: 'broadcast',
      event: 'broadcast_notification',
      payload: message,
    });

    await supabase.removeChannel(channel);
  }

  async notifyRead(userId: string, notificationIds: string[]) {
    const supabase = createBrowserClient();
    const channel = supabase.channel(`user:${userId}`);
    await channel.subscribe();
    
    const message: NotificationWebSocketMessage = {
      type: 'read',
      payload: { notificationIds },
    };

    await channel.send({
      type: 'broadcast',
      event: 'notification_read',
      payload: message,
    });

    await supabase.removeChannel(channel);
  }

  async notifyDelete(userId: string, notificationId: string) {
    const supabase = createBrowserClient();
    const channel = supabase.channel(`user:${userId}`);
    await channel.subscribe();
    
    const message: NotificationWebSocketMessage = {
      type: 'delete',
      payload: { notificationId },
    };

    await channel.send({
      type: 'broadcast',
      event: 'notification_delete',
      payload: message,
    });

    await supabase.removeChannel(channel);
  }

  subscribeToNotification(notificationId: string, callback: (payload: any) => void) {
    const supabase = createBrowserClient();
    const channel = supabase
      .channel(`notification:${notificationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `id=eq.${notificationId}`,
        },
        (payload: any) => {
          callback(payload);
        }
      )
      .subscribe();

    return channel;
  }
}

export async function createNotificationViaRealtime(
  userId: string,
  notification: Notification
) {
  const manager = RealtimeNotificationManager.getInstance();
  await manager.sendToUser(userId, notification);
}