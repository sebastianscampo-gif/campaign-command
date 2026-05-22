/* =============================================================================
   SCENE — Noche electoral (Election Night preview)
   ============================================================================= */

import { PROVINCES } from '@/content';

const RESULTS = [
  { c: 'PRD', n: 'Vasconcelos', v: 29.4, col: '#5B8FB9' },
  { c: 'MNP', n: 'Orellana', v: 28.1, col: '#C24A4A' },
  { c: 'FAS', n: 'Linares', v: 21.8, col: '#5E9B7E' },
  { c: 'VC', n: 'Salinas', v: 14.2, col: '#C9A961' },
];

export function ElectionNightScene() {
  return (
    <svg viewBox="0 0 360 200" className="cs-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="en-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#180A0A" />
          <stop offset="100%" stopColor="#070A0E" />
        </linearGradient>
      </defs>
      <rect width="360" height="200" fill="url(#en-bg)" />
      <rect width="360" height="200" fill="#C24A4A" className="cs-redwash" />

      <g transform="translate(12 16)">
        <rect width="160" height="100" fill="#0F0809" stroke="#3A1A1A" strokeWidth="0.5" />
        <text x="6" y="11" fill="#C24A4A" fontSize="6" className="cs-led">● LIVE · STUDIO 01</text>
        <rect x="20" y="56" width="120" height="38" fill="#2A1414" />
        <g transform="translate(80 40)">
          <circle r="14" fill="#1A1010" />
          <path d="M -20 30 Q -20 12 0 12 Q 20 12 20 30 Z" fill="#1A1010" />
        </g>
        <rect x="6" y="78" width="148" height="14" fill="#9C2A2A" />
        <text
          x="14"
          y="88"
          fill="#F4E9C8"
          fontSize="6"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
        >
          ESCRUTINIO · 38% MESAS
        </text>
      </g>

      <g transform="translate(184 16)">
        <rect width="164" height="100" fill="#0E0608" stroke="#3A1A1A" strokeWidth="0.5" />
        <text x="6" y="11" fill="#C9A961" fontSize="5.5" className="cs-led">PROYECCIÓN · NACIONAL</text>
        {RESULTS.map((r, i) => (
          <g key={r.c} transform={`translate(0 ${22 + i * 16})`}>
            <rect x="6" width="3" height="12" fill={r.col} />
            <text x="14" y="9" fill="#E8E6E1" fontSize="6" className="cs-led">{r.c} · {r.n}</text>
            <rect x="14" y="10" width="100" height="2" fill="#1F2731" />
            <rect x="14" y="10" width={r.v * 3.2} height="2" fill={r.col} />
            <text x="158" y="9" textAnchor="end" fill="#E8E6E1" fontSize="7" className="cs-led">
              {r.v.toFixed(1)}%
            </text>
          </g>
        ))}
      </g>

      <g transform="translate(12 126)">
        <text x="0" y="-4" fill="#C9A961" fontSize="6" className="cs-led">PROVINCIAS · ESCRUTINIO</text>
        {PROVINCES.map((p, i) => {
          const lean = i / PROVINCES.length;
          return (
            <g key={p.id} transform={`translate(${i * 28} 2)`}>
              <rect width="24" height="42" fill="#0F0608" stroke="#2A1418" strokeWidth="0.4" />
              <rect
                width="24"
                height={42 * (0.3 + lean * 0.6)}
                y={42 - 42 * (0.3 + lean * 0.6)}
                fill="#C24A4A"
                opacity="0.55"
              />
              <text x="12" y="12" textAnchor="middle" fill="#E8E6E1" fontSize="5.5" className="cs-led">
                {p.id}
              </text>
            </g>
          );
        })}
      </g>

      <g className="cs-tickerbar">
        <rect x="0" y="184" width="360" height="16" fill="#9C2A2A" />
        <text
          x="6"
          y="194"
          fill="#F4E9C8"
          fontSize="6"
          style={{ fontWeight: 600, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}
        >
          BREAKING
        </text>
        <text y="194" x="56" className="cs-ticker-text" fill="#F4E9C8" fontSize="6.5">
          PRD ROZA EL UMBRAL · MNP CRECE EN LLANOS · COSTA ATLÁNTICA REPORTA 71% · DISPUTA EN
          SIERRA ANDINA · MARGEN ±0.4% ·
        </text>
      </g>
    </svg>
  );
}
