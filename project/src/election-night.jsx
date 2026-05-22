/* =========================================================================
   CAMPAIGN COMMAND — Election Night Mode
   Full-screen cinematic election coverage.
   ========================================================================= */

const { useState: useStateEN, useEffect: useEffectEN, useMemo: useMemoEN, useRef: useRefEN } = React;

function ElectionNight({ onClose }) {
  const [tick, setTick] = useStateEN(0);
  useEffectEN(() => {
    let raf = 0;
    const loop = () => { setTick(v => v + 0.016); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // simulated reporting %
  const overall = Math.min(99, 38 + Math.floor(tick*0.6));

  // candidate live results — oscillate slightly
  const results = [
    { c:'PRD', n:'Vasconcelos', col:'#5B8FB9', base:29.4, swing:0.18 },
    { c:'MNP', n:'Orellana',    col:'#C24A4A', base:28.1, swing:0.22 },
    { c:'FAS', n:'Linares',     col:'#5E9B7E', base:21.8, swing:0.10 },
    { c:'VC',  n:'Salinas',     col:'#C9A961', base:14.2, swing:0.08 },
    { c:'IND', n:'Otros',       col:'#8C95A0', base:6.5,  swing:0.04 },
  ].map((r,i) => ({
    ...r,
    v: r.base + Math.sin(tick*0.5 + i)*r.swing,
  }));
  const max = results[0].v;

  return (
    <div className="enight">
      <div className="enight__bg"/>

      {/* top broadcast bar */}
      <header className="enight__top">
        <div className="enight__brand">
          <div className="enight__brand-mark">★</div>
          <div>
            <div className="enight__brand-name">Aurora Network · ESPECIAL ELECTORAL</div>
            <div className="enight__brand-sub mono">CHANNEL 04 · COBERTURA EN VIVO</div>
          </div>
        </div>
        <div className="enight__top-c">
          <span className="pulse-dot"/>
          <span>NOCHE ELECTORAL · 14·OCT·2026</span>
        </div>
        <div className="enight__top-r">
          <span>HORA · 22:{(((tick*60)|0)%60).toString().padStart(2,'0')}:{(((tick*120)|0)%60).toString().padStart(2,'0')}</span>
          <span>MESAS · {overall}% ESCRUTADAS</span>
          <button className="navbtn" onClick={onClose} style={{padding:'4px 10px'}}>← MENU</button>
        </div>
      </header>

      {/* LEFT — anchor + breaking + studio */}
      <aside className="enight__left">
        <div className="enight__breaking">
          <div className="enight__breaking-tag">▶ BREAKING · {Math.floor(tick) % 60 < 30 ? 'AHORA' : '02 MIN'}</div>
          <div className="enight__breaking-text">
            La Junta proyecta a Vasconcelos al frente con un margen de
            <strong style={{color:'#F4E9C8'}}> +{(max - results[1].v).toFixed(2)} pts</strong> sobre Orellana.
            Mesas en Costa Atlántica reportan al 71%.
          </div>
        </div>

        <div className="enight__anchor">
          <div className="enight__anchor-thumb mono">CAM 01</div>
          <div>
            <div className="enight__anchor-name">Carla Mendizábal</div>
            <div className="enight__anchor-line mono">Conductora · Mesa de análisis</div>
            <div className="enight__anchor-line">
              “Está abriéndose una ventana inesperada para el PRD en el norte.
              Linares estaría perdiendo Sierra Andina por menos de 0.4 puntos.”
            </div>
          </div>
        </div>
        <div className="enight__anchor">
          <div className="enight__anchor-thumb mono">CAM 02</div>
          <div>
            <div className="enight__anchor-name">Iván Otárola</div>
            <div className="enight__anchor-line mono">Analista político · Encuestador</div>
            <div className="enight__anchor-line">
              “Vamos a ver swings dramáticos cuando entren los datos de Llanos.
              Allí Vasconcelos no esperaba pasar del 22%.”
            </div>
          </div>
        </div>

        <div className="enight__panel">
          <div className="enight__panel-head"><span>SWING DRAMÁTICO</span><span>+{(Math.sin(tick*0.3)*0.4+1.8).toFixed(1)}pt</span></div>
          <div className="enight__panel-body" style={{padding:0}}>
            <Swingograph tick={tick}/>
          </div>
        </div>

        <div className="enight__panel">
          <div className="enight__panel-head"><span>SWING STATES</span><span>03</span></div>
          <div className="enight__panel-body" style={{padding:0}}>
            {D.PROVINCES.filter(p=>Math.abs(p.leaning)<0.2).slice(0,4).map(p => {
              const gap = (Math.sin(tick*0.4 + p.id.charCodeAt(0))*0.6 + 1.2).toFixed(1);
              return (
                <div key={p.id} className="enight__province-row">
                  <span className="enight__province-id">{p.id}</span>
                  <span className="enight__province-name">{p.name}</span>
                  <span className="enight__province-pct">±{gap}</span>
                  <span className="enight__province-status enight__province-status--toss">TOSS-UP</span>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* CENTER — big map */}
      <main className="enight__center">
        <div className="enight__bigmap">
          <BigElectionMap tick={tick}/>
          <div className="enight__bigmap-overlay mono">
            MAPA NACIONAL · ESCRUTINIO {overall}%
          </div>
          <div className="enight__bigmap-legend mono">
            <span><i style={{background:'#5B8FB9'}}/>PRD</span>
            <span><i style={{background:'#C24A4A'}}/>MNP</span>
            <span><i style={{background:'#5E9B7E'}}/>FAS</span>
            <span><i style={{background:'#C9A961'}}/>VC</span>
            <span><i style={{background:'#1F2731'}}/>SIN DATOS</span>
          </div>
        </div>
      </main>

      {/* RIGHT — projection + provinces */}
      <aside className="enight__right">
        <div className="enight__panel">
          <div className="enight__panel-head"><span>PROYECCIÓN · NACIONAL</span><span>{overall}%</span></div>
          <div className="enight__panel-body" style={{padding:0}}>
            {results.map((r,i) => {
              const leader = i === 0;
              return (
                <div key={r.c} style={{padding:'10px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <div style={{display:'grid', gridTemplateColumns:'10px 1fr auto', gap:10, alignItems:'center'}}>
                    <span className="enight__result-dot" style={{background:r.col}}/>
                    <div>
                      <div className="enight__result-name">{r.n}</div>
                      <div className="enight__result-sub">{r.c} · candidato</div>
                    </div>
                    <div className="enight__result-pct" style={{color: leader?'#F4E9C8':'var(--text)'}}>
                      {r.v.toFixed(1)}%
                    </div>
                  </div>
                  <div style={{height:3, marginTop:6, background:'#1F2731'}}>
                    <div style={{height:'100%', width:`${r.v*2.4}%`, background:r.col}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="enight__panel">
          <div className="enight__panel-head"><span>PROVINCIAS · ESTADO</span><span>12</span></div>
          <div className="enight__panel-body" style={{padding:0}}>
            <div className="enight__province-list">
              {D.PROVINCES.map((p,i) => {
                const reported = Math.min(100, Math.floor(((tick*5 + i*4) % 130)));
                const status = reported >= 92 ? 'called' : reported >= 50 ? 'toss' : 'pending';
                const lean = p.leaning;
                const winner = lean > 0.2 ? 'MNP' : lean < -0.2 ? 'PRD' : 'TOSS';
                return (
                  <div key={p.id} className="enight__province-row">
                    <span className="enight__province-id">{p.id}</span>
                    <span className="enight__province-name">{p.name}</span>
                    <span className="enight__province-pct">{reported}%</span>
                    <span className={`enight__province-status enight__province-status--${status}`}>
                      {status === 'called' ? winner : status === 'toss' ? 'TOSS' : '...'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="enight__panel">
          <div className="enight__panel-head"><span>TURNOUT EST.</span><span>67.4%</span></div>
          <div className="enight__panel-body">
            <TurnoutBar tick={tick}/>
          </div>
        </div>
      </aside>

      {/* LOWER STRIP */}
      <div className="enight__lower">
        <div className="enight__lower-col">
          <div className="enight__lower-lbl">VENTAJA · 1° vs 2°</div>
          <div className="enight__lower-val" style={{color:'#F4E9C8'}}>+{(max - results[1].v).toFixed(2)}</div>
          <div className="enight__lower-sub">pts. nacional · {overall}% mesas</div>
        </div>
        <div className="enight__lower-col">
          <div className="enight__lower-lbl">TURNOUT</div>
          <div className="enight__lower-val">{(67.4 + Math.sin(tick*0.3)*0.2).toFixed(1)}%</div>
          <div className="enight__lower-sub">vs 64.1% (2022) · +3.3</div>
        </div>
        <div className="enight__lower-col">
          <div className="enight__lower-lbl">CONFIANZA · MODELO</div>
          <div className="enight__lower-val" style={{color:'var(--pos)'}}>92%</div>
          <div className="enight__lower-sub">PROYECCIÓN · GANADOR PRD</div>
        </div>
      </div>

      {/* BIG TICKER */}
      <div className="enight__bigticker">
        <div className="enight__bigticker-label">● BREAKING</div>
        <div className="enight__bigticker-track">
          <div className="enight__bigticker-inner">
            {[
              'PRD AL FRENTE EN PROYECCIÓN NACIONAL · MARGEN ±0.4 pt',
              'COSTA ATLÁNTICA REPORTA AL 71% · VASCONCELOS LIDERA',
              'LLANOS OCCIDENTALES SORPRENDE · PRD CRECE 11 pt',
              'SIERRA ANDINA EN DISPUTA · ESPERANDO 18 MESAS',
              'BAHÍA REAL CIERRA · CONCENTRACIÓN POPULAR EN PLAZA',
              'JUNTA ELECTORAL CONFIRMA: SIN INCIDENTES MAYORES',
              'CANDIDATA ORELLANA EVALÚA DECLARACIÓN',
              'MERCADOS REGIONALES REACCIONAN · BOLSA +1.8%',
            ].map((s,i) => (
              <span key={i} style={{padding:'0 36px'}}>◆ {s}</span>
            )).concat([
              <span key="loop">◆ ¡SIGUE LA COBERTURA EN VIVO! ◆</span>
            ])}
          </div>
        </div>
      </div>

      {/* Subtle confetti when leader > 30% */}
      {max > 30 && <ConfettiLayer/>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
function ConfettiLayer() {
  const pieces = useMemoEN(() => Array.from({length:60}).map(() => ({
    x: Math.random()*100,
    delay: Math.random()*8,
    dur: 6 + Math.random()*6,
    col: ['#C9A961','#5B8FB9','#C24A4A','#5E9B7E','#F4E9C8'][Math.floor(Math.random()*5)],
    rot: Math.random()*360,
  })), []);
  return (
    <div className="enight__confetti">
      {pieces.map((p,i) => (
        <i key={i} style={{
          left: `${p.x}%`,
          background: p.col,
          animationDuration: `${p.dur}s`,
          animationDelay: `${p.delay}s`,
          transform: `rotate(${p.rot}deg)`,
        }}/>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
function BigElectionMap({ tick }) {
  return (
    <svg viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="bem-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1A2230" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#060A0E" stopOpacity="0"/>
        </radialGradient>
        <pattern id="bem-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 L0 0 0 40" fill="none" stroke="#0E141B" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="1000" height="720" fill="url(#bem-grid)"/>
      <rect width="1000" height="720" fill="url(#bem-glow)"/>

      {/* hairline coordinate ticks */}
      <g stroke="#161D26" strokeWidth="0.4">
        {Array.from({length:12}).map((_,i)=><line key={'h'+i} x1="0" y1={i*60} x2="1000" y2={i*60}/>)}
        {Array.from({length:18}).map((_,i)=><line key={'v'+i} x1={i*60} y1="0" x2={i*60} y2="720"/>)}
      </g>

      {D.PROVINCES.map((p, i) => {
        const reported = Math.min(100, Math.floor(((tick*5 + i*4) % 130)));
        const lean = p.leaning;
        const winner = lean > 0.2 ? '#C24A4A' : lean < -0.2 ? '#5B8FB9' :
                       (i % 3 === 0 ? '#5E9B7E' : '#C9A961');
        const intensity = reported / 100;
        const isCalled = reported >= 92;
        const baseFill = reported < 20 ? '#1F2731' : winner;
        const baseOp = 0.3 + intensity*0.55;
        const breath = 0.95 + Math.sin(tick + p.id.charCodeAt(0)*0.4)*0.05;
        return (
          <g key={p.id}>
            <polygon points={p.polygon}
              fill={baseFill}
              fillOpacity={baseOp * breath}
              stroke={isCalled ? '#F4E9C8' : '#070A0E'}
              strokeWidth={isCalled ? 1.5 : 1}/>
            {/* pulse if toss */}
            {reported >= 50 && reported < 92 && (
              <polygon points={p.polygon} fill="none"
                stroke="#E6B948"
                strokeWidth={1 + Math.sin(tick*3 + p.id.charCodeAt(0))*0.6}
                opacity={0.5 + Math.sin(tick*3 + p.id.charCodeAt(0))*0.2}/>
            )}
          </g>
        );
      })}

      {/* labels */}
      <g>
        {D.PROVINCES.map(p => (
          <g key={'l'+p.id}>
            <text x={p.labelAt[0]} y={p.labelAt[1]} textAnchor="middle"
              fill="#F4E9C8" fontSize="11" fontFamily="Source Serif 4, serif"
              fontWeight="500">
              {p.name.toUpperCase()}
            </text>
            <text x={p.labelAt[0]} y={p.labelAt[1]+14} textAnchor="middle"
              fill="#C9A961" fontSize="9" fontFamily="IBM Plex Mono, monospace"
              letterSpacing="0.16em">
              {Math.min(100, Math.floor(((tick*5 + p.id.charCodeAt(0)*4) % 130)))}%
            </text>
          </g>
        ))}
      </g>

      {/* capital pulse */}
      <g transform="translate(500 295)">
        <circle r="6" fill="#F4E9C8"/>
        <circle r={14+Math.sin(tick*2)*4} fill="none" stroke="#F4E9C8" strokeWidth="1.2" opacity="0.6"/>
        <circle r={30+Math.sin(tick*2)*8} fill="none" stroke="#F4E9C8" strokeWidth="0.6" opacity="0.3"/>
        <text y="-22" textAnchor="middle" fill="#F4E9C8" fontSize="10"
          fontFamily="IBM Plex Mono, monospace" letterSpacing="0.18em">
          ★ CIUDAD AURORA · CAPITAL
        </text>
      </g>

      {/* "rally / celebration" marker on PRD lead provinces */}
      {D.PROVINCES.filter(p => p.leaning < -0.2).map((p,i)=>(
        <g key={'r'+p.id} transform={`translate(${p.labelAt[0] + 30} ${p.labelAt[1] - 8})`}>
          <circle r="3.5" fill="#5B8FB9"/>
          <circle r={6 + Math.sin(tick*2 + i)*1.5} fill="none" stroke="#5B8FB9" strokeWidth="0.7" opacity="0.7"/>
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
function Swingograph({ tick }) {
  const w = 320, h = 90;
  const pts = Array.from({length: 60}).map((_, i) => {
    const x = (i / 59) * w;
    const t = tick - (60 - i)*0.06;
    const y = h/2 - (Math.sin(t*0.6)*18 + Math.sin(t*1.3 + 1.4)*6);
    return [x, y];
  });
  const path = pts.map((p,i)=>(i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`)).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:'100%', height:90, display:'block'}}>
      <line x1="0" y1={h/2} x2={w} y2={h/2} stroke="#2A323E" strokeWidth="0.5"/>
      <text x="6" y="14" fill="#5B8FB9" fontSize="9"
        fontFamily="IBM Plex Mono, monospace" letterSpacing="0.16em">PRD</text>
      <text x="6" y={h-6} fill="#C24A4A" fontSize="9"
        fontFamily="IBM Plex Mono, monospace" letterSpacing="0.16em">MNP</text>
      <path d={path + ` L${w},${h} L0,${h} Z`} fill="#5B8FB9" opacity="0.12"/>
      <path d={path} fill="none" stroke="#5B8FB9" strokeWidth="1.4"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3" fill="#5B8FB9"/>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
function TurnoutBar({ tick }) {
  const tot = 67.4 + Math.sin(tick*0.3)*0.15;
  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:6,
        fontFamily:'IBM Plex Mono, monospace', fontSize:10, color:'var(--text-muted)',
        letterSpacing:'0.16em'}}>
        <span>2022 · 64.1%</span><span>HOY · {tot.toFixed(1)}%</span>
      </div>
      <div style={{height:8, background:'#1F2731', position:'relative'}}>
        <div style={{height:'100%', width:`${tot}%`, background:'linear-gradient(to right, #5E9B7E, #C9A961)'}}/>
        <div style={{position:'absolute', left:`${64.1}%`, top:-2, bottom:-2, width:1, background:'#F4E9C8'}}/>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:4, marginTop:10,
        fontFamily:'IBM Plex Mono, monospace', fontSize:10, color:'var(--text-dim)'}}>
        <div style={{display:'flex', justifyContent:'space-between'}}><span>JÓVENES 18-29</span><span style={{color:'var(--pos)'}}>+8.1pt</span></div>
        <div style={{display:'flex', justifyContent:'space-between'}}><span>RURAL</span><span style={{color:'var(--neg)'}}>-2.4pt</span></div>
        <div style={{display:'flex', justifyContent:'space-between'}}><span>METRO AURORA</span><span style={{color:'var(--pos)'}}>+5.6pt</span></div>
      </div>
    </div>
  );
}

window.ElectionNight = ElectionNight;
