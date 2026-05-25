"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ClipboardCheck,
  Trophy,
  Clock,
} from "lucide-react";
import { AvicenaMark } from "@/components/avicena";
import { QuizGenerator, QuizPlayer } from "@/components/quiz";
import {
  loadQuizzes,
  loadQuizWithQuestions,
  loadQuizAttempts,
  type QuizRow,
  type QuizQuestionRow,
  type QuizAttemptRow,
} from "@/app/actions/quiz";

type Profile = {
  display_name: string | null;
  tier: string | null;
};

type ViewState =
  | { mode: "list" }
  | { mode: "playing"; quizId: string; questions: QuizQuestionRow[]; title: string }
  | { mode: "loading" };

export function SabatinasView({
  email,
  profile,
}: {
  email: string;
  profile: Profile | null;
}) {
  const [quizzes, setQuizzes] = useState<QuizRow[]>([]);
  const [attempts, setAttempts] = useState<Record<string, QuizAttemptRow[]>>({});
  const [viewState, setViewState] = useState<ViewState>({ mode: "list" });
  const [isLoading, setIsLoading] = useState(true);

  const displayName = profile?.display_name?.trim() || email?.split("@")[0] || "estudante";

  const refreshQuizzes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await loadQuizzes();
      setQuizzes(data);

      // Buscar tentativas para cada quiz
      const attemptsMap: Record<string, QuizAttemptRow[]> = {};
      for (const q of data.slice(0, 20)) {
        attemptsMap[q.id] = await loadQuizAttempts(q.id);
      }
      setAttempts(attemptsMap);
    } catch {
      // silencioso
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshQuizzes();
  }, [refreshQuizzes]);

  async function handleStartQuiz(quizId: string) {
    setViewState({ mode: "loading" });
    const { quiz, questions } = await loadQuizWithQuestions(quizId);
    if (!quiz || questions.length === 0) {
      setViewState({ mode: "list" });
      return;
    }
    setViewState({
      mode: "playing",
      quizId,
      questions,
      title: quiz.title,
    });
  }

  async function handleGenerated(quizId: string) {
    await handleStartQuiz(quizId);
  }

  function handleFinish() {
    setViewState({ mode: "list" });
    refreshQuizzes();
  }

  // Playing mode
  if (viewState.mode === "playing") {
    return (
      <div className="av" style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <header
          style={{
            padding: "14px 24px",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-elev-1)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <button
            onClick={handleFinish}
            style={{ padding: 6, color: "var(--ink-muted)" }}
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
          </button>
          <AvicenaMark size={22} />
          <span className="serif" style={{ fontSize: 16, fontWeight: 600 }}>
            Sabatina
          </span>
        </header>

        <div style={{ padding: "28px 24px 64px" }}>
          <QuizPlayer
            quizId={viewState.quizId}
            questions={viewState.questions}
            title={viewState.title}
            onFinish={handleFinish}
          />
        </div>
      </div>
    );
  }

  // Loading mode
  if (viewState.mode === "loading") {
    return (
      <div
        className="av"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <AvicenaMark size={32} />
          <div
            style={{
              marginTop: 12,
              fontSize: 14,
              color: "var(--ink-muted)",
              fontStyle: "italic",
            }}
          >
            Carregando sabatina...
          </div>
        </div>
      </div>
    );
  }

  // List mode
  return (
    <div className="av" style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <header
        style={{
          padding: "14px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-elev-1)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Link href="/" style={{ padding: 6, color: "var(--ink-muted)" }} aria-label="Voltar">
          <ArrowLeft size={18} />
        </Link>
        <AvicenaMark size={22} />
        <span className="serif" style={{ fontSize: 16, fontWeight: 600 }}>
          Sabatinas
        </span>
        <div style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--ink-muted)" }}>
          {displayName}
        </div>
      </header>

      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "28px 24px 64px",
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <h1
            className="serif"
            style={{
              fontSize: "clamp(24px, 4vw, 32px)",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Tuas sabatinas
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-muted)" }}>
            Gere quizzes com IA sobre qualquer tema da saúde. 5 questões estilo Revalida.
          </p>
        </div>

        <QuizGenerator onGenerated={handleGenerated} />

        {isLoading && quizzes.length === 0 ? (
          <div
            style={{
              marginTop: 32,
              textAlign: "center",
              color: "var(--ink-faint)",
              fontStyle: "italic",
              fontSize: 14,
            }}
          >
            Carregando sabatinas...
          </div>
        ) : quizzes.length === 0 ? (
          <div
            style={{
              marginTop: 32,
              textAlign: "center",
              color: "var(--ink-faint)",
              fontSize: 14,
            }}
          >
            <ClipboardCheck size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
            <div>Nenhuma sabatina ainda. Gere a primeira acima!</div>
          </div>
        ) : (
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "var(--ink-muted)",
                marginBottom: 12,
              }}
            >
              Historial · {quizzes.length} sabatina{quizzes.length > 1 ? "s" : ""}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {quizzes.map((q) => {
                const qAttempts = attempts[q.id] ?? [];
                const bestAttempt = qAttempts.length > 0
                  ? qAttempts.reduce((a, b) => (a.score > b.score ? a : b))
                  : null;

                return (
                  <button
                    key={q.id}
                    onClick={() => handleStartQuiz(q.id)}
                    type="button"
                    className="av-card is-interactive"
                    style={{
                      padding: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      textAlign: "left",
                      width: "100%",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: bestAttempt
                          ? bestAttempt.score === bestAttempt.total
                            ? "var(--brand-soft-bg)"
                            : "var(--accent-bg)"
                          : "var(--bg-elev-2)",
                        color: bestAttempt
                          ? bestAttempt.score === bestAttempt.total
                            ? "var(--brand)"
                            : "#6F5417"
                          : "var(--ink-muted)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {bestAttempt ? <Trophy size={18} /> : <ClipboardCheck size={18} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                        {q.title}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>
                        {q.topic} · {q.total_questions} questões
                        {bestAttempt && (
                          <span style={{ marginLeft: 8, color: "var(--brand)" }}>
                            Melhor: {bestAttempt.score}/{bestAttempt.total}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--ink-faint)",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        flexShrink: 0,
                      }}
                    >
                      <Clock size={12} />
                      {new Date(q.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
