/* =============================================================================
   PARTY — Aplicar outcomes de eventos
   Cada opción de un PartyEvent declara un array de PartyEventOutcome. Este
   módulo los aplica al PartyState en orden, devolviendo un nuevo estado.

   Mantenerlo declarativo es clave: la lógica de cada outcome vive una vez
   acá, los eventos solo declaran qué pasa, no cómo.
   ============================================================================= */

import { applyBrandDelta } from './brand';
import { patchCandidate } from './candidates';
import { formCoalition } from './coalitions';
import { patchFaction, computeInternalDiscipline } from './factions';
import { applyFinancePatch, registerDonor } from './finance';
import { shiftIdeology } from './ideology';
import { addMemory } from './memory';
import { createScandal } from './scandals';
import { patchRegion } from './territory';
import type { PartyEventOutcome, PartyState } from './types';

const clamp = (v: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, v));

export function applyOutcome(
  state: PartyState,
  outcome: PartyEventOutcome,
): PartyState {
  switch (outcome.kind) {
    case 'brand': {
      return { ...state, brand: applyBrandDelta(state.brand, outcome.field, outcome.delta) };
    }
    case 'faction': {
      const faction = state.factions[outcome.factionId];
      if (!faction) return state;
      const updated = patchFaction(faction, {
        powerDelta: outcome.powerDelta,
        loyaltyDelta: outcome.loyaltyDelta,
        disciplineDelta: outcome.disciplineDelta,
        ruptureRiskDelta: outcome.ruptureRiskDelta,
        resourcesDelta: outcome.resourcesDelta,
      });
      const nextFactions = { ...state.factions, [outcome.factionId]: updated };
      return {
        ...state,
        factions: nextFactions,
        internalDiscipline: computeInternalDiscipline(nextFactions),
      };
    }
    case 'finance': {
      return {
        ...state,
        finances: applyFinancePatch(state.finances, {
          moneyDelta: outcome.moneyDelta,
          militantsDelta: outcome.militantsDelta,
          volunteersDelta: outcome.volunteersDelta,
          politicalCapitalDelta: outcome.politicalCapitalDelta,
          mediaInfluenceDelta: outcome.mediaInfluenceDelta,
        }),
      };
    }
    case 'territory': {
      const region = state.territory[outcome.region];
      if (!region) return state;
      const updated = patchRegion(region, {
        supportDelta: outcome.supportDelta,
        machineryDelta: outcome.machineryDelta,
        officesDelta: outcome.officesDelta,
      });
      return { ...state, territory: { ...state.territory, [outcome.region]: updated } };
    }
    case 'ideology': {
      return { ...state, ideology: shiftIdeology(state.ideology, outcome.axis, outcome.delta) };
    }
    case 'memory': {
      return {
        ...state,
        memory: addMemory(state.memory, {
          type: outcome.type,
          cycle: state.currentCycleIndex,
          description: outcome.description,
          impact: outcome.impact,
          severity: outcome.severity,
          region: outcome.region,
          factionId: outcome.factionId,
          candidateId: outcome.candidateId,
          canRecur: outcome.canRecur,
        }),
      };
    }
    case 'scandal': {
      const scandal = createScandal({
        cycle: state.currentCycleIndex,
        type: outcome.scandalType,
        title: outcome.title,
        description: outcome.description,
        severity: outcome.severity,
        involvedFaction: outcome.factionId,
        affectedRegion: outcome.region,
      });
      return {
        ...state,
        scandals: [...state.scandals, scandal],
        brand: applyBrandDelta(
          applyBrandDelta(state.brand, 'publicTrust', -6),
          'perceivedCorruption',
          6,
        ),
      };
    }
    case 'donor': {
      return {
        ...state,
        finances: registerDonor(state.finances, {
          kind: outcome.donorKind,
          name: outcome.name,
          amount: outcome.amount,
          conditions: outcome.conditions,
        }),
      };
    }
    case 'coalition': {
      return {
        ...state,
        coalitions: formCoalition(state.coalitions, {
          partnerName: outcome.partnerName,
          partnerPartyId: outcome.partnerPartyId,
          type: outcome.coalitionType,
          terms: outcome.terms,
          forStage: outcome.forStage,
          cycle: state.currentCycleIndex,
        }),
      };
    }
    case 'candidate_threat': {
      const candidate = state.candidatePool[outcome.candidateId];
      if (!candidate) return state;
      const updated = patchCandidate(candidate, {
        loyaltyDelta: outcome.loyaltyDelta,
        ambitionDelta: outcome.ambitionDelta,
      });
      return { ...state, candidatePool: { ...state.candidatePool, [outcome.candidateId]: updated } };
    }
    case 'label': {
      let labels = state.labels;
      if (outcome.remove) labels = labels.filter((l) => l !== outcome.remove);
      if (outcome.add && !labels.includes(outcome.add)) labels = [...labels, outcome.add];
      return { ...state, labels };
    }
    case 'action_points': {
      return { ...state, actionPoints: Math.max(0, state.actionPoints + outcome.delta) };
    }
  }
}

export function applyOutcomes(
  state: PartyState,
  outcomes: readonly PartyEventOutcome[],
): PartyState {
  return outcomes.reduce<PartyState>((s, o) => applyOutcome(s, o), state);
}

// Helper interno usado por algunos módulos.
export function clamp100(v: number): number {
  return clamp(v);
}
