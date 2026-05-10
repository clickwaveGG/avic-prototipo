"use client";

type Props = {
  page: number;
  pageEnd?: number;
  active?: boolean;
  preview?: string;
  onJumpTo?: (page: number) => void;
};

export function Citation({ page, pageEnd, active, preview, onJumpTo }: Props) {
  const label = pageEnd ? `pp. ${page}–${pageEnd}` : `pp. ${page}`;

  return (
    <button
      type="button"
      onClick={() => onJumpTo?.(page)}
      title={preview ?? "Ver no códice"}
      aria-label={`Ver página ${label} do códice`}
      className="av-cite"
      data-active={active ? "true" : undefined}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        aria-hidden="true"
      >
        <path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z" />
        <path d="M4 16a4 4 0 0 1 4-4h12" />
      </svg>
      {label}
    </button>
  );
}
