/* =============================================================================
   PARTY · CONTENT — 3 elecciones encadenadas del Party Mode
   ============================================================================= */

import type { PartyElectionScenario } from '../types';

export const PARTY_ELECTIONS: readonly PartyElectionScenario[] = [
  {
    id: 'party_local',
    stage: 'local',
    title: 'Elecciones Locales · Alcaldías y Concejos',
    seats: 12, // intendencias en disputa
    winThreshold: 18, // % nacional como referencia
    brandReward: 8,
  },
  {
    id: 'party_legislative',
    stage: 'legislative',
    title: 'Elecciones Legislativas · Bancadas',
    seats: 28,
    winThreshold: 24,
    brandReward: 14,
  },
  {
    id: 'party_national',
    stage: 'national',
    title: 'Elecciones Generales · Presidencia y Congreso',
    seats: 35,
    winThreshold: 32,
    brandReward: 30,
  },
];
