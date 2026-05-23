/* =============================================================================
   PARTY · CONTENT — Ofertas de coalición
   Catálogo de partidos con los que se puede pactar. Cada uno tiene términos y
   tradeoffs claros. La aceptación/rechazo lo decide el jugador via evento o
   acción.
   ============================================================================= */

import type { CoalitionType, PartyEventOutcome } from '../types';
import type { PartyId } from '@/content';

export interface CoalitionOffer {
  readonly id: string;
  readonly partnerName: string;
  readonly partnerPartyId: PartyId;
  readonly type: CoalitionType;
  readonly terms: string;
  readonly description: string;
  /** Cuándo aparece (qué stage de elección). */
  readonly availableAtStage: 'local' | 'legislative' | 'national' | 'all';
  /** Efectos al aceptar. */
  readonly acceptOutcomes: readonly PartyEventOutcome[];
  /** Efectos al rechazar (suele ser pérdida menor). */
  readonly rejectOutcomes: readonly PartyEventOutcome[];
}

export const COALITION_OFFERS: readonly CoalitionOffer[] = [
  {
    id: 'pact_mnp_tactical',
    partnerName: 'Movimiento Nacional Popular',
    partnerPartyId: 'MNP',
    type: 'tactical',
    terms: 'Apoyo táctico mutuo para frenar al oficialismo.',
    description: 'El MNP propone un pacto puntual: no presentarse en provincias clave donde el otro tiene chances reales. A cambio, hay que ceder narrativa anti-oficialismo.',
    availableAtStage: 'local',
    acceptOutcomes: [
      { kind: 'territory', region: 'NF', supportDelta: 8 },
      { kind: 'brand', field: 'ideologicalClarity', delta: -10 },
      { kind: 'brand', field: 'narrativeCoherence', delta: -6 },
      { kind: 'faction', factionId: 'radicals', loyaltyDelta: -15, ruptureRiskDelta: 10 },
    ],
    rejectOutcomes: [
      { kind: 'brand', field: 'ideologicalClarity', delta: 4 },
    ],
  },
  {
    id: 'pact_vc_legislative',
    partnerName: 'Vanguardia Cívica',
    partnerPartyId: 'VC',
    type: 'legislative',
    terms: 'Bloque legislativo común, programa moderado.',
    description: 'VC ofrece sumar sus diputados en la próxima legislatura a cambio de un programa económico moderado pactado.',
    availableAtStage: 'legislative',
    acceptOutcomes: [
      { kind: 'finance', mediaInfluenceDelta: 8, politicalCapitalDelta: 10 },
      { kind: 'brand', field: 'professionalism', delta: 10 },
      { kind: 'brand', field: 'movementMystique', delta: -8 },
      { kind: 'faction', factionId: 'business', loyaltyDelta: 8 },
      { kind: 'ideology', axis: 'economic', delta: 0.1 },
    ],
    rejectOutcomes: [
      { kind: 'brand', field: 'ideologicalClarity', delta: 5 },
    ],
  },
  {
    id: 'pact_fas_national',
    partnerName: 'Frente Andino Soberano',
    partnerPartyId: 'FAS',
    type: 'electoral',
    terms: 'Candidatura presidencial conjunta.',
    description: 'FAS propone unir fuerzas para la presidencial con un candidato compartido. Suman bases sociales y rural-norte, pero cuesta autonomía.',
    availableAtStage: 'national',
    acceptOutcomes: [
      { kind: 'territory', region: 'LO', supportDelta: 14 },
      { kind: 'territory', region: 'NF', supportDelta: 10 },
      { kind: 'finance', militantsDelta: 8 },
      { kind: 'brand', field: 'popularConnection', delta: 12 },
      { kind: 'brand', field: 'ideologicalClarity', delta: -6 },
      { kind: 'faction', factionId: 'business', loyaltyDelta: -10 },
    ],
    rejectOutcomes: [
      { kind: 'brand', field: 'ideologicalClarity', delta: 6 },
      { kind: 'memory', type: 'coalition_broken', description: 'Rechazaste la propuesta de coalición con FAS.', impact: -2, severity: 'low' },
    ],
  },
];
