/* =========================================================================
   CAMPAIGN COMMAND — Main Menu (cinematic)
   ========================================================================= */
const { useState: useStateMM, useEffect: useEffectMM, useRef: useRefMM } = React;

function MainMenu({ onStart }) {
  const [hovered, setHovered] = useStateMM('continue');
  const [tick, setTick] = useStateMM(0);

  useEffectMM(() => {
    let raf = 0;
    const loop = () => { setTick(v => v + 0.014); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const items = [
    { id:'continue',  label:'CONTINUE CAMPAIGN',    sub:'Elena Vasconcelos · PRD · Día 64/92', primary:true, target:'map' },
    { id:'new',       label:'NEW CAMPAIGN',         sub:'HQ setup · candidato · partido', target:'map' },
    { id:'career',    label:'CAREER MODE',          sub:'Carrera política multi-ciclo · 1992 → 2046' },
    { id:'party',     label:'PARTY MODE',           sub:'Convención · maquinaria electoral' },
    { id:'scenarios', label:'HISTORICAL SCENARIOS', sub:'18 escenarios · 1953 – 2024' },
    { id:'multi',     label:'MULTIPLAYER',          sub:'War room digital · hot-seat · ranked' },
    { id:'election',  label:'ELECTION NIGHT MODE',  sub:'Cobertura en vivo · 14·OCT·2026', target:'election' },
    { id:'media',     label:'MEDIA ECOSYSTEM',      sub:'Stream · prensa · podcasts · trends', target:'media' },
    { id:'mods',      label:'MODS · WORKSHOP',      sub:'412 instalados · 18 actualizaciones' },
    { id:'settings',  label:'SETTINGS',             sub:'Audio · video · IA · accesibilidad' },
  ];

  const detail = items.find(i => i.id === hovered);

  return (
    <div className="cmenu">
      {/* === LIVING BACKGROUND LAYERS ============================== */}
      <div className="cmenu__bg" aria-hidden="true">
        {/* base map silhouette */}
        <svg viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid slice" className="cmenu__map">
          <defs>
            <radialGradient id="cmenu-rad" cx="50%" cy="48%" r="62%">
              <stop offset="0%" stopColor="#1A2230" stopOpacity="0.85"/>
              <stop offset="100%" stopColor="#070A0E" stopOpacity="1"/>
            </radialGradient>
            <linearGradient id="cmenu-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0C1118" stopOpacity="1"/>
              <stop offset="100%" stopColor="#0A0D11" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1000" height="720" fill="url(#cmenu-rad)"/>
          <rect x="0" y="0" width="1000" height="240" fill="url(#cmenu-sky)"/>
          {/* breathing capital pulse */}
          <g>
            <circle cx="500" cy="295" r={4} fill="#C9A961"/>
            <circle cx="500" cy="295" r={14+Math.sin(tick*1.6)*4} fill="none" stroke="#C9A961" strokeWidth="0.6" opacity="0.55"/>
            <circle cx="500" cy="295" r={32+Math.sin(tick*1.6)*8} fill="none" stroke="#C9A961" strokeWidth="0.3" opacity="0.3"/>
          </g>
          {/* province silhouettes */}
          <g>
            {D.PROVINCES.map(p => (
              <polygon key={p.id} points={p.polygon}
                fill="#11171F"
                fillOpacity={0.55 + Math.sin(tick + p.id.charCodeAt(0)*0.4)*0.06}
                stroke="#1F2731" strokeWidth="0.7"/>
            ))}
          </g>
          {/* coordinate hairlines */}
          <g stroke="#161D26" strokeWidth="0.4">
            {Array.from({length:12}).map((_,i)=>(
              <line key={'h'+i} x1="0" y1={i*60} x2="1000" y2={i*60}/>
            ))}
            {Array.from({length:18}).map((_,i)=>(
              <line key={'v'+i} x1={i*60} y1="0" x2={i*60} y2="720"/>
            ))}
          </g>
          {/* helicopter trace path (slow arc) */}
          <g>
            <circle
              cx={150 + ((tick*22) % 800)}
              cy={120 + Math.sin(tick*0.8)*30}
              r="2" fill="#C9A961" opacity="0.85"/>
            <circle
              cx={150 + ((tick*22) % 800)}
              cy={120 + Math.sin(tick*0.8)*30}
              r="5" fill="none" stroke="#C9A961" strokeWidth="0.3" opacity="0.45"/>
          </g>
        </svg>

        {/* crowd silhouette band (parallax) */}
        <div className="cmenu__crowd cmenu__crowd--far" style={{transform:`translateX(${-((tick*4)%60)}px)`}}/>
        <div className="cmenu__crowd cmenu__crowd--near" style={{transform:`translateX(${-((tick*9)%80)}px)`}}/>

        {/* camera flashes (rare random) */}
        <CameraFlashes tick={tick}/>

        {/* atmosphere */}
        <div className="cmenu__vignette"/>
        <div className="cmenu__scan"/>
        <div className="cmenu__grain"/>
      </div>

      {/* === CHROME ===================================================== */}
      <header className="cmenu__top">
        <div className="cmenu__top-l">
          <div className="cmenu__seal mono">▣ CC·001</div>
          <div className="cmenu__stampline mono">CAMPAIGN OPERATIONS SYSTEM · v1.4.2 · STABLE</div>
        </div>
        <div className="cmenu__top-c mono">
          <span className="dot dot--live"/>
          <span>NARRATIVE AI SERVER · ONLINE</span>
          <span className="sep">│</span>
          <span>3.1M PLAYERS · WK 42</span>
        </div>
        <div className="cmenu__top-r mono">
          <div>BUILD 26.05.21 · EU-WEST · 32ms</div>
          <div>SESSION #4471 · AUTH OK</div>
        </div>
      </header>

      {/* === IDENTITY ==================================================== */}
      <div className="cmenu__identity">
        <div className="cmenu__eyebrow mono">A SIMULATION OF POWER · 2026</div>
        <h1 className="cmenu__title">CAMPAIGN<span>COMMAND</span></h1>
        <div className="cmenu__sub-title mono">CAMPAIGN OPERATIONS SYSTEM</div>
        <div className="cmenu__rule"/>
        <div className="cmenu__tagline">
          El poder se conquista una decisión a la vez.
        </div>
        <div className="cmenu__metaline mono">
          REPÚBLICA DE SAN ESTEBAN · CICLO ELECTORAL 2026 · 28 DÍAS PARA LAS GENERALES
        </div>
        <div className="cmenu__crosshair cmenu__crosshair--tl"/>
        <div className="cmenu__crosshair cmenu__crosshair--tr"/>
        <div className="cmenu__crosshair cmenu__crosshair--bl"/>
        <div className="cmenu__crosshair cmenu__crosshair--br"/>
      </div>

      {/* === LEFT LIST =================================================== */}
      <aside className="cmenu__list">
        <div className="cmenu__listhead mono">
          <span>NAVEGACIÓN PRINCIPAL</span>
          <span>{String(items.length).padStart(2,'0')} · MODES</span>
        </div>
        {items.map((it, i) => (
          <button key={it.id}
            className={`cmitem ${hovered===it.id?'cmitem--hover':''} ${it.primary?'cmitem--primary':''}`}
            onMouseEnter={()=>setHovered(it.id)}
            onFocus={()=>setHovered(it.id)}
            onClick={()=>{
              if (it.target) onStart(it.target);
            }}>
            <span className="cmitem__idx mono">{String(i+1).padStart(2,'0')}</span>
            <span className="cmitem__label">{it.label}</span>
            <span className="cmitem__arrow mono">→</span>
            <span className="cmitem__bar"/>
          </button>
        ))}
        <div className="cmenu__listfoot mono">
          <span>↑↓ NAV</span><span>↵ SELECT</span><span>ESC EXIT</span>
        </div>
      </aside>

      {/* === RIGHT: MODE PREVIEW (cinematic scene) ====================== */}
      <section className="cmenu__preview">
        <div className="cmenu__preview-head mono">
          <span>// MODE PREVIEW</span>
          <span>{String(items.findIndex(i=>i.id===hovered)+1).padStart(2,'0')}/{String(items.length).padStart(2,'0')}</span>
        </div>
        <div className="cmenu__preview-body">
          <ModePreview id={hovered} tick={tick} onStart={onStart} detail={detail}/>
        </div>
      </section>

      {/* === BOTTOM TICKER STRIP ========================================= */}
      <footer className="cmenu__bottom">
        <div className="cmenu__bottom-track">
          <div className="cmenu__bottom-inner">
            {[...D.NEWS, ...D.NEWS].map((n,i)=>(
              <span key={i} className="cmenu__bottom-item mono">
                <span className="cmenu__bottom-time">{n.time}</span>
                <span className="cmenu__bottom-src">{n.src}</span>
                <span className={`cmenu__bottom-headline tone--${n.tone}`}>{n.headline}</span>
                <span className="cmenu__bottom-sep">◆</span>
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* CameraFlashes — sporadic flash bursts                                     */
/* ------------------------------------------------------------------------- */
function CameraFlashes({ tick }) {
  const flashes = React.useMemo(() => {
    return Array.from({length: 14}).map((_,i) => ({
      x: 8 + Math.random()*84,
      y: 62 + Math.random()*32,
      phase: Math.random()*9,
      every: 5 + Math.random()*7,
    }));
  }, []);
  return (
    <div className="cmenu__flashes">
      {flashes.map((f,i) => {
        const t = ((tick + f.phase) % f.every) / f.every;
        const on = t < 0.04;
        return (
          <span key={i} className="cmenu__flash"
            style={{
              left:`${f.x}%`, top:`${f.y}%`,
              opacity: on ? 1 : 0,
              transform: on ? 'scale(1.4)' : 'scale(1)',
            }}/>
        );
      })}
    </div>
  );
}

/* ========================================================================= */
/* ModePreview — switchboard                                                 */
/* ========================================================================= */
function ModePreview({ id, tick, onStart, detail }) {
  if (id === 'continue')  return <PreviewContinue tick={tick} onStart={onStart} detail={detail}/>;
  if (id === 'career')    return <PreviewCareer    tick={tick} onStart={onStart}/>;
  if (id === 'party')     return <PreviewParty     tick={tick} onStart={onStart}/>;
  if (id === 'new')       return <PreviewNewCampaign tick={tick} onStart={onStart}/>;
  if (id === 'scenarios') return <PreviewScenarios tick={tick} onStart={onStart}/>;
  if (id === 'multi')     return <PreviewMultiplayer tick={tick} onStart={onStart}/>;
  if (id === 'election')  return <PreviewElection  tick={tick} onStart={onStart}/>;
  if (id === 'media')     return <PreviewMedia     tick={tick} onStart={onStart}/>;
  return <PreviewSimple detail={detail}/>;
}

/* ================================================== CONTINUE preview ===== */
function PreviewContinue({ tick, onStart }) {
  return (
    <div className="mp">
      <SceneFrame label="ÚLTIMA PARTIDA" caption="14·SEP·2026 · 23:41">
        <RallyScene tick={tick} small/>
      </SceneFrame>
      <div className="mp__title">CONTINUE CAMPAIGN</div>
      <div className="mp__sub">Elena Vasconcelos · Partido Reformista Democrático</div>

      <div className="mp__rows">
        <Row k="CANDIDATA"      v="Elena Vasconcelos · 47"/>
        <Row k="PARTIDO"        v="PRD · Centro-izquierda"/>
        <Row k="INTENCIÓN VOTO" v={<span className="accent-pos">31% · +1.2</span>}/>
        <Row k="APROBACIÓN"     v="47%"/>
        <Row k="WAR CHEST"      v="$14.4M"/>
        <Row k="PRÓX. EVENTO"   v={<span className="accent-warm">Debate Nacional · 3d</span>}/>
      </div>

      <div className="mp__mini">
        <svg viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid meet">
          {D.PROVINCES.map(p => {
            const lean = p.leaning;
            const fill = lean > 0.2 ? '#C24A4A' : lean < -0.2 ? '#5B8FB9' : '#C9A961';
            return <polygon key={p.id} points={p.polygon} fill={fill} opacity="0.55" stroke="#0A0D11" strokeWidth="2"/>;
          })}
        </svg>
        <div className="mp__mini-legend mono">
          <span><i style={{background:'#5B8FB9'}}/>PRD</span>
          <span><i style={{background:'#C9A961'}}/>VC</span>
          <span><i style={{background:'#C24A4A'}}/>MNP</span>
        </div>
      </div>

      <button className="mp__cta" onClick={()=>onStart('map')}>
        <span>RESUMIR PARTIDA</span><span className="mono">↵</span>
      </button>
    </div>
  );
}

/* ================================================== CAREER preview ====== */
function PreviewCareer({ tick, onStart }) {
  return (
    <div className="mp">
      <SceneFrame label="ESCENA · RALLY NACIONAL" caption="ESTADIO · 22:00 · NIEBLA + FLASHES">
        <RallyScene tick={tick}/>
      </SceneFrame>
      <div className="mp__title">CAREER MODE</div>
      <div className="mp__sub">Una carrera política completa. Desde concejal hasta presidencia. Multi-ciclo, multi-décadas.</div>

      <div className="mp__pillars">
        <Pillar k="01" t="ASCENSO" s="Concejal → Diputado → Gobernador → Presidente"/>
        <Pillar k="02" t="LEGADO" s="Cada decisión persiste 30 años en la simulación"/>
        <Pillar k="03" t="RIVALES" s="IA narrativa genera adversarios y aliados con memoria"/>
      </div>

      <div className="mp__timeline mono">
        <div className="mp__timeline-head"><span>LÍNEA DE TIEMPO</span><span>1992 — 2046</span></div>
        <svg viewBox="0 0 360 56" className="mp__timeline-svg">
          <line x1="6" y1="40" x2="354" y2="40" stroke="#2A323E" strokeWidth="1"/>
          {[1992,2000,2008,2016,2024,2032,2040].map((y,i)=>(
            <g key={y} transform={`translate(${6 + i*58} 40)`}>
              <line y2="-6" stroke="#C9A961" strokeWidth="1"/>
              <text y="-10" textAnchor="middle" fill="#8C95A0" fontSize="8">{y}</text>
            </g>
          ))}
          <circle cx={6 + ((tick*8)%(58*6))} cy="40" r="3" fill="#C9A961"/>
        </svg>
      </div>
      <button className="mp__cta" onClick={()=>onStart('map')}>
        <span>INICIAR CARRERA</span><span className="mono">↵</span>
      </button>
    </div>
  );
}

/* ================================================== PARTY preview ======= */
function PreviewParty({ tick, onStart }) {
  return (
    <div className="mp">
      <SceneFrame label="ESCENA · CONVENCIÓN" caption="SALÓN 04 · 412 DELEGADOS · 03:21">
        <ConventionScene tick={tick}/>
      </SceneFrame>
      <div className="mp__title">PARTY MODE</div>
      <div className="mp__sub">No diriges un candidato. Diriges el partido. Gestionas listas, facciones internas, finanzas y maquinaria territorial.</div>

      <div className="mp__factions">
        <div className="mp__faction"><span className="mp__faction-dot" style={{background:'#5E9B7E'}}/><span>RENOVADORES</span><span className="mono">38%</span></div>
        <div className="mp__faction"><span className="mp__faction-dot" style={{background:'#C9A961'}}/><span>VIEJA GUARDIA</span><span className="mono">31%</span></div>
        <div className="mp__faction"><span className="mp__faction-dot" style={{background:'#5B8FB9'}}/><span>TERRITORIALES</span><span className="mono">22%</span></div>
        <div className="mp__faction"><span className="mp__faction-dot" style={{background:'#C24A4A'}}/><span>INDEPENDIENTES</span><span className="mono">9%</span></div>
      </div>

      <div className="mp__rows">
        <Row k="DELEGADOS"      v="412"/>
        <Row k="FACCIONES"      v="4 · 1 quiebra latente"/>
        <Row k="LISTAS"         v="12 provinciales · 220 candidatos"/>
        <Row k="FINANZAS"       v="$3.4M en caja · $1.1M deuda"/>
      </div>

      <button className="mp__cta" onClick={()=>onStart('map')}>
        <span>ENTRAR A LA CONVENCIÓN</span><span className="mono">↵</span>
      </button>
    </div>
  );
}

/* ================================================== NEW CAMPAIGN ======== */
function PreviewNewCampaign({ tick, onStart }) {
  return (
    <div className="mp">
      <SceneFrame label="ESCENA · HEADQUARTERS" caption="OFICINA 12 · WHITEBOARDS · ENCUESTAS">
        <HQScene tick={tick}/>
      </SceneFrame>
      <div className="mp__title">NEW CAMPAIGN</div>
      <div className="mp__sub">Setup completo: candidato, partido, ideología, plataforma, equipo, presupuesto inicial.</div>

      <div className="mp__setup">
        <div className="mp__setup-row mono">
          <span>IDEOLOGÍA</span>
          <div className="mp__slider">
            <span>IZQ</span>
            <div className="mp__slider-track"><div className="mp__slider-fill" style={{width:'42%'}}/></div>
            <span>DER</span>
          </div>
        </div>
        <div className="mp__setup-row mono">
          <span>POPULISMO</span>
          <div className="mp__slider">
            <span>—</span>
            <div className="mp__slider-track"><div className="mp__slider-fill" style={{width:'67%', background:'#E6B948'}}/></div>
            <span>+</span>
          </div>
        </div>
        <div className="mp__setup-row mono">
          <span>EXPERIENCIA</span>
          <div className="mp__slider">
            <span>—</span>
            <div className="mp__slider-track"><div className="mp__slider-fill" style={{width:'78%', background:'#5E9B7E'}}/></div>
            <span>+</span>
          </div>
        </div>
      </div>

      <div className="mp__rows">
        <Row k="DIFICULTAD"   v="ESTÁNDAR"/>
        <Row k="MAPA"         v="República de San Esteban · 2026"/>
        <Row k="DURACIÓN EST."v="6–8h"/>
      </div>

      <button className="mp__cta" onClick={()=>onStart('map')}>
        <span>CONFIGURAR CAMPAÑA</span><span className="mono">↵</span>
      </button>
    </div>
  );
}

/* ================================================== SCENARIOS =========== */
function PreviewScenarios({ tick, onStart }) {
  const scenarios = [
    { y:'1953', t:'EL GOLPE',                d:'Provisional · 14 días para constituyente'},
    { y:'1973', t:'CRISIS DEL PETRÓLEO',     d:'Inflación 312% · 8 candidatos · turbulento'},
    { y:'1989', t:'TRANSICIÓN',              d:'Primer ciclo democrático moderno'},
    { y:'2001', t:'COLAPSO ECONÓMICO',       d:'Default · 5 presidentes en 11 días'},
    { y:'2015', t:'CICLO ROSA',              d:'Segunda ola de izquierda regional'},
    { y:'2024', t:'POLARIZACIÓN',            d:'Segunda vuelta · margen ±0.3%'},
  ];
  return (
    <div className="mp mp--archive">
      <SceneFrame label="ARCHIVO HISTÓRICO" caption="ROLLO 04 · TELEVISIÓN PÚBLICA · MICROFILM">
        <ArchiveScene tick={tick}/>
      </SceneFrame>
      <div className="mp__title">HISTORICAL SCENARIOS</div>
      <div className="mp__sub">18 momentos clave de la historia política. Reescribe el pasado con tus decisiones.</div>

      <div className="mp__scenarios">
        {scenarios.map((s,i)=>(
          <div key={i} className="mp__scenario">
            <span className="mp__scenario-y mono">{s.y}</span>
            <div className="mp__scenario-mid">
              <div className="mp__scenario-t">{s.t}</div>
              <div className="mp__scenario-d">{s.d}</div>
            </div>
            <span className="mp__scenario-arrow mono">→</span>
          </div>
        ))}
      </div>

      <button className="mp__cta" onClick={()=>onStart('map')}>
        <span>EXPLORAR ARCHIVO</span><span className="mono">↵</span>
      </button>
    </div>
  );
}

/* ================================================== MULTIPLAYER ========= */
function PreviewMultiplayer({ tick, onStart }) {
  return (
    <div className="mp">
      <SceneFrame label="ESCENA · WAR ROOM DIGITAL" caption="5 SESIONES · LIVE">
        <WarRoomScene tick={tick}/>
      </SceneFrame>
      <div className="mp__title">MULTIPLAYER</div>
      <div className="mp__sub">Hasta 8 jugadores. Cada uno comanda un partido. Negociación, alianzas, traiciones, debates en vivo.</div>

      <div className="mp__lobby">
        <div className="mp__lobby-head mono"><span>LOBBIES ABIERTOS</span><span>147 EN VIVO</span></div>
        <div className="mp__lobby-row">
          <span className="mono accent-warm">RANKED</span>
          <span>San Esteban · 2028 · 6/8</span>
          <span className="mono">ELO 1840</span>
        </div>
        <div className="mp__lobby-row">
          <span className="mono">CASUAL</span>
          <span>1989 Transición · 4/6</span>
          <span className="mono">—</span>
        </div>
        <div className="mp__lobby-row">
          <span className="mono accent-pos">FRIENDS</span>
          <span>Marcos · invitado</span>
          <span className="mono">2/2</span>
        </div>
      </div>

      <div className="mp__rows">
        <Row k="MODO"        v="Hot-seat · asíncrono · ranked"/>
        <Row k="DURACIÓN"    v="45 min – 2h por sesión"/>
        <Row k="TU ELO"      v="1842 · TOP 7%"/>
      </div>

      <button className="mp__cta" onClick={()=>onStart('map')}>
        <span>BUSCAR PARTIDA</span><span className="mono">↵</span>
      </button>
    </div>
  );
}

/* ================================================== ELECTION ============ */
function PreviewElection({ tick, onStart }) {
  return (
    <div className="mp">
      <SceneFrame label="LIVE · NOCHE ELECTORAL" caption="14·OCT·2026 · 21:47 · RESULTADOS PARCIALES" red>
        <ElectionNightScene tick={tick}/>
      </SceneFrame>
      <div className="mp__title">ELECTION NIGHT MODE</div>
      <div className="mp__sub">La noche más importante del ciclo. Cobertura en vivo, mesas reportando, swings dramáticos, breaking news.</div>

      <div className="mp__live">
        <div className="mp__live-row">
          <span className="mp__live-dot" style={{background:'#5B8FB9'}}/>
          <span>PRD · Vasconcelos</span>
          <span className="mono mp__live-pct">29.4%</span>
          <span className="mono accent-pos">▲</span>
        </div>
        <div className="mp__live-row">
          <span className="mp__live-dot" style={{background:'#C24A4A'}}/>
          <span>MNP · Orellana</span>
          <span className="mono mp__live-pct">28.1%</span>
          <span className="mono accent-neg">▼</span>
        </div>
        <div className="mp__live-row">
          <span className="mp__live-dot" style={{background:'#5E9B7E'}}/>
          <span>FAS · Linares</span>
          <span className="mono mp__live-pct">21.8%</span>
          <span className="mono">—</span>
        </div>
      </div>

      <button className="mp__cta mp__cta--alert" onClick={()=>onStart('election')}>
        <span>ENTRAR EN VIVO</span><span className="mono">↵</span>
      </button>
    </div>
  );
}

/* ================================================== MEDIA =============== */
function PreviewMedia({ tick, onStart }) {
  return (
    <div className="mp">
      <SceneFrame label="MEDIA ECOSYSTEM" caption="STREAM · PRENSA · PODCAST · TRENDS">
        <MediaPreviewScene tick={tick}/>
      </SceneFrame>
      <div className="mp__title">MEDIA ECOSYSTEM</div>
      <div className="mp__sub">Tu campaña vive y muere en el ecosistema mediático. Posts, trends, ruedas de prensa, comentaristas, livestreams.</div>

      <div className="mp__rows">
        <Row k="STREAM (PULSE)"     v="412k followers · +1.8k/d"/>
        <Row k="PRENSA TV"          v="3 ruedas activas · 12 menciones/h"/>
        <Row k="PODCASTS"           v="8 comentaristas · 2 hostiles"/>
        <Row k="TENDENCIAS"         v="#Vasconcelos2026 · #1"/>
      </div>

      <button className="mp__cta" onClick={()=>onStart('media')}>
        <span>ABRIR ECOSYSTEM</span><span className="mono">↵</span>
      </button>
    </div>
  );
}

/* ================================================== generic ============= */
function PreviewSimple({ detail }) {
  return (
    <div className="mp mp--simple">
      <div className="mp__title">{detail.label}</div>
      <div className="mp__sub">{detail.sub}</div>
      <div className="mp__simple-art mono">
        ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▯ ▯ ▯ ▯ ▯ ▯ ▯ ▯<br/>
        — MÓDULO EXTERNO —
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Helpers                                                                   */
/* ------------------------------------------------------------------------- */
function Row({ k, v }) {
  return (
    <div className="mp__row">
      <span className="mp__row-k mono">{k}</span>
      <span className="mp__row-v">{v}</span>
    </div>
  );
}
function Pillar({ k, t, s }) {
  return (
    <div className="mp__pillar">
      <span className="mp__pillar-idx mono">{k}</span>
      <span className="mp__pillar-t">{t}</span>
      <span className="mp__pillar-s">{s}</span>
    </div>
  );
}
function SceneFrame({ label, caption, children, red }) {
  return (
    <div className={`scene ${red?'scene--red':''}`}>
      <div className="scene__head mono">
        <span>{label}</span><span>{caption}</span>
      </div>
      <div className="scene__body">{children}</div>
      <div className="scene__corner scene__corner--tl"/>
      <div className="scene__corner scene__corner--tr"/>
      <div className="scene__corner scene__corner--bl"/>
      <div className="scene__corner scene__corner--br"/>
      <div className="scene__scan"/>
      <div className="scene__rec mono">● REC</div>
    </div>
  );
}

window.MainMenu = MainMenu;
