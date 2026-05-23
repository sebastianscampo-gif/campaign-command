/* =============================================================================
   CAREER — Legado
   Al cerrar la carrera, calcula un score numérico + asigna una etiqueta de
   legado. Las etiquetas son textos curados que matchean el perfil del jugador.

   Reglas:
   - El score crudo se compone de: cargos alcanzados, balance de elecciones,
     promesas cumplidas vs rotas, reputación final, polarización penalizada,
     aliados conservados.
   - La etiqueta busca el rule de mayor prioridad cuyo predicado matcheé.
   ============================================================================= */

import { OFFICES } from './content/offices';
import { LEGACY_LABELS } from './content/narrative';
import type {
  CareerState,
  CompletedElection,
  OfficeId,
  Reputation,
} from './types';

export interface LegacySummary {
  readonly score: number;
  readonly label: string;
  readonly highlights: readonly string[];
  readonly stats: LegacyStats;
}

export interface LegacyStats {
  readonly officesHeld: readonly OfficeId[];
  readonly electionsWon: number;
  readonly electionsLost: number;
  readonly promisesKept: number;
  readonly promisesBroken: number;
  readonly alliesPreserved: number;
  readonly enemiesCreated: number;
  readonly regionsSupporting: number;
  readonly polarization: number;
}

function executiveValue(office: OfficeId): number {
  const def = OFFICES[office];
  const stageWeight = { local: 4, regional: 12, national: 22, presidential: 40 }[def.stage];
  return def.executive ? stageWeight : Math.round(stageWeight * 0.6);
}

function highestOfficeReached(elections: readonly CompletedElection[]): OfficeId | null {
  const wins = elections.filter((e) => e.result === 'won' && e.officeAwarded);
  if (wins.length === 0) return null;
  // El que dé más score ejecutivo es el más alto.
  let best: OfficeId | null = null;
  let bestValue = -1;
  for (const e of wins) {
    if (!e.officeAwarded) continue;
    const v = executiveValue(e.officeAwarded);
    if (v > bestValue) {
      bestValue = v;
      best = e.officeAwarded;
    }
  }
  return best;
}

export function computeLegacy(state: CareerState): LegacySummary {
  const stats: LegacyStats = {
    officesHeld: Array.from(
      new Set(
        state.completedElections
          .filter((e) => e.result === 'won' && e.officeAwarded)
          .map((e) => e.officeAwarded as OfficeId),
      ),
    ),
    electionsWon: state.completedElections.filter((e) => e.result === 'won').length,
    electionsLost: state.completedElections.filter((e) => e.result !== 'won' && e.result !== 'pending').length,
    promisesKept: state.promises.filter((p) => p.status === 'kept').length,
    promisesBroken: state.promises.filter((p) => p.status === 'broken').length,
    alliesPreserved: state.allies.length,
    enemiesCreated: state.rivals.length,
    regionsSupporting: countRegionsSupporting(state),
    polarization: state.reputation.polarization,
  };

  const officeScore = stats.officesHeld.reduce((sum, o) => sum + executiveValue(o), 0);
  const electionScore = stats.electionsWon * 10 - stats.electionsLost * 4;
  const promiseScore = stats.promisesKept * 6 - stats.promisesBroken * 8;
  const relationScore = stats.alliesPreserved * 4 - stats.enemiesCreated * 3;
  const reputationScore = (state.reputation.publicTrust + state.reputation.honesty + state.reputation.authority) / 6;
  const polarizationPenalty = state.reputation.polarization * 0.2;

  const score = Math.round(
    officeScore + electionScore + promiseScore + relationScore + reputationScore - polarizationPenalty,
  );

  const label = pickLegacyLabel(state, stats);
  const highlights = composeHighlights(state, stats);

  return { score, label, highlights, stats };
}

function countRegionsSupporting(state: CareerState): number {
  const supporting = new Set<string>();
  for (const m of state.memory) {
    if (m.region && m.impact >= 4 && (m.type === 'region_visited' || m.type === 'promise_kept' || m.type === 'crisis_handled')) {
      supporting.add(m.region);
    }
  }
  return supporting.size;
}

function pickLegacyLabel(state: CareerState, stats: LegacyStats): string {
  const r = state.reputation;
  const candidates: { rule: typeof LEGACY_LABELS[number]; matches: boolean }[] = LEGACY_LABELS.map((rule) => ({
    rule,
    matches: matchLegacyRule(rule.id, state, stats, r),
  }));

  const matched = candidates.filter((c) => c.matches);
  if (matched.length === 0) return 'Cuadro olvidado';
  matched.sort((a, b) => b.rule.priority - a.rule.priority);
  // Ya filtramos length > 0.
  return matched[0]!.rule.label;
}

function matchLegacyRule(
  id: string,
  state: CareerState,
  stats: LegacyStats,
  r: Reputation,
): boolean {
  const reachedPresidency = stats.officesHeld.includes('president');
  const reachedGov = stats.officesHeld.includes('governor');

  switch (id) {
    case 'reformist_hero':
      return state.player.archetype === 'reformist' && r.honesty >= 65 && stats.electionsWon >= 2;
    case 'populist_dominant':
      return state.player.archetype === 'populist' && r.polarization >= 50 && reachedPresidency;
    case 'promise_destroyed':
      return stats.promisesBroken >= 2 && state.scandals.length >= 1 && r.publicTrust < 40;
    case 'one_region_president':
      return reachedPresidency && stats.regionsSupporting <= 2;
    case 'polarizing_leader':
      return r.polarization >= 60 && stats.enemiesCreated >= 2;
    case 'technocrat_unloved':
      return state.player.archetype === 'technocrat' && r.competence >= 65 && r.popularity < 45;
    case 'regional_to_national':
      return reachedGov && reachedPresidency;
    case 'outsider_breaker':
      return state.player.archetype === 'outsider' && reachedPresidency;
    case 'never_arrived':
      return stats.electionsWon === 0;
    case 'survivor':
      return stats.electionsLost >= 1 && stats.electionsWon >= 1 && state.scandals.length >= 1;
    case 'forgotten':
      return true; // catch-all de menor prioridad
  }
  return false;
}

function composeHighlights(state: CareerState, stats: LegacyStats): string[] {
  const out: string[] = [];

  const highest = highestOfficeReached(state.completedElections);
  if (highest) {
    out.push(`Cargo más alto alcanzado: ${OFFICES[highest].label}.`);
  } else {
    out.push('Nunca conseguiste un cargo electo.');
  }

  out.push(`${stats.electionsWon} elecciones ganadas · ${stats.electionsLost} perdidas.`);

  if (stats.promisesKept || stats.promisesBroken) {
    out.push(`Promesas: ${stats.promisesKept} cumplidas · ${stats.promisesBroken} rotas.`);
  }

  if (stats.alliesPreserved) out.push(`Conservaste ${stats.alliesPreserved} aliados claves.`);
  if (stats.enemiesCreated) out.push(`Construiste ${stats.enemiesCreated} rivalidades duraderas.`);

  if (state.scandals.length > 0) {
    out.push(`Sobreviviste a ${state.scandals.length} escándalo${state.scandals.length === 1 ? '' : 's'}.`);
  }

  if (state.reputation.labels.length > 0) {
    out.push(`Etiquetas activas: ${state.reputation.labels.join(' · ')}.`);
  }

  return out;
}
