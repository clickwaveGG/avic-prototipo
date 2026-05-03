"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { signInWithGoogle } from "@/app/actions/auth";

const codiceNames = [
  "guyton-fisiologia",
  "netter-anatomia",
  "robbins-patologia",
  "tortora-corpo-humano",
  "lehninger-bioquimica",
  "porto-semiologia",
];

export function Landing() {
  const [showCmd, setShowCmd] = useState(false);
  const [val, setVal] = useState("");
  const [typing, setTyping] = useState(false);
  const [attachments, setAttachments] = useState<{ id: string; name: string }[]>(
    []
  );
  const taRef = useRef<HTMLTextAreaElement>(null);
  const waitlistRef = useRef<HTMLElement>(null);

  function autoResize(t: HTMLTextAreaElement) {
    t.style.height = "52px";
    t.style.height = Math.min(t.scrollHeight, 200) + "px";
  }

  function onInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const v = e.target.value;
    setVal(v);
    autoResize(e.target);
    setShowCmd(v.startsWith("/") && !v.includes(" "));
  }

  function selectCmd(cmd: string) {
    setVal(cmd);
    setShowCmd(false);
    if (taRef.current) {
      taRef.current.value = cmd;
      taRef.current.focus();
    }
  }

  function addAttachment() {
    const idx = attachments.length;
    const name = codiceNames[idx % codiceNames.length];
    setAttachments((prev) => [
      ...prev,
      { id: `att-${Date.now()}`, name: `${name}-cap${idx + 1}.pdf` },
    ]);
  }

  function removeAtt(id: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  function sendMsg() {
    if (!val.trim()) return;
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setVal("");
      if (taRef.current) {
        taRef.current.value = "";
        autoResize(taRef.current);
      }
      waitlistRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 1500);
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMsg();
    }
  }

  useEffect(() => {
    if (taRef.current) autoResize(taRef.current);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <a className="nav-brand" href="/">
            <Image
              className="nav-logo"
              src="/assets/codex-logo-pixel.png"
              alt="Avicena"
              width={48}
              height={48}
              priority
            />
            <span className="nav-name">Avicena</span>
          </a>

          <div className="nav-links">
            <a href="#sobre">Sobre</a>
            <a href="#funcionalidades">Funcionalidades</a>
            <a href="#waitlist">Lista de espera</a>
          </div>

          <div className="nav-actions">
            <form action={signInWithGoogle} style={{ display: "contents" }}>
              <button type="submit" className="btn-login">
                Entrar
              </button>
            </form>
            <form action={signInWithGoogle} style={{ display: "contents" }}>
              <button type="submit" className="btn-signup">
                Começar grátis
              </button>
            </form>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <span>Para estudantes de saúde, em PT-BR</span>
        </div>

        <h1 className="headline">
          Sobe o códice.<br />O <span className="accent">Hipócrates</span> responde.
        </h1>

        <p className="subhead">
          Sobe teu <span className="term">códice</span> (PDF), pode ser Guyton,
          Netter ou apostila da faculdade, e o assistente lê pra ti. Resposta com
          a <span className="term">página exata</span> citada, sempre. Sem
          inventar nada.
        </p>

        <div className="chat-wrapper">
          <div className="chat-card">
            <div className={`cmd-palette${showCmd ? " show" : ""}`}>
              {[
                { cmd: "/resumir ", label: "Resumir capítulo", prefix: "/resumir" },
                { cmd: "/explicar ", label: "Explicar conceito", prefix: "/explicar" },
                { cmd: "/quizar ", label: "Gerar quiz de revisão", prefix: "/quizar" },
                { cmd: "/caso ", label: "Montar caso clínico simulado", prefix: "/caso" },
                { cmd: "/diferenciar ", label: "Comparar diagnósticos diferenciais", prefix: "/diferenciar" },
                { cmd: "/dose ", label: "Buscar dose / posologia", prefix: "/dose" },
              ].map((it) => (
                <div key={it.prefix} className="cmd-item" onClick={() => selectCmd(it.cmd)}>
                  <div className="cmd-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="cmd-label">{it.label}</div>
                  <div className="cmd-prefix">{it.prefix}</div>
                </div>
              ))}
            </div>

            <div className="chat-body">
              <textarea
                ref={taRef}
                className="chat-textarea"
                placeholder="Manda tua anamnese... Ex: /resumir capítulo 4 do Guyton"
                rows={1}
                value={val}
                onChange={onInput}
                onKeyDown={onKey}
              />
            </div>

            {attachments.length > 0 && (
              <div className="attachments">
                {attachments.map((a) => (
                  <div key={a.id} className="attachment">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span>{a.name}</span>
                    <button
                      className="attachment-remove"
                      onClick={() => removeAtt(a.id)}
                      aria-label="Remover"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="chat-footer">
              <div className="chat-tools">
                <button className="tool-btn" onClick={addAttachment} title="Subir códice (PDF)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
                <button className="tool-btn" onClick={() => setShowCmd((s) => !s)} title="Ações rápidas">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="4 17 10 11 4 5" />
                    <line x1="12" y1="19" x2="20" y2="19" />
                  </svg>
                </button>
              </div>

              <div className="chat-actions">
                {typing && (
                  <div className="typing-indicator">
                    <span>Auscultando</span>
                    <div className="typing-dots">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                )}
                <button className={`btn-send${val.trim() ? " active" : ""}`} onClick={sendMsg}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span>Consultar</span>
                </button>
              </div>
            </div>
          </div>

          <div className="quick-actions">
            {[
              { cmd: "/resumir ", label: "Resumir" },
              { cmd: "/explicar ", label: "Explicar" },
              { cmd: "/quizar ", label: "Quizar" },
              { cmd: "/caso ", label: "Caso" },
            ].map((q) => (
              <button key={q.label} className="quick-action" onClick={() => selectCmd(q.cmd)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                </svg>
                <span>{q.label}</span>
              </button>
            ))}
          </div>

          <p className="disclaimer-mini">
            Material de estudo. Não substitui avaliação clínica presencial.
          </p>
        </div>
      </section>

      <div className="trust-bar">
        <p className="trust-text">Feito pra quem estuda saúde de verdade</p>
        <div className="trust-items">
          {["Medicina", "Enfermagem", "Biomedicina", "Fisioterapia", "Farmácia", "Odontologia"].map((t) => (
            <div key={t} className="trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="explainer" id="sobre">
        <div className="explainer-inner">
          <h2 className="explainer-title">
            Por que o Avicena é <span className="emph">diferente?</span>
          </h2>
          <p className="explainer-sub">
            Não é chatbot genérico. Lê <em>teu</em> material e responde com a página exata.
          </p>

          <div className="explainer-grid">
            <div className="mockup" aria-label="Demonstração">
              <div className="mockup-header">
                <span className="mockup-dot"></span>
                <span className="mockup-dot"></span>
                <span className="mockup-dot"></span>
                <span className="mockup-title">avicena.app, consultório</span>
              </div>
              <div className="mockup-body">
                <div className="frame frame-1">
                  <div className="codice-chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span>guyton-fisiologia-cap14.pdf</span>
                  </div>
                  <div className="bubble user">Sobe o capítulo 14 do Guyton aí pro Hipócrates.</div>
                  <div className="bubble bot">Códice indexado. 47 páginas processadas. Pode consultar.</div>
                  <span className="frame-label">1. sobe o códice</span>
                </div>

                <div className="frame frame-2">
                  <div className="bubble user">/explicar mecanismo de Frank-Starling em 3 linhas</div>
                  <div className="bubble processing">
                    <span>Auscultando o compêndio</span>
                    <div className="typing-dots"><span></span><span></span><span></span></div>
                  </div>
                  <span className="frame-label">2. consulta enviada</span>
                </div>

                <div className="frame frame-3">
                  <div className="bubble user">/explicar mecanismo de Frank-Starling em 3 linhas</div>
                  <div className="bubble bot">
                    <strong>Parecer:</strong> quanto mais o ventrículo enche na diástole, mais forte é a contração sistólica. Estiramento das fibras = mais pontes actina-miosina = mais força. Auto-regulação intrínseca, sem sinal nervoso.
                    <br />
                    <span className="cite">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      </svg>
                      Guyton, p. 109
                    </span>
                  </div>
                  <span className="frame-label">3. parecer com página</span>
                </div>
              </div>
            </div>

            <div className="explainer-copy">
              <div className="explainer-divider"></div>
              <p>
                O <strong>Avicena</strong> não é chatbot genérico. Ele lê o{" "}
                <span className="accent-text">teu material</span>, o códice (PDF) que tu subiu, e responde só com base nele. Cada parecer vem com a página exata de onde saiu.
              </p>
              <p>
                Sobe o Guyton, o Netter, o Robbins, a apostila da faculdade. O Hipócrates transforma em um{" "}
                <span className="accent-text">assistente que conhece cada página</span>: tu pergunta, ele responde com citação direta.
              </p>
              <p>
                Em vez de folhear 400 páginas pra achar o trecho, tu <strong>consulta e recebe na hora</strong>, com a referência pra conferir. Diferente de NotebookLM e ChatPDF: aqui é PT-BR, vocabulário clínico, página citada.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="funcionalidades">
        <h2 className="features-title">Tudo que precisa pra véspera de prova</h2>
        <p className="features-sub">Seis comandos no teclado. Cada um faz uma coisa só, e faz bem.</p>

        <div className="features-grid">
          {[
            { title: "Resumo de capítulo", desc: "Capítulo inteiro condensado em pontos-chave. Mantém a hierarquia do livro original.", cmd: "/resumir" },
            { title: "Explicação clara", desc: "Conceito complexo de anatomia, fisiologia ou patologia explicado em PT-BR direto.", cmd: "/explicar" },
            { title: "Quiz de revisão", desc: "Gera perguntas com base no códice. Ideal pra testar memória antes de prova.", cmd: "/quizar" },
            { title: "Caso clínico simulado", desc: "Monta caso pedagógico com base no material. Treina raciocínio, não conduta real.", cmd: "/caso" },
            { title: "Diferencial pedagógico", desc: "Compara diagnósticos diferenciais lado a lado pra fixar critérios distintivos.", cmd: "/diferenciar" },
            { title: "Dose & posologia", desc: "Busca dose no compêndio com aviso pra consultar bula. Estudo, não prescrição.", cmd: "/dose" },
          ].map((f) => (
            <div key={f.cmd} className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                </svg>
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <span className="feature-cmd">{f.cmd}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section" id="waitlist" ref={waitlistRef}>
        <div className="cta-inner">
          <p className="cta-eyebrow">Já dá pra entrar</p>
          <h2 className="cta-title">
            Faz teu <span className="emph">juramento</span> e entra
          </h2>
          <p className="cta-sub">
            O consultório tá aberto. Login com Google em um clique, sem cadastro chato. Vira <strong>Estagiário</strong> grátis na hora.
          </p>

          <form action={signInWithGoogle}>
            <button type="submit" className="cta-button">
              <svg viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.71v2.26h2.9c1.7-1.57 2.69-3.88 2.69-6.61z" fill="#4285F4" />
                <path d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" fill="#34A853" />
                <path d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.16.29-1.7V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l2.99-2.34z" fill="#FBBC05" />
                <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.96L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z" fill="#EA4335" />
              </svg>
              <span>Entrar com Google</span>
            </button>
          </form>

          <p className="cta-fineprint">Sem spam. Login só pra salvar teus códices e consultas.</p>
        </div>
      </section>

      <aside className="disclaimer" role="note" aria-label="Aviso legal">
        <div className="disclaimer-inner">
          <div className="disclaimer-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="disclaimer-text">
            <strong>Avicena é ferramenta de apoio ao estudo.</strong> Os pareceres gerados são exclusivamente educativos, baseados nos PDFs que você forneceu. Nada aqui substitui avaliação clínica presencial, consulta a bula ou orientação de um profissional de saúde habilitado.
          </p>
        </div>
      </aside>

      <footer className="footer">
        <p className="footer-text">
          Avicena <span className="footer-sep">·</span> O conhecimento que cura{" "}
          <span className="footer-sep">·</span> feito por{" "}
          <a href="https://clickwavearmy.com" target="_blank" rel="noopener noreferrer">
            ClickWave
          </a>
        </p>
      </footer>

    </>
  );
}
