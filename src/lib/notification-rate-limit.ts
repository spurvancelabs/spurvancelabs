import { RateLimiter } from './rate-limit'

class NotificationRateLimiter extends RateLimiter {
  private maxNotifications = 10
  private windowMs = 60 * 1000

  constructor() {
    super()
  }

  getRemaining(userId: string) {
    const record = this.attempts.get(userId)
    if (!record) return { count: 0, remaining: this.maxNotifications }
    return {
      count: record.count,
      remaining: Math.max(0, this.maxNotifications - record.count)
    }
  }

  increment(userId: string) {
    const now = Date.now()
    const record = this.attempts.get(userId)

    if (!record || now - record.firstAttempt > this.windowMs) {
      this.attempts.set(userId, { count: 1, firstAttempt: now })
    } else {
      record.count++
    }
  }

  isRateLimited(userId: string) {
    const record = this.attempts.get(userId)
    return record && record.count >= this.maxNotifications
  }
}

export const notificationRateLimiter = new NotificationRateLimiter()
