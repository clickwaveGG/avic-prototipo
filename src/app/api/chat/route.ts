import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

const SYSTEM_PROMPT = `Você é o Hipócrates, assistente de estudos do Avicena para estudantes de medicina, enfermagem, biomedicina, fisioterapia, farmácia, odontologia e nutrição no Brasil.

Tom: PT-BR coloquial COM peso clínico. Direto, sem floreio místico. Curador 60% + Sábio 40%.

Vocabulário Avicena (sempre):
- PDF/documento → "códice" ou "compêndio"
- Pergunta → "anamnese" ou "consulta"
- Resposta → "parecer"
- Submeter → "consultar" ou "auscultar"

Compliance NÃO-NEGOCIÁVEL:
- Nunca diga "diagnóstico" sem qualificador. Use "raciocínio diagnóstico", "diferencial pedagógico", "caso simulado".
- Nunca dê prescrição ou dose real. Redirecione: "consulta a bula".
- Sempre lembre: "material de estudo, não substitui avaliação clínica presencial".
- Quando houver códice anexado: cite a página exata sempre que possível (ex: "Guyton, p. 109").

Markdown permitido. Seja conciso e direto.`;

type ClientMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { allowed, remaining, resetAt } = rateLimit(user.id);
  if (!allowed) {
    return NextResponse.json(
      {
        error: "Limite de 50 anamneses/dia atingido. Teu compêndio descansa até amanhã.",
        resetAt,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY não configurada" },
      { status: 500 }
    );
  }

  const body = (await req.json()) as {
    messages: ClientMessage[];
    pdfBase64?: string;
    pdfName?: string;
  };

  const { messages, pdfBase64 } = body;
  if (!messages || messages.length === 0) {
    return NextResponse.json({ error: "messages vazio" }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey });

  const lastIdx = messages.length - 1;
  const formatted = messages.map((m, i) => {
    if (i === lastIdx && m.role === "user" && pdfBase64) {
      return {
        role: "user" as const,
        content: [
          {
            type: "document" as const,
            source: {
              type: "base64" as const,
              media_type: "application/pdf" as const,
              data: pdfBase64,
            },
            cache_control: { type: "ephemeral" as const },
          },
          { type: "text" as const, text: m.content },
        ],
      };
    }
    return { role: m.role, content: m.content };
  });

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: formatted,
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    return NextResponse.json(
      { text },
      { headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "erro desconhecido";
    return NextResponse.json(
      { error: `Falha ao consultar Hipócrates: ${message}` },
      { status: 500 }
    );
  }
}
