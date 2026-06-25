import { Redis } from "@upstash/redis"

function getRedisClient() {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return null
}

export const redis = getRedisClient()

// In-memory fallback when Redis is unavailable
const memoryCache = new Map<string, { data: unknown; expiresAt: number }>()

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds = 60
): Promise<T> {
  // Try Redis first
  if (redis) {
    const cached = await redis.get<T>(key)
    if (cached) return cached

    const fresh = await fetcher()
    await redis.setex(key, ttlSeconds, JSON.stringify(fresh))
    return fresh
  }

  // In-memory fallback
  const entry = memoryCache.get(key)
  if (entry && entry.expiresAt > Date.now()) {
    return entry.data as T
  }

  const fresh = await fetcher()
  memoryCache.set(key, { data: fresh, expiresAt: Date.now() + ttlSeconds * 1000 })
  return fresh
}

export async function setCache(key: string, data: unknown, ttlSeconds = 300): Promise<void> {
  if (redis) {
    await redis.setex(key, ttlSeconds, JSON.stringify(data))
  } else {
    memoryCache.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 })
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  if (redis) {
    return redis.get<T>(key)
  }

  const entry = memoryCache.get(key)
  if (entry && entry.expiresAt > Date.now()) {
    return entry.data as T
  }
  return null
}

export async function invalidateCache(pattern: string): Promise<void> {
  if (redis) {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } else {
    for (const key of memoryCache.keys()) {
      if (key.includes(pattern.replace("*", ""))) {
        memoryCache.delete(key)
      }
    }
  }
}
