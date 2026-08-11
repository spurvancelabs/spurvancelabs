'use client';

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminNotification, AdminNotificationFilter, AdminNotificationStats } from '@/lib/admin-notifications/types';
import {
  fetchAdminNotifications,
  fetchAdminNotificationStats,
  markAdminNotificationsAsRead,
  markAllAdminNotificationsAsRead,
  deleteAdminNotification,
  deleteAllAdminNotifications,
} from '@/lib/admin-notifications/api';

export interface AdminNotificationsResult {
  notifications: AdminNotification[];
  total: number;
  totalPages: number;
}

export const useAdminNotifications = (filter?: AdminNotificationFilter, page: number = 1) => {
  return useQuery<AdminNotificationsResult, Error>({
    queryKey: ['admin-notifications', filter, page],
    queryFn: async () => {
      const data = await fetchAdminNotifications(filter, page);
      const list = Array.isArray((data as any)?.notifications) ? (data as any).notifications : [];
      return {
        notifications: list as AdminNotification[],
        total: (data as any)?.total ?? list.length,
        totalPages: (data as any)?.totalPages ?? 1,
      };
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
};

export const useInfiniteAdminNotifications = (filter?: AdminNotificationFilter) => {
  return useInfiniteQuery<AdminNotificationsResult, Error>({
    queryKey: ['admin-notifications-infinite', filter],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = pageParam as number;
      const data = await fetchAdminNotifications(filter, page);
      const list = Array.isArray((data as any)?.notifications) ? (data as any).notifications : [];
      return {
        notifications: list as AdminNotification[],
        total: (data as any)?.total ?? list.length,
        totalPages: (data as any)?.totalPages ?? 1,
      };
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.totalPages > allPages.length ? allPages.length + 1 : undefined,
    staleTime: 15_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
};

export const useAdminNotificationStats = () => {
  return useQuery<AdminNotificationStats, Error>({
    queryKey: ['admin-notification-stats'],
    queryFn: fetchAdminNotificationStats,
    staleTime: 15_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
};

export const useAdminUnreadCount = () => {
  const { data: stats } = useAdminNotificationStats();
  return stats?.unread ?? 0;
};

export const useAdminMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAdminNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notification-stats'] });
    },
  });
};

export const useAdminMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAdminNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notification-stats'] });
    },
  });
};

export const useAdminDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notification-stats'] });
    },
  });
};

export const useAdminDeleteAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllAdminNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notification-stats'] });
    },
  });
};
