/* =============================================================================
   APP — Definición de navegación
   Lista única de destinos, compartida por la barra superior y las pantallas.
   ============================================================================= */

import type { ScreenId } from '@/state/types';

export interface NavItem {
  id: ScreenId;
  label: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'menu', label: 'MENÚ' },
  { id: 'map', label: 'MAPA' },
  { id: 'dashboard', label: 'DASHBOARD' },
  { id: 'election', label: 'ELECCIÓN' },
  { id: 'media', label: 'MEDIOS' },
  { id: 'gov', label: 'GOBIERNO' },
  { id: 'party', label: 'PARTIDO' },
  { id: 'styleguide', label: 'SISTEMA' },
];
