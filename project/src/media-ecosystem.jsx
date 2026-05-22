/* =========================================================================
   CAMPAIGN COMMAND — Media Ecosystem
   Generic, original social/press/podcast surfaces. Not based on any
   real platform's UI. Streams are called PULSE / WAVE / FRAME / FEED.
   ========================================================================= */

const { useState: useStateMED, useEffect: useEffectMED, useMemo: useMemoMED } = React;

const POSTS = [
  { u:'Aurora Network',       h:'@aurora_news',     col:'#5B8FB9', t:'2m',
    text:'Vasconcelos lidera en proyecciones tempranas en Costa Atlántica con +11pt sobre Orellana.',
    rt:'1.8k', re:'4.2k', vw:'214k', verified:true },
  { u:'Sara Orellana',        h:'@_orellana_2026',  col:'#C24A4A', t:'6m',
    text:'No vamos a ceder el norte. La verdadera campaña empieza ahora — y termina el 14 con nosotros adentro. ✊',
    rt:'5.4k', re:'9.8k', vw:'412k', verified:true },
  { u:'Minuto Político',      h:'@minutopolitico', col:'#C9A961', t:'12m',
    text:'Hilo · por qué el debate de anoche cambió el ciclo. (1/12)\n\nPrimero: Vasconcelos llegó preparada — y nadie en MNP lo vio venir.',
    rt:'2.1k', re:'12.4k', vw:'88k' },
  { u:'Frente Amplio Social', h:'@frente_amplio',  col:'#5E9B7E', t:'18m',
    text:'Salimos al territorio. Hoy 8pm — Plaza Mayor. Llevá agua, paciencia y a tu vecino.',
    rt:'880',  re:'2.1k', vw:'34k' },
  { u:'Ricardo Vega · Op.',   h:'@vegaopinion',    col:'#8C95A0', t:'24m',
    text:'Mi predicción: segunda vuelta. Con margen de ±0.6 pt entre PRD y MNP. Salinas decide.',
    rt:'410',  re:'1.2k', vw:'22k' },
  { u:'Voto Joven',           h:'@votojoven',      col:'#E6B948', t:'28m',
    text:'Censo de mesas: turnout joven (18-29) va por encima del 51%. Récord absoluto del ciclo.',
    rt:'1.4k', re:'3.6k', vw:'62k' },
];

const TRENDS = [
  { tag:'#Vasconcelos2026',    vol:'214k', spark:[6,8,10,14,18,22,26,30,32,36,38,42] },
  { tag:'#DebateNacional',     vol:'98k',  spark:[24,20,28,30,28,26,24,22,18,16,14,12] },
  { tag:'#Orellana',           vol:'72k',  spark:[12,14,18,22,18,16,18,20,18,16,14,18] },
  { tag:'#FrenteAntiCrisis',   vol:'41k',  spark:[4,6,8,9,10,12,14,16,16,18,20,22] },
  { tag:'#Bahía2026',          vol:'33k',  spark:[8,10,12,14,16,18,16,14,12,12,14,16] },
  { tag:'#SequíaLlanos',       vol:'18k',  spark:[10,12,14,12,10,14,18,22,24,20,18,16] },
];

const PODCASTS = [
  { t:'Contrapeso',        sub:'Aurora · Política · Diario',     lev:'neutral',  ep:'EP 412 · 1h 14m',  audience:'88k' },
  { t:'Ruido de Fondo',    sub:'Análisis · Económico',           lev:'friendly', ep:'EP 084 · 52m',     audience:'34k' },
  { t:'Caja Negra',        sub:'Investigación · Semanal',        lev:'hostile',  ep:'EP 198 · 1h 38m',  audience:'124k' },
  { t:'Mesa Servida',      sub:'Opinión · Cultural',             lev:'neutral',  ep:'EP 011 · 44m',     audience:'18k' },
  { t:'El Operador',       sub:'Backstage · Campañas',           lev:'friendly', ep:'EP 056 · 1h 02m',  audience:'42k' },
  { t:'Plaza Pública',     sub:'Calle · Voz ciudadana',          lev:'hostile',  ep:'EP 220 · 38m',     audience:'68k' },
];

const PRESS_RELEASES = [
  { src:'EL ESTANDARTE',   t:'PRD consolida la delantera en debate televisado', tone:'pos', time:'14:24' },
  { src:'AURORA TIMES',    t:'Orellana convoca a frente "antiprogresista"',     tone:'neg', time:'13:48' },
  { src:'LA VOZ AUSTRAL',  t:'Sequía en Llanos: candidatos evitan compromiso',  tone:'warn',time:'12:11' },
  { src:'DIARIO DEL PUERTO',t:'Bahía Real bate récord histórico de asistencia', tone:'pos', time:'10:32' },
];

function MediaEcosystem({ onClose }) {
  const [tab, setTab] = useStateMED('stream');
  const [tick, setTick] = useStateMED(0);
  useEffectMED(() => {
    let raf = 0;
    const loop = () => { setTick(v => v + 0.014); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="mediaeco">
      {/* TOP */}
      <header className="mediaeco__top">
        <div className="mediaeco__top-l">
          <div className="mediaeco__top-l-mark">◯</div>
          <div>
            <div className="mediaeco__top-l-name">MEDIA ECOSYSTEM</div>
            <div className="mediaeco__top-l-sub">STREAM · PRESS · PODCASTS · TRENDS</div>
          </div>
        </div>
        <div className="mediaeco__top-tabs">
          {[
            ['stream','◐ STREAM'],
            ['press', '▤ PRESS'],
            ['podcasts','◯ PODCASTS'],
            ['live',  '● LIVE TV'],
          ].map(([id,lbl]) => (
            <button key={id}
              className={`mediaeco__tab ${tab===id?'mediaeco__tab--active':''}`}
              onClick={()=>setTab(id)}>{lbl}</button>
          ))}
        </div>
        <div className="mediaeco__top-r">
          <span>SENTIMENT NET · <span style={{color:'var(--pos)'}}>+18.4</span></span>
          <span>REACH · 4.2M / 24h</span>
          <button className="navbtn" onClick={onClose} style={{padding:'4px 10px'}}>← MENU</button>
        </div>
      </header>

      {/* LEFT — Posts feed */}
      <aside className="mediaeco__left">
        <div className="mep-card">
          <div className="mep-card__head">
            <span>STREAM · PULSE FEED</span>
            <span>LIVE · 1.4k/min</span>
          </div>
          <div className="mep-card__body" style={{padding:0}}>
            {POSTS.map((p,i) => (
              <div key={i} className="mep-post">
                <div className="mep-post__avatar" style={{background:p.col}}>
                  {p.u.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}
                </div>
                <div>
                  <div className="mep-post__head">
                    <span className="mep-post__user">{p.u}{p.verified && <span style={{color:'var(--accent)', marginLeft:4}}>◈</span>}</span>
                    <span className="mep-post__handle">{p.h}</span>
                    <span className="mep-post__time">· {p.t}</span>
                  </div>
                  <div className="mep-post__text">{p.text}</div>
                  <div className="mep-post__meta">
                    <span><i>↻</i>{p.rt}</span>
                    <span><i>♡</i>{p.re}</span>
                    <span><i>◐</i>{p.vw}</span>
                    <span><i>✎</i>RESPONDER</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* CENTER — Live broadcast simulation */}
      <main className="mediaeco__center">
        {tab === 'live' && <LiveTVPane tick={tick}/>}
        {tab === 'stream' && <StreamCenterPane tick={tick}/>}
        {tab === 'press' && <PressPane/>}
        {tab === 'podcasts' && <PodcastsPane/>}
      </main>

      {/* RIGHT — trends + sentiment */}
      <aside className="mediaeco__right">
        <div className="mep-card">
          <div className="mep-card__head"><span>TENDENCIAS · NACIONAL</span><span>06</span></div>
          <div className="mep-card__body" style={{padding:0}}>
            {TRENDS.map((tr,i)=>(
              <div key={i} className="mep-trend">
                <span className="mep-trend__rank">{(i+1).toString().padStart(2,'0')}</span>
                <span className="mep-trend__tag">{tr.tag}</span>
                <span className="mep-trend__vol">{tr.vol}</span>
                <svg viewBox="0 0 100 18" className="mep-trend__spark" preserveAspectRatio="none">
                  <polyline
                    points={tr.spark.map((v,j)=>`${j*9.1},${18 - (v/42)*16}`).join(' ')}
                    fill="none" stroke="var(--accent)" strokeWidth="1.4"/>
                </svg>
              </div>
            ))}
          </div>
        </div>

        <div className="mep-card">
          <div className="mep-card__head"><span>SENTIMENT · CANDIDATA</span><span>+18.4</span></div>
          <div className="mep-card__body">
            <div className="mep-waveform">
              {Array.from({length:48}).map((_,i)=>(
                <i key={i} style={{
                  animationDelay: `${(i*0.04)%1.4}s`,
                  background: i%4===0 ? '#5E9B7E' : i%3===0 ? '#5B8FB9' : 'var(--accent)',
                }}/>
              ))}
            </div>
            <div className="mep-sentiment" style={{marginTop:14}}>
              <div className="mep-sentiment__cell">
                <div className="mep-sentiment__cell-lbl">POSITIVO</div>
                <div className="mep-sentiment__cell-val" style={{color:'var(--pos)'}}>52%</div>
                <div className="mep-sentiment__cell-sub">+3.2 24h</div>
              </div>
              <div className="mep-sentiment__cell">
                <div className="mep-sentiment__cell-lbl">NEUTRAL</div>
                <div className="mep-sentiment__cell-val">31%</div>
                <div className="mep-sentiment__cell-sub">-1.1 24h</div>
              </div>
              <div className="mep-sentiment__cell">
                <div className="mep-sentiment__cell-lbl">NEGATIVO</div>
                <div className="mep-sentiment__cell-val" style={{color:'var(--neg)'}}>17%</div>
                <div className="mep-sentiment__cell-sub">-2.1 24h</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mep-card">
          <div className="mep-card__head"><span>PRESS RELEASES</span><span>04</span></div>
          <div className="mep-card__body" style={{padding:0}}>
            {PRESS_RELEASES.map((r,i)=>(
              <div key={i} style={{
                display:'grid', gridTemplateColumns:'90px 1fr 50px',
                gap:8, padding:'8px 12px',
                borderBottom:'1px solid rgba(255,255,255,0.04)',
                fontSize:11
              }}>
                <span className="mono" style={{color:'var(--accent)', letterSpacing:'0.14em'}}>{r.src}</span>
                <span className={`tone--${r.tone}`} style={{color: r.tone==='pos'?'var(--pos)':r.tone==='neg'?'var(--neg)':r.tone==='warn'?'var(--warn)':'var(--text)'}}>{r.t}</span>
                <span className="mono" style={{textAlign:'right', color:'var(--text-muted)'}}>{r.time}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* LOWER — short-video FRAMES carousel */}
      <div className="mediaeco__lower">
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:10,
          fontFamily:'IBM Plex Mono, monospace', fontSize:10, letterSpacing:'0.2em',
          color:'var(--text-muted)'}}>
          <span>FRAMES · CLIPS CORTOS · TRENDING</span>
          <span>08 ACTIVOS · 4.2M VIEWS / 24H</span>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(8, 1fr)', gap:12}}>
          {[
            { u:'@auroranews',     v:'214k', text:'Highlights del debate' },
            { u:'@voto_joven',     v:'88k',  text:'POV: votando con 19' },
            { u:'@calle_ahora',    v:'62k',  text:'Llegada a Plaza Mayor' },
            { u:'@minuto_politico',v:'52k',  text:'¿Qué dijo Orellana?' },
            { u:'@frente_amplio',  v:'41k',  text:'Voluntarios día 64' },
            { u:'@_vegaopinion',   v:'33k',  text:'3 razones para segunda vuelta' },
            { u:'@costa_atl',      v:'28k',  text:'Bahía Real concentra' },
            { u:'@check_político', v:'22k',  text:'Fact-check · datos PRD' },
          ].map((f,i)=>(
            <div key={i} style={{
              position:'relative', aspectRatio:'9/16',
              background: `linear-gradient(135deg, ${['#1A1410','#0E1A1F','#0F141B','#180A0A'][i%4]}, #050709)`,
              border:'1px solid var(--border)', overflow:'hidden',
              cursor:'pointer',
            }}>
              {/* play indicator */}
              <div style={{position:'absolute', top:6, left:6,
                fontFamily:'IBM Plex Mono, monospace', fontSize:9,
                color:'#C24A4A', letterSpacing:'0.18em'}}>● {f.v}</div>
              {/* waveform */}
              <div style={{position:'absolute', bottom:24, left:6, right:6,
                display:'flex', gap:1.5, height:14, alignItems:'flex-end'}}>
                {Array.from({length:20}).map((_,j)=>(
                  <i key={j} style={{
                    flex:1, background:'var(--accent)',
                    height:`${20 + Math.abs(Math.sin(tick*2 + i + j*0.4))*70}%`,
                    opacity:0.85,
                  }}/>
                ))}
              </div>
              <div style={{position:'absolute', bottom:4, left:6, right:6,
                fontFamily:'IBM Plex Mono, monospace', fontSize:9.5,
                color:'#F4E9C8', lineHeight:1.3,
                textShadow:'0 1px 3px rgba(0,0,0,0.8)'}}>
                <div style={{color:'var(--accent)'}}>{f.u}</div>
                <div>{f.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================== panes =============================== */
function LiveTVPane({ tick }) {
  return (
    <div className="mep-card" style={{margin:0}}>
      <div className="mep-card__head"><span>LIVE · AURORA TV · CHANNEL 04</span><span>● ON AIR</span></div>
      <div className="mep-card__body">
        <div className="mep-live">
          <div className="mep-live__chrome">● LIVE · STUDIO 01 · CAM 02</div>
          {/* studio backdrop */}
          <svg viewBox="0 0 600 320" preserveAspectRatio="xMidYMid slice"
            style={{position:'absolute', inset:0, width:'100%', height:'100%'}}>
            <defs>
              <linearGradient id="livetv-bg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1A0A0F"/>
                <stop offset="100%" stopColor="#050709"/>
              </linearGradient>
            </defs>
            <rect width="600" height="320" fill="url(#livetv-bg)"/>
            {/* big screen behind */}
            <rect x="60" y="20" width="220" height="120" fill="#0E1A28" stroke="#26404E" strokeWidth="0.5"/>
            <text x="170" y="42" textAnchor="middle" fill="#5B8FB9" fontSize="10"
              fontFamily="IBM Plex Mono, monospace" letterSpacing="0.16em">PROYECCIÓN · 38%</text>
            <text x="170" y="80" textAnchor="middle" fill="#F4E9C8" fontSize="32"
              fontFamily="Source Serif 4, serif">29.4%</text>
            <text x="170" y="100" textAnchor="middle" fill="#5B8FB9" fontSize="11"
              fontFamily="IBM Plex Mono, monospace">PRD · VASCONCELOS</text>
            {/* second screen */}
            <rect x="320" y="20" width="220" height="120" fill="#1A0A0A" stroke="#3A1A1A" strokeWidth="0.5"/>
            <text x="430" y="42" textAnchor="middle" fill="#C24A4A" fontSize="10"
              fontFamily="IBM Plex Mono, monospace" letterSpacing="0.16em">PROYECCIÓN · 38%</text>
            <text x="430" y="80" textAnchor="middle" fill="#F4E9C8" fontSize="32"
              fontFamily="Source Serif 4, serif">28.1%</text>
            <text x="430" y="100" textAnchor="middle" fill="#C24A4A" fontSize="11"
              fontFamily="IBM Plex Mono, monospace">MNP · ORELLANA</text>
            {/* desk */}
            <rect x="120" y="200" width="360" height="80" fill="#2A1414"/>
            {/* two anchors */}
            <g transform="translate(220 180)">
              <circle r="22" fill="#1A1010"/>
              <path d="M -34 50 Q -34 18 0 18 Q 34 18 34 50 Z" fill="#1A1010"/>
              <text y="64" textAnchor="middle" fill="#F4E9C8" fontSize="8"
                fontFamily="IBM Plex Mono, monospace">CARLA MENDIZÁBAL</text>
            </g>
            <g transform="translate(380 180)">
              <circle r="22" fill="#1A1010"/>
              <path d="M -34 50 Q -34 18 0 18 Q 34 18 34 50 Z" fill="#1A1010"/>
              <text y="64" textAnchor="middle" fill="#F4E9C8" fontSize="8"
                fontFamily="IBM Plex Mono, monospace">IVÁN OTÁROLA</text>
            </g>
            {/* scanlines */}
            <g>
              {Array.from({length:80}).map((_,i) => (
                <line key={i} x1="0" y1={i*4} x2="600" y2={i*4}
                  stroke="rgba(255,255,255,0.02)" strokeWidth="1"/>
              ))}
            </g>
          </svg>

          <div className="mep-live__lower3">
            <div className="l3-eyebrow">▶ AVANCE · MESAS REPORTANDO</div>
            <div className="l3-head">Vasconcelos al frente con +1.3 pt sobre Orellana</div>
          </div>
          <div className="mep-live__ticker">
            <div className="mep-live__ticker-inner">
              ● BREAKING · COSTA ATLÁNTICA REPORTA AL 71% · PRD LIDERA EN 7 DE 12 PROVINCIAS · LLANOS OCCIDENTALES EN DISPUTA · DEBATE NACIONAL CONFIRMADO 72h · BOLSA REGIONAL +1.8% ·
            </div>
          </div>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, marginTop:14}}>
          {['CHANNEL 04 · AURORA NETWORK','CHANNEL 11 · PRENSA NACIONAL','CHANNEL 22 · LA VOZ AUSTRAL','PUBLIC TV'].map((c,i)=>(
            <div key={i} style={{
              border:'1px solid var(--border)', aspectRatio:'16/9',
              background:`linear-gradient(135deg, ${['#0E1A28','#1A0A0A','#1A1410','#0F141B'][i]}, #050709)`,
              position:'relative', cursor:'pointer',
            }}>
              <div style={{position:'absolute', top:6, left:8,
                fontFamily:'IBM Plex Mono, monospace', fontSize:9,
                color:'#C24A4A', letterSpacing:'0.18em'}}>● LIVE</div>
              <div style={{position:'absolute', bottom:6, left:8, right:8,
                fontFamily:'IBM Plex Mono, monospace', fontSize:9,
                color:'#F4E9C8', letterSpacing:'0.16em'}}>{c}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StreamCenterPane({ tick }) {
  return (
    <div>
      <div className="mep-card">
        <div className="mep-card__head"><span>COMPOSE · ANUNCIO OFICIAL</span><span>BORRADOR</span></div>
        <div className="mep-card__body">
          <div style={{
            background:'rgba(5,7,9,0.55)', border:'1px solid var(--border)',
            padding:14, minHeight:120, fontFamily:'Source Serif 4, serif',
            fontSize:14, color:'var(--text)', lineHeight:1.55
          }}>
            <span style={{color:'var(--text-muted)'}}>Borrador · 22:14</span><br/>
            Gracias por estar con nosotros esta noche. Lo que está pasando en San Esteban
            no es una victoria de un partido — es <em style={{color:'var(--accent)'}}>una promesa</em> que
            volvió a su lugar.
            <span style={{background:'rgba(201,169,97,0.18)', padding:'1px 4px', marginLeft:4}}>[insertar dato CA]</span>
          </div>
          <div style={{display:'flex', gap:8, marginTop:12,
            fontFamily:'IBM Plex Mono, monospace', fontSize:10, letterSpacing:'0.16em'}}>
            <button className="actionbtn" style={{flex:1}}>PUBLICAR · PULSE</button>
            <button className="actionbtn" style={{flex:1}}>HILO · 12 POSTS</button>
            <button className="actionbtn" style={{flex:1}}>FRAME · 60s</button>
            <button className="actionbtn" style={{flex:1}}>+ TODOS</button>
          </div>
        </div>
      </div>
      <div className="mep-card">
        <div className="mep-card__head"><span>VOLUMEN · ÚLTIMOS 60 MIN</span><span>+22%</span></div>
        <div className="mep-card__body">
          <svg viewBox="0 0 400 100" style={{width:'100%', height:100, display:'block'}}>
            <defs>
              <linearGradient id="vol-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {Array.from({length:60}).map((_,i)=>{
              const h = 10 + Math.abs(Math.sin(tick*0.7 + i*0.3))*60 + (i/60)*22;
              return (
                <rect key={i} x={i*6.5} y={100-h} width="5" height={h}
                  fill="url(#vol-grad)" stroke="var(--accent)" strokeWidth="0.4"/>
              );
            })}
          </svg>
        </div>
      </div>
      <div className="mep-card">
        <div className="mep-card__head"><span>INFLUENCERS · TOP REACH</span><span>32</span></div>
        <div className="mep-card__body" style={{padding:0}}>
          {[
            { n:'@aurora_news',      r:'2.1M', tone:'pos' },
            { n:'@minutopolitico',   r:'1.4M', tone:'warn' },
            { n:'@vegaopinion',      r:'820k', tone:'neg' },
            { n:'@frente_amplio',    r:'412k', tone:'pos' },
            { n:'@voto_joven',       r:'380k', tone:'pos' },
          ].map((p,i)=>(
            <div key={i} style={{
              display:'grid', gridTemplateColumns:'1fr 80px 60px',
              gap:10, padding:'9px 14px',
              borderBottom:'1px solid rgba(255,255,255,0.04)',
              fontFamily:'IBM Plex Mono, monospace', fontSize:11,
            }}>
              <span style={{color:'var(--text)'}}>{p.n}</span>
              <span style={{color:'var(--text-muted)', textAlign:'right'}}>{p.r}</span>
              <span style={{textAlign:'right', color: p.tone==='pos'?'var(--pos)':p.tone==='neg'?'var(--neg)':'var(--warn)'}}>
                {p.tone==='pos'?'ALIADO':p.tone==='neg'?'HOSTIL':'NEUTRAL'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PressPane() {
  const ARTICLES = [
    { src:'EL ESTANDARTE', date:'12·OCT·2026', t:'PRD consolida la delantera tras el debate televisado',
      d:'La candidata mostró dominio del temario económico y rural. Encuestas internas la dan al frente por +2.4 pt.', tone:'pos' },
    { src:'AURORA TIMES',  date:'12·OCT·2026', t:'Orellana convoca a frente "antiprogresista"',
      d:'El candidato de MNP intenta unificar el voto opositor a 28 días de las generales.', tone:'neg' },
    { src:'LA VOZ AUSTRAL',date:'11·OCT·2026', t:'Sequía en Llanos · candidatos sin propuestas concretas',
      d:'Las cuatro fuerzas principales evitan comprometerse con la mesa de crisis hídrica del oeste.', tone:'warn' },
  ];
  return (
    <div>
      {ARTICLES.map((a,i)=>(
        <div key={i} className="mep-card">
          <div className="mep-card__head">
            <span>{a.src} · {a.date}</span>
            <span style={{color: a.tone==='pos'?'var(--pos)':a.tone==='neg'?'var(--neg)':'var(--warn)'}}>
              {a.tone==='pos'?'FAVORABLE':a.tone==='neg'?'HOSTIL':'NEUTRAL'}
            </span>
          </div>
          <div className="mep-card__body">
            <div style={{fontFamily:'Source Serif 4, serif', fontSize:20, lineHeight:1.2, color:'var(--text)'}}>{a.t}</div>
            <div style={{marginTop:8, fontSize:13, color:'var(--text-dim)', lineHeight:1.55}}>{a.d}</div>
            <div style={{marginTop:12, display:'flex', gap:14,
              fontFamily:'IBM Plex Mono, monospace', fontSize:10, letterSpacing:'0.16em',
              color:'var(--text-muted)'}}>
              <span>◐ 412k LECTORES</span>
              <span>↻ 1.2k COMPARTIDOS</span>
              <span>✎ RESPONDER</span>
              <span>◈ ENVIAR A WAR ROOM</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PodcastsPane() {
  return (
    <div className="mep-card">
      <div className="mep-card__head"><span>PODCASTS · COMENTARISTAS</span><span>{PODCASTS.length} ACTIVOS</span></div>
      <div className="mep-card__body" style={{padding:0}}>
        {PODCASTS.map((p,i)=>(
          <div key={i} className="mep-pod">
            <div className="mep-pod__cover">◯</div>
            <div>
              <div className="mep-pod__title">{p.t}</div>
              <div className="mep-pod__sub">{p.sub} · {p.ep} · {p.audience}</div>
            </div>
            <span className={`mep-pod__lev mep-pod__lev--${p.lev}`}>
              {p.lev === 'friendly' ? 'ALIADO' : p.lev === 'hostile' ? 'HOSTIL' : 'NEUTRAL'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

window.MediaEcosystem = MediaEcosystem;
