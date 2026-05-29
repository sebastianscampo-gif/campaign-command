/* =============================================================================
   PARTY — Deudas de donantes
   Aceptar financiación corporativa condicionada deja una deuda latente. Al
   avanzar de ciclo, esa condición puede "cobrarse": detona un escándalo de
   financiamiento dudoso que persigue al partido. Una vez cobrada, el donante
   queda marcado (`triggered`) para no repetir.

   La detonación es determinista (rngFor por ciclo) y solo aplica a donantes
   corporativos con condiciones explícitas todavía no cobradas.
   ============================================================================= */

import { rngFor } from '@/sim/random';
import { createScandal } from './scandals';
import type { DonorRecord, PartyState, Scandal } from './types';

export interface DonorDebtResult {
  readonly donors: DonorRecord[];
  readonly scandals: Scandal[];
  readonly narratives: string[];
}

/** Probabilidad base de que una deuda corporativa se cobre en un ciclo dado. */
const DEBT_TRIGGER_CHANCE = 0.45;

export function checkDonorDebts(state: PartyState): DonorDebtResult {
  const rng = rngFor(state.currentCycleIndex * 13 + 7, 'donor-debt');
  const scandals: Scandal[] = [];
  const narratives: string[] = [];

  const donors = state.finances.donors.map((donor): DonorRecord => {
    const isConditional =
      donor.kind === 'corporate' &&
      donor.active &&
      !donor.triggered &&
      donor.conditions.trim().length > 0;

    if (!isConditional) return donor;

    // Más probable si la corrupción percibida ya es alta.
    const pressure = state.brand.perceivedCorruption > 45 ? 0.2 : 0;
    if (rng.next() < DEBT_TRIGGER_CHANCE + pressure) {
      const scandal = createScandal({
        cycle: state.currentCycleIndex,
        type: 'dubious_financing',
        title: `Deuda con ${donor.name} sale a la luz`,
        description: `Se filtró que el partido se comprometió a "${donor.conditions}" a cambio del aporte de ${donor.name}.`,
        severity: 'high',
        canRecur: true,
      });
      scandals.push(scandal);
      narratives.push(
        `El compromiso silencioso con ${donor.name} estalló: la prensa lo cobra como factura pendiente.`,
      );
      return { ...donor, triggered: true };
    }
    return donor;
  });

  return { donors, scandals, narratives };
}
