'use client';

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  return useQuery<{ notifications: Notification[]; total: number; totalPages: number }, Error>({
    queryKey: ['notifications', filter, page],
    queryFn: async () => {
      const data = await fetchNotifications(filter, page);
      const list = Array.isArray((data as any)?.notifications) ? (data as any).notifications : [];
      return {
        notifications: list as Notification[],
        total: (data as any)?.pagination?.total ?? list.length,
        totalPages: (data as any)?.pagination?.totalPages ?? 1,
      };
    },
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
};

export const useInfiniteNotifications = (filter?: NotificationFilter) => {
  return useInfiniteQuery<{ notifications: Notification[]; total: number; totalPages: number }, Error>({
    queryKey: ['notifications-infinite', filter],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = pageParam as number;
      const data = await fetchNotifications(filter, page);
      const list = Array.isArray((data as any)?.notifications) ? (data as any).notifications : [];
      return {
        notifications: list as Notification[],
        total: (data as any)?.pagination?.total ?? list.length,
        totalPages: (data as any)?.pagination?.totalPages ?? 1,
      };
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.totalPages > allPages.length ? allPages.length + 1 : undefined,
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
};

export const useNotificationStats = () => {
  return useQuery<NotificationStats, Error>({
    queryKey: ['notification-stats'],
    queryFn: fetchNotificationStats,
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
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
