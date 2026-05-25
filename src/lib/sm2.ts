/**
 * SM-2 Algorithm for spaced repetition.
 *
 * Grade scale:
 *  0 — Esqueci completamente
 *  1 — Errado, mas lembrei ao ver a resposta
 *  2 — Errado, mas estava próximo
 *  3 — Correto, mas com dificuldade (Difícil)
 *  4 — Correto, com hesitação (Bom)
 *  5 — Correto, sem hesitação (Fácil)
 *
 * For the UI we map: Esqueci=0, Difícil=3, Bom=4, Fácil=5
 */

export type SM2Input = {
  grade: number;        // 0-5
  easeFactor: number;   // current EF (min 1.3)
  intervalDays: number; // current interval
  repetitions: number;  // number of consecutive correct reviews
};

export type SM2Output = {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReview: Date;
};

export function sm2(input: SM2Input): SM2Output {
  const { grade, easeFactor, intervalDays, repetitions } = input;

  let newEF = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  newEF = Math.max(1.3, newEF);

  let newInterval: number;
  let newReps: number;

  if (grade < 3) {
    // Failed — reset
    newReps = 0;
    newInterval = 0;
  } else {
    newReps = repetitions + 1;
    if (newReps === 1) {
      newInterval = 1;
    } else if (newReps === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(intervalDays * newEF);
    }
  }

  const nextReview = new Date();
  if (newInterval === 0) {
    // Review again in 10 minutes (show again this session)
    nextReview.setMinutes(nextReview.getMinutes() + 10);
  } else {
    nextReview.setDate(nextReview.getDate() + newInterval);
  }

  return {
    easeFactor: Math.round(newEF * 100) / 100,
    intervalDays: newInterval,
    repetitions: newReps,
    nextReview,
  };
}
