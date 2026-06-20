'use client';

import { Notification, NotificationFilter, NotificationStats } from './types';

export const fetchNotifications = async (filter?: NotificationFilter, page: number = 1) => {
  const params = new URLSearchParams();
  if (filter?.type) {
    params.append('type', Array.isArray(filter.type) ? filter.type.join(',') : filter.type);
  }
  if (filter?.read !== undefined) {
    params.append('read', filter.read.toString());
  }
  if (filter?.priority) {
    params.append('priority', Array.isArray(filter.priority) ? filter.priority.join(',') : filter.priority);
  }
  if (filter?.from) {
    params.append('from', filter.from);
  }
  if (filter?.to) {
    params.append('to', filter.to);
  }
  if (filter?.search) {
    params.append('search', filter.search);
  }
  params.append('page', page.toString());

  const res = await fetch(`/api/notifications/list?${params.toString()}`);

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw data;
  }

  return res.json();
};

export const fetchNotificationStats = async () => {
  const res = await fetch('/api/notifications/stats');

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw data;
  }

  return res.json() as Promise<{ total: number; unread: number; by_type: Record<string, number>; by_priority: Record<string, number> }>;
};

export const markNotificationsAsRead = async (notificationIds: string[]) => {
  const res = await fetch('/api/notifications/mark-read', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notification_ids: notificationIds }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw data;
  }

  return res.json();
};

export const markAllNotificationsAsRead = async () => {
  const res = await fetch('/api/notifications/mark-read', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mark_all: true }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw data;
  }

  return res.json();
};

export const deleteNotification = async (notificationId: string) => {
  const res = await fetch(`/api/notifications/delete?id=${notificationId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw data;
  }

  return res.json();
};

export const deleteAllNotifications = async () => {
  const res = await fetch('/api/notifications/delete?deleteAll=true', {
    method: 'DELETE',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw data;
  }

  return res.json();
};
