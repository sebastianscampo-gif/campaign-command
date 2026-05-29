/* =============================================================================
   PARTY — Barrel export del módulo
   ============================================================================= */

export * from './types';
export {
  usePartyStore,
  totalPartyCycles,
  currentPartyScenario,
  PARTY_ACTIONS,
} from './partyStore';
export { PARTY_TYPES, PARTY_TYPE_ORDER } from './content/partyTypes';
export type { PartyTypeDefinition } from './content/partyTypes';
export { FACTION_TEMPLATES, seedFactions } from './content/factions';
export type { FactionTemplate } from './content/factions';
export { SEED_CANDIDATES, seedCandidatePool } from './content/candidates';
export { PARTY_ELECTIONS } from './content/elections';
export { COALITION_OFFERS } from './content/coalitions';
export type { CoalitionOffer } from './content/coalitions';
export { DONOR_OFFERS } from './content/donors';
export type { DonorTemplate } from './content/donors';
export { PARTY_EVENTS } from './content/events';
export { PARTY_ACTION_DECK } from './content/actions';
export { buildPartyState } from './setup';
export type { PartySetupChoices } from './setup';
export { activeCoalitions, coalitionShareBonus, formCoalition } from './coalitions';
export { computePartyLegacy } from './legacy';
export type { PartyLegacySummary } from './legacy';
export { PARTY_LEGACY_LABELS } from './content/narrative';
