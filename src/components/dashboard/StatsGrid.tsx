import {
  TrendingUp,
  MessageSquare,
  Flame,
  BookOpenText,
} from "lucide-react";
import type { ComponentType } from "react";
import type { DashboardStats } from "@/app/actions/dashboard";

type StatCard = {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
  delta?: string;
  icon: ComponentType<{ size?: number }>;
};

function buildStats(stats: DashboardStats): StatCard[] {
  return [
    {
      label: "Total de anamneses",
      value: String(stats.totalSessions),
      sub: "sessões desde o início",
      accent: stats.totalSessions > 20,
      icon: TrendingUp,
    },
    {
      label: "Anamneses esta semana",
      value: String(stats.sessionsThisWeek),
      sub: "nos últimos 7 dias",
      icon: MessageSquare,
    },
    {
      label: "Sequência",
      value: stats.streakDays > 0 ? `${stats.streakDays} dia${stats.streakDays > 1 ? "s" : ""}` : "—",
      sub: stats.streakDays > 0 ? "dias consecutivos estudando" : "comece hoje!",
      icon: Flame,
    },
    {
      label: "Status",
      value: stats.totalSessions > 0 ? "Ativo" : "Novo",
      sub: stats.totalSessions > 0
        ? `última sessão: ${stats.lastSession?.title ?? "—"}`
        : "comece sua primeira anamnese",
      icon: BookOpenText,
    },
  ];
}

export function StatsGrid({ stats }: { stats: DashboardStats }) {
  const cards = buildStats(stats);

  return (
    <div className="av-dash-stats">
      {cards.map((s) => {
        const I = s.icon;
        return (
          <div
            key={s.label}
            className={`av-stat-card ${s.accent ? "is-accent" : ""}`}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: s.accent ? "#6F5417" : "var(--ink-muted)",
                marginBottom: 12,
                position: "relative",
              }}
            >
              <I size={13} />
              {s.label}
            </div>
            <div
              className="serif"
              style={{
                fontSize: s.accent ? 32 : 28,
                fontWeight: 700,
                lineHeight: 1,
                color: s.accent ? "#6F5417" : "var(--ink)",
                marginBottom: 6,
                letterSpacing: "-0.02em",
                position: "relative",
              }}
            >
              {s.value}
              {s.delta ? (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--brand-soft)",
                    marginLeft: 8,
                    verticalAlign: "middle",
                  }}
                >
                  {s.delta}
                </span>
              ) : null}
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: s.accent ? "#7A6027" : "var(--ink-muted)",
                lineHeight: 1.45,
                position: "relative",
              }}
            >
              {s.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}
