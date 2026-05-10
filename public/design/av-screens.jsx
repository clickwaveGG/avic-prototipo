/* global React, AvicenaMark, HipAvatar, Citation, CodexCover, UserBubble, HipBubble,
   BtnPrimary, BtnGhost, Composer, SlashPalette, SLASH_CMDS,
   ChevronRight, ChevronLeft, ArrowRight, Plus, Search, X, Check,
   Stethoscope, BookOpenText, Lightbulb, HelpCircle, UserSearch, GitCompare, Pill,
   Paperclip, Sparkles, Menu, Bookmark, FileText, Heart, Shield, Quote, Settings, ClockIcon, Copy */

const { useState, useEffect, useRef } = React;

// =============================================================================
// LANDING
// =============================================================================
const Landing = ({ mobile = false }) => (
  <div className="av av-scroll" style={{ height: '100%', background: 'var(--bg)', position: 'relative', overflowX: 'hidden' }}>
    <div className="av-aurora" />
    {/* Nav */}
    <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: mobile ? '16px 20px' : '20px 48px', borderBottom: '1px solid rgba(217, 208, 188, 0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <AvicenaMark size={mobile ? 26 : 30} />
        <div className="serif" style={{ fontSize: mobile ? 20 : 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Avicena</div>
      </div>
      {!mobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 14, color: 'var(--ink-muted)' }}>
          <a>Como funciona</a>
          <a>Juramento</a>
          <a>Manifesto</a>
          <a style={{ color: 'var(--ink)', fontWeight: 500 }}>Entrar</a>
          <BtnPrimary>Começar grátis</BtnPrimary>
        </div>
      )}
      {mobile && (
        <button style={{ padding: 8 }}><Menu size={20} /></button>
      )}
    </div>

    {/* Hero */}
    <div style={{ position: 'relative', zIndex: 2, padding: mobile ? '48px 20px 40px' : '88px 48px 64px',
                  display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1.05fr 1fr', gap: mobile ? 32 : 56, alignItems: 'center' }}>
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 20,
                      background: 'var(--bg-elev-1)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--ink-muted)', marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-soft)' }} className="av-glow" />
          Beta · feito por estudante de saúde, pra estudante de saúde
        </div>
        <h1 className="serif" style={{ fontSize: mobile ? 40 : 64, lineHeight: mobile ? 1.05 : 1.02, fontWeight: 600, letterSpacing: '-0.02em' }}>
          O conhecimento<br/><span style={{ fontStyle: 'italic', color: 'var(--brand)' }}>que cura.</span>
        </h1>
        <p style={{ fontSize: mobile ? 16 : 19, lineHeight: 1.55, color: 'var(--ink-muted)', marginTop: mobile ? 16 : 24, maxWidth: 540 }}>
          Sobe o Robbins, o Porto, o Goodman. Pergunta pro <span style={{ color: 'var(--ink)', fontWeight: 500 }}>Hipócrates</span> e
          recebe parecer com a página exata citada. Estuda ouvindo, não lendo passivo às 23h47.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: mobile ? 24 : 32, flexWrap: 'wrap' }}>
          <BtnPrimary icon={Stethoscope}>Começar grátis</BtnPrimary>
          <BtnGhost>Ver o consultório por dentro</BtnGhost>
        </div>
        <div style={{ marginTop: 20, fontSize: 12.5, color: 'var(--ink-faint)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Check size={13} /> 50 anamneses/dia grátis</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Check size={13} /> Sem cartão</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Check size={13} /> Cancela em 1 clique</span>
        </div>
      </div>

      {/* Hero mock — mini chat preview */}
      <div style={{ position: 'relative' }}>
        <div style={{
          background: 'var(--bg-elev-1)', border: '1px solid var(--border)',
          borderRadius: 20, padding: 20, boxShadow: 'var(--shadow-lg)',
          transform: mobile ? 'none' : 'rotate(0.5deg)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid var(--border)' }}>
            <CodexCover title="Porto Semiologia" category="Cardio" size="sm" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="serif" style={{ fontSize: 16, fontWeight: 600 }}>Porto · Semiologia Médica</div>
              <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>1.247 páginas · 8ª edição</div>
            </div>
          </div>
          <UserBubble>resume fisiopato de IC esquerda</UserBubble>
          <HipBubble footer={false}>
            <div>
              Insuficiência cardíaca esquerda <Citation page={437} /> resulta da falência do VE em sustentar débito.
              Os mecanismos compensatórios — RAAS e simpático <Citation page={438} /> — preservam perfusão a curto prazo
              <span className="av-cursor"></span>
            </div>
          </HipBubble>
        </div>
        {/* Floating slash palette teaser */}
        {!mobile && (
          <div style={{ position: 'absolute', bottom: -28, left: -36, transform: 'rotate(-2deg)' }}>
            <SlashPalette compact activeIndex={2} />
          </div>
        )}
      </div>
    </div>

    {/* Three-up */}
    <div style={{ position: 'relative', zIndex: 2, padding: mobile ? '40px 20px' : '64px 48px', display: 'grid',
                  gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)', gap: mobile ? 20 : 24, borderTop: '1px solid var(--border)' }}>
      {[
        { ic: BookOpenText, t: 'Sobe o códice', d: 'PDF do livro, atlas, diretriz, artigo. Avicena lê e indexa em 60s.' },
        { ic: Stethoscope, t: 'Ausculta', d: '/resumir, /quizar, /caso, /dose, /diferenciar. Pergunta como pergunta pra amiga de turma.' },
        { ic: Quote, t: 'Confia na citação', d: 'Cada parecer vem com [pp. 437] clicável. Abre no PDF, vê o trecho original.' },
      ].map((s, i) => {
        const I = s.ic;
        return (
          <div key={i}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--brand-soft-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand)', marginBottom: 14 }}>
              <I size={20} />
            </div>
            <div className="serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>{s.t}</div>
            <div style={{ fontSize: 14.5, color: 'var(--ink-muted)', lineHeight: 1.55 }}>{s.d}</div>
          </div>
        );
      })}
    </div>

    {/* Footer mini */}
    <div style={{ padding: mobile ? '24px 20px 40px' : '32px 48px 56px', borderTop: '1px solid var(--border)',
                  fontSize: 12, color: 'var(--ink-faint)', textAlign: 'center', fontStyle: 'italic', lineHeight: 1.6 }}>
      Avicena é ferramenta de estudo. Não diagnostica, não prescreve, não substitui avaliação clínica presencial.
    </div>
  </div>
);

// =============================================================================
// ONBOARDING 3/3 — Disclaimer CFM
// =============================================================================
const OnboardingCFM = ({ mobile = false }) => {
  const [checked, setChecked] = useState(true);
  return (
    <div className="av" style={{ height: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Progress */}
      <div style={{ padding: mobile ? '20px 20px 0' : '24px 32px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AvicenaMark size={22} />
            <span className="serif" style={{ fontSize: 16, fontWeight: 600 }}>Avicena</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>3 de 3</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 3 ? 'var(--brand)' : 'var(--border)' }} />
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="av-scroll" style={{ flex: 1, padding: mobile ? '32px 20px' : '48px 64px', maxWidth: 720, margin: '0 auto', width: '100%' }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--accent)', marginBottom: 12 }}>
          O juramento de quem usa
        </div>
        <h2 className="serif" style={{ fontSize: mobile ? 28 : 36, fontWeight: 600, lineHeight: 1.15, marginBottom: 16 }}>
          Antes do consultório abrir, <span style={{ fontStyle: 'italic', color: 'var(--brand)' }}>a regra</span>.
        </h2>
        <p style={{ fontSize: mobile ? 15 : 16.5, color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: 24 }}>
          Hipócrates te ajuda a estudar — não te substitui na decisão clínica. Lê com calma, marca o checkbox, e a gente começa.
        </p>

        {/* Disclaimer card */}
        <div style={{
          background: 'var(--bg-elev-1)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: mobile ? 20 : 28,
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--alert-bg)', color: 'var(--alert)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={18} />
            </div>
            <div>
              <div className="serif" style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.3 }}>Material de estudo. Não substitui avaliação clínica presencial.</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginTop: 4, fontStyle: 'italic' }}>Resolução CFM nº 2.314/2022 · LGPD · Termos de uso</div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12, fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>
            {[
              ['não diagnostica', 'Avicena não emite diagnóstico médico. Os pareceres do Hipócrates são síntese do material que você subiu, pra estudo.'],
              ['não prescreve', 'Doses e condutas mostradas são referência educacional. Prescrição em paciente real é responsabilidade do médico que assina.'],
              ['cita a fonte', 'Toda resposta vem com [pp. XXX] do códice original. Se a citação não bate com o livro, reporta — a gente conserta.'],
              ['protege seus dados', 'Seus códices ficam só com você. Não treinamos modelo público com seu material. LGPD respeitada.'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 16, alignItems: 'baseline' }}>
                <div className="mono" style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 500, textTransform: 'lowercase' }}>{k}</div>
                <div style={{ color: 'var(--ink-muted)' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Checkbox */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 24, cursor: 'pointer', padding: 14, borderRadius: 12, background: checked ? 'var(--brand-soft-bg)' : 'transparent', border: '1px solid', borderColor: checked ? 'var(--brand-soft)' : 'var(--border)', transition: 'all 160ms ease' }}>
          <div onClick={() => setChecked(!checked)} style={{
            width: 22, height: 22, borderRadius: 6, border: '2px solid',
            borderColor: checked ? 'var(--brand)' : 'var(--border-strong)',
            background: checked ? 'var(--brand)' : 'transparent',
            color: '#F4F1EA', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 160ms ease',
          }}>
            {checked && <Check size={14} stroke={3} />}
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.5 }}>
            Entendi. Vou usar Avicena pra estudar — não pra atender paciente real. Quando for caso meu, procuro emergência ou clínico de confiança.
          </div>
        </label>

        <div style={{ display: 'flex', gap: 12, marginTop: 28, flexDirection: mobile ? 'column-reverse' : 'row' }}>
          <BtnGhost>Voltar</BtnGhost>
          <div style={{ flex: 1 }} />
          <BtnPrimary icon={ArrowRight}>Abrir o consultório</BtnPrimary>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// CONSULTÓRIO POPULADO
// =============================================================================
const codices = [
  { title: 'Robbins Patologia', category: 'Patologia', author: 'Kumar · 10ª ed', pages: 1480, last: 'hoje 23:04' },
  { title: 'Porto Semiologia', category: 'Cardio', author: 'Porto · 8ª ed', pages: 1247, last: 'hoje 21:18' },
  { title: 'Goodman & Gilman', category: 'Farma', author: '13ª ed', pages: 1808, last: 'ontem' },
  { title: 'Tratado Cardiologia SBC', category: 'Cardio', author: 'SBC · 2ª ed', pages: 912, last: 'qua' },
  { title: 'Diretriz IC 2022', category: 'Cardio', author: 'AHA/SBC', pages: 124, last: '4 dias' },
  { title: 'Atlas Histologia', category: 'Histo', author: 'Junqueira', pages: 540, last: '1 sem' },
  { title: 'Sabiston Cirurgia', category: 'Cirurgia', author: '21ª ed', pages: 2120, last: '2 sem' },
  { title: 'Cecil Tratado MI', category: 'Clínica', author: '26ª ed', pages: 2780, last: '1 mês' },
];

const ConsultorioPopulado = ({ mobile = false }) => (
  <div className="av" style={{ height: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
    {/* Top bar */}
    <div style={{ padding: mobile ? '14px 16px' : '18px 32px', borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-elev-1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {mobile && <Menu size={20} />}
        <AvicenaMark size={mobile ? 22 : 26} />
        <span className="serif" style={{ fontSize: mobile ? 16 : 18, fontWeight: 600 }}>Consultório</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 10 : 18 }}>
        {!mobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, background: 'var(--bg-elev-2)', fontSize: 13, color: 'var(--ink-muted)', minWidth: 280 }}>
            <Search size={14} /> Buscar no códice ou em todas as anamneses
            <span className="mono" style={{ marginLeft: 'auto', fontSize: 11, padding: '1px 5px', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--ink-faint)' }}>⌘K</span>
          </div>
        )}
        <div style={{ fontSize: 12, color: 'var(--ink-muted)' }} className="av-tabular">
          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>12</span>/50 hoje
        </div>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-soft)', color: '#6F5417', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>M</div>
      </div>
    </div>

    {/* Main */}
    <div className="av-scroll" style={{ flex: 1, padding: mobile ? '24px 16px 32px' : '36px 48px 48px' }}>
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginBottom: 4 }}>boa noite, Marina</div>
        <h1 className="serif" style={{ fontSize: mobile ? 26 : 34, fontWeight: 600, letterSpacing: '-0.015em' }}>
          Como tá o estudo de <span style={{ fontStyle: 'italic', color: 'var(--brand)' }}>Cardio</span>?
        </h1>
        <div style={{ fontSize: 14, color: 'var(--ink-muted)', marginTop: 6 }}>
          Continua de onde parou no Porto, ou bora um códice novo?
        </div>
      </div>

      {/* Continue card */}
      <div style={{ marginBottom: 32, display: 'grid', gridTemplateColumns: mobile ? '1fr' : '2fr 1fr', gap: 16 }}>
        <div style={{ background: 'var(--bg-elev-1)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, display: 'flex', gap: 16, alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <CodexCover title="Porto Semiologia" category="Cardio" size="sm" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Última anamnese · 23:04</div>
            <div className="serif" style={{ fontSize: 17, fontWeight: 600, marginTop: 2, marginBottom: 6 }}>Porto Semiologia</div>
            <div style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              "resume fisiopato de IC esquerda e me dá 5 questões pra prova segunda"
            </div>
          </div>
          <button className="av-btn-soft"><ArrowRight size={14} /></button>
        </div>
        <div style={{ background: 'var(--bg-elev-1)', border: '1px dashed var(--border-strong)', borderRadius: 16, padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--brand)', cursor: 'pointer', minHeight: 100 }}>
          <Plus size={18} />
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 600 }}>Subir novo códice</div>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>PDF até 100MB</div>
          </div>
        </div>
      </div>

      {/* Grid de códices */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--ink-muted)' }}>Tua estante · {codices.length} códices</div>
        {!mobile && <div style={{ fontSize: 12, color: 'var(--ink-faint)', display: 'flex', gap: 16 }}>
          <span style={{ color: 'var(--ink)', fontWeight: 500 }}>Recentes</span>
          <span>Categoria</span>
          <span>Mais consultados</span>
        </div>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', gap: mobile ? 14 : 22 }}>
        {codices.map((c) => (
          <div key={c.title} className="av-codex-card" style={{ cursor: 'pointer' }}>
            <CodexCover title={c.title} category={c.category} author={c.author} size={mobile ? 'sm' : 'md'} />
            <div style={{ paddingTop: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                <span>{c.pages}p</span>
                <span>{c.last}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// =============================================================================
// CHAT COM CITAÇÃO + PDF VIEWER
// =============================================================================
const ChatWithPDF = ({ mobile = false }) => (
  <div className="av" style={{ height: '100%', background: 'var(--bg)', display: 'flex', flexDirection: mobile ? 'column' : 'row' }}>
    {/* Sidebar de códices (desktop) */}
    {!mobile && (
      <div style={{ width: 240, borderRight: '1px solid var(--border)', background: 'var(--bg-elev-1)', padding: '18px 14px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px 14px', borderBottom: '1px solid var(--border)' }}>
          <AvicenaMark size={22} />
          <span className="serif" style={{ fontSize: 15, fontWeight: 600 }}>Avicena</span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-muted)', padding: '14px 8px 6px' }}>Códice ativo</div>
        <div style={{ padding: '8px', borderRadius: 10, background: 'var(--brand-soft-bg)', display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
          <CodexCover title="Porto Semiologia" category="Cardio" size="sm" />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>Porto Semiologia</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-faint)' }}>1.247 páginas</div>
          </div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-muted)', padding: '6px 8px' }}>Prontuário · hoje</div>
        {[
          'resume fisiopato de IC esquerda',
          'diferenciar IC sistólica vs diastólica',
          '/quizar IC pra prova',
          'mecanismo do furo no edema',
        ].map((q, i) => (
          <div key={i} style={{ padding: '8px 8px', borderRadius: 6, fontSize: 12.5, color: i === 0 ? 'var(--ink)' : 'var(--ink-muted)', background: i === 0 ? 'var(--bg-elev-2)' : 'transparent', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Quote size={11} style={{ color: 'var(--ink-faint)', flexShrink: 0 }} />
            {q}
          </div>
        ))}
      </div>
    )}

    {/* Centro: chat */}
    <div style={{ flex: mobile ? 'none' : 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: mobile ? '55%' : 'auto', borderBottom: mobile ? '1px solid var(--border)' : 'none' }}>
      {/* Chat header mobile */}
      {mobile && (
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)', background: 'var(--bg-elev-1)' }}>
          <Menu size={18} />
          <CodexCover title="Porto Semiologia" category="Cardio" size="sm" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Porto Semiologia</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-faint)' }}>Cardio · 1.247p</div>
          </div>
        </div>
      )}

      <div className="av-scroll" style={{ flex: 1, padding: mobile ? '18px 16px' : '24px 32px', maxWidth: 720, margin: '0 auto', width: '100%' }}>
        <UserBubble>resume fisiopato de IC esquerda</UserBubble>
        <HipBubble>
          <p style={{ marginBottom: 10 }}>
            A insuficiência cardíaca esquerda <Citation page={437} /> é a incapacidade do ventrículo esquerdo de manter
            débito cardíaco adequado às demandas teciduais. Origem mais comum: <strong>doença arterial coronariana</strong> e
            <strong> hipertensão</strong> de longa data.
          </p>
          <p style={{ marginBottom: 10 }}>
            Mecanismos compensatórios — <strong>SRAA</strong> e <strong>simpático</strong> <Citation page={438} active /> —
            preservam perfusão a curto prazo, mas a longo prazo agravam congestão e remodelamento.
            Daí a tríade clássica: <em>dispneia, ortopneia, DPN</em> <Citation page={439} pageEnd={441} />.
          </p>
          <p>
            No exame: <span className="mono" style={{ fontSize: 13, color: 'var(--brand)' }}>B3</span>,
            estertores em bases pulmonares, ictus desviado. Cai muito em prova como diferencial
            de causa cardiogênica vs pulmonar de dispneia.
          </p>
        </HipBubble>

        {/* Quick chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginLeft: 48, marginBottom: 24 }}>
          {['/quizar isso', 'diferenciar de IC direita', '/dose furosemida', 'manifestações na prova'].map(s => (
            <button key={s} style={{ padding: '6px 12px', fontSize: 12.5, borderRadius: 16, border: '1px solid var(--border)', background: 'var(--bg-elev-1)', color: 'var(--ink-muted)' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Composer fixo */}
      <div style={{ padding: mobile ? '10px 14px 14px' : '14px 32px 22px', background: 'var(--bg)', borderTop: mobile ? '1px solid var(--border)' : 'none' }}>
        <Composer placeholder="encadeia mais uma anamnese…" />
      </div>
    </div>

    {/* PDF viewer */}
    <div style={{ width: mobile ? '100%' : 460, height: mobile ? '45%' : 'auto', borderLeft: mobile ? 'none' : '1px solid var(--border)', background: 'var(--bg-elev-2)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-elev-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, background: 'var(--accent-bg)', border: '1px solid var(--accent)' }}>
          <FileText size={13} style={{ color: '#6F5417' }} />
          <span className="mono" style={{ fontSize: 12, color: '#6F5417', fontWeight: 500 }}>pp. 438</span>
        </div>
        <div style={{ flex: 1, fontSize: 12, color: 'var(--ink-muted)' }}>Porto · capítulo 12</div>
        <button style={{ padding: 4, color: 'var(--ink-muted)' }}><ChevronLeft size={16} /></button>
        <button style={{ padding: 4, color: 'var(--ink-muted)' }}><ChevronRight size={16} /></button>
        <button style={{ padding: 4, color: 'var(--ink-muted)' }}><X size={16} /></button>
      </div>
      <div className="av-scroll" style={{ flex: 1, padding: 16 }}>
        <div className="av-pdf-page">
          <div style={{ fontSize: 9, color: '#6B5F45', marginBottom: 14, fontFamily: 'var(--font-display)' }}>438 · Insuficiência Cardíaca</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, marginBottom: 10, color: '#1A1610' }}>
            Mecanismos compensatórios da insuficiência cardíaca
          </h3>
          <p style={{ marginBottom: 8 }}>
            Frente à redução crônica do débito cardíaco, o organismo desencadeia respostas neuro-humorais
            que inicialmente são adaptativas. A <em>ativação simpática</em> aumenta a frequência cardíaca,
            a contratilidade e o tônus vascular, mantendo a perfusão dos órgãos-alvo.
          </p>
          <p style={{ marginBottom: 8 }}>
            <span className="av-pdf-highlight">
              Paralelamente, a redução da perfusão renal ativa o sistema renina-angiotensina-aldosterona
              (SRAA), promovendo retenção de sódio e água, e vasoconstrição periférica.
            </span>{' '}
            A liberação de <em>ADH</em> contribui para a retenção hídrica.
          </p>
          <p style={{ marginBottom: 8 }}>
            Embora benéficos a curto prazo, esses mecanismos, quando persistentes, levam a sobrecarga de
            volume, remodelamento ventricular adverso e progressão da síndrome. A compreensão desse
            paradoxo fundamenta a base do tratamento moderno com inibidores do SRAA (IECA, BRA, ARNi) e
            betabloqueadores.
          </p>
          <div style={{ marginTop: 18, padding: 10, borderLeft: '3px solid #6B5F45', background: 'rgba(212, 171, 55, 0.08)', fontStyle: 'italic', fontSize: 10.5 }}>
            <strong style={{ fontStyle: 'normal' }}>Quadro 12.3</strong> — Mecanismos compensatórios na IC e seus efeitos
            adaptativos vs deletérios a longo prazo.
          </div>
        </div>
      </div>
    </div>
  </div>
);

// =============================================================================
// RESPOSTA /quizar
// =============================================================================
const QuizCard = ({ n, question, alts, answer, rationale, page }) => {
  const [open, setOpen] = useState(n === 1);
  return (
    <div className="av-quiz-card" style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--brand)', color: '#F4F1EA', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {n}
        </div>
        <div style={{ flex: 1, fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink)' }}>
          {question}
        </div>
      </div>
      <div style={{ display: 'grid', gap: 8, marginLeft: 40, marginBottom: 12 }}>
        {alts.map(([letter, txt], i) => {
          const isCorrect = letter === answer && open;
          return (
            <div key={letter} style={{
              display: 'flex', gap: 10, padding: '8px 12px', borderRadius: 10,
              background: isCorrect ? 'rgba(63, 166, 140, 0.12)' : 'var(--bg-elev-2)',
              border: '1px solid', borderColor: isCorrect ? 'var(--brand-soft)' : 'transparent',
              fontSize: 13.5, alignItems: 'flex-start',
            }}>
              <span className="mono" style={{ fontWeight: 600, color: isCorrect ? 'var(--brand)' : 'var(--ink-muted)', minWidth: 16 }}>{letter})</span>
              <span style={{ color: isCorrect ? 'var(--ink)' : 'var(--ink-muted)', flex: 1 }}>{txt}</span>
              {isCorrect && <Check size={15} stroke={2.4} style={{ color: 'var(--brand)', marginTop: 2 }} />}
            </div>
          );
        })}
      </div>
      <div style={{ marginLeft: 40, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <button onClick={() => setOpen(!open)} style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--brand)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          {open ? '↑ esconder gabarito' : '↓ ver gabarito'}
        </button>
        {open && (
          <>
            <span style={{ width: 1, height: 12, background: 'var(--border)' }} />
            <span style={{ fontSize: 12.5, color: 'var(--ink-muted)' }}>Gabarito: <strong style={{ color: 'var(--ink)' }}>{answer}</strong></span>
            <Citation page={page} />
          </>
        )}
      </div>
      {open && rationale && (
        <div style={{ marginLeft: 40, marginTop: 10, padding: 12, background: 'var(--bg-elev-2)', borderRadius: 10, fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.55 }}>
          <strong style={{ color: 'var(--ink)' }}>Comentário:</strong> {rationale}
        </div>
      )}
    </div>
  );
};

const RespostaQuizar = ({ mobile = false }) => (
  <div className="av" style={{ height: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
    <div style={{ padding: mobile ? '12px 16px' : '16px 32px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elev-1)', display: 'flex', alignItems: 'center', gap: 10 }}>
      {mobile && <Menu size={18} />}
      <AvicenaMark size={22} />
      <span className="serif" style={{ fontSize: 15, fontWeight: 600 }}>Porto Semiologia</span>
      <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>· Cardio</span>
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 11.5, color: 'var(--ink-muted)' }} className="av-tabular">13/50</div>
    </div>

    <div className="av-scroll" style={{ flex: 1, padding: mobile ? '18px 16px' : '28px 32px', maxWidth: 760, margin: '0 auto', width: '100%' }}>
      <UserBubble>/quizar fisiopato IC esquerda — estilo Revalida</UserBubble>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <HipAvatar />
        <div style={{ flex: 1 }}>
          <div style={{ background: 'var(--bg-elev-1)', border: '1px solid var(--border)', padding: '14px 18px 6px', borderRadius: '6px 18px 18px 18px' }}>
            <div style={{ fontSize: 14.5, color: 'var(--ink)', lineHeight: 1.55, marginBottom: 12 }}>
              <strong className="serif" style={{ fontSize: 17, display: 'block', marginBottom: 4 }}>5 questões · fisiopato IC esquerda</strong>
              Montei no estilo Revalida — caso clínico + alternativas. Tenta sem ver o gabarito primeiro.
              Citação pra cada uma puxa do <em>Porto cap. 12</em>.
            </div>

            <QuizCard
              n={1}
              question="Paciente de 67 anos, hipertenso há 20 anos, evolui com dispneia aos médios esforços, ortopneia e edema vespertino de MMII. Ao exame: B3, estertores em terço inferior de hemitórax e ictus desviado. Qual o mecanismo fisiopatológico que melhor explica a ortopneia desse paciente?"
              alts={[
                ['A', 'Diminuição da pré-carga ao decúbito por redução do retorno venoso'],
                ['B', 'Redistribuição volêmica com aumento do retorno venoso e congestão pulmonar'],
                ['C', 'Aumento da contratilidade ventricular esquerda em posição supina'],
                ['D', 'Broncoespasmo desencadeado por compressão brônquica direta'],
              ]}
              answer="B"
              rationale="Em decúbito, o sangue periférico (especialmente dos MMII) retorna mais facilmente ao coração, aumentando a pré-carga. Em um VE já comprometido, esse retorno extra não é ejetado adequadamente e acaba represado no leito pulmonar, gerando congestão e dispneia. O paciente alivia sentando — por isso ortopneia."
              page={439}
            />

            <QuizCard
              n={2}
              question="Sobre a ativação do sistema renina-angiotensina-aldosterona (SRAA) na insuficiência cardíaca, é correto afirmar que:"
              alts={[
                ['A', 'A aldosterona promove diurese e natriurese como mecanismo protetor'],
                ['B', 'A angiotensina II é vasodilatadora, reduzindo a pós-carga ventricular'],
                ['C', 'A retenção de sódio e água é benéfica a curto prazo, mas deletéria a longo prazo'],
                ['D', 'A inibição do SRAA é contraindicada em pacientes com IC sintomática'],
              ]}
              answer="C"
              page={438}
            />

            <QuizCard
              n={3}
              question="Qual achado semiológico tem MAIOR especificidade para insuficiência cardíaca esquerda?"
              alts={[
                ['A', 'Edema bilateral de membros inferiores'],
                ['B', 'Turgência jugular patológica'],
                ['C', 'Terceira bulha (B3)'],
                ['D', 'Hepatomegalia dolorosa'],
              ]}
              answer="C"
              page={441}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <button className="av-btn-soft"><Plus size={13} /> mais 5 questões</button>
            <button style={{ padding: '8px 14px', fontSize: 13, borderRadius: 10, color: 'var(--ink-muted)', border: '1px solid var(--border)' }}>baixar como PDF</button>
            <button style={{ padding: '8px 14px', fontSize: 13, borderRadius: 10, color: 'var(--ink-muted)', border: '1px solid var(--border)' }}>salvar no prontuário</button>
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-faint)', fontStyle: 'italic' }}>Material de estudo.</div>
        </div>
      </div>
    </div>
  </div>
);

// =============================================================================
// SUCESSO PAGAMENTO
// =============================================================================
const SucessoPagamento = ({ mobile = false }) => (
  <div className="av" style={{ height: '100%', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
    <div className="av-aurora" />
    <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: mobile ? 20 : 40 }}>
      <div style={{
        background: 'var(--bg-elev-1)',
        border: '1px solid var(--border)',
        borderRadius: 24,
        padding: mobile ? '36px 24px' : '56px 56px 48px',
        maxWidth: 480,
        width: '100%',
        textAlign: 'center',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Soft glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(60% 50% at 50% 0%, rgba(118, 235, 196, 0.18), transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative' }}>
          {/* Check */}
          <div style={{
            width: 72, height: 72, margin: '0 auto 24px',
            borderRadius: '50%',
            background: 'var(--brand-soft-bg)',
            border: '2px solid var(--brand-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="av-check" />
            </svg>
          </div>

          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: 8 }}>
            Juramento feito
          </div>

          <h2 className="serif" style={{ fontSize: mobile ? 28 : 36, fontWeight: 600, lineHeight: 1.15, marginBottom: 10 }}>
            Bem-vindo,<br/><span style={{ fontStyle: 'italic', color: 'var(--brand)' }}>Residente</span>.
          </h2>

          <p style={{ fontSize: 15, color: 'var(--ink-muted)', lineHeight: 1.55, marginBottom: 28, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
            Cap diário desbloqueado. Códices ilimitados, anamneses ilimitadas, slash commands liberados.
            Bom estudo.
          </p>

          {/* Receipt */}
          <div style={{ background: 'var(--bg)', borderRadius: 12, padding: '14px 18px', textAlign: 'left', marginBottom: 24, border: '1px dashed var(--border-strong)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--ink-muted)', marginBottom: 4 }}>
              <span>Plano</span><span style={{ color: 'var(--ink)', fontWeight: 500 }}>Residente · mensal</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--ink-muted)', marginBottom: 4 }}>
              <span>Valor</span><span className="mono" style={{ color: 'var(--ink)' }}>R$ 14,90</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--ink-muted)', marginBottom: 4 }}>
              <span>Próxima cobrança</span><span style={{ color: 'var(--ink)' }}>10 de jun · Pix</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--ink-muted)' }}>
              <span>Comprovante</span><span className="mono" style={{ color: 'var(--brand)' }}>AV-2406-04F2</span>
            </div>
          </div>

          <BtnPrimary icon={ArrowRight} style={{ width: '100%' }}>Voltar pro consultório</BtnPrimary>
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--ink-faint)' }}>
            Cancela em 1 clique no <a style={{ color: 'var(--ink-muted)', textDecoration: 'underline' }}>settings</a> · sem letra miúda.
          </div>
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, {
  Landing, OnboardingCFM, ConsultorioPopulado, ChatWithPDF, RespostaQuizar, SucessoPagamento,
});
