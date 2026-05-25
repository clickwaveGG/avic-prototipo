"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  UserSearch,
  Trophy,
  Clock,
  Stethoscope,
} from "lucide-react";
import { AvicenaMark } from "@/components/avicena";
import { CaseGenerator, CasePlayer } from "@/components/quiz";
import {
  loadCases,
  loadCaseWithSteps,
  loadCaseAttempts,
  type CaseRow,
  type CaseStepRow,
  type CaseAttemptRow,
} from "@/app/actions/cases";

type Profile = { display_name: string | null; tier: string | null };

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Fácil",
  medium: "Intermediário",
  hard: "Avançado",
};

type ViewState =
  | { mode: "list" }
  | { mode: "playing"; caseId: string; steps: CaseStepRow[]; title: string; specialty: string }
  | { mode: "loading" };

export function CasosView({ email, profile }: { email: string; profile: Profile | null }) {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [attempts, setAttempts] = useState<Record<string, CaseAttemptRow[]>>({});
  const [viewState, setViewState] = useState<ViewState>({ mode: "list" });
  const [isLoading, setIsLoading] = useState(true);

  const displayName = profile?.display_name?.trim() || email?.split("@")[0] || "estudante";

  const refreshCases = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await loadCases();
      setCases(data);
      const attemptsMap: Record<string, CaseAttemptRow[]> = {};
      for (const c of data.slice(0, 20)) {
        attemptsMap[c.id] = await loadCaseAttempts(c.id);
      }
      setAttempts(attemptsMap);
    } catch { /* silencioso */ } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refreshCases(); }, [refreshCases]);

  async function handleStartCase(caseId: string) {
    setViewState({ mode: "loading" });
    const { clinicalCase, steps } = await loadCaseWithSteps(caseId);
    if (!clinicalCase || steps.length === 0) {
      setViewState({ mode: "list" });
      return;
    }
    setViewState({
      mode: "playing",
      caseId,
      steps,
      title: clinicalCase.title,
      specialty: clinicalCase.specialty,
    });
  }

  function handleFinish() {
    setViewState({ mode: "list" });
    refreshCases();
  }

  // Playing
  if (viewState.mode === "playing") {
    return (
      <div className="av" style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <header style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg-elev-1)", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={handleFinish} style={{ padding: 6, color: "var(--ink-muted)" }} aria-label="Voltar">
            <ArrowLeft size={18} />
          </button>
          <AvicenaMark size={22} />
          <span className="serif" style={{ fontSize: 16, fontWeight: 600 }}>Caso Clínico</span>
        </header>
        <div style={{ padding: "28px 24px 64px" }}>
          <CasePlayer
            caseId={viewState.caseId}
            steps={viewState.steps}
            title={viewState.title}
            specialty={viewState.specialty}
            onFinish={handleFinish}
          />
        </div>
      </div>
    );
  }

  // Loading
  if (viewState.mode === "loading") {
    return (
      <div className="av" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ textAlign: "center" }}>
          <AvicenaMark size={32} />
          <div style={{ marginTop: 12, fontSize: 14, color: "var(--ink-muted)", fontStyle: "italic" }}>
            Carregando caso clínico...
          </div>
        </div>
      </div>
    );
  }

  // List
  return (
    <div className="av" style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <header style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg-elev-1)", display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/" style={{ padding: 6, color: "var(--ink-muted)" }} aria-label="Voltar">
          <ArrowLeft size={18} />
        </Link>
        <AvicenaMark size={22} />
        <span className="serif" style={{ fontSize: 16, fontWeight: 600 }}>Banco de Casos</span>
        <div style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--ink-muted)" }}>{displayName}</div>
      </header>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 24px 64px" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 className="serif" style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, marginBottom: 6 }}>
            Casos clínicos
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-muted)" }}>
            Casos simulados com revelação progressiva. Treine raciocínio diagnóstico etapa por etapa.
          </p>
        </div>

        <CaseGenerator onGenerated={handleStartCase} />

        {isLoading && cases.length === 0 ? (
          <div style={{ marginTop: 32, textAlign: "center", color: "var(--ink-faint)", fontStyle: "italic", fontSize: 14 }}>
            Carregando casos...
          </div>
        ) : cases.length === 0 ? (
          <div style={{ marginTop: 32, textAlign: "center", color: "var(--ink-faint)", fontSize: 14 }}>
            <UserSearch size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
            <div>Nenhum caso ainda. Gere o primeiro acima!</div>
          </div>
        ) : (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 12 }}>
              Historial · {cases.length} caso{cases.length > 1 ? "s" : ""}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cases.map((c) => {
                const cAttempts = attempts[c.id] ?? [];
                const bestAttempt = cAttempts.length > 0
                  ? cAttempts.reduce((a, b) => (a.score > b.score ? a : b))
                  : null;

                return (
                  <button
                    key={c.id}
                    onClick={() => handleStartCase(c.id)}
                    type="button"
                    className="av-card is-interactive"
                    style={{ padding: 16, display: "flex", alignItems: "center", gap: 14, textAlign: "left", width: "100%", cursor: "pointer" }}
                  >
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: bestAttempt ? "var(--brand-soft-bg)" : "var(--bg-elev-2)",
                        color: bestAttempt ? "var(--brand)" : "var(--ink-muted)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}
                    >
                      {bestAttempt ? <Trophy size={18} /> : <Stethoscope size={18} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{c.title}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>
                        {c.specialty} · {DIFFICULTY_LABELS[c.difficulty] ?? c.difficulty} · {c.total_steps} etapas
                        {bestAttempt && (
                          <span style={{ marginLeft: 8, color: "var(--brand)" }}>
                            Melhor: {bestAttempt.score}/{bestAttempt.total}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--ink-faint)", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                      <Clock size={12} />
                      {new Date(c.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
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
