"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  GraduationCap,
  Menu,
  Search,
  Bell,
  ChevronRight,
} from "lucide-react";
import type { DashboardStats } from "@/app/actions/dashboard";
import { CodexCover } from "@/components/avicena";
import { DashSidebar } from "./DashSidebar";
import { StatsGrid } from "./StatsGrid";
import { ToolsGrid } from "./ToolsGrid";
import { TurmaRanking } from "./TurmaRanking";
import { RecentCodices } from "./RecentCodices";
import { SectionTitle } from "./SectionTitle";

type Profile = {
  display_name: string | null;
  tier: string | null;
  course?: string | null;
  period?: string | null;
  cohort?: string | null;
  academy?: string | null;
  pronouns?: string | null;
  onboarded_at?: string | null;
};

const COURSE_LABELS: Record<string, string> = {
  medicina: "Medicina",
  enfermagem: "Enfermagem",
  fisioterapia: "Fisioterapia",
  farmacia: "Farmácia",
  odontologia: "Odontologia",
  nutricao: "Nutrição",
  biomedicina: "Biomedicina",
  outro: "Outro",
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "boa madrugada";
  if (h < 12) return "bom dia";
  if (h < 18) return "boa tarde";
  return "boa noite";
}

export function Dashboard({
  email,
  profile,
  stats,
}: {
  email: string;
  profile: Profile | null;
  stats: DashboardStats;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName =
    profile?.display_name?.trim() || email?.split("@")[0] || "estudante";
  const tier = profile?.tier ?? "estagiario";
  const initial = displayName.slice(0, 1).toUpperCase();
  const courseLabel = COURSE_LABELS[profile?.course ?? ""] ?? "";
  const cohort = profile?.cohort?.trim() || "";
  const period = profile?.period?.trim() || "";
  const contextLine = [courseLabel, period, cohort].filter(Boolean).join(" · ");

  return (
    <div className="av" style={{ minHeight: "100vh", display: "flex" }}>
      <DashSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        contextLine={contextLine}
        displayName={displayName}
        initial={initial}
        tier={tier}
      />

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, background: "var(--bg)", position: "relative" }}>
        <div className="av-aurora is-static" />

        {/* Top bar */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            padding: "14px 24px",
            borderBottom: "1px solid var(--border)",
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="av-mobile-trigger"
            aria-label="Abrir menu"
          >
            <Menu size={18} />
          </button>

          <div className="serif" style={{ fontSize: 17, fontWeight: 600 }}>
            Consultório
          </div>

          <div
            className="av-hide-mobile"
            style={{
              flex: 1,
              maxWidth: 420,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 10,
              background: "var(--bg-elev-2)",
              fontSize: 13,
              color: "var(--ink-muted)",
              marginLeft: 8,
            }}
          >
            <Search size={14} />
            <span style={{ flex: 1 }}>Busca rápida — anamneses, códices, sabatinas</span>
            <span
              className="mono"
              style={{
                fontSize: 11,
                padding: "1px 5px",
                border: "1px solid var(--border)",
                borderRadius: 4,
                color: "var(--ink-faint)",
              }}
            >
              ⌘K
            </span>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
            <button
              style={{ position: "relative", padding: 6, color: "var(--ink-muted)" }}
              aria-label="Notificações"
            >
              <Bell size={18} />
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--alert)",
                  border: "2px solid rgba(255, 255, 255, 0.85)",
                }}
              />
            </button>
            <div className="av-tabular av-hide-mobile" style={{ fontSize: 12.5, color: "var(--ink-muted)" }}>
              <span style={{ fontWeight: 600, color: "var(--ink)" }}>12</span>/50 hoje
            </div>
          </div>
        </header>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "32px 24px 64px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* Greeting */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginBottom: 4 }}>
              {getGreeting()}, {displayName}
            </div>
            <h1
              className="serif"
              style={{
                fontSize: "clamp(26px, 4vw, 38px)",
                fontWeight: 600,
                letterSpacing: "-0.015em",
                lineHeight: 1.12,
                marginBottom: 6,
              }}
            >
              Tua semana em{" "}
              <span style={{ fontStyle: "italic", color: "var(--brand)" }}>Cardio</span>
              {" "}já tá te colocando no topo.
            </h1>
            <p style={{ fontSize: 15, color: "var(--ink-muted)", lineHeight: 1.55 }}>
              Continua de onde parou no Porto, encara a Sabatina, ou bora um códice novo.
            </p>
          </div>

          <StatsGrid stats={stats} />

          {/* Hoje na Cátedra */}
          <SectionTitle title="Hoje na tua Cátedra" right="ver tudo →" />
          <div className="av-dash-cathedra">
            <div className="av-card is-accent" style={{ padding: 16, display: "flex", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "var(--accent-bg)",
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ClipboardCheck size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#6F5417",
                    marginBottom: 2,
                  }}
                >
                  Sabatina · vence amanhã 23:59
                </div>
                <div className="serif" style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>
                  Necrose celular
                </div>
                <div style={{ fontSize: 12.5, color: "var(--ink-muted)" }}>
                  10 questões · estilo Revalida · cronometrada 25min
                </div>
              </div>
              <button className="av-btn-soft" style={{ flexShrink: 0, alignSelf: "center" }}>
                iniciar <ArrowRight size={14} />
              </button>
            </div>

            <div className="av-card" style={{ padding: 16, display: "flex", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "var(--accent)",
                  color: "#3A2A0A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <GraduationCap size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--ink-muted)",
                    marginBottom: 2,
                  }}
                >
                  Mensagem · Profª Camila
                </div>
                <div style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.5 }}>
                  &ldquo;Bora revisar apoptose hoje — 70% da turma furou no quiz da semana passada.&rdquo;
                </div>
              </div>
            </div>
          </div>

          {/* Continua de onde parou */}
          {stats.lastSession && (
            <>
              <SectionTitle title="Continua de onde parou" />
              <Link href="/anamnese" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                <div className="av-card is-interactive" style={{ padding: 18, display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--ink-faint)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontWeight: 600,
                      }}
                    >
                      Última anamnese · {new Date(stats.lastSession.updatedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className="serif" style={{ fontSize: 18, fontWeight: 600, marginTop: 2, marginBottom: 6 }}>
                      {stats.lastSession.title}
                    </div>
                    {stats.lastSession.lastMessage && (
                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--ink-muted)",
                          lineHeight: 1.45,
                          fontStyle: "italic",
                        }}
                      >
                        &ldquo;{stats.lastSession.lastMessage}&rdquo;
                      </div>
                    )}
                  </div>
                  <div style={{ color: "var(--brand)", flexShrink: 0 }}>
                    <ChevronRight size={20} />
                  </div>
                </div>
              </Link>
            </>
          )}

          {/* Tools grid */}
          <SectionTitle
            title="Ferramentas da formação"
            right={
              <>
                <span style={{ color: "var(--brand-soft)", fontWeight: 600 }}>6 ativas</span>
                {" · 2 em breve"}
              </>
            }
          />
          <ToolsGrid />

          {/* Tua estante */}
          <SectionTitle
            title="Tua estante · 5 códices"
            right={
              <>
                <span style={{ color: "var(--accent)" }}>2</span> da Cátedra · 3 pessoais
              </>
            }
          />
          <RecentCodices />

          {/* Comparativo turma */}
          <SectionTitle
            title="Posição na turma · últimos 30 dias"
            right="80 estagiários na M3-2026.1"
          />
          <TurmaRanking />

          <div
            style={{
              marginTop: 48,
              padding: 18,
              borderTop: "1px solid var(--border)",
              fontSize: 12,
              color: "var(--ink-faint)",
              textAlign: "center",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          >
            Indicadores pedagógicos comparativos. Não substituem avaliação acadêmica formal.
            Avicena é ferramenta de estudo — não diagnostica, não prescreve.
          </div>
        </div>
      </main>
    </div>
  );
}
