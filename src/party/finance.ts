/* =============================================================================
   PARTY — Finanzas y militancia
   Maneja deltas de caja, militantes, voluntarios, capital político, influencia
   mediática. También registra donantes activos.
   ============================================================================= */

import type { DonorKind, DonorRecord, PartyFinances } from './types';

const clamp = (v: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, v));

export interface FinancePatch {
  readonly moneyDelta?: number;
  readonly militantsDelta?: number;
  readonly volunteersDelta?: number;
  readonly politicalCapitalDelta?: number;
  readonly mediaInfluenceDelta?: number;
}

export function applyFinancePatch(
  finances: PartyFinances,
  patch: FinancePatch,
): PartyFinances {
  return {
    ...finances,
    money: Math.max(-99, finances.money + (patch.moneyDelta ?? 0)),
    militants: Math.max(0, finances.militants + (patch.militantsDelta ?? 0)),
    volunteers: Math.max(0, finances.volunteers + (patch.volunteersDelta ?? 0)),
    politicalCapital: clamp(finances.politicalCapital + (patch.politicalCapitalDelta ?? 0)),
    mediaInfluence: clamp(finances.mediaInfluence + (patch.mediaInfluenceDelta ?? 0)),
  };
}

export function registerDonor(
  finances: PartyFinances,
  donor: { kind: DonorKind; name: string; amount: number; conditions: string },
): PartyFinances {
  const record: DonorRecord = {
    kind: donor.kind,
    name: donor.name,
    amount: donor.amount,
    conditions: donor.conditions,
    active: true,
  };
  // Si ya hay un donor con mismo nombre, lo reemplaza.
  const filtered = finances.donors.filter((d) => d.name !== donor.name);
  return {
    ...finances,
    donors: [...filtered, record],
    money: finances.money + donor.amount,
  };
}
