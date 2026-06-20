'use client';

import React from 'react';
import { Toaster } from "react-hot-toast";
import QueryProvider from '@/providers/QueryProvider';
import { useNotificationRealtime } from '@/hooks/useNotificationRealtime';

const AppContent = ({ children }: { children: React.ReactNode }) => {
  useNotificationRealtime();
  return <>{children}</>;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AppContent>
            {children}
          </AppContent>
          <Toaster position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
};

export default Layout;