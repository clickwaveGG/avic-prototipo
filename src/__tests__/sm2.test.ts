import { describe, it, expect } from "vitest";
import { sm2 } from "@/lib/sm2";

describe("SM-2 algorithm", () => {
  it("first correct review gives 1 day interval", () => {
    const result = sm2({ grade: 4, easeFactor: 2.5, intervalDays: 0, repetitions: 0 });
    expect(result.intervalDays).toBe(1);
    expect(result.repetitions).toBe(1);
    expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it("second correct review gives 6 day interval", () => {
    const result = sm2({ grade: 4, easeFactor: 2.5, intervalDays: 1, repetitions: 1 });
    expect(result.intervalDays).toBe(6);
    expect(result.repetitions).toBe(2);
  });

  it("third correct review multiplies by ease factor", () => {
    const result = sm2({ grade: 4, easeFactor: 2.5, intervalDays: 6, repetitions: 2 });
    expect(result.intervalDays).toBe(15); // 6 * 2.5 = 15
    expect(result.repetitions).toBe(3);
  });

  it("failed review resets to 0", () => {
    const result = sm2({ grade: 0, easeFactor: 2.5, intervalDays: 15, repetitions: 5 });
    expect(result.intervalDays).toBe(0);
    expect(result.repetitions).toBe(0);
  });

  it("easy grade increases ease factor", () => {
    const result = sm2({ grade: 5, easeFactor: 2.5, intervalDays: 6, repetitions: 2 });
    expect(result.easeFactor).toBeGreaterThan(2.5);
  });

  it("hard grade decreases ease factor", () => {
    const result = sm2({ grade: 3, easeFactor: 2.5, intervalDays: 6, repetitions: 2 });
    expect(result.easeFactor).toBeLessThan(2.5);
  });

  it("ease factor never drops below 1.3", () => {
    const result = sm2({ grade: 0, easeFactor: 1.3, intervalDays: 1, repetitions: 1 });
    expect(result.easeFactor).toBe(1.3);
  });

  it("returns a future nextReview date", () => {
    const result = sm2({ grade: 4, easeFactor: 2.5, intervalDays: 0, repetitions: 0 });
    expect(result.nextReview.getTime()).toBeGreaterThan(Date.now());
  });
});
