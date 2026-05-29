/* =============================================================================
   PARTY — Resolución de elecciones del partido
   Score nacional ≈ función de marca + territorio + finanzas + candidatos
   avalados + memoria activa − escándalos. Determinista vía rngFor(scenarioId,
   currentCycleIndex).
   ============================================================================= */

import { rngFor } from '@/sim/random';
import { brandStrengthScore } from './brand';
import { endorsedPopularitySum } from './candidates';
import { coalitionShareBonus } from './coalitions';
import { activeMemories, netMemoryImpact } from './memory';
import { activeScandals } from './scandals';
import { nationalSupportAvg, provincesAboveThreshold } from './territory';
import { PARTY_ELECTIONS } from './content/elections';
import type {
  CompletedPartyElection,
  ElectionResult,
  PartyElectionScenario,
  PartyState,
} from './types';

const clamp = (v: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, v));

export function getPartyScenario(id: string): PartyElectionScenario | undefined {
  return PARTY_ELECTIONS.find((e) => e.id === id);
}

/** Score crudo de cuota nacional (0..100) que obtiene el partido. */
export function computeNationalShare(
  state: PartyState,
  scenario: PartyElectionScenario,
): number {
  const brand = brandStrengthScore(state.brand);
  const territory = nationalSupportAvg(state.territory);
  const endorsed = endorsedPopularitySum(state.candidatePool, scenario.stage);
  const endorsedAvg = endorsed > 0 ? endorsed / Math.max(1, Object.values(state.candidatePool).filter((c) => c.endorsed && c.endorsedFor === scenario.stage).length) : 30;

  // Escándalos activos: penalización por severidad.
  const scandalsPenalty = activeScandals(state.scandals).reduce((sum, s) => {
    const w = s.severity === 'critical' ? 14 : s.severity === 'high' ? 9 : s.severity === 'medium' ? 5 : 2;
    return sum + w;
  }, 0);

  // Memoria: impactos vigentes (signados).
  const memoryBonus = netMemoryImpact(state.memory) * 0.4;

  // Disciplina interna ayuda a movilizar.
  const disciplineBonus = (state.internalDiscipline - 50) * 0.18;

  // Caja: efecto rendimiento decreciente.
  const moneyBonus = Math.min(8, Math.max(-4, state.finances.money * 0.5));

  // Influencia mediática.
  const mediaBonus = (state.finances.mediaInfluence - 50) * 0.15;

  // Coaliciones activas aplicables a esta etapa.
  const coalitionBonus = coalitionShareBonus(state.coalitions, scenario.stage);

  // Stage modifier: nacionales pesa más marca, locales pesa más territorio.
  let stageMod = 0;
  if (scenario.stage === 'national') stageMod = brand * 0.4 + endorsedAvg * 0.05;
  else if (scenario.stage === 'legislative') stageMod = brand * 0.25 + territory * 0.15;
  else stageMod = territory * 0.35 + brand * 0.1;

  const rng = rngFor(scenario.id.charCodeAt(0) + state.currentCycleIndex, 'party-election');
  const noise = (rng.next() - 0.5) * 6;

  const raw =
    territory * 0.18 +
    brand * 0.15 +
    endorsedAvg * 0.12 +
    stageMod * 0.5 +
    memoryBonus +
    disciplineBonus +
    moneyBonus +
    mediaBonus +
    coalitionBonus -
    scandalsPenalty +
    noise;

  return clamp(raw, 2, 88);
}

/** Devuelve resultado: ganó (>= winThreshold), split (>= 60% threshold), o perdió. */
export function classifyResult(
  share: number,
  scenario: PartyElectionScenario,
): ElectionResult {
  if (share >= scenario.winThreshold) return 'won';
  if (share >= scenario.winThreshold * 0.7) return 'split';
  return 'lost';
}

export function resolvePartyElection(
  state: PartyState,
  scenario: PartyElectionScenario,
): CompletedPartyElection {
  const share = computeNationalShare(state, scenario);
  const result = classifyResult(share, scenario);

  // Asientos ganados proporcionales al share, modulados por win.
  const seatRatio = result === 'won' ? share / 100 : share / 130;
  const seatsWon = Math.round(scenario.seats * seatRatio);

  // Provincias ganadas: las que tengan support >= 40 + boost de resultado.
  const provThreshold =
    result === 'won' ? 38 : result === 'split' ? 46 : 55;
  const provincesWon = provincesAboveThreshold(state.territory, provThreshold);

  // Candidatos electos: los avalados con mayor popularidad, hasta seatsWon.
  const electedCandidates = Object.values(state.candidatePool)
    .filter((c) => c.endorsed && c.endorsedFor === scenario.stage)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, Math.max(1, seatsWon))
    .map((c) => c.id);

  return {
    scenarioId: scenario.id,
    cycle: state.currentCycleIndex,
    result,
    nationalShare: Math.round(share * 10) / 10,
    seatsWon,
    provincesWon,
    electedCandidates,
  };
}

/** Marca usada por la UI: recompensa de marca por resultado. */
export function brandRewardFor(
  result: ElectionResult,
  scenario: PartyElectionScenario,
): number {
  if (result === 'won') return scenario.brandReward;
  if (result === 'split') return Math.round(scenario.brandReward * 0.3);
  return -Math.round(scenario.brandReward * 0.4);
}

/** Suma de activeMemories para selectors de UI (no usado internamente). */
export function recentMemoriesCount(state: PartyState): number {
  return activeMemories(state.memory).length;
}
