/* =========================================================================
   CAMPAIGN COMMAND — App Shell
   ========================================================================= */
const { useState: useStateApp, useEffect: useEffectApp, useRef: useRefApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "warroom",
  "fontPair": "institutional",
  "density": 9,
  "showGrid": true,
  "showTicker": true,
  "breathe": true,
  "accent": "#C9A961",
  "cinematicCuts": true
}/*EDITMODE-END*/;

const PALETTES = {
  warroom: {
    name:'WAR ROOM',
    bg:'#0A0D11', bgPanel:'#11161C', bgElev:'#161D26',
    border:'#232A33', text:'#E8E6E1', textDim:'#8C95A0', textMuted:'#5A6470',
    accent:'#C9A961', pos:'#5E9B7E', neg:'#C24A4A', warn:'#E6B948', info:'#5B8FB9',
  },
  cinematic: {
    name:'GEOPOLITICAL',
    bg:'#0E1A1F', bgPanel:'#132028', bgElev:'#192932',
    border:'#1F2F39', text:'#E6D9B8', textDim:'#8FA7B0', textMuted:'#5C7480',
    accent:'#E8B86D', pos:'#3EA17A', neg:'#D14B4B', warn:'#E8B86D', info:'#6FB4D9',
  },
  brutalist: {
    name:'BRUTALIST PAPER',
    bg:'#F0EBDF', bgPanel:'#E8E1D0', bgElev:'#DDD3BC',
    border:'#1A1A1A', text:'#1A1A1A', textDim:'#5A5040', textMuted:'#8A7E68',
    accent:'#A8321F', pos:'#2F6B4A', neg:'#A8321F', warn:'#C28A1A', info:'#26467A',
  },
  ember: {
    name:'EMBER',
    bg:'#13131A', bgPanel:'#1A1A24', bgElev:'#22222F',
    border:'#2A2A3A', text:'#EDE4D3', textDim:'#9590A4', textMuted:'#65627A',
    accent:'#D97757', pos:'#7AB67E', neg:'#C24A4A', warn:'#E8C547', info:'#9CB4CC',
  },
};

const FONT_PAIRS = {
  institutional: {
    name:'INSTITUTIONAL',
    serif:'"Source Serif 4", "Source Serif Pro", Georgia, serif',
    sans:'"IBM Plex Sans", system-ui, sans-serif',
    mono:'"IBM Plex Mono", "JetBrains Mono", monospace',
  },
  editorial: {
    name:'EDITORIAL CONDENSED',
    serif:'"Bodoni Moda", "Playfair Display", Georgia, serif',
    sans:'"Archivo", "IBM Plex Sans", sans-serif',
    mono:'"JetBrains Mono", "IBM Plex Mono", monospace',
  },
  brutalmono: {
    name:'BRUTALIST MONO',
    serif:'"DM Serif Display", "Source Serif 4", Georgia, serif',
    sans:'"JetBrains Mono", "IBM Plex Mono", monospace',
    mono:'"JetBrains Mono", "IBM Plex Mono", monospace',
  },
};

function applyTokens(palette, fonts, density, accent) {
  const r = document.documentElement;
  const P = PALETTES[palette] || PALETTES.warroom;
  const F = FONT_PAIRS[fonts] || FONT_PAIRS.institutional;
  r.style.setProperty('--bg', P.bg);
  r.style.setProperty('--bg-panel', P.bgPanel);
  r.style.setProperty('--bg-elev', P.bgElev);
  r.style.setProperty('--border', P.border);
  r.style.setProperty('--text', P.text);
  r.style.setProperty('--text-dim', P.textDim);
  r.style.setProperty('--text-muted', P.textMuted);
  r.style.setProperty('--accent', accent || P.accent);
  r.style.setProperty('--pos', P.pos);
  r.style.setProperty('--neg', P.neg);
  r.style.setProperty('--warn', P.warn);
  r.style.setProperty('--info', P.info);
  r.style.setProperty('--font-serif', F.serif);
  r.style.setProperty('--font-sans',  F.sans);
  r.style.setProperty('--font-mono',  F.mono);
  const dens = density;
  r.style.setProperty('--pad-panel', `${Math.max(8, 18 - dens)}px`);
  r.style.setProperty('--gap-grid',  `${Math.max(6, 16 - dens)}px`);
  r.style.setProperty('--font-base', `${Math.max(11, 15 - Math.floor(dens/3))}px`);
  r.style.setProperty('--row-h',     `${Math.max(22, 32 - dens)}px`);
}

/* ====================================================== CinematicCut === */
const SCREEN_LABELS = {
  menu:      'MAIN · MENU',
  map:       'MAP · STRATEGIC OPERATIONS',
  dashboard: 'CAMPAIGN · DASHBOARD',
  election:  'ELECTION NIGHT · LIVE',
  media:     'MEDIA · ECOSYSTEM',
  gov:       'GOVERNANCE · MODE',
  party:     'PARTY · MODE',
  profile:   'CANDIDATE · DOSSIER',
};

function CinematicCut({ label, onDone }) {
  useEffectApp(() => {
    const t = setTimeout(onDone, 540);
    return () => clearTimeout(t);
  }, [label, onDone]);
  return <div className="cinema-cut" data-label={label} key={label}/>;
}

/* ====================================================== App ============ */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [screen, setScreen]   = useStateApp('menu');
  const [selected, setSelected] = useStateApp(null);
  const [modal, setModal]     = useStateApp(null);
  const [cutLabel, setCutLabel] = useStateApp(null);

  useEffectApp(()=>{
    applyTokens(t.palette, t.fontPair, t.density, t.accent);
  }, [t.palette, t.fontPair, t.density, t.accent]);

  useEffectApp(()=>{
    const h = (e) => { if (e.key === 'Escape') setModal(null); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const navigate = (next) => {
    if (next === screen) return;
    if (t.cinematicCuts) {
      const label = SCREEN_LABELS[next] || next.toUpperCase();
      setCutLabel(label);
      setTimeout(() => setScreen(next), 270);
    } else {
      setScreen(next);
    }
  };

  const openCrisis    = () => setModal('crisis');
  const openCandidate = () => setModal('candidate');
  const openMedia     = () => setModal('media');

  const isFull = screen === 'menu' || screen === 'election' || screen === 'media';

  return (
    <div className="app" data-screen={screen}>
      {!isFull && (
        <TopBar screen={screen} onNavigate={navigate} onOpenEvent={openCrisis}/>
      )}

      {screen === 'menu' && (
        <MainMenu onStart={(next)=>navigate(next||'map')}/>
      )}

      {screen === 'map' && (
        <MapView selected={selected} setSelected={setSelected} onOpenEvent={openCrisis}/>
      )}

      {screen === 'dashboard' && (
        <Dashboard
          onOpenEvent={openCrisis}
          onOpenCandidate={openCandidate}
          onOpenMedia={openMedia}/>
      )}

      {screen === 'profile' && (
        <ProfileScreen onClose={()=>navigate('dashboard')}/>
      )}

      {screen === 'media' && (
        <MediaEcosystem onClose={()=>navigate('menu')}/>
      )}

      {screen === 'election' && (
        <ElectionNight onClose={()=>navigate('menu')}/>
      )}

      {(screen === 'gov' || screen === 'party') && (
        <PlaceholderScreen
          title={screen==='gov' ? 'GOVERNANCE · MODE NO ACTIVO' : 'PARTY · MODO PARTIDO'}
          sub={screen==='gov'
            ? 'Disponible tras ganar la elección · 28 días para activar'
            : 'Hub de partido · candidatos provinciales · listas legislativas · finanzas'}/>
      )}

      {!isFull && t.showTicker && <NewsTicker/>}

      {modal === 'crisis'    && <CrisisModal    onClose={()=>setModal(null)}/>}
      {modal === 'candidate' && <CandidateModal onClose={()=>setModal(null)}/>}
      {modal === 'media'     && <MediaModal     onClose={()=>setModal(null)}/>}

      {/* Cinematic screen transition overlay */}
      {cutLabel && <CinematicCut label={cutLabel} onDone={()=>setCutLabel(null)}/>}

      {/* TWEAKS PANEL */}
      <TweaksPanel title="Tweaks · Campaign Command">
        <TweakSection label="Paleta"/>
        <TweakRadio label="Tema" value={t.palette}
          options={[
            {value:'warroom',    label:'War Room'},
            {value:'cinematic',  label:'Geopolitical'},
            {value:'brutalist',  label:'Brutalist Paper'},
            {value:'ember',      label:'Ember'},
          ]}
          onChange={(v)=>setTweak('palette', v)}/>
        <TweakColor label="Acento" value={t.accent}
          options={['#C9A961','#E8B86D','#D97757','#5B8FB9','#5E9B7E','#A8321F','#E6B948']}
          onChange={(v)=>setTweak('accent', v)}/>

        <TweakSection label="Tipografía"/>
        <TweakRadio label="Sistema" value={t.fontPair}
          options={[
            {value:'institutional', label:'Institutional'},
            {value:'editorial',     label:'Editorial'},
            {value:'brutalmono',    label:'Brutalist Mono'},
          ]}
          onChange={(v)=>setTweak('fontPair', v)}/>

        <TweakSection label="Densidad de información"/>
        <TweakSlider label="Density" value={t.density} min={4} max={10} step={1}
          onChange={(v)=>setTweak('density', v)}/>

        <TweakSection label="HUD"/>
        <TweakToggle label="News ticker" value={t.showTicker}
          onChange={(v)=>setTweak('showTicker', v)}/>
        <TweakToggle label="Grilla del mapa" value={t.showGrid}
          onChange={(v)=>setTweak('showGrid', v)}/>
        <TweakToggle label="Map breathe" value={t.breathe}
          onChange={(v)=>setTweak('breathe', v)}/>
        <TweakToggle label="Cinematic cuts" value={t.cinematicCuts}
          onChange={(v)=>setTweak('cinematicCuts', v)}/>

        <TweakSection label="Navegación rápida"/>
        <TweakButton label="↺ Main Menu"            onClick={()=>navigate('menu')}/>
        <TweakButton label="🗺  Mapa principal"      onClick={()=>navigate('map')}/>
        <TweakButton label="◧  Campaign Dashboard"  onClick={()=>navigate('dashboard')}/>
        <TweakButton label="★ Election Night Mode"  onClick={()=>navigate('election')}/>
        <TweakButton label="◐ Media Ecosystem"      onClick={()=>navigate('media')}/>
        <TweakButton label="⚠  Crisis modal"         onClick={openCrisis}/>
        <TweakButton label="◉  Dossier candidata"    onClick={openCandidate}/>
        <TweakButton label="◐  Media war room"       onClick={openMedia}/>
      </TweaksPanel>
    </div>
  );
}

/* ----------------------------------------------------------- placeholder scr */
function PlaceholderScreen({ title, sub }) {
  return (
    <div className="placeholder">
      <div className="placeholder__inner">
        <div className="mono placeholder__id">MÓDULO · ROADMAP</div>
        <h2 className="placeholder__title">{title}</h2>
        <div className="placeholder__sub">{sub}</div>
        <div className="placeholder__strip mono">
          ▮ ▮ ▮ ▯ ▯ ▯ ▯ ▯ ▯ ▯ ▯ ▯ ▯ ▯ ▯ ▯
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ onClose }) {
  return (
    <div className="fullscreen">
      <CandidateModal onClose={onClose}/>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
