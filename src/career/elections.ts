/* =============================================================================
   CAREER — Resolución electoral
   Para esta primera versión la elección se resuelve con una fórmula
   determinista compuesta de reputación + party + memoria + ruido pequeño.

   No es la simulación profunda — eso vendrá cuando el motor de campaña real
   se acople. Pero el contrato (snapshot in, result out) ya está fijado.
   ============================================================================= */

import { rngFor } from '@/sim/random';
import { CAREER_ELECTIONS } from './content/elections';
import { netMemoryImpact, memoriesForRegion } from './memory';
import type {
  CareerState,
  CompletedElection,
  ElectionResult,
  ElectionScenario,
} from './types';

function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

export function getElectionScenario(id: string): ElectionScenario | undefined {
  return CAREER_ELECTIONS.find((e) => e.id === id);
}

/** Score crudo del jugador (0..100). Combina reputación, party, memoria. */
export function computePlayerScore(state: CareerState, scenario: ElectionScenario): number {
  const r = state.reputation;

  // Base: confianza, popularidad y carisma pesan más que credibilidades técnicas.
  const baseSupport =
    r.publicTrust * 0.25 +
    r.popularity * 0.22 +
    r.charisma * 0.13 +
    r.competence * 0.1 +
    r.honesty * 0.1 +
    r.authority * 0.08 +
    r.nationalFame * 0.07 +
    r.governmentCapacity * 0.05;

  // Etapa: en presidencial pesan más la imagen nacional y competencia.
  let stageMod = 0;
  if (scenario.stage === 'presidential') {
    stageMod = (r.nationalFame - 50) * 0.15 + (r.governmentCapacity - 50) * 0.1;
  } else if (scenario.stage === 'regional') {
    stageMod = (r.popularity - 50) * 0.1 + (r.authority - 50) * 0.05;
  } else {
    stageMod = (r.popularity - 50) * 0.15;
  }

  // Partido: si estás adentro y tu apoyo interno es alto, suma.
  const partySupport =
    state.party.mode === 'inside_party' ? (state.party.internalSupport - 50) * 0.12 : 0;

  // Memoria política: la suma neta de impactos vigentes (signada).
  const memoryBonus = netMemoryImpact(state.memory);

  // Memoria específica de la región del scenario (si tiene), pesa el doble.
  const regionalMemory = scenario.region
    ? memoriesForRegion(state.memory, scenario.region).reduce((s, m) => s + m.impact, 0)
    : 0;

  // Escándalos activos: penalización plana por cantidad y severidad.
  const scandalsPenalty = state.scandals
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => {
      const weight = s.severity === 'critical' ? 12 : s.severity === 'high' ? 8 : s.severity === 'medium' ? 4 : 2;
      return sum + weight;
    }, 0);

  // Promesas rotas activas: penalización adicional.
  const brokenPromises = state.memory.filter(
    (m) => m.type === 'promise_broken' && m.age < m.duration,
  ).length;

  // Ruido determinista para que dos elecciones idénticas no sean idénticas.
  const rng = rngFor(scenario.id.charCodeAt(0) + state.currentCycleIndex, 'election');
  const noise = (rng.next() - 0.5) * 4;

  const score =
    baseSupport + stageMod + partySupport + memoryBonus + regionalMemory * 2 - scandalsPenalty - brokenPromises * 3 + noise;

  return clamp(score, 5, 95);
}

/** Score crudo del oponente — variable según etapa y rival. */
export function computeOpponentScore(scenario: ElectionScenario, state: CareerState): number {
  const rng = rngFor(scenario.id.charCodeAt(0) * 3 + state.currentCycleIndex, 'opp');
  // Oponente más fuerte a medida que sube la etapa.
  const base = scenario.stage === 'presidential' ? 50 : scenario.stage === 'regional' ? 46 : 42;
  const noise = (rng.next() - 0.5) * 10;
  return clamp(base + noise, 20, 80);
}

/** Resuelve una elección y devuelve el CompletedElection. */
export function resolveElection(
  state: CareerState,
  scenario: ElectionScenario,
): CompletedElection {
  const playerScore = computePlayerScore(state, scenario);
  const opponentScore = computeOpponentScore(scenario, state);

  let result: ElectionResult;
  if (playerScore >= scenario.winThreshold && playerScore > opponentScore) {
    result = 'won';
  } else {
    const gap = Math.abs(playerScore - opponentScore);
    result = gap < 6 ? 'lost_close' : 'lost_landslide';
  }

  const turnoutPct = 55 + (state.reputation.popularity - 50) * 0.15;

  return {
    scenarioId: scenario.id,
    cycle: state.currentCycleIndex,
    result,
    playerScore: Math.round(playerScore * 10) / 10,
    opponentScore: Math.round(opponentScore * 10) / 10,
    turnoutPct: Math.round(turnoutPct * 10) / 10,
    region: scenario.region,
    officeAwarded: result === 'won' ? scenario.officeOnWin : null,
  };
}
