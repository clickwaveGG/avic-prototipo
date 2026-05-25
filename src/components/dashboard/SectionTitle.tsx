import type { ReactNode } from "react";

export function SectionTitle({
  title,
  right,
}: {
  title: string;
  right?: ReactNode;
}) {
  return (
    <div
      style={{
        marginTop: 36,
        marginBottom: 14,
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          color: "var(--ink-muted)",
        }}
      >
        {title}
      </div>
      {right ? (
        <div style={{ fontSize: 11.5, color: "var(--ink-faint)" }}>{right}</div>
      ) : null}
    </div>
  );
}
