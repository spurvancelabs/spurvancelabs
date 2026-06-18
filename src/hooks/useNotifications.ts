'use client';

import { useEffect, useState, useCallback } from 'react';
import { useNotificationContext } from '@/context/NotificationContext';
import { Notification, NotificationFilter } from '@/lib/notification/types';
import { createBrowserClient } from '@/lib/supabase/client';

export function useNotifications() {
  const context = useNotificationContext();

  // Fetch notifications on mount - fetchNotifications and refetchStats are stable due to useCallback
  useEffect(() => {
    context.fetchNotifications({ read: false }, 1);
    context.refetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...context,
    recentNotifications: context.notifications.slice(0, 5),
  };
}

export function useRealtimeNotifications(userId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const { addNotification } = useNotificationContext();

  useEffect(() => {
    if (!userId) return;

    const supabase = createBrowserClient();
    const notificationChannel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const notification = payload.new as Notification;
          addNotification(notification);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(notificationChannel);
    };
  }, [userId, addNotification]);

  return { isConnected };
}

export function useNotificationFilter() {
  const [filter, setFilter] = useState<NotificationFilter>({});
  const { fetchNotifications } = useNotificationContext();

  const applyFilter = useCallback((newFilter: NotificationFilter) => {
    setFilter(newFilter);
    fetchNotifications(newFilter, 1);
  }, [fetchNotifications]);

  const clearFilter = useCallback(() => {
    setFilter({});
    fetchNotifications({}, 1);
  }, [fetchNotifications]);

  return {
    filter,
    applyFilter,
    clearFilter,
  };
}

export function useNotificationStats() {
  const { stats, refetchStats } = useNotificationContext();

  useEffect(() => {
    refetchStats();
  }, [refetchStats]);

  return stats;
}

export function useUnreadCount() {
  const { unreadCount, refetchStats } = useNotificationContext();

  useEffect(() => {
    refetchStats();
  }, [refetchStats]);

  return unreadCount;
}