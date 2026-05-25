"use server";

import { createClient } from "@/lib/supabase/server";

export type QuizRow = {
  id: string;
  title: string;
  topic: string;
  source: string;
  session_id: string | null;
  total_questions: number;
  created_at: string;
};

export type QuizQuestionRow = {
  id: string;
  quiz_id: string;
  position: number;
  stem: string;
  options: { key: string; text: string }[];
  correct_key: string;
  explanation: string;
};

export type QuizAttemptRow = {
  id: string;
  quiz_id: string;
  answers: Record<string, string>;
  score: number;
  total: number;
  completed_at: string | null;
  created_at: string;
};

export async function loadQuizzes(): Promise<QuizRow[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("quizzes")
    .select("id, title, topic, source, session_id, total_questions, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[quiz] loadQuizzes error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function loadQuizWithQuestions(quizId: string): Promise<{
  quiz: QuizRow | null;
  questions: QuizQuestionRow[];
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { quiz: null, questions: [] };

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, title, topic, source, session_id, total_questions, created_at")
    .eq("id", quizId)
    .eq("user_id", user.id)
    .single();

  if (!quiz) return { quiz: null, questions: [] };

  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id, quiz_id, position, stem, options, correct_key, explanation")
    .eq("quiz_id", quizId)
    .order("position", { ascending: true });

  return { quiz, questions: questions ?? [] };
}

export async function loadQuizAttempts(quizId: string): Promise<QuizAttemptRow[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("id, quiz_id, answers, score, total, completed_at, created_at")
    .eq("quiz_id", quizId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[quiz] loadAttempts error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function saveQuizAttempt(
  quizId: string,
  answers: Record<string, string>,
  score: number,
  total: number
): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert({
      quiz_id: quizId,
      user_id: user.id,
      answers,
      score,
      total,
      completed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("[quiz] saveAttempt error:", error.message);
    return null;
  }
  return data.id;
}
