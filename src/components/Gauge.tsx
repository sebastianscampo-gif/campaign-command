/* =============================================================================
   UI — Gauge
   Indicador radial para aprobación, momentum y métricas acotadas.
   ============================================================================= */

interface GaugeProps {
  value: number;
  max?: number;
  label?: string;
  /** Color del arco de progreso. Por defecto el acento del tema. */
  color?: string;
  size?: number;
}

const ARC_START = -Math.PI * 1.1;
const ARC_END = Math.PI * 0.1;
const ARC_TOTAL = ARC_END - ARC_START;

export function Gauge({
  value,
  max = 100,
  label,
  color = 'var(--accent)',
  size = 120,
}: GaugeProps) {
  const radius = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;
  const pct = Math.min(1, Math.max(0, value / max));
  const angle = ARC_START + ARC_TOTAL * pct;

  const polar = (a: number, rad: number): [number, number] => [
    cx + Math.cos(a) * rad,
    cy + Math.sin(a) * rad,
  ];

  const arc = (a1: number, a2: number, rad: number): string => {
    const [x1, y1] = polar(a1, rad);
    const [x2, y2] = polar(a2, rad);
    const largeArc = a2 - a1 > Math.PI ? 1 : 0;
    return `M${x1},${y1} A${rad},${rad} 0 ${largeArc} 1 ${x2},${y2}`;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="gauge"
    >
      <path
        d={arc(ARC_START, ARC_END, radius)}
        fill="none"
        className="gauge__track"
        strokeWidth={6}
        strokeLinecap="square"
      />
      <path
        d={arc(ARC_START, angle, radius)}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="square"
      />
      {Array.from({ length: 11 }, (_, i) => {
        const a = ARC_START + ARC_TOTAL * (i / 10);
        const [x1, y1] = polar(a, radius + 5);
        const [x2, y2] = polar(a, radius + 9);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className="gauge__tick"
            strokeWidth={1}
          />
        );
      })}
      <text x={cx} y={cy + 2} textAnchor="middle" className="gauge__value mono">
        {value}
      </text>
      {label && (
        <text
          x={cx}
          y={cy + 22}
          textAnchor="middle"
          className="gauge__label mono"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
