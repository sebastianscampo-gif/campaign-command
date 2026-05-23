/* =============================================================================
   SCREENS — Party Overview
   Hub principal del modo partido. Muestra: identidad, ciclo actual, marca,
   facciones, candidatos avalados, finanzas, territorio (resumen), escándalos,
   memoria. Permite gastar acciones y avanzar a la elección.
   ============================================================================= */

import { useEffect, useState } from 'react';
import { Panel, StatTile } from '@/components';
import { PROVINCES } from '@/content';
import type { ProvinceId } from '@/content';
import {
  PARTY_ACTION_DECK,
  PARTY_ACTIONS,
  currentPartyScenario,
  totalPartyCycles,
  usePartyStore,
} from '@/party';
import type {
  FactionKind,
  PartyActionKind,
  PartyCandidate,
} from '@/party';
import { useUiStore } from '@/state/uiStore';

export function PartyOverviewScreen() {
  const state = usePartyStore((s) => s.state);
  const triggerNextEvent = usePartyStore((s) => s.triggerNextEvent);
  const proceedToElection = usePartyStore((s) => s.proceedToElection);
  const proceedToNextCycle = usePartyStore((s) => s.proceedToNextCycle);
  const resetParty = usePartyStore((s) => s.resetParty);
  const spendActionPoint = usePartyStore((s) => s.spendActionPoint);
  const openModal = useUiStore((s) => s.openModal);
  const navigate = useUiStore((s) => s.navigate);

  const [selectedAction, setSelectedAction] = useState<PartyActionKind>('launch_national_campaign');
  const [targetRegion, setTargetRegion] = useState<ProvinceId>('CA');
  const [targetCandidate, setTargetCandidate] = useState<string>('cand_vasconcelos');
  const [targetFaction, setTargetFaction] = useState<FactionKind>('old_guard');

  const activeEventId = state?.activePartyEvent?.id ?? null;
  const status = state?.status ?? null;

  useEffect(() => {
    if (activeEventId) openModal('party-event');
  }, [activeEventId, openModal]);

  useEffect(() => {
    if (status === 'legacy') navigate('party-legacy');
  }, [status, navigate]);

  if (!state) {
    return (
      <div className="po po--empty">
        <Panel label="MODO PARTIDO" caption="sin partida activa">
          <p className="po__empty">
            Todavía no fundaste un partido. Volvé al menú principal y entrá a "Modo Partido".
          </p>
          <button type="button" className="po__cta" onClick={() => navigate('menu')}>
            VOLVER AL MENÚ
          </button>
        </Panel>
      </div>
    );
  }

  const scenario = currentPartyScenario(state);
  const totalC = totalPartyCycles();
  const cycle = state.cycles[state.currentCycleIndex];
  const actionDef = PARTY_ACTIONS[selectedAction];

  const candidates = Object.values(state.candidatePool);
  const endorsed = candidates.filter((c) => c.endorsed);
  const factions = Object.values(state.factions);
  const territoryEntries = (Object.entries(state.territory) as [ProvinceId, typeof state.territory[ProvinceId]][])
    .sort((a, b) => b[1].support - a[1].support);

  const handleSpend = () => {
    spendActionPoint(selectedAction, {
      region: actionDef.requiresRegion ? targetRegion : undefined,
      candidateId: actionDef.requiresCandidate ? targetCandidate : undefined,
      factionId: actionDef.requiresFaction ? targetFaction : undefined,
    });
  };

  const isAftermath = state.status === 'aftermath';
  const isPrecampaign = state.status === 'precampaign';

  return (
    <div className="po">
      <header className="po__head">
        <div className="po__identity">
          <div className="po__eyebrow mono">MODO PARTIDO</div>
          <div className="po__brand">
            <span className="po__bullet" style={{ background: state.profile.color }} />
            <h1 className="po__name">{state.profile.name}</h1>
            <span className="po__sigla mono">{state.profile.sigla}</span>
          </div>
          <div className="po__slogan">"{state.profile.slogan}"</div>
        </div>
        <div className="po__cycle">
          <div className="po__cycle-label mono">CICLO</div>
          <div className="po__cycle-num">{state.currentCycleIndex + 1} / {totalC}</div>
          <div className="po__cycle-stage mono">{cycle?.stage.toUpperCase()}</div>
        </div>
        <button type="button" className="po__back" onClick={() => navigate('menu')}>
          ← MENÚ
        </button>
      </header>

      <div className="po__grid">
        <Panel label="01" caption="Marca del partido" className="span-6">
          <div className="po__brand-grid">
            <StatTile label="CLARIDAD IDEOLÓGICA" value={Math.round(state.brand.ideologicalClarity)} />
            <StatTile label="CONFIANZA PÚBLICA" value={Math.round(state.brand.publicTrust)} />
            <StatTile label="MODERNIDAD" value={Math.round(state.brand.modernity)} />
            <StatTile label="ORDEN INTERNO" value={Math.round(state.brand.internalOrder)} />
            <StatTile label="CONEXIÓN POPULAR" value={Math.round(state.brand.popularConnection)} />
            <StatTile label="COMPETENCIA TÉCNICA" value={Math.round(state.brand.technicalCompetence)} />
            <StatTile label="FUERZA TERRITORIAL" value={Math.round(state.brand.territorialStrength)} />
            <StatTile
              label="CORRUPCIÓN PERCIBIDA"
              value={Math.round(state.brand.perceivedCorruption)}
              tone={state.brand.perceivedCorruption > 50 ? 'neg' : undefined}
            />
            <StatTile
              label="POLARIZACIÓN"
              value={Math.round(state.brand.polarization)}
              tone={state.brand.polarization > 60 ? 'warn' : undefined}
            />
            <StatTile label="MÍSTICA MOVIMIENTO" value={Math.round(state.brand.movementMystique)} />
            <StatTile label="PROFESIONALISMO" value={Math.round(state.brand.professionalism)} />
            <StatTile label="COHERENCIA NARRATIVA" value={Math.round(state.brand.narrativeCoherence)} />
          </div>
          {state.labels.length > 0 && (
            <div className="po__labels mono">
              {state.labels.map((l) => (
                <span key={l} className="po__label">{l}</span>
              ))}
            </div>
          )}
        </Panel>

        <Panel label="02" caption="Próxima elección" className="span-3">
          {scenario && (
            <>
              <div className="po__election-title">{scenario.title}</div>
              <div className="po__election-meta mono">
                ETAPA · {scenario.stage.toUpperCase()} · {scenario.seats} POSICIONES
              </div>
              <div className="po__umbral mono">
                UMBRAL DE VICTORIA · {scenario.winThreshold}% nacional
              </div>
              <div className="po__goals">
                <div className="po__goals-head mono">OBJETIVOS</div>
                <ul className="po__goals-list">
                  {state.goals.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </Panel>

        <Panel label="03" caption="Finanzas y militancia" className="span-3">
          <StatTile label="CAJA (M)" value={Number(state.finances.money.toFixed(1))} />
          <StatTile label="MILITANTES (k)" value={Math.round(state.finances.militants)} />
          <StatTile label="VOLUNTARIOS (k)" value={Math.round(state.finances.volunteers)} />
          <StatTile label="CAPITAL POLÍTICO" value={Math.round(state.finances.politicalCapital)} />
          <StatTile label="INFLUENCIA MEDIÁTICA" value={Math.round(state.finances.mediaInfluence)} />
          <StatTile
            label="DISCIPLINA INTERNA"
            value={Math.round(state.internalDiscipline)}
            tone={state.internalDiscipline < 40 ? 'warn' : undefined}
          />
        </Panel>

        <Panel label="04" caption="Facciones" className="span-6">
          <div className="po__factions">
            {factions.map((f) => (
              <div
                key={f.id}
                className="po__faction"
                data-risk={f.ruptureRisk > 60 ? 'high' : f.ruptureRisk > 30 ? 'med' : 'low'}
              >
                <div className="po__faction-head">
                  <div className="po__faction-name">{f.name}</div>
                  <div className="po__faction-leader mono">{f.leader}</div>
                </div>
                <div className="po__faction-stats mono">
                  <span>PODER {Math.round(f.power)}</span>
                  <span>LEAL {Math.round(f.loyalty)}</span>
                  <span>DISC {Math.round(f.discipline)}</span>
                  <span data-risk={f.ruptureRisk > 60 ? 'high' : undefined}>
                    RUPT {Math.round(f.ruptureRisk)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel label="05" caption="Candidatos avalados" className="span-6">
          {endorsed.length === 0 ? (
            <p className="po__empty-text">
              Sin avales todavía. Usá una acción "Otorgar aval" para apoyar a candidatos.
            </p>
          ) : (
            <div className="po__candidates">
              {endorsed.map((c) => (
                <CandidateRow key={c.id} candidate={c} />
              ))}
            </div>
          )}
          <details className="po__details">
            <summary className="mono">VER POOL COMPLETO ({candidates.length})</summary>
            <div className="po__candidates">
              {candidates.filter((c) => !c.endorsed).map((c) => (
                <CandidateRow key={c.id} candidate={c} />
              ))}
            </div>
          </details>
        </Panel>

        <Panel label="06" caption="Territorio (top 6)" className="span-6">
          <div className="po__territory">
            {territoryEntries.slice(0, 6).map(([id, t]) => {
              const province = PROVINCES.find((p) => p.id === id);
              return (
                <div className="po__region" key={id}>
                  <div className="po__region-head">
                    <span className="po__region-id mono">{id}</span>
                    <span className="po__region-name">{province?.name ?? id}</span>
                  </div>
                  <div className="po__region-stats mono">
                    <span>SUP {Math.round(t.support)}</span>
                    <span>MAQ {Math.round(t.machinery)}</span>
                    <span>SEDES {t.offices}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel label="07" caption="Memoria activa" className="span-6">
          {state.memory.length === 0 ? (
            <p className="po__empty-text">El partido todavía no acumuló memoria política.</p>
          ) : (
            <div className="po__memory">
              {state.memory
                .filter((m) => m.canRecur || m.age < m.duration)
                .slice(-8)
                .reverse()
                .map((m) => (
                  <div key={m.id} className="po__mem" data-impact={m.impact >= 0 ? 'pos' : 'neg'}>
                    <span className="po__mem-cycle mono">C{m.cycle + 1}</span>
                    <span className="po__mem-type mono">{m.type.toUpperCase()}</span>
                    <span className="po__mem-desc">{m.description}</span>
                    <span className="po__mem-impact mono">
                      {m.impact >= 0 ? '+' : ''}
                      {m.impact}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </Panel>

        <Panel label="08" caption="Escándalos" className="span-6">
          {state.scandals.length === 0 ? (
            <p className="po__empty-text">Sin escándalos abiertos.</p>
          ) : (
            <div className="po__scandals">
              {state.scandals.map((s) => (
                <div key={s.id} className="po__scandal" data-severity={s.severity}>
                  <div className="po__scandal-title">{s.title}</div>
                  <div className="po__scandal-meta mono">
                    SEV · {s.severity.toUpperCase()} · {s.status.toUpperCase()}
                  </div>
                  <div className="po__scandal-desc">{s.description}</div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel label="09" caption="Narrativa reciente" className="span-6">
          {state.recentNarratives.length === 0 ? (
            <p className="po__empty-text">El ciclo recién empieza.</p>
          ) : (
            <ul className="po__narrative">
              {state.recentNarratives.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          )}
        </Panel>

        {isPrecampaign && (
          <Panel
            label="10"
            caption={`Acciones · ${state.actionPoints} pts restantes`}
            className="span-12"
          >
            <div className="po__action-bar">
              <div className="po__action-picker">
                <label className="po__field">
                  <span className="po__field-label mono">ACCIÓN</span>
                  <select
                    className="po__field-input"
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value as PartyActionKind)}
                  >
                    {PARTY_ACTION_DECK.map((kind) => {
                      const def = PARTY_ACTIONS[kind];
                      return (
                        <option key={kind} value={kind}>
                          {def.label} ({def.cost} pts)
                        </option>
                      );
                    })}
                  </select>
                </label>
                {actionDef.requiresRegion && (
                  <label className="po__field">
                    <span className="po__field-label mono">REGIÓN</span>
                    <select
                      className="po__field-input"
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
                {actionDef.requiresCandidate && (
                  <label className="po__field">
                    <span className="po__field-label mono">CANDIDATO</span>
                    <select
                      className="po__field-input"
                      value={targetCandidate}
                      onChange={(e) => setTargetCandidate(e.target.value)}
                    >
                      {candidates.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.role})
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {actionDef.requiresFaction && (
                  <label className="po__field">
                    <span className="po__field-label mono">FACCIÓN</span>
                    <select
                      className="po__field-input"
                      value={targetFaction}
                      onChange={(e) => setTargetFaction(e.target.value as FactionKind)}
                    >
                      {factions.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
              <div className="po__action-desc">{actionDef.description}</div>
              <button
                type="button"
                className="po__action-btn"
                onClick={handleSpend}
                disabled={state.actionPoints < actionDef.cost}
              >
                APLICAR · {actionDef.cost} pts
              </button>
            </div>

            <div className="po__cycle-controls">
              {state.pendingEventIds.length > 0 && (
                <button type="button" className="po__event-btn" onClick={triggerNextEvent}>
                  ⚠ ATENDER EVENTO ({state.pendingEventIds.length} en cola)
                </button>
              )}
              <button type="button" className="po__elect-btn" onClick={proceedToElection}>
                AVANZAR A LA ELECCIÓN →
              </button>
            </div>
          </Panel>
        )}

        {isAftermath && (
          <Panel label="10" caption="Resultado del ciclo" className="span-12 po__aftermath">
            {(() => {
              const last = state.completedElections[state.completedElections.length - 1];
              if (!last) return null;
              const lastCycle = state.cycles[last.cycle];
              return (
                <>
                  <div className="po__aftermath-title">
                    {lastCycle?.result === 'won'
                      ? 'VICTORIA'
                      : lastCycle?.result === 'split'
                        ? 'RESULTADO PARCIAL'
                        : 'DERROTA'}
                  </div>
                  <div className="po__aftermath-score mono">
                    {last.nationalShare.toFixed(1)}% · {last.seatsWon} posiciones · {last.provincesWon.length} provincias
                  </div>
                  <div className="po__aftermath-narratives">
                    {state.recentNarratives.map((n, i) => (
                      <p key={i}>{n}</p>
                    ))}
                  </div>
                  <button type="button" className="po__next-btn" onClick={proceedToNextCycle}>
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

      <footer className="po__foot">
        <button
          type="button"
          className="po__reset"
          onClick={() => {
            if (window.confirm('¿Reiniciar el partido? Se pierde el progreso.')) {
              resetParty();
              navigate('party-setup');
            }
          }}
        >
          REINICIAR PARTIDO
        </button>
      </footer>
    </div>
  );
}

function CandidateRow({ candidate }: { candidate: PartyCandidate }) {
  return (
    <div className="po__candidate" data-endorsed={candidate.endorsed}>
      <div className="po__candidate-head">
        <span className="po__candidate-name">{candidate.name}</span>
        <span className="po__candidate-role mono">{candidate.role.toUpperCase()}</span>
      </div>
      <div className="po__candidate-stats mono">
        <span>POP {Math.round(candidate.popularity)}</span>
        <span>LEAL {Math.round(candidate.loyalty)}</span>
        <span>ESC {Math.round(candidate.scandalRisk)}</span>
      </div>
    </div>
  );
}
