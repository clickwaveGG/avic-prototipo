"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Menu,
  Paperclip,
  FileText,
  X,
  ArrowRight,
} from "lucide-react";
import Markdown from "react-markdown";
import { signOut } from "@/app/actions/auth";
import {
  loadSessions,
  loadMessages,
  createSession,
  saveMessage,
  updateSessionTitle,
  type ChatSessionRow,
} from "@/app/actions/chat";
import { posthog } from "@/lib/posthog";
import {
  AvicenaMark,
  HipAvatar,
  CodexCover,
  BtnSoft,
  SlashPalette,
  SLASH_CMDS,
} from "@/components/avicena";
import { expandSlashCommand } from "@/lib/slash-commands";
import { EmptyState } from "./EmptyState";

type Profile = {
  display_name: string | null;
  tier: string | null;
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

const MAX_PDF_BYTES = 32 * 1024 * 1024;

type Attachment = {
  name: string;
  base64: string;
  size: number;
};

// sendMessage inlined no handleSend para controle de headers (rate limit)

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "boa madrugada";
  if (h < 12) return "bom dia";
  if (h < 18) return "boa tarde";
  return "boa noite";
}

export function Workspace({
  email,
  profile,
}: {
  email: string;
  profile: Profile | null;
}) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number | null>(null);
  const [showSlashPalette, setShowSlashPalette] = useState(false);
  const [slashActiveIndex, setSlashActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const displayName =
    profile?.display_name?.trim() || email?.split("@")[0] || "estudante";
  const tier = profile?.tier ?? "estagiario";
  const initial = displayName.slice(0, 1).toUpperCase();

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  // Carrega sessoes do Supabase ao montar
  useEffect(() => {
    (async () => {
      try {
        const rows = await loadSessions();
        const loaded: ChatSession[] = rows.map((r) => ({
          id: r.id,
          title: r.title,
          messages: [],
          createdAt: new Date(r.created_at).getTime(),
        }));
        setSessions(loaded);
      } catch {
        // Fallback silencioso — funciona sem persistencia
      } finally {
        setIsLoadingSessions(false);
      }
    })();
  }, []);

  // Carrega mensagens quando muda de sessao
  const selectSession = useCallback(async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setSessions((prev) => {
      const session = prev.find((s) => s.id === sessionId);
      // So carrega se a sessao esta vazia (ainda nao carregou mensagens)
      if (session && session.messages.length > 0) return prev;
      return prev;
    });

    // Busca mensagens do Supabase
    const msgs = await loadMessages(sessionId);
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: msgs.map((m) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                timestamp: new Date(m.created_at).getTime(),
              })),
            }
          : s
      )
    );
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentSession?.messages, isLoading]);

  function autoResize(t: HTMLTextAreaElement) {
    t.style.height = "auto";
    t.style.height = Math.min(t.scrollHeight, 200) + "px";
  }

  const createNewSession = async () => {
    const dbId = await createSession("Nova anamnese");
    const newSession: ChatSession = {
      id: dbId ?? Math.random().toString(36).substring(7),
      title: "Nova anamnese",
      messages: [],
      createdAt: Date.now(),
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
  };

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return;

    setShowSlashPalette(false);
    const { userMessage: expandedContent, systemHint } = expandSlashCommand(content);

    let sessionId = currentSessionId;
    let updatedSessions = [...sessions];

    // Cria sessao se nao existe
    if (!sessionId) {
      const title = content.slice(0, 30) + (content.length > 30 ? "..." : "");
      const dbId = await createSession(title);
      const newSession: ChatSession = {
        id: dbId ?? Math.random().toString(36).substring(7),
        title,
        messages: [],
        createdAt: Date.now(),
      };
      updatedSessions = [newSession, ...sessions];
      sessionId = newSession.id;
      setSessions(updatedSessions);
      setCurrentSessionId(sessionId);
    }

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    const sessionIndex = updatedSessions.findIndex((s) => s.id === sessionId);
    updatedSessions[sessionIndex].messages.push(userMsg);

    // Atualiza titulo na primeira mensagem
    const isFirst =
      updatedSessions[sessionIndex].messages.filter((m) => m.role === "user")
        .length === 1;
    if (isFirst) {
      const title = content.slice(0, 30) + (content.length > 30 ? "..." : "");
      updatedSessions[sessionIndex].title = title;
      updateSessionTitle(sessionId, title).catch(() => {});
    }

    setSessions([...updatedSessions]);
    setInput("");
    if (taRef.current) {
      taRef.current.value = "";
      autoResize(taRef.current);
    }
    setIsLoading(true);

    // Persiste mensagem do usuario
    saveMessage(sessionId, "user", content).catch(() => {});

    // Track analytics
    posthog?.capture("chat_sent", {
      has_pdf: !!attachment,
      session_id: sessionId,
      message_length: content.length,
      slash_command: systemHint ? content.split(" ")[0] : null,
    });
    if (attachment) {
      posthog?.capture("pdf_uploaded", {
        file_name: attachment.name,
        file_size_mb: +(attachment.size / 1024 / 1024).toFixed(2),
      });
    }

    try {
      const apiMessages = updatedSessions[sessionIndex].messages.map((m, i) => ({
        role: m.role,
        content:
          i === updatedSessions[sessionIndex].messages.length - 1 && m.role === "user"
            ? expandedContent
            : m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          pdfBase64: attachment?.base64,
          pdfName: attachment?.name,
          slashHint: systemHint ?? undefined,
        }),
      });

      const data = await res.json();

      // Atualiza rate limit remaining do header
      const remaining = res.headers.get("X-RateLimit-Remaining");
      if (remaining !== null) setRateLimitRemaining(parseInt(remaining, 10));

      if (!res.ok) {
        if (res.status === 429) {
          posthog?.capture("rate_limit_hit");
        }
        throw new Error(data?.error ?? "Falha ao consultar Hipócrates");
      }

      const aiResponseContent = data.text as string;

      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: aiResponseContent,
        timestamp: Date.now(),
      };

      updatedSessions[sessionIndex].messages.push(assistantMessage);
      setSessions([...updatedSessions]);
      setAttachment(null);

      // Persiste resposta do assistente
      saveMessage(sessionId, "assistant", aiResponseContent).catch(() => {});
    } catch (error) {
      const msg = error instanceof Error ? error.message : "erro desconhecido";
      const errorMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: `Deu ruim: ${msg}`,
        timestamp: Date.now(),
      };
      updatedSessions[sessionIndex].messages.push(errorMessage);
      setSessions([...updatedSessions]);
    } finally {
      setIsLoading(false);
    }
  };

  async function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError(null);

    if (file.type !== "application/pdf") {
      setUploadError("Só PDF por enquanto.");
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setUploadError(
        `Códice grande demais (${(file.size / 1024 / 1024).toFixed(1)}MB). Cap: 32MB.`
      );
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setAttachment({ name: file.name, base64, size: file.size });
    } catch {
      setUploadError("Não consegui ler o arquivo.");
    }
  }

  return (
    <div
      className="av"
      style={{ height: "100vh", display: "flex", flexDirection: "row" }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: isSidebarOpen ? 260 : 0,
          flexShrink: 0,
          borderRight: isSidebarOpen ? "1px solid var(--border)" : "none",
          background: "var(--bg-elev-1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "width 220ms ease-out",
        }}
        className="ws-sidebar-v2"
      >
        <div
          style={{
            padding: "18px 16px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderBottom: "1px solid var(--border)",
          }}
        >
          <AvicenaMark size={26} />
          <span className="serif" style={{ fontSize: 18, fontWeight: 600 }}>
            Avicena
          </span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            style={{ marginLeft: "auto", color: "var(--ink-faint)", padding: 4 }}
            title="Fechar sidebar"
            aria-label="Fechar sidebar"
          >
            <Menu size={16} />
          </button>
        </div>

        <div style={{ padding: "14px 14px 8px" }}>
          <button
            onClick={createNewSession}
            className="av-btn-soft"
            style={{ width: "100%", justifyContent: "center" }}
          >
            <Plus size={14} /> Nova anamnese
          </button>
        </div>

        <div
          style={{
            padding: "16px 18px 6px",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
          }}
        >
          Prontuário
        </div>
        <div
          className="av-scroll"
          style={{ flex: 1, overflowY: "auto", padding: "0 8px 12px" }}
        >
          {sessions.length === 0 ? (
            <div
              style={{
                padding: "12px 14px",
                fontSize: 12.5,
                fontStyle: "italic",
                color: "var(--ink-faint)",
              }}
            >
              Nenhuma anamnese ainda
            </div>
          ) : (
            sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => selectSession(s.id)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  textAlign: "left",
                  background:
                    currentSessionId === s.id ? "var(--bg-elev-2)" : "transparent",
                  color:
                    currentSessionId === s.id ? "var(--ink)" : "var(--ink-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {s.title}
                </span>
              </button>
            ))
          )}
        </div>

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
              background: "var(--accent-soft)",
              color: "#6F5417",
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
            <div
              className="mono"
              style={{ fontSize: 10.5, color: "var(--ink-faint)" }}
            >
              {tier}
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              style={{
                fontSize: 12,
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

      {/* Main */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "var(--bg)",
          minWidth: 0,
          position: "relative",
        }}
      >
        {/* Top bar */}
        <header
          style={{
            padding: "14px 24px",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-elev-1)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                style={{ padding: 6, color: "var(--ink-muted)" }}
                title="Abrir sidebar"
                aria-label="Abrir sidebar"
              >
                <Menu size={18} />
              </button>
            )}
            <span
              className="serif"
              style={{ fontSize: 17, fontWeight: 600 }}
            >
              {currentSession ? currentSession.title : "Consultório"}
            </span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--ink-muted)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
            className="av-tabular"
          >
            <span className="av-hide-mobile" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Search size={14} /> Buscar
            </span>
            <span style={{ color: "var(--ink-faint)" }}>
              <span style={{ fontWeight: 600, color: rateLimitRemaining !== null && rateLimitRemaining <= 5 ? "var(--vital-red)" : "var(--ink)" }}>
                {rateLimitRemaining !== null ? rateLimitRemaining : "50"}
              </span>
              /50 restantes
            </span>
          </div>
        </header>

        {/* Conversation area */}
        <div
          ref={scrollRef}
          className="av-scroll"
          style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}
        >
          {!currentSession || currentSession.messages.length === 0 ? (
            <EmptyState
              displayName={displayName}
              greeting={getGreeting()}
              onPick={(c) => handleSend(c)}
            />
          ) : (
            <div
              style={{
                width: "100%",
                maxWidth: 760,
                margin: "0 auto",
                padding: "28px 24px 12px",
              }}
            >
              {currentSession.messages.map((m) =>
                m.role === "user" ? (
                  <div
                    key={m.id}
                    style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}
                  >
                    <div
                      style={{
                        maxWidth: "78%",
                        background: "var(--brand-soft-bg)",
                        color: "var(--ink)",
                        padding: "12px 16px",
                        borderRadius: "18px 18px 6px 18px",
                        fontSize: 15,
                        lineHeight: 1.55,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div
                    key={m.id}
                    style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "flex-start" }}
                  >
                    <HipAvatar />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          background: "var(--bg-elev-1)",
                          border: "1px solid var(--border)",
                          padding: "14px 18px",
                          borderRadius: "6px 18px 18px 18px",
                          fontSize: 15,
                          lineHeight: 1.6,
                          color: "var(--ink)",
                        }}
                      >
                        <div className="markdown-body">
                          <Markdown>{m.content}</Markdown>
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 11,
                          color: "var(--ink-faint)",
                          fontStyle: "italic",
                          paddingLeft: 4,
                        }}
                      >
                        Material de estudo.
                      </div>
                    </div>
                  </div>
                )
              )}

              {isLoading && (
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 18,
                    alignItems: "flex-start",
                  }}
                >
                  <HipAvatar pulsing />
                  <div
                    style={{
                      background: "var(--bg-elev-1)",
                      border: "1px solid var(--border)",
                      padding: "14px 18px",
                      borderRadius: "6px 18px 18px 18px",
                      fontSize: 15,
                      color: "var(--ink-muted)",
                      fontStyle: "italic",
                    }}
                  >
                    Auscultando o compêndio<span className="av-cursor"></span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Composer */}
        <div
          style={{
            padding: "14px 24px 22px",
            background: "linear-gradient(180deg, transparent, var(--bg) 30%)",
          }}
        >
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={handleFilePick}
            />
            {attachment && (
              <div
                style={{
                  marginBottom: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--accent-bg)",
                  border: "1px solid var(--accent)",
                  borderRadius: 12,
                  padding: "6px 10px",
                  maxWidth: "100%",
                }}
              >
                <FileText size={14} style={{ color: "#6F5417", flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--ink)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 240,
                  }}
                >
                  {attachment.name}
                </span>
                <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-faint)" }}>
                  {(attachment.size / 1024 / 1024).toFixed(1)}MB
                </span>
                <button
                  onClick={() => setAttachment(null)}
                  style={{ padding: 2, color: "var(--ink-muted)" }}
                  aria-label="Remover anexo"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            {uploadError && (
              <div style={{ marginBottom: 6, fontSize: 12, color: "var(--alert)" }}>
                {uploadError}
              </div>
            )}
            {showSlashPalette && (
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    bottom: 4,
                    left: 0,
                    zIndex: 50,
                  }}
                >
                  <SlashPalette
                    activeIndex={slashActiveIndex}
                    compact
                    onSelect={(cmd) => {
                      setInput(cmd + " ");
                      setShowSlashPalette(false);
                      taRef.current?.focus();
                    }}
                  />
                </div>
              </div>
            )}
            <div className="av-composer">
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span
                  className="mono"
                  style={{ color: "var(--accent)", fontSize: 15, fontWeight: 600, paddingTop: 6 }}
                >
                  /
                </span>
                <textarea
                  ref={taRef}
                  value={input}
                  onChange={(e) => {
                    const val = e.target.value;
                    setInput(val);
                    autoResize(e.target);
                    if (val.startsWith("/") && !val.includes(" ")) {
                      setShowSlashPalette(true);
                      const match = SLASH_CMDS.findIndex((c) =>
                        c.cmd.startsWith(val)
                      );
                      setSlashActiveIndex(match >= 0 ? match : 0);
                    } else {
                      setShowSlashPalette(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (showSlashPalette) {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setSlashActiveIndex((i) =>
                          i < SLASH_CMDS.length - 1 ? i + 1 : 0
                        );
                        return;
                      }
                      if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setSlashActiveIndex((i) =>
                          i > 0 ? i - 1 : SLASH_CMDS.length - 1
                        );
                        return;
                      }
                      if (e.key === "Tab" || (e.key === "Enter" && !e.shiftKey)) {
                        e.preventDefault();
                        const cmd = SLASH_CMDS[slashActiveIndex];
                        setInput(cmd.cmd + " ");
                        setShowSlashPalette(false);
                        return;
                      }
                      if (e.key === "Escape") {
                        setShowSlashPalette(false);
                        return;
                      }
                    }
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(input);
                    }
                  }}
                  placeholder="Pergunta pro Hipócrates sobre teu material…"
                  rows={1}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: "1px solid var(--border)",
                }}
              >
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 12,
                    color: "var(--ink-muted)",
                  }}
                  title="Anexar códice (PDF até 32MB)"
                  type="button"
                >
                  <Paperclip size={14} /> anexar códice
                </button>
                <div style={{ flex: 1 }} />
                <BtnSoft
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                  iconRight={<ArrowRight size={14} />}
                >
                  Auscultar
                </BtnSoft>
              </div>
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 11,
                color: "var(--ink-faint)",
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
              Material de estudo. Não substitui avaliação clínica presencial.
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}

