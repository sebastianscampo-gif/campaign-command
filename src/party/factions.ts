/* =============================================================================
   PARTY — Lógica de facciones
   Aplica deltas a stats internas, recalcula riesgo de ruptura, y agrupa
   helpers para selectores de UI.
   ============================================================================= */

import type { Faction, FactionKind } from './types';

const clamp = (v: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, v));

export interface FactionPatch {
  readonly powerDelta?: number;
  readonly loyaltyDelta?: number;
  readonly disciplineDelta?: number;
  readonly ruptureRiskDelta?: number;
  readonly resourcesDelta?: number;
  readonly mediaInfluenceDelta?: number;
  readonly ambitionDelta?: number;
}

export function patchFaction(faction: Faction, patch: FactionPatch): Faction {
  return {
    ...faction,
    power: clamp(faction.power + (patch.powerDelta ?? 0)),
    loyalty: clamp(faction.loyalty + (patch.loyaltyDelta ?? 0)),
    discipline: clamp(faction.discipline + (patch.disciplineDelta ?? 0)),
    ruptureRisk: clamp(faction.ruptureRisk + (patch.ruptureRiskDelta ?? 0)),
    resources: clamp(faction.resources + (patch.resourcesDelta ?? 0)),
    mediaInfluence: clamp(faction.mediaInfluence + (patch.mediaInfluenceDelta ?? 0)),
    ambition: clamp(faction.ambition + (patch.ambitionDelta ?? 0)),
  };
}

/** Calcula disciplina interna del partido a partir de las facciones activas. */
export function computeInternalDiscipline(factions: Record<FactionKind, Faction>): number {
  const list = Object.values(factions);
  if (list.length === 0) return 50;
  const avgLoyalty = list.reduce((s, f) => s + f.loyalty, 0) / list.length;
  const avgDiscipline = list.reduce((s, f) => s + f.discipline, 0) / list.length;
  const maxRupture = list.reduce((m, f) => Math.max(m, f.ruptureRisk), 0);
  return clamp(avgLoyalty * 0.4 + avgDiscipline * 0.4 - maxRupture * 0.3 + 20);
}

/** Verifica si alguna facción debería romperse (ruptureRisk >= 80 y loyalty < 30). */
export function factionsAtRuptureThreshold(
  factions: Record<FactionKind, Faction>,
): FactionKind[] {
  return Object.values(factions)
    .filter((f) => f.ruptureRisk >= 80 && f.loyalty < 30)
    .map((f) => f.id);
}

/** Aplica un "envejecimiento" de un ciclo: las facciones se calman levemente. */
export function ageFactions(
  factions: Record<FactionKind, Faction>,
): Record<FactionKind, Faction> {
  const out = {} as Record<FactionKind, Faction>;
  for (const kind of Object.keys(factions) as FactionKind[]) {
    const f = factions[kind];
    out[kind] = {
      ...f,
      ruptureRisk: clamp(f.ruptureRisk - 4),
    };
  }
  return out;
}
