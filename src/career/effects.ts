/* =============================================================================
   CAREER — Aplicar outcomes de eventos
   Cada opción de un CareerEvent declara un array de CareerEventOutcome. Este
   módulo los aplica al CareerState en orden, devolviendo un nuevo estado.

   Mantenerlo declarativo es clave: la lógica de cada outcome vive acá una vez,
   los eventos solo declaran qué pasa, no cómo.
   ============================================================================= */

import { addMemory } from './memory';
import { patchNpc } from './relationships';
import { applyDelta, setLabel } from './reputation';
import type {
  CareerEventOutcome,
  CareerState,
  Promise as CareerPromise,
  Scandal,
} from './types';

let promiseCounter = 0;
let scandalCounter = 0;
function nextPromiseId(): string {
  promiseCounter += 1;
  return `prom_${Date.now().toString(36)}_${promiseCounter}`;
}
function nextScandalId(): string {
  scandalCounter += 1;
  return `scan_${Date.now().toString(36)}_${scandalCounter}`;
}

export function applyOutcome(
  state: CareerState,
  outcome: CareerEventOutcome,
): CareerState {
  switch (outcome.kind) {
    case 'reputation': {
      return { ...state, reputation: applyDelta(state.reputation, outcome.field, outcome.delta) };
    }
    case 'relation': {
      const npc = state.npcs[outcome.npcId];
      if (!npc) return state;
      const updated = patchNpc(npc, {
        trustDelta: outcome.trustDelta,
        loyaltyDelta: outcome.loyaltyDelta,
        fearDelta: outcome.fearDelta,
      });
      return { ...state, npcs: { ...state.npcs, [outcome.npcId]: updated } };
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
          characterId: outcome.characterId,
        }),
      };
    }
    case 'promise': {
      const promise: CareerPromise = {
        id: nextPromiseId(),
        cycle: state.currentCycleIndex,
        description: outcome.description,
        region: outcome.region,
        topic: outcome.topic,
        costToKeep: outcome.costToKeep,
        costToBreak: outcome.costToBreak,
        status: 'open',
      };
      return { ...state, promises: [...state.promises, promise] };
    }
    case 'scandal': {
      const scandal: Scandal = {
        id: nextScandalId(),
        cycle: state.currentCycleIndex,
        title: outcome.title,
        description: outcome.description,
        severity: outcome.severity,
        status: 'active',
      };
      return {
        ...state,
        scandals: [...state.scandals, scandal],
        // Escándalo activo penaliza honestidad de inmediato.
        reputation: applyDelta(
          applyDelta(state.reputation, 'honesty', -6),
          'publicTrust',
          -4,
        ),
      };
    }
    case 'party': {
      const party = state.party;
      return {
        ...state,
        party: {
          ...party,
          internalSupport: Math.max(0, Math.min(100, party.internalSupport + (outcome.internalSupportDelta ?? 0))),
          ruptureRisk: Math.max(0, Math.min(100, party.ruptureRisk + (outcome.ruptureRiskDelta ?? 0))),
          discipline: Math.max(0, Math.min(100, party.discipline + (outcome.disciplineDelta ?? 0))),
        },
      };
    }
    case 'add_ally': {
      if (state.allies.includes(outcome.npcId)) return state;
      return {
        ...state,
        allies: [...state.allies, outcome.npcId],
        rivals: state.rivals.filter((id) => id !== outcome.npcId),
      };
    }
    case 'add_rival': {
      if (state.rivals.includes(outcome.npcId)) return state;
      return {
        ...state,
        rivals: [...state.rivals, outcome.npcId],
        allies: state.allies.filter((id) => id !== outcome.npcId),
      };
    }
    case 'label': {
      return { ...state, reputation: setLabel(state.reputation, { add: outcome.add, remove: outcome.remove }) };
    }
    case 'action_points': {
      return { ...state, actionPoints: Math.max(0, state.actionPoints + outcome.delta) };
    }
  }
}

/** Aplica un array de outcomes en orden. */
export function applyOutcomes(
  state: CareerState,
  outcomes: readonly CareerEventOutcome[],
): CareerState {
  return outcomes.reduce<CareerState>((s, o) => applyOutcome(s, o), state);
}

export function _resetEffectsCountersForTests(): void {
  promiseCounter = 0;
  scandalCounter = 0;
}
