import {
  Stethoscope,
  Dna,
  BookOpen,
  Heart,
} from "lucide-react";
import { CodexCover } from "@/components/avicena";
import type { ComponentType } from "react";

type QuickCard = {
  cmd: string;
  title: string;
  desc: string;
  icon: ComponentType<{ size?: number; style?: React.CSSProperties }>;
};

const QUICK_CARDS: QuickCard[] = [
  {
    cmd: "/caso",
    title: "Análise de caso",
    desc: "Estudo de caso clínico de neurologia",
    icon: Stethoscope,
  },
  {
    cmd: "/explicar",
    title: "Fisiologia",
    desc: "Cascata de coagulação sanguínea",
    icon: Dna,
  },
  {
    cmd: "/dose",
    title: "Farmacologia",
    desc: "Interações medicamentosas da varfarina",
    icon: BookOpen,
  },
  {
    cmd: "/resumir",
    title: "Anatomia",
    desc: "Anatomia do mediastino superior",
    icon: Heart,
  },
];

export function EmptyState({
  displayName,
  greeting,
  onPick,
}: {
  displayName: string;
  greeting: string;
  onPick: (cmd: string) => void;
}) {
  const codices = [
    { title: "Robbins Patologia", category: "Patologia" },
    { title: "Porto Semiologia", category: "Cardio" },
    { title: "Goodman & Gilman", category: "Farma" },
  ];

  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <div className="av-aurora" style={{ inset: 0 }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 720, width: "100%" }}>
        <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginBottom: 4 }}>
          {greeting}, {displayName}
        </div>
        <h1
          className="serif"
          style={{
            fontSize: "clamp(26px, 4vw, 36px)",
            fontWeight: 600,
            letterSpacing: "-0.015em",
            marginBottom: 8,
          }}
        >
          Como tá o estudo de{" "}
          <span style={{ fontStyle: "italic", color: "var(--brand)" }}>Cardio</span>?
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "var(--ink-muted)",
            marginBottom: 28,
            maxWidth: 520,
            margin: "0 auto 28px",
          }}
        >
          Continua de onde parou no Porto, ou bora um códice novo?
        </p>

        <div className="av-codice-row">
          {codices.map((c) => (
            <CodexCover
              key={c.title}
              title={c.title}
              category={c.category}
              size="sm"
            />
          ))}
        </div>

        <div className="av-quick-grid">
          {QUICK_CARDS.map((q) => {
            const I = q.icon;
            return (
              <button
                key={q.cmd}
                onClick={() => onPick(`${q.cmd} ${q.desc.toLowerCase()}`)}
                type="button"
                style={{
                  padding: "14px 16px",
                  background: "var(--bg-elev-1)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 160ms",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--brand-soft)";
                  e.currentTarget.style.background = "var(--brand-soft-bg)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = "var(--bg-elev-1)";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}
                >
                  <I size={16} style={{ color: "var(--brand)" }} />
                  <span
                    className="mono"
                    style={{ fontSize: 11, color: "var(--accent)" }}
                  >
                    {q.cmd}
                  </span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
                  {q.title}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "var(--ink-muted)",
                    marginTop: 2,
                    lineHeight: 1.45,
                  }}
                >
                  {q.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
