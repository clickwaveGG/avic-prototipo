/**
 * In-memory rate limiter por usuario.
 * Reseta automaticamente a cada janela de tempo.
 *
 * Para producao com multiplas instancias, migrar para Redis/Upstash.
 * Para single-instance (Vercel serverless), funciona bem por request.
 */

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

const WINDOW_MS = 24 * 60 * 60 * 1000; // 24h
const MAX_REQUESTS = 50; // 50 anamneses/dia

export function rateLimit(userId: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  let entry = store.get(userId);

  // Limpa entradas expiradas periodicamente
  if (store.size > 10_000) {
    for (const [key, val] of store) {
      if (val.resetAt <= now) store.delete(key);
    }
  }

  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    store.set(userId, entry);
  }

  entry.count++;

  return {
    allowed: entry.count <= MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - entry.count),
    resetAt: entry.resetAt,
  };
}
