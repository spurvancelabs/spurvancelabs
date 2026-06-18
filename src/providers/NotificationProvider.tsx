'use client';

import React from 'react';
import { NotificationProvider as ContextProvider } from '@/context/NotificationContext';

interface NotificationProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children, userId }) => {
  return (
    <ContextProvider userId={userId}>
      {children}
    </ContextProvider>
  );
};