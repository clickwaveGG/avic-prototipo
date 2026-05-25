import Link from "next/link";
import {
  MessageSquare,
  BookOpenText,
  ClipboardCheck,
  Calendar,
  Repeat2,
  UserSearch,
  Users,
  Award,
} from "lucide-react";
import type { ComponentType } from "react";

type Tool = {
  id: string;
  title: string;
  desc: string;
  icon: ComponentType<{ size?: number }>;
  href: string;
  status: string;
  state: "active" | "urgent" | "soon";
};

const TOOLS: Tool[] = [
  {
    id: "anamnese",
    title: "Anamneses com Hipócrates",
    desc: "Chat IA com citação clicável da página exata. /resumir, /quizar, /caso, /dose.",
    icon: MessageSquare,
    href: "/anamnese",
    status: "ATIVO",
    state: "active",
  },
  {
    id: "codices",
    title: "Códices",
    desc: "Tua estante de PDFs + códices oficiais da Cátedra liberados pela Profª Camila.",
    icon: BookOpenText,
    href: "/anamnese",
    status: "ATIVO",
    state: "active",
  },
  {
    id: "sabatinas",
    title: "Sabatinas da Cátedra",
    desc: "Quizzes gerados por IA. 5 questões estilo Revalida sobre qualquer tema.",
    icon: ClipboardCheck,
    href: "/sabatinas",
    status: "ATIVO",
    state: "active",
  },
  {
    id: "roteiro",
    title: "Roteiro Clínico",
    desc: "Trilha sequencial montada pela Profª. Tu tá em 3/8 da etapa atual.",
    icon: Calendar,
    href: "#",
    status: "EM BREVE",
    state: "soon",
  },
  {
    id: "revisao",
    title: "Revisão SRS",
    desc: "Flashcards com repetição espaçada gerados das anamneses. Reter sem reler.",
    icon: Repeat2,
    href: "#",
    status: "EM BREVE",
    state: "soon",
  },
  {
    id: "casos",
    title: "Banco de Casos",
    desc: "Casos clínicos validados pela Cátedra. Raciocínio diagnóstico encadeado.",
    icon: UserSearch,
    href: "#",
    status: "EM BREVE",
    state: "soon",
  },
  {
    id: "turma",
    title: "Tua Turma",
    desc: "Canal da Cátedra + grupos de estudo + sala virtual com Pomodoro sincronizado.",
    icon: Users,
    href: "#",
    status: "EM BREVE",
    state: "soon",
  },
  {
    id: "carreira",
    title: "Carreira",
    desc: "Portfólio clínico, tracker de plantões, currículo em construção, mock interview.",
    icon: Award,
    href: "#",
    status: "EM BREVE",
    state: "soon",
  },
];

export function ToolsGrid() {
  return (
    <div className="av-dash-tools">
      {TOOLS.map((t) => {
        const I = t.icon;
        const isSoon = t.state === "soon";
        const isUrgent = t.state === "urgent";

        const cardClass = [
          "av-card",
          isSoon ? "is-disabled" : "is-interactive",
          isUrgent ? "is-accent" : "",
        ]
          .filter(Boolean)
          .join(" ");

        const inner = (
          <div className={cardClass} style={{ padding: 18, height: "100%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: isUrgent ? "var(--accent-bg)" : "var(--brand-soft-bg)",
                  color: isUrgent ? "#6F5417" : "var(--brand)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <I size={18} />
              </div>
              <span
                className="mono"
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  padding: "3px 8px",
                  borderRadius: 6,
                  background:
                    t.state === "active"
                      ? "var(--brand-soft-bg)"
                      : isUrgent
                      ? "var(--accent-bg)"
                      : "var(--bg-elev-2)",
                  color:
                    t.state === "active"
                      ? "var(--brand)"
                      : isUrgent
                      ? "#6F5417"
                      : "var(--ink-faint)",
                }}
              >
                {t.status}
              </span>
            </div>
            <div className="serif" style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
              {t.title}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-muted)", lineHeight: 1.5 }}>
              {t.desc}
            </div>
          </div>
        );

        if (isSoon || t.href === "#") {
          return <div key={t.id}>{inner}</div>;
        }
        return (
          <Link key={t.id} href={t.href} style={{ textDecoration: "none", color: "inherit" }}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
