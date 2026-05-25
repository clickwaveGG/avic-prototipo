"use client";

import { useState } from "react";
import { ChevronRight, CheckCircle, XCircle, RotateCcw, Eye } from "lucide-react";
import { saveCaseAttempt } from "@/app/actions/cases";
import type { CaseStepRow } from "@/app/actions/cases";

const PHASE_LABELS: Record<string, string> = {
  identification: "Identificação",
  complaint: "Queixa principal",
  history: "Histórico",
  exam: "Exame físico",
  labs: "Exames complementares",
  hypothesis: "Raciocínio diagnóstico",
  management: "Conduta",
};

export function CasePlayer({
  caseId,
  steps,
  title,
  specialty,
  onFinish,
}: {
  caseId: string;
  steps: CaseStepRow[];
  title: string;
  specialty: string;
  onFinish?: () => void;
}) {
  const [revealedUpTo, setRevealedUpTo] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [isComplete, setIsComplete] = useState(false);

  const currentStep = steps[revealedUpTo];
  const hasQuestion = !!(currentStep?.question && currentStep?.options);
  const isAnswered = hasQuestion && !!answers[currentStep.id];
  const isLastStep = revealedUpTo === steps.length - 1;

  function handleAnswer(stepId: string, key: string) {
    if (answers[stepId]) return; // Já respondeu
    setAnswers((prev) => ({ ...prev, [stepId]: key }));
  }

  function revealNext() {
    if (isLastStep) {
      // Calcular score e finalizar
      let score = 0;
      let total = 0;
      for (const step of steps) {
        if (step.question && step.correct_key) {
          total++;
          if (answers[step.id] === step.correct_key) score++;
        }
      }
      saveCaseAttempt(caseId, answers, score, total).catch(() => {});
      setIsComplete(true);
      return;
    }
    setRevealedUpTo((i) => Math.min(steps.length - 1, i + 1));
  }

  // Tela final
  if (isComplete) {
    let score = 0;
    let total = 0;
    for (const step of steps) {
      if (step.question && step.correct_key) {
        total++;
        if (answers[step.id] === step.correct_key) score++;
      }
    }
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;

    return (
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div
          className="av-card"
          style={{
            padding: 28,
            textAlign: "center",
            marginBottom: 24,
            background: pct >= 80 ? "var(--brand-soft-bg)" : pct >= 60 ? "var(--accent-bg)" : "var(--bg-elev-1)",
          }}
        >
          <div style={{ fontSize: 12, color: "var(--ink-muted)", marginBottom: 4 }}>{specialty}</div>
          <div className="serif" style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>{title}</div>
          <div className="serif" style={{ fontSize: 48, fontWeight: 700, marginBottom: 4 }}>
            {score}/{total}
          </div>
          <div style={{ fontSize: 15, color: "var(--ink-muted)" }}>
            {pct}% de acerto no raciocínio
          </div>
        </div>

        {/* Review de cada etapa */}
        {steps.map((step) => (
          <div key={step.id} className="av-card" style={{ padding: 18, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span
                className="mono"
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: "var(--bg-elev-2)",
                  color: "var(--ink-muted)",
                }}
              >
                {PHASE_LABELS[step.phase] ?? step.phase}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{step.title}</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-muted)", lineHeight: 1.6, marginBottom: 8 }}>
              {step.content}
            </div>
            {step.question && step.correct_key && (
              <div style={{ marginTop: 8, padding: "10px 14px", background: "var(--bg-elev-2)", borderRadius: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{step.question}</div>
                <div style={{ fontSize: 12 }}>
                  {answers[step.id] === step.correct_key ? (
                    <span style={{ color: "var(--brand)", display: "flex", alignItems: "center", gap: 4 }}>
                      <CheckCircle size={14} /> Correto: {step.correct_key}
                    </span>
                  ) : (
                    <span style={{ color: "var(--alert)", display: "flex", alignItems: "center", gap: 4 }}>
                      <XCircle size={14} /> Resposta: {answers[step.id] ?? "—"} · Correto: {step.correct_key}
                    </span>
                  )}
                </div>
                {step.explanation && (
                  <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 6 }}>
                    {step.explanation}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
          <button onClick={onFinish} className="av-btn-soft" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <RotateCcw size={14} /> Voltar aos casos
          </button>
        </div>
      </div>
    );
  }

  // Tela de jogo — revelação progressiva
  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-muted)", marginBottom: 6 }}>
          <span className="serif" style={{ fontWeight: 600 }}>{title}</span>
          <span className="mono">{specialty}</span>
        </div>
        <div style={{ height: 4, background: "var(--bg-elev-2)", borderRadius: 2, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${((revealedUpTo + 1) / steps.length) * 100}%`,
              background: "var(--brand)",
              borderRadius: 2,
              transition: "width 300ms ease-out",
            }}
          />
        </div>
      </div>

      {/* Etapas reveladas */}
      {steps.slice(0, revealedUpTo + 1).map((step, idx) => {
        const isCurrent = idx === revealedUpTo;
        const stepAnswered = step.question ? !!answers[step.id] : true;

        return (
          <div
            key={step.id}
            className="av-card"
            style={{
              padding: 20,
              marginBottom: 14,
              borderLeft: isCurrent ? "3px solid var(--brand)" : "3px solid transparent",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span
                className="mono"
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: isCurrent ? "var(--brand-soft-bg)" : "var(--bg-elev-2)",
                  color: isCurrent ? "var(--brand)" : "var(--ink-muted)",
                  fontWeight: 600,
                }}
              >
                {PHASE_LABELS[step.phase] ?? step.phase}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{step.title}</span>
            </div>

            <div style={{ fontSize: 14, lineHeight: 1.65, color: "var(--ink)", whiteSpace: "pre-wrap" }}>
              {step.content}
            </div>

            {/* Pergunta */}
            {step.question && step.options && (
              <div style={{ marginTop: 16, padding: "14px 16px", background: "var(--bg-elev-2)", borderRadius: 10 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 12 }}>
                  {step.question}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {(step.options as { key: string; text: string }[]).map((opt) => {
                    const isSelected = answers[step.id] === opt.key;
                    const isCorrect = step.correct_key === opt.key;
                    const revealed = !!answers[step.id];

                    let bg = "var(--bg-elev-1)";
                    let border = "1px solid var(--border)";
                    if (revealed && isCorrect) {
                      bg = "var(--brand-soft-bg)";
                      border = "1px solid var(--brand-soft)";
                    } else if (revealed && isSelected && !isCorrect) {
                      bg = "var(--alert-bg, #FEF2F2)";
                      border = "1px solid var(--alert)";
                    } else if (isSelected) {
                      bg = "var(--brand-soft-bg)";
                      border = "2px solid var(--brand)";
                    }

                    return (
                      <button
                        key={opt.key}
                        onClick={() => handleAnswer(step.id, opt.key)}
                        disabled={!!answers[step.id]}
                        type="button"
                        style={{
                          padding: "10px 14px",
                          borderRadius: 8,
                          border,
                          background: bg,
                          textAlign: "left",
                          fontSize: 13,
                          cursor: answers[step.id] ? "default" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span className="mono" style={{ fontWeight: 700, color: "var(--ink-muted)", width: 18 }}>
                          {opt.key}
                        </span>
                        {opt.text}
                        {revealed && isCorrect && <CheckCircle size={14} style={{ marginLeft: "auto", color: "var(--brand)" }} />}
                        {revealed && isSelected && !isCorrect && <XCircle size={14} style={{ marginLeft: "auto", color: "var(--alert)" }} />}
                      </button>
                    );
                  })}
                </div>

                {/* Explicação */}
                {answers[step.id] && step.explanation && (
                  <div style={{ marginTop: 10 }}>
                    <button
                      onClick={() => setShowExplanation((prev) => ({ ...prev, [step.id]: !prev[step.id] }))}
                      type="button"
                      style={{ fontSize: 12, color: "var(--brand)", display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <Eye size={12} /> {showExplanation[step.id] ? "Ocultar" : "Ver"} explicação
                    </button>
                    {showExplanation[step.id] && (
                      <div style={{ marginTop: 8, fontSize: 12.5, color: "var(--ink-muted)", lineHeight: 1.55 }}>
                        {step.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Botão de avançar */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <button
          onClick={revealNext}
          disabled={hasQuestion && !isAnswered}
          className="av-btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            opacity: (hasQuestion && !isAnswered) ? 0.5 : 1,
          }}
        >
          {isLastStep ? "Finalizar caso" : "Revelar próxima etapa"} <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ marginTop: 16, fontSize: 11, color: "var(--ink-faint)", textAlign: "center", fontStyle: "italic" }}>
        Caso clínico simulado. Material de estudo — não substitui avaliação clínica presencial.
      </div>
    </div>
  );
}
