/* =============================================================================
   PARTY — Selección de eventos
   Dado un estado y un contexto (trigger), devuelve eventos elegibles, filtrando
   los ya disparados (oneShot).
   ============================================================================= */

import { PARTY_EVENTS, PARTY_EVENT_BY_ID } from './content/events';
import type { PartyEvent, PartyEventTrigger, PartyState } from './types';

interface PickContext {
  readonly trigger: PartyEventTrigger;
}

export function eligibleEvents(
  state: PartyState,
  context: PickContext,
): readonly PartyEvent[] {
  return PARTY_EVENTS.filter((event) => {
    if (event.trigger !== context.trigger && event.trigger !== 'always') return false;
    if (event.oneShot && state.firedEventIds.includes(event.id)) return false;
    // Gate por facción: si el evento referencia una facción que este partido
    // no tiene activa, no es elegible (evita eventos sin sentido).
    if (event.factionId && !state.factions[event.factionId]) return false;
    // Precondición contextual opcional.
    if (event.condition && !event.condition(state)) return false;
    return true;
  });
}

export function pickNextEvent(
  state: PartyState,
  context: PickContext,
): PartyEvent | null {
  const list = eligibleEvents(state, context);
  return list[0] ?? null;
}

export function eventById(id: string): PartyEvent | undefined {
  return PARTY_EVENT_BY_ID[id];
}

/**
 * Recalcula la cola de eventos pendientes para el ciclo actual a partir del
 * estado: toma los eventos `cycle_start`/`always` elegibles (gateados por
 * facción y precondición) y devuelve sus ids, limitados a `max`.
 */
export function recomputePendingEvents(state: PartyState, max = 3): string[] {
  return eligibleEvents(state, { trigger: 'cycle_start' })
    .slice(0, max)
    .map((e) => e.id);
}
