import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { ensureFlashcardsSchema } from "@/lib/ensure-flashcards-schema";

const FLASHCARD_SYSTEM_PROMPT = `Você é o Hipócrates, assistente do Avicena. Gere flashcards para estudo por repetição espaçada.

FORMATO OBRIGATÓRIO: Responda APENAS com JSON válido, sem markdown.

{
  "cards": [
    {
      "front": "Pergunta concisa (o que precisa ser lembrado)",
      "back": "Resposta objetiva com os pontos-chave"
    }
  ]
}

REGRAS:
- Gere entre 5 e 10 flashcards
- Front: pergunta direta, sem ambiguidade
- Back: resposta concisa mas completa, com mnemonicos quando útil
- Foco em fatos de alta retenção (mecanismos, classificações, valores de referência)
- Estilo: questões que caem em Revalida/ENARE
- Use "raciocínio diagnóstico" em vez de "diagnóstico" isolado
- Material de estudo — não substitui avaliação clínica`;

type GenerateBody = {
  topic: string;
  count?: number;
  context?: string;
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { allowed, remaining } = await rateLimit(user.id);
  if (!allowed) return NextResponse.json({ error: "Limite diário atingido" }, { status: 429 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY não configurada" }, { status: 500 });

  const body = (await req.json()) as GenerateBody;
  const { topic, count = 8, context } = body;
  if (!topic?.trim()) return NextResponse.json({ error: "Tema obrigatório" }, { status: 400 });

  await ensureFlashcardsSchema();

  const anthropic = new Anthropic({ apiKey });

  const userPrompt = context
    ? `Gere ${count} flashcards sobre "${topic}" baseados neste contexto:\n\n${context}`
    : `Gere ${count} flashcards sobre "${topic}" para estudantes de saúde.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: FLASHCARD_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    let parsed: { cards: { front: string; back: string }[] };
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Nenhum JSON");
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json({ error: "Formato inválido. Tente novamente." }, { status: 502 });
    }

    if (!parsed.cards?.length) {
      return NextResponse.json({ error: "Nenhum flashcard gerado." }, { status: 502 });
    }

    // Salvar flashcards
    const cardsToInsert = parsed.cards.map((c) => ({
      user_id: user.id,
      front: c.front,
      back: c.back,
      topic,
      source: "manual" as const,
    }));

    const { data: savedCards, error: insertError } = await supabase
      .from("flashcards")
      .insert(cardsToInsert)
      .select("id, front, back");

    if (insertError) {
      console.error("[flashcards/generate] insert error:", insertError.message);
      return NextResponse.json({ error: "Falha ao salvar flashcards" }, { status: 500 });
    }

    return NextResponse.json(
      { cards: savedCards, count: savedCards?.length ?? 0, topic },
      { headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "erro desconhecido";
    return NextResponse.json({ error: `Falha ao gerar: ${message}` }, { status: 500 });
  }
}
