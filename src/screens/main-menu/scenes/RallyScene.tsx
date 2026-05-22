/* =============================================================================
   SCENE — Rally nacional (Career mode preview)
   SVG estático; el movimiento (focos, lluvia, flashes, ticker) lo aporta CSS.
   ============================================================================= */

import { hash, hashRange } from './rand';

const CROWD = Array.from({ length: 150 }, (_, i) => {
  const row = i % 4;
  const col = Math.floor(i / 4);
  return {
    x: hashRange(i + 1, -2, 2) + (col / 38) * 360,
    y: 132 + row * 13,
    r: 2 + hash(i + 100) * 0.8,
    o: 0.78 - row * 0.07,
  };
});

const FLASHES = Array.from({ length: 9 }, (_, i) => ({
  x: hashRange(i + 7, 24, 332),
  y: hashRange(i + 31, 108, 140),
  delay: hash(i + 53) * 4,
}));

export function RallyScene() {
  return (
    <svg viewBox="0 0 360 200" className="cs-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="rally-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0E1620" />
          <stop offset="65%" stopColor="#1A1410" />
          <stop offset="100%" stopColor="#070A0E" />
        </linearGradient>
        <radialGradient id="rally-spot" cx="50%" cy="0%" r="70%">
          <stop offset="0%" stopColor="#E6B948" stopOpacity="0.34" />
          <stop offset="55%" stopColor="#C9A961" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#070A0E" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="360" height="200" fill="url(#rally-sky)" />

      <g className="cs-flicker">
        <polygon points="130,0 230,0 320,172 40,172" fill="url(#rally-spot)" />
        <polygon points="60,0 110,0 160,170 0,162" fill="url(#rally-spot)" opacity="0.6" />
        <polygon points="250,0 300,0 360,162 200,172" fill="url(#rally-spot)" opacity="0.6" />
      </g>

      <g className="cs-rain">
        {Array.from({ length: 22 }, (_, i) => {
          const x = (i * 17) % 360;
          const y = (i * 29) % 170;
          return (
            <line key={i} x1={x} y1={y} x2={x - 3} y2={y + 16} stroke="#8CA9C2" strokeWidth="0.5" opacity="0.3" />
          );
        })}
      </g>

      <g transform="translate(20 60)">
        <rect width="84" height="20" fill="#11161C" stroke="#2A323E" strokeWidth="0.5" />
        <text x="42" y="13" textAnchor="middle" className="cs-led" fill="#C9A961" fontSize="6.5">
          VASCONCELOS · 2026
        </text>
      </g>

      <rect x="0" y="170" width="360" height="40" fill="#0A0D11" />
      <line x1="0" y1="170" x2="360" y2="170" stroke="#2A2218" strokeWidth="0.5" />

      <g transform="translate(180 130)">
        <rect x="-12" y="20" width="24" height="22" fill="#1A1410" stroke="#2A2218" strokeWidth="0.5" />
        <ellipse cx="0" cy="10" rx="6" ry="7" fill="#0A0D11" />
        <path d="M -10 28 Q -10 14 0 14 Q 10 14 10 28 Z" fill="#0A0D11" />
        <ellipse cx="0" cy="6" rx="14" ry="4" fill="#E6B948" className="cs-halo" />
      </g>

      <g transform="translate(40 92)">
        <line x1="0" y1="0" x2="0" y2="74" stroke="#2A323E" strokeWidth="1" />
        <path d="M 0 0 Q 14 3 28 0 L 28 14 Q 14 17 0 14 Z" fill="#C24A4A" opacity="0.7" className="cs-wave" />
      </g>
      <g transform="translate(320 92)">
        <line x1="0" y1="0" x2="0" y2="74" stroke="#2A323E" strokeWidth="1" />
        <path d="M 0 0 Q -14 3 -28 0 L -28 14 Q -14 17 0 14 Z" fill="#5B8FB9" opacity="0.7" className="cs-wave" />
      </g>

      <g>
        {CROWD.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={c.r} fill="#070A0E" opacity={c.o} />
        ))}
      </g>

      <g>
        {FLASHES.map((f, i) => (
          <circle
            key={i}
            cx={f.x}
            cy={f.y}
            r="5"
            fill="#F4E9C8"
            className="cs-flash"
            style={{ animationDelay: `${f.delay}s` }}
          />
        ))}
      </g>

      <g className="cs-tickerbar">
        <rect x="0" y="186" width="360" height="14" fill="#0A0D11" opacity="0.85" />
        <line x1="0" y1="186" x2="360" y2="186" stroke="#C9A961" strokeWidth="0.4" opacity="0.4" />
        <text y="195" className="cs-ticker-text" fill="#E8E6E1" fontSize="7">
          ● LIVE · AURORA NEWS · VASCONCELOS LIDERA EN COSTA ATLÁNTICA · MNP MOVILIZA EL NORTE ·
          DEBATE NACIONAL EN 72H · MERCADOS REACCIONAN ·
        </text>
      </g>

      <text x="8" y="14" fill="#C9A961" fontSize="7" className="cs-hud">● REC · CAM 03</text>
    </svg>
  );
}
