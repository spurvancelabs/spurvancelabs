// WARNING: This is an in-memory rate limiter. It works for single-server deployments
// but resets on cold starts and doesn't share state across serverless instances.
// For production on Vercel/AWS Lambda, use a Redis-backed rate limiter (e.g., @upstash/ratelimit)
// or Supabase-based rate limiting with a database table.
export class RateLimiter {
  protected attempts: Map<string, { count: number; firstAttempt: number }> = new Map();
  protected blocked: Map<string, number> = new Map();

  isBlocked(ip: string) {
    const blockTime = this.blocked.get(ip);
    if (blockTime && Date.now() < blockTime) {
      return true;
    }
    this.blocked.delete(ip);
    return false;
  }

  getRemaining(ip: string) {
    const record = this.attempts.get(ip);
    if (!record) return { count: 0, remaining: 5 };
    return {
      count: record.count,
      remaining: Math.max(0, 5 - record.count)
    };
  }

  increment(ip: string) {
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

  reset(ip: string) {
    this.attempts.delete(ip);
    this.blocked.delete(ip);
  }
}

export const rateLimiter = new RateLimiter();
