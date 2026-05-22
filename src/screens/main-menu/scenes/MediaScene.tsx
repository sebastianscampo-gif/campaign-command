/* =============================================================================
   SCENE — Media ecosystem (Media preview)
   ============================================================================= */

const POSTS = [
  { u: '@aurora_news', t: 'Vasconcelos lidera en CA — 11.2k', col: '#5B8FB9' },
  { u: '@_orellana_', t: 'No vamos a ceder el norte.', col: '#C24A4A' },
  { u: '@minutopolitico', t: 'Hilo: por qué el debate fue clave', col: '#C9A961' },
  { u: '@frenteamplio', t: 'Salimos al territorio. Hoy 8pm.', col: '#5E9B7E' },
];

const TRENDS = [
  { t: '#Vasconcelos2026', v: '214k' },
  { t: '#DebateNacional', v: '98k' },
  { t: '#Orellana', v: '72k' },
  { t: '#FrenteAntiCrisis', v: '41k' },
];

const WAVE_COLORS = ['#C24A4A', '#5B8FB9', '#5E9B7E'];

export function MediaScene() {
  return (
    <svg viewBox="0 0 360 200" className="cs-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="me-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F141B" />
          <stop offset="100%" stopColor="#070A0E" />
        </linearGradient>
      </defs>
      <rect width="360" height="200" fill="url(#me-bg)" />

      <g transform="translate(12 16)">
        <rect width="140" height="120" fill="#0F141B" stroke="#26313E" strokeWidth="0.5" />
        <text x="6" y="11" fill="#C9A961" fontSize="5.5" className="cs-led">STREAM · PULSE</text>
        {POSTS.map((p, i) => (
          <g key={p.u} transform={`translate(6 ${20 + i * 24})`}>
            <circle cx="4" cy="6" r="3" fill={p.col} />
            <text x="12" y="6" fill="#E8E6E1" fontSize="5.5" className="cs-led">{p.u}</text>
            <text x="12" y="14" fill="#8C95A0" fontSize="5" className="cs-led">{p.t}</text>
          </g>
        ))}
      </g>

      <g transform="translate(160 16)">
        <rect width="92" height="58" fill="#0E0A0F" stroke="#3A1A1A" strokeWidth="0.5" />
        <text x="6" y="10" fill="#C24A4A" fontSize="5" className="cs-led">● LIVE · AURORA TV</text>
        <g transform="translate(46 30)">
          <circle r="9" fill="#1A1010" />
          <path d="M -14 22 Q -14 8 0 8 Q 14 8 14 22 Z" fill="#1A1010" />
        </g>
        <rect x="6" y="46" width="80" height="8" fill="#9C2A2A" />
        <text x="10" y="52" fill="#F4E9C8" fontSize="4" className="cs-led">DEBATE NACIONAL · 72H</text>
      </g>

      <g transform="translate(258 16)">
        <rect width="88" height="58" fill="#0F141B" stroke="#26313E" strokeWidth="0.5" />
        <text x="6" y="10" fill="#5E9B7E" fontSize="5" className="cs-led">PODCAST · TOP 03</text>
        {['CONTRAPESO', 'RUIDO DE FONDO', 'CAJA NEGRA'].map((s, i) => (
          <g key={s} transform={`translate(6 ${18 + i * 12})`}>
            <rect width="4" height="8" fill="#5E9B7E" />
            <text x="10" y="7" fill="#E8E6E1" fontSize="5" className="cs-led">{s}</text>
          </g>
        ))}
      </g>

      <g transform="translate(160 80)">
        <rect width="186" height="56" fill="#0F141B" stroke="#26313E" strokeWidth="0.5" />
        <text x="6" y="11" fill="#C9A961" fontSize="5" className="cs-led">TENDENCIAS</text>
        {TRENDS.map((tr, i) => (
          <g key={tr.t} transform={`translate(6 ${22 + i * 9})`}>
            <text x="0" y="5" fill="#5A6470" fontSize="5" className="cs-led">
              {String(i + 1).padStart(2, '0')}
            </text>
            <text x="18" y="5" fill="#E8E6E1" fontSize="5.5" className="cs-led">{tr.t}</text>
            <text x="180" y="5" textAnchor="end" fill="#C9A961" fontSize="5" className="cs-led">{tr.v}</text>
          </g>
        ))}
      </g>

      <g transform="translate(12 158)">
        <text x="0" y="-2" fill="#5E9B7E" fontSize="5" className="cs-led">● SENTIMENT · LIVE</text>
        {Array.from({ length: 68 }, (_, i) => (
          <rect
            key={i}
            x={i * 5}
            y="6"
            width="3"
            height="14"
            fill={WAVE_COLORS[i % 3]}
            opacity="0.85"
            className="cs-eq"
            style={{ animationDelay: `${(i % 8) * 0.09}s` }}
          />
        ))}
      </g>

      <text x="8" y="12" fill="#C9A961" fontSize="6" className="cs-hud">MEDIA · ECOSYSTEM 01</text>
    </svg>
  );
}
