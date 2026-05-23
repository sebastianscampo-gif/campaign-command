/* =============================================================================
   CAREER — Relaciones con NPCs
   Funciones puras para mover stats de NPCs y derivar la relación (allied,
   neutral, tense, hostile) a partir de trust + loyalty.

   El status de relación deriva de los stats — no se setea manualmente. Eso
   garantiza que la UI siempre refleje el estado real, no uno desactualizado.
   ============================================================================= */

import type { NpcCharacter, RelationStatus } from './types';

const clamp = (v: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, v));

/** Deriva el status de relación desde los stats. */
export function deriveRelationStatus(npc: NpcCharacter): RelationStatus {
  const composite = npc.trust * 0.5 + npc.loyalty * 0.3 + npc.respect * 0.2;
  if (composite >= 70 && npc.trust >= 60) return 'allied';
  if (composite >= 45) return 'neutral';
  if (composite >= 25) return 'tense';
  return 'hostile';
}

export interface RelationPatch {
  readonly trustDelta?: number;
  readonly loyaltyDelta?: number;
  readonly fearDelta?: number;
  readonly respectDelta?: number;
  readonly historyNote?: string;
  readonly ambitionDelta?: number;
  readonly betrayalRiskDelta?: number;
}

/** Aplica un patch sobre un NPC y devuelve una nueva referencia. */
export function patchNpc(npc: NpcCharacter, patch: RelationPatch): NpcCharacter {
  const next: NpcCharacter = {
    ...npc,
    trust: clamp(npc.trust + (patch.trustDelta ?? 0)),
    loyalty: clamp(npc.loyalty + (patch.loyaltyDelta ?? 0)),
    fear: clamp(npc.fear + (patch.fearDelta ?? 0)),
    respect: clamp(npc.respect + (patch.respectDelta ?? 0)),
    ambition: clamp(npc.ambition + (patch.ambitionDelta ?? 0)),
    betrayalRisk: clamp(npc.betrayalRisk + (patch.betrayalRiskDelta ?? 0)),
    history: patch.historyNote ? [...npc.history, patch.historyNote] : npc.history,
    currentRelation: npc.currentRelation,
  };
  return { ...next, currentRelation: deriveRelationStatus(next) };
}

/** Calcula riesgo de traición incrementado por baja confianza + alta ambición. */
export function recomputeBetrayalRisk(npc: NpcCharacter): number {
  // baseline ya tracked; agregamos presión por gap entre ambición y trust.
  const pressure = Math.max(0, npc.ambition - npc.trust) / 2;
  return clamp(npc.betrayalRisk + pressure - npc.loyalty / 6);
}

/** Identifica NPCs con relación `allied`. */
export function listAllies(npcs: Record<string, NpcCharacter>): NpcCharacter[] {
  return Object.values(npcs).filter((n) => n.currentRelation === 'allied');
}

/** Identifica NPCs con relación `hostile`. */
export function listRivals(npcs: Record<string, NpcCharacter>): NpcCharacter[] {
  return Object.values(npcs).filter((n) => n.currentRelation === 'hostile');
}
