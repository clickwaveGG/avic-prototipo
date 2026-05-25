"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

export function FlashcardGenerator({
  onGenerated,
}: {
  onGenerated: () => void;
}) {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleGenerate() {
    if (!topic.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/flashcards/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falha");
      setSuccess(`${data.count} flashcards gerados sobre "${data.topic}"`);
      setTopic("");
      onGenerated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="av-card" style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <div className="serif" style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
          Gerar flashcards
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-muted)" }}>
          Hipócrates cria flashcards otimizados para repetição espaçada.
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleGenerate(); }}
          placeholder="Ex: Farmacologia dos betabloqueadores, Semiologia cardíaca..."
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 10,
            border: "1px solid var(--border)", background: "var(--bg-elev-1)",
            fontSize: 14, color: "var(--ink)",
          }}
          disabled={isGenerating}
        />
        <button
          onClick={handleGenerate}
          disabled={!topic.trim() || isGenerating}
          className="av-btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", flexShrink: 0 }}
        >
          {isGenerating ? <><Loader2 size={14} className="av-spin" /> Gerando...</> : <><Sparkles size={14} /> Gerar</>}
        </button>
      </div>

      {error && <div style={{ marginTop: 10, fontSize: 13, color: "var(--alert)" }}>{error}</div>}
      {success && <div style={{ marginTop: 10, fontSize: 13, color: "var(--brand)" }}>{success}</div>}
    </div>
  );
}
