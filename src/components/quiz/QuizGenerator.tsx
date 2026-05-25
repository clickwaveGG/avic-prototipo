"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

export function QuizGenerator({
  onGenerated,
}: {
  onGenerated: (quizId: string) => void;
}) {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!topic.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Falha ao gerar quiz");
      }

      onGenerated(data.quizId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar quiz");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="av-card" style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <div
          className="serif"
          style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}
        >
          Nova sabatina
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-muted)" }}>
          Hipócrates gera 5 questões estilo Revalida sobre o tema escolhido.
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleGenerate();
          }}
          placeholder="Ex: Insuficiência cardíaca, Farmacologia dos anti-hipertensivos..."
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--bg-elev-1)",
            fontSize: 14,
            color: "var(--ink)",
          }}
          disabled={isGenerating}
        />
        <button
          onClick={handleGenerate}
          disabled={!topic.trim() || isGenerating}
          className="av-btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 18px",
            flexShrink: 0,
          }}
        >
          {isGenerating ? (
            <>
              <Loader2 size={14} className="av-spin" /> Gerando...
            </>
          ) : (
            <>
              <Sparkles size={14} /> Gerar sabatina
            </>
          )}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 10, fontSize: 13, color: "var(--alert)" }}>
          {error}
        </div>
      )}
    </div>
  );
}
