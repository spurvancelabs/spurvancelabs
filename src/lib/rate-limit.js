export class RateLimiter {
  constructor() {
    this.attempts = new Map();
    this.blocked = new Map();
  }

  isBlocked(ip) {
    const blockTime = this.blocked.get(ip);
    if (blockTime && Date.now() < blockTime) {
      return true;
    }
    this.blocked.delete(ip);
    return false;
  }

  getRemaining(ip) {
    const record = this.attempts.get(ip);
    if (!record) return { count: 0, remaining: 5 };
    return {
      count: record.count,
      remaining: Math.max(0, 5 - record.count)
    };
  }

  increment(ip) {
    const now = Date.now();
    const record = this.attempts.get(ip);

    if (!record || now - record.firstAttempt > 15 * 60 * 1000) {
      this.attempts.set(ip, { count: 1, firstAttempt: now });
    } else {
      record.count++;
      if (record.count >= 5) {
        this.blocked.set(ip, now + 15 * 60 * 1000);
        this.attempts.delete(ip);
      }
    }
  }

  reset(ip) {
    this.attempts.delete(ip);
    this.blocked.delete(ip);
  }
}

export const rateLimiter = new RateLimiter();