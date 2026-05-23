/* =============================================================================
   PARTY — Setup: armado inicial del partido
   El jugador elige tipo de partido, ideología, identidad y estrategia. Esta
   función ensambla un PartyState inicial: marca base modificada por el tipo,
   facciones activas, finanzas, territorio inicial, candidatos disponibles.
   ============================================================================= */

import { PROVINCE_IDS } from '@/content';
import type { ProvinceId } from '@/content';
import { PARTY_TYPES } from './content/partyTypes';
import { FACTION_TEMPLATES } from './content/factions';
import { seedCandidatePool } from './content/candidates';
import { PARTY_ELECTIONS } from './content/elections';
import { PARTY_EVENTS } from './content/events';
import type {
  Faction,
  FactionKind,
  GrowthStrategy,
  Ideology,
  LeadershipStyle,
  PartyBrand,
  PartyCycle,
  PartyProfile,
  PartyState,
  PartyTypeId,
  RegionalPresence,
} from './types';

export interface PartySetupChoices {
  readonly name: string;
  readonly sigla: string;
  readonly color: string;
  readonly slogan: string;
  readonly type: PartyTypeId;
  readonly originRegion: ProvinceId;
  readonly leadershipStyle: LeadershipStyle;
  readonly growthStrategy: GrowthStrategy;
  readonly ideology: Ideology;
}

/** Marca base — promedios moderados antes de aplicar el tipo. */
const BASE_BRAND: PartyBrand = {
  ideologicalClarity: 50,
  publicTrust: 45,
  modernity: 50,
  internalOrder: 55,
  popularConnection: 45,
  technicalCompetence: 50,
  territorialStrength: 35,
  perceivedCorruption: 25,
  polarization: 35,
  movementMystique: 35,
  professionalism: 50,
  narrativeCoherence: 50,
};

const clamp = (v: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, v));

function composeBrand(typeId: PartyTypeId): PartyBrand {
  const mods = PARTY_TYPES[typeId].brandModifiers;
  const out: PartyBrand = { ...BASE_BRAND };
  for (const key of Object.keys(mods) as (keyof PartyBrand)[]) {
    const mod = mods[key] ?? 0;
    out[key] = clamp(BASE_BRAND[key] + mod);
  }
  return out;
}

/** Construye las facciones activas con los campos mutables seteados. */
function buildFactions(activeKinds: readonly FactionKind[]): Record<FactionKind, Faction> {
  const out = {} as Record<FactionKind, Faction>;
  for (const kind of activeKinds) {
    const tpl = FACTION_TEMPLATES[kind];
    out[kind] = {
      id: tpl.id,
      name: tpl.name,
      leader: tpl.leader,
      leaning: tpl.leaning,
      power: tpl.power,
      loyalty: tpl.loyalty,
      discipline: tpl.discipline,
      ambition: tpl.ambition,
      resources: tpl.resources,
      ruptureRisk: 0,
      regions: tpl.regions,
      mediaInfluence: tpl.mediaInfluence,
      currentDemand: null,
      history: [],
    };
  }
  return out;
}

/** Crea presencia inicial por provincia. La región de origen arranca más fuerte. */
function buildTerritory(
  originRegion: ProvinceId,
  growthStrategy: GrowthStrategy,
  typeId: PartyTypeId,
): Record<ProvinceId, RegionalPresence> {
  const out = {} as Record<ProvinceId, RegionalPresence>;
  const isRegional = typeId === 'regional';
  const isTraditional = typeId === 'traditional';
  for (const id of PROVINCE_IDS) {
    const isOrigin = id === originRegion;
    const baseSupport = isOrigin ? (isRegional ? 35 : 22) : isRegional ? 6 : 12;
    const baseMachinery = isOrigin ? (isTraditional ? 50 : 30) : isTraditional ? 18 : 8;
    const baseMilitants = isOrigin ? 30 : 10;
    const offices = isOrigin ? 2 : 0;

    const strategyBoost =
      growthStrategy === 'territorial'
        ? 4
        : growthStrategy === 'militant'
          ? 2
          : 0;

    out[id] = {
      support: clamp(baseSupport + strategyBoost),
      militantBase: clamp(baseMilitants),
      offices,
      hasLeader: isOrigin,
      dominantFaction: null,
      machinery: clamp(baseMachinery + strategyBoost),
      activeVolunteers: clamp(baseMilitants / 2),
      localMedia: isOrigin ? 30 : 10,
      campaignCost: isOrigin ? 1.5 : 1.0,
      growthPotential: isOrigin ? 70 : 50,
    };
  }
  return out;
}

function buildCycles(): PartyCycle[] {
  return PARTY_ELECTIONS.map((e, i) => ({
    number: i + 1,
    scenarioId: e.id,
    stage: e.stage,
    status: i === 0 ? 'precampaign' : 'setup',
    result: 'pending',
  }));
}

function pendingEventsForCycle(cycleIndex: number): string[] {
  const scenario = PARTY_ELECTIONS[cycleIndex];
  if (!scenario) return [];
  // Tomamos los primeros 2 eventos elegibles del tipo cycle_start.
  return PARTY_EVENTS.filter(
    (e) => e.trigger === 'cycle_start' || e.trigger === 'always',
  )
    .slice(0, 2)
    .map((e) => e.id);
}

function initialGoalsForCycle(cycleIndex: number): string[] {
  const scenario = PARTY_ELECTIONS[cycleIndex];
  if (!scenario) return [];
  switch (scenario.stage) {
    case 'local':
      return [
        'Ganar al menos 3 intendencias y mostrar maquinaria.',
        'Activar 2 sedes regionales fuera de tu región de origen.',
      ];
    case 'legislative':
      return [
        `Superar el ${scenario.winThreshold}% nacional.`,
        'Mantener la unidad interna durante la campaña.',
        'Cerrar al menos una alianza estratégica.',
      ];
    case 'national':
      return [
        'Disputar la presidencial.',
        'Sostener la marca sin escándalos abiertos.',
        'Cerrar el ciclo con maquinaria intacta.',
      ];
  }
}

function profileFromChoices(choices: PartySetupChoices): PartyProfile {
  return {
    name: choices.name,
    sigla: choices.sigla,
    color: choices.color,
    slogan: choices.slogan,
    type: choices.type,
    originRegion: choices.originRegion,
    leadershipStyle: choices.leadershipStyle,
    growthStrategy: choices.growthStrategy,
  };
}

export function buildPartyState(choices: PartySetupChoices): PartyState {
  const typeDef = PARTY_TYPES[choices.type];
  const brand = composeBrand(choices.type);
  const factions = buildFactions(typeDef.initialFactions);
  const territory = buildTerritory(choices.originRegion, choices.growthStrategy, choices.type);
  const cycles = buildCycles();

  return {
    status: 'precampaign',
    profile: profileFromChoices(choices),
    ideology: choices.ideology,
    brand,
    factions,
    candidatePool: seedCandidatePool(),
    finances: {
      money: typeDef.startingMoney,
      militants: typeDef.startingMilitants,
      volunteers: Math.round(typeDef.startingMilitants * 0.6),
      politicalCapital: typeDef.startingPoliticalCapital,
      mediaInfluence: 30,
      donors: [],
    },
    territory,
    coalitions: [],
    scandals: [],
    internalDiscipline: 60,
    labels: [typeDef.initialLabel],
    cycles,
    currentCycleIndex: 0,
    actionPoints: 8,
    completedElections: [],
    activePartyEvent: null,
    pendingEventIds: pendingEventsForCycle(0),
    firedEventIds: [],
    memory: [],
    goals: initialGoalsForCycle(0),
    legacyScore: 0,
    legacyLabel: null,
    recentNarratives: [],
  };
}

export { pendingEventsForCycle, initialGoalsForCycle };
