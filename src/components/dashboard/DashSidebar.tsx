"use client";

import Link from "next/link";
import {
  BookOpenText,
  Calendar,
  ClipboardCheck,
  GraduationCap,
  MessageSquare,
  Repeat2,
  Stethoscope,
  Users,
  UserSearch,
  Award,
  X,
} from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { AvicenaMark } from "@/components/avicena";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  active?: boolean;
  badge?: number;
  soon?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Consultório", icon: Stethoscope, href: "/", active: true },
  { id: "anamnese", label: "Anamneses", icon: MessageSquare, href: "/anamnese" },
  { id: "codices", label: "Códices", icon: BookOpenText, href: "/anamnese" },
  { id: "sabatinas", label: "Sabatinas", icon: ClipboardCheck, href: "/sabatinas", badge: 2 },
  { id: "roteiro", label: "Roteiro", icon: Calendar, href: "#", soon: true },
  { id: "revisao", label: "Revisão", icon: Repeat2, href: "#", soon: true },
  { id: "casos", label: "Casos", icon: UserSearch, href: "/casos" },
  { id: "turma", label: "Turma", icon: Users, href: "#", soon: true },
  { id: "carreira", label: "Carreira", icon: Award, href: "#", soon: true },
];

export function DashSidebar({
  isOpen,
  onClose,
  contextLine,
  displayName,
  initial,
  tier,
}: {
  isOpen: boolean;
  onClose: () => void;
  contextLine: string;
  displayName: string;
  initial: string;
  tier: string;
}) {
  return (
    <>
      <div
        className={`av-dash-backdrop ${isOpen ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`av-dash-sidebar ${isOpen ? "is-open" : ""}`}
        style={{
          width: 260,
          flexShrink: 0,
          borderRight: "1px solid var(--border)",
          background: "var(--bg-elev-1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Brand + Academy */}
        <div
          style={{
            padding: "18px 18px 14px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <AvicenaMark size={26} />
              <span className="serif" style={{ fontSize: 18, fontWeight: 600 }}>
                Avicena
              </span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-faint)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 600,
              }}
            >
              {contextLine || "Tua formação"}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ padding: 4, color: "var(--ink-faint)", display: "none" }}
            className="av-mobile-close"
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "12px 8px 8px" }} className="av-scroll">
          {NAV_ITEMS.map((item) => {
            const I = item.icon;
            const classes = [
              "av-nav-item",
              item.active ? "is-active" : "",
              item.soon ? "is-disabled" : "",
            ]
              .filter(Boolean)
              .join(" ");

            const inner = (
              <>
                <I size={16} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge ? (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: 8,
                      background: "var(--alert-bg)",
                      color: "var(--alert)",
                      flexShrink: 0,
                    }}
                  >
                    {item.badge}
                  </span>
                ) : null}
                {item.soon ? (
                  <span
                    className="mono"
                    style={{
                      fontSize: 9.5,
                      color: "var(--ink-faint)",
                      padding: "1px 5px",
                      border: "1px solid var(--border)",
                      borderRadius: 4,
                      flexShrink: 0,
                    }}
                  >
                    em breve
                  </span>
                ) : null}
              </>
            );

            if (item.soon) {
              return (
                <div key={item.id} className={classes} aria-disabled="true">
                  {inner}
                </div>
              );
            }
            return (
              <Link key={item.id} href={item.href} className={classes}>
                {inner}
              </Link>
            );
          })}
        </nav>

        {/* Mestra block */}
        <div
          style={{
            padding: "12px 14px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "var(--bg-elev-2)",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--accent)",
              color: "#3A2A0A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <GraduationCap size={16} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Profª Camila Silva
            </div>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-faint)" }}>
              Patologia · Cátedra
            </div>
          </div>
        </div>

        {/* User */}
        <div
          style={{
            padding: "12px 14px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--brand)",
              color: "#F4F1EA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {displayName}
            </div>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-faint)" }}>
              {tier}
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              style={{
                fontSize: 11,
                color: "var(--ink-muted)",
                padding: "4px 8px",
                borderRadius: 6,
                border: "1px solid var(--border)",
              }}
            >
              Sair
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
