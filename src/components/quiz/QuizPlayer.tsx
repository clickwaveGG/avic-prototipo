"use client";

import { useState } from "react";
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import type { QuizQuestionRow } from "@/app/actions/quiz";

type QuizResult = {
  questionId: string;
  position: number;
  stem: string;
  options: { key: string; text: string }[];
  userAnswer: string | null;
  correctKey: string;
  isCorrect: boolean;
  explanation: string;
};

type EvaluateResponse = {
  attemptId: string | null;
  score: number;
  total: number;
  percentage: number;
  results: QuizResult[];
};

export function QuizPlayer({
  quizId,
  questions,
  title,
  onFinish,
}: {
  quizId: string;
  questions: QuizQuestionRow[];
  title: string;
  onFinish?: () => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<EvaluateResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;
  const allAnswered = questions.every((q) => answers[q.id]);

  async function handleSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/quiz/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      console.error("[QuizPlayer] submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Tela de resultado
  if (result) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Score header */}
        <div
          className="av-card"
          style={{
            padding: 28,
            textAlign: "center",
            marginBottom: 24,
            background:
              result.percentage >= 80
                ? "var(--brand-soft-bg)"
                : result.percentage >= 60
                ? "var(--accent-bg)"
                : "var(--bg-elev-1)",
          }}
        >
          <div
            className="serif"
            style={{ fontSize: 48, fontWeight: 700, marginBottom: 4 }}
          >
            {result.score}/{result.total}
          </div>
          <div style={{ fontSize: 15, color: "var(--ink-muted)", marginBottom: 4 }}>
            {result.percentage}% de acerto
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-faint)" }}>
            {result.percentage >= 80
              ? "Excelente! Material dominado."
              : result.percentage >= 60
              ? "Bom resultado. Revise os erros."
              : "Precisa revisar. Não desiste!"}
          </div>
        </div>

        {/* Questões com gabarito */}
        {result.results.map((r) => (
          <div
            key={r.questionId}
            className="av-card"
            style={{ padding: 20, marginBottom: 14 }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
              {r.isCorrect ? (
                <CheckCircle size={20} style={{ color: "var(--brand)", flexShrink: 0, marginTop: 2 }} />
              ) : (
                <XCircle size={20} style={{ color: "var(--alert)", flexShrink: 0, marginTop: 2 }} />
              )}
              <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>
                <span className="mono" style={{ color: "var(--ink-faint)", marginRight: 8 }}>
                  {r.position}.
                </span>
                {r.stem}
              </div>
            </div>

            <div style={{ marginLeft: 30 }}>
              {r.options.map((opt) => {
                const isUserChoice = r.userAnswer === opt.key;
                const isCorrectChoice = r.correctKey === opt.key;
                let bg = "transparent";
                let border = "1px solid var(--border)";
                if (isCorrectChoice) {
                  bg = "var(--brand-soft-bg)";
                  border = "1px solid var(--brand-soft)";
                } else if (isUserChoice && !r.isCorrect) {
                  bg = "var(--alert-bg, #FEF2F2)";
                  border = "1px solid var(--alert)";
                }

                return (
                  <div
                    key={opt.key}
                    style={{
                      padding: "8px 12px",
                      marginBottom: 4,
                      borderRadius: 8,
                      background: bg,
                      border,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      className="mono"
                      style={{ fontWeight: 600, color: "var(--ink-muted)", width: 18 }}
                    >
                      {opt.key}
                    </span>
                    {opt.text}
                  </div>
                );
              })}

              <div
                style={{
                  marginTop: 12,
                  padding: "10px 14px",
                  background: "var(--bg-elev-2)",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "var(--ink-muted)",
                  lineHeight: 1.55,
                }}
              >
                <strong style={{ color: "var(--ink)" }}>Gabarito:</strong> {r.explanation}
              </div>
            </div>
          </div>
        ))}

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
          <button
            onClick={onFinish}
            className="av-btn-soft"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <RotateCcw size={14} /> Voltar às sabatinas
          </button>
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 11,
            color: "var(--ink-faint)",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          Material de estudo. Não substitui avaliação acadêmica formal.
        </div>
      </div>
    );
  }

  // Tela de questão
  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      {/* Progress */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "var(--ink-muted)",
            marginBottom: 6,
          }}
        >
          <span className="serif" style={{ fontWeight: 600 }}>{title}</span>
          <span className="mono">
            {currentIdx + 1}/{questions.length}
          </span>
        </div>
        <div
          style={{
            height: 4,
            background: "var(--bg-elev-2)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${((currentIdx + 1) / questions.length) * 100}%`,
              background: "var(--brand)",
              borderRadius: 2,
              transition: "width 300ms ease-out",
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="av-card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.6, marginBottom: 20 }}>
          <span className="mono" style={{ color: "var(--accent)", marginRight: 10 }}>
            {question.position}.
          </span>
          {question.stem}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {question.options.map((opt: { key: string; text: string }) => {
            const isSelected = answers[question.id] === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() =>
                  setAnswers((prev) => ({ ...prev, [question.id]: opt.key }))
                }
                type="button"
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: isSelected
                    ? "2px solid var(--brand)"
                    : "1px solid var(--border)",
                  background: isSelected ? "var(--brand-soft-bg)" : "var(--bg-elev-1)",
                  textAlign: "left",
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "all 150ms",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontWeight: 700,
                    color: isSelected ? "var(--brand)" : "var(--ink-muted)",
                    width: 20,
                  }}
                >
                  {opt.key}
                </span>
                <span style={{ color: "var(--ink)" }}>{opt.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <button
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="av-btn-soft"
          style={{ opacity: currentIdx === 0 ? 0.4 : 1 }}
        >
          ← Anterior
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            className="av-btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              opacity: allAnswered ? 1 : 0.5,
            }}
          >
            {isSubmitting ? "Avaliando..." : "Finalizar sabatina"} <ArrowRight size={14} />
          </button>
        ) : (
          <button
            onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
            className="av-btn-soft"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            Próxima <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Question dots */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          marginTop: 20,
        }}
      >
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentIdx(i)}
            type="button"
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background:
                i === currentIdx
                  ? "var(--brand)"
                  : answers[q.id]
                  ? "var(--brand-soft)"
                  : "var(--bg-elev-2)",
              border: "none",
              cursor: "pointer",
              transition: "all 150ms",
            }}
            aria-label={`Questão ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
