/* =========================================================================
   CAMPAIGN COMMAND — Campaign Dashboard (War Room)
   ========================================================================= */
const { useState: useStateDB, useEffect: useEffectDB, useMemo: useMemoDB } = React;

function Dashboard({ onOpenEvent, onOpenCandidate, onOpenMedia }) {
  const PLAYER = D.PLAYER;
  const polling = D.POLLING;
  const lastPoll = polling[polling.length-1];
  const prevPoll = polling[polling.length-2];

  const [tick, setTick] = useStateDB(0);
  useEffectDB(() => {
    let raf = 0;
    const loop = () => { setTick(v => v + 0.018); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const series = [
    { key:'PRD', label:'PRD', color:D.PARTIES.PRD.color },
    { key:'MNP', label:'MNP', color:D.PARTIES.MNP.color },
    { key:'FAS', label:'FAS', color:D.PARTIES.FAS.color },
    { key:'VC',  label:'VC',  color:D.PARTIES.VC.color  },
  ];

  // tension score — derived from crises and momentum
  const tension = Math.min(100, 28 + Math.sin(tick*0.4)*6);
  const threat = tension > 60 ? 'L3 · CRÍTICO' : tension > 40 ? 'L2 · ELEVADO' : 'L1 · NORMAL';

  return (
    <div className="dash dash--war">
      {/* ATMOSPHERE LAYER — scanlines + vignette */}
      <div className="dash__atmosphere" aria-hidden="true">
        <div className="dash__scanlines"/>
        <div className="dash__vignette"/>
      </div>

      {/* WAR ROOM BROADCAST BAR */}
      <div className="dashwar-bar">
        <div className="dashwar-bar__l mono">
          <span className="dashwar-bar__cls">▣ CAMPAIGN OPERATIONS · CC-OPS</span>
          <span className="sep">│</span>
          <span>DAY 64 / 92 · T−28 DAYS</span>
          <span className="sep">│</span>
          <span>BRIEFING 06:00 · {(((tick*30)|0)%24).toString().padStart(2,'0')}:{(((tick*60)|0)%60).toString().padStart(2,'0')}:{(((tick*120)|0)%60).toString().padStart(2,'0')}</span>
        </div>
        <div className="dashwar-bar__c mono">
          <span className="dot dot--live"/>
          <span>LIVE FEED · INTEL</span>
        </div>
        <div className="dashwar-bar__r mono">
          <span className={`dashwar-bar__threat ${tension>60?'dashwar-bar__threat--high':tension>40?'dashwar-bar__threat--mid':''}`}>
            THREAT · {threat}
          </span>
          <span className="dashwar-bar__alert" onClick={onOpenEvent} style={{cursor:'pointer'}}>
            <span className="alert-dot"/>
            CRISIS · LO · {D.ACTIVE_EVENT.timer}
          </span>
        </div>
      </div>

      {/* HERO — cinematic candidate + KPIs + alerts */}
      <div className="dashwar-hero">
        {/* candidate portrait */}
        <div className="dashwar-hero__candidate">
          <div className="dashwar-hero__portrait">
            <svg viewBox="0 0 80 100" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="port-bg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1A2230"/>
                  <stop offset="100%" stopColor="#0A0D11"/>
                </linearGradient>
                <pattern id="p-cand2" width="6" height="6" patternUnits="userSpaceOnUse">
                  <path d="M0,6 L6,0" stroke="#2A3340" strokeWidth="0.6"/>
                </pattern>
              </defs>
              <rect width="80" height="100" fill="url(#port-bg)"/>
              <rect width="80" height="100" fill="url(#p-cand2)"/>
              {/* silhouette */}
              <circle cx="40" cy="44" r="18" fill="#070A0E"/>
              <path d="M 8 100 Q 8 64 40 64 Q 72 64 72 100 Z" fill="#070A0E"/>
              <text x="40" y="50" textAnchor="middle" fontSize="14" fill="#C9A961"
                fontFamily="Source Serif 4, serif">EV</text>
              {/* badge */}
              <rect x="0" y="92" width="80" height="8" fill="#C9A961"/>
              <text x="40" y="98.5" textAnchor="middle" fontSize="5" fill="#0A0D11"
                fontFamily="IBM Plex Mono, monospace" letterSpacing="0.2em">PRD · CANDIDATA</text>
              {/* live dot */}
              <circle cx="72" cy="8" r="2.5" fill="#C24A4A">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
          <div className="dashwar-hero__id">
            <div className="dashwar-hero__eyebrow mono">CANDIDATA · DOSSIER ACTIVO</div>
            <h1 className="dashwar-hero__h1">
              Elena<br/>
              <span style={{color:'var(--accent)'}}>Vasconcelos</span>
            </h1>
            <div className="dashwar-hero__role mono">
              SENADORA · COSTA ATLÁNTICA · 28 AÑOS EN POLÍTICA
            </div>
            <div className="dashwar-hero__traits">
              {PLAYER.traits.map(t => <span key={t} className="dashwar-trait">{t}</span>)}
            </div>
            <button className="dashwar-hero__cta mono" onClick={onOpenCandidate}>
              <span>FULL DOSSIER</span><span>→</span>
            </button>
          </div>
        </div>

        {/* KPIs — giant tiles */}
        <div className="dashwar-hero__kpis">
          <KpiTile lbl="INTENT. VOTO" val={lastPoll.PRD} suffix="%"
            delta={lastPoll.PRD - prevPoll.PRD} deltaSuffix="pt · 7d"
            sub="POSICIÓN 1°" leader tick={tick}/>
          <KpiTile lbl="APROBACIÓN" val={PLAYER.approval.national} suffix="%"
            delta={2} deltaSuffix="pt · 7d"
            sub="UMBRAL 50% — −3pt" tick={tick}/>
          <KpiTile lbl="MOMENTUM" val={PLAYER.momentum} prefix="+"
            delta={20} deltaSuffix="neto 7d"
            sub="MEDIA · BASE · FUND" color="#5E9B7E" tick={tick}/>
          <KpiTile lbl="WAR CHEST" val={PLAYER.war_chest} suffix="M" prefix="$" decimals={1}
            delta={2.1} deltaSuffix="M · sem"
            sub={`BURN $0.8M/d · ${Math.floor(PLAYER.war_chest/0.8)}d RESTANTES`} color="#C9A961" tick={tick}/>
          <KpiTile lbl="MEDIA SHARE" val={Math.round(PLAYER.media_share*100)} suffix="%"
            delta={-4} deltaSuffix="pt · vs MNP"
            sub="VS MNP 38% · FAS 14%" color="#5B8FB9" tick={tick}/>
        </div>

        {/* CRITICAL ALERT */}
        <div className="dashwar-hero__alert">
          <div className="dashwar-hero__alert-head mono">
            <span className="alert-dot"/>
            <span>CRISIS · NIVEL 3</span>
            <span style={{marginLeft:'auto', color:'var(--text-muted)'}}>{D.ACTIVE_EVENT.timer}</span>
          </div>
          <div className="dashwar-hero__alert-body">
            {D.ACTIVE_EVENT.headline}
          </div>
          <div className="dashwar-hero__alert-foot mono">
            <span>NACIONAL <span className="accent-neg">−12</span></span>
            <span>LOCAL <span className="accent-neg">−28</span></span>
            <span>BASE <span className="accent-neg">−8</span></span>
          </div>
          <button className="dashwar-hero__alert-cta mono" onClick={onOpenEvent}>
            <span>ABRIR BRIEFING</span><span>↵</span>
          </button>
        </div>
      </div>

      {/* CAMPAIGN ACTIONS — deck of cards */}
      <div className="dashwar-actions">
        <div className="dashwar-actions__head mono">
          <span className="dashwar-actions__lbl">CAMPAIGN ACTIONS · DECISIONES DEL DÍA</span>
          <span className="dashwar-actions__counts">
            <span>03 / 05 ACCIONES USADAS</span>
            <span className="sep">│</span>
            <span>RECUPERA 06:00</span>
          </span>
        </div>
        <div className="dashwar-actions__grid">
          <ActionCard ic="★" label="RALLY" cost="$1.2M · 1d" roi="+3.2pt" desc="Acto masivo · alta visibilidad" hot/>
          <ActionCard ic="◐" label="TV AD" cost="$0.6M" roi="+1.8pt" desc="Pauta regional 48h"/>
          <ActionCard ic="◉" label="SOCIAL" cost="$0.2M" roi="+0.9pt" desc="Campaña digital coordinada"/>
          <ActionCard ic="✎" label="DEBATE PREP" cost="2d" roi="+2.6pt" desc="4 simulacros · D-3" critical/>
          <ActionCard ic="$" label="FUNDRAISER" cost="1d" roi="+$2.4M" desc="Cena alto perfil · 24 donors"/>
          <ActionCard ic="◈" label="ENDORSEMENT" cost="—" roi="+1.4pt" desc="Mamani (FAS) · negociación abierta"/>
          <ActionCard ic="⚔" label="OPP ATTACK" cost="$0.4M" roi="±2.0pt" desc="Riesgo elevado · backlash 18%"/>
          <ActionCard ic="✦" label="SPEECH" cost="1d" roi="+2.1pt" desc="Anuncio plataforma educativa"/>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="dash__grid">

        {/* BIG POLLING SCREEN */}
        <PanelChrome label="01" caption="POLLING NACIONAL · BIG SCREEN" className="span-8"
          right={<div className="mono dim">↑ proyección bayesiana · ±2.1pt · TRACKING</div>}>
          <div className="dashwar-bigscreen">
            <div className="dashwar-bigscreen__chrome mono">
              <span>● LIVE · CHANNEL 04</span>
              <span style={{marginLeft:'auto'}}>S-12 → S-1 · 12 SEMANAS</span>
            </div>
            <MultiLineChart data={polling} series={series} width={760} height={260}/>
            <div className="dashwar-bigscreen__overlay" aria-hidden="true">
              {/* vertical sweep */}
              <div className="dashwar-bigscreen__sweep" style={{left:`${((tick*4)%100)}%`}}/>
            </div>
            <div className="dashwar-bigscreen__foot mono">
              <span>VALID · 18.4k MUESTRAS</span>
              <span className="sep">│</span>
              <span>MARGEN ±2.1pt</span>
              <span className="sep">│</span>
              <span>METODOLOGÍA · MIXED-MODE</span>
              <span className="sep">│</span>
              <span style={{marginLeft:'auto', color:'var(--accent)'}}>NEXT POLL · D-3</span>
            </div>
          </div>
          <div className="polling-foot">
            {series.map(s => (
              <div key={s.key} className="polling-foot__row">
                <span className="polling-foot__dot" style={{background:s.color}}/>
                <span className="polling-foot__short mono">{s.label}</span>
                <span className="polling-foot__pct mono">{lastPoll[s.key]}%</span>
                <span className={`polling-foot__d mono ${lastPoll[s.key]>polling[0][s.key]?'accent-pos':'accent-neg'}`}>
                  {lastPoll[s.key]>polling[0][s.key]?'+':''}{lastPoll[s.key]-polling[0][s.key]}pt
                </span>
              </div>
            ))}
          </div>
        </PanelChrome>

        {/* CANDIDATE VITALS */}
        <PanelChrome label="02" caption="CANDIDATA · VITALS" className="span-4">
          <div className="dashwar-vitals">
            <VitalBar lbl="ENERGY"      val={62} max={100} note="Próximo descanso D-2" warn={62<40} tick={tick}/>
            <VitalBar lbl="CHARISMA"    val={PLAYER.image.charisma} max={100} note="Top quintil nacional" tick={tick}/>
            <VitalBar lbl="COMPETENCE"  val={PLAYER.image.competence} max={100} note="Fortaleza histórica" tick={tick}/>
            <VitalBar lbl="INTEGRITY"   val={PLAYER.image.integrity} max={100} note="Fideicomiso 2021 −12" tick={tick}/>
            <VitalBar lbl="DECISIVENESS"val={PLAYER.image.decisiveness} max={100} note="Crítico para debate" warn tick={tick}/>
            <VitalBar lbl="TRUST"       val={56} max={100} note="Estable" tick={tick}/>
            <VitalBar lbl="REPUTATION"  val={71} max={100} note="+4 esta semana" tick={tick}/>
            <div className="dashwar-vitals__scandals">
              <div className="dashwar-vitals__scandals-head mono">
                <span>⚠ ESCÁNDALOS ACTIVOS</span>
                <span>01</span>
              </div>
              <div className="dashwar-vitals__scandals-row">
                <span className="dashwar-vitals__scandals-y mono">2021</span>
                <span className="dashwar-vitals__scandals-t">Caso fideicomiso educativo</span>
                <span className="dashwar-vitals__scandals-s mono">MEDIO</span>
              </div>
            </div>
          </div>
        </PanelChrome>

        {/* ISSUE SALIENCE */}
        <PanelChrome label="03" caption="ISSUE SALIENCE" className="span-4">
          <div className="issuelist">
            {D.ISSUES.map((iss,i) => {
              const party = D.PARTIES[iss.owned];
              return (
                <div key={iss.id} className="issuerow">
                  <span className="issuerow__idx mono">{String(i+1).padStart(2,'0')}</span>
                  <span className="issuerow__label">{iss.label}</span>
                  <span className="issuerow__owner mono" style={{color:party.color}}>◆ {party.short}</span>
                  <span className="issuerow__pct mono">{iss.salience}</span>
                  <span className={`issuerow__delta mono ${iss.delta>0?'accent-pos':iss.delta<0?'accent-neg':''}`}>
                    {iss.delta>0?'+':''}{iss.delta}
                  </span>
                  <div className="issuerow__bar">
                    <div className="issuerow__fill" style={{width:`${iss.salience}%`, background:party.color}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </PanelChrome>

        {/* MOMENTUM GAUGE */}
        <PanelChrome label="04" caption="MOMENTUM" className="span-2">
          <div className="gaugewrap">
            <Gauge value={68} label="MOMENTUM" color="#5E9B7E" size={140}/>
            <div className="gaugewrap__detail">
              <div className="gaugewrap__row mono"><span>BASE</span><span className="accent-pos">+12</span></div>
              <div className="gaugewrap__row mono"><span>MEDIA</span><span className="accent-pos">+8</span></div>
              <div className="gaugewrap__row mono"><span>FUND</span><span className="accent-pos">+5</span></div>
              <div className="gaugewrap__row mono"><span>EVENTS</span><span className="accent-neg">−3</span></div>
              <div className="gaugewrap__row mono"><span>RIVALES</span><span className="accent-neg">−2</span></div>
              <div className="gaugewrap__row gaugewrap__row--total mono">
                <span>NETO 7d</span><span className="accent-pos">+20</span>
              </div>
            </div>
          </div>
        </PanelChrome>

        {/* COALITION STRENGTH */}
        <PanelChrome label="05" caption="COALITION STRENGTH" className="span-2">
          <div className="dashwar-coalition">
            <CoalitionNode lbl="PRD" val={31} you/>
            <CoalitionNode lbl="FAS" val={24} note="ALIADO" hint="Mamani: condicional"/>
            <CoalitionNode lbl="VC"  val={13} note="NEUTRAL" hint="Tagliaferri: silencio"/>
            <CoalitionNode lbl="IND" val={6} note="DISPERSO" hint=""/>
            <CoalitionNode lbl="MNP" val={26} opp note="OPOSICIÓN"/>
            <div className="dashwar-coalition__total mono">
              <span>BLOQUE PROPIO</span>
              <span className="accent-pos">68%</span>
            </div>
          </div>
        </PanelChrome>

        {/* LIVE TICKERS */}
        <PanelChrome label="06" caption="LIVE TICKERS · INTEL FEED" className="span-4"
          right={<button className="linkbtn mono" onClick={onOpenMedia}>FULL ROOM →</button>}>
          <div className="dashwar-ticker">
            <div className="dashwar-ticker__head mono">
              <span className="dashwar-ticker__dot"/>
              <span>BREAKING · 24h</span>
              <span style={{marginLeft:'auto'}}>{D.NEWS.length} items</span>
            </div>
            <div className="dashwar-ticker__list">
              {D.NEWS.slice(0,4).map((n,i)=>(
                <div key={i} className={`dashwar-ticker__row tone--${n.tone}`}>
                  <span className="dashwar-ticker__time mono">{n.time}</span>
                  <span className="dashwar-ticker__src mono">{n.src}</span>
                  <span className="dashwar-ticker__head-t">{n.headline}</span>
                </div>
              ))}
            </div>
            <div className="dashwar-ticker__head mono" style={{marginTop:14}}>
              <span className="dashwar-ticker__dot dashwar-ticker__dot--social"/>
              <span>SOCIAL · TRENDING</span>
              <span style={{marginLeft:'auto'}}>06</span>
            </div>
            <div className="dashwar-ticker__trends">
              {[
                ['#Vasconcelos2026','214k','▲'],
                ['#DebateNacional','98k','▲'],
                ['#Orellana','72k','—'],
                ['#FrenteAntiCrisis','41k','▲'],
                ['#SequíaLlanos','18k','▼'],
              ].map((t,i)=>(
                <div key={i} className="dashwar-ticker__trend mono">
                  <span style={{color:'var(--text-muted)'}}>{(i+1).toString().padStart(2,'0')}</span>
                  <span>{t[0]}</span>
                  <span style={{color:'var(--accent)', marginLeft:'auto'}}>{t[1]}</span>
                  <span style={{color: t[2]==='▲'?'var(--pos)':t[2]==='▼'?'var(--neg)':'var(--text-muted)'}}>{t[2]}</span>
                </div>
              ))}
            </div>
            <div className="dashwar-ticker__head mono" style={{marginTop:14}}>
              <span className="dashwar-ticker__dot dashwar-ticker__dot--tv"/>
              <span>TV · COMMENTARY</span>
            </div>
            <div className="dashwar-ticker__tv">
              <div className="dashwar-ticker__tv-row">
                <span className="mono accent-warm">CH 04</span>
                <span>"PRD consolida narrativa de cambio responsable" — Mendizábal</span>
              </div>
              <div className="dashwar-ticker__tv-row">
                <span className="mono" style={{color:'var(--neg)'}}>CH 11</span>
                <span>"Vasconcelos evita responder sobre el fideicomiso" — Vega</span>
              </div>
              <div className="dashwar-ticker__tv-row">
                <span className="mono" style={{color:'var(--info)'}}>CH 22</span>
                <span>"Llanos sigue cortado · gobierno provincial sin acuerdo" — corresponsal</span>
              </div>
            </div>
          </div>
        </PanelChrome>

        {/* VOTER BLOCS */}
        <PanelChrome label="07" caption="VOTER BLOCS" className="span-4">
          <div className="blocs">
            {D.BLOCS.map(b => (
              <div key={b.id} className="bloc">
                <div className="bloc__head">
                  <span className="bloc__name">{b.label}</span>
                  <span className="bloc__share mono">{b.share}%</span>
                </div>
                <div className="bloc__bar">
                  <div className="bloc__seg" style={{width:`${b.you}%`,background:'#5B8FB9'}}/>
                  <div className="bloc__seg" style={{width:`${b.swing}%`,background:'#3a4350'}}/>
                  <div className="bloc__seg" style={{width:`${b.them}%`,background:'#C24A4A'}}/>
                </div>
                <div className="bloc__foot mono">
                  <span className="accent-pos">{b.you}% tú</span>
                  <span className="dim">{b.swing}% swing</span>
                  <span className="accent-neg">{b.them}% rivales</span>
                </div>
              </div>
            ))}
          </div>
        </PanelChrome>

        {/* CALENDAR */}
        <PanelChrome label="08" caption="CAMPAIGN CALENDAR · 7d" className="span-4">
          <div className="cal">
            {D.CALENDAR.map((c,i) => (
              <div key={i} className={`calrow calrow--${c.type}`}>
                <span className="calrow__day mono">{c.day}</span>
                <span className={`calrow__type mono type--${c.type}`}>{c.type.toUpperCase()}</span>
                <div className="calrow__main">
                  <div className="calrow__where">{c.where}</div>
                  <div className="calrow__note mono">{c.note}</div>
                </div>
                <div className="calrow__intensity">
                  {Array.from({length:10}).map((_,j)=>(
                    <span key={j} className={`tick ${j<c.intensity?'tick--on':''}`}/>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PanelChrome>

        {/* DEMOGRAPHIC APPROVAL */}
        <PanelChrome label="09" caption="APROBACIÓN · DEMOGRÁFICA" className="span-4">
          <div className="appdemo">
            {Object.entries(PLAYER.approval).map(([k,v])=>(
              <div key={k} className="appdemo__row">
                <span className="appdemo__lbl mono">{k.toUpperCase()}</span>
                <div className="appdemo__bar">
                  <div className="appdemo__fill" style={{width:`${v}%`, background: v>50?'#5E9B7E':v>40?'#C9A961':'#C24A4A'}}/>
                  <div className="appdemo__50"/>
                </div>
                <span className="appdemo__val mono">{v}%</span>
              </div>
            ))}
            <div className="appdemo__foot mono">
              <span>━ 50% UMBRAL DE PARIDAD</span>
              <span className="accent-pos">+4pt vs semana anterior</span>
            </div>
          </div>
        </PanelChrome>

        {/* STRATEGY ADVISORY */}
        <PanelChrome label="10" caption="STRATEGY PANEL · AI ADVISORY" className="span-8">
          <div className="strat">
            <div className="strat__head mono">
              <span>● RECOMENDACIONES DEL DÍA · MODELO BAYESIANO</span>
              <span>04 ACTIVAS</span>
            </div>
            <div className="strat__row strat__row--critical">
              <span className="strat__prio mono">★★★</span>
              <div className="strat__body">
                <div className="strat__title">Atender crisis hídrica en Llanos Occidentales</div>
                <div className="strat__exp">Riesgo de pérdida de 1.4pt nacional si escala 48h. Anuncio temprano consolida narrativa.</div>
              </div>
              <span className="strat__roi mono accent-pos">+2.1pt</span>
            </div>
            <div className="strat__row">
              <span className="strat__prio mono">★★</span>
              <div className="strat__body">
                <div className="strat__title">Pauta televisiva en Valle Central</div>
                <div className="strat__exp">28% del padrón. Margen vs MNP en VC: 13pt. Saturación televisiva óptima.</div>
              </div>
              <span className="strat__roi mono accent-pos">+1.4pt</span>
            </div>
            <div className="strat__row">
              <span className="strat__prio mono">★★</span>
              <div className="strat__body">
                <div className="strat__title">Prep de debate · 4 simulacros</div>
                <div className="strat__exp">Issues débiles: seguridad, corrupción. Necesitas respuesta &lt; 45s.</div>
              </div>
              <span className="strat__roi mono accent-warm">crítico</span>
            </div>
            <div className="strat__row strat__row--warn">
              <span className="strat__prio mono">⚠</span>
              <div className="strat__body">
                <div className="strat__title">EVITAR: comentar caso fideicomiso 2021</div>
                <div className="strat__exp">MNP intentará reactivarlo. Pivotear hacia educación y salud.</div>
              </div>
              <span className="strat__roi mono accent-neg">−3pt</span>
            </div>
          </div>
        </PanelChrome>

      </div>
    </div>
  );
}

/* -------------------------------------------------------------- KpiTile */
function KpiTile({ lbl, val, suffix='', prefix='', decimals=0, delta=0, deltaSuffix='', sub='', color, leader, tick }) {
  const breath = 0.96 + Math.sin(tick + lbl.charCodeAt(0)*0.3)*0.04;
  return (
    <div className={`dashwar-kpi ${leader?'dashwar-kpi--leader':''}`}>
      <div className="dashwar-kpi__lbl mono">{lbl}</div>
      <div className="dashwar-kpi__val mono" style={{color: color || (leader?'#F4E9C8':'var(--text)'), opacity: breath}}>
        {prefix}<NumberTicker value={val} decimals={decimals}/>{suffix}
      </div>
      <div className={`dashwar-kpi__d mono ${delta>0?'accent-pos':delta<0?'accent-neg':''}`}>
        {delta>0?'▲ +':delta<0?'▼ ':'· '}{Math.abs(delta)} {deltaSuffix}
      </div>
      <div className="dashwar-kpi__sub mono">{sub}</div>
      {leader && <div className="dashwar-kpi__leader mono">● 1°</div>}
    </div>
  );
}

/* -------------------------------------------------------------- ActionCard */
function ActionCard({ ic, label, cost, roi, desc, hot, critical }) {
  return (
    <button className={`dashwar-action ${hot?'dashwar-action--hot':''} ${critical?'dashwar-action--critical':''}`}>
      <div className="dashwar-action__head">
        <span className="dashwar-action__ic">{ic}</span>
        <span className="dashwar-action__label">{label}</span>
        {hot && <span className="dashwar-action__tag mono">HOT</span>}
        {critical && <span className="dashwar-action__tag dashwar-action__tag--crit mono">CRÍTICO</span>}
      </div>
      <div className="dashwar-action__desc">{desc}</div>
      <div className="dashwar-action__foot mono">
        <span className="dashwar-action__cost">{cost}</span>
        <span className="dashwar-action__roi">{roi}</span>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------- VitalBar */
function VitalBar({ lbl, val, max=100, note, warn, tick }) {
  const breath = 0.93 + Math.sin(tick*1.2 + lbl.charCodeAt(0)*0.4)*0.05;
  const w = (val/max)*100;
  const color = val > 70 ? '#5E9B7E' : val > 50 ? '#C9A961' : val > 35 ? '#E6B948' : '#C24A4A';
  return (
    <div className={`dashwar-vital ${warn?'dashwar-vital--warn':''}`}>
      <div className="dashwar-vital__head mono">
        <span className="dashwar-vital__lbl">{lbl}</span>
        <span className="dashwar-vital__val" style={{color}}>{val}</span>
      </div>
      <div className="dashwar-vital__track">
        <div className="dashwar-vital__fill" style={{width:`${w}%`, background:color, opacity:breath}}/>
        {/* tick markers */}
        {[25,50,75].map(t => <div key={t} className="dashwar-vital__t" style={{left:`${t}%`}}/>)}
      </div>
      <div className="dashwar-vital__note mono">{note}</div>
    </div>
  );
}

/* -------------------------------------------------------------- CoalitionNode */
function CoalitionNode({ lbl, val, note, hint, you, opp }) {
  return (
    <div className={`dashwar-coal ${you?'dashwar-coal--you':''} ${opp?'dashwar-coal--opp':''}`}>
      <div className="dashwar-coal__head">
        <span className="dashwar-coal__lbl mono">{lbl}</span>
        <span className="dashwar-coal__val mono">{val}%</span>
      </div>
      {note && <div className="dashwar-coal__note mono">{note}</div>}
      {hint && <div className="dashwar-coal__hint">{hint}</div>}
    </div>
  );
}

window.Dashboard = Dashboard;
