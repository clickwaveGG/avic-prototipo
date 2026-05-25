"use server";

import { createClient } from "@/lib/supabase/server";

export type CaseRow = {
  id: string;
  title: string;
  specialty: string;
  difficulty: string;
  source: string;
  total_steps: number;
  created_at: string;
};

export type CaseStepRow = {
  id: string;
  case_id: string;
  position: number;
  phase: string;
  title: string;
  content: string;
  question: string | null;
  options: { key: string; text: string }[] | null;
  correct_key: string | null;
  explanation: string | null;
};

export type CaseAttemptRow = {
  id: string;
  case_id: string;
  answers: Record<string, string>;
  score: number;
  total: number;
  completed_at: string | null;
  created_at: string;
};

export async function loadCases(): Promise<CaseRow[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("clinical_cases")
    .select("id, title, specialty, difficulty, source, total_steps, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[cases] loadCases error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function loadCaseWithSteps(caseId: string): Promise<{
  clinicalCase: CaseRow | null;
  steps: CaseStepRow[];
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { clinicalCase: null, steps: [] };

  const { data: clinicalCase } = await supabase
    .from("clinical_cases")
    .select("id, title, specialty, difficulty, source, total_steps, created_at")
    .eq("id", caseId)
    .eq("user_id", user.id)
    .single();

  if (!clinicalCase) return { clinicalCase: null, steps: [] };

  const { data: steps } = await supabase
    .from("case_steps")
    .select("id, case_id, position, phase, title, content, question, options, correct_key, explanation")
    .eq("case_id", caseId)
    .order("position", { ascending: true });

  return { clinicalCase, steps: steps ?? [] };
}

export async function loadCaseAttempts(caseId: string): Promise<CaseAttemptRow[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("case_attempts")
    .select("id, case_id, answers, score, total, completed_at, created_at")
    .eq("case_id", caseId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function saveCaseAttempt(
  caseId: string,
  answers: Record<string, string>,
  score: number,
  total: number
): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("case_attempts")
    .insert({
      case_id: caseId,
      user_id: user.id,
      answers,
      score,
      total,
      completed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("[cases] saveAttempt error:", error.message);
    return null;
  }
  return data.id;
}
