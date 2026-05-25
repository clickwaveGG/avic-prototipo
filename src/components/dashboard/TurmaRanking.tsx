const TURMA_RANKING = [
  { matter: "Cardiologia", you: 47, average: 23, top: 47, position: "1º" },
  { matter: "Patologia", you: 31, average: 19, top: 38, position: "3º" },
  { matter: "Farmacologia", you: 18, average: 12, top: 24, position: "5º" },
  { matter: "Anatomia", you: 9, average: 14, top: 22, position: "12º" },
];

export function TurmaRanking() {
  return (
    <div className="av-card" style={{ padding: 22 }}>
      {TURMA_RANKING.map((r, i) => {
        const pct = Math.min(100, (r.you / r.top) * 100);
        const isLeader = r.position === "1º";
        const isLast = i === TURMA_RANKING.length - 1;
        return (
          <div
            key={r.matter}
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr 80px",
              gap: 16,
              alignItems: "center",
              paddingBottom: isLast ? 0 : 14,
              marginBottom: isLast ? 0 : 14,
              borderBottom: isLast ? "none" : "1px solid var(--bg-elev-2)",
            }}
            className="av-rank-row"
          >
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.matter}</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-faint)" }}>
                {r.you} anamneses
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  height: 8,
                  background: "var(--bg-elev-2)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: isLeader
                      ? "linear-gradient(90deg, var(--accent), var(--brand-soft))"
                      : "var(--brand-soft)",
                    borderRadius: 4,
                    transition: "width 400ms ease-out",
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: `calc(${(r.average / r.top) * 100}% - 1px)`,
                  top: -4,
                  height: 16,
                  width: 2,
                  background: "var(--ink-muted)",
                  opacity: 0.4,
                }}
                aria-hidden="true"
              />
              <div style={{ marginTop: 4, fontSize: 10.5, color: "var(--ink-faint)" }}>
                média da turma: {r.average}
              </div>
            </div>
            <div
              style={{
                textAlign: "right",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontStyle: isLeader ? "italic" : "normal",
                fontSize: 22,
                color: isLeader ? "var(--accent)" : "var(--ink-muted)",
              }}
            >
              {r.position}
            </div>
          </div>
        );
      })}
    </div>
  );
}
