"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { signOut } from "@/app/actions/auth";

type Profile = {
  display_name: string | null;
  tier: string | null;
};

type Msg = { role: "user" | "bot"; text: string };

const QUICK_CARDS = [
  { cmd: "/resumir ", text: "Resumir um capítulo do códice" },
  { cmd: "/explicar ", text: "Explicar conceito complexo em PT-BR direto" },
  { cmd: "/quizar ", text: "Gerar quiz de revisão pra prova" },
  { cmd: "/caso ", text: "Montar caso clínico simulado" },
];

export function Workspace({
  email,
  profile,
}: {
  email: string;
  profile: Profile | null;
}) {
  const [val, setVal] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayName =
    profile?.display_name?.trim() ||
    email?.split("@")[0] ||
    "estudante";
  const initial = displayName.charAt(0).toUpperCase();
  const tier = profile?.tier ?? "estagiario";

  function autoResize(t: HTMLTextAreaElement) {
    t.style.height = "24px";
    t.style.height = Math.min(t.scrollHeight, 200) + "px";
  }

  function send(text: string) {
    const v = text.trim();
    if (!v) return;
    setMsgs((prev) => [...prev, { role: "user", text: v }]);
    setVal("");
    if (taRef.current) {
      taRef.current.value = "";
      autoResize(taRef.current);
    }
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            "O Hipócrates ainda tá afiando o bisturi. Sobe o teu primeiro códice quando o upload abrir (Sprint 1.3) e a gente já consulta com página citada.",
        },
      ]);
    }, 1100);
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(val);
    }
  }

  useEffect(() => {
    if (taRef.current) autoResize(taRef.current);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [msgs.length, typing]);

  return (
    <div className="ws-shell">
      <aside className="ws-sidebar">
        <div className="ws-sidebar-header">
          <Image
            src="/assets/codex-logo-pixel.png"
            alt="Avicena"
            width={32}
            height={32}
            priority
          />
          <span>Avicena</span>
        </div>

        <button className="ws-new-btn" disabled title="Upload chega no Sprint 1.3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Subir códice</span>
        </button>

        <div className="ws-section-title">Códices</div>
        <div className="ws-list">
          <div className="ws-list-empty">Sem códices ainda.</div>
        </div>

        <div className="ws-section-title">Histórico</div>
        <div className="ws-list">
          <div className="ws-list-empty">Sem consultas.</div>
        </div>

        <div className="ws-sidebar-footer">
          <div className="ws-user">
            <div className="ws-avatar">{initial}</div>
            <div className="ws-user-meta">
              <div className="ws-user-name">{displayName}</div>
              <div className="ws-user-tier">{tier}</div>
            </div>
          </div>
          <form action={signOut}>
            <button type="submit" className="ws-signout">
              Sair
            </button>
          </form>
        </div>
      </aside>

      <main className="ws-main">
        <div className="ws-mobile-bar">
          <div className="ws-mobile-brand">
            <Image
              src="/assets/codex-logo-pixel.png"
              alt="Avicena"
              width={30}
              height={30}
            />
            <span>Avicena</span>
          </div>
          <form action={signOut}>
            <button type="submit" className="ws-signout">
              Sair
            </button>
          </form>
        </div>

        <div className="ws-conversation" ref={scrollRef}>
          {msgs.length === 0 && !typing ? (
            <div className="ws-empty">
              <div className="ws-empty-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <span>Consultório aberto</span>
              </div>
              <h1>
                Bem-vindo,{" "}
                <span className="accent">{displayName}</span>
              </h1>
              <p>
                Sobe teu códice (PDF) e o Hipócrates ausculta. Por enquanto a
                gente tá montando o consultório — manda uma anamnese pra ver
                como vai funcionar.
              </p>

              <div className="ws-quick-grid">
                {QUICK_CARDS.map((q) => (
                  <button
                    key={q.cmd}
                    className="ws-quick-card"
                    onClick={() => {
                      setVal(q.cmd);
                      taRef.current?.focus();
                    }}
                  >
                    <span className="ws-quick-card-cmd">{q.cmd.trim()}</span>
                    <span className="ws-quick-card-text">{q.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="ws-messages">
              {msgs.map((m, i) => (
                <div key={i} className={`ws-msg ${m.role}`}>
                  {m.text}
                </div>
              ))}
              {typing && (
                <div className="ws-msg bot">
                  <span style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>
                    Auscultando o compêndio
                  </span>
                  <span className="typing-dots" style={{ marginLeft: 8 }}>
                    <span></span><span></span><span></span>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ws-composer-wrap">
          <div className="ws-composer">
            <div className="ws-composer-body">
              <textarea
                ref={taRef}
                className="ws-composer-textarea"
                placeholder="Manda tua anamnese... Ex: /resumir capítulo 4"
                rows={1}
                value={val}
                onChange={(e) => {
                  setVal(e.target.value);
                  autoResize(e.target);
                }}
                onKeyDown={onKey}
              />
            </div>
            <div className="ws-composer-footer">
              <div className="chat-tools">
                <button className="tool-btn" disabled title="Upload chega no Sprint 1.3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
              </div>
              <button
                className={`btn-send${val.trim() ? " active" : ""}`}
                onClick={() => send(val)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                <span>Consultar</span>
              </button>
            </div>
          </div>
          <p className="ws-composer-fineprint">
            Material de estudo. Não substitui avaliação clínica presencial.
          </p>
        </div>
      </main>
    </div>
  );
}
