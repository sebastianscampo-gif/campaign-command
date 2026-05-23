/* =============================================================================
   SCREENS — Legacy Summary
   Pantalla de cierre del modo carrera. Calcula y muestra el legado del
   político. Permite empezar una carrera nueva.
   ============================================================================= */

import { useMemo } from 'react';
import { Panel, SectionHead } from '@/components';
import { OFFICES, computeLegacy, useCareerStore } from '@/career';
import type { OfficeId } from '@/career';
import { useUiStore } from '@/state/uiStore';

export function LegacySummaryScreen() {
  const state = useCareerStore((s) => s.state);
  const resetCareer = useCareerStore((s) => s.resetCareer);
  const navigate = useUiStore((s) => s.navigate);

  const summary = useMemo(() => (state ? computeLegacy(state) : null), [state]);

  if (!state || !summary) {
    return (
      <div className="lg lg--empty">
        <Panel label="LEGADO" caption="sin carrera completada">
          <p>No hay una carrera para evaluar todavía.</p>
          <button type="button" className="lg__cta" onClick={() => navigate('menu')}>
            VOLVER AL MENÚ
          </button>
        </Panel>
      </div>
    );
  }

  const handleNewCareer = () => {
    resetCareer();
    navigate('career-setup');
  };

  return (
    <div className="lg">
      <header className="lg__head">
        <div className="lg__eyebrow mono">CARRERA COMPLETADA</div>
        <h1 className="lg__title">{state.player.name}</h1>
        <div className="lg__label">{summary.label}</div>
        <div className="lg__score mono">SCORE DE LEGADO · {summary.score}</div>
      </header>

      <div className="lg__grid">
        <Panel label="01" caption="Highlights" className="span-6">
          <ul className="lg__highlights">
            {summary.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </Panel>

        <Panel label="02" caption="Cargos sostenidos" className="span-6">
          {summary.stats.officesHeld.length === 0 ? (
            <p className="lg__empty">No ocupaste ningún cargo electo.</p>
          ) : (
            <ul className="lg__offices">
              {summary.stats.officesHeld.map((id: OfficeId) => (
                <li key={id}>{OFFICES[id].label}</li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel label="03" caption="Balance electoral" className="span-4">
          <div className="lg__row mono">
            <span>ELECCIONES GANADAS</span>
            <span className="lg__pos">{summary.stats.electionsWon}</span>
          </div>
          <div className="lg__row mono">
            <span>ELECCIONES PERDIDAS</span>
            <span className="lg__neg">{summary.stats.electionsLost}</span>
          </div>
        </Panel>

        <Panel label="04" caption="Promesas" className="span-4">
          <div className="lg__row mono">
            <span>CUMPLIDAS</span>
            <span className="lg__pos">{summary.stats.promisesKept}</span>
          </div>
          <div className="lg__row mono">
            <span>ROTAS</span>
            <span className="lg__neg">{summary.stats.promisesBroken}</span>
          </div>
        </Panel>

        <Panel label="05" caption="Relaciones" className="span-4">
          <div className="lg__row mono">
            <span>ALIADOS CONSERVADOS</span>
            <span className="lg__pos">{summary.stats.alliesPreserved}</span>
          </div>
          <div className="lg__row mono">
            <span>RIVALES CREADOS</span>
            <span className="lg__neg">{summary.stats.enemiesCreated}</span>
          </div>
          <div className="lg__row mono">
            <span>REGIONES QUE TE APOYAN</span>
            <span>{summary.stats.regionsSupporting}</span>
          </div>
        </Panel>

        <Panel label="06" caption="Reputación final" className="span-12">
          <SectionHead title="Etiquetas" />
          <div className="lg__labels">
            {state.reputation.labels.length === 0 ? (
              <span className="mono lg__empty">Sin etiquetas asignadas.</span>
            ) : (
              state.reputation.labels.map((l) => (
                <span key={l} className="lg__label-chip mono">
                  {l}
                </span>
              ))
            )}
          </div>
          <SectionHead title="Polarización" sub={`${summary.stats.polarization.toFixed(0)} / 100`} />
        </Panel>
      </div>

      <footer className="lg__foot">
        <button type="button" className="lg__new" onClick={handleNewCareer}>
          NUEVA CARRERA →
        </button>
        <button type="button" className="lg__menu" onClick={() => navigate('menu')}>
          VOLVER AL MENÚ
        </button>
      </footer>
    </div>
  );
}
