import Redis from 'ioredis'

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined
}

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => Math.min(times * 50, 2000),
  })

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis

// Helper: cache wrapper
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached) as T
  const data = await fetcher()
  await redis.setex(key, ttlSeconds, JSON.stringify(data))
  return data
}

// Helper: rate limit check
export async function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const current = await redis.incr(key)
  if (current === 1) await redis.expire(key, windowSeconds)
  const ttl = await redis.ttl(key)
  return {
    allowed: current <= maxAttempts,
    remaining: Math.max(0, maxAttempts - current),
    resetIn: ttl,
  }
}
