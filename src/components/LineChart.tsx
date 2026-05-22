/* =============================================================================
   UI — LineChart
   Gráfico de líneas multi-serie para tendencias de encuestas. Presentacional y
   sin estado: recibe puntos ya normalizados y series con su color.
   ============================================================================= */

export interface ChartSeries {
  /** Clave del valor dentro de cada ChartPoint.values. */
  key: string;
  label: string;
  color: string;
}

export interface ChartPoint {
  /** Etiqueta del eje X. */
  label: string;
  values: Record<string, number>;
}

interface LineChartProps {
  data: readonly ChartPoint[];
  series: readonly ChartSeries[];
  width?: number;
  height?: number;
  padX?: number;
  padY?: number;
}

export function LineChart({
  data,
  series,
  width = 560,
  height = 220,
  padX = 44,
  padY = 24,
}: LineChartProps) {
  if (data.length === 0 || series.length === 0) return null;

  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const allValues = data.flatMap((d) => series.map((s) => d.values[s.key]));
  const max = Math.ceil(Math.max(...allValues) / 5) * 5 + 5;

  const xAt = (i: number): number =>
    padX + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const yAt = (value: number): number =>
    padY + innerH - (value / max) * innerH;

  const gridLines: number[] = [];
  for (let v = 0; v <= max; v += 10) gridLines.push(v);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="linechart"
    >
      <g className="linechart__grid">
        {gridLines.map((v) => (
          <g key={v}>
            <line x1={padX} y1={yAt(v)} x2={padX + innerW} y2={yAt(v)} />
            <text
              x={padX - 8}
              y={yAt(v) + 3}
              textAnchor="end"
              className="linechart__axis mono"
            >
              {v}
            </text>
          </g>
        ))}
      </g>

      <g>
        {data.map((d, i) =>
          i % 2 === 0 || i === data.length - 1 ? (
            <text
              key={d.label}
              x={xAt(i)}
              y={height - 6}
              textAnchor="middle"
              className="linechart__axis mono"
            >
              {d.label}
            </text>
          ) : null,
        )}
      </g>

      {series.map((s) => {
        const pts = data.map(
          (d, i) => [xAt(i), yAt(d.values[s.key])] as const,
        );
        const path = pts
          .map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`)
          .join(' ');
        const last = pts[pts.length - 1];
        return (
          <g key={s.key}>
            <path d={path} fill="none" stroke={s.color} strokeWidth={1.6} />
            {pts.map((p, i) => (
              <circle
                key={i}
                cx={p[0]}
                cy={p[1]}
                r={2.4}
                className="linechart__node"
                stroke={s.color}
                strokeWidth={1.4}
              />
            ))}
            <text
              x={last[0] + 6}
              y={last[1] + 3}
              fill={s.color}
              className="linechart__series-label mono"
            >
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
