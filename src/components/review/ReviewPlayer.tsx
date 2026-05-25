"use client";

import { useState } from "react";
import { RotateCcw, Check } from "lucide-react";
import { reviewCard, type FlashcardRow } from "@/app/actions/flashcards";

const GRADE_BUTTONS = [
  { grade: 0, label: "Esqueci", color: "var(--alert)", bg: "var(--alert-bg, #FEF2F2)" },
  { grade: 3, label: "Difícil", color: "#B45309", bg: "#FEF3C7" },
  { grade: 4, label: "Bom", color: "var(--brand)", bg: "var(--brand-soft-bg)" },
  { grade: 5, label: "Fácil", color: "#059669", bg: "#D1FAE5" },
];

export function ReviewPlayer({
  cards: initialCards,
  onFinish,
}: {
  cards: FlashcardRow[];
  onFinish: () => void;
}) {
  const [cards] = useState(initialCards);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const card = cards[currentIdx];
  const isComplete = currentIdx >= cards.length;

  async function handleGrade(grade: number) {
    if (isSubmitting || !card) return;
    setIsSubmitting(true);

    await reviewCard(card.id, grade);

    setReviewedCount((c) => c + 1);
    setIsFlipped(false);
    setCurrentIdx((i) => i + 1);
    setIsSubmitting(false);
  }

  // Tela de conclusão
  if (isComplete) {
    return (
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", padding: "48px 24px" }}>
        <div
          style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "var(--brand-soft-bg)", color: "var(--brand)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Check size={32} />
        </div>
        <div className="serif" style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
          Sessão concluída!
        </div>
        <div style={{ fontSize: 15, color: "var(--ink-muted)", marginBottom: 24 }}>
          {reviewedCount} card{reviewedCount > 1 ? "s" : ""} revisado{reviewedCount > 1 ? "s" : ""}.
          Os intervalos foram atualizados pelo algoritmo SM-2.
        </div>
        <button
          onClick={onFinish}
          className="av-btn-soft"
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <RotateCcw size={14} /> Voltar
        </button>
      </div>
    );
  }

  // Card de revisão
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-muted)", marginBottom: 12 }}>
        <span>Revisão SRS</span>
        <span className="mono">{currentIdx + 1}/{cards.length}</span>
      </div>
      <div style={{ height: 4, background: "var(--bg-elev-2)", borderRadius: 2, overflow: "hidden", marginBottom: 24 }}>
        <div style={{
          height: "100%",
          width: `${((currentIdx + 1) / cards.length) * 100}%`,
          background: "var(--brand)",
          borderRadius: 2,
          transition: "width 300ms ease-out",
        }} />
      </div>

      {/* Topic badge */}
      {card.topic && (
        <div style={{ marginBottom: 12 }}>
          <span className="mono" style={{
            fontSize: 10, padding: "3px 8px", borderRadius: 4,
            background: "var(--bg-elev-2)", color: "var(--ink-muted)",
          }}>
            {card.topic}
          </span>
        </div>
      )}

      {/* Flashcard */}
      <div
        onClick={() => !isFlipped && setIsFlipped(true)}
        style={{
          minHeight: 220,
          padding: 32,
          borderRadius: 16,
          border: "1px solid var(--border)",
          background: isFlipped ? "var(--bg-elev-1)" : "var(--bg)",
          cursor: isFlipped ? "default" : "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          transition: "all 200ms",
          position: "relative",
        }}
      >
        {!isFlipped ? (
          <>
            <div style={{ fontSize: 16, lineHeight: 1.6, fontWeight: 500, color: "var(--ink)" }}>
              {card.front}
            </div>
            <div style={{
              marginTop: 20, fontSize: 12, color: "var(--ink-faint)",
              padding: "4px 12px", borderRadius: 8,
              border: "1px solid var(--border)",
            }}>
              Toque para revelar
            </div>
          </>
        ) : (
          <>
            <div style={{
              fontSize: 12, color: "var(--ink-faint)", marginBottom: 12,
              textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600,
            }}>
              Resposta
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.65, color: "var(--ink)", whiteSpace: "pre-wrap" }}>
              {card.back}
            </div>
          </>
        )}
      </div>

      {/* Grade buttons */}
      {isFlipped && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, color: "var(--ink-muted)", textAlign: "center", marginBottom: 10 }}>
            Como foi?
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {GRADE_BUTTONS.map((btn) => (
              <button
                key={btn.grade}
                onClick={() => handleGrade(btn.grade)}
                disabled={isSubmitting}
                type="button"
                style={{
                  padding: "12px 8px",
                  borderRadius: 10,
                  border: `1px solid ${btn.color}`,
                  background: btn.bg,
                  color: btn.color,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 150ms",
                  opacity: isSubmitting ? 0.5 : 1,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 20, fontSize: 11, color: "var(--ink-faint)", textAlign: "center", fontStyle: "italic" }}>
        Algoritmo SM-2 · intervalos se adaptam à tua performance
      </div>
    </div>
  );
}
