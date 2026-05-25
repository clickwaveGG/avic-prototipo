"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Repeat2, Brain, Zap, Clock } from "lucide-react";
import { AvicenaMark } from "@/components/avicena";
import { FlashcardGenerator, ReviewPlayer } from "@/components/review";
import {
  loadFlashcards,
  loadDueCards,
  getReviewStats,
  type FlashcardRow,
  type ReviewStats,
} from "@/app/actions/flashcards";

type Profile = { display_name: string | null; tier: string | null };

type ViewState =
  | { mode: "list" }
  | { mode: "reviewing"; cards: FlashcardRow[] }
  | { mode: "loading" };

export function RevisaoView({ email, profile }: { email: string; profile: Profile | null }) {
  const [allCards, setAllCards] = useState<FlashcardRow[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ totalCards: 0, dueToday: 0, reviewedToday: 0 });
  const [viewState, setViewState] = useState<ViewState>({ mode: "list" });
  const [isLoading, setIsLoading] = useState(true);

  const displayName = profile?.display_name?.trim() || email?.split("@")[0] || "estudante";

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cards, s] = await Promise.all([loadFlashcards(), getReviewStats()]);
      setAllCards(cards);
      setStats(s);
    } catch { /* silencioso */ } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function handleStartReview() {
    setViewState({ mode: "loading" });
    const dueCards = await loadDueCards();
    if (dueCards.length === 0) {
      setViewState({ mode: "list" });
      return;
    }
    setViewState({ mode: "reviewing", cards: dueCards });
  }

  function handleFinish() {
    setViewState({ mode: "list" });
    refresh();
  }

  // Reviewing
  if (viewState.mode === "reviewing") {
    return (
      <div className="av" style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <header style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg-elev-1)", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={handleFinish} style={{ padding: 6, color: "var(--ink-muted)" }} aria-label="Voltar">
            <ArrowLeft size={18} />
          </button>
          <AvicenaMark size={22} />
          <span className="serif" style={{ fontSize: 16, fontWeight: 600 }}>Revisão SRS</span>
        </header>
        <div style={{ padding: "28px 24px 64px" }}>
          <ReviewPlayer cards={viewState.cards} onFinish={handleFinish} />
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
          <div style={{ marginTop: 12, fontSize: 14, color: "var(--ink-muted)", fontStyle: "italic" }}>Carregando revisão...</div>
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
        <span className="serif" style={{ fontSize: 16, fontWeight: 600 }}>Revisão SRS</span>
        <div style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--ink-muted)" }}>{displayName}</div>
      </header>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 24px 64px" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 className="serif" style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, marginBottom: 6 }}>
            Repetição espaçada
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-muted)" }}>
            Flashcards com algoritmo SM-2. Reter sem reler — o sistema adapta os intervalos à tua performance.
          </p>
        </div>

        {/* Stats cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
          <div className="av-card" style={{ padding: 16, textAlign: "center" }}>
            <Brain size={20} style={{ color: "var(--brand)", marginBottom: 6 }} />
            <div className="serif" style={{ fontSize: 28, fontWeight: 700 }}>{stats.totalCards}</div>
            <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>cards no banco</div>
          </div>
          <div className="av-card" style={{ padding: 16, textAlign: "center", background: stats.dueToday > 0 ? "var(--accent-bg)" : undefined }}>
            <Zap size={20} style={{ color: stats.dueToday > 0 ? "#6F5417" : "var(--ink-muted)", marginBottom: 6 }} />
            <div className="serif" style={{ fontSize: 28, fontWeight: 700, color: stats.dueToday > 0 ? "#6F5417" : undefined }}>{stats.dueToday}</div>
            <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>para revisar hoje</div>
          </div>
          <div className="av-card" style={{ padding: 16, textAlign: "center" }}>
            <Repeat2 size={20} style={{ color: "var(--brand)", marginBottom: 6 }} />
            <div className="serif" style={{ fontSize: 28, fontWeight: 700 }}>{stats.reviewedToday}</div>
            <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>revisados hoje</div>
          </div>
        </div>

        {/* Start review button */}
        {stats.dueToday > 0 && (
          <button
            onClick={handleStartReview}
            className="av-btn-primary"
            style={{
              width: "100%", padding: "14px 24px", fontSize: 15,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              marginBottom: 24, borderRadius: 12,
            }}
          >
            <Zap size={16} /> Revisar {stats.dueToday} card{stats.dueToday > 1 ? "s" : ""} agora
          </button>
        )}

        <FlashcardGenerator onGenerated={refresh} />

        {/* Card list */}
        {allCards.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 12 }}>
              Teus flashcards · {allCards.length}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {allCards.slice(0, 20).map((c) => {
                const isDue = new Date(c.next_review) <= new Date();
                return (
                  <div
                    key={c.id}
                    className="av-card"
                    style={{
                      padding: "12px 16px",
                      display: "flex", alignItems: "center", gap: 12,
                      borderLeft: isDue ? "3px solid var(--accent)" : "3px solid transparent",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {c.front}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>
                        {c.topic && <span>{c.topic} · </span>}
                        intervalo: {c.interval_days}d · EF: {c.ease_factor.toFixed(1)}
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: isDue ? "var(--accent)" : "var(--ink-faint)", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                      <Clock size={10} />
                      {isDue ? "agora" : new Date(c.next_review).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
