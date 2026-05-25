import { CodexCover } from "@/components/avicena";

const RECENT_CODICES = [
  { title: "Porto Semiologia", category: "Cardio", author: "Porto · 8ª ed", pages: 1247, last: "23:04", cathedra: true },
  { title: "Robbins Patologia", category: "Patologia", author: "Kumar · 10ª ed", pages: 1480, last: "ontem", cathedra: true },
  { title: "Goodman & Gilman", category: "Farma", author: "13ª ed", pages: 1808, last: "qua", cathedra: false },
  { title: "Tratado Cardiologia SBC", category: "Cardio", author: "SBC · 2ª ed", pages: 912, last: "4 dias", cathedra: false },
  { title: "Diretriz IC 2022", category: "Cardio", author: "AHA/SBC", pages: 124, last: "1 sem", cathedra: false },
];

export function RecentCodices() {
  return (
    <div className="av-dash-codices">
      {RECENT_CODICES.map((c) => (
        <div key={c.title} className="av-codex-card">
          <CodexCover
            title={c.title}
            category={c.category}
            author={c.author}
            size="md"
            cathedra={c.cathedra}
          />
          <div style={{ paddingTop: 10 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {c.title}
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: "var(--ink-faint)",
                marginTop: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{c.pages}p</span>
              <span>{c.last}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
