'use client';

import React from 'react';
import { Toaster } from "react-hot-toast";
import { NotificationProvider } from '@/context/NotificationContext';
import QueryProvider from '@/providers/QueryProvider';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <NotificationProvider>
            {children}
            <Toaster position="top-right" />
          </NotificationProvider>
        </QueryProvider>
      </body>
    </html>
  );
};

export default Layout;