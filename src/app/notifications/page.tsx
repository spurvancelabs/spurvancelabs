'use client';

import React, { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
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
  ArrowLeftIcon,
  BellSlashIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import "../../global.css";

export default function NotificationsPage() {
  const router = useRouter();
  const { 
    notifications, 
    isLoading, 
    error, 
    markAsRead, 
    fetchNotifications
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'error': return <XCircleIcon className="w-5 h-5 text-red-400" />;
      case 'warning': return <ExclamationCircleIcon className="w-5 h-5 text-yellow-400" />;
      case 'mention': return <ChatBubbleLeftIcon className="w-5 h-5 text-blue-400" />;
      case 'like': return <HeartIcon className="w-5 h-5 text-pink-400" />;
      case 'follow': return <UserPlusIcon className="w-5 h-5 text-purple-400" />;
      case 'system': return <MegaphoneIcon className="w-5 h-5 text-gray-400" />;
      default: return <InformationCircleIcon className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markAsRead([notification.id]);
    }
    if (notification.link) {
      window.location.assign(notification.link);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length > 0) {
      await markAsRead(unreadIds);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
          <button onClick={fetchNotifications} className="text-blue-400 mt-2">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-white cursor-pointer hover:text-gray-300">
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-white">Notifications</h1>
            {notifications.length > 0 && (
              <span className="text-xs text-gray-500">({notifications.length})</span>
            )}
          </div>
          
          {notifications.filter(n => !n.read).length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <BellSlashIcon className="w-12 h-12 mx-auto text-gray-600" />
            <p className="text-gray-400 mt-3">No notifications</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
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
                    
                    {!notification.read && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


