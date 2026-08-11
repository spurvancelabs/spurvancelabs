'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useInfiniteAdminNotifications, useAdminMarkAsRead, useAdminMarkAllAsRead, useAdminDeleteNotification } from '@/hooks/useAdminNotificationQueries';
import { AdminNotification } from '@/lib/admin-notifications/types';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  UserPlusIcon,
  ChatBubbleLeftIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  MegaphoneIcon,
  ArrowLeftIcon,
  BellSlashIcon,
} from '@heroicons/react/24/outline';
import "../../../global.css";

export default function AdminNotificationsPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteAdminNotifications();

  const notifications: AdminNotification[] = (data?.pages ?? []).flatMap((p) => p.notifications);
  const total = data?.pages[0]?.total ?? 0;

  const markAsReadMutation = useAdminMarkAsRead();
  const markAllAsReadMutation = useAdminMarkAllAsRead();
  const deleteNotificationMutation = useAdminDeleteNotification();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'error': return <XCircleIcon className="w-5 h-5 text-red-400" />;
      case 'warning': return <ExclamationCircleIcon className="w-5 h-5 text-yellow-400" />;
      case 'registration': return <UserPlusIcon className="w-5 h-5 text-blue-400" />;
      case 'application': return <BriefcaseIcon className="w-5 h-5 text-emerald-400" />;
      case 'enrollment': return <AcademicCapIcon className="w-5 h-5 text-purple-400" />;
      case 'ticket': return <ChatBubbleLeftIcon className="w-5 h-5 text-cyan-400" />;
      case 'system': return <MegaphoneIcon className="w-5 h-5 text-gray-400" />;
      default: return <InformationCircleIcon className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleNotificationClick = async (notification: AdminNotification) => {
    if (!notification.read) {
      try {
        await markAsReadMutation.mutateAsync([notification.id]);
      } catch {
        toast.error('Failed to mark notification as read');
      }
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
    } catch {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this notification?')) return;
    try {
      await deleteNotificationMutation.mutateAsync(notificationId);
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  if (isLoading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{error instanceof Error ? error.message : 'An error occurred'}</p>
          <button onClick={() => refetch()} className="text-blue-400 mt-2">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-white cursor-pointer hover:text-gray-300" aria-label="Back">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Notifications</h1>
            <p className="text-gray-400 text-sm mt-1">Admin notifications</p>
          </div>
          {total > 0 && <span className="text-xs text-gray-500">({total})</span>}
        </div>

        {notifications.some((n) => !n.read) && (
          <button onClick={handleMarkAllAsRead} className="text-sm text-blue-400 hover:text-blue-300">
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <BellSlashIcon className="w-12 h-12 mx-auto text-gray-600" />
          <p className="text-gray-400 mt-3">No admin notifications</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`
                  flex items-start gap-3 p-4 cursor-pointer transition-colors
                  border rounded-xl bg-zinc-900/50 border-white/[0.06]
                  ${!notification.read ? 'border-blue-500/30 bg-white/[0.03]' : 'hover:bg-white/[0.02]'}
                `}
              >
                <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className={`text-sm font-medium truncate ${!notification.read ? 'text-white' : 'text-gray-400'}`}>
                        {notification.title}
                      </p>
                      <p className={`text-sm line-clamp-2 mt-0.5 ${!notification.read ? 'text-gray-300' : 'text-gray-500'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsReadMutation.mutate([notification.id]);
                          }}
                          className="p-1 text-blue-400 hover:bg-white/10 rounded-full transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(e, notification.id)}
                        className="p-1 text-red-400 hover:bg-white/10 rounded-full transition-colors"
                        title="Delete"
                      >
                        <XCircleIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-6 text-center">
              <button
                onClick={() => fetchNextPage()}
                className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
