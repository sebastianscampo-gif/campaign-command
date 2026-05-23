/* =============================================================================
   PARTY — Legado
   Al cerrar la partida, calcula un score numérico + asigna una etiqueta de
   archetype. Las etiquetas son textos curados que matchean el perfil del
   partido construido.
   ============================================================================= */

import { PARTY_LEGACY_LABELS } from './content/narrative';
import type {
  CompletedPartyElection,
  LegacyArchetype,
  PartyState,
} from './types';
import type { ProvinceId } from '@/content';

export interface PartyLegacySummary {
  readonly archetype: LegacyArchetype;
  readonly label: string;
  readonly description: string;
  readonly score: number;
  readonly highlights: readonly string[];
  readonly stats: PartyLegacyStats;
}

export interface PartyLegacyStats {
  readonly electionsWon: number;
  readonly electionsSplit: number;
  readonly electionsLost: number;
  readonly totalSeats: number;
  readonly provincesWonAtPeak: number;
  readonly factionsLost: number;
  readonly scandalsLived: number;
  readonly brandStrength: number;
  readonly polarization: number;
  readonly territorialStrength: number;
  readonly movementMystique: number;
  readonly ideologicalClarity: number;
  readonly publicTrust: number;
  readonly finalMoney: number;
}

function maxProvincesWon(elections: readonly CompletedPartyElection[]): number {
  return elections.reduce((m, e) => Math.max(m, e.provincesWon.length), 0);
}

function ruptureCount(state: PartyState): number {
  return Object.values(state.factions).filter((f) => f.ruptureRisk >= 80 || f.loyalty <= 10).length;
}

export function computePartyLegacy(state: PartyState): PartyLegacySummary {
  const won = state.completedElections.filter((e) => e.result === 'won').length;
  const split = state.completedElections.filter((e) => e.result === 'split').length;
  const lost = state.completedElections.filter((e) => e.result === 'lost').length;
  const totalSeats = state.completedElections.reduce((s, e) => s + e.seatsWon, 0);

  const stats: PartyLegacyStats = {
    electionsWon: won,
    electionsSplit: split,
    electionsLost: lost,
    totalSeats,
    provincesWonAtPeak: maxProvincesWon(state.completedElections),
    factionsLost: ruptureCount(state),
    scandalsLived: state.scandals.length,
    brandStrength:
      (state.brand.ideologicalClarity +
        state.brand.publicTrust +
        state.brand.internalOrder +
        state.brand.popularConnection +
        state.brand.professionalism) /
      5,
    polarization: state.brand.polarization,
    territorialStrength: state.brand.territorialStrength,
    movementMystique: state.brand.movementMystique,
    ideologicalClarity: state.brand.ideologicalClarity,
    publicTrust: state.brand.publicTrust,
    finalMoney: state.finances.money,
  };

  const electionScore = won * 25 + split * 10 - lost * 12;
  const brandScore = stats.brandStrength * 0.6 - stats.polarization * 0.1;
  const seatsScore = totalSeats * 0.4;
  const territoryScore = stats.territorialStrength * 0.4;
  const ruptureScore = -stats.factionsLost * 15;
  const scandalScore = -stats.scandalsLived * 5;

  const score = Math.round(
    electionScore + brandScore + seatsScore + territoryScore + ruptureScore + scandalScore,
  );

  const { archetype, label, description } = pickArchetype(state, stats);
  const highlights = composeHighlights(state, stats);

  return { archetype, label, description, score, highlights, stats };
}

function pickArchetype(
  state: PartyState,
  stats: PartyLegacyStats,
): { archetype: LegacyArchetype; label: string; description: string } {
  const matched = PARTY_LEGACY_LABELS
    .map((rule) => ({ rule, matches: matchRule(rule.archetype, state, stats) }))
    .filter((m) => m.matches)
    .sort((a, b) => b.rule.priority - a.rule.priority);

  const first = matched[0];
  if (!first) {
    const fallback = PARTY_LEGACY_LABELS[PARTY_LEGACY_LABELS.length - 1];
    return {
      archetype: fallback?.archetype ?? 'forgotten',
      label: fallback?.label ?? 'Partido olvidado',
      description: fallback?.description ?? 'Sin huella.',
    };
  }
  return { archetype: first.rule.archetype, label: first.rule.label, description: first.rule.description };
}

function matchRule(
  archetype: LegacyArchetype,
  state: PartyState,
  stats: PartyLegacyStats,
): boolean {
  switch (archetype) {
    case 'electoral_dominance':
      return stats.electionsWon >= 3;
    case 'historic_movement':
      return stats.movementMystique >= 65 && stats.electionsWon >= 2 && stats.territorialStrength >= 50;
    case 'pure_ideological':
      return stats.ideologicalClarity >= 75 && stats.polarization >= 55 && stats.electionsWon <= 1;
    case 'national_coalition':
      return state.coalitions.filter((c) => c.status !== 'broken').length >= 2 && stats.electionsWon >= 2;
    case 'territorial_machine':
      return stats.territorialStrength >= 70 && stats.provincesWonAtPeak >= 5;
    case 'democratic_revolution':
      return stats.publicTrust >= 65 && stats.movementMystique >= 55 && stats.scandalsLived === 0;
    case 'eternal_party':
      return stats.factionsLost === 0 && stats.scandalsLived <= 1 && stats.electionsWon >= 2;
    case 'presidential_party': {
      const lastElection = state.completedElections[state.completedElections.length - 1];
      return lastElection?.scenarioId === 'party_national' && lastElection.result === 'won';
    }
    case 'regional_dominant':
      return stats.territorialStrength >= 55 && stats.electionsWon <= 1;
    case 'system_breaker':
      return stats.polarization >= 65 && (stats.scandalsLived >= 1 || stats.factionsLost >= 1);
    case 'forgotten':
      return true;
  }
}

function composeHighlights(state: PartyState, stats: PartyLegacyStats): string[] {
  const out: string[] = [];
  out.push(`${state.profile.sigla} jugó ${state.completedElections.length} elecciones encadenadas.`);
  out.push(
    `Balance: ${stats.electionsWon} victorias · ${stats.electionsSplit} resultados parciales · ${stats.electionsLost} derrotas.`,
  );
  if (stats.totalSeats > 0) {
    out.push(`Sumó un total de ${stats.totalSeats} posiciones electas.`);
  }
  if (stats.factionsLost > 0) {
    out.push(`Perdió ${stats.factionsLost} facción${stats.factionsLost === 1 ? '' : 'es'} por ruptura.`);
  }
  if (stats.scandalsLived > 0) {
    out.push(`Sobrevivió ${stats.scandalsLived} escándalo${stats.scandalsLived === 1 ? '' : 's'}.`);
  }
  const supporters = supportingProvinces(state);
  if (supporters.length > 0) {
    out.push(`Bastión territorial: ${supporters.join(' · ')}.`);
  }
  if (state.labels.length > 0) {
    out.push(`Etiquetas activas: ${state.labels.join(' · ')}.`);
  }
  return out;
}

function supportingProvinces(state: PartyState): ProvinceId[] {
  return (Object.entries(state.territory) as [ProvinceId, typeof state.territory[ProvinceId]][])
    .filter(([, t]) => t.support >= 40)
    .map(([id]) => id);
}
