/* =============================================================================
   MAIN MENU — Definición de modos
   ============================================================================= */

import type { ScreenId } from '@/state/types';

export type MenuItemId =
  | 'continue'
  | 'new'
  | 'career'
  | 'party'
  | 'scenarios'
  | 'multi'
  | 'election'
  | 'media'
  | 'mods'
  | 'settings';

export interface MenuItem {
  id: MenuItemId;
  label: string;
  sub: string;
  primary?: boolean;
  /** Pantalla a la que navega al activarse. null = sin destino aún. */
  action: ScreenId | null;
}

export const MENU_ITEMS: readonly MenuItem[] = [
  {
    id: 'continue',
    label: 'CONTINUE CAMPAIGN',
    sub: 'Elena Vasconcelos · PRD · Día 64/92',
    primary: true,
    action: 'map',
  },
  { id: 'new', label: 'NEW CAMPAIGN', sub: 'HQ setup · candidato · partido', action: 'map' },
  {
    id: 'career',
    label: 'CAREER MODE',
    sub: 'Carrera política multi-ciclo · 1992 → 2046',
    action: 'map',
  },
  { id: 'party', label: 'PARTY MODE', sub: 'Convención · maquinaria electoral', action: 'map' },
  {
    id: 'scenarios',
    label: 'HISTORICAL SCENARIOS',
    sub: '18 escenarios · 1953 – 2024',
    action: 'map',
  },
  {
    id: 'multi',
    label: 'MULTIPLAYER',
    sub: 'War room digital · hot-seat · ranked',
    action: 'map',
  },
  {
    id: 'election',
    label: 'ELECTION NIGHT MODE',
    sub: 'Cobertura en vivo · 14·OCT·2026',
    action: 'election',
  },
  {
    id: 'media',
    label: 'MEDIA ECOSYSTEM',
    sub: 'Stream · prensa · podcasts · trends',
    action: 'media',
  },
  {
    id: 'mods',
    label: 'MODS · WORKSHOP',
    sub: '412 instalados · 18 actualizaciones',
    action: null,
  },
  {
    id: 'settings',
    label: 'SETTINGS',
    sub: 'Audio · video · IA · accesibilidad',
    action: null,
  },
];
