/* =============================================================================
   STATE — Game store (simulación)
   Snapshot mutable de la partida + acciones que lo evolucionan. Delega la lógica
   a la capa `@/sim` — el store solo encola, valida superficialmente y aplica
   resultados. Mantener thin: si una acción crece en complejidad, esa lógica
   vive en sim/, no acá.
   ============================================================================= */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createInitialGameState } from '@/content/scenario';
import { GAME_STATE_VERSION } from '@/content/scenario';
import type { ActionKind, GameStore } from './types';
import {
  applyEventChoice,
  canQueueAction,
  makeCampaignAction,
  simulateDay,
} from '@/sim';
import type { ProvinceId } from '@/content';

/** Clave de localStorage para persistir la partida. */
const PERSIST_KEY = 'campaign-command/game/v1';

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialGameState(),

      queueCampaignAction: (kind: ActionKind, province?: ProvinceId) => {
        const state = get();
        const validation = canQueueAction(state, kind, province !== undefined);
        if (!validation.ok) {
          // Por ahora el silenciamiento es deliberado: la UI debería disable los
          // botones que no se pueden encolar. En producción se podría emitir
          // un toast — añadir un effect bus a futuro.
          return;
        }
        const action = makeCampaignAction({ kind, province, day: state.day });
        set({ pendingActions: [...state.pendingActions, action] });
      },

      cancelCampaignAction: (id: string) => {
        set((state) => ({
          pendingActions: state.pendingActions.filter((a) => a.id !== id),
        }));
      },

      resolveEventChoice: (optionIndex: number) => {
        const state = get();
        const { snapshot } = applyEventChoice(state, optionIndex);
        // Aplicar solo el delta del snapshot (no las acciones del store).
        set({
          candidate: snapshot.candidate,
          activeEvent: snapshot.activeEvent,
          resolvedEvents: snapshot.resolvedEvents,
        });
      },

      simulateNextDay: () => {
        const state = get();
        const { snapshot, result } = simulateDay(state, state.seed);
        set({
          day: snapshot.day,
          provinces: snapshot.provinces,
          candidate: snapshot.candidate,
          pendingActions: snapshot.pendingActions,
          actionHistory: snapshot.actionHistory,
          currentTurnSummary: result.summary,
          lastSimulationResult: result,
        });
      },

      dismissActiveEvent: () => set({ activeEvent: null }),

      resetGame: () => set(createInitialGameState()),
    }),
    {
      name: PERSIST_KEY,
      version: GAME_STATE_VERSION,
      storage: createJSONStorage(() => localStorage),
      // Solo persistir el snapshot, no las acciones (las acciones son métodos,
      // no datos serializables).
      partialize: (state) => ({
        version: state.version,
        seed: state.seed,
        day: state.day,
        totalDays: state.totalDays,
        provinces: state.provinces,
        candidate: state.candidate,
        polling: state.polling,
        issues: state.issues,
        blocs: state.blocs,
        calendar: state.calendar,
        news: state.news,
        activeEvent: state.activeEvent,
        social: state.social,
        pendingActions: state.pendingActions,
        actionHistory: state.actionHistory,
        resolvedEvents: state.resolvedEvents,
        currentTurnSummary: state.currentTurnSummary,
        lastSimulationResult: state.lastSimulationResult,
      }),
      // Si el schema cambia (versión mayor), descartar el save viejo.
      migrate: (persistedState, version) => {
        if (version !== GAME_STATE_VERSION) {
          return createInitialGameState();
        }
        return persistedState as ReturnType<typeof createInitialGameState>;
      },
    },
  ),
);
