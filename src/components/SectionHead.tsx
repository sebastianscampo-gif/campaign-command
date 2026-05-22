/* =============================================================================
   UI — SectionHead
   Encabezado de sección brutalista: índice, título, subtítulo y zona derecha.
   ============================================================================= */

import type { ReactNode } from 'react';

interface SectionHeadProps {
  /** Índice o código corto (mono). */
  index?: string;
  title: string;
  sub?: string;
  right?: ReactNode;
}

export function SectionHead({ index, title, sub, right }: SectionHeadProps) {
  return (
    <div className="sechead">
      {index && <span className="sechead__idx mono">{index}</span>}
      <span className="sechead__title">{title}</span>
      {sub && <span className="sechead__sub">{sub}</span>}
      {right && <span className="sechead__right">{right}</span>}
    </div>
  );
}
