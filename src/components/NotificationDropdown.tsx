'use client';

import React from 'react';
import { useNotifications, useMarkAsRead, useDeleteNotification } from '@/hooks/useNotificationQueries';
import { Notification } from '@/lib/notification/types';
import { formatDistanceToNow } from 'date-fns';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationCircleIcon,
  InformationCircleIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  UserPlusIcon,
  MegaphoneIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { data: notifications = [], isLoading, error, refetch } = useNotifications();
  const markAsReadMutation = useMarkAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const recentNotifications = notifications.slice(0, 5);
  const hasMoreNotifications = notifications.length > 5;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <ExclamationCircleIcon className="w-5 h-5 text-yellow-400" />;
      case 'mention':
        return <ChatBubbleLeftIcon className="w-5 h-5 text-blue-400" />;
      case 'like':
        return <HeartIcon className="w-5 h-5 text-pink-400" />;
      case 'follow':
        return <UserPlusIcon className="w-5 h-5 text-purple-400" />;
      case 'system':
        return <MegaphoneIcon className="w-5 h-5 text-gray-400" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsReadMutation.mutateAsync([notification.id]);
    }
    
    if (notification.link) {
      window.location.assign(notification.link);
    }
    onClose();
  };

  const handleMarkRead = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await markAsReadMutation.mutateAsync([notificationId]);
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this notification?')) {
      await deleteNotificationMutation.mutateAsync(notificationId);
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
        <button 
          onClick={() => refetch()}
          className="mt-2 text-blue-400 hover:text-blue-300"
        >
          Retry
        </button>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center bg-black rounded-lg">
        <BellIcon className="w-12 h-12 mx-auto text-gray-600" />
        <p className="text-gray-400 mt-2">No notifications yet</p>
        <p className="text-sm text-gray-500">We'll notify you when something arrives</p>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      {/* Scrollable container with smooth scrolling and custom scrollbar */}
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
            <div className="flex-shrink-0 mt-1">
              {getIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className={`text-sm font-medium truncate ${!notification.read ? 'text-white' : 'text-gray-400'}`}>
                    {notification.title}
                  </p>
                  <p className={`text-sm line-clamp-2 mt-0.5 ${!notification.read ? 'text-gray-300' : 'text-gray-500'}`}>
                    {notification.message}
                  </p>
                  {notification.sender_name && (
                    <p className="text-xs text-gray-500 mt-1">
                      From: {notification.sender_name}
                    </p>
                  )}
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
      
      {/* View All Button */}
      <div className="border-t border-white/5 p-2">
        <Link
          href="/notifications"
          onClick={onClose}
          className="flex items-center justify-between w-full px-4 py-3 text-sm text-blue-400 hover:bg-white/5 rounded-lg transition-colors group"
        >
          <span>
            {hasMoreNotifications 
              ? `View all ${notifications.length} notifications` 
              : 'View all notifications'}
          </span>
          <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
