/* =============================================================================
   SCENE — Headquarters (New Campaign preview)
   ============================================================================= */

const TRACK_A = [38, 32, 28, 30, 26, 24, 25, 22, 21, 20, 19, 18];
const TRACK_B = [20, 22, 24, 23, 26, 27, 28, 30, 31, 33, 34, 36];
const toLine = (vals: readonly number[]): string =>
  vals.map((v, i) => `${i * 9},${v}`).join(' ');

export function HQScene() {
  return (
    <svg viewBox="0 0 360 200" className="cs-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="hq-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10141A" />
          <stop offset="100%" stopColor="#070A0E" />
        </linearGradient>
      </defs>
      <rect width="360" height="200" fill="url(#hq-bg)" />
      <ellipse cx="80" cy="130" rx="80" ry="50" fill="#E6B948" className="cs-glow" />

      <g transform="translate(14 18)">
        <rect width="120" height="86" fill="#E8E1D0" opacity="0.06" stroke="#2A323E" strokeWidth="0.5" />
        <text x="6" y="11" fill="#C9A961" fontSize="5.5" className="cs-led">WAR ROOM · POLL TRACKER</text>
        <g transform="translate(10 20)">
          <polyline points={toLine(TRACK_A)} fill="none" stroke="#5B8FB9" strokeWidth="0.9" />
          <polyline points={toLine(TRACK_B)} fill="none" stroke="#C24A4A" strokeWidth="0.9" />
        </g>
        <text x="6" y="80" fill="#8C95A0" fontSize="5" className="cs-led">D-92 → D-64 · TRACKING</text>
      </g>

      <g transform="translate(150 18)">
        <rect width="90" height="40" fill="#0E1118" stroke="#2A323E" strokeWidth="0.5" />
        <text x="6" y="9" fill="#C9A961" fontSize="5" className="cs-led">SCHEDULE · WK 11</text>
        {['MON · RALLY CA', 'TUE · TV DEBATE', 'WED · DOOR LO', 'THU · FUND. CA'].map((s, i) => (
          <text key={s} x="6" y={17 + i * 7} fill="#E8E6E1" fontSize="5" className="cs-led">{s}</text>
        ))}
        <g transform="translate(0 46)">
          <rect width="90" height="40" fill="#0E1118" stroke="#2A323E" strokeWidth="0.5" />
          <text x="6" y="9" fill="#5E9B7E" fontSize="5" className="cs-led">● CALL TIME · LIVE</text>
          <text x="6" y="19" fill="#E8E6E1" fontSize="5" className="cs-led">DONOR 03 · A. MORENO</text>
          <text x="6" y="27" fill="#8C95A0" fontSize="5" className="cs-led">PLEDGE · $148K</text>
          <g transform="translate(6 33)">
            {Array.from({ length: 30 }, (_, i) => (
              <rect
                key={i}
                x={i * 2.6}
                width="1.5"
                height="6"
                y="-3"
                fill="#5E9B7E"
                className="cs-eq"
                style={{ animationDelay: `${(i % 6) * 0.1}s` }}
              />
            ))}
          </g>
        </g>
      </g>

      <g transform="translate(248 18)">
        <rect width="98" height="86" fill="#0E1118" stroke="#2A323E" strokeWidth="0.5" />
        <text x="6" y="9" fill="#5B8FB9" fontSize="5" className="cs-led">MAP · VOLUNTEERS</text>
        <rect x="10" y="18" width="78" height="58" fill="#0A0D11" stroke="#1F2731" strokeWidth="0.5" />
        <circle cx="40" cy="44" r="2.4" fill="#E6B948" className="cs-blip" />
        <circle cx="62" cy="58" r="2" fill="#5E9B7E" className="cs-blip" style={{ animationDelay: '0.8s' }} />
      </g>

      <rect x="0" y="138" width="360" height="62" fill="#0A0D11" opacity="0.7" />
      <g transform="translate(0 158)">
        {[40, 100, 200, 260, 320].map((x) => (
          <g key={x} transform={`translate(${x} 0)`}>
            <ellipse cx="0" cy="0" rx="9" ry="10" fill="#070A0E" />
            <path d="M -16 26 Q -16 8 0 8 Q 16 8 16 26 Z" fill="#070A0E" />
          </g>
        ))}
      </g>

      <g className="cs-tickerbar">
        <rect x="0" y="186" width="360" height="14" fill="#0A0D11" opacity="0.9" />
        <text y="195" className="cs-ticker-text" fill="#E8E6E1" fontSize="7">
          HQ · STAFF DE 84 PERSONAS · IMPRENTA 12K VOLANTES/H · BUSES 04 RUTAS · DONOR CALLS +18% ·
          ROAD MAP CONFIRMADO ·
        </text>
      </g>

      <text x="8" y="14" fill="#C9A961" fontSize="7" className="cs-hud">● HQ · OFICINA 12</text>
    </svg>
  );
}
