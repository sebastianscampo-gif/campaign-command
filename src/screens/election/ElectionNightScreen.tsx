/* =============================================================================
   SCREENS — Election Night
   Cobertura cinematográfica de la noche electoral. Pantalla inmersiva: posee
   su propia barra de transmisión. Toda la animación (ticker, confeti, pulsos)
   es CSS.
   ============================================================================= */

import type { ReactNode } from 'react';
import { Sparkline } from '@/components';
import {
  ANCHORS,
  BREAKING_HEADLINES,
  ELECTION_RESULTS,
  ELECTION_LOWER_STATS,
  PARTIES,
  PROVINCES,
  REPORTING_PCT,
  SWING_CURVE,
  SHOW_TIME,
  TURNOUT_REPORT,
  reportedPercent,
} from '@/content';
import { assertDefined } from '@/lib/invariant';
import { useGameStore } from '@/state/gameStore';
import { useUiStore } from '@/state/uiStore';
import { BigElectionMap } from './BigElectionMap';

const CONFETTI = Array.from({ length: 44 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  delay: (i % 11) * 0.7,
  duration: 6 + (i % 6),
  color: ['#C9A961', '#5B8FB9', '#C24A4A', '#5E9B7E', '#F4E9C8'][i % 5],
}));

function EPanel({
  title,
  meta,
  children,
  flush = false,
}: {
  title: string;
  meta: string;
  children: ReactNode;
  flush?: boolean;
}) {
  return (
    <div className="epanel">
      <div className="epanel__head mono">
        <span>{title}</span>
        <span>{meta}</span>
      </div>
      <div className={flush ? 'epanel__body epanel__body--flush' : 'epanel__body'}>
        {children}
      </div>
    </div>
  );
}

export function ElectionNightScreen() {
  const provinces = useGameStore((s) => s.provinces);
  const navigate = useUiStore((s) => s.navigate);

  const leader = assertDefined(ELECTION_RESULTS[0], 'ELECTION_RESULTS sembrada con 5 entradas');
  const runnerUp = assertDefined(ELECTION_RESULTS[1], 'ELECTION_RESULTS sembrada con 5 entradas');
  const margin = leader.pct - runnerUp.pct;
  const swingStates = PROVINCES.filter((p) => Math.abs(provinces[p.id].leaning) < 0.2).slice(0, 4);

  return (
    <div className="enight">
      <header className="enight__top">
        <div className="enight__brand">
          <div className="enight__brand-mark">★</div>
          <div>
            <div className="enight__brand-name">Aurora Network · Especial Electoral</div>
            <div className="enight__brand-sub mono">CHANNEL 04 · COBERTURA EN VIVO</div>
          </div>
        </div>
        <div className="enight__top-center mono">
          <span className="enight__pulse" />
          <span>NOCHE ELECTORAL · 14·OCT·2026</span>
        </div>
        <div className="enight__top-right mono">
          <span>HORA · {SHOW_TIME}</span>
          <span>MESAS · {REPORTING_PCT}% ESCRUTADAS</span>
          <button type="button" className="enight__exit" onClick={() => navigate('menu')}>
            ← MENU
          </button>
        </div>
      </header>

      <aside className="enight__left">
        <div className="enight__breaking">
          <div className="enight__breaking-tag mono">▶ BREAKING · AHORA</div>
          <div className="enight__breaking-text">
            La Junta proyecta a {leader.candidate} al frente con un margen de{' '}
            <strong>+{margin.toFixed(2)} pts</strong> sobre {runnerUp.candidate}. Costa Atlántica
            reporta al 71%.
          </div>
        </div>

        {ANCHORS.map((anchor) => (
          <div className="enight__anchor" key={anchor.cam}>
            <div className="enight__anchor-thumb mono">{anchor.cam}</div>
            <div>
              <div className="enight__anchor-name">{anchor.name}</div>
              <div className="enight__anchor-role mono">{anchor.role}</div>
              <div className="enight__anchor-quote">“{anchor.quote}”</div>
            </div>
          </div>
        ))}

        <EPanel title="SWING PRD–MNP" meta="14 ACTUALIZACIONES">
          <Sparkline data={SWING_CURVE} color={PARTIES.PRD.color} width={300} height={70} fill dots />
        </EPanel>

        <EPanel title="SWING STATES" meta={String(swingStates.length).padStart(2, '0')} flush>
          {swingStates.map((geo) => (
            <div className="enight__prow" key={geo.id}>
              <span className="enight__prow-id mono">{geo.id}</span>
              <span className="enight__prow-name">{geo.name}</span>
              <span className="enight__prow-status" data-status="toss">
                TOSS-UP
              </span>
            </div>
          ))}
        </EPanel>
      </aside>

      <main className="enight__center">
        <div className="enight__bigmap">
          <BigElectionMap />
          <div className="enight__bigmap-tag mono">MAPA NACIONAL · ESCRUTINIO {REPORTING_PCT}%</div>
          <div className="enight__bigmap-legend mono">
            <span>
              <i style={{ background: PARTIES.PRD.color }} />
              PRD
            </span>
            <span>
              <i style={{ background: PARTIES.MNP.color }} />
              MNP
            </span>
            <span>
              <i style={{ background: PARTIES.FAS.color }} />
              FAS
            </span>
            <span>
              <i style={{ background: '#1F2731' }} />
              SIN DATOS
            </span>
          </div>
        </div>
      </main>

      <aside className="enight__right">
        <EPanel title="PROYECCIÓN · NACIONAL" meta={`${REPORTING_PCT}%`} flush>
          {ELECTION_RESULTS.map((result, i) => (
            <div className="enight__result" key={result.party}>
              <div className="enight__result-row">
                <span
                  className="enight__result-dot"
                  style={{ background: PARTIES[result.party].color }}
                />
                <div>
                  <div className="enight__result-name" data-leader={i === 0}>
                    {result.candidate}
                  </div>
                  <div className="enight__result-sub mono">{result.party} · candidato</div>
                </div>
                <span className="enight__result-pct" data-leader={i === 0}>
                  {result.pct.toFixed(1)}%
                </span>
              </div>
              <div className="enight__result-track">
                <div
                  className="enight__result-fill"
                  style={{
                    width: `${result.pct * 2.4}%`,
                    background: PARTIES[result.party].color,
                  }}
                />
              </div>
            </div>
          ))}
        </EPanel>

        <EPanel title="PROVINCIAS · ESTADO" meta="12" flush>
          <div className="enight__plist">
            {PROVINCES.map((geo) => {
              const reported = reportedPercent(geo.id);
              const status = reported >= 92 ? 'called' : reported >= 50 ? 'toss' : 'pending';
              const lean = provinces[geo.id].leaning;
              const label =
                status === 'called'
                  ? lean > 0.2
                    ? 'MNP'
                    : lean < -0.2
                      ? 'PRD'
                      : 'FAS'
                  : status === 'toss'
                    ? 'TOSS'
                    : '···';
              return (
                <div className="enight__prow" key={geo.id}>
                  <span className="enight__prow-id mono">{geo.id}</span>
                  <span className="enight__prow-name">{geo.name}</span>
                  <span className="enight__prow-pct mono">{reported}%</span>
                  <span className="enight__prow-status" data-status={status}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </EPanel>

        <EPanel title="TURNOUT EST." meta={`${TURNOUT_REPORT.current}%`}>
          <div className="enight__turnout-head mono">
            <span>2022 · 64.1%</span>
            <span>HOY · {TURNOUT_REPORT.current}%</span>
          </div>
          <div className="enight__turnout-track">
            <div className="enight__turnout-fill" style={{ width: `${TURNOUT_REPORT.current}%` }} />
            <span className="enight__turnout-mark" style={{ left: '64.1%' }} />
          </div>
          <div className="enight__turnout-rows mono">
            {TURNOUT_REPORT.segments.map((seg) => (
              <div key={seg.label}>
                <span>{seg.label}</span>
                <span className={seg.tone === 'pos' ? 'enight-pos' : 'enight-neg'}>{seg.delta}</span>
              </div>
            ))}
          </div>
        </EPanel>
      </aside>

      <div className="enight__lower">
        <div className="enight__lower-col">
          <div className="enight__lower-label mono">{ELECTION_LOWER_STATS.margin.label}</div>
          <div className="enight__lower-val enight__lower-val--gold">+{margin.toFixed(2)}</div>
          <div className="enight__lower-sub mono">
            {ELECTION_LOWER_STATS.margin.sub} · {REPORTING_PCT}% mesas
          </div>
        </div>
        <div className="enight__lower-col">
          <div className="enight__lower-label mono">{ELECTION_LOWER_STATS.turnout.label}</div>
          <div className="enight__lower-val">{ELECTION_LOWER_STATS.turnout.value}</div>
          <div className="enight__lower-sub mono">{ELECTION_LOWER_STATS.turnout.sub}</div>
        </div>
        <div className="enight__lower-col">
          <div className="enight__lower-label mono">{ELECTION_LOWER_STATS.confidence.label}</div>
          <div className="enight__lower-val enight__lower-val--pos">{ELECTION_LOWER_STATS.confidence.value}</div>
          <div className="enight__lower-sub mono">{ELECTION_LOWER_STATS.confidence.sub}</div>
        </div>
      </div>

      <div className="enight__ticker">
        <div className="enight__ticker-label mono">● BREAKING</div>
        <div className="enight__ticker-track">
          <div className="enight__ticker-inner mono">
            {[...BREAKING_HEADLINES, ...BREAKING_HEADLINES].map((line, i) => (
              <span className="enight__ticker-item" key={i}>
                ◆ {line}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="confetti" aria-hidden="true">
        {CONFETTI.map((piece, i) => (
          <i
            key={i}
            style={{
              left: `${piece.x}%`,
              background: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
