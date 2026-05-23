/* =============================================================================
   CAREER — Reputación
   La reputación tiene 15 dimensiones más etiquetas narrativas. Estas funciones
   son puras: snapshot in, snapshot out. Mantenerlas pequeñas hace que los
   efectos de cada acción/evento sean trazables (debug y test).
   ============================================================================= */

import type { Reputation, PoliticianStats } from './types';

const clamp = (v: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, v));

/** Construye una reputación inicial derivada de las stats del político. */
export function initialReputation(stats: PoliticianStats): Reputation {
  return {
    publicTrust: clamp((stats.perceivedHonesty + stats.charisma) / 2),
    charisma: stats.charisma,
    competence: stats.technicalCompetence,
    honesty: stats.perceivedHonesty,
    authority: clamp(40 + stats.strategy / 5),
    popularity: clamp(stats.popularConnection),
    radicalism: stats.radicalism,
    internationalImage: 30,
    partyLoyalty: stats.partyDiscipline,
    governmentCapacity: clamp(stats.technicalCompetence * 0.8),
    nationalFame: 12,
    polarization: clamp(stats.radicalism * 0.6),
    economicCredibility: clamp(stats.technicalCompetence * 0.7),
    socialCredibility: clamp(stats.popularConnection * 0.7),
    securityCredibility: 40,
    labels: [],
  };
}

/** Devuelve nueva reputación con `field += delta`, acotado a 0..100. */
export function applyDelta<F extends keyof Reputation>(
  reputation: Reputation,
  field: F,
  delta: number,
): Reputation {
  if (field === 'labels') return reputation;
  const current = reputation[field] as number;
  return {
    ...reputation,
    [field]: clamp(current + delta),
  };
}

/** Agrega una etiqueta si no estaba; o la elimina si add=undefined. */
export function setLabel(
  reputation: Reputation,
  options: { add?: string; remove?: string },
): Reputation {
  let labels = reputation.labels;
  if (options.remove) {
    labels = labels.filter((l) => l !== options.remove);
  }
  if (options.add && !labels.includes(options.add)) {
    labels = [...labels, options.add];
  }
  return { ...reputation, labels };
}

/** Decae lentamente algunas dimensiones cada ciclo (polarización, fama). */
export function decayReputation(reputation: Reputation): Reputation {
  return {
    ...reputation,
    polarization: clamp(reputation.polarization - 1),
    nationalFame: clamp(reputation.nationalFame - 0.5),
  };
}
