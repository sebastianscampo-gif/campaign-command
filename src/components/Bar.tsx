/* =============================================================================
   UI — Bar
   Barra horizontal para filas de intención de voto, cuotas y porcentajes.
   ============================================================================= */

import type { ReactNode } from 'react';

interface BarProps {
  /** Porcentaje de relleno, 0 … 100. Se acota al rango. */
  pct: number;
  /** Color del relleno. Por defecto el color de acento (vía CSS). */
  color?: string;
  label?: string;
  value?: ReactNode;
  /** Variante de altura reducida. */
  mini?: boolean;
}

export function Bar({ pct, color, label, value, mini = false }: BarProps) {
  const width = Math.max(0, Math.min(100, pct));

  return (
    <div className={mini ? 'bar bar--mini' : 'bar'}>
      {label && <div className="bar__label">{label}</div>}
      <div className="bar__track">
        <div
          className="bar__fill"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
      {value !== undefined && <div className="bar__value mono">{value}</div>}
    </div>
  );
}
