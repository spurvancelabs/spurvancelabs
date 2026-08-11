'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  useAdminNotifications,
  useAdminMarkAsRead,
  useAdminMarkAllAsRead,
  useAdminDeleteNotification,
} from '@/hooks/useAdminNotificationQueries';
import { AdminNotification } from '@/lib/admin-notifications/types';
import { formatDistanceToNow } from 'date-fns';
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
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { BellIcon } from '@heroicons/react/24/outline';

interface AdminNotificationDropdownProps {
  onClose: () => void;
}

const AdminNotificationDropdown: React.FC<AdminNotificationDropdownProps> = ({ onClose }) => {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useAdminNotifications();
  const markAsReadMutation = useAdminMarkAsRead();
  const markAllAsReadMutation = useAdminMarkAllAsRead();
  const deleteNotificationMutation = useAdminDeleteNotification();

  const notifications = data?.notifications ?? [];
  const total = data?.total ?? 0;
  const recentNotifications = notifications.slice(0, 5);
  const hasUnread = notifications.some((n) => !n.read);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <ExclamationCircleIcon className="w-5 h-5 text-yellow-400" />;
      case 'registration':
        return <UserPlusIcon className="w-5 h-5 text-blue-400" />;
      case 'application':
        return <BriefcaseIcon className="w-5 h-5 text-emerald-400" />;
      case 'enrollment':
        return <AcademicCapIcon className="w-5 h-5 text-purple-400" />;
      case 'ticket':
        return <ChatBubbleLeftIcon className="w-5 h-5 text-cyan-400" />;
      case 'system':
        return <MegaphoneIcon className="w-5 h-5 text-gray-400" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-400" />;
    }
  };

  const navigate = (link?: string) => {
    onClose();
    if (!link) return;
    if (link.startsWith('/')) {
      router.push(link);
    } else {
      window.location.assign(link);
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
    navigate(notification.link);
  };

  const handleMarkRead = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    try {
      await markAsReadMutation.mutateAsync([notificationId]);
    } catch {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllRead = async () => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 bg-black rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center bg-black rounded-lg">
        <p className="text-red-400">{error instanceof Error ? error.message : 'An error occurred'}</p>
        <button onClick={() => refetch()} className="mt-2 text-blue-400 hover:text-blue-300">
          Retry
        </button>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center bg-black rounded-lg">
        <BellIcon className="w-12 h-12 mx-auto text-gray-600" />
        <p className="text-gray-400 mt-2">No admin notifications yet</p>
        <p className="text-sm text-gray-500">New applications, enrollments and registrations will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        {hasUnread && (
          <button onClick={handleMarkAllRead} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            Mark all as read
          </button>
        )}
      </div>

      <div
        className="max-h-96 overflow-y-auto scroll-smooth p-2 space-y-2
          scrollbar-thin scrollbar-track-black scrollbar-thumb-white/20
          hover:scrollbar-thumb-white/40"
      >
        {recentNotifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={`
              flex items-start gap-3 p-4 cursor-pointer transition-colors
              border rounded-lg
              ${!notification.read
                ? 'bg-white/5 border-white/20'
                : 'border-white/10 hover:bg-white/5'
              }
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
                      onClick={(e) => handleMarkRead(e, notification.id)}
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

      <div className="border-t border-white/5 p-2">
        <Link
          href="/admin/notifications"
          onClick={onClose}
          className="flex items-center justify-between w-full px-4 py-3 text-sm text-blue-400 hover:bg-white/5 rounded-lg transition-colors group"
        >
          <span>{total > 5 ? `View all ${total} notifications` : 'View all notifications'}</span>
          <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default AdminNotificationDropdown;
