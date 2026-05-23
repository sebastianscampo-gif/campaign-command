/* =============================================================================
   SIM — Orquestación del turno
   `simulateDay()` es la función de alto nivel que avanza la simulación un día:
   1. Resuelve las acciones encoladas (en orden).
   2. Aplica el drift natural del polling.
   3. Avanza el contador de día.
   4. Construye un TurnSummary con los highlights.

   No hay decisiones complejas todavía. La arquitectura sí es la definitiva.
   ============================================================================= */

import type { GameSnapshot } from '@/state/types';
import { applyAction, applyNaturalDrift } from './effects';
import { rngFor } from './random';
import type {
  ResolvedAction,
  ResolvedEvent,
  SimulationResult,
  TurnSummary,
} from './types';
import { CANDIDATE } from '@/content';
import type { PartyId } from '@/content';

/** Avanza un día de campaña. Pure-ish: recibe snapshot, devuelve nuevo snapshot. */
export function simulateDay(
  snapshot: GameSnapshot,
  seed: number,
): { readonly snapshot: GameSnapshot; readonly result: SimulationResult } {
  // No avanzar más allá del día de la elección.
  if (snapshot.day >= snapshot.totalDays) {
    return {
      snapshot,
      result: {
        summary: emptySummary(snapshot.day),
        resolvedActions: [],
        resolvedEvents: [],
      },
    };
  }

  const rng = rngFor(seed + snapshot.day, 'turn');
  const playerParty = CANDIDATE.party;

  let current = snapshot;
  const resolvedActions: ResolvedAction[] = [];

  // 1. Resolver acciones encoladas en orden.
  for (const action of snapshot.pendingActions) {
    const out = applyAction(current, action, rng, playerParty);
    current = out.snapshot;
    resolvedActions.push(out.resolved);
  }

  // 2. Drift natural del polling.
  current = applyNaturalDrift(current, rng);

  // 3. Limpiar pending, mover a history, incrementar día.
  current = {
    ...current,
    day: current.day + 1,
    pendingActions: [],
    actionHistory: [...current.actionHistory, ...resolvedActions],
  };

  // 4. Resumen.
  const summary = buildSummary(snapshot, current, resolvedActions);
  const result: SimulationResult = {
    summary,
    resolvedActions,
    // Por ahora no se resuelven eventos en el simulateDay; se manejan vía
    // resolveEventChoice explícito. Cuando exista escalado automático, irían acá.
    resolvedEvents: [] as readonly ResolvedEvent[],
  };

  return { snapshot: current, result };
}

/* ---- Helpers de resumen ---------------------------------------------------- */

function emptySummary(day: number): TurnSummary {
  return {
    day,
    actionsResolved: 0,
    eventsResolved: 0,
    intentShifts: [],
    highlights: ['La campaña terminó: día de elección.'],
  };
}

function buildSummary(
  before: GameSnapshot,
  after: GameSnapshot,
  actions: readonly ResolvedAction[],
): TurnSummary {
  const highlights: string[] = [];

  if (actions.length > 0) {
    highlights.push(`Se resolvieron ${actions.length} acciones de campaña.`);
  }

  // Calcular shifts agregados nacionales (placeholder, no ponderado por población).
  const beforeAverage = aggregateIntent(before);
  const afterAverage = aggregateIntent(after);
  const intentShifts = (Object.entries(afterAverage) as [PartyId, number][]).map(
    ([party, value]) => ({
      party,
      delta: value - (beforeAverage[party] ?? value),
    }),
  );

  for (const shift of intentShifts) {
    if (Math.abs(shift.delta) >= 0.5) {
      const sign = shift.delta > 0 ? '+' : '';
      highlights.push(`${shift.party}: ${sign}${shift.delta.toFixed(1)}pt promedio.`);
    }
  }

  return {
    day: after.day,
    actionsResolved: actions.length,
    eventsResolved: 0,
    intentShifts,
    highlights,
  };
}

function aggregateIntent(snapshot: GameSnapshot): Record<string, number> {
  const totals: Record<string, number> = {};
  let count = 0;
  for (const province of Object.values(snapshot.provinces)) {
    count += 1;
    for (const [party, value] of Object.entries(province.intent)) {
      totals[party] = (totals[party] ?? 0) + value;
    }
  }
  if (count === 0) return totals;
  for (const key of Object.keys(totals)) {
    totals[key] = (totals[key] ?? 0) / count;
  }
  return totals;
}
