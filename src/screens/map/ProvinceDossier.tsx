/* =============================================================================
   MAP — ProvinceDossier
   Panel derecho cuando hay una provincia seleccionada.
   ============================================================================= */

import { Panel, SectionHead, StatTile } from '@/components';
import type { PartyId, ProvinceGeo } from '@/content';
import { useGameStore } from '@/state/gameStore';
import { VoteBar } from './VoteBar';

interface ProvinceDossierProps {
  geo: ProvinceGeo;
  onClose: () => void;
}

export function ProvinceDossier({ geo, onClose }: ProvinceDossierProps) {
  const state = useGameStore((s) => s.provinces[geo.id]);
  const sorted = (Object.entries(state.intent) as [PartyId, number][]).sort(
    (a, b) => b[1] - a[1],
  );

  const closeButton = (
    <button type="button" className="iconbtn" onClick={onClose} aria-label="Cerrar dossier">
      ✕
    </button>
  );

  return (
    <Panel label={`PROV · ${geo.id}`} caption={geo.name} right={closeButton}>
      <div className="dossier">
        <div className="dossier__top">
          <div>
            <div className="dossier__capital mono">CAPITAL · {geo.capital}</div>
            <p className="dossier__blurb">{geo.blurb}</p>
          </div>
          <div className="dossier__stamp mono">
            <div>POB</div>
            <div className="dossier__stamp-val">
              {geo.population}
              <small>M</small>
            </div>
          </div>
        </div>

        <div className="dossier__grid">
          <StatTile label="TURNOUT EST." value={`${state.turnout}%`} />
          <StatTile label="APROBACIÓN" value={`${state.approval}%`} />
          <StatTile
            label="NIVEL CRISIS"
            value={`${state.crisis}/10`}
            tone={state.crisis >= 5 ? 'neg' : undefined}
          />
          <StatTile label="GDP REGIONAL" value={state.gdp} sub="bn PSE" />
        </div>

        <SectionHead index="01" title="Intención de voto" sub="proyección 72h" />
        <div className="dossier__bars">
          {sorted.map(([party, pct]) => (
            <VoteBar key={party} party={party} pct={pct} />
          ))}
        </div>

        <SectionHead index="02" title="Issue dominante" />
        <div className="dossier__issue">
          <span className="dossier__issue-tag mono">PRIORIDAD</span>
          <span className="dossier__issue-name">{state.dominantIssue}</span>
        </div>

        <SectionHead index="03" title="Acciones sugeridas" />
        <div className="dossier__suggest">
          <button type="button" className="suggest">
            RALLY EN {geo.capital.toUpperCase()}
            <span className="mono">+3.2 pts</span>
          </button>
          <button type="button" className="suggest">
            PAUTA TV REGIONAL<span className="mono">+1.8 pts</span>
          </button>
          <button type="button" className="suggest">
            VISITA TERRITORIAL<span className="mono">+2.4 pts</span>
          </button>
        </div>
      </div>
    </Panel>
  );
}
