/* =============================================================================
   MAIN MENU — ModePreview
   Switchboard del panel de preview: cada modo del menú tiene su escena
   cinematográfica y su ficha de datos. Las escenas se animan con CSS.
   ============================================================================= */

import type { ReactNode } from 'react';
import { ProvinceMap } from '@/components';
import { CANDIDATE, PARTIES } from '@/content';
import type { ProvinceId } from '@/content';
import { useGameStore } from '@/state/gameStore';
import type { ScreenId } from '@/state/types';
import type { MenuItem } from './menuItems';
import { SceneFrame } from './SceneFrame';
import {
  ArchiveScene,
  ConventionScene,
  ElectionNightScene,
  HQScene,
  MediaScene,
  RallyScene,
  WarRoomScene,
} from './scenes';

interface ModePreviewProps {
  item: MenuItem;
  onActivate: (screen: ScreenId) => void;
}

export function ModePreview({ item, onActivate }: ModePreviewProps) {
  switch (item.id) {
    case 'continue':
      return <PreviewContinue onActivate={onActivate} />;
    case 'career':
      return <PreviewCareer onActivate={onActivate} />;
    case 'party':
      return <PreviewParty onActivate={onActivate} />;
    case 'new':
      return <PreviewNewCampaign onActivate={onActivate} />;
    case 'scenarios':
      return <PreviewScenarios onActivate={onActivate} />;
    case 'multi':
      return <PreviewMultiplayer onActivate={onActivate} />;
    case 'election':
      return <PreviewElection onActivate={onActivate} />;
    case 'media':
      return <PreviewMedia onActivate={onActivate} />;
    default:
      return <PreviewSimple item={item} />;
  }
}

/* ---- Helpers --------------------------------------------------------------- */

function Row({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="mp__row">
      <span className="mp__row-k mono">{k}</span>
      <span className="mp__row-v">{v}</span>
    </div>
  );
}

function Pillar({ idx, title, sub }: { idx: string; title: string; sub: string }) {
  return (
    <div className="mp__pillar">
      <span className="mp__pillar-idx mono">{idx}</span>
      <span className="mp__pillar-t">{title}</span>
      <span className="mp__pillar-s">{sub}</span>
    </div>
  );
}

function Cta({
  label,
  onClick,
  alert = false,
}: {
  label: string;
  onClick: () => void;
  alert?: boolean;
}) {
  return (
    <button type="button" className={alert ? 'mp__cta mp__cta--alert' : 'mp__cta'} onClick={onClick}>
      <span>{label}</span>
      <span className="mono">↵</span>
    </button>
  );
}

interface PreviewProps {
  onActivate: (screen: ScreenId) => void;
}

/* ---- CONTINUE -------------------------------------------------------------- */

function leanColor(lean: number): string {
  if (lean > 0.2) return PARTIES.MNP.color;
  if (lean < -0.2) return PARTIES.PRD.color;
  return PARTIES.VC.color;
}

function PreviewContinue({ onActivate }: PreviewProps) {
  const day = useGameStore((s) => s.day);
  const totalDays = useGameStore((s) => s.totalDays);
  const provinces = useGameStore((s) => s.provinces);
  const polling = useGameStore((s) => s.polling);
  const candidate = useGameStore((s) => s.candidate);
  const latest = polling[polling.length - 1];

  return (
    <div className="mp">
      <SceneFrame label="ÚLTIMA PARTIDA" caption="14·SEP·2026 · 23:41">
        <RallyScene />
      </SceneFrame>
      <div className="mp__title">CONTINUE CAMPAIGN</div>
      <div className="mp__sub">
        {CANDIDATE.name} · {PARTIES.PRD.name}
      </div>

      <div className="mp__rows">
        <Row k="CANDIDATA" v={`${CANDIDATE.name} · ${CANDIDATE.age}`} />
        <Row k="PARTIDO" v={`${PARTIES.PRD.short} · ${PARTIES.PRD.ideology}`} />
        <Row k="INTENCIÓN VOTO" v={<span className="mp-pos">{latest.intent.PRD}% · líder</span>} />
        <Row k="APROBACIÓN" v={`${candidate.approval.national}%`} />
        <Row k="WAR CHEST" v={`$${candidate.warChest}M`} />
        <Row k="JORNADA" v={`Día ${day} / ${totalDays}`} />
        <Row k="PRÓX. EVENTO" v={<span className="mp-warn">Debate Nacional · 3d</span>} />
      </div>

      <div className="mp__mini">
        <ProvinceMap
          fillOf={(id: ProvinceId) => leanColor(provinces[id].leaning)}
          showLabels={false}
        />
        <div className="mp__mini-legend mono">
          <span>
            <i style={{ background: PARTIES.PRD.color }} />
            PRD
          </span>
          <span>
            <i style={{ background: PARTIES.VC.color }} />
            DISPUTA
          </span>
          <span>
            <i style={{ background: PARTIES.MNP.color }} />
            MNP
          </span>
        </div>
      </div>

      <Cta label="RESUMIR PARTIDA" onClick={() => onActivate('map')} />
    </div>
  );
}

/* ---- CAREER ---------------------------------------------------------------- */

function PreviewCareer({ onActivate }: PreviewProps) {
  const years = [1992, 2000, 2008, 2016, 2024, 2032, 2040];
  return (
    <div className="mp">
      <SceneFrame label="ESCENA · RALLY NACIONAL" caption="ESTADIO · 22:00 · NIEBLA + FLASHES">
        <RallyScene />
      </SceneFrame>
      <div className="mp__title">CAREER MODE</div>
      <div className="mp__sub">
        Una carrera política completa. Desde concejal hasta la presidencia. Multi-ciclo,
        multi-décadas.
      </div>

      <div className="mp__pillars">
        <Pillar idx="01" title="ASCENSO" sub="Concejal → Diputado → Gobernador → Presidente" />
        <Pillar idx="02" title="LEGADO" sub="Cada decisión persiste 30 años en la simulación" />
        <Pillar idx="03" title="RIVALES" sub="IA narrativa genera adversarios y aliados con memoria" />
      </div>

      <div className="mp__timeline">
        <div className="mp__timeline-head mono">
          <span>LÍNEA DE TIEMPO</span>
          <span>1992 — 2046</span>
        </div>
        <svg viewBox="0 0 360 50" className="mp__timeline-svg">
          <line x1="6" y1="38" x2="354" y2="38" stroke="var(--border)" strokeWidth="1" />
          {years.map((y, i) => (
            <g key={y} transform={`translate(${6 + i * 58} 38)`}>
              <line y2="-6" stroke="var(--accent)" strokeWidth="1" />
              <text y="-10" textAnchor="middle" fill="var(--text-dim)" fontSize="8" className="mono">
                {y}
              </text>
            </g>
          ))}
          <circle cx="6" cy="38" r="3" fill="var(--accent)" className="cs-timeline-dot" />
        </svg>
      </div>

      <Cta label="INICIAR CARRERA" onClick={() => onActivate('map')} />
    </div>
  );
}

/* ---- PARTY ----------------------------------------------------------------- */

function PreviewParty({ onActivate }: PreviewProps) {
  const factions = [
    { name: 'RENOVADORES', pct: '38%', color: PARTIES.FAS.color },
    { name: 'VIEJA GUARDIA', pct: '31%', color: PARTIES.VC.color },
    { name: 'TERRITORIALES', pct: '22%', color: PARTIES.PRD.color },
    { name: 'INDEPENDIENTES', pct: '9%', color: PARTIES.MNP.color },
  ];
  return (
    <div className="mp">
      <SceneFrame label="ESCENA · CONVENCIÓN" caption="SALÓN 04 · 412 DELEGADOS">
        <ConventionScene />
      </SceneFrame>
      <div className="mp__title">PARTY MODE</div>
      <div className="mp__sub">
        No diriges un candidato: diriges el partido. Gestionas listas, facciones internas, finanzas
        y maquinaria territorial.
      </div>

      <div className="mp__factions">
        {factions.map((f) => (
          <div className="mp__faction" key={f.name}>
            <span className="mp__faction-dot" style={{ background: f.color }} />
            <span>{f.name}</span>
            <span className="mono">{f.pct}</span>
          </div>
        ))}
      </div>

      <div className="mp__rows">
        <Row k="DELEGADOS" v="412" />
        <Row k="FACCIONES" v="4 · 1 quiebra latente" />
        <Row k="LISTAS" v="12 provinciales · 220 candidatos" />
        <Row k="FINANZAS" v="$3.4M en caja · $1.1M deuda" />
      </div>

      <Cta label="ENTRAR A LA CONVENCIÓN" onClick={() => onActivate('map')} />
    </div>
  );
}

/* ---- NEW CAMPAIGN ---------------------------------------------------------- */

function PreviewNewCampaign({ onActivate }: PreviewProps) {
  const sliders = [
    { label: 'IDEOLOGÍA', left: 'IZQ', right: 'DER', pct: 42, color: 'var(--accent)' },
    { label: 'POPULISMO', left: '—', right: '+', pct: 67, color: 'var(--warn)' },
    { label: 'EXPERIENCIA', left: '—', right: '+', pct: 78, color: 'var(--pos)' },
  ];
  return (
    <div className="mp">
      <SceneFrame label="ESCENA · HEADQUARTERS" caption="OFICINA 12 · WHITEBOARDS">
        <HQScene />
      </SceneFrame>
      <div className="mp__title">NEW CAMPAIGN</div>
      <div className="mp__sub">
        Setup completo: candidato, partido, ideología, plataforma, equipo y presupuesto inicial.
      </div>

      <div className="mp__setup">
        {sliders.map((s) => (
          <div className="mp__setup-row mono" key={s.label}>
            <span>{s.label}</span>
            <div className="mp__slider">
              <span>{s.left}</span>
              <div className="mp__slider-track">
                <div
                  className="mp__slider-fill"
                  style={{ width: `${s.pct}%`, background: s.color }}
                />
              </div>
              <span>{s.right}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mp__rows">
        <Row k="DIFICULTAD" v="ESTÁNDAR" />
        <Row k="MAPA" v="República de San Esteban · 2026" />
        <Row k="DURACIÓN EST." v="6–8h" />
      </div>

      <Cta label="CONFIGURAR CAMPAÑA" onClick={() => onActivate('map')} />
    </div>
  );
}

/* ---- SCENARIOS ------------------------------------------------------------- */

function PreviewScenarios({ onActivate }: PreviewProps) {
  const scenarios = [
    { y: '1953', t: 'EL GOLPE', d: 'Provisional · 14 días para constituyente' },
    { y: '1973', t: 'CRISIS DEL PETRÓLEO', d: 'Inflación 312% · 8 candidatos' },
    { y: '1989', t: 'TRANSICIÓN', d: 'Primer ciclo democrático moderno' },
    { y: '2001', t: 'COLAPSO ECONÓMICO', d: 'Default · 5 presidentes en 11 días' },
    { y: '2015', t: 'CICLO ROSA', d: 'Segunda ola de izquierda regional' },
    { y: '2024', t: 'POLARIZACIÓN', d: 'Segunda vuelta · margen ±0.3%' },
  ];
  return (
    <div className="mp">
      <SceneFrame label="ARCHIVO HISTÓRICO" caption="ROLLO 04 · MICROFILM">
        <ArchiveScene />
      </SceneFrame>
      <div className="mp__title">HISTORICAL SCENARIOS</div>
      <div className="mp__sub">
        18 momentos clave de la historia política. Reescribe el pasado con tus decisiones.
      </div>

      <div className="mp__scenarios">
        {scenarios.map((s) => (
          <div className="mp__scenario" key={s.y}>
            <span className="mp__scenario-y mono">{s.y}</span>
            <div className="mp__scenario-mid">
              <div className="mp__scenario-t">{s.t}</div>
              <div className="mp__scenario-d">{s.d}</div>
            </div>
            <span className="mp__scenario-arrow mono">→</span>
          </div>
        ))}
      </div>

      <Cta label="EXPLORAR ARCHIVO" onClick={() => onActivate('map')} />
    </div>
  );
}

/* ---- MULTIPLAYER ----------------------------------------------------------- */

function PreviewMultiplayer({ onActivate }: PreviewProps) {
  const lobbies = [
    { tag: 'RANKED', tone: 'mp-warn', desc: 'San Esteban · 2028 · 6/8', meta: 'ELO 1840' },
    { tag: 'CASUAL', tone: '', desc: '1989 Transición · 4/6', meta: '—' },
    { tag: 'FRIENDS', tone: 'mp-pos', desc: 'Marcos · invitado', meta: '2/2' },
  ];
  return (
    <div className="mp">
      <SceneFrame label="ESCENA · WAR ROOM DIGITAL" caption="5 SESIONES · LIVE">
        <WarRoomScene />
      </SceneFrame>
      <div className="mp__title">MULTIPLAYER</div>
      <div className="mp__sub">
        Hasta 8 jugadores. Cada uno comanda un partido. Negociación, alianzas, traiciones y debates
        en vivo.
      </div>

      <div className="mp__lobby">
        <div className="mp__lobby-head mono">
          <span>LOBBIES ABIERTOS</span>
          <span>147 EN VIVO</span>
        </div>
        {lobbies.map((l) => (
          <div className="mp__lobby-row" key={l.tag}>
            <span className={`mono ${l.tone}`}>{l.tag}</span>
            <span>{l.desc}</span>
            <span className="mono">{l.meta}</span>
          </div>
        ))}
      </div>

      <div className="mp__rows">
        <Row k="MODO" v="Hot-seat · asíncrono · ranked" />
        <Row k="DURACIÓN" v="45 min – 2h por sesión" />
        <Row k="TU ELO" v="1842 · TOP 7%" />
      </div>

      <Cta label="BUSCAR PARTIDA" onClick={() => onActivate('map')} />
    </div>
  );
}

/* ---- ELECTION -------------------------------------------------------------- */

function PreviewElection({ onActivate }: PreviewProps) {
  const live = [
    { name: 'PRD · Vasconcelos', pct: '29.4%', color: PARTIES.PRD.color, dir: 'up' },
    { name: 'MNP · Orellana', pct: '28.1%', color: PARTIES.MNP.color, dir: 'down' },
    { name: 'FAS · Linares', pct: '21.8%', color: PARTIES.FAS.color, dir: 'flat' },
  ];
  return (
    <div className="mp">
      <SceneFrame
        label="LIVE · NOCHE ELECTORAL"
        caption="14·OCT·2026 · 21:47 · PARCIALES"
        alert
      >
        <ElectionNightScene />
      </SceneFrame>
      <div className="mp__title">ELECTION NIGHT MODE</div>
      <div className="mp__sub">
        La noche más importante del ciclo. Cobertura en vivo, mesas reportando, swings dramáticos y
        breaking news.
      </div>

      <div className="mp__live">
        {live.map((l) => (
          <div className="mp__live-row" key={l.name}>
            <span className="mp__live-dot" style={{ background: l.color }} />
            <span>{l.name}</span>
            <span className="mono mp__live-pct">{l.pct}</span>
            <span className="mono" data-dir={l.dir}>
              {l.dir === 'up' ? '▲' : l.dir === 'down' ? '▼' : '—'}
            </span>
          </div>
        ))}
      </div>

      <Cta label="ENTRAR EN VIVO" onClick={() => onActivate('election')} alert />
    </div>
  );
}

/* ---- MEDIA ----------------------------------------------------------------- */

function PreviewMedia({ onActivate }: PreviewProps) {
  return (
    <div className="mp">
      <SceneFrame label="MEDIA ECOSYSTEM" caption="STREAM · PRENSA · PODCAST">
        <MediaScene />
      </SceneFrame>
      <div className="mp__title">MEDIA ECOSYSTEM</div>
      <div className="mp__sub">
        Tu campaña vive y muere en el ecosistema mediático: posts, trends, ruedas de prensa,
        comentaristas y livestreams.
      </div>

      <div className="mp__rows">
        <Row k="STREAM (PULSE)" v="412k followers · +1.8k/d" />
        <Row k="PRENSA TV" v="3 ruedas activas · 12 menciones/h" />
        <Row k="PODCASTS" v="8 comentaristas · 2 hostiles" />
        <Row k="TENDENCIAS" v="#Vasconcelos2026 · #1" />
      </div>

      <Cta label="ABRIR ECOSYSTEM" onClick={() => onActivate('media')} />
    </div>
  );
}

/* ---- SIMPLE (mods, settings) ---------------------------------------------- */

function PreviewSimple({ item }: { item: MenuItem }) {
  return (
    <div className="mp mp--simple">
      <div className="mp__title">{item.label}</div>
      <div className="mp__sub">{item.sub}</div>
      <div className="mp__simple-art mono">
        ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▯ ▯ ▯ ▯ ▯ ▯ ▯ ▯
        <br />— MÓDULO EXTERNO —
      </div>
    </div>
  );
}
