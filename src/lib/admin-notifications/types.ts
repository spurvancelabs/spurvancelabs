export type AdminNotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'registration'
  | 'application'
  | 'enrollment'
  | 'ticket'
  | 'system';

export type AdminNotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface AdminNotification {
  id: string;
  recipient_user_id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  priority: AdminNotificationPriority;
  read: boolean;
  read_at?: string;
  link?: string;
  data?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateAdminNotificationInput {
  type: AdminNotificationType;
  title: string;
  message: string;
  priority?: AdminNotificationPriority;
  data?: Record<string, any>;
  link?: string;
}

export interface AdminNotificationFilter {
  type?: AdminNotificationType | AdminNotificationType[];
  read?: boolean;
  priority?: AdminNotificationPriority | AdminNotificationPriority[];
  search?: string;
}

export interface AdminNotificationStats {
  total: number;
  unread: number;
}
