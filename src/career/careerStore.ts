/* =============================================================================
   CAREER — Store (Zustand)
   Orquesta el modo carrera. Las acciones del store son thin: delegan a las
   funciones puras de cada módulo y aplican el resultado. La lógica vive en
   los módulos, no acá.

   Persistencia: localStorage con versionado. Si el schema cambia, el save
   viejo se descarta limpiamente vía `migrate`.
   ============================================================================= */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { applyCareerAction } from './actions';
import { CAREER_ACTIONS } from './content/actions';
import { CAREER_ELECTIONS } from './content/elections';
import { seedNpcs } from './content/characters';
import { CAREER_EVENTS } from './content/events';
import { applyOutcomes } from './effects';
import { pickNextEvent } from './events';
import { resolveElection, getElectionScenario } from './elections';
import { computeLegacy } from './legacy';
import { ageMemoriesOneCycle, addMemory } from './memory';
import { OFFICES } from './content/offices';
import { ARCHETYPES } from './content/archetypes';
import { electionHeadline, cycleNarratives } from './narrative';
import { officeAfterElection, stageOfOffice } from './progression';
import { decayReputation, initialReputation, setLabel } from './reputation';
import { buildPolitician, type SetupChoices } from './setup';
import type {
  CareerActionKind,
  CareerCycle,
  CareerState,
  CompletedElection,
  PartyMode,
} from './types';
import type { ProvinceId, PartyId } from '@/content';

const PERSIST_KEY = 'campaign-command/career/v1';
const CAREER_VERSION = 1;

/** Puntos de acción por ciclo de precampaña. */
const ACTION_POINTS_PER_CYCLE = 6;

export interface CareerStartOptions {
  readonly setup: SetupChoices;
  readonly partyMode: PartyMode;
  readonly partyId?: PartyId;
}

interface CareerActions {
  /** Inicializa una carrera nueva con el setup elegido. */
  startCareer: (options: CareerStartOptions) => void;
  /** Saca un evento de la cola y lo deja activo en el modal. */
  triggerNextEvent: () => void;
  /** El jugador elige una opción del evento activo. Aplica outcomes y cierra. */
  resolveActiveEvent: (optionId: string) => void;
  /** Cierra el evento sin elegir (POSPONER). */
  dismissActiveEvent: () => void;
  /** Aplica una acción de carrera durante precampaña. */
  spendActionPoint: (kind: CareerActionKind, options?: { region?: ProvinceId; npcId?: string }) => boolean;
  /** Avanza a la elección del ciclo actual. */
  proceedToElection: () => void;
  /** Avanza al siguiente ciclo (post-elección → precampaña siguiente). */
  proceedToNextCycle: () => void;
  /** Cierra la carrera y calcula legado. */
  endCareer: () => void;
  /** Vuelve a la pantalla de setup. */
  resetCareer: () => void;
}

interface CareerStoreShape {
  /** null → todavía no hay carrera en curso (mostrar setup). */
  state: CareerState | null;
}

type CareerStore = CareerStoreShape & CareerActions;

/* ---- Helpers internos ----------------------------------------------------- */

function buildInitialState(options: CareerStartOptions): CareerState {
  const player = buildPolitician(options.setup);
  const archetype = ARCHETYPES[player.archetype];
  const partyName =
    options.partyMode === 'inside_party'
      ? `${options.partyId ?? 'PRD'} · Estructura`
      : options.partyMode === 'independent'
        ? 'Candidatura independiente'
        : `Movimiento ${player.name.split(' ')[0]}`;

  const cycles: CareerCycle[] = CAREER_ELECTIONS.map((e, i) => ({
    number: i + 1,
    electionScenarioId: e.id,
    stage: e.stage,
    status: i === 0 ? 'precampaign' : 'setup',
    result: 'pending',
  }));

  const reputation = setLabel(initialReputation(player.stats), { add: archetype.initialLabel });

  return {
    status: 'precampaign',
    player,
    currentOffice: 'activist',
    currentStage: 'local',
    careerYear: 0,
    currentCycleIndex: 0,
    cycles,
    actionPoints: ACTION_POINTS_PER_CYCLE,
    party: {
      mode: options.partyMode,
      partyId: options.partyMode === 'inside_party' ? options.partyId ?? 'PRD' : null,
      partyName,
      internalSupport: options.partyMode === 'inside_party' ? 50 : 0,
      ruptureRisk: 0,
      discipline: options.partyMode === 'inside_party' ? 50 : 20,
    },
    reputation,
    npcs: seedNpcs(),
    memory: [],
    promises: [],
    scandals: [],
    allies: [],
    rivals: [],
    completedElections: [],
    activeCareerEvent: null,
    pendingEventIds: pendingEventsForCycle(0),
    firedEventIds: [],
    goals: initialGoalsForCycle(0),
    legacyScore: 0,
    legacyLabel: null,
    recentNarratives: [],
  };
}

function pendingEventsForCycle(cycleIndex: number): string[] {
  // Tomamos eventos cuyos stages incluyen la etapa del ciclo y trigger=cycle_start.
  const cycleStage = CAREER_ELECTIONS[cycleIndex]?.stage;
  if (!cycleStage) return [];
  return CAREER_EVENTS.filter(
    (e) =>
      (e.trigger === 'cycle_start' || e.trigger === 'always') &&
      e.stages.includes(cycleStage),
  )
    .slice(0, 2)
    .map((e) => e.id);
}

function initialGoalsForCycle(cycleIndex: number): string[] {
  const scenario = CAREER_ELECTIONS[cycleIndex];
  if (!scenario) return [];
  switch (scenario.stage) {
    case 'local':
      return [
        `Ganar la elección municipal en ${scenario.region ?? 'tu región'}.`,
        'Construir base territorial inicial.',
      ];
    case 'regional':
      return [
        'Consolidarse como figura regional.',
        'Sumar aliados con estructura territorial.',
      ];
    case 'national':
      return [
        'Convertirse en figura nacional reconocible.',
        'Definir alianzas para una eventual candidatura.',
      ];
    case 'presidential':
      return [
        'Llegar al palacio.',
        'Cerrar pendientes con regiones que recuerdan promesas.',
      ];
  }
}

/* ---- Store ---------------------------------------------------------------- */

export const useCareerStore = create<CareerStore>()(
  persist(
    (set, get) => ({
      state: null,

      startCareer: (options) => set({ state: buildInitialState(options) }),

      triggerNextEvent: () => {
        const current = get().state;
        if (!current || current.activeCareerEvent) return;
        const scenario = CAREER_ELECTIONS[current.currentCycleIndex];
        if (!scenario) return;
        const evt = pickNextEvent(current, { trigger: 'cycle_start', stage: scenario.stage });
        if (!evt) return;
        set({ state: { ...current, activeCareerEvent: evt } });
      },

      resolveActiveEvent: (optionId) => {
        const current = get().state;
        if (!current || !current.activeCareerEvent) return;
        const event = current.activeCareerEvent;
        const option = event.options.find((o) => o.id === optionId);
        if (!option) return;
        let next = applyOutcomes(current, option.outcomes);
        next = {
          ...next,
          activeCareerEvent: null,
          firedEventIds: event.oneShot ? [...next.firedEventIds, event.id] : next.firedEventIds,
          pendingEventIds: next.pendingEventIds.filter((id) => id !== event.id),
        };
        set({ state: next });
      },

      dismissActiveEvent: () => {
        const current = get().state;
        if (!current || !current.activeCareerEvent) return;
        // Posponer: lo dejamos disparado (no vuelve a aparecer en el ciclo) pero
        // sin elegir opción → no se aplican outcomes.
        const event = current.activeCareerEvent;
        set({
          state: {
            ...current,
            activeCareerEvent: null,
            firedEventIds: event.oneShot ? [...current.firedEventIds, event.id] : current.firedEventIds,
            pendingEventIds: current.pendingEventIds.filter((id) => id !== event.id),
          },
        });
      },

      spendActionPoint: (kind, options) => {
        const current = get().state;
        if (!current || current.status !== 'precampaign') return false;
        const result = applyCareerAction(current, {
          kind,
          targetRegion: options?.region,
          targetNpcId: options?.npcId,
        });
        if (!result.ok) return false;
        set({ state: result.state });
        return true;
      },

      proceedToElection: () => {
        const current = get().state;
        if (!current) return;
        const scenarioId = current.cycles[current.currentCycleIndex]?.electionScenarioId;
        if (!scenarioId) return;
        const scenario = getElectionScenario(scenarioId);
        if (!scenario) return;

        const result: CompletedElection = resolveElection(current, scenario);
        const newOffice = officeAfterElection(result, scenario.stage, current.currentOffice);
        const newStage = stageOfOffice(newOffice);

        const headline = electionHeadline(current, result, scenario.stage, scenario.opponentName);

        // Sumar fama por victoria.
        let next: CareerState = {
          ...current,
          completedElections: [...current.completedElections, result],
          currentOffice: newOffice,
          currentStage: newStage,
          status: 'aftermath',
          recentNarratives: [headline, ...cycleNarratives(current)],
        };
        if (result.result === 'won') {
          next = {
            ...next,
            reputation: {
              ...next.reputation,
              nationalFame: Math.min(100, next.reputation.nationalFame + scenario.fameReward),
            },
          };
          next = {
            ...next,
            memory: addMemory(next.memory, {
              type: 'election_won',
              cycle: next.currentCycleIndex,
              description: `Ganó: ${scenario.title}.`,
              impact: 6,
              severity: 'high',
            }),
          };
        } else {
          next = {
            ...next,
            memory: addMemory(next.memory, {
              type: 'election_lost',
              cycle: next.currentCycleIndex,
              description: `Perdió: ${scenario.title} (${result.result === 'lost_close' ? 'margen estrecho' : 'derrota amplia'}).`,
              impact: result.result === 'lost_close' ? -3 : -6,
              severity: result.result === 'lost_close' ? 'medium' : 'high',
            }),
          };
        }

        // Marcar el ciclo como completado.
        const updatedCycles = next.cycles.map((c, i) =>
          i === next.currentCycleIndex ? { ...c, status: 'aftermath' as const, result: result.result } : c,
        );

        set({ state: { ...next, cycles: updatedCycles } });
      },

      proceedToNextCycle: () => {
        const current = get().state;
        if (!current) return;
        const isLast = current.currentCycleIndex >= current.cycles.length - 1;
        if (isLast) {
          // Última elección jugada — pasar a legado.
          get().endCareer();
          return;
        }

        const nextIndex = current.currentCycleIndex + 1;
        const memoryAged = ageMemoriesOneCycle(current.memory);

        set({
          state: {
            ...current,
            currentCycleIndex: nextIndex,
            careerYear: current.careerYear + 4,
            status: 'precampaign',
            actionPoints: ACTION_POINTS_PER_CYCLE,
            memory: memoryAged,
            reputation: decayReputation(current.reputation),
            pendingEventIds: pendingEventsForCycle(nextIndex),
            goals: initialGoalsForCycle(nextIndex),
            recentNarratives: [],
            cycles: current.cycles.map((c, i) =>
              i === nextIndex ? { ...c, status: 'precampaign' as const } : c,
            ),
          },
        });
      },

      endCareer: () => {
        const current = get().state;
        if (!current) return;
        const summary = computeLegacy(current);
        set({
          state: {
            ...current,
            status: 'legacy',
            legacyScore: summary.score,
            legacyLabel: summary.label,
          },
        });
      },

      resetCareer: () => set({ state: null }),
    }),
    {
      name: PERSIST_KEY,
      version: CAREER_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ state: s.state }),
      migrate: (persisted, version) => {
        if (version !== CAREER_VERSION) return { state: null } as CareerStoreShape;
        return persisted as CareerStoreShape;
      },
    },
  ),
);

/** Selector: número total de ciclos. */
export function totalCycles(): number {
  return CAREER_ELECTIONS.length;
}

/** Selector: definición del oficio actual. */
export function currentOfficeDef(state: CareerState) {
  return OFFICES[state.currentOffice];
}

/** Selector: cuál es el escenario electoral del ciclo actual. */
export function currentElectionScenario(state: CareerState) {
  const id = state.cycles[state.currentCycleIndex]?.electionScenarioId;
  return id ? getElectionScenario(id) : undefined;
}

/** Selector: catálogo de acciones de carrera (para la UI). */
export { CAREER_ACTIONS };
