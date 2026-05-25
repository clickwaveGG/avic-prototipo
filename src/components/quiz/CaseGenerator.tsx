"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

const SPECIALTIES = [
  "Cardiologia", "Neurologia", "Pneumologia", "Gastroenterologia",
  "Endocrinologia", "Nefrologia", "Infectologia", "Reumatologia",
  "Hematologia", "Emergência",
];

export function CaseGenerator({
  onGenerated,
}: {
  onGenerated: (caseId: string) => void;
}) {
  const [specialty, setSpecialty] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!specialty.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/cases/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specialty: specialty.trim(), difficulty }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falha ao gerar caso");
      onGenerated(data.caseId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar caso");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="av-card" style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <div className="serif" style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
          Novo caso clínico
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-muted)" }}>
          Hipócrates gera um caso com revelação progressiva e raciocínio diagnóstico.
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px" }}>
          <input
            type="text"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleGenerate(); }}
            placeholder="Especialidade (ex: Cardiologia)"
            list="specialties"
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg-elev-1)",
              fontSize: 14,
              color: "var(--ink)",
            }}
            disabled={isGenerating}
          />
          <datalist id="specialties">
            {SPECIALTIES.map((s) => <option key={s} value={s} />)}
          </datalist>
        </div>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--bg-elev-1)",
            fontSize: 13,
            color: "var(--ink)",
          }}
          disabled={isGenerating}
        >
          <option value="easy">Fácil</option>
          <option value="medium">Intermediário</option>
          <option value="hard">Avançado</option>
        </select>

        <button
          onClick={handleGenerate}
          disabled={!specialty.trim() || isGenerating}
          className="av-btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", flexShrink: 0 }}
        >
          {isGenerating ? (
            <><Loader2 size={14} className="av-spin" /> Gerando...</>
          ) : (
            <><Sparkles size={14} /> Gerar caso</>
          )}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 10, fontSize: 13, color: "var(--alert)" }}>{error}</div>
      )}
    </div>
  );
}
