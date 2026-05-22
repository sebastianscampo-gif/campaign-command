/* =============================================================================
   UI — Sparkline
   Mini gráfico de línea para tendencias compactas. El color por defecto es
   `currentColor`: hereda el color del texto contenedor en vez de un hex fijo.
   ============================================================================= */

interface SparklineProps {
  data: readonly number[];
  color?: string;
  width?: number;
  height?: number;
  /** Rellena el área bajo la línea. */
  fill?: boolean;
  /** Dibuja un punto en cada dato. */
  dots?: boolean;
  /** Dibuja una línea de base a media altura. */
  baseline?: boolean;
}

export function Sparkline({
  data,
  color = 'currentColor',
  width = 180,
  height = 44,
  fill = false,
  dots = false,
  baseline = false,
}: SparklineProps) {
  if (data.length === 0) return null;

  const min = Math.min(...data) - 1;
  const max = Math.max(...data) + 1;
  const range = max - min || 1;

  const points = data.map((value, i) => {
    const x = data.length === 1 ? width / 2 : (i / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return [x, y] as const;
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`)
    .join(' ');
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="sparkline"
    >
      {baseline && (
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          className="sparkline__baseline"
        />
      )}
      {fill && <path d={areaPath} fill={color} opacity={0.1} />}
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.4} />
      {dots &&
        points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={1.6} fill={color} />
        ))}
    </svg>
  );
}
