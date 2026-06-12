import { prisma } from '@/lib/prisma'

class NotificationService {
  constructor() {
    this.subscribers = new Map()
  }

  async create(userId, data) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title: data.title,
        message: data.message,
        priority: data.priority || 'MEDIUM',
        type: data.type || 'INFO',
        metadata: data.metadata || null
      }
    })

    this.broadcast(userId, notification)
    return notification
  }

  async getByUser(userId, options = {}) {
    const { limit = 20, offset = 0, unreadOnly = false } = options
    return await prisma.notification.findMany({
      where: { userId, ...(unreadOnly && { read: false }) },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })
  }

  async getUnreadCount(userId) {
    return await prisma.notification.count({
      where: { userId, read: false }
    })
  }

  async markAsRead(userId, notificationIds) {
    await prisma.notification.updateMany({
      where: { userId, id: { in: notificationIds } },
      data: { read: true, readAt: new Date() }
    })

    this.broadcast(userId, { type: 'READ', ids: notificationIds })
  }

  async markAllAsRead(userId) {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true, readAt: new Date() }
    })

    this.broadcast(userId, { type: 'READ_ALL' })
  }

  async delete(userId, notificationId) {
    await prisma.notification.deleteMany({
      where: { userId, id: notificationId }
    })

    this.broadcast(userId, { type: 'DELETE', id: notificationId })
  }

  subscribe(userId, callback) {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, new Set())
    }
    this.subscribers.get(userId).add(callback)
    return () => this.unsubscribe(userId, callback)
  }

  unsubscribe(userId, callback) {
    const userSubscribers = this.subscribers.get(userId)
    if (userSubscribers) {
      userSubscribers.delete(callback)
      if (userSubscribers.size === 0) {
        this.subscribers.delete(userId)
      }
    }
  }

  broadcast(userId, data) {
    const userSubscribers = this.subscribers.get(userId)
    if (userSubscribers) {
      userSubscribers.forEach(callback => callback(data))
    }
  }

  async notifyUserAction(userId, action, metadata = {}) {
    const actionMessages = {
      LOGIN: { title: 'Login Successful', message: 'You have successfully logged in.', type: 'SUCCESS' },
      LOGOUT: { title: 'Logout', message: 'You have been logged out.', type: 'INFO' },
      PASSWORD_RESET: { title: 'Password Reset', message: 'Your password has been reset successfully.', type: 'SUCCESS' },
      EMAIL_VERIFIED: { title: 'Email Verified', message: 'Your email has been verified.', type: 'SUCCESS' }
    }

    const config = actionMessages[action]
    if (config) {
      return this.create(userId, { ...config, metadata: { ...metadata, action } })
    }
  }
}

export const notificationService = new NotificationService()