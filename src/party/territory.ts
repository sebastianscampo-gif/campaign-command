/* =============================================================================
   PARTY — Territorio
   Helpers para mutar presencia regional y agregar datos territoriales.
   ============================================================================= */

import type { ProvinceId } from '@/content';
import type { RegionalPresence } from './types';

const clamp = (v: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, v));

export interface TerritoryPatch {
  readonly supportDelta?: number;
  readonly militantBaseDelta?: number;
  readonly machineryDelta?: number;
  readonly localMediaDelta?: number;
  readonly officesDelta?: number;
  readonly volunteersDelta?: number;
}

export function patchRegion(
  presence: RegionalPresence,
  patch: TerritoryPatch,
): RegionalPresence {
  return {
    ...presence,
    support: clamp(presence.support + (patch.supportDelta ?? 0)),
    militantBase: clamp(presence.militantBase + (patch.militantBaseDelta ?? 0)),
    machinery: clamp(presence.machinery + (patch.machineryDelta ?? 0)),
    localMedia: clamp(presence.localMedia + (patch.localMediaDelta ?? 0)),
    activeVolunteers: clamp(presence.activeVolunteers + (patch.volunteersDelta ?? 0)),
    offices: Math.max(0, presence.offices + (patch.officesDelta ?? 0)),
  };
}

/** Total nacional ponderado de apoyo electoral. */
export function nationalSupportAvg(
  territory: Record<ProvinceId, RegionalPresence>,
): number {
  const list = Object.values(territory);
  if (list.length === 0) return 0;
  return list.reduce((s, t) => s + t.support, 0) / list.length;
}

/** Cuántas provincias tienen apoyo >= umbral. */
export function provincesAboveThreshold(
  territory: Record<ProvinceId, RegionalPresence>,
  threshold: number,
): ProvinceId[] {
  return (Object.entries(territory) as [ProvinceId, RegionalPresence][])
    .filter(([, t]) => t.support >= threshold)
    .map(([id]) => id);
}
