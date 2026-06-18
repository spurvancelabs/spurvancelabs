'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import { useNotifications, useUnreadCount } from '@/hooks/useNotifications';
import NotificationDropdown from './NotificationDropdown';

interface NotificationBellProps {
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
}

const NotificationBell: React.FC<NotificationBellProps> = ({ 
  className = '', 
  iconSize = 'md' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const unreadCount = useUnreadCount();
  const { markAllAsRead } = useNotifications();

  const badgeSizeMap = {
    sm: 'w-4 h-4 text-[10px]',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm',
  };

  const showBadge = unreadCount > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const formatCount = (count: number): string => {
    if (count > 99) return '99+';
    return count.toString();
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="relative p-2 rounded-full cursor-pointer hover:bg-white/10 transition-colors duration-200"
        aria-label="Notifications"
      >
        {showBadge ? (
          <BellSolidIcon className="text-white w-5 h-5" />
        ) : (
          <BellIcon className="text-white h-5 w-5" />
        )}
        
        {showBadge && (
          <span className={`
            absolute -top-1 -right-1 
            flex items-center justify-center
            bg-red-500 text-white font-bold rounded-full
            ${badgeSizeMap[iconSize]}
            animate-pulse
          `}>
            {formatCount(unreadCount)}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-96 backdrop-blur-2xl bg-black/90 border border-white/10 rounded-2xl shadow-2xl shadow-black/70 z-50 transform origin-top-right transition-all duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          {/* Dropdown content with dark theme */}
          <NotificationDropdown onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;