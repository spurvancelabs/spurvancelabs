'use client'

import { useCallback, useRef } from 'react'

export function useNotifications() {
  const listenersRef = useRef(new Set())

  const createNotification = useCallback(async (data) => {
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

  const fetchNotifications = useCallback(async (options = {}) => {
    const searchParams = new URLSearchParams(options).toString()
    const res = await fetch(`/api/notifications?${searchParams}`)

    if (!res.ok) {
      throw new Error('Failed to fetch notifications')
    }

    return await res.json()
  }, [])

  const markAsRead = useCallback(async (ids) => {
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

  const deleteNotification = useCallback(async (id) => {
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