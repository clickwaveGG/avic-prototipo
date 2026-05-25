"use server";

import { createClient } from "@/lib/supabase/server";
import { sm2 } from "@/lib/sm2";

export type FlashcardRow = {
  id: string;
  front: string;
  back: string;
  topic: string;
  source: string;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review: string;
  created_at: string;
};

export type ReviewStats = {
  totalCards: number;
  dueToday: number;
  reviewedToday: number;
};

export async function loadFlashcards(limit = 50): Promise<FlashcardRow[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("flashcards")
    .select("id, front, back, topic, source, ease_factor, interval_days, repetitions, next_review, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function loadDueCards(): Promise<FlashcardRow[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("flashcards")
    .select("id, front, back, topic, source, ease_factor, interval_days, repetitions, next_review, created_at")
    .eq("user_id", user.id)
    .lte("next_review", new Date().toISOString())
    .order("next_review", { ascending: true })
    .limit(50);

  return data ?? [];
}

export async function getReviewStats(): Promise<ReviewStats> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { totalCards: 0, dueToday: 0, reviewedToday: 0 };

  const { count: totalCards } = await supabase
    .from("flashcards")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: dueToday } = await supabase
    .from("flashcards")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .lte("next_review", new Date().toISOString());

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { count: reviewedToday } = await supabase
    .from("review_log")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("reviewed_at", todayStart.toISOString());

  return {
    totalCards: totalCards ?? 0,
    dueToday: dueToday ?? 0,
    reviewedToday: reviewedToday ?? 0,
  };
}

export async function reviewCard(
  cardId: string,
  grade: number
): Promise<{ success: boolean; nextReview: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, nextReview: "" };

  // Buscar card atual
  const { data: card } = await supabase
    .from("flashcards")
    .select("ease_factor, interval_days, repetitions")
    .eq("id", cardId)
    .eq("user_id", user.id)
    .single();

  if (!card) return { success: false, nextReview: "" };

  // Calcular SM-2
  const result = sm2({
    grade,
    easeFactor: card.ease_factor,
    intervalDays: card.interval_days,
    repetitions: card.repetitions,
  });

  // Salvar review log
  await supabase.from("review_log").insert({
    flashcard_id: cardId,
    user_id: user.id,
    grade,
    ease_before: card.ease_factor,
    ease_after: result.easeFactor,
    interval_before: card.interval_days,
    interval_after: result.intervalDays,
  });

  // Atualizar card
  await supabase
    .from("flashcards")
    .update({
      ease_factor: result.easeFactor,
      interval_days: result.intervalDays,
      repetitions: result.repetitions,
      next_review: result.nextReview.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", cardId);

  return { success: true, nextReview: result.nextReview.toISOString() };
}
