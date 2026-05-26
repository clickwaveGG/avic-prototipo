import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

type EvaluateBody = {
  quizId: string;
  answers: Record<string, string>; // { "question_id": "A" }
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const rl = await rateLimit(user.id);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Limite diário atingido", remaining: rl.remaining },
      { status: 429 }
    );
  }

  const body = (await req.json()) as EvaluateBody;
  const { quizId, answers } = body;

  if (!quizId || !answers) {
    return NextResponse.json({ error: "quizId e answers obrigatórios" }, { status: 400 });
  }

  // Buscar questões do quiz
  const { data: questions, error: qError } = await supabase
    .from("quiz_questions")
    .select("id, position, stem, options, correct_key, explanation")
    .eq("quiz_id", quizId)
    .order("position", { ascending: true });

  if (qError || !questions || questions.length === 0) {
    return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
  }

  // Verificar que o quiz pertence ao usuário
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id")
    .eq("id", quizId)
    .eq("user_id", user.id)
    .single();

  if (!quiz) {
    return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
  }

  // Avaliar respostas
  let score = 0;
  const results = questions.map((q) => {
    const userAnswer = answers[q.id] ?? null;
    const isCorrect = userAnswer === q.correct_key;
    if (isCorrect) score++;

    return {
      questionId: q.id,
      position: q.position,
      stem: q.stem,
      options: q.options,
      userAnswer,
      correctKey: q.correct_key,
      isCorrect,
      explanation: q.explanation,
    };
  });

  // Salvar tentativa
  const { data: attempt, error: attemptError } = await supabase
    .from("quiz_attempts")
    .insert({
      quiz_id: quizId,
      user_id: user.id,
      answers,
      score,
      total: questions.length,
      completed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (attemptError) {
    console.error("[quiz/evaluate] save attempt error:", attemptError.message);
  }

  return NextResponse.json({
    attemptId: attempt?.id ?? null,
    score,
    total: questions.length,
    percentage: Math.round((score / questions.length) * 100),
    results,
  });
}
