/**
 * Rate limiter persistente via Upstash Redis.
 * 50 anamneses/dia por usuário com sliding window.
 *
 * Fallback para in-memory quando UPSTASH_REDIS_REST_URL não está configurada
 * (dev local sem Redis).
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const DAILY_LIMIT = 50;

// Upstash Redis rate limiter (produção)
function createUpstashLimiter() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const redis = new Redis({ url, token });
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(DAILY_LIMIT, "24 h"),
    prefix: "avicena:rl",
  });
}

let upstashLimiter: Ratelimit | null | undefined;

function getUpstashLimiter() {
  if (upstashLimiter === undefined) {
    upstashLimiter = createUpstashLimiter();
  }
  return upstashLimiter;
}

// Fallback in-memory (dev local)
type Entry = { count: number; resetAt: number };
const memStore = new Map<string, Entry>();
const WINDOW_MS = 24 * 60 * 60 * 1000;

function memoryRateLimit(userId: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  let entry = memStore.get(userId);

  if (memStore.size > 10_000) {
    for (const [key, val] of memStore) {
      if (val.resetAt <= now) memStore.delete(key);
    }
  }

  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    memStore.set(userId, entry);
  }

  entry.count++;

  return {
    allowed: entry.count <= DAILY_LIMIT,
    remaining: Math.max(0, DAILY_LIMIT - entry.count),
    resetAt: entry.resetAt,
  };
}

/**
 * Rate limit por userId.
 * Usa Upstash Redis em produção, in-memory como fallback em dev.
 */
export async function rateLimit(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
}> {
  const limiter = getUpstashLimiter();

  if (limiter) {
    const result = await limiter.limit(userId);
    return {
      allowed: result.success,
      remaining: result.remaining,
      resetAt: result.reset,
    };
  }

  return memoryRateLimit(userId);
}
