/* =============================================================================
   STATE — UI store (navegación + tema)
   Estado de presentación: pantalla activa, provincia seleccionada, modal
   abierto y configuración de tema. Separado del game store a propósito: la
   navegación no es estado de simulación.
   ============================================================================= */

import { create } from 'zustand';
import { DEFAULT_THEME } from '@/lib/theme';
import type { UiState } from './types';

export const useUiStore = create<UiState>((set) => ({
  screen: 'menu',
  selectedProvince: null,
  modal: null,
  theme: DEFAULT_THEME,

  navigate: (screen) => set({ screen }),
  selectProvince: (selectedProvince) => set({ selectedProvince }),
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
  setTheme: (patch) => set((state) => ({ theme: { ...state.theme, ...patch } })),
}));
