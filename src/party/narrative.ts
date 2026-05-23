/* =============================================================================
   PARTY — Narrativa (selección dinámica de plantillas)
   Compone titulares y resúmenes a partir del estado. Texto curado, sin IA.
   ============================================================================= */

import {
  PARTY_CYCLE_NARRATIVES,
  PARTY_ELECTION_TEMPLATES,
} from './content/narrative';
import { factionsAtRuptureThreshold } from './factions';
import { activeScandals } from './scandals';
import { nationalSupportAvg } from './territory';
import type { CompletedPartyElection, PartyState } from './types';

function fill(tpl: string, vars: Record<string, string | number>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''));
}

export function electionHeadline(
  state: PartyState,
  result: CompletedPartyElection,
  stage: 'local' | 'legislative' | 'national',
): string {
  const key = `${stage}_${result.result}`;
  const tpl = PARTY_ELECTION_TEMPLATES.find((t) => t.id === key);
  if (!tpl) {
    return `${state.profile.sigla}: ${result.result.toUpperCase()} con ${result.nationalShare.toFixed(1)}%.`;
  }
  return fill(tpl.text, {
    sigla: state.profile.sigla,
    name: state.profile.name,
    seats: result.seatsWon,
    share: result.nationalShare.toFixed(1),
  });
}

export function cycleNarratives(state: PartyState): string[] {
  const out: string[] = [];

  const ruptured = factionsAtRuptureThreshold(state.factions);
  if (ruptured.length > 0) {
    const tpl = PARTY_CYCLE_NARRATIVES.find((t) => t.id === 'faction_rupture_risk');
    if (tpl) out.push(tpl.text);
  }

  if (nationalSupportAvg(state.territory) >= 35) {
    const tpl = PARTY_CYCLE_NARRATIVES.find((t) => t.id === 'territorial_growth');
    if (tpl) out.push(tpl.text);
  }

  if (state.brand.movementMystique < 30 && state.brand.professionalism > 60) {
    const tpl = PARTY_CYCLE_NARRATIVES.find((t) => t.id === 'movement_loses_air');
    if (tpl) out.push(tpl.text);
  }

  if (state.brand.ideologicalClarity < 35) {
    const tpl = PARTY_CYCLE_NARRATIVES.find((t) => t.id === 'ideology_diluted');
    if (tpl) out.push(tpl.text);
  } else if (state.brand.ideologicalClarity > 70) {
    const tpl = PARTY_CYCLE_NARRATIVES.find((t) => t.id === 'ideology_consolidated');
    if (tpl) out.push(tpl.text);
  }

  if (activeScandals(state.scandals).length >= 1) {
    const tpl = PARTY_CYCLE_NARRATIVES.find((t) => t.id === 'scandal_lingers');
    if (tpl) out.push(tpl.text);
  }

  if (
    state.coalitions.some((c) => c.status === 'broken') &&
    !state.coalitions.some((c) => c.status === 'active')
  ) {
    const tpl = PARTY_CYCLE_NARRATIVES.find((t) => t.id === 'coalition_burns');
    if (tpl) out.push(tpl.text);
  }

  // Donor dependence
  if (
    state.finances.donors.some((d) => d.kind === 'corporate' && d.active) &&
    state.brand.popularConnection < 45
  ) {
    const tpl = PARTY_CYCLE_NARRATIVES.find((t) => t.id === 'donor_dependence');
    if (tpl) out.push(tpl.text);
  }

  return out.slice(0, 3);
}
