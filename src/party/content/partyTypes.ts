/* =============================================================================
   PARTY · CONTENT — Tipos de partido
   Cada tipo aplica modificadores sobre la marca inicial, las facciones
   activas, las finanzas y el territorio. Define la "rampa" inicial del juego.
   ============================================================================= */

import type { FactionKind, PartyBrand, PartyTypeId } from '../types';

export interface PartyTypeDefinition {
  readonly id: PartyTypeId;
  readonly name: string;
  readonly tagline: string;
  readonly strengths: readonly string[];
  readonly weaknesses: readonly string[];
  /** Facciones que arrancan activas en este tipo (4 max). */
  readonly initialFactions: readonly FactionKind[];
  /** Modificadores sobre la marca base. */
  readonly brandModifiers: Partial<PartyBrand>;
  /** Caja inicial en millones. */
  readonly startingMoney: number;
  /** Militantes (en miles). */
  readonly startingMilitants: number;
  /** Capital político (0..100). */
  readonly startingPoliticalCapital: number;
  /** Etiqueta narrativa inicial. */
  readonly initialLabel: string;
}

export const PARTY_TYPES: Record<PartyTypeId, PartyTypeDefinition> = {
  traditional: {
    id: 'traditional',
    name: 'Partido Tradicional',
    tagline: 'Maquinaria, donantes, herencia.',
    strengths: ['Estructura', 'Donantes', 'Maquinaria', 'Reconocimiento'],
    weaknesses: ['Facciones viejas', 'Corrupción histórica', 'Poca frescura'],
    initialFactions: ['old_guard', 'business', 'ground_ops', 'moderates'],
    brandModifiers: {
      territorialStrength: 18,
      professionalism: 12,
      modernity: -10,
      movementMystique: -15,
      perceivedCorruption: 15,
    },
    startingMoney: 8,
    startingMilitants: 12,
    startingPoliticalCapital: 60,
    initialLabel: 'El Aparato',
  },
  outsider: {
    id: 'outsider',
    name: 'Movimiento Outsider',
    tagline: 'Anti-sistema y viral.',
    strengths: ['Viralidad', 'Conexión emocional', 'Anti-sistema'],
    weaknesses: ['Poca estructura', 'Caos interno', 'Dependencia del líder'],
    initialFactions: ['youth', 'radicals', 'populists', 'ground_ops'],
    brandModifiers: {
      movementMystique: 22,
      modernity: 15,
      popularConnection: 12,
      polarization: 14,
      territorialStrength: -16,
      professionalism: -10,
    },
    startingMoney: 2,
    startingMilitants: 18,
    startingPoliticalCapital: 30,
    initialLabel: 'El Movimiento',
  },
  ideological: {
    id: 'ideological',
    name: 'Partido Ideológico',
    tagline: 'Identidad clara, base leal.',
    strengths: ['Base militante', 'Identidad', 'Disciplina narrativa'],
    weaknesses: ['Polariza', 'Costos para atraer moderados'],
    initialFactions: ['radicals', 'youth', 'union', 'ground_ops'],
    brandModifiers: {
      ideologicalClarity: 22,
      narrativeCoherence: 16,
      polarization: 14,
      popularConnection: 8,
      modernity: -4,
    },
    startingMoney: 3,
    startingMilitants: 22,
    startingPoliticalCapital: 35,
    initialLabel: 'La Causa',
  },
  coalition: {
    id: 'coalition',
    name: 'Coalición Electoral',
    tagline: 'Suma sectores, gana elecciones.',
    strengths: ['Amplio', 'Crecimiento rápido', 'Apoyos diversos'],
    weaknesses: ['Poca coherencia', 'Peleas internas'],
    initialFactions: ['moderates', 'technocrats', 'regionals', 'business'],
    brandModifiers: {
      ideologicalClarity: -12,
      narrativeCoherence: -8,
      modernity: 8,
      professionalism: 10,
      internalOrder: -8,
    },
    startingMoney: 6,
    startingMilitants: 8,
    startingPoliticalCapital: 45,
    initialLabel: 'La Coalición',
  },
  regional: {
    id: 'regional',
    name: 'Partido Regional',
    tagline: 'Dominio territorial concentrado.',
    strengths: ['Maquinaria concentrada', 'Identidad local', 'Base fiel'],
    weaknesses: ['Difícil expansión nacional', 'Dependencia de pocas regiones'],
    initialFactions: ['regionals', 'ground_ops', 'old_guard', 'union'],
    brandModifiers: {
      territorialStrength: 25,
      popularConnection: 14,
      modernity: -8,
      narrativeCoherence: 6,
    },
    startingMoney: 4,
    startingMilitants: 14,
    startingPoliticalCapital: 40,
    initialLabel: 'El Caudillaje',
  },
};

export const PARTY_TYPE_ORDER: readonly PartyTypeId[] = [
  'traditional',
  'outsider',
  'ideological',
  'coalition',
  'regional',
];
