/* =============================================================================
   APP — Definición de navegación
   Lista única de destinos, compartida por la barra superior y las pantallas.

   El item "SISTEMA" (StyleGuide) es una dev tool: solo aparece en builds de
   desarrollo. En producción el botón no se rendera, pero la ruta sigue siendo
   navegable por código (útil para QA con un toggle).
   ============================================================================= */

import type { ScreenId } from '@/state/types';

export interface NavItem {
  id: ScreenId;
  label: string;
  /** Solo visible cuando import.meta.env.DEV es true. */
  devOnly?: boolean;
}

const ALL_NAV_ITEMS: readonly NavItem[] = [
  { id: 'menu', label: 'MENÚ' },
  { id: 'map', label: 'MAPA' },
  { id: 'dashboard', label: 'DASHBOARD' },
  { id: 'election', label: 'ELECCIÓN' },
  { id: 'media', label: 'MEDIOS' },
  { id: 'gov', label: 'GOBIERNO' },
  { id: 'party', label: 'PARTIDO' },
  { id: 'styleguide', label: 'SISTEMA', devOnly: true },
];

/** Items navegables visibles en la TopBar. En producción, se filtran los devOnly. */
export const NAV_ITEMS: readonly NavItem[] = import.meta.env.DEV
  ? ALL_NAV_ITEMS
  : ALL_NAV_ITEMS.filter((item) => !item.devOnly);
