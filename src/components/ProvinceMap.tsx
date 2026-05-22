/* =============================================================================
   UI — ProvinceMap
   Primitivo de mapa SVG. El prototipo redibujaba el mapa de provincias desde
   cero en seis pantallas distintas; aquí es un único componente controlado.
   Es presentacional: la coloración la decide quien lo usa, vía `fillOf`.
   ============================================================================= */

import { MAP_VIEWBOX, PROVINCES } from '@/content';
import type { ProvinceId } from '@/content';

interface ProvinceMapProps {
  /** Devuelve el color de relleno de cada provincia. */
  fillOf?: (id: ProvinceId) => string;
  selected?: ProvinceId | null;
  onSelect?: (id: ProvinceId) => void;
  onHover?: (id: ProvinceId | null) => void;
  showLabels?: boolean;
  showGrid?: boolean;
  className?: string;
}

export function ProvinceMap({
  fillOf,
  selected = null,
  onSelect,
  onHover,
  showLabels = true,
  showGrid = false,
  className = '',
}: ProvinceMapProps) {
  const interactive = Boolean(onSelect);

  return (
    <svg
      viewBox={MAP_VIEWBOX}
      className={['provincemap', className].filter(Boolean).join(' ')}
      role="img"
      aria-label="Mapa de provincias de San Esteban"
    >
      {showGrid && <ProvinceGrid />}

      {PROVINCES.map((geo) => (
        <polygon
          key={geo.id}
          points={geo.polygon}
          className="provincemap__province"
          data-selected={geo.id === selected}
          data-interactive={interactive}
          fill={fillOf ? fillOf(geo.id) : 'var(--bg-elev)'}
          onClick={onSelect ? () => onSelect(geo.id) : undefined}
          onMouseEnter={onHover ? () => onHover(geo.id) : undefined}
          onMouseLeave={onHover ? () => onHover(null) : undefined}
        />
      ))}

      {showLabels &&
        PROVINCES.map((geo) => (
          <text
            key={geo.id}
            x={geo.labelAt[0]}
            y={geo.labelAt[1]}
            textAnchor="middle"
            className="provincemap__label mono"
          >
            {geo.id}
            {geo.isCapital && (
              <tspan className="provincemap__capital"> ★</tspan>
            )}
          </text>
        ))}
    </svg>
  );
}

function ProvinceGrid() {
  const verticals = Array.from({ length: 9 }, (_, i) => (i + 1) * 100);
  const horizontals = Array.from({ length: 6 }, (_, i) => (i + 1) * 100);

  return (
    <g className="provincemap__grid" aria-hidden="true">
      {verticals.map((x) => (
        <line key={`v${x}`} x1={x} y1={0} x2={x} y2={720} />
      ))}
      {horizontals.map((y) => (
        <line key={`h${y}`} x1={0} y1={y} x2={1000} y2={y} />
      ))}
    </g>
  );
}
