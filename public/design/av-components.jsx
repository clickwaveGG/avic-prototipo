/* global React */
// Avicena — Componentes base (visual primitives + icons)

// =============== ICONS (lucide-style, inline SVG) ===============
const Icon = ({ d, size = 18, stroke = 1.6, className = '', children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
       className={className} {...rest}>
    {children || (d && <path d={d} />)}
  </svg>
);

const ChevronRight = (p) => <Icon {...p}><polyline points="9 18 15 12 9 6" /></Icon>;
const ChevronLeft = (p) => <Icon {...p}><polyline points="15 18 9 12 15 6" /></Icon>;
const ArrowRight = (p) => <Icon {...p}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Icon>;
const Plus = (p) => <Icon {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>;
const Search = (p) => <Icon {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon>;
const X = (p) => <Icon {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>;
const Check = (p) => <Icon {...p}><polyline points="20 6 9 17 4 12" /></Icon>;
const Stethoscope = (p) => (
  <Icon {...p}>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </Icon>
);
const BookOpenText = (p) => (
  <Icon {...p}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    <path d="M6 8h2M6 12h2M16 8h2M16 12h2" />
  </Icon>
);
const Lightbulb = (p) => (
  <Icon {...p}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 1 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" /><path d="M10 22h4" />
  </Icon>
);
const HelpCircle = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Icon>
);
const UserSearch = (p) => (
  <Icon {...p}>
    <circle cx="10" cy="7" r="4" />
    <path d="M10.3 15H7a4 4 0 0 0-4 4v2" />
    <circle cx="17" cy="17" r="3" />
    <path d="m21 21-1.9-1.9" />
  </Icon>
);
const GitCompare = (p) => (
  <Icon {...p}>
    <circle cx="5" cy="6" r="3" /><circle cx="19" cy="18" r="3" />
    <path d="M8 6h7a2 2 0 0 1 2 2v7" /><path d="M16 18H9a2 2 0 0 1-2-2V9" />
  </Icon>
);
const Pill = (p) => (
  <Icon {...p}>
    <path d="M10.5 20.5a4.95 4.95 0 0 1-7-7l10-10a4.95 4.95 0 1 1 7 7z" />
    <path d="m8.5 8.5 7 7" />
  </Icon>
);
const Paperclip = (p) => <Icon {...p}><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></Icon>;
const Sparkles = (p) => <Icon {...p}><path d="M12 3 13.5 8.5 19 10 13.5 11.5 12 17 10.5 11.5 5 10 10.5 8.5z" /><path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z"/></Icon>;
const Menu = (p) => <Icon {...p}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></Icon>;
const Bookmark = (p) => <Icon {...p}><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></Icon>;
const FileText = (p) => <Icon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></Icon>;
const Heart = (p) => <Icon {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></Icon>;
const Shield = (p) => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Icon>;
const Quote = (p) => <Icon {...p}><path d="M3 21c3 0 7-1 7-8V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3"/><path d="M14 21c3 0 7-1 7-8V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3"/></Icon>;
const Settings = (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Icon>;
const ClockIcon = (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>;
const Copy = (p) => <Icon {...p}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></Icon>;

// =============== AVICENA LOGO MARK ===============
// Caduceu/serpente estilizado, leve referência islâmica ao Avicena (Ibn Sina).
const AvicenaMark = ({ size = 28, color }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M20 4 C 12 8 8 14 8 22 C 8 30 14 36 20 36 C 26 36 32 30 32 22 C 32 14 28 8 20 4 Z"
          fill={color || 'var(--brand)'} />
    {/* Serpent */}
    <path d="M20 10 C 16 13 16 16 20 19 C 24 22 24 25 20 28 C 18 29.5 18 31 20 32"
          stroke="#F4F1EA" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <circle cx="20" cy="10" r="1.4" fill="#F4F1EA" />
    {/* Wings */}
    <path d="M13 15 C 11 17 11 20 13 22" stroke="#76EBC4" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7"/>
    <path d="M27 15 C 29 17 29 20 27 22" stroke="#76EBC4" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7"/>
  </svg>
);

// =============== AVATAR HIPOCRATES ===============
const HipAvatar = ({ size = 36, pulsing = false }) => (
  <div className={pulsing ? 'av-glow' : ''}
       style={{
         width: size, height: size, borderRadius: '50%',
         background: 'var(--brand)', display: 'flex',
         alignItems: 'center', justifyContent: 'center', flexShrink: 0,
       }}>
    <AvicenaMark size={size * 0.7} color="#F4F1EA" />
  </div>
);

// =============== CITATION PILL ===============
const Citation = ({ page, pageEnd, onClick, active = false }) => {
  const label = pageEnd ? `pp. ${page}–${pageEnd}` : `pp. ${page}`;
  return (
    <button className="av-cite" onClick={onClick}
            style={active ? { background: 'var(--accent)', color: '#3A2A0A' } : {}}
            title="Ver no códice">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/>
        <path d="M4 16a4 4 0 0 1 4-4h12"/>
      </svg>
      {label}
    </button>
  );
};

// =============== CODEX COVER (procedural) ===============
// Hash → ângulo + paleta + glifo. Determinístico.
const hashStr = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const CODEX_PALETTES = [
  { base: '#1E4D3F', mid: '#2D6855', top: '#3FA68C' }, // verde apothecary
  { base: '#0F2A2A', mid: '#1E4D3F', top: '#76EBC4' }, // deep sage
  { base: '#4A2F1E', mid: '#6B4423', top: '#D4AB37' }, // amber/marrom
  { base: '#1A2B3F', mid: '#2D4055', top: '#5F8FB8' }, // azul tinta
  { base: '#3F1E2C', mid: '#5C3245', top: '#B86F8A' }, // bordô antigo
  { base: '#1F3F1E', mid: '#345C32', top: '#86B870' }, // verde botânico
  { base: '#3F2E1E', mid: '#5C4732', top: '#D4AB37' }, // marrom dourado
];

const CODEX_GLYPHS = [
  // caduceu
  (k) => <g key={k}><path d="M50 20v60M50 30 Q35 40 50 50 Q65 60 50 70" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M44 24 L50 18 L56 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></g>,
  // coração anatômico
  (k) => <g key={k}><path d="M50 75 C30 60 25 45 35 35 C42 28 50 32 50 40 C50 32 58 28 65 35 C75 45 70 60 50 75Z" stroke="currentColor" strokeWidth="1.2" fill="none"/><path d="M50 40 L48 30 L52 28 L50 22" stroke="currentColor" strokeWidth="1" fill="none"/></g>,
  // almofariz
  (k) => <g key={k}><path d="M30 50 Q50 80 70 50 L66 80 L34 80Z" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M40 50 L55 25 L60 28 L48 52" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/></g>,
  // bastão de Asclépio
  (k) => <g key={k}><line x1="50" y1="15" x2="50" y2="85" stroke="currentColor" strokeWidth="1.5"/><path d="M50 25 Q40 30 50 38 Q60 46 50 54 Q40 62 50 70" stroke="currentColor" strokeWidth="1.4" fill="none"/><circle cx="50" cy="22" r="2" fill="currentColor"/></g>,
  // olho/diagnóstico
  (k) => <g key={k}><path d="M20 50 Q50 30 80 50 Q50 70 20 50Z" stroke="currentColor" strokeWidth="1.4" fill="none"/><circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1.2" fill="none"/><circle cx="50" cy="50" r="3" fill="currentColor"/></g>,
  // hexágono celular
  (k) => <g key={k}><polygon points="50,20 75,35 75,65 50,80 25,65 25,35" stroke="currentColor" strokeWidth="1.5" fill="none"/><polygon points="50,32 65,40 65,60 50,68 35,60 35,40" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"/></g>,
  // DNA
  (k) => <g key={k}><path d="M35 20 Q65 35 35 50 Q5 65 35 80" stroke="currentColor" strokeWidth="1.3" fill="none"/><path d="M65 20 Q35 35 65 50 Q95 65 65 80" stroke="currentColor" strokeWidth="1.3" fill="none"/><line x1="38" y1="25" x2="62" y2="25" stroke="currentColor" strokeWidth="0.8"/><line x1="42" y1="32" x2="58" y2="32" stroke="currentColor" strokeWidth="0.8"/><line x1="50" y1="40" x2="50" y2="40" /><line x1="38" y1="50" x2="62" y2="50" stroke="currentColor" strokeWidth="0.8"/><line x1="42" y1="68" x2="58" y2="68" stroke="currentColor" strokeWidth="0.8"/></g>,
];

const CodexCover = ({ title, category, author, size = 'md' }) => {
  const h = hashStr(title);
  const pal = CODEX_PALETTES[h % CODEX_PALETTES.length];
  const angle = 15 + (h % 60);
  const Glyph = CODEX_GLYPHS[(h >> 3) % CODEX_GLYPHS.length];
  const widthMap = { sm: 110, md: 150, lg: 200 };
  const fontMap = { sm: 13, md: 16, lg: 19 };
  const labelMap = { sm: 9, md: 10, lg: 11 };
  const W = widthMap[size];
  const titleSize = fontMap[size];
  const labelSize = labelMap[size];
  return (
    <div className="av-codex-cover" style={{ width: W, background: `linear-gradient(${angle}deg, ${pal.base} 0%, ${pal.mid} 60%, ${pal.top} 130%)` }}>
      {/* glyph */}
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', color: 'rgba(255,255,255,0.10)' }}>
        <Glyph k="g" />
      </svg>
      {/* selo de categoria */}
      <div style={{
        position: 'absolute', top: 12, right: 12,
        padding: '3px 8px', borderRadius: 4,
        background: 'rgba(212, 171, 55, 0.95)',
        color: '#3A2A0A',
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontSize: labelSize,
        fontWeight: 500,
        letterSpacing: '0.02em',
        zIndex: 3,
      }}>
        {category}
      </div>
      {/* nome */}
      <div style={{ position: 'absolute', left: 18, right: 12, bottom: 14, zIndex: 3 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: titleSize,
          fontWeight: 600,
          color: '#F4F1EA',
          letterSpacing: '-0.015em',
          lineHeight: 1.15,
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}>
          {title}
        </div>
        {author && <div style={{ fontSize: labelSize, color: 'rgba(244, 241, 234, 0.7)', marginTop: 4, fontStyle: 'italic' }}>{author}</div>}
      </div>
    </div>
  );
};

// =============== CHAT BUBBLES ===============
const UserBubble = ({ children }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
    <div style={{
      maxWidth: '78%',
      background: 'var(--brand-soft-bg)',
      color: 'var(--ink)',
      padding: '12px 16px',
      borderRadius: '18px 18px 6px 18px',
      fontSize: 15,
      lineHeight: 1.55,
    }}>
      {children}
    </div>
  </div>
);

const HipBubble = ({ children, streaming = false, footer = true }) => (
  <div style={{ display: 'flex', gap: 12, marginBottom: 18, alignItems: 'flex-start' }}>
    <HipAvatar pulsing={streaming} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        background: 'var(--bg-elev-1)',
        border: '1px solid var(--border)',
        padding: '14px 18px',
        borderRadius: '6px 18px 18px 18px',
        fontSize: 15,
        lineHeight: 1.6,
      }}>
        {children}
      </div>
      {footer && (
        <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-faint)', fontStyle: 'italic', paddingLeft: 4 }}>
          Material de estudo.
        </div>
      )}
    </div>
  </div>
);

// =============== BUTTONS ===============
const BtnPrimary = ({ children, icon: I, ...rest }) => (
  <button className="av-btn-primary" {...rest}>
    {children}
    {I && <I size={16} stroke={2} />}
  </button>
);
const BtnGhost = ({ children, ...rest }) => (
  <button className="av-btn-ghost" {...rest}>{children}</button>
);

// =============== EXPORT TO WINDOW ===============
Object.assign(window, {
  // icons
  Icon, ChevronRight, ChevronLeft, ArrowRight, Plus, Search, X, Check,
  Stethoscope, BookOpenText, Lightbulb, HelpCircle, UserSearch, GitCompare, Pill,
  Paperclip, Sparkles, Menu, Bookmark, FileText, Heart, Shield, Quote, Settings, ClockIcon, Copy,
  // brand
  AvicenaMark, HipAvatar,
  // primitives
  Citation, CodexCover, UserBubble, HipBubble, BtnPrimary, BtnGhost,
});
