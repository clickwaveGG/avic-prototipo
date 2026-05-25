import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { ensureQuizSchema } from "@/lib/ensure-quiz-schema";

const QUIZ_SYSTEM_PROMPT = `Você é o Hipócrates, assistente de estudos do Avicena. Gere um quiz para estudantes de saúde no Brasil.

FORMATO OBRIGATÓRIO: Responda APENAS com JSON válido, sem markdown, sem texto antes ou depois.

O JSON deve seguir esta estrutura exata:
{
  "title": "Título curto do quiz",
  "questions": [
    {
      "stem": "Enunciado da questão",
      "options": [
        {"key": "A", "text": "Alternativa A"},
        {"key": "B", "text": "Alternativa B"},
        {"key": "C", "text": "Alternativa C"},
        {"key": "D", "text": "Alternativa D"},
        {"key": "E", "text": "Alternativa E"}
      ],
      "correct_key": "C",
      "explanation": "Explicação detalhada de por que C é a resposta correta e as outras estão erradas."
    }
  ]
}

REGRAS:
- Gere exatamente 5 questões
- Estilo: Revalida / ENARE / provas de residência
- Dificuldade progressiva (fácil → difícil)
- Cada questão tem exatamente 5 alternativas (A-E)
- A explicação deve ser didática e citar conceitos-chave
- Use "raciocínio diagnóstico", nunca "diagnóstico" isolado
- Material de estudo — não substitui avaliação clínica presencial`;

type GenerateBody = {
  topic: string;
  sessionId?: string;
  context?: string;
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { allowed, remaining } = await rateLimit(user.id);
  if (!allowed) {
    return NextResponse.json({ error: "Limite diário atingido" }, { status: 429 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY não configurada" }, { status: 500 });
  }

  const body = (await req.json()) as GenerateBody;
  const { topic, sessionId, context } = body;

  if (!topic?.trim()) {
    return NextResponse.json({ error: "Tema obrigatório" }, { status: 400 });
  }

  await ensureQuizSchema();

  const anthropic = new Anthropic({ apiKey });

  const userPrompt = context
    ? `Gere um quiz sobre "${topic}" baseado neste contexto:\n\n${context}`
    : `Gere um quiz sobre "${topic}" para estudantes de saúde.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: QUIZ_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    // Parse JSON da resposta
    let quizData: {
      title: string;
      questions: {
        stem: string;
        options: { key: string; text: string }[];
        correct_key: string;
        explanation: string;
      }[];
    };

    try {
      // Tenta extrair JSON se vier com markdown
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Nenhum JSON encontrado na resposta");
      quizData = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(
        { error: "Hipócrates retornou formato inválido. Tente novamente." },
        { status: 502 }
      );
    }

    if (!quizData.questions || quizData.questions.length === 0) {
      return NextResponse.json(
        { error: "Quiz gerado sem questões. Tente novamente." },
        { status: 502 }
      );
    }

    // Salvar quiz no Supabase
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .insert({
        user_id: user.id,
        title: quizData.title || `Quiz: ${topic}`,
        topic,
        source: sessionId ? "chat" : "manual",
        session_id: sessionId || null,
        total_questions: quizData.questions.length,
      })
      .select("id")
      .single();

    if (quizError || !quiz) {
      console.error("[quiz/generate] insert quiz error:", quizError?.message);
      return NextResponse.json(
        { error: "Falha ao salvar quiz" },
        { status: 500 }
      );
    }

    // Salvar questões
    const questionsToInsert = quizData.questions.map((q, i) => ({
      quiz_id: quiz.id,
      position: i + 1,
      stem: q.stem,
      options: q.options,
      correct_key: q.correct_key,
      explanation: q.explanation,
    }));

    const { error: questionsError } = await supabase
      .from("quiz_questions")
      .insert(questionsToInsert);

    if (questionsError) {
      console.error("[quiz/generate] insert questions error:", questionsError.message);
    }

    return NextResponse.json(
      {
        quizId: quiz.id,
        title: quizData.title,
        questions: quizData.questions.map((q, i) => ({
          id: `q-${i + 1}`,
          position: i + 1,
          stem: q.stem,
          options: q.options,
        })),
        totalQuestions: quizData.questions.length,
      },
      { headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "erro desconhecido";
    return NextResponse.json(
      { error: `Falha ao gerar quiz: ${message}` },
      { status: 500 }
    );
  }
}
