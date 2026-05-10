import { memo } from "react";

type Size = "sm" | "md" | "lg";

type Props = {
  title: string;
  category?: string;
  author?: string;
  size?: Size;
  cathedra?: boolean;
};

const PALETTES = [
  { base: "#1E4D3F", mid: "#2D6855", top: "#3FA68C" },
  { base: "#0F2A2A", mid: "#1E4D3F", top: "#76EBC4" },
  { base: "#4A2F1E", mid: "#6B4423", top: "#D4AB37" },
  { base: "#1A2B3F", mid: "#2D4055", top: "#5F8FB8" },
  { base: "#3F1E2C", mid: "#5C3245", top: "#B86F8A" },
  { base: "#1F3F1E", mid: "#345C32", top: "#86B870" },
  { base: "#3F2E1E", mid: "#5C4732", top: "#D4AB37" },
];

const GLYPHS: Array<(key: string) => React.ReactElement> = [
  (k) => (
    <g key={k}>
      <path
        d="M50 20v60M50 30 Q35 40 50 50 Q65 60 50 70"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M44 24 L50 18 L56 24"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  ),
  (k) => (
    <g key={k}>
      <path
        d="M50 75 C30 60 25 45 35 35 C42 28 50 32 50 40 C50 32 58 28 65 35 C75 45 70 60 50 75Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M50 40 L48 30 L52 28 L50 22"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
    </g>
  ),
  (k) => (
    <g key={k}>
      <path
        d="M30 50 Q50 80 70 50 L66 80 L34 80Z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d="M40 50 L55 25 L60 28 L48 52"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  ),
  (k) => (
    <g key={k}>
      <line x1="50" y1="15" x2="50" y2="85" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M50 25 Q40 30 50 38 Q60 46 50 54 Q40 62 50 70"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
      />
      <circle cx="50" cy="22" r="2" fill="currentColor" />
    </g>
  ),
  (k) => (
    <g key={k}>
      <path
        d="M20 50 Q50 30 80 50 Q50 70 20 50Z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
      />
      <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <circle cx="50" cy="50" r="3" fill="currentColor" />
    </g>
  ),
  (k) => (
    <g key={k}>
      <polygon
        points="50,20 75,35 75,65 50,80 25,65 25,35"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <polygon
        points="50,32 65,40 65,60 50,68 35,60 35,40"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
    </g>
  ),
  (k) => (
    <g key={k}>
      <path
        d="M35 20 Q65 35 35 50 Q5 65 35 80"
        stroke="currentColor"
        strokeWidth="1.3"
        fill="none"
      />
      <path
        d="M65 20 Q35 35 65 50 Q95 65 65 80"
        stroke="currentColor"
        strokeWidth="1.3"
        fill="none"
      />
      <line x1="38" y1="25" x2="62" y2="25" stroke="currentColor" strokeWidth="0.8" />
      <line x1="42" y1="32" x2="58" y2="32" stroke="currentColor" strokeWidth="0.8" />
      <line x1="38" y1="50" x2="62" y2="50" stroke="currentColor" strokeWidth="0.8" />
      <line x1="42" y1="68" x2="58" y2="68" stroke="currentColor" strokeWidth="0.8" />
    </g>
  ),
];

const WIDTH: Record<Size, number> = { sm: 110, md: 150, lg: 200 };
const TITLE_FS: Record<Size, number> = { sm: 13, md: 16, lg: 19 };
const LABEL_FS: Record<Size, number> = { sm: 9, md: 10, lg: 11 };

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function CodexCoverImpl({
  title,
  category,
  author,
  size = "md",
  cathedra = false,
}: Props) {
  const h = hashStr(title);
  const pal = PALETTES[h % PALETTES.length];
  const angle = 15 + (h % 60);
  const Glyph = GLYPHS[(h >> 3) % GLYPHS.length];
  const w = WIDTH[size];
  const titleSize = TITLE_FS[size];
  const labelSize = LABEL_FS[size];

  return (
    <div
      className="av-codex-cover"
      style={{
        width: w,
        background: `linear-gradient(${angle}deg, ${pal.base} 0%, ${pal.mid} 60%, ${pal.top} 130%)`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          color: "rgba(255,255,255,0.10)",
        }}
        aria-hidden="true"
      >
        {Glyph("g")}
      </svg>

      {cathedra && (
        <div
          className="av-codex-seal"
          aria-label="Códice da Cátedra"
          title="Códice da Cátedra"
        >
          📜 Cátedra
        </div>
      )}

      {category && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            padding: "3px 8px",
            borderRadius: 4,
            background: "rgba(212, 171, 55, 0.95)",
            color: "#3A2A0A",
            fontFamily: "var(--font-display, Georgia, serif)",
            fontStyle: "italic",
            fontSize: labelSize,
            fontWeight: 500,
            letterSpacing: "0.02em",
            zIndex: 3,
          }}
        >
          {category}
        </div>
      )}

      <div style={{ position: "absolute", left: 18, right: 12, bottom: 14, zIndex: 3 }}>
        <div
          style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: titleSize,
            fontWeight: 600,
            color: "#F4F1EA",
            letterSpacing: "-0.015em",
            lineHeight: 1.15,
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          {title}
        </div>
        {author && (
          <div
            style={{
              fontSize: labelSize,
              color: "rgba(244, 241, 234, 0.7)",
              marginTop: 4,
              fontStyle: "italic",
            }}
          >
            {author}
          </div>
        )}
      </div>
    </div>
  );
}

export const CodexCover = memo(CodexCoverImpl);
