/* =============================================================================
   PARTY — Marca pública (snapshot in / snapshot out)
   Funciones puras que actualizan dimensiones de marca con clamping a 0..100.
   ============================================================================= */

import type { PartyBrand } from './types';

const clamp = (v: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, v));

export function applyBrandDelta(
  brand: PartyBrand,
  field: keyof PartyBrand,
  delta: number,
): PartyBrand {
  return { ...brand, [field]: clamp(brand[field] + delta) };
}

/** Decae lentamente algunas dimensiones cada ciclo. */
export function decayBrand(brand: PartyBrand): PartyBrand {
  return {
    ...brand,
    polarization: clamp(brand.polarization - 1.5),
    movementMystique: clamp(brand.movementMystique - 0.5),
    perceivedCorruption: clamp(brand.perceivedCorruption - 0.5),
  };
}

/** Promedio simple de "fuerza de marca" — útil como score auxiliar. */
export function brandStrengthScore(brand: PartyBrand): number {
  const positives =
    brand.ideologicalClarity +
    brand.publicTrust +
    brand.modernity +
    brand.internalOrder +
    brand.popularConnection +
    brand.technicalCompetence +
    brand.territorialStrength +
    brand.professionalism +
    brand.narrativeCoherence;
  const negatives = brand.perceivedCorruption + brand.polarization;
  return positives / 9 - negatives / 10;
}
