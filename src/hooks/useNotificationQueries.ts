'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Notification, NotificationFilter, NotificationStats } from '@/lib/notification/types';
import {
  fetchNotifications,
  fetchNotificationStats,
  markNotificationsAsRead,
  markAllNotificationsAsRead,
  deleteNotification as deleteNotificationApi,
  deleteAllNotifications as deleteAllNotificationsApi,
} from '@/lib/notification/api';

export const useNotifications = (filter?: NotificationFilter, page: number = 1) => {
  return useQuery<Notification[], Error>({
    queryKey: ['notifications', filter, page],
    queryFn: async () => {
      const data = await fetchNotifications(filter, page);
      return Array.isArray((data as any)?.notifications) ? (data as any).notifications : [];
    },
    staleTime: 30_000,
  });
};

export const useNotificationStats = () => {
  return useQuery<NotificationStats, Error>({
    queryKey: ['notification-stats'],
    queryFn: fetchNotificationStats,
    staleTime: 30_000,
  });
};

export const useUnreadCount = () => {
  const { data: stats } = useNotificationStats();
  return stats?.unread ?? 0;
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotificationApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
    },
  });
};

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllNotificationsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
    },
  });
};
