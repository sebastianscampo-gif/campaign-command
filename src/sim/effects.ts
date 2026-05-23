/* =============================================================================
   SIM — Efectos
   Funciones puras que aplican el efecto de una acción o un evento al snapshot.
   Reciben snapshot in, devuelven snapshot out — nunca mutan.

   El propósito en esta fase es ESTRUCTURAL: la simulación todavía es trivial
   (deltas pequeños y deterministas), pero el contrato está fijado. Cuando
   exista el balance real, sólo cambia el cuerpo de cada función.
   ============================================================================= */

import type { GameSnapshot, ProvinceState } from '@/state/types';
import type { ProvinceId, PartyId } from '@/content';
import { ACTION_CATALOG } from './actions';
import type { Rng } from './random';
import type { CampaignAction, ResolvedAction, ResolvedEvent } from './types';

/* ---- Helpers internos ------------------------------------------------------ */

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Aplica un delta a la intención de voto de una provincia, normalizando para
 *  que la suma siga siendo ≈100. El resto de los partidos se ajusta en proporción
 *  inversa a su cuota actual.
 *
 *  Esta es la operación más usada por las acciones de campaña. */
function shiftProvinceIntent(
  state: ProvinceState,
  party: PartyId,
  delta: number,
): ProvinceState {
  const intent = { ...state.intent };
  const targetBefore = intent[party];
  const targetAfter = clamp(targetBefore + delta, 0, 100);
  const actualDelta = targetAfter - targetBefore;
  intent[party] = targetAfter;

  // Repartir el delta entre el resto, ponderado por su cuota.
  const otherParties = (Object.keys(intent) as PartyId[]).filter((p) => p !== party);
  const otherTotal = otherParties.reduce((sum, p) => sum + intent[p], 0);
  if (otherTotal > 0) {
    for (const p of otherParties) {
      const share = intent[p] / otherTotal;
      intent[p] = clamp(intent[p] - actualDelta * share, 0, 100);
    }
  }

  return { ...state, intent };
}

/* ---- Aplicar acciones ------------------------------------------------------ */

/** Resuelve una acción encolada y devuelve el nuevo snapshot + el record resuelto. */
export function applyAction(
  snapshot: GameSnapshot,
  action: CampaignAction,
  rng: Rng,
  playerParty: PartyId,
): { readonly snapshot: GameSnapshot; readonly resolved: ResolvedAction } {
  const def = ACTION_CATALOG[action.kind];

  // Magnitud del efecto: 50%..120% del ROI base, con un poco de varianza.
  const variance = 0.5 + rng.next() * 0.7;
  const baseShift = parseRoiPoints(def.roiHint) * variance;

  let next = snapshot;
  let intentDelta = 0;
  let approvalDelta = 0;

  // Costo: descontar de la caja.
  next = {
    ...next,
    candidate: {
      ...next.candidate,
      warChest: Math.max(0, next.candidate.warChest - def.costMoney),
    },
  };

  // Efecto principal según tipo. Versión esqueleto: el shift va a la provincia
  // si la acción la requiere, o se reparte nacionalmente.
  if (action.province && def.requiresProvince) {
    const province = next.provinces[action.province];
    if (province) {
      next = {
        ...next,
        provinces: {
          ...next.provinces,
          [action.province]: shiftProvinceIntent(province, playerParty, baseShift),
        },
      };
      intentDelta = baseShift;
    }
  } else if (action.kind === 'fund') {
    // Fund recauda en lugar de mover intent.
    const raised = 2 + rng.next() * 1.5;
    next = {
      ...next,
      candidate: { ...next.candidate, warChest: next.candidate.warChest + raised },
    };
  } else {
    // Acciones nacionales: pequeño bump de aprobación.
    const bump = baseShift * 0.4;
    next = {
      ...next,
      candidate: {
        ...next.candidate,
        approval: {
          ...next.candidate.approval,
          national: clamp(next.candidate.approval.national + bump, 0, 100),
        },
      },
    };
    approvalDelta = bump;
  }

  const resolved: ResolvedAction = {
    ...action,
    resolvedOnDay: snapshot.day,
    intentDelta: intentDelta || undefined,
    approvalDelta: approvalDelta || undefined,
    notes: `${def.label}${action.province ? ` en ${action.province}` : ''}`,
  };

  return { snapshot: next, resolved };
}

/* ---- Aplicar elección de evento ------------------------------------------- */

/** Resuelve la elección del jugador frente a un evento activo. Cierra el evento
 *  y aplica un efecto placeholder (impacto sentimental). */
export function applyEventChoice(
  snapshot: GameSnapshot,
  optionIndex: number,
): { readonly snapshot: GameSnapshot; readonly resolved: ResolvedEvent | null } {
  const event = snapshot.activeEvent;
  if (!event) return { snapshot, resolved: null };

  const chosen = event.options[optionIndex];
  if (!chosen) return { snapshot, resolved: null };

  // Placeholder: el sentimiento nacional del evento se aplica como delta de
  // aprobación, escalado a 10%. Cuando exista balance real, leeremos la option
  // y aplicaremos los efectos parseados.
  const approvalDelta = (event.sentiment.national / 10) * (optionIndex === 0 ? 1.2 : 0.8);

  const next: GameSnapshot = {
    ...snapshot,
    candidate: {
      ...snapshot.candidate,
      approval: {
        ...snapshot.candidate.approval,
        national: clamp(snapshot.candidate.approval.national + approvalDelta, 0, 100),
      },
    },
    activeEvent: null,
    resolvedEvents: [
      ...snapshot.resolvedEvents,
      {
        eventId: event.id,
        chosenOptionIndex: optionIndex,
        resolvedOnDay: snapshot.day,
        summary: chosen.label,
      },
    ],
  };

  return {
    snapshot: next,
    resolved: {
      eventId: event.id,
      chosenOptionIndex: optionIndex,
      resolvedOnDay: snapshot.day,
      summary: chosen.label,
    },
  };
}

/* ---- Drift diario ---------------------------------------------------------- */

/** Aplica un pequeño drift natural a la intención de cada provincia. Sin esto
 *  el polling sería completamente estático entre acciones. Magnitud chica. */
export function applyNaturalDrift(snapshot: GameSnapshot, rng: Rng): GameSnapshot {
  const next: Record<ProvinceId, ProvinceState> = { ...snapshot.provinces };
  for (const id of Object.keys(next) as ProvinceId[]) {
    const province = next[id];
    if (!province) continue;
    const parties = Object.keys(province.intent) as PartyId[];
    const intent = { ...province.intent };
    for (const party of parties) {
      const drift = (rng.next() - 0.5) * 0.6;
      intent[party] = clamp(intent[party] + drift, 0, 100);
    }
    next[id] = { ...province, intent };
  }
  return { ...snapshot, provinces: next };
}

/* ---- Helpers de parsing --------------------------------------------------- */

/** Parsea hints tipo "+3.2pt", "±2.0pt", "-3pt" → número. */
function parseRoiPoints(hint: string): number {
  const match = hint.match(/[+\-±]?(\d+(?:\.\d+)?)/);
  if (!match) return 0;
  const num = parseFloat(match[1] ?? '0');
  if (hint.startsWith('-')) return -num;
  if (hint.startsWith('±')) return num * 0.6;
  return num;
}
