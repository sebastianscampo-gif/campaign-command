/* =============================================================================
   CAREER — Selección de eventos
   Dado un estado, decide qué evento(s) están disponibles según trigger, stage,
   y si ya se dispararon (oneShot). El store consulta esto al cambiar de fase.
   ============================================================================= */

import { CAREER_EVENTS, CAREER_EVENT_BY_ID } from './content/events';
import type {
  CareerEvent,
  CareerEventTrigger,
  CareerStage,
  CareerState,
} from './types';

interface PickContext {
  readonly trigger: CareerEventTrigger;
  readonly stage: CareerStage;
}

/** Eventos elegibles según trigger + stage, excluyendo los ya disparados. */
export function eligibleEvents(
  state: CareerState,
  context: PickContext,
): readonly CareerEvent[] {
  return CAREER_EVENTS.filter((event) => {
    if (event.trigger !== context.trigger && event.trigger !== 'always') return false;
    if (!event.stages.includes(context.stage)) return false;
    if (event.oneShot && state.firedEventIds.includes(event.id)) return false;
    return true;
  });
}

/** Toma el primer evento elegible. Determinista: el primero por orden del catálogo. */
export function pickNextEvent(
  state: CareerState,
  context: PickContext,
): CareerEvent | null {
  const list = eligibleEvents(state, context);
  return list[0] ?? null;
}

/** Lookup directo por id. */
export function eventById(id: string): CareerEvent | undefined {
  return CAREER_EVENT_BY_ID[id];
}
