type Props = {
  size?: number;
  color?: string;
  className?: string;
};

export function AvicenaMark({ size = 28, color, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 4 C 12 8 8 14 8 22 C 8 30 14 36 20 36 C 26 36 32 30 32 22 C 32 14 28 8 20 4 Z"
        fill={color ?? "var(--primary, #0B7A65)"}
      />
      <path
        d="M20 10 C 16 13 16 16 20 19 C 24 22 24 25 20 28 C 18 29.5 18 31 20 32"
        stroke="#F4F1EA"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="20" cy="10" r="1.4" fill="#F4F1EA" />
      <path
        d="M13 15 C 11 17 11 20 13 22"
        stroke="#76EBC4"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M27 15 C 29 17 29 20 27 22"
        stroke="#76EBC4"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}
