'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { createBrowserClient } from '@/lib/supabase/client';
import { Notification } from '@/lib/notification/types';
import { usePathname } from 'next/navigation';

export const useNotificationRealtime = () => {
  const queryClient = useQueryClient();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createBrowserClient();
    let mounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id || !mounted) return;

      channel = supabase
        .channel(`notifications:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          async (payload: any) => {
            const notification = payload.new as Notification;

            if (pathname !== '/notifications') {
              toast.success(notification.title, {
                duration: 4000,
                icon: '🔔',
              });
            }

            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      mounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [queryClient, pathname]);
};
