/* =========================================================================
   JUEGO POLÍTICO — Modals (Crisis, Candidate, Media)
   ========================================================================= */
const { useState: useStateMD, useEffect: useEffectMD } = React;

/* ------------------------------------------------------------- CRISIS MODAL */
function CrisisModal({ onClose }) {
  const E = D.ACTIVE_EVENT;
  const [chosen, setChosen] = useStateMD(null);
  const province = D.PROVINCES.find(p => p.id === E.location);
  return (
    <div className="modal-shroud" onClick={onClose}>
      <div className="crisis" onClick={e=>e.stopPropagation()}>
        <div className="crisis__sirenstrip">
          <span className="dot dot--live"/>
          <span className="mono">EVENTO ENTRANTE · {E.classification}</span>
          <span className="mono crisis__timer">TIMER {E.timer}</span>
          <button className="iconbtn iconbtn--ghost" onClick={onClose}>✕</button>
        </div>

        <div className="crisis__body">
          <div className="crisis__left">
            <div className="crisis__id mono">{E.id}</div>
            <div className="crisis__locline mono">
              ◉ PROVINCIA {province.id} · {province.name.toUpperCase()} · CAP {province.capital.toUpperCase()}
            </div>
            <h2 className="crisis__headline">{E.headline}</h2>
            <p className="crisis__summary">{E.summary}</p>

            <div className="crisis__meta">
              <div className="crisis__metarow mono">
                <span>SENTIMIENTO NACIONAL</span>
                <span className="accent-neg">{E.sentiment.national}</span>
              </div>
              <div className="crisis__metarow mono">
                <span>SENTIMIENTO LOCAL</span>
                <span className="accent-neg">{E.sentiment.local}</span>
              </div>
              <div className="crisis__metarow mono">
                <span>BASE PROPIA</span>
                <span className="accent-neg">{E.sentiment.base}</span>
              </div>
              <div className="crisis__metarow mono">
                <span>RIESGO DE ESCALADA</span>
                <span className="accent-warm">ALTO · 48h</span>
              </div>
            </div>

            {/* mini-map of crisis location */}
            <div className="crisis__minimap">
              <svg viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid meet">
                {D.PROVINCES.map(p => (
                  <polygon key={p.id} points={p.polygon}
                    fill={p.id===E.location?'#C24A4A':'#1A2230'}
                    opacity={p.id===E.location?0.9:0.4}
                    stroke="#0A0D11" strokeWidth="1.4"/>
                ))}
                <g transform="translate(275 295)">
                  <circle r="18" fill="none" stroke="#C24A4A" strokeWidth="1.6"/>
                  <circle r="32" fill="none" stroke="#C24A4A" strokeWidth="0.8" opacity="0.5"/>
                </g>
              </svg>
            </div>
          </div>

          <div className="crisis__right">
            <div className="crisis__head mono">
              <span>OPCIONES DE RESPUESTA</span>
              <span>0{E.options.length}</span>
            </div>
            <div className="crisis__opts">
              {E.options.map((o,i) => (
                <button key={i}
                  className={`crisisopt ${chosen===i?'crisisopt--sel':''}`}
                  onClick={()=>setChosen(i)}>
                  <div className="crisisopt__idx mono">{String.fromCharCode(65+i)}</div>
                  <div className="crisisopt__body">
                    <div className="crisisopt__label">{o.label}</div>
                    <div className="crisisopt__cost mono">▸ COSTO · {o.cost}</div>
                    <div className="crisisopt__effect mono">▸ EFECTO · {o.effect}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="crisis__advisors">
              <div className="crisis__advhead mono">CONSEJO DE CAMPAÑA</div>
              <div className="crisis__advrow">
                <span className="adv__role mono">JEFE DE GABINETE</span>
                <span className="adv__quote">"Hay que visitar la zona. Si no aparecés, te van a comer."</span>
                <span className="adv__rec mono">→ A</span>
              </div>
              <div className="crisis__advrow">
                <span className="adv__role mono">DIR. COMUNICACIÓN</span>
                <span className="adv__quote">"Un anuncio de $200M nos coloca dueños del issue 'agua' por 3 semanas."</span>
                <span className="adv__rec mono">→ B</span>
              </div>
              <div className="crisis__advrow">
                <span className="adv__role mono">JEFE DE FINANZAS</span>
                <span className="adv__quote">"$200M no los tenemos. Bancabilidad cero."</span>
                <span className="adv__rec mono">→ C / D</span>
              </div>
            </div>

            <div className="crisis__actions">
              <button className="btn btn--ghost" onClick={onClose}>POSPONER 1h</button>
              <button className={`btn btn--primary ${chosen===null?'btn--disabled':''}`} disabled={chosen===null} onClick={onClose}>
                CONFIRMAR DECISIÓN {chosen!==null?`· ${String.fromCharCode(65+chosen)}`:''}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- CANDIDATE MODAL */
function CandidateModal({ onClose }) {
  const P = D.PLAYER;
  return (
    <div className="modal-shroud" onClick={onClose}>
      <div className="dossier-modal" onClick={e=>e.stopPropagation()}>
        <div className="dm__top">
          <div className="dm__topline mono">
            <span>DOSSIER · CANDIDATA</span>
            <span>FILE-PRD-001</span>
            <span>CLASIFICACIÓN: PÚBLICA</span>
          </div>
          <button className="iconbtn iconbtn--ghost" onClick={onClose}>✕</button>
        </div>

        <div className="dm__body">
          <div className="dm__left">
            <div className="dm__photo">
              <svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMid slice">
                <rect width="200" height="260" fill="#161D26"/>
                <pattern id="p-dossier" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M0,8 L8,0" stroke="#2A3340" strokeWidth="1"/>
                </pattern>
                <rect width="200" height="260" fill="url(#p-dossier)"/>
                <text x="100" y="150" textAnchor="middle" fontSize="80" fill="#C9A961" fontFamily="Source Serif 4">EV</text>
                <text x="100" y="240" textAnchor="middle" fontSize="9" fill="#5A6470" fontFamily="IBM Plex Mono">[ FOTO OFICIAL ]</text>
              </svg>
            </div>
            <div className="dm__name">{P.name}</div>
            <div className="dm__role mono">CANDIDATA PRESIDENCIAL · PRD · 2026</div>
            <div className="dm__bio">{P.background}</div>

            <SectionHead index="01" title="RASGOS"/>
            <div className="dm__traits">
              {P.traits.map(t=><span key={t} className="trait trait--lg">{t}</span>)}
            </div>

            <SectionHead index="02" title="IDEOLOGÍA"/>
            <div className="ideo">
              {Object.entries(P.ideology).map(([k,v])=>{
                const labels = {
                  economic: ['ESTATISMO','MERCADO'],
                  social:   ['CONSERVADOR','PROGRESISTA'],
                  authority:['AUTORITARIO','LIBERTARIO'],
                };
                const [L,R] = labels[k];
                return (
                  <div key={k} className="ideo__row">
                    <span className="ideo__lbl mono">{L}</span>
                    <div className="ideo__track">
                      <div className="ideo__center"/>
                      <div className="ideo__marker" style={{left:`${(v+1)/2*100}%`}}/>
                    </div>
                    <span className="ideo__lbl mono ideo__lbl--r">{R}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="dm__right">
            <SectionHead index="03" title="IMAGEN PÚBLICA"/>
            <div className="dm__image">
              {Object.entries(P.image).map(([k,v])=>(
                <div key={k} className="dm__imgrow">
                  <span className="dm__imgrow-lbl mono">{k.toUpperCase()}</span>
                  <div className="dm__imgrow-bar"><div style={{width:`${v}%`}}/></div>
                  <span className="dm__imgrow-v mono">{v}/100</span>
                </div>
              ))}
            </div>

            <SectionHead index="04" title="APROBACIÓN · CRUZADA"/>
            <div className="dm__appgrid">
              {Object.entries(P.approval).map(([k,v])=>(
                <div key={k} className="appcell">
                  <div className="appcell__lbl mono">{k.toUpperCase()}</div>
                  <div className="appcell__val mono" style={{color: v>50?'#5E9B7E':v>40?'#C9A961':'#C24A4A'}}>{v}%</div>
                </div>
              ))}
            </div>

            <SectionHead index="05" title="LÍNEA HISTÓRICA"/>
            <div className="timeline">
              {P.timeline.map((t,i)=>(
                <div key={i} className="timeline__row">
                  <div className="timeline__year mono">{t.year}</div>
                  <div className="timeline__dot"/>
                  <div className="timeline__label">{t.label}</div>
                </div>
              ))}
            </div>

            <SectionHead index="06" title="ESCÁNDALOS Y VULNERABILIDADES"/>
            <div className="scandal">
              {P.scandals.map((s,i)=>(
                <div key={i} className="scandal__row">
                  <span className="scandal__year mono">{s.year}</span>
                  <span className="scandal__sev mono accent-warm">SEV: {s.severity.toUpperCase()}</span>
                  <span className="scandal__label">{s.label}</span>
                  <span className="scandal__status mono">→ ACTIVO EN OPP. RESEARCH</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- MEDIA MODAL */
function MediaModal({ onClose }) {
  const [tab, setTab] = useStateMD('social');
  return (
    <div className="modal-shroud" onClick={onClose}>
      <div className="mediabig" onClick={e=>e.stopPropagation()}>
        <div className="dm__top">
          <div className="dm__topline mono">
            <span>MEDIA OPERATIONS · WAR ROOM</span>
            <span className="dim">LIVE · MULTI-FUENTE</span>
          </div>
          <button className="iconbtn iconbtn--ghost" onClick={onClose}>✕</button>
        </div>

        <div className="mediabig__tabs">
          {[
            ['social','Social Media'],
            ['tv','TV News'],
            ['press','Prensa Escrita'],
            ['trends','Trending'],
            ['podcasts','Podcasts'],
          ].map(([id,lbl])=>(
            <button key={id} className={`tab ${tab===id?'tab--active':''}`} onClick={()=>setTab(id)}>{lbl}</button>
          ))}
        </div>

        <div className="mediabig__body">
          {tab==='social' && (
            <div className="mediabig__grid">
              <div className="socialcol">
                <div className="socialcol__head mono">FEED · ÚLTIMA HORA</div>
                {D.SOCIAL.map((s,i)=>(
                  <div key={i} className="post">
                    <div className="post__head">
                      <span className="post__handle">{s.handle}</span>
                      <span className="post__meta mono">{s.meta}</span>
                    </div>
                    <div className="post__text">{s.text}</div>
                    <div className="post__foot mono">
                      <span>♥ {s.engagement}</span>
                      <span className="sep">│</span>
                      <span>REPLY</span>
                      <span>BOOST</span>
                      <span className="accent-warm">▸ RESPUESTA SUGERIDA</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="socialcol__head mono">TRENDING · NACIONAL</div>
                {[
                  ['#VasconcelosPresidenta','312k', '+48k', 'pos'],
                  ['#CortelaRuta14',          '187k', '+92k', 'neg'],
                  ['#DebateNacional',         '156k', '+22k', 'neu'],
                  ['#SalinasMiente',          '98k',  '+14k', 'pos'],
                  ['#AguaParaLosLlanos',      '72k',  '+38k', 'neu'],
                  ['#FrenteAntiprogresista',  '54k',  '+12k', 'neg'],
                  ['#MamaniFAS',              '41k',  '+9k',  'neu'],
                  ['#PRD2026',                '37k',  '+5k',  'pos'],
                ].map(([t,vol,delta,tone],i)=>(
                  <div key={i} className={`trendrow tone--${tone==='pos'?'positive':tone==='neg'?'negative':'neutral'}`}>
                    <span className="trendrow__rank mono">{String(i+1).padStart(2,'0')}</span>
                    <span className="trendrow__tag">{t}</span>
                    <span className="trendrow__vol mono">{vol}</span>
                    <span className="trendrow__delta mono accent-pos">{delta}</span>
                  </div>
                ))}

                <div className="socialcol__head mono" style={{marginTop:24}}>SENTIMIENTO · MARCA</div>
                <div className="sentchart">
                  <div className="sent__row"><span className="mono">POSITIVO</span><div className="sent__bar"><div style={{width:'52%',background:'#5E9B7E'}}/></div><span className="mono">52%</span></div>
                  <div className="sent__row"><span className="mono">NEUTRAL</span><div className="sent__bar"><div style={{width:'31%',background:'#C9A961'}}/></div><span className="mono">31%</span></div>
                  <div className="sent__row"><span className="mono">NEGATIVO</span><div className="sent__bar"><div style={{width:'17%',background:'#C24A4A'}}/></div><span className="mono">17%</span></div>
                </div>
              </div>
            </div>
          )}

          {tab==='tv' && (
            <div className="tvgrid">
              {[
                {ch:'CANAL 7',      slot:'PRIMETIME · 21:00', show:'EL INFORME', segment:'ENTREVISTA E. VASCONCELOS · 18 min', tone:'positive'},
                {ch:'TV FEDERAL',   slot:'NOTICIAS · 20:00',  show:'PANORAMA',    segment:'INFORME ESPECIAL: corte ruta 14',     tone:'negative'},
                {ch:'CANAL 5',      slot:'TARDE · 18:30',     show:'PUNTO POL.',  segment:'PANEL · DEBATE NACIONAL CONFIRMADO',  tone:'neutral'},
                {ch:'NORTE TV',     slot:'NOCHE · 22:00',     show:'CONTRACAMP.', segment:'EDITORIAL: "FRENTE ANTIPROGRESISTA"', tone:'negative'},
                {ch:'CABLE 24',     slot:'24h',               show:'MAPA EN VIVO',segment:'ÚLTIMOS NÚMEROS · POLLING NACIONAL',  tone:'neutral'},
                {ch:'TV PÚBLICA',   slot:'PRIMETIME · 22:30', show:'AGENDA',      segment:'INFORME · CRISIS HÍDRICA LLANOS',     tone:'neutral'},
              ].map((tv,i)=>(
                <div key={i} className={`tvcard tone--${tv.tone}`}>
                  <div className="tvcard__top mono">
                    <span className="tvcard__ch">{tv.ch}</span>
                    <span className="tvcard__slot">{tv.slot}</span>
                  </div>
                  <div className="tvcard__show">{tv.show}</div>
                  <div className="tvcard__seg">{tv.segment}</div>
                  <div className="tvcard__placeholder">
                    <svg viewBox="0 0 200 100">
                      <rect width="200" height="100" fill="#0A0D11"/>
                      <pattern id={`tvp-${i}`} width="6" height="6" patternUnits="userSpaceOnUse">
                        <path d="M0,6 L6,0" stroke="#1F2630" strokeWidth="0.8"/>
                      </pattern>
                      <rect width="200" height="100" fill={`url(#tvp-${i})`}/>
                      <text x="100" y="55" textAnchor="middle" fontSize="9" fill="#5A6470" fontFamily="IBM Plex Mono">▶ STREAM EN VIVO</text>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab!=='social' && tab!=='tv' && (
            <div className="placeholder-feed">
              <div className="mono dim">// {tab.toUpperCase()} — FEED CONTENT</div>
              <div className="mono dim">Pestaña adicional · contenido idéntico estructuralmente a Social Media</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.CrisisModal = CrisisModal;
window.CandidateModal = CandidateModal;
window.MediaModal = MediaModal;
