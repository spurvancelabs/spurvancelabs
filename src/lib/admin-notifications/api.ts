'use client';

import { AdminNotificationFilter } from './types';

export const fetchAdminNotifications = async (filter?: AdminNotificationFilter, page: number = 1) => {
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
  if (filter?.search) {
    params.append('search', filter.search);
  }
  params.append('page', page.toString());

  const res = await fetch(`/api/admin/notifications?${params.toString()}`);

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw data;
  }

  return res.json();
};

export const fetchAdminNotificationStats = async () => {
  const res = await fetch('/api/admin/notifications/stats');

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw data;
  }

  return res.json();
};

export const markAdminNotificationsAsRead = async (notificationIds: string[]) => {
  const res = await fetch('/api/admin/notifications/mark-read', {
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

export const markAllAdminNotificationsAsRead = async () => {
  const res = await fetch('/api/admin/notifications/mark-read', {
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

export const deleteAdminNotification = async (notificationId: string) => {
  const res = await fetch(`/api/admin/notifications/delete?id=${notificationId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw data;
  }

  return res.json();
};

export const deleteAllAdminNotifications = async () => {
  const res = await fetch('/api/admin/notifications/delete?deleteAll=true', {
    method: 'DELETE',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw data;
  }

  return res.json();
};
