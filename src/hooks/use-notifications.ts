'use client'

import { useCallback, useRef } from 'react'

export interface NotificationCreateData {
  title: string
  message: string
  priority?: string
  type?: string
}

export interface NotificationFilters {
  limit?: number
  unreadOnly?: boolean
}

export interface NotificationResult {
  notifications: unknown[]
  unreadCount: number
}

export function useNotifications() {
  const listenersRef = useRef(new Set<(data: unknown) => void>())

  const createNotification = useCallback(async (data: NotificationCreateData) => {
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!res.ok) {
      throw new Error('Failed to create notification')
    }

    const result = await res.json()
    return result.notification
  }, [])

  const fetchNotifications = useCallback(async (options: NotificationFilters = {}) => {
    const searchParams = new URLSearchParams()
    if (options.limit !== undefined) searchParams.set('limit', String(options.limit))
    if (options.unreadOnly !== undefined) searchParams.set('unreadOnly', String(options.unreadOnly))
    const res = await fetch(`/api/notifications?${searchParams.toString()}`)

    if (!res.ok) {
      throw new Error('Failed to fetch notifications')
    }

    return await res.json() as NotificationResult
  }, [])

  const markAsRead = useCallback(async (ids: string[]) => {
    const res = await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    })

    if (!res.ok) {
      throw new Error('Failed to mark as read')
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    const res = await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ readAll: true })
    })

    if (!res.ok) {
      throw new Error('Failed to mark all as read')
    }
  }, [])

  const deleteNotification = useCallback(async (id: string) => {
    const res = await fetch('/api/notifications', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })

    if (!res.ok) {
      throw new Error('Failed to delete notification')
    }
  }, [])

  return {
    createNotification,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  }
}
