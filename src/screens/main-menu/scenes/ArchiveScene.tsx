/* =============================================================================
   SCENE — Archivo histórico (Historical Scenarios preview)
   ============================================================================= */

import { hashRange } from './rand';

const DUST = Array.from({ length: 16 }, (_, i) => ({
  x: hashRange(i + 1, 0, 360),
  y: hashRange(i + 20, 10, 190),
  delay: hashRange(i + 40, 0, 6),
}));

export function ArchiveScene() {
  return (
    <svg viewBox="0 0 360 200" className="cs-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="arc-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A140C" />
          <stop offset="100%" stopColor="#0A0805" />
        </linearGradient>
      </defs>
      <rect width="360" height="200" fill="url(#arc-bg)" />
      <rect width="360" height="200" fill="#C9A961" opacity="0.05" />

      <g className="cs-perf">
        {Array.from({ length: 20 }, (_, i) => (
          <rect key={`t${i}`} x={i * 20} y="2" width="10" height="6" fill="#0A0805" stroke="#4A3A24" strokeWidth="0.3" />
        ))}
        {Array.from({ length: 20 }, (_, i) => (
          <rect key={`b${i}`} x={i * 20} y="192" width="10" height="6" fill="#0A0805" stroke="#4A3A24" strokeWidth="0.3" />
        ))}
      </g>

      <g transform="translate(18 24)">
        <rect width="140" height="100" rx="8" fill="#1A140C" stroke="#3D2F1A" strokeWidth="1" />
        <rect x="6" y="6" width="128" height="88" rx="4" fill="#0E1A0E" className="cs-crt" />
        <g transform="translate(70 52)">
          <circle r="14" fill="#1F2A1F" />
          <path d="M -20 38 Q -20 16 0 16 Q 20 16 20 38 Z" fill="#1F2A1F" />
          <rect x="-30" y="32" width="60" height="14" fill="#9C2A2A" opacity="0.7" />
          <text x="0" y="41" textAnchor="middle" fill="#F4E9C8" fontSize="5" className="cs-led">
            NOTICIERO · 1989
          </text>
        </g>
        <rect x="6" y="6" width="128" height="2" fill="#E6B948" opacity="0.25" className="cs-scanline" />
      </g>

      <g transform="translate(176 20) rotate(-3)">
        <rect width="168" height="120" fill="#D9CDA8" stroke="#6A5A40" strokeWidth="0.4" />
        <text
          x="8"
          y="15"
          fill="#2A1F14"
          fontSize="8"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, letterSpacing: '0.18em' }}
        >
          EL ESTANDARTE
        </text>
        <line x1="8" y1="19" x2="160" y2="19" stroke="#2A1F14" strokeWidth="0.4" />
        <text x="8" y="26" fill="#5A4A30" fontSize="4" className="cs-led">
          VIERNES · 12 · DIC · 1989 · ED. EXTRAORDINARIA
        </text>
        <text x="8" y="44" fill="#2A1F14" fontSize="11" style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>
          CAEN LAS URNAS:
        </text>
        <text x="8" y="56" fill="#2A1F14" fontSize="11" style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>
          TRANSICIÓN ABIERTA
        </text>
        <g fill="#3A2D1E" fontSize="4.2" style={{ fontFamily: 'var(--font-serif)' }}>
          <text x="8" y="68">El consejo aceptó por unanimidad el llamado a</text>
          <text x="8" y="74">elecciones generales, marcando el fin del régimen</text>
          <text x="8" y="80">militar instaurado tras el golpe de 1953.</text>
        </g>
        <rect x="8" y="88" width="74" height="26" fill="#A89A7C" opacity="0.7" />
      </g>

      <g>
        {DUST.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r="0.7"
            fill="#C9A961"
            className="cs-dust"
            style={{ animationDelay: `${d.delay}s` }}
          />
        ))}
      </g>

      <text x="8" y="14" fill="#C9A961" fontSize="6" className="cs-hud">ARCHIVO · 1953-2024</text>
      <text x="352" y="14" textAnchor="end" fill="#C9A961" fontSize="6">18 ESCENARIOS</text>
    </svg>
  );
}
