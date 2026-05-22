/* =============================================================================
   SCENE — War room digital (Multiplayer preview)
   ============================================================================= */

import { PROVINCES } from '@/content';
import { useGameStore } from '@/state/gameStore';
import type { ProvinceId } from '@/content';

const PLAYERS = [
  { x: 12, y: 16, name: 'P1 · AURORA', col: '#5B8FB9', score: 31 },
  { x: 12, y: 80, name: 'P2 · MIRAGE', col: '#C24A4A', score: 28 },
  { x: 256, y: 16, name: 'P3 · ALTO V.', col: '#5E9B7E', score: 22 },
  { x: 256, y: 80, name: 'P4 · BAHÍA', col: '#C9A961', score: 18 },
];

function leanColor(lean: number): string {
  if (lean > 0.2) return '#C24A4A';
  if (lean < -0.2) return '#5B8FB9';
  return '#C9A961';
}

export function WarRoomScene() {
  const provinces = useGameStore((s) => s.provinces);

  return (
    <svg viewBox="0 0 360 200" className="cs-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="wr-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0B131A" />
          <stop offset="100%" stopColor="#050A0E" />
        </linearGradient>
      </defs>
      <rect width="360" height="200" fill="url(#wr-bg)" />

      <g transform="translate(108 16)">
        <rect width="144" height="100" fill="#0A1218" stroke="#26404E" strokeWidth="0.5" />
        <text x="6" y="10" fill="#5B8FB9" fontSize="5.5" className="cs-led">SHARED MAP · LIVE</text>
        <svg x="8" y="15" width="128" height="80" viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid meet">
          {PROVINCES.map((p) => (
            <polygon
              key={p.id}
              points={p.polygon}
              fill={leanColor(provinces[p.id as ProvinceId].leaning)}
              opacity="0.5"
              stroke="#070A0E"
              strokeWidth="3"
            />
          ))}
          <path
            d="M 285 150 Q 500 295 730 160"
            fill="none"
            stroke="#E6B948"
            strokeWidth="3"
            strokeDasharray="14 10"
            opacity="0.7"
            className="cs-dash"
          />
        </svg>
      </g>

      {PLAYERS.map((p) => (
        <g key={p.name} transform={`translate(${p.x} ${p.y})`}>
          <rect width="92" height="56" fill="#0A1218" stroke="#26404E" strokeWidth="0.5" />
          <rect width="4" height="56" fill={p.col} className="cs-pulse-soft" />
          <text x="10" y="11" fill={p.col} fontSize="5.5" className="cs-led">● {p.name}</text>
          <text x="10" y="30" fill="#E8E6E1" fontSize="14" style={{ fontFamily: 'var(--font-serif)' }}>
            {p.score}%
          </text>
          <polyline
            points={Array.from({ length: 10 }, (_, j) => `${10 + j * 8},${46 - (j % 3) * 3}`).join(' ')}
            fill="none"
            stroke={p.col}
            strokeWidth="0.8"
          />
        </g>
      ))}

      <g transform="translate(108 124)">
        <rect width="144" height="56" fill="#0A1218" stroke="#26404E" strokeWidth="0.5" />
        <text x="6" y="10" fill="#C9A961" fontSize="5.5" className="cs-led">NEGOCIACIÓN · ALIANZA</text>
        <text x="6" y="22" fill="#5B8FB9" fontSize="5.5" className="cs-led">P1 ▸ acepto ceder 2 provincias</text>
        <text x="6" y="33" fill="#C24A4A" fontSize="5.5" className="cs-led">P2 ▸ exijo Costa Atlántica</text>
        <text x="6" y="44" fill="#E8E6E1" fontSize="5.5" className="cs-led cs-typing">P1 ▸ escribiendo…</text>
      </g>

      <text x="8" y="12" fill="#5B8FB9" fontSize="6" className="cs-hud">● WAR ROOM · MP LOBBY 04</text>
      <text x="352" y="12" textAnchor="end" fill="#8C95A0" fontSize="6">PING 41ms · AES-256</text>
    </svg>
  );
}
