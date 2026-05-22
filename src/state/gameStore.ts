/* =============================================================================
   STATE — Game store (simulación)
   Estado mutable de la partida, sembrado desde el escenario. En la Fase 1 las
   acciones son mínimas (stubs); la lógica de simulación llega en fases
   posteriores. Lo que importa ahora es que exista una única fuente de verdad.
   ============================================================================= */

import { create } from 'zustand';
import { createInitialGameState } from '@/content/scenario';
import type { GameStore } from './types';

export const useGameStore = create<GameStore>((set) => ({
  ...createInitialGameState(),

  advanceDay: () =>
    set((state) => ({ day: Math.min(state.day + 1, state.totalDays) })),

  dismissActiveEvent: () => set({ activeEvent: null }),

  resetGame: () => set(createInitialGameState()),
}));
