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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
        <link rel="icon" href="/spurvance-logo.png" type="image/png" />
      </head>
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