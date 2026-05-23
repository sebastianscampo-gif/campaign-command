/* =============================================================================
   PARTY — Lógica de candidatos
   Endorsements, expulsiones, ajustes de stats. Operaciones puras.
   ============================================================================= */

import type { ElectionStage, PartyCandidate } from './types';

const clamp = (v: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, v));

export interface CandidatePatch {
  readonly popularityDelta?: number;
  readonly loyaltyDelta?: number;
  readonly ambitionDelta?: number;
  readonly scandalRiskDelta?: number;
  readonly groundGameDelta?: number;
  readonly mediaSkillDelta?: number;
}

export function patchCandidate(
  candidate: PartyCandidate,
  patch: CandidatePatch,
): PartyCandidate {
  return {
    ...candidate,
    popularity: clamp(candidate.popularity + (patch.popularityDelta ?? 0)),
    loyalty: clamp(candidate.loyalty + (patch.loyaltyDelta ?? 0)),
    ambition: clamp(candidate.ambition + (patch.ambitionDelta ?? 0)),
    scandalRisk: clamp(candidate.scandalRisk + (patch.scandalRiskDelta ?? 0)),
    groundGame: clamp(candidate.groundGame + (patch.groundGameDelta ?? 0)),
    mediaSkill: clamp(candidate.mediaSkill + (patch.mediaSkillDelta ?? 0)),
  };
}

export function endorseCandidate(
  candidate: PartyCandidate,
  stage: ElectionStage,
): PartyCandidate {
  return {
    ...candidate,
    endorsed: true,
    endorsedFor: stage,
    history: [...candidate.history, `Avalado para ${stage}.`],
  };
}

export function revokeEndorsement(candidate: PartyCandidate): PartyCandidate {
  return {
    ...candidate,
    endorsed: false,
    endorsedFor: null,
    history: [...candidate.history, 'Aval revocado.'],
    loyalty: clamp(candidate.loyalty - 12),
  };
}

/** Lista de candidatos avalados para una etapa. */
export function endorsedForStage(
  pool: Record<string, PartyCandidate>,
  stage: ElectionStage,
): PartyCandidate[] {
  return Object.values(pool).filter(
    (c) => c.endorsed && c.endorsedFor === stage,
  );
}

/** Suma de popularidad de los avalados — proxy de fuerza electoral del set. */
export function endorsedPopularitySum(
  pool: Record<string, PartyCandidate>,
  stage: ElectionStage,
): number {
  return endorsedForStage(pool, stage).reduce((s, c) => s + c.popularity, 0);
}
