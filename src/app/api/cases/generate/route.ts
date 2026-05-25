import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { ensureCasesSchema } from "@/lib/ensure-cases-schema";

const CASE_SYSTEM_PROMPT = `Você é o Hipócrates, assistente do Avicena. Gere um caso clínico simulado para estudo.

FORMATO OBRIGATÓRIO: Responda APENAS com JSON válido, sem markdown, sem texto antes ou depois.

O JSON deve seguir esta estrutura exata:
{
  "title": "Título curto do caso",
  "specialty": "Especialidade (ex: Cardiologia, Neurologia)",
  "steps": [
    {
      "phase": "identification",
      "title": "Identificação",
      "content": "Paciente de 58 anos, masculino, motorista...",
      "question": null,
      "options": null,
      "correct_key": null,
      "explanation": null
    },
    {
      "phase": "complaint",
      "title": "Queixa principal e HDA",
      "content": "Dor torácica em aperto há 2 horas...",
      "question": "Com base na queixa, qual a principal hipótese a considerar?",
      "options": [
        {"key": "A", "text": "Síndrome coronariana aguda"},
        {"key": "B", "text": "Tromboembolismo pulmonar"},
        {"key": "C", "text": "Dissecção de aorta"},
        {"key": "D", "text": "Pericardite aguda"}
      ],
      "correct_key": "A",
      "explanation": "A dor torácica em aperto com irradiação..."
    },
    {
      "phase": "exam",
      "title": "Exame físico",
      "content": "PA 160x100, FC 98bpm...",
      "question": "Qual achado do exame físico é mais relevante?",
      "options": [...],
      "correct_key": "...",
      "explanation": "..."
    },
    {
      "phase": "labs",
      "title": "Exames complementares",
      "content": "ECG: supradesnivelamento de ST em V1-V4...",
      "question": "O que o ECG sugere?",
      "options": [...],
      "correct_key": "...",
      "explanation": "..."
    },
    {
      "phase": "hypothesis",
      "title": "Raciocínio diagnóstico",
      "content": "Revisão sistemática dos achados...",
      "question": "Qual o diagnóstico mais provável?",
      "options": [...],
      "correct_key": "...",
      "explanation": "..."
    },
    {
      "phase": "management",
      "title": "Conduta",
      "content": "Abordagem terapêutica inicial...",
      "question": "Qual a conduta inicial mais adequada?",
      "options": [...],
      "correct_key": "...",
      "explanation": "..."
    }
  ]
}

REGRAS:
- Gere entre 5 e 7 etapas
- Revelação progressiva: cada etapa revela mais informação
- Questões devem ter exatamente 4 alternativas (A-D)
- As primeiras 1-2 etapas podem não ter questão (null)
- Use "raciocínio diagnóstico", nunca "diagnóstico" isolado
- Caso SIMULADO pedagógico — não substitui avaliação clínica presencial
- Não prescreva doses reais — redirecione para bula`;

type GenerateBody = {
  specialty: string;
  difficulty?: string;
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
  const { specialty, difficulty = "medium", context } = body;

  if (!specialty?.trim()) {
    return NextResponse.json({ error: "Especialidade obrigatória" }, { status: 400 });
  }

  await ensureCasesSchema();

  const anthropic = new Anthropic({ apiKey });

  const diffLabel = { easy: "fácil", medium: "intermediário", hard: "avançado" }[difficulty] ?? "intermediário";
  const userPrompt = context
    ? `Gere um caso clínico de ${specialty}, nível ${diffLabel}, baseado neste contexto:\n\n${context}`
    : `Gere um caso clínico de ${specialty}, nível ${diffLabel}, para estudantes de saúde.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: CASE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    let caseData: {
      title: string;
      specialty: string;
      steps: {
        phase: string;
        title: string;
        content: string;
        question: string | null;
        options: { key: string; text: string }[] | null;
        correct_key: string | null;
        explanation: string | null;
      }[];
    };

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Nenhum JSON encontrado");
      caseData = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(
        { error: "Hipócrates retornou formato inválido. Tente novamente." },
        { status: 502 }
      );
    }

    if (!caseData.steps || caseData.steps.length === 0) {
      return NextResponse.json(
        { error: "Caso gerado sem etapas. Tente novamente." },
        { status: 502 }
      );
    }

    // Salvar caso
    const { data: savedCase, error: caseError } = await supabase
      .from("clinical_cases")
      .insert({
        user_id: user.id,
        title: caseData.title || `Caso: ${specialty}`,
        specialty: caseData.specialty || specialty,
        difficulty,
        source: "manual",
        total_steps: caseData.steps.length,
      })
      .select("id")
      .single();

    if (caseError || !savedCase) {
      console.error("[cases/generate] insert error:", caseError?.message);
      return NextResponse.json({ error: "Falha ao salvar caso" }, { status: 500 });
    }

    // Salvar etapas
    const stepsToInsert = caseData.steps.map((s, i) => ({
      case_id: savedCase.id,
      position: i + 1,
      phase: s.phase,
      title: s.title,
      content: s.content,
      question: s.question,
      options: s.options,
      correct_key: s.correct_key,
      explanation: s.explanation,
    }));

    const { error: stepsError } = await supabase
      .from("case_steps")
      .insert(stepsToInsert);

    if (stepsError) {
      console.error("[cases/generate] insert steps error:", stepsError.message);
    }

    return NextResponse.json(
      {
        caseId: savedCase.id,
        title: caseData.title,
        specialty: caseData.specialty,
        totalSteps: caseData.steps.length,
      },
      { headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "erro desconhecido";
    return NextResponse.json(
      { error: `Falha ao gerar caso: ${message}` },
      { status: 500 }
    );
  }
}
