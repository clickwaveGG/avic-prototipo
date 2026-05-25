import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Upstash so we test the in-memory fallback
vi.mock("@upstash/ratelimit", () => ({ Ratelimit: vi.fn() }));
vi.mock("@upstash/redis", () => ({ Redis: vi.fn() }));

describe("rate-limit (in-memory fallback)", () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it("allows first request", async () => {
    const { rateLimit } = await import("@/lib/rate-limit");
    const result = await rateLimit("test-user-1");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(49);
  });

  it("tracks remaining correctly", async () => {
    const { rateLimit } = await import("@/lib/rate-limit");
    const uid = "test-user-counter-" + Date.now();
    await rateLimit(uid); // 1
    await rateLimit(uid); // 2
    const result = await rateLimit(uid); // 3
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(47);
  });
});
