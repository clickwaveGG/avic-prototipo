import { AvicenaMark } from "./AvicenaMark";

type Props = {
  size?: number;
  pulsing?: boolean;
  className?: string;
};

export function HipAvatar({ size = 36, pulsing = false, className }: Props) {
  return (
    <div
      className={[
        "av-hip-avatar",
        pulsing ? "av-glow" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <AvicenaMark size={Math.round(size * 0.7)} color="#F4F1EA" />
    </div>
  );
}
