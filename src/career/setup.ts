/* =============================================================================
   CAREER — Setup: ensamblar el político inicial
   Toma las elecciones del flujo de creación y devuelve un PlayerPolitician con
   sus stats compuestos (base + arquetipo, acotados a 0..100).
   ============================================================================= */

import { ARCHETYPES, BASE_STATS } from './content/archetypes';
import type {
  ArchetypeId,
  LeadershipStyle,
  MotivationId,
  PlayerPolitician,
  PoliticianStats,
  SocialBackground,
} from './types';
import type { ProvinceId } from '@/content';

export interface SetupChoices {
  readonly name: string;
  readonly age: number;
  readonly originRegion: ProvinceId;
  readonly socialBackground: SocialBackground;
  readonly ideology: {
    readonly economic: number;
    readonly social: number;
    readonly authority: number;
  };
  readonly leadershipStyle: LeadershipStyle;
  readonly motivation: MotivationId;
  readonly strength: string;
  readonly weakness: string;
  readonly archetype: ArchetypeId;
}

const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v));

function composeStats(archetype: ArchetypeId): PoliticianStats {
  const mod = ARCHETYPES[archetype].statModifiers;
  const out: PoliticianStats = {
    charisma: clamp(BASE_STATS.charisma + mod.charisma, 0, 100),
    strategy: clamp(BASE_STATS.strategy + mod.strategy, 0, 100),
    perceivedHonesty: clamp(BASE_STATS.perceivedHonesty + mod.perceivedHonesty, 0, 100),
    mediaSkill: clamp(BASE_STATS.mediaSkill + mod.mediaSkill, 0, 100),
    negotiation: clamp(BASE_STATS.negotiation + mod.negotiation, 0, 100),
    groundGame: clamp(BASE_STATS.groundGame + mod.groundGame, 0, 100),
    popularConnection: clamp(BASE_STATS.popularConnection + mod.popularConnection, 0, 100),
    technicalCompetence: clamp(BASE_STATS.technicalCompetence + mod.technicalCompetence, 0, 100),
    radicalism: clamp(BASE_STATS.radicalism + mod.radicalism, 0, 100),
    partyDiscipline: clamp(BASE_STATS.partyDiscipline + mod.partyDiscipline, 0, 100),
  };
  return out;
}

export function buildPolitician(choices: SetupChoices): PlayerPolitician {
  return {
    name: choices.name,
    age: choices.age,
    originRegion: choices.originRegion,
    socialBackground: choices.socialBackground,
    ideology: choices.ideology,
    leadershipStyle: choices.leadershipStyle,
    motivation: choices.motivation,
    strength: choices.strength,
    weakness: choices.weakness,
    archetype: choices.archetype,
    stats: composeStats(choices.archetype),
  };
}
