/* =============================================================================
   UI — StatTile
   Celda de KPI compacta: etiqueta, valor, subtexto y delta opcional. El tono
   semántico se elige por token, no por color hex suelto.
   ============================================================================= */

import type { ReactNode } from 'react';

export type Tone = 'accent' | 'pos' | 'neg' | 'warn' | 'info';

interface StatTileProps {
  label: string;
  value: ReactNode;
  sub?: string;
  /** Variación; controla flecha y color del indicador. */
  delta?: number;
  /** Tipografía monoespaciada para el valor. Por defecto true. */
  mono?: boolean;
  /** Valor en tamaño grande (serif). */
  large?: boolean;
  /** Tono semántico del valor. */
  tone?: Tone;
}

export function StatTile({
  label,
  value,
  sub,
  delta,
  mono = true,
  large = false,
  tone,
}: StatTileProps) {
  const valueClasses = [
    'stat__value',
    mono && 'mono',
    large && 'stat__value--lg',
  ]
    .filter(Boolean)
    .join(' ');

  const hasSub = sub !== undefined || delta !== undefined;

  return (
    <div className="stat">
      <div className="stat__label mono">{label}</div>
      <div className={valueClasses} data-tone={tone}>
        {value}
      </div>
      {hasSub && (
        <div className="stat__sub">
          {delta !== undefined && (
            <span
              className="delta"
              data-dir={delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'}
            >
              {delta > 0 ? '▲' : delta < 0 ? '▼' : '·'}{' '}
              {Math.abs(delta).toFixed(1)}
            </span>
          )}
          {sub && <span className="stat__subtext mono">{sub}</span>}
        </div>
      )}
    </div>
  );
}
