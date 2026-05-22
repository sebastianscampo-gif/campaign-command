/* =============================================================================
   ELECTION NIGHT — BigElectionMap
   Mapa nacional de la noche electoral. SVG estático; los pulsos de provincias
   en disputa y de la capital son animación CSS.
   ============================================================================= */

import { PROVINCES } from '@/content';
import { useGameStore } from '@/state/gameStore';
import { reportedPercent } from './electionData';

const CAPITAL = PROVINCES.find((p) => p.isCapital);

function winnerColor(leaning: number): string {
  if (leaning > 0.2) return '#C24A4A';
  if (leaning < -0.2) return '#5B8FB9';
  return '#5E9B7E';
}

export function BigElectionMap() {
  const provinces = useGameStore((s) => s.provinces);

  return (
    <svg viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid meet" className="bigmap__svg">
      <defs>
        <radialGradient id="bem-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1A2230" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#060A0E" stopOpacity="0" />
        </radialGradient>
        <pattern id="bem-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 L0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect width="1000" height="720" fill="url(#bem-grid)" />
      <rect width="1000" height="720" fill="url(#bem-glow)" />

      {PROVINCES.map((geo) => {
        const reported = reportedPercent(geo.id);
        const called = reported >= 92;
        const toss = reported >= 50 && reported < 92;
        const fill = reported < 20 ? '#1F2731' : winnerColor(provinces[geo.id].leaning);
        return (
          <g key={geo.id}>
            <polygon
              points={geo.polygon}
              fill={fill}
              fillOpacity={0.3 + (reported / 100) * 0.55}
              stroke={called ? '#F4E9C8' : '#070A0E'}
              strokeWidth={called ? 1.5 : 1}
            />
            {toss && (
              <polygon points={geo.polygon} className="bigmap__toss" fill="none" />
            )}
          </g>
        );
      })}

      <g>
        {PROVINCES.map((geo) => (
          <g key={geo.id}>
            <text
              x={geo.labelAt[0]}
              y={geo.labelAt[1]}
              textAnchor="middle"
              className="bigmap__label"
            >
              {geo.name.toUpperCase()}
            </text>
            <text
              x={geo.labelAt[0]}
              y={geo.labelAt[1] + 14}
              textAnchor="middle"
              className="bigmap__label-pct mono"
            >
              {reportedPercent(geo.id)}%
            </text>
          </g>
        ))}
      </g>

      {CAPITAL && (
        <g transform={`translate(${CAPITAL.labelAt[0]} ${CAPITAL.labelAt[1]})`}>
          <circle r="6" fill="#F4E9C8" />
          <circle r="14" fill="none" stroke="#F4E9C8" strokeWidth="1.2" className="bigmap__cap" />
          <text y="-22" textAnchor="middle" className="bigmap__cap-label mono">
            ★ {CAPITAL.capital.toUpperCase()} · CAPITAL
          </text>
        </g>
      )}
    </svg>
  );
}
