/* =============================================================================
   UI — Panel
   Panel brutalista: borde fino, marcas de esquina en color de acento y cabecera
   opcional con etiqueta/leyenda. Primitivo de contención usado en todas las
   pantallas (en el prototipo se redibujaba a mano una y otra vez).
   ============================================================================= */

import type { ReactNode } from 'react';

interface PanelProps {
  /** Etiqueta principal (mono, color de acento). */
  label?: string;
  /** Leyenda secundaria junto a la etiqueta. */
  caption?: string;
  /** Contenido alineado a la derecha de la cabecera. */
  right?: ReactNode;
  children: ReactNode;
  /** Reduce el padding del cuerpo. */
  dense?: boolean;
  /** Elimina el padding del cuerpo (para mapas, gráficos a sangre). */
  noPad?: boolean;
  /** Resalta el borde del panel con el color de acento. */
  accent?: boolean;
  className?: string;
}

export function Panel({
  label,
  caption,
  right,
  children,
  dense = false,
  noPad = false,
  accent = false,
  className = '',
}: PanelProps) {
  const classes = [
    'panel',
    dense && 'panel--dense',
    accent && 'panel--accent',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hasHead = Boolean(label || right);

  return (
    <div className={classes}>
      <span className="panel__corner panel__corner--tl" aria-hidden="true" />
      <span className="panel__corner panel__corner--tr" aria-hidden="true" />
      <span className="panel__corner panel__corner--bl" aria-hidden="true" />
      <span className="panel__corner panel__corner--br" aria-hidden="true" />

      {hasHead && (
        <div className="panel__head">
          <div className="panel__label">
            {label && <span className="panel__label-text mono">{label}</span>}
            {caption && <span className="panel__caption mono">{caption}</span>}
          </div>
          {right && <div className="panel__head-right">{right}</div>}
        </div>
      )}

      <div className={noPad ? 'panel__body panel__body--nopad' : 'panel__body'}>
        {children}
      </div>
    </div>
  );
}
