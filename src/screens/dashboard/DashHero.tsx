/* =============================================================================
   DASHBOARD — DashHero
   Bloque cinematográfico: retrato de la candidata, KPIs gigantes y la alerta
   crítica del día.
   ============================================================================= */

import { NumberTicker } from '@/components';
import { CANDIDATE } from '@/content';
import { useGameStore } from '@/state/gameStore';
import { useUiStore } from '@/state/uiStore';

type KpiTone = 'pos' | 'gold' | 'info';

interface KpiTileProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta: number;
  deltaSuffix: string;
  sub: string;
  tone?: KpiTone;
  leader?: boolean;
}

function KpiTile({
  label,
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  delta,
  deltaSuffix,
  sub,
  tone,
  leader = false,
}: KpiTileProps) {
  return (
    <div className={leader ? 'kpi kpi--leader' : 'kpi'}>
      <div className="kpi__label mono">{label}</div>
      <div className="kpi__value mono" data-tone={tone}>
        <NumberTicker value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
      </div>
      <div
        className="kpi__delta mono"
        data-dir={delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'}
      >
        {delta > 0 ? '▲ +' : delta < 0 ? '▼ ' : '· '}
        {Math.abs(delta)} {deltaSuffix}
      </div>
      <div className="kpi__sub mono">{sub}</div>
      {leader && <div className="kpi__badge mono">● 1°</div>}
    </div>
  );
}

export function DashHero() {
  const candidate = useGameStore((s) => s.candidate);
  const polling = useGameStore((s) => s.polling);
  const activeEvent = useGameStore((s) => s.activeEvent);
  const openModal = useUiStore((s) => s.openModal);

  const latest = polling[polling.length - 1];
  const prev = polling[polling.length - 2];
  const intentDelta = Number((latest.intent.PRD - prev.intent.PRD).toFixed(1));
  const initials = CANDIDATE.name
    .split(' ')
    .map((word) => word[0])
    .join('');

  return (
    <div className="hero">
      <div className="hero__candidate">
        <div className="hero__portrait">
          <svg viewBox="0 0 80 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="hero-port" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1A2230" />
                <stop offset="100%" stopColor="#0A0D11" />
              </linearGradient>
              <pattern id="hero-hatch" width="6" height="6" patternUnits="userSpaceOnUse">
                <path d="M0,6 L6,0" stroke="#2A3340" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="80" height="100" fill="url(#hero-port)" />
            <rect width="80" height="100" fill="url(#hero-hatch)" />
            <circle cx="40" cy="44" r="18" fill="#070A0E" />
            <path d="M 8 100 Q 8 64 40 64 Q 72 64 72 100 Z" fill="#070A0E" />
            <text x="40" y="50" textAnchor="middle" fontSize="14" fill="#C9A961" fontFamily="var(--font-serif)">
              {initials}
            </text>
            <rect x="0" y="92" width="80" height="8" fill="#C9A961" />
            <text
              x="40"
              y="98.5"
              textAnchor="middle"
              fontSize="5"
              fill="#0A0D11"
              fontFamily="var(--font-mono)"
              letterSpacing="0.2em"
            >
              PRD · CANDIDATA
            </text>
            <circle cx="72" cy="8" r="2.5" fill="#C24A4A" className="hero__livedot" />
          </svg>
        </div>
        <div className="hero__id">
          <div className="hero__eyebrow mono">CANDIDATA · DOSSIER ACTIVO</div>
          <h1 className="hero__name">
            Elena<br />
            <span>Vasconcelos</span>
          </h1>
          <div className="hero__role mono">SENADORA NACIONAL · 24 AÑOS EN POLÍTICA</div>
          <div className="hero__traits">
            {CANDIDATE.traits.map((trait) => (
              <span className="hero__trait" key={trait}>
                {trait}
              </span>
            ))}
          </div>
          <button type="button" className="hero__cta mono" onClick={() => openModal('candidate')}>
            <span>DOSSIER COMPLETO</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <div className="hero__kpis">
        <KpiTile
          label="INTENC. VOTO"
          value={latest.intent.PRD}
          suffix="%"
          delta={intentDelta}
          deltaSuffix="pt · 7d"
          sub="POSICIÓN 1°"
          leader
        />
        <KpiTile
          label="APROBACIÓN"
          value={candidate.approval.national}
          suffix="%"
          delta={2}
          deltaSuffix="pt · 7d"
          sub="UMBRAL DE PARIDAD 50%"
        />
        <KpiTile
          label="MOMENTUM"
          value={candidate.momentum}
          prefix="+"
          delta={20}
          deltaSuffix="neto 7d"
          sub="MEDIA · BASE · FUND"
          tone="pos"
        />
        <KpiTile
          label="WAR CHEST"
          value={candidate.warChest}
          prefix="$"
          suffix="M"
          decimals={1}
          delta={2.1}
          deltaSuffix="M · sem"
          sub="BURN $0.8M/d"
          tone="gold"
        />
        <KpiTile
          label="MEDIA SHARE"
          value={Math.round(candidate.mediaShare * 100)}
          suffix="%"
          delta={-4}
          deltaSuffix="pt vs MNP"
          sub="MNP 38% · FAS 14%"
          tone="info"
        />
      </div>

      <div className="hero__alert">
        {activeEvent ? (
          <>
            <div className="hero__alert-head mono">
              <span className="hero__alert-dot" />
              <span>{activeEvent.classification}</span>
              <span className="hero__alert-timer">{activeEvent.timer}</span>
            </div>
            <div className="hero__alert-body">{activeEvent.headline}</div>
            <div className="hero__alert-foot mono">
              <span>
                NACIONAL <span className="dash-neg">{activeEvent.sentiment.national}</span>
              </span>
              <span>
                LOCAL <span className="dash-neg">{activeEvent.sentiment.local}</span>
              </span>
              <span>
                BASE <span className="dash-neg">{activeEvent.sentiment.base}</span>
              </span>
            </div>
            <button type="button" className="hero__alert-cta mono" onClick={() => openModal('crisis')}>
              <span>ABRIR BRIEFING</span>
              <span>↵</span>
            </button>
          </>
        ) : (
          <div className="hero__alert-calm mono">● SIN CRISIS ACTIVA · AGENDA DESPEJADA</div>
        )}
      </div>
    </div>
  );
}
