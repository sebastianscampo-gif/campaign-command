/* =============================================================================
   PARTY — Store (Zustand)
   Orquesta el modo partido. Las acciones del store son thin: delegan a las
   funciones puras de cada módulo y aplican el resultado.

   Persistencia: localStorage con versionado. Si el schema cambia, el save
   viejo se descarta.
   ============================================================================= */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { applyPartyAction, PARTY_ACTIONS } from './actions';
import { applyBrandDelta, decayBrand } from './brand';
import { applyOutcomes } from './effects';
import {
  brandRewardFor,
  getPartyScenario,
  resolvePartyElection,
} from './elections';
import { ageFactions, computeInternalDiscipline } from './factions';
import { pickNextEvent } from './events';
import { computePartyLegacy } from './legacy';
import { addMemory, ageMemoriesOneCycle } from './memory';
import { cycleNarratives, electionHeadline } from './narrative';
import { ageScandalsOneCycle } from './scandals';
import {
  buildPartyState,
  initialGoalsForCycle,
  pendingEventsForCycle,
  type PartySetupChoices,
} from './setup';
import type {
  CompletedPartyElection,
  FactionKind,
  PartyActionKind,
  PartyState,
} from './types';
import type { ProvinceId } from '@/content';

const PERSIST_KEY = 'campaign-command/party/v1';
const PARTY_VERSION = 1;

const ACTION_POINTS_PER_CYCLE = 8;

interface PartyActions {
  startParty: (choices: PartySetupChoices) => void;
  triggerNextEvent: () => void;
  resolveActiveEvent: (optionId: string) => void;
  dismissActiveEvent: () => void;
  spendActionPoint: (
    kind: PartyActionKind,
    options?: { region?: ProvinceId; candidateId?: string; factionId?: FactionKind },
  ) => boolean;
  proceedToElection: () => void;
  proceedToNextCycle: () => void;
  endParty: () => void;
  resetParty: () => void;
}

interface PartyStoreShape {
  state: PartyState | null;
}

type PartyStore = PartyStoreShape & PartyActions;

export const usePartyStore = create<PartyStore>()(
  persist(
    (set, get) => ({
      state: null,

      startParty: (choices) => set({ state: buildPartyState(choices) }),

      triggerNextEvent: () => {
        const current = get().state;
        if (!current || current.activePartyEvent) return;
        const evt = pickNextEvent(current, { trigger: 'cycle_start' });
        if (!evt) return;
        set({ state: { ...current, activePartyEvent: evt } });
      },

      resolveActiveEvent: (optionId) => {
        const current = get().state;
        if (!current || !current.activePartyEvent) return;
        const event = current.activePartyEvent;
        const option = event.options.find((o) => o.id === optionId);
        if (!option) return;
        let next = applyOutcomes(current, option.outcomes);
        next = {
          ...next,
          activePartyEvent: null,
          firedEventIds: event.oneShot ? [...next.firedEventIds, event.id] : next.firedEventIds,
          pendingEventIds: next.pendingEventIds.filter((id) => id !== event.id),
          internalDiscipline: computeInternalDiscipline(next.factions),
        };
        set({ state: next });
      },

      dismissActiveEvent: () => {
        const current = get().state;
        if (!current || !current.activePartyEvent) return;
        const event = current.activePartyEvent;
        set({
          state: {
            ...current,
            activePartyEvent: null,
            firedEventIds: event.oneShot ? [...current.firedEventIds, event.id] : current.firedEventIds,
            pendingEventIds: current.pendingEventIds.filter((id) => id !== event.id),
          },
        });
      },

      spendActionPoint: (kind, options) => {
        const current = get().state;
        if (!current || current.status !== 'precampaign') return false;
        const result = applyPartyAction(current, {
          kind,
          targetRegion: options?.region,
          targetCandidateId: options?.candidateId,
          targetFactionId: options?.factionId,
        });
        if (!result.ok) return false;
        set({ state: result.state });
        return true;
      },

      proceedToElection: () => {
        const current = get().state;
        if (!current) return;
        const scenarioId = current.cycles[current.currentCycleIndex]?.scenarioId;
        if (!scenarioId) return;
        const scenario = getPartyScenario(scenarioId);
        if (!scenario) return;

        const result: CompletedPartyElection = resolvePartyElection(current, scenario);
        const headline = electionHeadline(current, result, scenario.stage);
        const brandDelta = brandRewardFor(result.result, scenario);

        let next: PartyState = {
          ...current,
          completedElections: [...current.completedElections, result],
          status: 'aftermath',
          brand: applyBrandDelta(current.brand, 'publicTrust', brandDelta),
          recentNarratives: [headline, ...cycleNarratives(current)],
        };

        const memoryType =
          result.result === 'won'
            ? 'election_won'
            : result.result === 'split'
              ? 'election_won'
              : 'election_lost';
        const impact =
          result.result === 'won' ? 8 : result.result === 'split' ? 3 : -6;
        next = {
          ...next,
          memory: addMemory(next.memory, {
            type: memoryType,
            cycle: next.currentCycleIndex,
            description: `${scenario.title}: ${result.nationalShare.toFixed(1)}%.`,
            impact,
            severity: result.result === 'lost' ? 'high' : 'medium',
          }),
        };

        const updatedCycles = next.cycles.map((c, i) =>
          i === next.currentCycleIndex
            ? { ...c, status: 'aftermath' as const, result: result.result }
            : c,
        );

        set({ state: { ...next, cycles: updatedCycles } });
      },

      proceedToNextCycle: () => {
        const current = get().state;
        if (!current) return;
        const isLast = current.currentCycleIndex >= current.cycles.length - 1;
        if (isLast) {
          get().endParty();
          return;
        }

        const nextIndex = current.currentCycleIndex + 1;
        const memoryAged = ageMemoriesOneCycle(current.memory);
        const scandalsAged = ageScandalsOneCycle(current.scandals);
        const factionsAged = ageFactions(current.factions);
        const brandDecayed = decayBrand(current.brand);

        set({
          state: {
            ...current,
            currentCycleIndex: nextIndex,
            status: 'precampaign',
            actionPoints: ACTION_POINTS_PER_CYCLE,
            memory: memoryAged,
            scandals: scandalsAged,
            factions: factionsAged,
            brand: brandDecayed,
            internalDiscipline: computeInternalDiscipline(factionsAged),
            pendingEventIds: pendingEventsForCycle(nextIndex),
            goals: initialGoalsForCycle(nextIndex),
            recentNarratives: [],
            cycles: current.cycles.map((c, i) =>
              i === nextIndex ? { ...c, status: 'precampaign' as const } : c,
            ),
          },
        });
      },

      endParty: () => {
        const current = get().state;
        if (!current) return;
        const summary = computePartyLegacy(current);
        set({
          state: {
            ...current,
            status: 'legacy',
            legacyScore: summary.score,
            legacyLabel: summary.label,
          },
        });
      },

      resetParty: () => set({ state: null }),
    }),
    {
      name: PERSIST_KEY,
      version: PARTY_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ state: s.state }),
      migrate: (persisted, version) => {
        if (version !== PARTY_VERSION) return { state: null } as PartyStoreShape;
        return persisted as PartyStoreShape;
      },
    },
  ),
);

/* ---- Selectores ----------------------------------------------------------- */

export function totalPartyCycles(): number {
  return 3;
}

export function currentPartyScenario(state: PartyState) {
  const id = state.cycles[state.currentCycleIndex]?.scenarioId;
  return id ? getPartyScenario(id) : undefined;
}

export { PARTY_ACTIONS };
