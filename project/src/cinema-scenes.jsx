/* =========================================================================
   CAMPAIGN COMMAND — Cinematic scenes
   Reusable “living mockup” panels for the main menu mode previews.
   Each scene is an SVG composition driven by `tick` (continuous time).
   ========================================================================= */

const { useMemo: useMemoCS } = React;

/* ------------------------------------------------------------------------- */
/*  RALLY SCENE — Career mode                                                */
/*  Crowd silhouettes + spotlights + flashes + ticker + flag                 */
/* ------------------------------------------------------------------------- */
function RallyScene({ tick, small=false }) {
  // crowd dots — deterministic
  const crowd = useMemoCS(() => {
    const out = [];
    for (let row = 0; row < 5; row++) {
      const y = 130 + row * 14;
      const count = 70 + row * 8;
      for (let i = 0; i < count; i++) {
        const x = (i / count) * 360 + (Math.random() - 0.5) * 4;
        out.push({ x, y, r: 2.2 + Math.random()*0.6, row, phase: Math.random()*9 });
      }
    }
    return out;
  }, []);
  const flashes = useMemoCS(() => Array.from({length:10}).map(() => ({
    x: 30 + Math.random()*300, y: 110 + Math.random()*30,
    phase: Math.random()*8, every: 4 + Math.random()*5,
  })), []);

  return (
    <svg viewBox="0 0 360 200" className="cs-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="rally-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0E1620"/>
          <stop offset="65%" stopColor="#1A1410"/>
          <stop offset="100%" stopColor="#070A0E"/>
        </linearGradient>
        <radialGradient id="rally-spot" cx="50%" cy="0%" r="70%">
          <stop offset="0%" stopColor="#E6B948" stopOpacity={0.32+Math.sin(tick*1.3)*0.04}/>
          <stop offset="55%" stopColor="#C9A961" stopOpacity="0.05"/>
          <stop offset="100%" stopColor="#070A0E" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="rally-stage" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1F1A12"/>
          <stop offset="100%" stopColor="#0A0D11"/>
        </linearGradient>
        <linearGradient id="rally-rain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5B8FB9" stopOpacity="0"/>
          <stop offset="50%" stopColor="#8CA9C2" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#5B8FB9" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* sky */}
      <rect x="0" y="0" width="360" height="200" fill="url(#rally-sky)"/>
      {/* big spotlights from above */}
      <polygon points={`130,0 230,0 320,${170+Math.sin(tick)*4} 40,${170+Math.sin(tick*1.1)*4}`}
        fill="url(#rally-spot)"/>
      <polygon points={`60,0 110,0 160,${170+Math.sin(tick*1.2)*4} 0,${160+Math.sin(tick*1.4)*4}`}
        fill="url(#rally-spot)" opacity="0.6"/>
      <polygon points={`250,0 300,0 360,${160+Math.sin(tick*0.9)*4} 200,${170+Math.sin(tick*1.5)*4}`}
        fill="url(#rally-spot)" opacity="0.6"/>

      {/* rain streaks */}
      <g opacity="0.35">
        {Array.from({length:36}).map((_,i)=>{
          const x = (i*11 + (tick*40)%11) % 360;
          const y0 = ((i*23 + tick*120) % 200);
          return <line key={i} x1={x} y1={y0} x2={x-3} y2={y0+18} stroke="url(#rally-rain)" strokeWidth="0.5"/>;
        })}
      </g>

      {/* distant city LED panel */}
      <g transform="translate(20 60)">
        <rect width="80" height="22" fill="#11161C" stroke="#2A323E" strokeWidth="0.5"/>
        <text x="40" y="14" textAnchor="middle" fill="#C9A961" fontSize="7"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.18em'}}>
          VASCONCELOS · 2026
        </text>
      </g>
      <g transform="translate(260 50)">
        <rect width="80" height="14" fill="#11161C" stroke="#2A323E" strokeWidth="0.5"/>
        <text x="40" y="10" textAnchor="middle" fill="#5B8FB9" fontSize="6"
          style={{fontFamily:'IBM Plex Mono, monospace'}}>
          PRD · CENTRO-IZQUIERDA
        </text>
      </g>

      {/* stage */}
      <rect x="0" y="170" width="360" height="40" fill="url(#rally-stage)"/>
      <line x1="0" y1="170" x2="360" y2="170" stroke="#2A2218" strokeWidth="0.5"/>
      {/* podium with figure */}
      <g transform="translate(180 130)">
        {/* podium */}
        <rect x="-12" y="20" width="24" height="22" fill="#1A1410" stroke="#2A2218" strokeWidth="0.5"/>
        {/* candidate silhouette */}
        <ellipse cx="0" cy="10" rx="6" ry="7" fill="#0A0D11"/>
        <path d="M -10 28 Q -10 14 0 14 Q 10 14 10 28 Z" fill="#0A0D11"/>
        {/* halo */}
        <ellipse cx="0" cy="6" rx="14" ry="4" fill="#E6B948" opacity={0.10+Math.sin(tick*2)*0.04}/>
      </g>

      {/* flag (subtle wave) */}
      <g transform="translate(40 90)">
        <line x1="0" y1="0" x2="0" y2="76" stroke="#2A323E" strokeWidth="1"/>
        <path d={`M 0 0 Q 14 ${2+Math.sin(tick*1.6)*2} 28 0 L 28 14 Q 14 ${16+Math.sin(tick*1.6+1)*2} 0 14 Z`}
          fill="#C24A4A" opacity="0.7"/>
        <path d={`M 0 16 Q 14 ${18+Math.sin(tick*1.6+0.6)*2} 28 16 L 28 30 Q 14 ${32+Math.sin(tick*1.6+1.5)*2} 0 30 Z`}
          fill="#E8E6E1" opacity="0.7"/>
      </g>
      <g transform="translate(320 90)">
        <line x1="0" y1="0" x2="0" y2="76" stroke="#2A323E" strokeWidth="1"/>
        <path d={`M 0 0 Q -14 ${2+Math.sin(tick*1.6+0.8)*2} -28 0 L -28 14 Q -14 ${16+Math.sin(tick*1.6+1.4)*2} 0 14 Z`}
          fill="#5B8FB9" opacity="0.7"/>
      </g>

      {/* crowd silhouettes (heads) */}
      <g>
        {crowd.map((c,i) => (
          <circle key={i}
            cx={c.x + Math.sin(tick + c.phase)*0.6}
            cy={c.y + Math.sin(tick*0.9 + c.phase)*0.4}
            r={c.r}
            fill="#070A0E"
            opacity={0.75 - c.row*0.06}/>
        ))}
      </g>

      {/* camera flashes */}
      <g>
        {flashes.map((f,i)=>{
          const t = ((tick + f.phase) % f.every) / f.every;
          const on = t < 0.05;
          return (
            <g key={i}>
              <circle cx={f.x} cy={f.y} r={on?5:0} fill="#F4E9C8" opacity={on?0.9:0}/>
              <circle cx={f.x} cy={f.y} r={on?12:0} fill="#F4E9C8" opacity={on?0.15:0}/>
            </g>
          );
        })}
      </g>

      {/* ticker bottom */}
      <g>
        <rect x="0" y="186" width="360" height="14" fill="#0A0D11" opacity="0.85"/>
        <line x1="0" y1="186" x2="360" y2="186" stroke="#C9A961" strokeWidth="0.4" opacity="0.4"/>
        <text x={360 - ((tick*40) % 700)} y="195" fill="#E8E6E1" fontSize="7"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.14em'}}>
          ● LIVE  AURORA NEWS · VASCONCELOS LIDERA EN COSTA ATLÁNTICA · MNP MOVILIZA EL NORTE · DEBATE NACIONAL EN 72h · MERCADOS REACCIONAN ·
        </text>
      </g>

      {/* HUD overlay corners */}
      <g style={{fontFamily:'IBM Plex Mono, monospace'}}>
        <text x="8" y="14" fill="#C9A961" fontSize="7" letterSpacing="0.2em">● REC · CAM 03</text>
        <text x="352" y="14" textAnchor="end" fill="#8C95A0" fontSize="7" letterSpacing="0.16em">
          {(tick*10|0).toString().padStart(6,'0')} · ISO 1600 · f/1.4
        </text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/*  CONVENTION SCENE — Party mode                                            */
/* ------------------------------------------------------------------------- */
function ConventionScene({ tick }) {
  const delegates = useMemoCS(() => {
    const out = [];
    for (let row = 0; row < 7; row++) {
      const y = 110 + row * 11;
      const count = 30;
      for (let i = 0; i < count; i++) {
        out.push({
          x: 30 + (i / count) * 300 + (Math.random()-0.5)*3,
          y, phase: Math.random()*6,
          faction: i % 4,
        });
      }
    }
    return out;
  }, []);
  const factionColors = ['#5E9B7E','#C9A961','#5B8FB9','#C24A4A'];

  return (
    <svg viewBox="0 0 360 200" className="cs-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="conv-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16110A"/>
          <stop offset="100%" stopColor="#070A0E"/>
        </linearGradient>
        <radialGradient id="conv-lights" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="#E6B948" stopOpacity="0.16"/>
          <stop offset="100%" stopColor="#070A0E" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="360" height="200" fill="url(#conv-bg)"/>
      <rect width="360" height="200" fill="url(#conv-lights)"/>

      {/* giant LED screens at back */}
      <g>
        <rect x="20" y="20" width="100" height="58" fill="#0E1118" stroke="#2A323E" strokeWidth="0.5"/>
        {/* live vote count */}
        <text x="70" y="34" textAnchor="middle" fill="#C9A961" fontSize="6"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.16em'}}>
          VOTACIÓN INTERNA · LISTA 04
        </text>
        <text x="70" y="56" textAnchor="middle" fill="#E8E6E1" fontSize="20"
          style={{fontFamily:'Source Serif 4, serif', fontWeight:500}}>
          {(58 + Math.round(Math.sin(tick*0.5)*2)).toString().padStart(2,'0')}.
          {Math.round((tick*30)%99).toString().padStart(2,'0')}
        </text>
        <text x="70" y="70" textAnchor="middle" fill="#5E9B7E" fontSize="6"
          style={{fontFamily:'IBM Plex Mono, monospace'}}>
          QUÓRUM: 412/420
        </text>
      </g>
      {/* candidate live cam */}
      <g>
        <rect x="140" y="20" width="80" height="58" fill="#11161C" stroke="#2A323E" strokeWidth="0.5"/>
        <circle cx="180" cy="45" r="10" fill="#0A0D11"/>
        <path d="M 162 65 Q 162 50 180 50 Q 198 50 198 65 Z" fill="#0A0D11"/>
        <ellipse cx="180" cy="38" rx="16" ry="4" fill="#E6B948" opacity="0.10"/>
        <text x="180" y="74" textAnchor="middle" fill="#C9A961" fontSize="5.5"
          style={{fontFamily:'IBM Plex Mono, monospace'}}>● ESCENARIO PRINCIPAL</text>
      </g>
      {/* faction tally */}
      <g>
        <rect x="240" y="20" width="100" height="58" fill="#0E1118" stroke="#2A323E" strokeWidth="0.5"/>
        <text x="248" y="32" fill="#8C95A0" fontSize="6"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.16em'}}>FACCIONES</text>
        {[
          {n:'RENOVADORES', v:38, c:'#5E9B7E'},
          {n:'V. GUARDIA',  v:31, c:'#C9A961'},
          {n:'TERRITORIAL', v:22, c:'#5B8FB9'},
        ].map((f,i)=>(
          <g key={i} transform={`translate(248 ${42 + i*10})`}>
            <text fill="#E8E6E1" fontSize="5.5" style={{fontFamily:'IBM Plex Mono, monospace'}}>{f.n}</text>
            <rect x="56" y="-4" width="32" height="3" fill="#1F2731"/>
            <rect x="56" y="-4" width={f.v*0.32} height="3" fill={f.c}/>
            <text x="92" y="0" fill="#C9A961" fontSize="5.5" textAnchor="end"
              style={{fontFamily:'IBM Plex Mono, monospace'}}>{f.v}%</text>
          </g>
        ))}
      </g>

      {/* banner */}
      <g transform="translate(180 88)">
        <rect x="-80" y="-6" width="160" height="10" fill="#9C2A2A" opacity="0.85"/>
        <text x="0" y="2" textAnchor="middle" fill="#F4E9C8" fontSize="6"
          style={{fontFamily:'Source Serif 4, serif', letterSpacing:'0.3em'}}>
          CONVENCIÓN NACIONAL · 2026
        </text>
      </g>

      {/* delegates as colored dots */}
      <g>
        {delegates.map((d,i)=>(
          <circle key={i}
            cx={d.x + Math.sin(tick*1.3 + d.phase)*0.4}
            cy={d.y}
            r="1.4"
            fill={factionColors[d.faction]}
            opacity={0.55 + Math.sin(tick + d.phase)*0.06}/>
        ))}
      </g>

      {/* sweeping spotlight */}
      <path
        d={`M ${180 + Math.sin(tick*0.7)*100} 0 L ${200 + Math.sin(tick*0.7)*100} 0 L 260 200 L 100 200 Z`}
        fill="#E6B948" opacity="0.04"/>

      {/* ticker */}
      <g>
        <rect x="0" y="186" width="360" height="14" fill="#0A0D11" opacity="0.9"/>
        <text x={360 - ((tick*45) % 800)} y="195" fill="#E8E6E1" fontSize="7"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.12em'}}>
          ● CONVENCIÓN · RONDA 03 EN CURSO · RENOVADORES SUMAN 18 DELEGADOS · ALIANZA TERRITORIAL EN NEGOCIACIÓN · QUIEBRE LATENTE EN VIEJA GUARDIA ·
        </text>
      </g>

      <g style={{fontFamily:'IBM Plex Mono, monospace'}}>
        <text x="8" y="14" fill="#C9A961" fontSize="7" letterSpacing="0.2em">● LIVE · SALÓN 04</text>
        <text x="352" y="14" textAnchor="end" fill="#8C95A0" fontSize="7" letterSpacing="0.16em">
          412 DELEGADOS · {(((tick*30)|0)%60).toString().padStart(2,'0')}:{(((tick*60)|0)%60).toString().padStart(2,'0')}
        </text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/*  HQ SCENE — New Campaign                                                  */
/* ------------------------------------------------------------------------- */
function HQScene({ tick }) {
  return (
    <svg viewBox="0 0 360 200" className="cs-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="hq-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10141A"/>
          <stop offset="100%" stopColor="#070A0E"/>
        </linearGradient>
      </defs>
      <rect width="360" height="200" fill="url(#hq-bg)"/>
      {/* warm desk lamp glow */}
      <ellipse cx="80" cy="130" rx="80" ry="50" fill="#E6B948" opacity={0.06+Math.sin(tick*1.4)*0.015}/>
      <ellipse cx="280" cy="120" rx="70" ry="40" fill="#5B8FB9" opacity="0.04"/>

      {/* whiteboard with poll bars (left) */}
      <g transform="translate(14 18)">
        <rect width="120" height="86" fill="#E8E1D0" opacity="0.06" stroke="#2A323E" strokeWidth="0.5"/>
        <text x="6" y="10" fill="#C9A961" fontSize="5.5"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.16em'}}>WAR ROOM · POLL TRACKER</text>
        {/* mini polling chart */}
        <g transform="translate(8 18)">
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => {
            const y1 = 30 + Math.sin(tick*0.6 + i*0.5)*8 + i*0.3;
            const y2 = 26 + Math.cos(tick*0.5 + i*0.4)*8;
            const x = i*9;
            return (
              <g key={i}>
                <circle cx={x} cy={y1} r="1.4" fill="#5B8FB9"/>
                <circle cx={x} cy={y2} r="1.4" fill="#C24A4A"/>
              </g>
            );
          })}
          {/* connect lines */}
          <polyline
            points={[1,2,3,4,5,6,7,8,9,10,11,12].map(i => `${i*9},${30 + Math.sin(tick*0.6 + i*0.5)*8 + i*0.3}`).join(' ')}
            fill="none" stroke="#5B8FB9" strokeWidth="0.8"/>
          <polyline
            points={[1,2,3,4,5,6,7,8,9,10,11,12].map(i => `${i*9},${26 + Math.cos(tick*0.5 + i*0.4)*8}`).join(' ')}
            fill="none" stroke="#C24A4A" strokeWidth="0.8"/>
        </g>
        <text x="6" y="78" fill="#8C95A0" fontSize="5"
          style={{fontFamily:'IBM Plex Mono, monospace'}}>D-92 → D-64 · TRACKING</text>
      </g>

      {/* monitors stack (right) */}
      <g transform="translate(150 18)">
        {/* monitor 1 — schedule */}
        <rect width="90" height="40" fill="#0E1118" stroke="#2A323E" strokeWidth="0.5"/>
        <text x="6" y="8" fill="#C9A961" fontSize="5"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.16em'}}>SCHEDULE · WK 11</text>
        {['MON · RALLY CA','TUE · TV DEBATE','WED · DOOR LO','THU · FUND. CA'].map((s,i)=>(
          <text key={i} x="6" y={16 + i*7} fill="#E8E6E1" fontSize="5"
            style={{fontFamily:'IBM Plex Mono, monospace'}}>{s}</text>
        ))}

        {/* monitor 2 — call log */}
        <g transform="translate(0 46)">
          <rect width="90" height="40" fill="#0E1118" stroke="#2A323E" strokeWidth="0.5"/>
          <text x="6" y="8" fill="#5E9B7E" fontSize="5"
            style={{fontFamily:'IBM Plex Mono, monospace'}}>● CALL TIME · LIVE</text>
          <text x="6" y="18" fill="#E8E6E1" fontSize="5"
            style={{fontFamily:'IBM Plex Mono, monospace'}}>DONOR 03 · A. MORENO</text>
          <text x="6" y="26" fill="#8C95A0" fontSize="5"
            style={{fontFamily:'IBM Plex Mono, monospace'}}>PLEDGE · ${(120 + Math.round(tick*2)).toString()}K</text>
          {/* waveform */}
          <g transform="translate(6 32)">
            {Array.from({length:30}).map((_,i)=>{
              const h = 1 + Math.abs(Math.sin(tick*3 + i*0.4))*5;
              return <rect key={i} x={i*2.4} y={-h/2} width="1.4" height={h} fill="#5E9B7E"/>;
            })}
          </g>
        </g>
      </g>

      {/* third monitor — map */}
      <g transform="translate(248 18)">
        <rect width="98" height="86" fill="#0E1118" stroke="#2A323E" strokeWidth="0.5"/>
        <text x="6" y="8" fill="#5B8FB9" fontSize="5"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.16em'}}>MAP · VOLUNTEERS</text>
        <svg x="4" y="12" width="90" height="68" viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid meet">
          {D.PROVINCES.map(p => {
            const c = (p.id.charCodeAt(0) + p.id.charCodeAt(1)) % 4;
            const cols = ['#1F2731','#5E9B7E','#C9A961','#5B8FB9'];
            return <polygon key={p.id} points={p.polygon} fill={cols[c]} opacity="0.5" stroke="#070A0E" strokeWidth="3"/>;
          })}
        </svg>
        <circle cx={300/10 + 4 + (Math.sin(tick*1.3)*4 + 25)} cy={20 + 30 + Math.cos(tick)*4} r="2" fill="#E6B948" opacity={0.7+Math.sin(tick*2)*0.3}/>
      </g>

      {/* desk silhouette band */}
      <rect x="0" y="138" width="360" height="62" fill="#0A0D11" opacity="0.7"/>
      {/* people silhouettes around table */}
      <g transform="translate(0 138)">
        {[40, 100, 200, 260, 320].map((x, i) => (
          <g key={i} transform={`translate(${x} 20)`}>
            <ellipse cx="0" cy="0" rx="9" ry="10" fill="#070A0E"/>
            <path d={`M -16 26 Q -16 8 0 8 Q 16 8 16 26 Z`} fill="#070A0E"/>
            {/* steam (subtle) */}
            <path d={`M -2 -12 q ${Math.sin(tick*1.5+i)*2} -4 0 -8 q ${Math.cos(tick*1.5+i)*2} -4 0 -8`}
              fill="none" stroke="#5A6470" strokeWidth="0.6" opacity="0.35"/>
          </g>
        ))}
      </g>

      {/* coffee cup + papers strewn */}
      <g transform="translate(180 162)">
        <rect x="-6" y="-2" width="12" height="8" fill="#2A1F14" stroke="#3A2D1E" strokeWidth="0.4"/>
        <ellipse cx="0" cy="-2" rx="6" ry="1.5" fill="#0A0D11"/>
      </g>

      {/* ticker */}
      <g>
        <rect x="0" y="186" width="360" height="14" fill="#0A0D11" opacity="0.9"/>
        <text x={360 - ((tick*38) % 700)} y="195" fill="#E8E6E1" fontSize="7"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.12em'}}>
          HQ · STAFF DE 84 PERSONAS · IMPRENTA 12K VOLANTES/H · BUSES 04 RUTAS · DONOR CALLS +18% · ROAD MAP CONFIRMADO ·
        </text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/*  ARCHIVE SCENE — Historical Scenarios                                     */
/*  Newspaper clip + CRT TV + microfilm sprockets                            */
/* ------------------------------------------------------------------------- */
function ArchiveScene({ tick }) {
  const flicker = 0.92 + Math.sin(tick*9)*0.04 + Math.sin(tick*23)*0.02;
  const scan = (tick*60) % 200;
  return (
    <svg viewBox="0 0 360 200" className="cs-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="arc-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A140C"/>
          <stop offset="100%" stopColor="#0A0805"/>
        </linearGradient>
        <pattern id="arc-paper" width="2" height="2" patternUnits="userSpaceOnUse">
          <rect width="2" height="2" fill="#D9CDA8"/>
          <circle cx="0.5" cy="0.5" r="0.2" fill="#A89A7C" opacity="0.4"/>
        </pattern>
      </defs>
      <rect width="360" height="200" fill="url(#arc-bg)"/>
      {/* warm sepia wash */}
      <rect width="360" height="200" fill="#C9A961" opacity="0.05"/>

      {/* film perforations (top / bottom) */}
      <g fill="#0A0805">
        {Array.from({length:18}).map((_,i)=>(
          <rect key={'tp'+i} x={i*20 + 2 - ((tick*10)%20)} y="2" width="10" height="6" fill="#0A0805" stroke="#4A3A24" strokeWidth="0.3"/>
        ))}
        {Array.from({length:18}).map((_,i)=>(
          <rect key={'bp'+i} x={i*20 + 2 - ((tick*10)%20)} y="192" width="10" height="6" fill="#0A0805" stroke="#4A3A24" strokeWidth="0.3"/>
        ))}
      </g>

      {/* CRT television — left */}
      <g transform="translate(18 22)">
        <rect width="140" height="100" rx="8" fill="#1A140C" stroke="#3D2F1A" strokeWidth="1"/>
        <rect x="6" y="6" width="128" height="88" rx="4" fill="#0E1A0E" opacity={flicker}/>
        {/* news anchor silhouette */}
        <g transform="translate(70 50)">
          <circle r="14" fill="#1F2A1F"/>
          <path d="M -20 38 Q -20 16 0 16 Q 20 16 20 38 Z" fill="#1F2A1F"/>
          <rect x="-30" y="32" width="60" height="14" fill="#9C2A2A" opacity="0.7"/>
          <text x="0" y="41" textAnchor="middle" fill="#F4E9C8" fontSize="5"
            style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.2em'}}>NOTICIERO · 1989</text>
        </g>
        {/* scanline */}
        <rect x="6" y={6 + scan*0.44} width="128" height="2" fill="#E6B948" opacity="0.25"/>
        {/* CRT bezel reflection */}
        <ellipse cx="40" cy="20" rx="32" ry="6" fill="#F4E9C8" opacity="0.04"/>
        <text x="70" y="106" textAnchor="middle" fill="#C9A961" fontSize="6"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.2em'}}>● ARCHIVO · ROLLO 04</text>
      </g>

      {/* newspaper clip — right */}
      <g transform="translate(178 18) rotate(-3)">
        <rect width="170" height="120" fill="url(#arc-paper)" stroke="#6A5A40" strokeWidth="0.4"/>
        {/* masthead */}
        <text x="8" y="14" fill="#2A1F14" fontSize="7"
          style={{fontFamily:'Source Serif 4, serif', fontWeight:600, letterSpacing:'0.2em'}}>
          EL ESTANDARTE
        </text>
        <line x1="8" y1="17" x2="162" y2="17" stroke="#2A1F14" strokeWidth="0.4"/>
        <text x="8" y="22" fill="#5A4A30" fontSize="4"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.18em'}}>VIERNES · 12 · DIC · 1989 · ED. EXTRAORDINARIA</text>
        {/* headline */}
        <text x="8" y="40" fill="#2A1F14" fontSize="11"
          style={{fontFamily:'Source Serif 4, serif', fontWeight:600}}>
          CAEN LAS URNAS:
        </text>
        <text x="8" y="52" fill="#2A1F14" fontSize="11"
          style={{fontFamily:'Source Serif 4, serif', fontWeight:600}}>
          TRANSICIÓN ABIERTA
        </text>
        {/* lede */}
        <g fill="#3A2D1E" fontSize="4.2" style={{fontFamily:'Source Serif 4, serif'}}>
          <text x="8" y="62">El consejo aceptó por unanimidad el llamado a</text>
          <text x="8" y="68">elecciones generales, marcando el fin del régimen</text>
          <text x="8" y="74">militar instaurado tras el golpe de 1953. El presidente</text>
          <text x="8" y="80">provisional Linares anunció…</text>
        </g>
        {/* halftone image placeholder */}
        <g transform="translate(8 86)">
          <rect width="74" height="30" fill="#A89A7C" opacity="0.7"/>
          {Array.from({length:40}).map((_,i)=>(
            <circle key={i} cx={(i%10)*7+4} cy={(i/10|0)*7+4} r="2" fill="#2A1F14" opacity="0.7"/>
          ))}
          <text x="84" y="10" fill="#3A2D1E" fontSize="4"
            style={{fontFamily:'IBM Plex Mono, monospace'}}>FOTO · ARCHIVO</text>
          <text x="84" y="16" fill="#3A2D1E" fontSize="4"
            style={{fontFamily:'IBM Plex Mono, monospace'}}>PLAZA MAYOR · 23H</text>
        </g>
      </g>

      {/* dust particles */}
      <g>
        {Array.from({length:18}).map((_,i)=>{
          const x = (i*23 + tick*8) % 360;
          const y = (i*17 + Math.sin(tick + i)*6) % 200;
          return <circle key={i} cx={x} cy={y} r="0.6" fill="#C9A961" opacity="0.35"/>;
        })}
      </g>

      {/* corner timecode */}
      <g style={{fontFamily:'IBM Plex Mono, monospace'}}>
        <text x="8" y="14" fill="#C9A961" fontSize="6" letterSpacing="0.2em">ARCHIVO · 1953-2024</text>
        <text x="352" y="14" textAnchor="end" fill="#C9A961" fontSize="6" letterSpacing="0.16em">
          18 ESCENARIOS
        </text>
        <text x="352" y="196" textAnchor="end" fill="#C9A961" fontSize="6" letterSpacing="0.16em">
          TC {(tick*10|0).toString().padStart(6,'0')}
        </text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/*  WAR ROOM SCENE — Multiplayer                                             */
/* ------------------------------------------------------------------------- */
function WarRoomScene({ tick }) {
  return (
    <svg viewBox="0 0 360 200" className="cs-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="wr-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0B131A"/>
          <stop offset="100%" stopColor="#050A0E"/>
        </linearGradient>
        <radialGradient id="wr-mid" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#5B8FB9" stopOpacity="0.06"/>
          <stop offset="100%" stopColor="#070A0E" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="360" height="200" fill="url(#wr-bg)"/>
      <rect width="360" height="200" fill="url(#wr-mid)"/>

      {/* central big map screen */}
      <g transform="translate(110 16)">
        <rect width="140" height="100" fill="#0A1218" stroke="#26404E" strokeWidth="0.5"/>
        <text x="6" y="9" fill="#5B8FB9" fontSize="5.5"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.16em'}}>
          SHARED MAP · LIVE
        </text>
        <svg x="6" y="14" width="128" height="80" viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid meet">
          {D.PROVINCES.map(p => {
            const lean = p.leaning;
            const c = lean > 0.2 ? '#C24A4A' : lean < -0.2 ? '#5B8FB9' : '#C9A961';
            return <polygon key={p.id} points={p.polygon} fill={c}
              opacity={0.45 + Math.sin(tick + p.id.charCodeAt(0)*0.3)*0.06}
              stroke="#070A0E" strokeWidth="3"/>;
          })}
          {/* player movement paths */}
          <path d="M 285 150 Q 500 295 730 160" fill="none" stroke="#E6B948" strokeWidth="3" strokeDasharray="14 10" opacity="0.7"/>
        </svg>
      </g>

      {/* side screens — 4 players */}
      {[
        { x:12, name:'P1 · AURORA', col:'#5B8FB9', score:31 },
        { x:12, y:80, name:'P2 · MIRAGE', col:'#C24A4A', score:28 },
        { x:262, name:'P3 · ALTO V.', col:'#5E9B7E', score:22 },
        { x:262, y:80, name:'P4 · BAHÍA', col:'#C9A961', score:18 },
      ].map((p,i)=>(
        <g key={i} transform={`translate(${p.x} ${p.y||16})`}>
          <rect width="92" height="56" fill="#0A1218" stroke="#26404E" strokeWidth="0.5"/>
          <rect width="4" height="56" fill={p.col} opacity={0.7+Math.sin(tick*2+i)*0.2}/>
          <text x="10" y="10" fill={p.col} fontSize="5.5"
            style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.16em'}}>● {p.name}</text>
          <text x="10" y="28" fill="#E8E6E1" fontSize="14"
            style={{fontFamily:'Source Serif 4, serif', fontWeight:500}}>
            {(p.score + Math.round(Math.sin(tick*0.4+i)*0.6))}%
          </text>
          {/* sparkline */}
          <polyline
            points={Array.from({length:12}).map((_,j)=>`${10+j*7},${44 - Math.sin(tick*0.5+i+j*0.4)*4 - j*0.3}`).join(' ')}
            fill="none" stroke={p.col} strokeWidth="0.8"/>
        </g>
      ))}

      {/* chat negotiation panel (bottom center) */}
      <g transform="translate(110 124)">
        <rect width="140" height="56" fill="#0A1218" stroke="#26404E" strokeWidth="0.5"/>
        <text x="6" y="9" fill="#C9A961" fontSize="5.5"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.16em'}}>NEGOCIACIÓN · ALIANZA</text>
        <text x="6" y="21" fill="#5B8FB9" fontSize="5.5"
          style={{fontFamily:'IBM Plex Mono, monospace'}}>P1 ▸ acepto ceder 2 provincias</text>
        <text x="6" y="32" fill="#C24A4A" fontSize="5.5"
          style={{fontFamily:'IBM Plex Mono, monospace'}}>P2 ▸ exijo Costa Atlántica</text>
        <text x="6" y="43" fill="#E8E6E1" fontSize="5.5"
          style={{fontFamily:'IBM Plex Mono, monospace'}}>
          P1 ▸ {(tick % 6 < 3) ? 'escribiendo…' : 'oferta enviada'}
        </text>
        <rect x="6" y="48" width="128" height="4" fill="#1F2731"/>
        <rect x="6" y="48" width={Math.abs(Math.sin(tick))*128} height="4" fill="#5E9B7E"/>
      </g>

      {/* operator silhouettes bottom */}
      <g transform="translate(0 160)" opacity="0.85">
        {[30, 90, 170, 230, 310].map((x, i) => (
          <g key={i} transform={`translate(${x} 30)`}>
            <ellipse cx="0" cy="0" rx="10" ry="11" fill="#070A0E"/>
            <path d={`M -18 32 Q -18 10 0 10 Q 18 10 18 32 Z`} fill="#070A0E"/>
          </g>
        ))}
      </g>

      {/* HUD top */}
      <g style={{fontFamily:'IBM Plex Mono, monospace'}}>
        <text x="8" y="12" fill="#5B8FB9" fontSize="6" letterSpacing="0.2em">● WAR ROOM · MP LOBBY 04</text>
        <text x="352" y="12" textAnchor="end" fill="#8C95A0" fontSize="6" letterSpacing="0.16em">
          PING 41ms · ENC. AES-256
        </text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/*  ELECTION NIGHT (preview tile)                                            */
/* ------------------------------------------------------------------------- */
function ElectionNightScene({ tick }) {
  return (
    <svg viewBox="0 0 360 200" className="cs-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="en-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#180A0A"/>
          <stop offset="100%" stopColor="#070A0E"/>
        </linearGradient>
      </defs>
      <rect width="360" height="200" fill="url(#en-bg)"/>
      <rect width="360" height="200" fill="#C24A4A" opacity={0.04+Math.sin(tick*0.7)*0.01}/>

      {/* "TV studio" with anchor */}
      <g transform="translate(12 16)">
        <rect width="160" height="100" fill="#0F0809" stroke="#3A1A1A" strokeWidth="0.5"/>
        <text x="6" y="10" fill="#C24A4A" fontSize="6"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.2em'}}>● LIVE · STUDIO 01</text>
        {/* desk */}
        <rect x="20" y="56" width="120" height="38" fill="#2A1414"/>
        <line x1="20" y1="56" x2="140" y2="56" stroke="#3A1A1A" strokeWidth="0.4"/>
        {/* anchor */}
        <g transform="translate(80 40)">
          <circle r="14" fill="#1A1010"/>
          <path d="M -20 30 Q -20 12 0 12 Q 20 12 20 30 Z" fill="#1A1010"/>
        </g>
        {/* lower third */}
        <rect x="6" y="78" width="148" height="14" fill="#9C2A2A"/>
        <text x="14" y="88" fill="#F4E9C8" fontSize="6"
          style={{fontFamily:'Source Serif 4, serif', fontWeight:600, letterSpacing:'0.16em'}}>
          ESCRUTINIO · 38% MESAS REPORTANDO
        </text>
      </g>

      {/* big result panel */}
      <g transform="translate(184 16)">
        <rect width="164" height="100" fill="#0E0608" stroke="#3A1A1A" strokeWidth="0.5"/>
        <text x="6" y="10" fill="#C9A961" fontSize="5.5"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.16em'}}>PROYECCIÓN · NACIONAL</text>
        {[
          { c:'PRD', n:'Vasconcelos', v:29.4, col:'#5B8FB9' },
          { c:'MNP', n:'Orellana',    v:28.1, col:'#C24A4A' },
          { c:'FAS', n:'Linares',     v:21.8, col:'#5E9B7E' },
          { c:'VC',  n:'Salinas',     v:14.2, col:'#C9A961' },
        ].map((r,i)=>{
          const v = r.v + Math.sin(tick*0.5 + i)*0.15;
          return (
            <g key={i} transform={`translate(0 ${22 + i*16})`}>
              <rect x="6" width="3" height="12" fill={r.col}/>
              <text x="14" y="9" fill="#E8E6E1" fontSize="6"
                style={{fontFamily:'IBM Plex Mono, monospace'}}>{r.c} · {r.n}</text>
              <rect x="14" y="10" width="100" height="2" fill="#1F2731"/>
              <rect x="14" y="10" width={v*3.2} height="2" fill={r.col}/>
              <text x="158" y="9" textAnchor="end" fill="#E8E6E1" fontSize="7"
                style={{fontFamily:'IBM Plex Mono, monospace', fontWeight:500}}>{v.toFixed(1)}%</text>
            </g>
          );
        })}
      </g>

      {/* lower band: provinces grid */}
      <g transform="translate(12 124)">
        <text x="0" y="-4" fill="#C9A961" fontSize="6"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.16em'}}>PROVINCIAS · ESCRUTINIO</text>
        {D.PROVINCES.map((p, i) => {
          const lean = p.leaning;
          const c = lean > 0.2 ? '#C24A4A' : lean < -0.2 ? '#5B8FB9' : '#C9A961';
          const reported = ((tick*4 + i*0.7) % 6) / 6;
          return (
            <g key={p.id} transform={`translate(${i*28} 4)`}>
              <rect width="24" height="44" fill="#0F0608" stroke="#2A1418" strokeWidth="0.4"/>
              <rect width="24" height={44*reported} y={44 - 44*reported} fill={c} opacity="0.65"/>
              <text x="12" y="12" textAnchor="middle" fill="#E8E6E1" fontSize="5.5"
                style={{fontFamily:'IBM Plex Mono, monospace', fontWeight:600}}>{p.id}</text>
              <text x="12" y="50" textAnchor="middle" fill="#C9A961" fontSize="4"
                style={{fontFamily:'IBM Plex Mono, monospace'}}>{Math.floor(reported*100)}%</text>
            </g>
          );
        })}
      </g>

      {/* breaking news ticker */}
      <g>
        <rect x="0" y="184" width="360" height="16" fill="#9C2A2A"/>
        <text x="6" y="194" fill="#F4E9C8" fontSize="6"
          style={{fontFamily:'IBM Plex Mono, monospace', fontWeight:600, letterSpacing:'0.2em'}}>BREAKING</text>
        <text x={360 - ((tick*48) % 700)} y="194" fill="#F4E9C8" fontSize="6.5"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.12em'}}>
          PRD ROZA EL UMBRAL · MNP CRECE EN LLANOS · COSTA ATLÁNTICA REPORTA 71% · DISPUTA EN SIERRA ANDINA · MARGEN ±0.4% ·
        </text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/*  MEDIA PREVIEW                                                             */
/* ------------------------------------------------------------------------- */
function MediaPreviewScene({ tick }) {
  const posts = [
    { u:'@aurora_news', t:'Vasconcelos lidera en CA — 11.2k', col:'#5B8FB9' },
    { u:'@_orellana_',  t:'No vamos a ceder el norte. ✊',     col:'#C24A4A' },
    { u:'@minutopolitico', t:'Hilo: por qué el debate fue clave (1/12)', col:'#C9A961' },
    { u:'@frenteamplio',t:'Salimos al territorio. Hoy 8pm.',   col:'#5E9B7E' },
  ];
  return (
    <svg viewBox="0 0 360 200" className="cs-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="me-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F141B"/>
          <stop offset="100%" stopColor="#070A0E"/>
        </linearGradient>
      </defs>
      <rect width="360" height="200" fill="url(#me-bg)"/>

      {/* "PULSE" social feed */}
      <g transform="translate(12 16)">
        <rect width="140" height="120" fill="#0F141B" stroke="#26313E" strokeWidth="0.5"/>
        <text x="6" y="10" fill="#C9A961" fontSize="5.5"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.16em'}}>STREAM · PULSE</text>
        {posts.map((p, i) => (
          <g key={i} transform={`translate(6 ${18 + i*22})`}>
            <circle cx="4" cy="6" r="3" fill={p.col}/>
            <text x="12" y="6" fill="#E8E6E1" fontSize="5.5"
              style={{fontFamily:'IBM Plex Mono, monospace', fontWeight:500}}>{p.u}</text>
            <text x="12" y="14" fill="#8C95A0" fontSize="5"
              style={{fontFamily:'IBM Plex Mono, monospace'}}>{p.t}</text>
            <text x="128" y="6" textAnchor="end" fill="#5A6470" fontSize="4.5"
              style={{fontFamily:'IBM Plex Mono, monospace'}}>{(2+i)}m</text>
          </g>
        ))}
      </g>

      {/* TV liveshot */}
      <g transform="translate(160 16)">
        <rect width="92" height="58" fill="#0E0A0F" stroke="#3A1A1A" strokeWidth="0.5"/>
        <text x="6" y="9" fill="#C24A4A" fontSize="5"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.18em'}}>● LIVE · AURORA TV</text>
        <g transform="translate(46 28)">
          <circle r="9" fill="#1A1010"/>
          <path d="M -14 22 Q -14 8 0 8 Q 14 8 14 22 Z" fill="#1A1010"/>
        </g>
        <rect x="6" y="46" width="80" height="8" fill="#9C2A2A"/>
        <text x="10" y="52" fill="#F4E9C8" fontSize="4"
          style={{fontFamily:'IBM Plex Mono, monospace'}}>DEBATE NACIONAL · 72h</text>
      </g>

      {/* podcast strip */}
      <g transform="translate(258 16)">
        <rect width="88" height="58" fill="#0F141B" stroke="#26313E" strokeWidth="0.5"/>
        <text x="6" y="9" fill="#5E9B7E" fontSize="5"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.18em'}}>PODCAST · TOP 03</text>
        {['CONTRAPESO','RUIDO DE FONDO','CAJA NEGRA'].map((s,i)=>(
          <g key={i} transform={`translate(6 ${18 + i*12})`}>
            <rect width="4" height="8" fill="#5E9B7E"/>
            <text x="10" y="7" fill="#E8E6E1" fontSize="5"
              style={{fontFamily:'IBM Plex Mono, monospace'}}>{s}</text>
          </g>
        ))}
      </g>

      {/* trending */}
      <g transform="translate(160 78)">
        <rect width="186" height="58" fill="#0F141B" stroke="#26313E" strokeWidth="0.5"/>
        <text x="6" y="9" fill="#C9A961" fontSize="5"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.18em'}}>TENDENCIAS</text>
        {[
          { t:'#Vasconcelos2026', v:'214k'},
          { t:'#Debate Nacional',  v:'98k'},
          { t:'#Orellana',         v:'72k'},
          { t:'#FrenteAntiCrisis', v:'41k'},
        ].map((tr,i)=>(
          <g key={i} transform={`translate(6 ${20 + i*9})`}>
            <text x="0" y="5" fill="#5A6470" fontSize="5"
              style={{fontFamily:'IBM Plex Mono, monospace'}}>{(i+1).toString().padStart(2,'0')}</text>
            <text x="18" y="5" fill="#E8E6E1" fontSize="5.5"
              style={{fontFamily:'IBM Plex Mono, monospace'}}>{tr.t}</text>
            <text x="180" y="5" textAnchor="end" fill="#C9A961" fontSize="5"
              style={{fontFamily:'IBM Plex Mono, monospace'}}>{tr.v}</text>
          </g>
        ))}
      </g>

      {/* live waveform bar */}
      <g transform="translate(12 156)">
        <text x="0" y="-2" fill="#5E9B7E" fontSize="5"
          style={{fontFamily:'IBM Plex Mono, monospace', letterSpacing:'0.16em'}}>● SENTIMENT · LIVE</text>
        {Array.from({length:72}).map((_,i)=>{
          const h = 2 + Math.abs(Math.sin(tick*3 + i*0.32))*14;
          return <rect key={i} x={i*4.7} y={20-h/2} width="2.8" height={h}
            fill={i%3===0?'#C24A4A':i%2===0?'#5B8FB9':'#5E9B7E'} opacity="0.85"/>;
        })}
      </g>

      <g style={{fontFamily:'IBM Plex Mono, monospace'}}>
        <text x="8" y="12" fill="#C9A961" fontSize="6" letterSpacing="0.2em">MEDIA · ECOSYSTEM 01</text>
        <text x="352" y="12" textAnchor="end" fill="#8C95A0" fontSize="6" letterSpacing="0.16em">
          412k · 98k · 72k · 41k
        </text>
      </g>
    </svg>
  );
}

/* expose globally */
Object.assign(window, {
  RallyScene, ConventionScene, HQScene, ArchiveScene,
  WarRoomScene, ElectionNightScene, MediaPreviewScene,
});
