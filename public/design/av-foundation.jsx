/* global React, AvicenaMark, HipAvatar, Citation, CodexCover, UserBubble, HipBubble,
   BtnPrimary, BtnGhost, ChevronRight, ChevronLeft, ArrowRight, Plus, Search, X, Check,
   Stethoscope, BookOpenText, Lightbulb, HelpCircle, UserSearch, GitCompare, Pill,
   Paperclip, Sparkles, Menu, Bookmark, FileText, Heart, Shield, Quote, Settings, ClockIcon, Copy */

// ============================================================================
// 01 — TOKENS REFERENCE
// ============================================================================
const Swatch = ({ name, value, tone = 'light' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0' }}>
    <div style={{
      width: 44, height: 44, borderRadius: 10, background: value,
      border: '1px solid rgba(0,0,0,0.08)', flexShrink: 0,
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
    }} />
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{name}</div>
      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{value}</div>
    </div>
  </div>
);

const TokensArtboard = () => (
  <div className="av" style={{ padding: 32, height: '100%', background: 'var(--bg)' }}>
    <div style={{ marginBottom: 24 }}>
      <div className="serif" style={{ fontSize: 32, fontWeight: 600, color: 'var(--ink)' }}>Tokens</div>
      <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 4 }}>
        Modo claro · cores, tipografia, raio, sombra
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28 }}>
      {/* Colors */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-muted)', marginBottom: 12 }}>Superfícies</div>
        <Swatch name="bg" value="#F4F1EA" />
        <Swatch name="bg-elev-1" value="#FFFFFF" />
        <Swatch name="bg-elev-2" value="#E8E2D5" />
        <Swatch name="ink" value="#0A1F1A" />
        <Swatch name="ink-muted" value="#3A4843" />
        <Swatch name="border" value="#D9D0BC" />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-muted)', marginBottom: 12 }}>Apothecary</div>
        <Swatch name="brand" value="#1E4D3F" />
        <Swatch name="brand-hover" value="#2D6855" />
        <Swatch name="brand-soft" value="#3FA68C" />
        <Swatch name="brand-glow" value="#76EBC4" />
        <Swatch name="accent" value="#D4AB37" />
        <Swatch name="accent-soft" value="#F0D785" />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-muted)', marginBottom: 12 }}>Estado & semântica</div>
        <Swatch name="alert" value="#D4373F" />
        <Swatch name="alert-soft" value="#F58A8A" />
        <Swatch name="success" value="#3FA68C" />
        <Swatch name="border-strong" value="#A89F8B" />
        <div style={{ marginTop: 16, fontSize: 12, color: 'var(--ink-muted)' }}>
          <div style={{ fontStyle: 'italic' }}>
            Vermelho só pra alerta CFM, bloqueio, ícone do logo. Nunca CTA.
          </div>
        </div>
      </div>
    </div>

    {/* Tipografia */}
    <div style={{ marginTop: 40 }}>
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-muted)', marginBottom: 16 }}>Tipografia</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <div className="serif" style={{ fontSize: 48, fontWeight: 600, lineHeight: 1.1, color: 'var(--ink)' }}>
            O conhecimento<br/><span style={{ fontStyle: 'italic' }}>que cura.</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 8 }}>Playfair Display · display + headlines &gt;24px</div>
        </div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>Insuficiência cardíaca esquerda</div>
          <div style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1.55, marginBottom: 12 }}>
            A síndrome se manifesta com dispneia aos esforços, ortopneia e congestão pulmonar.
            Etiologia frequentemente isquêmica ou hipertensiva.
          </div>
          <div className="mono" style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
            Furosemida 40mg IV · BNP &gt; 400 pg/mL · FE &lt; 40%
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 10 }}>
            Inter · UI + body · JetBrains Mono · doses, valores, citações
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// 02 — COMPONENTS GALLERY
// ============================================================================
const SLASH_CMDS = [
  { cmd: '/resumir', desc: 'Resume capítulo, sistema ou livro inteiro', icon: BookOpenText, hint: 'Tab' },
  { cmd: '/explicar', desc: 'Mecanismo + manifestações + ângulo prova', icon: Lightbulb, hint: '⇥' },
  { cmd: '/quizar', desc: 'Gera 5 questões estilo Revalida / ENARE', icon: HelpCircle, hint: '⇥' },
  { cmd: '/caso', desc: 'Simula apresentação clínica completa', icon: UserSearch, hint: '⇥' },
  { cmd: '/diferenciar', desc: 'Tabela comparativa lado a lado', icon: GitCompare, hint: '⇥' },
  { cmd: '/dose', desc: 'Posologia, ajustes, contraindicações', icon: Pill, hint: '⇥' },
];

const SlashPalette = ({ activeIndex = 0, compact = false }) => (
  <div className="av-palette" style={{ width: compact ? 320 : 460 }}>
    <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
      Comandos
    </div>
    {SLASH_CMDS.map((c, i) => {
      const I = c.icon;
      return (
        <div key={c.cmd} className={`av-palette-item ${i === activeIndex ? 'active' : ''}`}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: i === activeIndex ? 'var(--brand-soft-bg)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand)' }}>
            <I size={16} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="mono" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>{c.cmd}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 1 }}>{c.desc}</div>
          </div>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-faint)', padding: '2px 6px', border: '1px solid var(--border)', borderRadius: 5 }}>{c.hint}</div>
        </div>
      );
    })}
  </div>
);

const Composer = ({ value = '', placeholder = 'Pergunta pro Hipócrates sobre teu material…', showSlashHint = true, large = false }) => (
  <div className="av-composer" style={{ width: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, minHeight: large ? 56 : 36 }}>
      <span className="mono" style={{ color: 'var(--accent)', fontSize: 15, fontWeight: 600, paddingTop: 2 }}>/</span>
      <div style={{ flex: 1, fontSize: 15, color: value ? 'var(--ink)' : 'var(--ink-faint)', lineHeight: 1.55, paddingTop: 2 }}>
        {value || placeholder}
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
      <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--ink-muted)' }}>
        <Paperclip size={14} /> anexar códice
      </button>
      <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--ink-muted)' }}>
        <span className="mono" style={{ fontSize: 11, padding: '1px 5px', border: '1px solid var(--border)', borderRadius: 4 }}>⌘K</span> palette
      </button>
      <div style={{ flex: 1 }} />
      <BtnPrimary icon={ArrowRight}>Auscultar</BtnPrimary>
    </div>
  </div>
);

const ComponentsArtboard = () => (
  <div className="av" style={{ padding: 32, height: '100%', background: 'var(--bg)', overflow: 'hidden' }}>
    <div style={{ marginBottom: 20 }}>
      <div className="serif" style={{ fontSize: 28, fontWeight: 600, color: 'var(--ink)' }}>Componentes</div>
      <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 4 }}>Primitivas usadas em todas as telas</div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

      {/* Buttons */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-muted)', marginBottom: 10 }}>Buttons</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <BtnPrimary icon={ArrowRight}>Auscultar</BtnPrimary>
          <BtnPrimary icon={Stethoscope}>Começar grátis</BtnPrimary>
          <BtnGhost>Cancelar</BtnGhost>
          <button className="av-btn-soft"><Plus size={14} /> Subir códice</button>
        </div>
      </div>

      {/* Citation pills */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-muted)', marginBottom: 10 }}>Citação</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <Citation page={437} />
          <Citation page={437} pageEnd={441} />
          <Citation page={612} active />
          <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>hover, range, active</span>
        </div>
      </div>

      {/* Composer */}
      <div style={{ gridColumn: 'span 2' }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-muted)', marginBottom: 10 }}>Composer (input de anamnese)</div>
        <Composer />
      </div>

      {/* Chat bubbles */}
      <div style={{ gridColumn: 'span 2' }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-muted)', marginBottom: 10 }}>Bubbles</div>
        <UserBubble>resume fisiopato de IC esquerda</UserBubble>
        <HipBubble>
          A insuficiência cardíaca esquerda decorre da incapacidade do ventrículo esquerdo de manter débito adequado <Citation page={437} />. Os mecanismos compensatórios — ativação do sistema renina-angiotensina-aldosterona e do sistema nervoso simpático <Citation page={438} /> — inicialmente preservam a perfusão, mas a longo prazo agravam a sobrecarga.
        </HipBubble>
      </div>

      {/* Codex covers */}
      <div style={{ gridColumn: 'span 2' }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-muted)', marginBottom: 10 }}>Capas procedurais</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
          <CodexCover title="Robbins Patologia" category="Patologia" author="Kumar · 10ª ed" />
          <CodexCover title="Porto Semiologia" category="Cardio" author="Porto · 8ª ed" />
          <CodexCover title="Goodman & Gilman" category="Farma" author="13ª ed" />
          <CodexCover title="Tratado de Cardiologia SBC" category="Cardio" />
          <CodexCover title="Atlas de Histologia" category="Histo" />
        </div>
      </div>

    </div>
  </div>
);

window.TokensArtboard = TokensArtboard;
window.ComponentsArtboard = ComponentsArtboard;
window.SlashPalette = SlashPalette;
window.Composer = Composer;
window.SLASH_CMDS = SLASH_CMDS;
