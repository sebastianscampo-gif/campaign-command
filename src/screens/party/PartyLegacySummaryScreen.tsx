/* =============================================================================
   SCREENS — Party Legacy
   Pantalla de cierre del modo partido. Computa y muestra el archetype del
   partido construido a lo largo de los 3 ciclos.
   ============================================================================= */

import { useMemo } from 'react';
import { Panel, SectionHead } from '@/components';
import { computePartyLegacy, usePartyStore } from '@/party';
import { useUiStore } from '@/state/uiStore';

export function PartyLegacySummaryScreen() {
  const state = usePartyStore((s) => s.state);
  const resetParty = usePartyStore((s) => s.resetParty);
  const navigate = useUiStore((s) => s.navigate);

  const summary = useMemo(() => (state ? computePartyLegacy(state) : null), [state]);

  if (!state || !summary) {
    return (
      <div className="pl pl--empty">
        <Panel label="LEGADO PARTIDARIO" caption="sin partida completada">
          <p>No hay partido para evaluar todavía.</p>
          <button type="button" className="pl__cta" onClick={() => navigate('menu')}>
            VOLVER AL MENÚ
          </button>
        </Panel>
      </div>
    );
  }

  const handleNew = () => {
    resetParty();
    navigate('party-setup');
  };

  return (
    <div className="pl">
      <header className="pl__head">
        <div className="pl__eyebrow mono">PARTIDO · LEGADO FINAL</div>
        <div className="pl__brand">
          <span className="pl__bullet" style={{ background: state.profile.color }} />
          <h1 className="pl__title">{state.profile.name}</h1>
          <span className="pl__sigla mono">{state.profile.sigla}</span>
        </div>
        <div className="pl__label">{summary.label}</div>
        <div className="pl__desc">{summary.description}</div>
        <div className="pl__score mono">SCORE DE LEGADO · {summary.score}</div>
      </header>

      <div className="pl__grid">
        <Panel label="01" caption="Highlights" className="span-6">
          <ul className="pl__highlights">
            {summary.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </Panel>

        <Panel label="02" caption="Balance electoral" className="span-6">
          <div className="pl__row mono">
            <span>VICTORIAS</span>
            <span className="pl__pos">{summary.stats.electionsWon}</span>
          </div>
          <div className="pl__row mono">
            <span>RESULTADOS PARCIALES</span>
            <span>{summary.stats.electionsSplit}</span>
          </div>
          <div className="pl__row mono">
            <span>DERROTAS</span>
            <span className="pl__neg">{summary.stats.electionsLost}</span>
          </div>
          <div className="pl__row mono">
            <span>POSICIONES TOTALES</span>
            <span>{summary.stats.totalSeats}</span>
          </div>
          <div className="pl__row mono">
            <span>PROVINCIAS GANADAS (PICO)</span>
            <span>{summary.stats.provincesWonAtPeak}</span>
          </div>
        </Panel>

        <Panel label="03" caption="Salud del partido" className="span-4">
          <div className="pl__row mono">
            <span>FACCIONES PERDIDAS</span>
            <span className={summary.stats.factionsLost > 0 ? 'pl__neg' : ''}>
              {summary.stats.factionsLost}
            </span>
          </div>
          <div className="pl__row mono">
            <span>ESCÁNDALOS SOBREVIVIDOS</span>
            <span>{summary.stats.scandalsLived}</span>
          </div>
          <div className="pl__row mono">
            <span>CAJA FINAL (M)</span>
            <span>{summary.stats.finalMoney.toFixed(1)}</span>
          </div>
        </Panel>

        <Panel label="04" caption="Marca final" className="span-4">
          <div className="pl__row mono">
            <span>FUERZA DE MARCA</span>
            <span>{summary.stats.brandStrength.toFixed(0)} / 100</span>
          </div>
          <div className="pl__row mono">
            <span>CLARIDAD IDEOLÓGICA</span>
            <span>{summary.stats.ideologicalClarity.toFixed(0)}</span>
          </div>
          <div className="pl__row mono">
            <span>CONFIANZA PÚBLICA</span>
            <span>{summary.stats.publicTrust.toFixed(0)}</span>
          </div>
          <div className="pl__row mono">
            <span>POLARIZACIÓN</span>
            <span>{summary.stats.polarization.toFixed(0)}</span>
          </div>
        </Panel>

        <Panel label="05" caption="Identidad construida" className="span-4">
          <div className="pl__row mono">
            <span>FUERZA TERRITORIAL</span>
            <span>{summary.stats.territorialStrength.toFixed(0)}</span>
          </div>
          <div className="pl__row mono">
            <span>MÍSTICA MOVIMIENTO</span>
            <span>{summary.stats.movementMystique.toFixed(0)}</span>
          </div>
          <SectionHead title="Etiquetas activas" />
          <div className="pl__labels">
            {state.labels.length === 0 ? (
              <span className="pl__empty mono">Sin etiquetas asignadas.</span>
            ) : (
              state.labels.map((l) => (
                <span key={l} className="pl__label-chip mono">{l}</span>
              ))
            )}
          </div>
        </Panel>
      </div>

      <footer className="pl__foot">
        <button type="button" className="pl__new" onClick={handleNew}>
          NUEVO PARTIDO →
        </button>
        <button type="button" className="pl__menu" onClick={() => navigate('menu')}>
          VOLVER AL MENÚ
        </button>
      </footer>
    </div>
  );
}
