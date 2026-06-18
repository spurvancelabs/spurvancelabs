'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { Notification, NotificationFilter, NotificationStats } from '@/lib/notification/types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  stats: NotificationStats | null;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (filter?: NotificationFilter, page?: number) => Promise<void>;
  markAsRead: (notificationIds: string[]) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  updateNotification: (notification: Notification) => void;
  removeNotification: (notificationId: string) => void;
  refetchStats: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children, userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (filter?: NotificationFilter, page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filter?.type) {
        params.append('type', Array.isArray(filter.type) ? filter.type.join(',') : filter.type);
      }
      if (filter?.read !== undefined) {
        params.append('read', filter.read.toString());
      }
      if (filter?.priority) {
        params.append('priority', Array.isArray(filter.priority) ? filter.priority.join(',') : filter.priority);
      }
      if (filter?.from) {
        params.append('from', filter.from);
      }
      if (filter?.to) {
        params.append('to', filter.to);
      }
      if (filter?.search) {
        params.append('search', filter.search);
      }
      params.append('page', page.toString());

      const response = await fetch(`/api/notifications/list?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.notifications);
      
      const unread = data.notifications.filter((n: Notification) => !n.read).length;
      setUnreadCount(unread);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
      setUnreadCount(data.unread);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  }, []);

  const markAsRead = useCallback(async (notificationIds: string[]) => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notification_ids: notificationIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark notifications as read');
      }

      setNotifications(prev =>
        prev.map(n =>
          notificationIds.includes(n.id) ? { ...n, read: true, read_at: new Date().toISOString() } : n
        )
      );

      setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
      await refetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notifications as read');
      throw err;
    }
  }, [refetchStats]);

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mark_all: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
      await refetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read');
      throw err;
    }
  }, [refetchStats]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/delete?id=${notificationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      await refetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
      throw err;
    }
  }, [refetchStats]);

  const deleteAllNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/delete?deleteAll=true', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete all notifications');
      }

      setNotifications([]);
      setUnreadCount(0);
      await refetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete all notifications');
      throw err;
    }
  }, [refetchStats]);

  // Set up real-time subscription when userId changes
  useEffect(() => {
    if (!userId) return;

    const supabase = createBrowserClient();
    const channel = supabase
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
          setNotifications(prev => [notification, ...prev]);
          if (!notification.read) {
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  const updateNotification = useCallback((notification: Notification) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? notification : n))
    );
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const value = {
    notifications,
    unreadCount,
    stats,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    addNotification,
    updateNotification,
    removeNotification,
    refetchStats,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};