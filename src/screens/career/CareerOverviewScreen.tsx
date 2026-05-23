/* =============================================================================
   SCREENS — Career Overview
   Hub principal del modo carrera. Muestra: identidad y cargo, ciclo actual,
   reputación, partido, NPCs, memoria, promesas, escándalos, objetivos.
   Permite gastar acciones de carrera, disparar eventos pendientes y avanzar
   a la elección del ciclo.
   ============================================================================= */

import { useEffect, useState } from 'react';
import { Panel, StatTile } from '@/components';
import { PROVINCES, PARTIES } from '@/content';
import type { ProvinceId } from '@/content';
import {
  CAREER_ACTIONS,
  CAREER_ACTION_DECK,
  OFFICES,
  currentElectionScenario,
  currentOfficeDef,
  totalCycles,
  useCareerStore,
} from '@/career';
import type { CareerActionKind, NpcCharacter } from '@/career';
import { useUiStore } from '@/state/uiStore';

const RELATION_LABEL: Record<NpcCharacter['currentRelation'], string> = {
  allied: 'ALIADO',
  neutral: 'NEUTRAL',
  tense: 'TENSO',
  hostile: 'HOSTIL',
};

export function CareerOverviewScreen() {
  const state = useCareerStore((s) => s.state);
  const triggerNextEvent = useCareerStore((s) => s.triggerNextEvent);
  const proceedToElection = useCareerStore((s) => s.proceedToElection);
  const proceedToNextCycle = useCareerStore((s) => s.proceedToNextCycle);
  const resetCareer = useCareerStore((s) => s.resetCareer);
  const spendActionPoint = useCareerStore((s) => s.spendActionPoint);
  const openModal = useUiStore((s) => s.openModal);
  const navigate = useUiStore((s) => s.navigate);

  const [selectedAction, setSelectedAction] = useState<CareerActionKind>('prepare_candidacy');
  const [targetRegion, setTargetRegion] = useState<ProvinceId>('CA');
  const [targetNpc, setTargetNpc] = useState<string>('mentor_ortuzar');

  // Hooks de side effect — antes del early return para no romper el orden.
  const activeEventId = state?.activeCareerEvent?.id ?? null;
  const careerStatus = state?.status ?? null;

  useEffect(() => {
    if (activeEventId) openModal('career-event');
  }, [activeEventId, openModal]);

  useEffect(() => {
    if (careerStatus === 'legacy') navigate('career-legacy');
  }, [careerStatus, navigate]);

  if (!state) {
    return (
      <div className="co co--empty">
        <Panel label="MODO CARRERA" caption="sin partida activa">
          <p className="co__empty">
            Todavía no creaste un político. Volvé al menú principal y entrá a "Modo Carrera".
          </p>
          <button type="button" className="co__cta" onClick={() => navigate('menu')}>
            VOLVER AL MENÚ
          </button>
        </Panel>
      </div>
    );
  }

  const office = currentOfficeDef(state);
  const scenario = currentElectionScenario(state);
  const totalC = totalCycles();
  const cycle = state.cycles[state.currentCycleIndex];

  const npcs = Object.values(state.npcs);
  const allies = npcs.filter((n) => n.currentRelation === 'allied');
  const rivals = npcs.filter((n) => n.currentRelation === 'hostile');

  const actionDef = CAREER_ACTIONS[selectedAction];

  const handleSpendAction = () => {
    const result = spendActionPoint(selectedAction, {
      region: actionDef.requiresRegion ? targetRegion : undefined,
      npcId: actionDef.requiresNpc ? targetNpc : undefined,
    });
    if (!result) {
      // Acción no aplicada — silencioso por ahora.
    }
  };

  const isAftermath = state.status === 'aftermath';
  const isPrecampaign = state.status === 'precampaign';

  return (
    <div className="co">
      <header className="co__head">
        <div className="co__identity">
          <div className="co__eyebrow mono">MODO CARRERA</div>
          <h1 className="co__name">{state.player.name}</h1>
          <div className="co__role mono">
            {office.label} · {state.party.partyName}
          </div>
        </div>
        <div className="co__cycle">
          <div className="co__cycle-label mono">CICLO</div>
          <div className="co__cycle-num">{state.currentCycleIndex + 1} / {totalC}</div>
          <div className="co__cycle-stage mono">{cycle?.stage.toUpperCase()}</div>
        </div>
        <button type="button" className="co__back" onClick={() => navigate('menu')}>
          ← MENÚ
        </button>
      </header>

      <div className="co__grid">
        <Panel label="01" caption="Reputación" className="span-4">
          <div className="co__rep-grid">
            <StatTile label="CONFIANZA PÚBLICA" value={Math.round(state.reputation.publicTrust)} />
            <StatTile label="POPULARIDAD" value={Math.round(state.reputation.popularity)} />
            <StatTile label="HONESTIDAD" value={Math.round(state.reputation.honesty)} />
            <StatTile label="AUTORIDAD" value={Math.round(state.reputation.authority)} />
            <StatTile label="FAMA NACIONAL" value={Math.round(state.reputation.nationalFame)} />
            <StatTile
              label="POLARIZACIÓN"
              value={Math.round(state.reputation.polarization)}
              tone={state.reputation.polarization > 60 ? 'warn' : undefined}
            />
          </div>
          {state.reputation.labels.length > 0 && (
            <div className="co__labels mono">
              {state.reputation.labels.map((l) => (
                <span key={l} className="co__label">
                  {l}
                </span>
              ))}
            </div>
          )}
        </Panel>

        <Panel label="02" caption="Próxima elección" className="span-4">
          {scenario && (
            <>
              <div className="co__election-title">{scenario.title}</div>
              <div className="co__election-meta mono">
                ETAPA · {scenario.stage.toUpperCase()} · CONTRA {scenario.opponentName.toUpperCase()}
              </div>
              <div className="co__goals">
                <div className="co__goals-head mono">OBJETIVOS</div>
                <ul className="co__goals-list">
                  {state.goals.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>
              <div className="co__umbral mono">
                UMBRAL DE VICTORIA · {scenario.winThreshold}%
              </div>
            </>
          )}
        </Panel>

        <Panel label="03" caption="Partido" className="span-4">
          <div className="co__party">
            <div className="co__party-mode mono">
              {state.party.mode === 'inside_party' ? `EN ${state.party.partyName}` : state.party.partyName.toUpperCase()}
            </div>
            <StatTile label="APOYO INTERNO" value={Math.round(state.party.internalSupport)} />
            <StatTile label="DISCIPLINA" value={Math.round(state.party.discipline)} />
            <StatTile
              label="RIESGO DE RUPTURA"
              value={Math.round(state.party.ruptureRisk)}
              tone={state.party.ruptureRisk > 50 ? 'neg' : undefined}
            />
          </div>
        </Panel>

        <Panel label="04" caption="Relaciones clave" className="span-6">
          <div className="co__npcs">
            {npcs.slice(0, 8).map((npc) => (
              <div
                key={npc.id}
                className="co__npc"
                data-relation={npc.currentRelation}
              >
                <div className="co__npc-name">{npc.name}</div>
                <div className="co__npc-role mono">
                  {npc.role.toUpperCase()} · {RELATION_LABEL[npc.currentRelation]}
                </div>
                <div className="co__npc-stats mono">
                  CONF {Math.round(npc.trust)} · LEAL {Math.round(npc.loyalty)}
                </div>
              </div>
            ))}
          </div>
          {(allies.length > 0 || rivals.length > 0) && (
            <div className="co__npc-summary mono">
              <span>Aliados: {allies.length}</span>
              <span>Rivales: {rivals.length}</span>
            </div>
          )}
        </Panel>

        <Panel label="05" caption="Memoria política · activa" className="span-6">
          {state.memory.length === 0 ? (
            <p className="co__empty-text">Sin memoria política registrada aún.</p>
          ) : (
            <div className="co__memory">
              {state.memory
                .filter((m) => m.canRecur || m.age < m.duration)
                .slice(-8)
                .reverse()
                .map((m) => (
                  <div className="co__mem" key={m.id} data-impact={m.impact >= 0 ? 'pos' : 'neg'}>
                    <span className="co__mem-cycle mono">C{m.cycle + 1}</span>
                    <span className="co__mem-type mono">{memoryTypeLabel(m.type)}</span>
                    <span className="co__mem-desc">{m.description}</span>
                    <span className="co__mem-impact mono">
                      {m.impact >= 0 ? '+' : ''}
                      {m.impact}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </Panel>

        <Panel label="06" caption="Promesas" className="span-4">
          {state.promises.length === 0 ? (
            <p className="co__empty-text">Sin promesas activas.</p>
          ) : (
            <div className="co__promises">
              {state.promises.map((p) => (
                <div className="co__promise" key={p.id} data-status={p.status}>
                  <div className="co__promise-desc">{p.description}</div>
                  <div className="co__promise-meta mono">
                    {p.region && `${p.region} · `}
                    {p.status === 'open' && 'ABIERTA'}
                    {p.status === 'kept' && 'CUMPLIDA'}
                    {p.status === 'broken' && 'ROTA'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel label="07" caption="Escándalos" className="span-4">
          {state.scandals.length === 0 ? (
            <p className="co__empty-text">Sin escándalos. Por ahora.</p>
          ) : (
            <div className="co__scandals">
              {state.scandals.map((s) => (
                <div className="co__scandal" key={s.id}>
                  <div className="co__scandal-title">{s.title}</div>
                  <div className="co__scandal-meta mono">
                    SEVERIDAD · {s.severity.toUpperCase()} · {s.status.toUpperCase()}
                  </div>
                  <div className="co__scandal-desc">{s.description}</div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel label="08" caption="Narrativa reciente" className="span-4">
          {state.recentNarratives.length === 0 ? (
            <p className="co__empty-text">El ciclo recién empieza.</p>
          ) : (
            <ul className="co__narrative">
              {state.recentNarratives.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          )}
        </Panel>

        {isPrecampaign && (
          <Panel label="09" caption={`Acciones · ${state.actionPoints} pts restantes`} className="span-12">
            <div className="co__action-bar">
              <div className="co__action-picker">
                <label className="co__field">
                  <span className="co__field-label mono">ACCIÓN</span>
                  <select
                    className="co__field-input"
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value as CareerActionKind)}
                  >
                    {CAREER_ACTION_DECK.map((kind) => {
                      const def = CAREER_ACTIONS[kind];
                      return (
                        <option key={kind} value={kind}>
                          {def.label} ({def.cost} pts)
                        </option>
                      );
                    })}
                  </select>
                </label>
                {actionDef.requiresRegion && (
                  <label className="co__field">
                    <span className="co__field-label mono">REGIÓN</span>
                    <select
                      className="co__field-input"
                      value={targetRegion}
                      onChange={(e) => setTargetRegion(e.target.value as ProvinceId)}
                    >
                      {PROVINCES.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.id} · {p.name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {actionDef.requiresNpc && (
                  <label className="co__field">
                    <span className="co__field-label mono">PERSONAJE</span>
                    <select
                      className="co__field-input"
                      value={targetNpc}
                      onChange={(e) => setTargetNpc(e.target.value)}
                    >
                      {npcs.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.name} ({n.role})
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
              <div className="co__action-desc">{actionDef.description}</div>
              <button
                type="button"
                className="co__action-btn"
                onClick={handleSpendAction}
                disabled={state.actionPoints < actionDef.cost}
              >
                APLICAR · {actionDef.cost} pts
              </button>
            </div>

            <div className="co__cycle-controls">
              {state.pendingEventIds.length > 0 && (
                <button type="button" className="co__event-btn" onClick={triggerNextEvent}>
                  ⚠ ATENDER EVENTO ({state.pendingEventIds.length} en cola)
                </button>
              )}
              <button type="button" className="co__elect-btn" onClick={proceedToElection}>
                AVANZAR A LA ELECCIÓN →
              </button>
            </div>
          </Panel>
        )}

        {isAftermath && (
          <Panel label="09" caption="Resultado del ciclo" className="span-12 co__aftermath">
            {(() => {
              const last = state.completedElections[state.completedElections.length - 1];
              if (!last) return null;
              const lastCycle = state.cycles[last.cycle];
              return (
                <>
                  <div className="co__aftermath-title">
                    {lastCycle?.result === 'won'
                      ? 'VICTORIA'
                      : lastCycle?.result === 'lost_close'
                        ? 'DERROTA AJUSTADA'
                        : 'DERROTA AMPLIA'}
                  </div>
                  <div className="co__aftermath-score mono">
                    {last.playerScore.toFixed(1)}% · vs {last.opponentScore.toFixed(1)}%
                  </div>
                  <div className="co__aftermath-narratives">
                    {state.recentNarratives.map((n, i) => (
                      <p key={i}>{n}</p>
                    ))}
                  </div>
                  <button type="button" className="co__next-btn" onClick={proceedToNextCycle}>
                    {state.currentCycleIndex >= state.cycles.length - 1
                      ? 'VER LEGADO →'
                      : 'PRÓXIMO CICLO →'}
                  </button>
                </>
              );
            })()}
          </Panel>
        )}
      </div>

      <footer className="co__foot">
        <button type="button" className="co__reset" onClick={() => {
          if (window.confirm('¿Reiniciar la carrera? Se pierde el progreso.')) {
            resetCareer();
            navigate('career-setup');
          }
        }}>
          REINICIAR CARRERA
        </button>
      </footer>
    </div>
  );
}

const MEMORY_TYPE_LABELS: Record<string, string> = {
  promise_made: 'PROMESA',
  promise_kept: 'CUMPLIDA',
  promise_broken: 'ROTA',
  region_visited: 'VISITA',
  region_ignored: 'AUSENCIA',
  crisis_handled: 'CRISIS+',
  crisis_ignored: 'CRISIS−',
  scandal: 'ESCÁNDALO',
  betrayal: 'TRAICIÓN',
  alliance_formed: 'ALIANZA',
  enemy_created: 'RIVAL',
  debate_won: 'DEBATE+',
  debate_lost: 'DEBATE−',
  election_won: 'ELECCIÓN+',
  election_lost: 'ELECCIÓN−',
  controversial_decision: 'CONTROV.',
  support_received: 'APOYO',
  pending_favor: 'FAVOR',
};

function memoryTypeLabel(type: string): string {
  return MEMORY_TYPE_LABELS[type] ?? type.toUpperCase();
}

// Asegurar import usage para evitar advertencias.
void PARTIES;
void OFFICES;
