/* =============================================================================
   STATE — UI store (navegación + tema)
   Estado de presentación: pantalla activa, provincia seleccionada, modal
   abierto y configuración de tema. Separado del game store a propósito: la
   navegación no es estado de simulación.

   Persistencia: theme + screen + selectedProvince viven en localStorage para
   que la próxima sesión retome donde quedó. Los modales NO se persisten
   (siempre arrancan cerrados).
   ============================================================================= */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DEFAULT_THEME } from '@/lib/theme';
import type { UiState } from './types';

const PERSIST_KEY = 'campaign-command/ui/v1';
const UI_STATE_VERSION = 1;

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      screen: 'menu',
      selectedProvince: null,
      modal: null,
      theme: DEFAULT_THEME,

      navigate: (screen) => set({ screen }),
      selectProvince: (selectedProvince) => set({ selectedProvince }),
      openModal: (modal) => set({ modal }),
      closeModal: () => set({ modal: null }),
      setTheme: (patch) => set((state) => ({ theme: { ...state.theme, ...patch } })),
    }),
    {
      name: PERSIST_KEY,
      version: UI_STATE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        screen: state.screen,
        selectedProvince: state.selectedProvince,
        theme: state.theme,
      }),
    },
  ),
);
