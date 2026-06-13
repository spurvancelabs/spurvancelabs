import { prisma } from '@/lib/prisma'
import type { NotificationPriority, NotificationType } from '@prisma/client'

export interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  readAt?: Date
  priority: string
  type: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface NotificationData {
  title: string
  message: string
  priority?: NotificationPriority
  type?: NotificationType
  userId?: string
  metadata?: unknown
}

export class NotificationService {
  private subscribers: Map<string, Set<(data: unknown) => void>> = new Map()

  async create(userId: string, data: NotificationData) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title: data.title,
        message: data.message,
        priority: data.priority,
        type: data.type,
        metadata: data.metadata as any
      }
    })

    this.broadcast(userId, notification)
    return notification
  }

  async getByUser(userId: string, options: { limit?: number; offset?: number; unreadOnly?: boolean } = {}) {
    const { limit = 20, offset = 0, unreadOnly = false } = options
    return await prisma.notification.findMany({
      where: { userId, ...(unreadOnly && { read: false }) },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })
  }

  async getUnreadCount(userId: string) {
    return await prisma.notification.count({
      where: { userId, read: false }
    })
  }

  async markAsRead(userId: string, notificationIds: string[]) {
    await prisma.notification.updateMany({
      where: { userId, id: { in: notificationIds } },
      data: { read: true, readAt: new Date() }
    })

    this.broadcast(userId, { type: 'READ', ids: notificationIds })
  }

  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true, readAt: new Date() }
    })

    this.broadcast(userId, { type: 'READ_ALL' })
  }

  async delete(userId: string, notificationId: string) {
    await prisma.notification.deleteMany({
      where: { userId, id: notificationId }
    })

    this.broadcast(userId, { type: 'DELETE', id: notificationId })
  }

  subscribe(userId: string, callback: (data: unknown) => void) {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, new Set())
    }
    this.subscribers.get(userId)!.add(callback)
    return () => this.unsubscribe(userId, callback)
  }

  unsubscribe(userId: string, callback: (data: unknown) => void) {
    const userSubscribers = this.subscribers.get(userId)
    if (userSubscribers) {
      userSubscribers.delete(callback)
      if (userSubscribers.size === 0) {
        this.subscribers.delete(userId)
      }
    }
  }

  broadcast(userId: string, data: unknown) {
    const userSubscribers = this.subscribers.get(userId)
    if (userSubscribers) {
      userSubscribers.forEach(callback => callback(data))
    }
  }

  async notifyUserAction(userId: string, action: string, metadata: Record<string, unknown> = {}) {
    const actionMessages: Record<string, { title: string; message: string; type: NotificationType; metadata?: Record<string, unknown> }> = {
      LOGIN: { title: 'Login Successful', message: 'You have successfully logged in.', type: 'SUCCESS' as NotificationType },
      LOGOUT: { title: 'Logout', message: 'You have been logged out.', type: 'INFO' as NotificationType },
      PASSWORD_RESET: { title: 'Password Reset', message: 'Your password has been reset successfully.', type: 'SUCCESS' as NotificationType },
      EMAIL_VERIFIED: { title: 'Email Verified', message: 'Your email has been verified.', type: 'SUCCESS' as NotificationType }
    }

    const config = actionMessages[action]
    if (config) {
      return this.create(userId, { ...config, metadata: { ...metadata, action } })
    }
  }
}

export const notificationService = new NotificationService()
