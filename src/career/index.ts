/* =============================================================================
   CAREER — Barrel export del módulo
   ============================================================================= */

export * from './types';
export { useCareerStore, totalCycles, currentOfficeDef, currentElectionScenario, CAREER_ACTIONS } from './careerStore';
export type { CareerStartOptions } from './careerStore';
export { ARCHETYPES, ARCHETYPE_ORDER, BASE_STATS } from './content/archetypes';
export type { Archetype } from './content/archetypes';
export { OFFICES, STAGE_ORDER } from './content/offices';
export { CAREER_ELECTIONS } from './content/elections';
export { CAREER_EVENTS } from './content/events';
export { CAREER_ACTION_DECK } from './content/actions';
export { SEED_NPCS } from './content/characters';
export { buildPolitician } from './setup';
export type { SetupChoices } from './setup';
export { computeLegacy } from './legacy';
export type { LegacySummary } from './legacy';
