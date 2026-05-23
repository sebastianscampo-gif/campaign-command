/* =============================================================================
   MAP — WarMap
   Lienzo SVG del war room. Provincias coloreadas por el overlay activo más
   capas decorativas. Todo el movimiento (nubes, radar, pulsos, caravana,
   sendero de campaña) es CSS: el mapa no re-renderiza por frame.
   ============================================================================= */

import { memo, useMemo } from 'react';
import {
  CITIES,
  MEDIA_HUBS,
  PROVINCES,
  RALLIES,
  TOUR_PROVINCES,
} from '@/content';
import type { ProvinceId } from '@/content';
import { useGameStore } from '@/state/gameStore';
import { nationalTension } from '@/sim';
import { provinceColor } from './mapConfig';
import type { LayerState, OverlayId } from './mapConfig';

interface WarMapProps {
  overlay: OverlayId;
  zoom: number;
  layers: LayerState;
  selected: ProvinceId | null;
  onSelect: (id: ProvinceId) => void;
  onHover: (id: ProvinceId | null) => void;
}

/** Path SVG del tour de campaña, construido en módulo (estable, no re-render). */
const TOUR_POINTS = TOUR_PROVINCES.map((id) => {
  const geo = PROVINCES.find((p) => p.id === id);
  return geo ? geo.labelAt : ([500, 360] as const);
});
const TOUR_D = TOUR_POINTS.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt[0]} ${pt[1]}`).join(' ');

const CAPITAL = PROVINCES.find((p) => p.isCapital);

function WarMapInner({ overlay, zoom, layers, selected, onSelect, onHover }: WarMapProps) {
  // Suscripción de grano fino — solo re-renderiza cuando cambia `provinces`,
  // no cuando se cambia de día por otra razón, ni cuando hace hover.
  const provinces = useGameStore((s) => s.provinces);

  // Tensión derivada del estado del game store. Memoizada para no recalcular
  // sobre cada render del mapa.
  const snapshotTension = useGameStore(nationalTension);
  const tension = snapshotTension;

  // Pre-calcular colores y swing state por provincia. Estable mientras
  // `provinces` y `overlay` no cambien.
  const tiles = useMemo(
    () =>
      PROVINCES.map((geo) => {
        const state = provinces[geo.id];
        const values = Object.values(state.intent).sort((a, b) => b - a);
        const firstValue = values[0] ?? 0;
        const secondValue = values[1] ?? 0;
        return {
          geo,
          fill: provinceColor(geo, state, overlay),
          isSwing: firstValue - secondValue < 4,
        };
      }),
    [provinces, overlay],
  );

  const showCities = zoom > 1.3 || layers.cities;
  const showMedia = overlay === 'media' || layers.media;

  return (
    <svg
      viewBox="0 0 1000 720"
      preserveAspectRatio="xMidYMid meet"
      className="warmap"
      style={{ transform: `scale(${zoom})` }}
    >
      <defs>
        <pattern id="warmap-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 L0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="warmap-radial" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#1A2230" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#070A0E" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="warmap-tension" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#C24A4A" stopOpacity="0" />
          <stop offset="100%" stopColor="#C24A4A" stopOpacity={tension * 0.18} />
        </radialGradient>
        <linearGradient id="warmap-cloud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1F2731" stopOpacity="0" />
          <stop offset="50%" stopColor="#1F2731" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#1F2731" stopOpacity="0" />
        </linearGradient>
      </defs>

      {layers.grid && <rect width="1000" height="720" fill="url(#warmap-grid)" />}
      <rect width="1000" height="720" fill="url(#warmap-radial)" />

      <g stroke="#1F2630" strokeWidth="0.6">
        {[180, 360, 540].map((y) => (
          <line key={y} x1="0" y1={y} x2="1000" y2={y} />
        ))}
        {[200, 400, 600, 800].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="720" />
        ))}
      </g>

      <g className="warmap__ticks mono">
        {['12°N', '14°N', '16°N', '18°N'].map((t, i) => (
          <text key={t} x="8" y={180 + i * 180 - 4}>
            {t}
          </text>
        ))}
      </g>

      {layers.hydro && (
        <g className="warmap__hydro" fill="none">
          <path d="M 200 100 Q 300 200 400 280 T 600 360 T 850 540" />
          <path d="M 500 295 Q 540 380 600 540" />
          <path d="M 280 360 Q 320 460 390 540" />
        </g>
      )}

      {layers.infra && (
        <g className="warmap__infra" fill="none" strokeDasharray="3 2">
          <path d="M 200 225 L 500 295 L 790 95" />
          <path d="M 500 295 L 720 640" />
          <path d="M 500 295 L 270 640" />
        </g>
      )}

      <g>
        {tiles.map(({ geo, fill, isSwing }) => (
          <g key={geo.id}>
            <polygon
              points={geo.polygon}
              className="warmap__province"
              data-selected={geo.id === selected}
              fill={fill}
              onClick={() => onSelect(geo.id)}
              onMouseEnter={() => onHover(geo.id)}
            />
            {isSwing && (
              <polygon points={geo.polygon} className="warmap__swing" fill="none" />
            )}
          </g>
        ))}
      </g>

      <rect width="1000" height="720" fill="url(#warmap-tension)" pointerEvents="none" />

      <g className="warmap__clouds" pointerEvents="none">
        {[60, 280, 500].map((y, i) => (
          <g key={y} className="warmap__cloud" style={{ animationDelay: `${i * -14}s` }}>
            <ellipse cx="120" cy={y} rx="180" ry="22" fill="url(#warmap-cloud)" />
            <ellipse cx="200" cy={y + 8} rx="120" ry="14" fill="url(#warmap-cloud)" opacity="0.6" />
          </g>
        ))}
      </g>

      {showMedia && (
        <g pointerEvents="none">
          {MEDIA_HUBS.map((hub, i) => (
            <g key={`${hub[0]}-${hub[1]}`}>
              <circle
                cx={hub[0]}
                cy={hub[1]}
                className="warmap__ripple"
                fill="none"
                stroke="#9C7BD9"
                strokeWidth="1"
                style={{ animationDelay: `${i * 1.3}s` }}
              />
              <circle cx={hub[0]} cy={hub[1]} r="3" fill="#9C7BD9" />
            </g>
          ))}
        </g>
      )}

      <g className="warmap__labels" pointerEvents="none">
        {PROVINCES.map((geo) => (
          <g key={geo.id}>
            <text x={geo.labelAt[0]} y={geo.labelAt[1]} textAnchor="middle" className="warmap__label">
              {geo.name.toUpperCase()}
            </text>
            <text
              x={geo.labelAt[0]}
              y={geo.labelAt[1] + 14}
              textAnchor="middle"
              className="warmap__label-cap mono"
            >
              {geo.capital}
            </text>
          </g>
        ))}
      </g>

      {CAPITAL && (
        <g transform={`translate(${CAPITAL.labelAt[0]} ${CAPITAL.labelAt[1]})`} pointerEvents="none">
          <g className="warmap__capring">
            <circle r="18" fill="none" stroke="#C9A961" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.5" />
            <circle r="22" fill="none" stroke="#C9A961" strokeWidth="0.4" strokeDasharray="1 7" opacity="0.3" />
          </g>
          <circle r="5" fill="#C9A961" />
          <circle r="11" fill="none" stroke="#C9A961" strokeWidth="1.2" className="warmap__cappulse" />
          <text y="-30" textAnchor="middle" className="warmap__capmark mono">
            ★ {CAPITAL.capital.toUpperCase()} · CAPITAL
          </text>
        </g>
      )}

      {showCities && (
        <g pointerEvents="none">
          {CITIES.map((city) => (
            <g key={city.name} transform={`translate(${city.position[0]} ${city.position[1]})`}>
              <circle r="2.4" fill="#F4E9C8" stroke="#0A0D11" strokeWidth="0.5" />
              {zoom > 1.6 && (
                <>
                  <text y="-6" textAnchor="middle" className="warmap__city mono">
                    {city.name}
                  </text>
                  <text y="-15" textAnchor="middle" className="warmap__city-pop mono">
                    {city.population}
                  </text>
                </>
              )}
            </g>
          ))}
        </g>
      )}

      {layers.paths && (
        <g pointerEvents="none">
          <path d={TOUR_D} className="warmap__tour" fill="none" />
          <circle r="3.4" className="warmap__caravan" fill="#F4E9C8" style={{ offsetPath: `path('${TOUR_D}')` }} />
          {TOUR_POINTS.map((pt, i) => (
            <circle key={`${pt[0]}-${pt[1]}-${i}`} cx={pt[0]} cy={pt[1]} r="2.2" fill="#C9A961" />
          ))}
        </g>
      )}

      {layers.rallies && (
        <g pointerEvents="none">
          {RALLIES.map((rally) => (
            <g key={rally.label} transform={`translate(${rally.position[0]} ${rally.position[1]})`}>
              <line x1="0" y1="0" x2="0" y2="14" stroke="#C9A961" strokeWidth="1" />
              <polygon points="0,-2 8,2 0,6" fill="#C9A961" />
              <circle cy="14" r="2" fill="#C9A961" />
              <circle cy="14" r="7" fill="none" stroke="#C9A961" strokeWidth="0.7" className="warmap__rallypulse" />
              {rally.big && (
                <g transform="translate(12 -4)">
                  <rect width="92" height="16" fill="#0A0D11" stroke="#C9A961" strokeWidth="0.4" opacity="0.92" />
                  <text x="5" y="7" className="warmap__rally-name mono">RALLY · {rally.label}</text>
                  <text x="5" y="13" className="warmap__rally-when mono">{rally.when}</text>
                </g>
              )}
            </g>
          ))}
        </g>
      )}

      {layers.crises && (
        <g pointerEvents="none">
          {PROVINCES.filter((geo) => provinces[geo.id].crisis >= 5).map((geo) => (
            <g key={geo.id} transform={`translate(${geo.labelAt[0] - 32} ${geo.labelAt[1] - 4})`}>
              <circle r="13" fill="none" stroke="#C24A4A" strokeWidth="1.4" className="warmap__crisis" />
              <polygon points="0,-6 6,4 -6,4" fill="#C24A4A" stroke="#0A0D11" strokeWidth="0.4" />
              <text y="20" textAnchor="middle" className="warmap__crisis-label mono">
                ⚠ CRISIS L{provinces[geo.id].crisis >= 7 ? '3' : '2'}
              </text>
            </g>
          ))}
        </g>
      )}

      <g transform="translate(936 96)" className="warmap__radar" pointerEvents="none">
        <circle r="22" fill="none" stroke="#3A4350" strokeWidth="0.6" />
        <circle r="14" fill="none" stroke="#3A4350" strokeWidth="0.4" />
        <line x1="0" y1="0" x2="22" y2="0" stroke="#C9A961" strokeWidth="1" className="warmap__radar-arm" />
        <circle r="1.5" fill="#C9A961" />
      </g>

      <g transform="translate(44 668)" className="warmap__scale mono" pointerEvents="none">
        <line x1="0" y1="0" x2="160" y2="0" stroke="#C9A961" strokeWidth="1.4" />
        <line x1="0" y1="-4" x2="0" y2="4" stroke="#C9A961" strokeWidth="1" />
        <line x1="160" y1="-4" x2="160" y2="4" stroke="#C9A961" strokeWidth="1" />
        <text x="0" y="16">0</text>
        <text x="160" y="16" textAnchor="middle">200 km</text>
      </g>
    </svg>
  );
}

/** Memoizado: el WarMap solo re-renderiza cuando overlay/zoom/layers/selected o
 *  los handlers cambian. El hover de provincia (que vive en MapScreen state)
 *  no causa re-render mientras los callbacks sean estables (`useCallback`). */
export const WarMap = memo(WarMapInner);
