/* =========================================================================
   CAMPAIGN COMMAND — Map View (War Room edition)
   Strategic, cinematic, layered. Geopolitical command center.
   ========================================================================= */
const { useState: useStateMV, useMemo: useMemoMV, useEffect: useEffectMV, useRef: useRefMV } = React;

const OVERLAYS = [
  { id:'intent',   label:'Intención de Voto',     icon:'◐', cat:'A' },
  { id:'momentum', label:'Momentum',              icon:'▲', cat:'A' },
  { id:'issues',   label:'Issue Dominante',       icon:'◆', cat:'A' },
  { id:'turnout',  label:'Turnout Estimado',      icon:'◯', cat:'B' },
  { id:'polar',    label:'Polarización',          icon:'⌖', cat:'B' },
  { id:'crisis',   label:'Crisis & Tensión',      icon:'△', cat:'B' },
  { id:'econ',     label:'Indicador Económico',   icon:'$', cat:'C' },
  { id:'approval', label:'Aprobación Personal',   icon:'✓', cat:'C' },
  { id:'media',    label:'Influencia Mediática',  icon:'◉', cat:'C' },
  { id:'infra',    label:'Infraestructura',       icon:'⊞', cat:'D' },
  { id:'demo',     label:'Bloques Demográficos',  icon:'✦', cat:'D' },
  { id:'ideol',    label:'Distribución Ideológica',icon:'⇌', cat:'D' },
];

const OVERLAY_GROUPS = [
  { cat:'A', label:'POLÍTICA · ELECTORAL' },
  { cat:'B', label:'SOCIAL · TENSIÓN' },
  { cat:'C', label:'ECONOMÍA · MEDIA' },
  { cat:'D', label:'DEMOGRAFÍA · INFRA' },
];

const ACTIONS = [
  { id:'rally',  label:'RALLY',         cost:'$1.2M · 1d',  desc:'Acto masivo en la provincia seleccionada', icon:'★' },
  { id:'ad',     label:'AD BUY',        cost:'$0.6M',        desc:'Pauta televisiva regional 48h', icon:'◐' },
  { id:'door',   label:'DOOR-TO-DOOR',  cost:'$0.2M · 2d',   desc:'Operativo de movilización territorial', icon:'⊞' },
  { id:'speech', label:'POLICY SPEECH', cost:'1d',           desc:'Anunciar propuesta sobre issue dominante', icon:'✎' },
  { id:'fund',   label:'FUNDRAISER',    cost:'1d',           desc:'Cena de recaudación · alto-perfil', icon:'$' },
  { id:'travel', label:'TRAVEL',        cost:'$0.3M · 1d',   desc:'Trasladar candidata a la provincia', icon:'➤' },
];

/* recent campaign tour for Vasconcelos — drawn as animated path */
const TOUR_PATH = ['VC','CA','VC','SA','VC','LO','VC'];

/* small ambient rally markers placed by hand */
const RALLY_PINS = [
  { x:730, y:160, p:'CA', label:'BAHÍA REAL', size:'big', when:'HOY · 20h' },
  { x:285, y:150, p:'NF', label:'PUERTO MIRAGE', size:'med', when:'AYER · 19h' },
  { x:500, y:295, p:'VC', label:'CIUDAD AURORA', size:'small', when:'D-2' },
];

function lerpColor(c1, c2, t) {
  const h = (c) => [parseInt(c.slice(1,3),16), parseInt(c.slice(3,5),16), parseInt(c.slice(5,7),16)];
  const [r1,g1,b1] = h(c1); const [r2,g2,b2] = h(c2);
  const mix = (a,b)=>Math.round(a+(b-a)*t).toString(16).padStart(2,'0');
  return `#${mix(r1,r2)}${mix(g1,g2)}${mix(b1,b2)}`;
}

function provinceColor(p, overlay) {
  switch (overlay) {
    case 'intent': {
      const winner = Object.entries(p.intent).sort((a,b)=>b[1]-a[1])[0];
      return D.PARTIES[winner[0]].color;
    }
    case 'momentum': {
      const t = Math.max(-8, Math.min(8, p.momentum));
      if (t >= 0) return lerpColor('#2A2F38', '#5E9B7E', t/8);
      return lerpColor('#2A2F38', '#C24A4A', -t/8);
    }
    case 'issues': {
      const m = { 'Seguridad fronteriza':'#C24A4A','Minería y agua':'#5E9B7E','Turismo y empleo':'#5B8FB9',
                  'Sequía y agro':'#E6B948','Costo de vida':'#C9A961','Puerto y comercio':'#5B8FB9',
                  'Pueblos originarios':'#5E9B7E','Inundaciones':'#5B8FB9','Pesca y energía':'#C9A961',
                  'Ganadería y exportaciones':'#C9A961','Deforestación':'#5E9B7E','Soberanía austral':'#C24A4A' };
      return m[p.dominantIssue] || '#5A6470';
    }
    case 'turnout': return lerpColor('#2A2F38', '#C9A961', Math.max(0,Math.min(1,(p.turnout-45)/35)));
    case 'polar':   return lerpColor('#2A2F38', '#C24A4A', Math.min(1, Math.abs(p.leaning)*1.6));
    case 'crisis':  return lerpColor('#2A2F38', '#C24A4A', Math.min(1, p.crisis/8));
    case 'econ':    return lerpColor('#2A2F38', '#5E9B7E', Math.max(0,Math.min(1,(p.gdp-2)/8)));
    case 'approval':return lerpColor('#2A2F38', '#5B8FB9', Math.max(0,Math.min(1,(p.approval-30)/30)));
    case 'media': {
      const m = (p.population * (p.turnout/100)); // proxy
      return lerpColor('#2A2F38', '#9C7BD9', Math.min(1, m/4));
    }
    case 'infra': {
      const i = (p.gdp/10) + (p.turnout/100); // proxy
      return lerpColor('#2A2F38', '#5B8FB9', Math.min(1, i/1.7));
    }
    case 'demo': {
      // urban / rural / coastal blocs by region
      const m = { 'Norte':'#C9A961', 'Centro':'#5B8FB9', 'Oeste':'#E6B948', 'Sur':'#5E9B7E', 'Austral':'#9C7BD9' };
      return m[p.region] || '#5A6470';
    }
    case 'ideol': {
      // leaning axis: blue (-1) → red (+1)
      const v = (p.leaning + 1) / 2; // 0..1
      return lerpColor('#5B8FB9', '#C24A4A', v);
    }
    default: return '#2A2F38';
  }
}

/* -------------------------------------------------------------- ProvincePopover */
function ProvincePopover({ p, x, y, tick }) {
  if (!p) return null;
  const top = Object.entries(p.intent).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const lead = top[0];
  const lead2 = top[1];
  const gap = lead[1] - lead2[1];
  const trend = Array.from({length:14}).map((_,i)=>lead[1] - 4 + Math.sin((tick - i*0.3)*0.6 + p.id.charCodeAt(0))*2 + (i*0.06));
  return (
    <div className="ppop ppop--war" style={{ left:x, top:y }}>
      <div className="ppop__corner ppop__corner--tl"/>
      <div className="ppop__corner ppop__corner--tr"/>
      <div className="ppop__corner ppop__corner--bl"/>
      <div className="ppop__corner ppop__corner--br"/>
      <div className="ppop__head">
        <div className="ppop__id mono">PROV · {p.id}</div>
        <div className="ppop__name">{p.name}</div>
        <div className="ppop__cap mono">{p.capital} · {p.region.toUpperCase()}</div>
      </div>
      <div className="ppop__row mono"><span>POBLACIÓN</span><span>{p.population}M · {(p.population/19.4*100).toFixed(1)}%</span></div>
      <div className="ppop__row mono"><span>TURNOUT</span><span>{p.turnout}%</span></div>
      <div className="ppop__row mono">
        <span>MOMENTUM</span>
        <span className={p.momentum>0?'accent-pos':p.momentum<0?'accent-neg':''}>
          {p.momentum>0?'▲ +':p.momentum<0?'▼ ':'· '}{Math.abs(p.momentum)}
        </span>
      </div>
      <div className="ppop__row mono">
        <span>GAP 1° vs 2°</span>
        <span className={gap < 4 ? 'accent-warm' : ''}>{gap.toFixed(0)}pt {gap<4?'· SWING':''}</span>
      </div>
      <div className="ppop__bars">
        {top.map(([id, v]) => {
          const party = D.PARTIES[id];
          return (
            <div key={id} className="ppop__bar">
              <span className="mono" style={{color:party.color}}>{party.short}</span>
              <div className="ppop__bartrack"><div style={{width:`${v*2}%`, background:party.color}}/></div>
              <span className="mono">{v}%</span>
            </div>
          );
        })}
      </div>
      <div className="ppop__trend">
        <span className="mono ppop__trend-lbl">TREND · 14d</span>
        <svg viewBox="0 0 140 24" className="ppop__trend-svg" preserveAspectRatio="none">
          <polyline
            points={trend.map((v,i)=>`${i*10},${24 - ((v - Math.min(...trend))/(Math.max(...trend)-Math.min(...trend)||1))*22 - 1}`).join(' ')}
            fill="none" stroke={D.PARTIES[lead[0]].color} strokeWidth="1.4"/>
        </svg>
      </div>
      <div className="ppop__hint mono">▸ CLICK PARA DOSSIER COMPLETO</div>
    </div>
  );
}

/* -------------------------------------------------------------- ProvinceDossier */
function ProvinceDossier({ p, onClose }) {
  if (!p) return null;
  const sorted = Object.entries(p.intent).sort((a,b)=>b[1]-a[1]);
  return (
    <PanelChrome
      label={`PROV · ${p.id}`}
      caption={p.name.toUpperCase()}
      right={<button className="iconbtn" onClick={onClose}>✕</button>}
    >
      <div className="dossier">
        <div className="dossier__top">
          <div>
            <div className="dossier__capital mono">CAPITAL · {p.capital}</div>
            <div className="dossier__blurb">{p.blurb}</div>
          </div>
          <div className="dossier__stamp mono">
            <div>POB</div>
            <div className="dossier__stamp-val">{p.population}<small>M</small></div>
          </div>
        </div>

        <div className="dossier__grid">
          <StatTile label="TURNOUT EST." value={`${p.turnout}%`} />
          <StatTile label="APROBACIÓN"   value={`${p.approval}%`} />
          <StatTile label="CRISIS LV"    value={`${p.crisis}/10`} accent={p.crisis>=5?'#C24A4A':'#E8E6E1'}/>
          <StatTile label="GDP REGIONAL" value={`${p.gdp}`} sub="bn PSE"/>
        </div>

        <SectionHead index="01" title="INTENCIÓN DE VOTO" sub="↑ proyección 72h" />
        <div className="dossier__bars">
          {sorted.map(([id, v]) => {
            const party = D.PARTIES[id];
            return (
              <div key={id} className="vbar">
                <div className="vbar__head">
                  <span className="vbar__dot" style={{background:party.color}}/>
                  <span className="vbar__short mono">{party.short}</span>
                  <span className="vbar__name">{party.name}</span>
                  <span className="vbar__pct mono">{v}%</span>
                </div>
                <div className="vbar__track"><div className="vbar__fill" style={{width:`${v*2}%`, background:party.color}}/></div>
              </div>
            );
          })}
        </div>

        <SectionHead index="02" title="ISSUE DOMINANTE" />
        <div className="dossier__issue">
          <span className="dossier__issue-tag mono">PRIORIDAD</span>
          <span className="dossier__issue-name">{p.dominantIssue}</span>
        </div>

        <SectionHead index="03" title="ACCIONES SUGERIDAS" />
        <div className="dossier__actions">
          <button className="suggest">RALLY EN {p.capital.toUpperCase()} <span className="mono">+3.2pts est.</span></button>
          <button className="suggest">PAUTA TV REGIONAL <span className="mono">+1.8pts est.</span></button>
          <button className="suggest">VISITA TERRITORIAL <span className="mono">+2.4pts est.</span></button>
        </div>
      </div>
    </PanelChrome>
  );
}

/* -------------------------------------------------------------- NationalOverview */
function NationalOverview() {
  const C = D.COUNTRY;
  const totalPop = D.PROVINCES.reduce((s,p)=>s+p.population, 0);
  const intent = {};
  D.PROVINCES.forEach(p => {
    Object.entries(p.intent).forEach(([k,v]) => { intent[k] = (intent[k]||0) + v*p.population; });
  });
  Object.keys(intent).forEach(k => intent[k] = intent[k]/totalPop);
  const sorted = Object.entries(intent).sort((a,b)=>b[1]-a[1]);

  return (
    <PanelChrome label="NACIONAL" caption="VISTA AGREGADA · 12 PROVINCIAS">
      <div className="natov">
        <div className="natov__grid">
          <StatTile label="POBLACIÓN" value={`${C.population}M`}/>
          <StatTile label="ELECT. HÁBIL" value="19.4M" sub="72.1% padrón"/>
          <StatTile label="GDP TOTAL" value={`$${C.gdp}bn`} sub="PSE"/>
          <StatTile label="CICLO" value="64/92" sub="día"/>
        </div>

        <SectionHead index="01" title="PROYECCIÓN NACIONAL" sub="ponderada por población"/>
        <div className="natov__bars">
          {sorted.map(([id, v]) => {
            const party = D.PARTIES[id];
            return (
              <div key={id} className="vbar">
                <div className="vbar__head">
                  <span className="vbar__dot" style={{background:party.color}}/>
                  <span className="vbar__short mono">{party.short}</span>
                  <span className="vbar__name">{party.name}</span>
                  <span className="vbar__pct mono">{v.toFixed(1)}%</span>
                </div>
                <div className="vbar__track"><div className="vbar__fill" style={{width:`${v*2}%`, background:party.color}}/></div>
              </div>
            );
          })}
        </div>

        <SectionHead index="02" title="CALOR ELECTORAL" sub="provincias clave"/>
        <div className="natov__hot">
          {D.PROVINCES
            .map(p => ({...p, gap: Math.abs(Object.values(p.intent).sort((a,b)=>b-a)[0] - Object.values(p.intent).sort((a,b)=>b-a)[1])}))
            .sort((a,b)=>a.gap-b.gap)
            .slice(0,4)
            .map(p => (
              <div key={p.id} className="hotrow">
                <span className="mono hotrow__id">{p.id}</span>
                <span className="hotrow__name">{p.name}</span>
                <span className="mono hotrow__gap">Δ {p.gap.toFixed(0)}pt</span>
                <span className="mono hotrow__pop">{p.population}M</span>
              </div>
            ))}
        </div>

        <SectionHead index="03" title="ALERTAS ACTIVAS" />
        <div className="natov__alerts">
          <div className="alertrow alertrow--high">
            <span className="mono alertrow__lvl">L3</span>
            <span>Corte de ruta · Llanos Occidentales</span>
            <span className="mono">03:47</span>
          </div>
          <div className="alertrow alertrow--mid">
            <span className="mono alertrow__lvl">L2</span>
            <span>Debate nacional confirmado · 3d</span>
            <span className="mono">—</span>
          </div>
          <div className="alertrow alertrow--low">
            <span className="mono alertrow__lvl">L1</span>
            <span>MNP convocará "frente antiprogresista"</span>
            <span className="mono">12h</span>
          </div>
        </div>
      </div>
    </PanelChrome>
  );
}

/* ========================================================================= */
/*  WAR ROOM MAP                                                             */
/* ========================================================================= */
function MapView({ selected, setSelected, onOpenEvent }) {
  const [overlay, setOverlay] = useStateMV('intent');
  const [hover, setHover]     = useStateMV(null);
  const [cursor, setCursor]   = useStateMV({ x:0, y:0 });
  const [cursorSvg, setCursorSvg] = useStateMV({ x:-100, y:-100 });
  const [zoom, setZoom]       = useStateMV(1);
  const [tick, setTick]       = useStateMV(0);
  const [layers, setLayers]   = useStateMV({
    cities: true, rallies: true, crises: true, paths: true, media: false,
    infra: false, hydro: false, grid: true,
  });
  const svgRef = useRefMV(null);

  useEffectMV(() => {
    let raf = 0;
    const loop = () => { setTick(v => v + 0.018); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const selectedProv = D.PROVINCES.find(p => p.id === selected);
  const showCities = zoom > 1.3 || layers.cities;
  const tension = D.PROVINCES.reduce((s,p)=>s+p.crisis,0) / D.PROVINCES.length / 10;
  const tourPts = useMemoMV(() => {
    return TOUR_PATH.map(id => {
      const p = D.PROVINCES.find(pp => pp.id === id);
      return p ? p.labelAt : [500, 360];
    });
  }, []);
  const tourLength = useMemoMV(() => {
    let L = 0;
    for (let i = 1; i < tourPts.length; i++) {
      const a = tourPts[i-1], b = tourPts[i];
      L += Math.hypot(a[0]-b[0], a[1]-b[1]);
    }
    return L;
  }, [tourPts]);

  const onSvgMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setCursor({ x:e.clientX-r.left, y:e.clientY-r.top });
    // svg viewBox coords (approx, no transform unwrap)
    const sx = ((e.clientX-r.left) / r.width) * 1000;
    const sy = ((e.clientY-r.top) / r.height) * 720;
    setCursorSvg({ x:sx, y:sy });
  };

  const grouped = useMemoMV(() => {
    const m = {};
    OVERLAY_GROUPS.forEach(g => m[g.cat] = OVERLAYS.filter(o => o.cat === g.cat));
    return m;
  }, []);

  return (
    <div className="mapview mapview--war">
      {/* LEFT RAIL */}
      <aside className="rail rail--war">
        <div className="rail__head mono"><span>OVERLAYS · 12</span><span>{overlay.toUpperCase()}</span></div>
        {OVERLAY_GROUPS.map(g => (
          <div key={g.cat} className="rail__group">
            <div className="rail__group-lbl mono">— {g.label}</div>
            {grouped[g.cat].map((o,i) => (
              <button key={o.id}
                className={`raillbtn ${overlay===o.id?'raillbtn--active':''}`}
                onClick={()=>setOverlay(o.id)}>
                <span className="raillbtn__idx mono">{String(OVERLAYS.findIndex(x=>x.id===o.id)+1).padStart(2,'0')}</span>
                <span className="raillbtn__icon mono">{o.icon}</span>
                <span className="raillbtn__lbl">{o.label}</span>
              </button>
            ))}
          </div>
        ))}

        <div className="rail__head mono" style={{marginTop:10}}>
          <span>ZOOM</span>
          <span className="mono">{zoom.toFixed(2)}×</span>
        </div>
        <div className="zoombar">
          <button onClick={()=>setZoom(z=>Math.max(0.7, z-0.15))} className="mono">−</button>
          <input type="range" min="0.7" max="2.4" step="0.05" value={zoom}
            onChange={e=>setZoom(parseFloat(e.target.value))}/>
          <button onClick={()=>setZoom(z=>Math.min(2.4, z+0.15))} className="mono">+</button>
        </div>
        <div className="rail__zoom-hint mono">
          {zoom > 1.7 ? '◉ CITY DETAIL · ON' : zoom > 1.3 ? '◯ CITY MARKERS · ON' : '· VISTA NACIONAL ·'}
        </div>

        <div className="rail__head mono" style={{marginTop:10}}>
          <span>LAYERS</span>
        </div>
        {[
          ['cities','Ciudades'],
          ['rallies','Rallies activos'],
          ['crises','Crisis & alertas'],
          ['paths','Campaign paths'],
          ['media','Influencia mediática'],
          ['infra','Infraestructura'],
          ['hydro','Hidrografía'],
          ['grid','Grid coordenado'],
        ].map(([k,lbl])=>(
          <button key={k}
            className={`rail__chip rail__chip--btn ${layers[k]?'':'rail__chip--off'}`}
            onClick={()=>setLayers(L=>({...L, [k]:!L[k]}))}>
            {layers[k]?'▣':'□'} {lbl}
          </button>
        ))}
      </aside>

      {/* MAP CANVAS */}
      <div className="mapcanvas mapcanvas--war">
        {/* WAR ROOM TOP STRIP */}
        <div className="warbar">
          <div className="warbar__l mono">
            <span className="warbar__cls">▣ CLASIFICADO · CC-OPS</span>
            <span className="sep">│</span>
            <span>OVERLAY · {OVERLAYS.find(o=>o.id===overlay).label.toUpperCase()}</span>
          </div>
          <div className="warbar__c mono">
            <span className="dot dot--live"/>
            <span>LIVE FEED · {(((tick*15)|0)%60).toString().padStart(2,'0')}:{(((tick*60)|0)%60).toString().padStart(2,'0')}</span>
            <span className="sep">│</span>
            <span style={{color: tension > 0.3 ? '#C24A4A' : '#E6B948'}}>
              TENSIÓN {(tension*100).toFixed(0)}%
            </span>
          </div>
          <div className="warbar__r mono">
            <span>LAT {(cursorSvg.y/720*8 + 12).toFixed(2)}°N</span>
            <span>LON {(cursorSvg.x/1000*8 + 64).toFixed(2)}°W</span>
            <span className="warbar__sig">▌▌▌▌▌</span>
          </div>
        </div>

        <div className="mapcanvas__svgwrap"
          onMouseMove={onSvgMove}
          onMouseLeave={()=>setHover(null)}>
          <svg ref={svgRef} viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid meet"
            className="bigmap" style={{ transform:`scale(${zoom})`, transformOrigin:'center' }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0 L0 0 0 40" fill="none" stroke="#161D26" strokeWidth="0.5"/>
              </pattern>
              <pattern id="grid-fine" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M10 0 L0 0 0 10" fill="none" stroke="#11161C" strokeWidth="0.3"/>
              </pattern>
              <radialGradient id="map-radial" cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor="#1A2230" stopOpacity="0.45"/>
                <stop offset="100%" stopColor="#070A0E" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="map-tension" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#C24A4A" stopOpacity="0"/>
                <stop offset="100%" stopColor="#C24A4A" stopOpacity={tension*0.18}/>
              </radialGradient>
              <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2"/>
              </filter>
              <linearGradient id="cloud-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1F2731" stopOpacity="0.0"/>
                <stop offset="50%" stopColor="#1F2731" stopOpacity="0.18"/>
                <stop offset="100%" stopColor="#1F2731" stopOpacity="0.0"/>
              </linearGradient>
            </defs>

            {/* BASE: grid */}
            {layers.grid && <rect x="0" y="0" width="1000" height="720" fill="url(#grid)"/>}
            {layers.grid && zoom > 1.5 && <rect x="0" y="0" width="1000" height="720" fill="url(#grid-fine)"/>}
            <rect x="0" y="0" width="1000" height="720" fill="url(#map-radial)"/>

            {/* major hairlines */}
            <g stroke="#1F2630" strokeWidth="0.6">
              {Array.from({length:4}).map((_,i)=><line key={'mh'+i} x1="0" y1={(i+1)*180} x2="1000" y2={(i+1)*180}/>)}
              {Array.from({length:4}).map((_,i)=><line key={'mv'+i} x1={(i+1)*200} y1="0" x2={(i+1)*200} y2="720"/>)}
            </g>

            {/* coordinate ticks */}
            <g className="mapticks mono">
              {['12°N','14°N','16°N','18°N'].map((t,i)=>
                <text key={i} x="6" y={180+i*180-4} className="mapticks__t">{t}</text>
              )}
              {['64°W','66°W','68°W','70°W'].map((t,i)=>
                <text key={i} x={200+i*200} y="14" className="mapticks__t" textAnchor="middle">{t}</text>
              )}
            </g>

            {/* HYDRO (rivers) — placeholder polylines */}
            {layers.hydro && (
              <g stroke="#5B8FB9" strokeWidth="1" opacity="0.35" fill="none">
                <path d="M 200 100 Q 300 200 400 280 T 600 360 T 850 540"/>
                <path d="M 500 295 Q 540 380 600 540"/>
                <path d="M 280 360 Q 320 460 390 540"/>
              </g>
            )}

            {/* INFRASTRUCTURE (roads / highways) */}
            {layers.infra && (
              <g stroke="#C9A961" strokeWidth="0.8" opacity="0.55" fill="none" strokeDasharray="3 2">
                <path d="M 200 225 L 500 295 L 790 95"/>
                <path d="M 500 295 L 720 640"/>
                <path d="M 500 295 L 270 640"/>
                <path d="M 500 295 L 390 540"/>
              </g>
            )}

            {/* PROVINCES */}
            <g>
              {D.PROVINCES.map(p => {
                const isSel = p.id === selected;
                const isHov = hover && hover.id === p.id;
                const baseColor = provinceColor(p, overlay);
                const breath = 0.85 + Math.sin(tick + p.id.charCodeAt(0)*0.4)*0.04;
                const top = Object.values(p.intent).sort((a,b)=>b-a);
                const isSwing = (top[0] - top[1]) < 4;
                return (
                  <g key={p.id}>
                    <polygon
                      points={p.polygon}
                      fill={baseColor}
                      fillOpacity={isSel?0.95:isHov?0.85:0.72*breath}
                      stroke={isSel?'#F4E9C8':isHov?'#C9A961':'#0A0D11'}
                      strokeWidth={isSel?2.6:isHov?1.8:1.2}
                      onMouseEnter={()=>setHover(p)}
                      onClick={()=>setSelected(p.id===selected?null:p.id)}
                      style={{cursor:'pointer'}}/>
                    {/* swing-state breathing border */}
                    {isSwing && (
                      <polygon
                        points={p.polygon}
                        fill="none"
                        stroke="#E6B948"
                        strokeWidth={1.6 + Math.sin(tick*2 + p.id.charCodeAt(0))*0.7}
                        opacity={0.35 + Math.sin(tick*2 + p.id.charCodeAt(0))*0.15}
                        style={{pointerEvents:'none'}}/>
                    )}
                  </g>
                );
              })}
            </g>

            {/* TENSION VIGNETTE — global red glow when tension is high */}
            <rect x="0" y="0" width="1000" height="720" fill="url(#map-tension)" style={{pointerEvents:'none'}}/>

            {/* CLOUDS — drifting */}
            <g style={{pointerEvents:'none'}} opacity="0.5">
              {[0, 280, 560].map((off, i) => {
                const x = ((tick*8 + off) % 1500) - 280;
                return (
                  <g key={i} transform={`translate(${x} ${60 + i*220})`}>
                    <ellipse cx="60" cy="0" rx="180" ry="22" fill="url(#cloud-grad)"/>
                    <ellipse cx="120" cy="8" rx="120" ry="14" fill="url(#cloud-grad)" opacity="0.6"/>
                  </g>
                );
              })}
            </g>

            {/* MEDIA INFLUENCE RIPPLES (per overlay or layer) */}
            {(overlay === 'media' || layers.media) && (
              <g style={{pointerEvents:'none'}}>
                {[
                  { x:500, y:295, color:'#9C7BD9' }, // capital
                  { x:730, y:160, color:'#5B8FB9' },
                  { x:725, y:540, color:'#5E9B7E' },
                ].map((m,i)=>{
                  const t = (tick + i*1.8) % 4;
                  const r1 = 8 + t*40;
                  const r2 = 8 + ((t+1.3) % 4)*40;
                  const r3 = 8 + ((t+2.6) % 4)*40;
                  return (
                    <g key={i}>
                      <circle cx={m.x} cy={m.y} r={r1} fill="none" stroke={m.color} strokeWidth="1" opacity={1 - (t/4)}/>
                      <circle cx={m.x} cy={m.y} r={r2} fill="none" stroke={m.color} strokeWidth="0.7" opacity={1 - ((t+1.3)%4)/4}/>
                      <circle cx={m.x} cy={m.y} r={r3} fill="none" stroke={m.color} strokeWidth="0.5" opacity={1 - ((t+2.6)%4)/4}/>
                      <circle cx={m.x} cy={m.y} r="3" fill={m.color}/>
                    </g>
                  );
                })}
              </g>
            )}

            {/* PROVINCE LABELS */}
            <g className="provlabels">
              {D.PROVINCES.map(p => (
                <g key={'l'+p.id}>
                  <text x={p.labelAt[0]} y={p.labelAt[1]} textAnchor="middle" className="provlabel">{p.name.toUpperCase()}</text>
                  <text x={p.labelAt[0]} y={p.labelAt[1]+14} textAnchor="middle" className="provlabel__cap mono">{p.capital}</text>
                </g>
              ))}
            </g>

            {/* CAPITAL MARKER */}
            <g transform="translate(500 295)">
              {/* rotating ring */}
              <g transform={`rotate(${(tick*14) % 360})`}>
                <circle r="18" fill="none" stroke="#C9A961" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.5"/>
                <circle r="22" fill="none" stroke="#C9A961" strokeWidth="0.4" strokeDasharray="1 7" opacity="0.3"/>
              </g>
              <circle r="5" fill="#C9A961"/>
              <circle r={11+Math.sin(tick*2)*2.5} fill="none" stroke="#C9A961" strokeWidth="1.2" opacity="0.7"/>
              <text y="-26" textAnchor="middle" className="capmark mono">★ CIUDAD AURORA · CAPITAL</text>
            </g>

            {/* CITIES (appear at zoom > 1.3 or layer toggle) */}
            {showCities && (
              <g style={{pointerEvents:'none'}}>
                {[
                  { x:285, y:150, n:'PUERTO MIRAGE', pop:'0.6M' },
                  { x:500, y:150, n:'ALTO VERDE',    pop:'0.9M' },
                  { x:730, y:160, n:'BAHÍA REAL',    pop:'1.4M' },
                  { x:275, y:295, n:'SAN TARCISIO',  pop:'0.5M' },
                  { x:730, y:360, n:'LITORAL SUR',   pop:'0.8M' },
                  { x:285, y:540, n:'VEGA AZUL',     pop:'0.4M' },
                  { x:725, y:540, n:'SANTA CRUZ',    pop:'0.9M' },
                  { x:390, y:665, n:'TIERRA NEGRA',  pop:'0.3M' },
                  { x:590, y:667, n:'BORDE AUSTRAL', pop:'0.2M' },
                ].map((c,i)=>(
                  <g key={i} transform={`translate(${c.x} ${c.y})`}>
                    <circle r="2.4" fill="#F4E9C8" stroke="#0A0D11" strokeWidth="0.5"/>
                    {zoom > 1.6 && (
                      <>
                        <text y="-6" textAnchor="middle" fill="#F4E9C8" fontSize="6.5"
                          fontFamily="IBM Plex Mono, monospace" letterSpacing="0.16em">{c.n}</text>
                        <text y="-15" textAnchor="middle" fill="#C9A961" fontSize="5.5"
                          fontFamily="IBM Plex Mono, monospace">{c.pop}</text>
                      </>
                    )}
                  </g>
                ))}
              </g>
            )}

            {/* CAMPAIGN PATH — animated dashed tour */}
            {layers.paths && (
              <g style={{pointerEvents:'none'}}>
                <polyline
                  points={tourPts.map(p => p.join(',')).join(' ')}
                  fill="none"
                  stroke="#C9A961"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                  strokeDashoffset={-tick*14}
                  opacity="0.7"/>
                {tourPts.map((p, i) => (
                  <g key={i} transform={`translate(${p[0]} ${p[1] - 20})`}>
                    <circle r="2.2" fill="#C9A961"/>
                    {i === tourPts.length - 1 && (
                      <>
                        <circle r={5+Math.sin(tick*2)*1.5} fill="none" stroke="#C9A961" strokeWidth="0.8" opacity="0.7"/>
                        <text y="-8" textAnchor="middle" fill="#C9A961" fontSize="7"
                          fontFamily="IBM Plex Mono, monospace" letterSpacing="0.16em">▸ AHORA</text>
                      </>
                    )}
                  </g>
                ))}
                {/* moving caravan dot along path */}
                {(() => {
                  const t = (tick*40) % tourLength;
                  let acc = 0;
                  for (let i = 1; i < tourPts.length; i++) {
                    const a = tourPts[i-1], b = tourPts[i];
                    const d = Math.hypot(a[0]-b[0], a[1]-b[1]);
                    if (acc + d >= t) {
                      const k = (t - acc) / d;
                      const x = a[0] + (b[0]-a[0])*k;
                      const y = a[1] + (b[1]-a[1])*k;
                      return (
                        <g transform={`translate(${x} ${y})`}>
                          <circle r="3" fill="#F4E9C8"/>
                          <circle r="7" fill="none" stroke="#F4E9C8" strokeWidth="0.6" opacity="0.5"/>
                        </g>
                      );
                    }
                    acc += d;
                  }
                  return null;
                })()}
              </g>
            )}

            {/* RALLIES */}
            {layers.rallies && (
              <g style={{pointerEvents:'none'}}>
                {RALLY_PINS.map((m,i)=>(
                  <g key={i} transform={`translate(${m.x} ${m.y})`}>
                    {/* flag pin */}
                    <line x1="0" y1="0" x2="0" y2="14" stroke="#C9A961" strokeWidth="1"/>
                    <polygon points="0,-2 8,2 0,6" fill="#C9A961"/>
                    <circle cy="14" r="2" fill="#C9A961"/>
                    {m.size !== 'small' && (
                      <circle cy="14" r={6+Math.sin(tick*2 + i)*1.5} fill="none" stroke="#C9A961" strokeWidth="0.7" opacity="0.55"/>
                    )}
                    {m.size === 'big' && (
                      <g transform="translate(10 -4)">
                        <rect x="0" y="0" width="78" height="14" fill="#0A0D11" stroke="#C9A961" strokeWidth="0.4" opacity="0.92"/>
                        <text x="4" y="6" fill="#C9A961" fontSize="6"
                          fontFamily="IBM Plex Mono, monospace" letterSpacing="0.16em">RALLY · {m.label}</text>
                        <text x="4" y="12" fill="#E8E6E1" fontSize="5.5"
                          fontFamily="IBM Plex Mono, monospace" letterSpacing="0.14em">{m.when}</text>
                      </g>
                    )}
                  </g>
                ))}
              </g>
            )}

            {/* CRISIS PULSES */}
            {layers.crises && (
              <g style={{pointerEvents:'none'}}>
                {D.PROVINCES.filter(p=>p.crisis>=5).map((p,i)=>(
                  <g key={p.id} transform={`translate(${p.labelAt[0]-30} ${p.labelAt[1]-2})`}>
                    <circle r={12+Math.sin(tick*3 + i)*3} fill="none" stroke="#C24A4A" strokeWidth="1.4" opacity="0.75"/>
                    <circle r={22+Math.sin(tick*3 + i)*5} fill="none" stroke="#C24A4A" strokeWidth="0.6" opacity="0.4"/>
                    <polygon points="0,-6 6,4 -6,4" fill="#C24A4A" stroke="#0A0D11" strokeWidth="0.4"/>
                    <text x="0" y="22" textAnchor="middle" fill="#C24A4A" fontSize="6.5"
                      fontFamily="IBM Plex Mono, monospace" letterSpacing="0.18em">⚠ CRISIS L{p.crisis>=7?'3':'2'}</text>
                  </g>
                ))}
              </g>
            )}

            {/* RADAR SWEEP (subtle) */}
            <g transform="translate(940 100)" opacity="0.45" style={{pointerEvents:'none'}}>
              <circle r="22" fill="none" stroke="#3a4350" strokeWidth="0.6"/>
              <circle r="14" fill="none" stroke="#3a4350" strokeWidth="0.4"/>
              <line x1="0" y1="0"
                x2={Math.cos(tick*1.4)*22}
                y2={Math.sin(tick*1.4)*22}
                stroke="#C9A961" strokeWidth="1" opacity="0.85"/>
              <circle r="1.5" fill="#C9A961"/>
              {/* compass labels */}
              <text y="-26" textAnchor="middle" className="compass-l">N</text>
              <text y="32"  textAnchor="middle" className="compass-l">S</text>
              <text x="-28" y="3" textAnchor="middle" className="compass-l">W</text>
              <text x="28"  y="3" textAnchor="middle" className="compass-l">E</text>
            </g>

            {/* SCALE BAR */}
            <g transform="translate(40 660)" className="scale mono" style={{pointerEvents:'none'}}>
              <line x1="0" y1="0" x2="160" y2="0" stroke="#C9A961" strokeWidth="1.4"/>
              <line x1="0" y1="-4" x2="0" y2="4" stroke="#C9A961" strokeWidth="1"/>
              <line x1="80" y1="-3" x2="80" y2="3" stroke="#C9A961" strokeWidth="0.8"/>
              <line x1="160" y1="-4" x2="160" y2="4" stroke="#C9A961" strokeWidth="1"/>
              <text x="0" y="18">0</text>
              <text x="80" y="18" textAnchor="middle">100</text>
              <text x="160" y="18" textAnchor="middle">200 km</text>
            </g>

            {/* CURSOR CROSSHAIR */}
            <g style={{pointerEvents:'none'}}>
              <line x1={cursorSvg.x} y1="0" x2={cursorSvg.x} y2="720"
                stroke="#C9A961" strokeWidth="0.4" strokeDasharray="2 6" opacity="0.35"/>
              <line x1="0" y1={cursorSvg.y} x2="1000" y2={cursorSvg.y}
                stroke="#C9A961" strokeWidth="0.4" strokeDasharray="2 6" opacity="0.35"/>
              <circle cx={cursorSvg.x} cy={cursorSvg.y} r="6" fill="none"
                stroke="#C9A961" strokeWidth="0.5" opacity="0.5"/>
            </g>
          </svg>

          {/* CHROME — corner classified marks */}
          <div className="warhud warhud--tl mono">
            <div>▣ CC·OPS · DAY 64/92</div>
            <div className="warhud__sub">SECTOR · SAN ESTEBAN</div>
          </div>
          <div className="warhud warhud--tr mono">
            <div>OVERLAY · {OVERLAYS.find(o=>o.id===overlay).label.toUpperCase()}</div>
            <div className="warhud__sub">LAYERS · {Object.values(layers).filter(Boolean).length}/{Object.keys(layers).length}</div>
          </div>
          <div className="warhud warhud--bl mono">
            <div>WAR CHEST · $14.4M</div>
            <div className="warhud__sub">MOMENTUM · +6.2</div>
          </div>

          {/* Mini overview map (PIP) */}
          <div className="minimap-pip">
            <div className="minimap-pip__head mono">
              <span>NACIONAL · PIP</span>
              <span>{zoom.toFixed(1)}×</span>
            </div>
            <svg viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid meet">
              {D.PROVINCES.map(p => (
                <polygon key={p.id} points={p.polygon}
                  fill={provinceColor(p, 'intent')}
                  opacity="0.55"
                  stroke="#0A0D11" strokeWidth="3"/>
              ))}
              {selectedProv && (
                <polygon points={selectedProv.polygon}
                  fill="none" stroke="#F4E9C8" strokeWidth="6"/>
              )}
              {/* viewport rect */}
              {zoom > 1 && (
                <rect
                  x={500 - 500/zoom} y={360 - 360/zoom}
                  width={1000/zoom} height={720/zoom}
                  fill="none" stroke="#C9A961" strokeWidth="6" strokeDasharray="14 10"/>
              )}
            </svg>
          </div>

          {/* Legend strip */}
          <div className="legend-bar mono">
            <span className="legend-bar__lbl">LEYENDA · {OVERLAYS.find(o=>o.id===overlay).label.toUpperCase()}</span>
            {overlay==='intent' && Object.values(D.PARTIES).map(p=>(
              <span key={p.id}><i style={{background:p.color}}/>{p.short}</span>
            ))}
            {overlay==='momentum' && (<>
              <span><i style={{background:'#C24A4A'}}/>NEG</span>
              <span><i style={{background:'#2A2F38'}}/>0</span>
              <span><i style={{background:'#5E9B7E'}}/>POS</span>
            </>)}
            {overlay==='crisis' && (<>
              <span><i style={{background:'#2A2F38'}}/>BAJO</span>
              <span><i style={{background:'#C24A4A'}}/>ALTO</span>
            </>)}
            {overlay==='turnout' && (<>
              <span><i style={{background:'#2A2F38'}}/>45%</span>
              <span><i style={{background:'#C9A961'}}/>80%</span>
            </>)}
            {overlay==='media' && (<>
              <span><i style={{background:'#2A2F38'}}/>BAJA</span>
              <span><i style={{background:'#9C7BD9'}}/>SATURADA</span>
            </>)}
            {overlay==='infra' && (<>
              <span><i style={{background:'#2A2F38'}}/>RURAL</span>
              <span><i style={{background:'#5B8FB9'}}/>METRO</span>
            </>)}
            {overlay==='ideol' && (<>
              <span><i style={{background:'#5B8FB9'}}/>IZQ</span>
              <span><i style={{background:'#C9A961'}}/>CENTRO</span>
              <span><i style={{background:'#C24A4A'}}/>DER</span>
            </>)}
            {overlay==='demo' && (<>
              <span><i style={{background:'#C9A961'}}/>NORTE</span>
              <span><i style={{background:'#5B8FB9'}}/>CENTRO</span>
              <span><i style={{background:'#E6B948'}}/>OESTE</span>
              <span><i style={{background:'#5E9B7E'}}/>SUR</span>
              <span><i style={{background:'#9C7BD9'}}/>AUSTRAL</span>
            </>)}
          </div>

          {hover && <ProvincePopover p={hover} x={cursor.x+18} y={cursor.y+18} tick={tick}/>}

          {/* QUICK ACTION RADIAL when selected */}
          {selectedProv && (
            <QuickRadial p={selectedProv} onClose={()=>setSelected(null)}/>
          )}
        </div>

        {/* ACTION BAR */}
        <div className="actionbar actionbar--war">
          <div className="actionbar__lbl mono">
            <span>ACCIONES</span>
            <span className="actionbar__sub">
              {selected ? `→ ${selectedProv.name.toUpperCase()}` : '· seleccionar provincia ·'}
            </span>
          </div>
          {ACTIONS.map(a => (
            <button key={a.id} className="actionbtn" disabled={!selected}>
              <span className="actionbtn__icon mono">{a.icon}</span>
              <span className="actionbtn__label">{a.label}</span>
              <span className="actionbtn__cost mono">{a.cost}</span>
            </button>
          ))}
          <button className="endturn" onClick={onOpenEvent}>
            <span>END DAY</span>
            <span className="mono">↵</span>
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <aside className="rightpanel">
        {selectedProv
          ? <ProvinceDossier p={selectedProv} onClose={()=>setSelected(null)}/>
          : <NationalOverview/>}
      </aside>
    </div>
  );
}

/* -------------------------------------------------------------- QuickRadial */
function QuickRadial({ p, onClose }) {
  const items = [
    { lbl:'RALLY',  ic:'★', col:'#C9A961' },
    { lbl:'AD TV',  ic:'◐', col:'#5B8FB9' },
    { lbl:'PUERTA', ic:'⊞', col:'#5E9B7E' },
    { lbl:'SPEECH', ic:'✎', col:'#E6B948' },
    { lbl:'VISITA', ic:'➤', col:'#C24A4A' },
  ];
  return (
    <div className="qradial mono">
      <div className="qradial__head">
        <span>● {p.id} · {p.capital.toUpperCase()}</span>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="qradial__body">
        {items.map((it,i)=>(
          <button key={i} className="qradial__btn" style={{borderLeftColor:it.col}}>
            <span className="qradial__ic" style={{color:it.col}}>{it.ic}</span>
            <span>{it.lbl}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

window.MapView = MapView;
