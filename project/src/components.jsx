/* =========================================================================
   JUEGO POLÍTICO — Shared components
   ========================================================================= */

const { useState, useEffect, useRef, useMemo, useLayoutEffect } = React;
const D = window.GAME_DATA;

/* -------------------------------------------------------------------------
   PanelChrome
   Brutalist panel with hairline border + corner ticks + optional caption
   ------------------------------------------------------------------------- */
function PanelChrome({ label, caption, right, children, dense=false, className='', noPad=false, accent=null }) {
  return (
    <div className={`panel ${dense?'panel--dense':''} ${className}`} style={accent?{borderColor:accent}:undefined}>
      <div className="panel__corner panel__corner--tl" />
      <div className="panel__corner panel__corner--tr" />
      <div className="panel__corner panel__corner--bl" />
      <div className="panel__corner panel__corner--br" />
      {(label || right) && (
        <div className="panel__head">
          <div className="panel__label">
            {label && <span className="panel__label-text">{label}</span>}
            {caption && <span className="panel__caption">{caption}</span>}
          </div>
          {right && <div className="panel__head-right">{right}</div>}
        </div>
      )}
      <div className={`panel__body ${noPad?'panel__body--nopad':''}`}>
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   StatTile — compact KPI cell
   ------------------------------------------------------------------------- */
function StatTile({ label, value, sub, delta, mono=true, large=false, accent }) {
  return (
    <div className="stat">
      <div className="stat__label">{label}</div>
      <div className={`stat__value ${mono?'mono':''} ${large?'stat__value--lg':''}`} style={accent?{color:accent}:undefined}>
        {value}
      </div>
      {(sub || delta!==undefined) && (
        <div className="stat__sub">
          {delta!==undefined && (
            <span className={`delta ${delta>0?'delta--up':delta<0?'delta--dn':''}`}>
              {delta>0?'▲':delta<0?'▼':'·'} {Math.abs(delta).toFixed(1)}
            </span>
          )}
          {sub && <span className="stat__subtext">{sub}</span>}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------
   NumberTicker — counts up to target
   ------------------------------------------------------------------------- */
function NumberTicker({ value, decimals=0, prefix='', suffix='', duration=600 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let start = null, raf = 0;
    const step = (t) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1-p, 3);
      setV(value * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <span>{prefix}{v.toFixed(decimals)}{suffix}</span>;
}

/* -------------------------------------------------------------------------
   HorizontalBar — for vote intention rows
   ------------------------------------------------------------------------- */
function HorizontalBar({ pct, color, label, value, mini=false }) {
  return (
    <div className={`hbar ${mini?'hbar--mini':''}`}>
      {label && <div className="hbar__label">{label}</div>}
      <div className="hbar__track">
        <div className="hbar__fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      {value !== undefined && <div className="hbar__value mono">{value}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------
   Sparkline — small line chart
   ------------------------------------------------------------------------- */
function Sparkline({ data, color='#E8E6E1', width=180, height=44, fill=false, dots=false, grid=false }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data) - 1;
  const max = Math.max(...data) + 1;
  const range = max - min || 1;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return [x, y];
  });
  const pathD = points.map((p, i) => (i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`)).join(' ');
  const fillD = pathD + ` L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} className="sparkline">
      {grid && (
        <g stroke="#232A33" strokeWidth="1">
          <line x1="0" y1={height/2} x2={width} y2={height/2} />
        </g>
      )}
      {fill && <path d={fillD} fill={color} opacity="0.10" />}
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.4" />
      {dots && points.map((p,i) => <circle key={i} cx={p[0]} cy={p[1]} r="1.6" fill={color}/>)}
    </svg>
  );
}

/* -------------------------------------------------------------------------
   MultiLineChart — polling trend
   ------------------------------------------------------------------------- */
function MultiLineChart({ data, series, width=560, height=220, padX=44, padY=24 }) {
  const w = width - padX*2;
  const h = height - padY*2;
  const allVals = data.flatMap(d => series.map(s => d[s.key]));
  const min = 0;
  const max = Math.ceil(Math.max(...allVals) / 5) * 5 + 5;
  const range = max - min;
  const x = (i) => padX + (i/(data.length-1))*w;
  const y = (v) => padY + h - ((v-min)/range)*h;

  // grid lines
  const gridY = [];
  for (let v=0; v<=max; v+=10) gridY.push(v);

  return (
    <svg width={width} height={height} className="multiline">
      {/* grid */}
      <g stroke="#1B2129" strokeWidth="1">
        {gridY.map(v => (
          <g key={v}>
            <line x1={padX} y1={y(v)} x2={padX+w} y2={y(v)} />
            <text x={padX-8} y={y(v)+3} className="axis mono" textAnchor="end">{v}</text>
          </g>
        ))}
        {data.map((d,i) => (
          <line key={i} x1={x(i)} y1={padY} x2={x(i)} y2={padY+h} stroke="#161D26" />
        ))}
      </g>
      {/* x axis labels */}
      <g>
        {data.map((d,i) => (
          (i%2===0 || i===data.length-1) &&
          <text key={i} x={x(i)} y={height-6} className="axis mono" textAnchor="middle">{d.w}</text>
        ))}
      </g>
      {/* series */}
      {series.map(s => {
        const pts = data.map((d,i)=>[x(i), y(d[s.key])]);
        const pathD = pts.map((p,i)=>(i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`)).join(' ');
        return (
          <g key={s.key}>
            <path d={pathD} fill="none" stroke={s.color} strokeWidth="1.6" />
            {pts.map((p,i)=>(
              <circle key={i} cx={p[0]} cy={p[1]} r="2.4" fill="#0A0D11" stroke={s.color} strokeWidth="1.4"/>
            ))}
            <text x={pts[pts.length-1][0]+6} y={pts[pts.length-1][1]+3} className="series-label mono" fill={s.color}>{s.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------------------------
   Gauge — radial momentum/approval
   ------------------------------------------------------------------------- */
function Gauge({ value, max=100, label, color='#C9A961', size=120 }) {
  const r = size/2 - 8;
  const cx = size/2, cy = size/2;
  const start = -Math.PI * 1.1;
  const end   = Math.PI * 0.1;
  const total = end - start;
  const pct = Math.min(1, Math.max(0, value/max));
  const angle = start + total * pct;
  const polar = (a, rad=r) => [cx + Math.cos(a)*rad, cy + Math.sin(a)*rad];
  const arc = (a1, a2, rad=r) => {
    const [x1,y1] = polar(a1, rad);
    const [x2,y2] = polar(a2, rad);
    const large = a2 - a1 > Math.PI ? 1 : 0;
    return `M${x1},${y1} A${rad},${rad} 0 ${large} 1 ${x2},${y2}`;
  };
  return (
    <svg width={size} height={size} className="gauge">
      <path d={arc(start, end)} fill="none" stroke="#232A33" strokeWidth="6" strokeLinecap="square" />
      <path d={arc(start, angle)} fill="none" stroke={color} strokeWidth="6" strokeLinecap="square" />
      {/* tick marks */}
      {Array.from({length:11}).map((_,i)=>{
        const a = start + total*(i/10);
        const [x1,y1] = polar(a, r+5);
        const [x2,y2] = polar(a, r+9);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3a4350" strokeWidth="1"/>;
      })}
      <text x={cx} y={cy+2} textAnchor="middle" className="gauge__value mono">{value}</text>
      {label && <text x={cx} y={cy+22} textAnchor="middle" className="gauge__label">{label}</text>}
    </svg>
  );
}

/* -------------------------------------------------------------------------
   TopBar — global HUD strip
   ------------------------------------------------------------------------- */
function TopBar({ screen, onNavigate, onOpenEvent }) {
  const C = D.COUNTRY;
  return (
    <header className="topbar">
      <div className="topbar__left">
        <div className="brand">
          <div className="brand__mark">▣</div>
          <div className="brand__copy">
            <div className="brand__name">CAMPAIGN COMMAND</div>
            <div className="brand__sub mono">CAMPAIGN OPERATIONS SYSTEM · {C.cycle.toUpperCase()}</div>
          </div>
        </div>
      </div>
      <nav className="topbar__nav">
        {[
          ['map','Map'],
          ['dashboard','Campaign'],
          ['gov','Governance'],
          ['party','Party'],
          ['media','Media'],
          ['profile','Candidate'],
        ].map(([id,lbl]) => (
          <button key={id}
            className={`navbtn ${screen===id?'navbtn--active':''}`}
            onClick={()=>onNavigate(id)}>
            {lbl}
          </button>
        ))}
      </nav>
      <div className="topbar__right">
        <div className="hud-stat">
          <div className="hud-stat__lbl">DATE</div>
          <div className="hud-stat__val mono">{C.date}</div>
        </div>
        <div className="hud-stat">
          <div className="hud-stat__lbl">T-ELECTION</div>
          <div className="hud-stat__val mono accent-warm">{C.timeToElection.toUpperCase()}</div>
        </div>
        <div className="hud-stat">
          <div className="hud-stat__lbl">WAR CHEST</div>
          <div className="hud-stat__val mono">$<NumberTicker value={D.PLAYER.war_chest} decimals={1}/>M</div>
        </div>
        <div className="hud-stat">
          <div className="hud-stat__lbl">MOMENTUM</div>
          <div className="hud-stat__val mono accent-pos">+<NumberTicker value={D.PLAYER.momentum}/></div>
        </div>
        <button className="alert-btn" onClick={onOpenEvent}>
          <span className="alert-dot" />
          <span className="alert-btn__txt">CRISIS · LO</span>
          <span className="alert-btn__timer mono">{D.ACTIVE_EVENT.timer}</span>
        </button>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------
   NewsTicker — bottom marquee strip
   ------------------------------------------------------------------------- */
function NewsTicker() {
  return (
    <div className="newsticker">
      <div className="newsticker__label">LIVE</div>
      <div className="newsticker__track">
        <div className="newsticker__inner">
          {[...D.NEWS, ...D.NEWS].map((n,i)=>(
            <span key={i} className="newsticker__item">
              <span className="newsticker__time mono">{n.time}</span>
              <span className="newsticker__src mono">{n.src}</span>
              <span className={`newsticker__headline tone--${n.tone}`}>{n.headline}</span>
              <span className="newsticker__sep">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Section heading (brutalist)
   ------------------------------------------------------------------------- */
function SectionHead({ index, title, sub, right }) {
  return (
    <div className="sechead">
      {index && <span className="sechead__idx mono">{index}</span>}
      <span className="sechead__title">{title}</span>
      {sub && <span className="sechead__sub">{sub}</span>}
      {right && <span className="sechead__right">{right}</span>}
    </div>
  );
}

/* -------------------------------------------------------------------------
   PartyBadge
   ------------------------------------------------------------------------- */
function PartyBadge({ id, size='sm' }) {
  const p = D.PARTIES[id];
  if (!p) return null;
  return (
    <span className={`pbadge pbadge--${size}`}>
      <span className="pbadge__dot" style={{background:p.color}}/>
      <span className="pbadge__id mono">{p.short}</span>
    </span>
  );
}

// expose
Object.assign(window, {
  PanelChrome, StatTile, NumberTicker, HorizontalBar, Sparkline,
  MultiLineChart, Gauge, TopBar, NewsTicker, SectionHead, PartyBadge,
});
