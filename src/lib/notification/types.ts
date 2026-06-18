import { User } from '@supabase/supabase-js';

export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'mention'
  | 'comment'
  | 'like'
  | 'follow'
  | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  read_at?: string;
  created_at: string;
  updated_at: string;
  data?: Record<string, any>;
  link?: string;
  sender_id?: string;
  sender_name?: string;
  sender_avatar?: string;
  expires_at?: string;
}

export interface CreateNotificationInput {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  data?: Record<string, any>;
  link?: string;
  sender_id?: string;
  sender_name?: string;
  sender_avatar?: string;
  expires_at?: string;
}

export interface NotificationPreferences {
  user_id: string;
  email: boolean;
  push: boolean;
  in_app: boolean;
  types: {
    [key in NotificationType]?: {
      email: boolean;
      push: boolean;
      in_app: boolean;
    };
  };
  quiet_hours?: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
  created_at?: string;
  updated_at?: string;
}

export interface NotificationFilter {
  type?: NotificationType | NotificationType[];
  read?: boolean;
  priority?: NotificationPriority | NotificationPriority[];
  from?: string;
  to?: string;
  search?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  by_type: Record<NotificationType, number>;
  by_priority: Record<NotificationPriority, number>;
}

export interface NotificationWebSocketMessage {
  type: 'notification' | 'read' | 'delete' | 'bulk_read';
  payload: any;
}

export interface NotificationWithSender extends Notification {
  sender?: {
    id: string;
    name: string;
    avatar_url: string;
  };
}