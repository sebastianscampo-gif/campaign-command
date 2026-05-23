/* =============================================================================
   SIM — Catálogo de acciones de campaña
   Definiciones estáticas (parametrización) y factory para instanciar acciones
   que el jugador encola. El motor de simulación (simulation.ts) las consume.
   ============================================================================= */

import type { ProvinceId } from '@/content';
import type {
  ActionDefinition,
  ActionKind,
  CampaignAction,
} from './types';

/* ---- Catálogo -------------------------------------------------------------- */

export const ACTION_CATALOG: Record<ActionKind, ActionDefinition> = {
  rally: {
    kind: 'rally',
    label: 'RALLY',
    description: 'Acto masivo · alta visibilidad',
    icon: '★',
    costMoney: 1.2,
    costDays: 1,
    roiHint: '+3.2pt',
    requiresProvince: true,
    flag: 'hot',
  },
  ad: {
    kind: 'ad',
    label: 'TV AD',
    description: 'Pauta regional 48h',
    icon: '◐',
    costMoney: 0.6,
    costDays: 0,
    roiHint: '+1.8pt',
    requiresProvince: true,
  },
  social: {
    kind: 'social',
    label: 'SOCIAL',
    description: 'Campaña digital coordinada',
    icon: '◉',
    costMoney: 0.2,
    costDays: 0,
    roiHint: '+0.9pt',
    requiresProvince: false,
  },
  'debate-prep': {
    kind: 'debate-prep',
    label: 'DEBATE PREP',
    description: '4 simulacros · D-3',
    icon: '✎',
    costMoney: 0,
    costDays: 2,
    roiHint: '+2.6pt',
    requiresProvince: false,
    flag: 'critical',
  },
  fund: {
    kind: 'fund',
    label: 'FUNDRAISER',
    description: 'Cena alto perfil · 24 donantes',
    icon: '$',
    costMoney: 0,
    costDays: 1,
    roiHint: '+$2.4M',
    requiresProvince: false,
  },
  endorse: {
    kind: 'endorse',
    label: 'ENDORSEMENT',
    description: 'Mamani (FAS) · negociación abierta',
    icon: '◈',
    costMoney: 0,
    costDays: 0,
    roiHint: '+1.4pt',
    requiresProvince: false,
  },
  attack: {
    kind: 'attack',
    label: 'OPP ATTACK',
    description: 'Riesgo elevado · backlash 18%',
    icon: '⚔',
    costMoney: 0.4,
    costDays: 0,
    roiHint: '±2.0pt',
    requiresProvince: false,
  },
  speech: {
    kind: 'speech',
    label: 'POLICY SPEECH',
    description: 'Anuncio de plataforma educativa',
    icon: '✦',
    costMoney: 0,
    costDays: 1,
    roiHint: '+2.1pt',
    requiresProvince: false,
  },
  door: {
    kind: 'door',
    label: 'DOOR-TO-DOOR',
    description: 'Movilización territorial',
    icon: '⊞',
    costMoney: 0.2,
    costDays: 2,
    roiHint: '+0.6pt',
    requiresProvince: true,
  },
  travel: {
    kind: 'travel',
    label: 'TRAVEL',
    description: 'Trasladar a la candidata',
    icon: '➤',
    costMoney: 0.3,
    costDays: 1,
    roiHint: '—',
    requiresProvince: true,
  },
};

/** Mazo del dashboard (subset/orden curado del catálogo). */
export const DASHBOARD_DECK: readonly ActionKind[] = [
  'rally',
  'ad',
  'social',
  'debate-prep',
  'fund',
  'endorse',
  'attack',
  'speech',
];

/** Acciones del map's ActionBar (ordenadas como en el war room). */
export const MAP_BAR_ACTIONS: readonly ActionKind[] = [
  'rally',
  'ad',
  'door',
  'speech',
  'fund',
  'travel',
];

/* ---- Factory de instancia -------------------------------------------------- */

let actionCounter = 0;

/** Crea un id único para una acción encolada. */
function nextActionId(): string {
  actionCounter += 1;
  return `act_${Date.now().toString(36)}_${actionCounter}`;
}

interface QueueOptions {
  readonly kind: ActionKind;
  readonly province?: ProvinceId;
  readonly day: number;
}

/** Encola una acción del jugador. Devuelve el record con id asignado. */
export function makeCampaignAction(options: QueueOptions): CampaignAction {
  return {
    id: nextActionId(),
    kind: options.kind,
    province: options.province,
    queuedOnDay: options.day,
  };
}

/** Reinicia el contador interno. Útil para tests. */
export function _resetActionCounterForTests(): void {
  actionCounter = 0;
}
