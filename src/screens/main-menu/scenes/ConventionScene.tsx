/* =============================================================================
   SCENE — Convención nacional (Party mode preview)
   ============================================================================= */

import { hash, hashRange } from './rand';

const FACTION_COLORS = ['#5E9B7E', '#C9A961', '#5B8FB9', '#C24A4A'];

const DELEGATES = Array.from({ length: 168 }, (_, i) => {
  const row = i % 7;
  const col = Math.floor(i / 7);
  return {
    x: 30 + (col / 24) * 300 + hashRange(i + 1, -1.5, 1.5),
    y: 112 + row * 11,
    faction: i % 4,
    o: 0.5 + hash(i + 40) * 0.15,
  };
});

export function ConventionScene() {
  return (
    <svg viewBox="0 0 360 200" className="cs-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="conv-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16110A" />
          <stop offset="100%" stopColor="#070A0E" />
        </linearGradient>
      </defs>
      <rect width="360" height="200" fill="url(#conv-bg)" />

      <path
        d="M 180 0 L 200 0 L 260 200 L 100 200 Z"
        fill="#E6B948"
        opacity="0.05"
        className="cs-sweep"
      />

      <g transform="translate(20 20)">
        <rect width="100" height="58" fill="#0E1118" stroke="#2A323E" strokeWidth="0.5" />
        <text x="50" y="14" textAnchor="middle" fill="#C9A961" fontSize="6" className="cs-led">
          VOTACIÓN INTERNA · LISTA 04
        </text>
        <text
          x="50"
          y="40"
          textAnchor="middle"
          fill="#E8E6E1"
          fontSize="20"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          58.41
        </text>
        <text x="50" y="52" textAnchor="middle" fill="#5E9B7E" fontSize="6" className="cs-led">
          QUÓRUM 412/420
        </text>
      </g>

      <g transform="translate(140 20)">
        <rect width="80" height="58" fill="#11161C" stroke="#2A323E" strokeWidth="0.5" />
        <circle cx="40" cy="26" r="10" fill="#0A0D11" />
        <path d="M 22 46 Q 22 31 40 31 Q 58 31 58 46 Z" fill="#0A0D11" />
        <ellipse cx="40" cy="19" rx="16" ry="4" fill="#E6B948" className="cs-halo" />
        <text x="40" y="54" textAnchor="middle" fill="#C9A961" fontSize="5.5" className="cs-led">
          ● ESCENARIO PRINCIPAL
        </text>
      </g>

      <g transform="translate(240 20)">
        <rect width="100" height="58" fill="#0E1118" stroke="#2A323E" strokeWidth="0.5" />
        <text x="8" y="14" fill="#8C95A0" fontSize="6" className="cs-led">FACCIONES</text>
        {[
          { n: 'RENOVADORES', v: 38, c: '#5E9B7E' },
          { n: 'V. GUARDIA', v: 31, c: '#C9A961' },
          { n: 'TERRITORIAL', v: 22, c: '#5B8FB9' },
        ].map((f, i) => (
          <g key={f.n} transform={`translate(8 ${24 + i * 10})`}>
            <text fill="#E8E6E1" fontSize="5.5" className="cs-led">{f.n}</text>
            <rect x="56" y="-4" width="28" height="3" fill="#1F2731" />
            <rect x="56" y="-4" width={f.v * 0.28} height="3" fill={f.c} />
          </g>
        ))}
      </g>

      <g transform="translate(180 90)">
        <rect x="-82" y="-7" width="164" height="12" fill="#9C2A2A" opacity="0.85" />
        <text
          x="0"
          y="2"
          textAnchor="middle"
          fill="#F4E9C8"
          fontSize="6.5"
          style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.3em' }}
        >
          CONVENCIÓN NACIONAL · 2026
        </text>
      </g>

      <g>
        {DELEGATES.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r="1.5" fill={FACTION_COLORS[d.faction]} opacity={d.o} />
        ))}
      </g>

      <g className="cs-tickerbar">
        <rect x="0" y="186" width="360" height="14" fill="#0A0D11" opacity="0.9" />
        <text y="195" className="cs-ticker-text" fill="#E8E6E1" fontSize="7">
          ● CONVENCIÓN · RONDA 03 EN CURSO · RENOVADORES SUMAN 18 DELEGADOS · ALIANZA TERRITORIAL
          EN NEGOCIACIÓN · QUIEBRE LATENTE EN VIEJA GUARDIA ·
        </text>
      </g>

      <text x="8" y="14" fill="#C9A961" fontSize="7" className="cs-hud">● LIVE · SALÓN 04</text>
    </svg>
  );
}
