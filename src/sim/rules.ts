/* =============================================================================
   SIM — Reglas del juego
   Predicados y queries puros sobre el estado. Aquí viven las validaciones
   (¿puede el jugador hacer esto?, ¿es legal este movimiento?) y consultas
   derivadas (¿cuánta caja queda?, ¿cuántas acciones quedan hoy?).

   Pure functions; sin side effects. Fáciles de testear.
   ============================================================================= */

import type { GameSnapshot } from '@/state/types';
import { ACTION_CATALOG } from './actions';
import type { ActionKind, CampaignAction } from './types';

/** Tope de acciones que el jugador puede encolar por día. Placeholder. */
export const MAX_ACTIONS_PER_DAY = 5;

/** Caja de campaña restante en millones. */
export function moneyRemaining(snapshot: GameSnapshot): number {
  const queuedCost = snapshot.pendingActions.reduce(
    (sum, action) => sum + ACTION_CATALOG[action.kind].costMoney,
    0,
  );
  return snapshot.candidate.warChest - queuedCost;
}

/** Días de campaña restantes hasta la elección. */
export function daysRemaining(snapshot: GameSnapshot): number {
  return Math.max(0, snapshot.totalDays - snapshot.day);
}

/** Acciones encoladas hoy. */
export function actionsQueuedToday(snapshot: GameSnapshot): number {
  return snapshot.pendingActions.length;
}

/** Resultado de validar un intento de encolar. */
export type ValidationResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly reason: string };

/** Valida si una acción de cierto tipo (con o sin provincia) se puede encolar. */
export function canQueueAction(
  snapshot: GameSnapshot,
  kind: ActionKind,
  provinceProvided: boolean,
): ValidationResult {
  const def = ACTION_CATALOG[kind];

  if (def.requiresProvince && !provinceProvided) {
    return { ok: false, reason: 'Esta acción requiere una provincia seleccionada.' };
  }

  if (actionsQueuedToday(snapshot) >= MAX_ACTIONS_PER_DAY) {
    return { ok: false, reason: 'Ya usaste todas las acciones del día.' };
  }

  if (moneyRemaining(snapshot) - def.costMoney < 0) {
    return { ok: false, reason: 'Caja insuficiente.' };
  }

  return { ok: true };
}

/** ¿Hay una crisis activa esperando decisión del jugador? */
export function hasActiveEvent(snapshot: GameSnapshot): boolean {
  return snapshot.activeEvent !== null;
}

/** Provincias en disputa (swing): top1 − top2 < 4 puntos. */
export function isSwingProvince(intent: Record<string, number>): boolean {
  const sorted = Object.values(intent).sort((a, b) => b - a);
  const first = sorted[0] ?? 0;
  const second = sorted[1] ?? 0;
  return first - second < 4;
}

/** Tensión nacional (0..1) — promedio del nivel de crisis provincial / 10. */
export function nationalTension(snapshot: GameSnapshot): number {
  const states = Object.values(snapshot.provinces);
  if (states.length === 0) return 0;
  const sum = states.reduce((acc, p) => acc + p.crisis, 0);
  return sum / states.length / 10;
}

/** Acciones del jugador en orden cronológico (más viejas primero). */
export function listPendingActions(
  snapshot: GameSnapshot,
): readonly CampaignAction[] {
  return snapshot.pendingActions;
}
