/* =============================================================================
   CAREER — Aplicar acciones de carrera
   El jugador gasta puntos de acción durante la precampaña. Cada acción produce
   un patch al estado. Pure functions: snapshot in, snapshot out.

   Estos efectos son intencionalmente modestos — la idea es que la carrera se
   sienta como una serie de pequeñas decisiones acumulativas, no una sola que
   define todo.
   ============================================================================= */

import { CAREER_ACTIONS } from './content/actions';
import { addMemory } from './memory';
import { patchNpc } from './relationships';
import { applyDelta, setLabel } from './reputation';
import type {
  CareerActionKind,
  CareerState,
  NpcCharacter,
} from './types';
import type { ProvinceId } from '@/content';

export interface ApplyActionContext {
  readonly kind: CareerActionKind;
  readonly targetRegion?: ProvinceId;
  readonly targetNpcId?: string;
}

export interface ApplyActionResult {
  readonly ok: boolean;
  readonly state: CareerState;
  readonly reason?: string;
}

function checkCanApply(
  state: CareerState,
  context: ApplyActionContext,
): { ok: true } | { ok: false; reason: string } {
  const def = CAREER_ACTIONS[context.kind];
  if (state.actionPoints < def.cost) return { ok: false, reason: 'Sin puntos suficientes.' };
  if (def.requiresRegion && !context.targetRegion) return { ok: false, reason: 'Esta acción requiere región.' };
  if (def.requiresNpc && !context.targetNpcId) return { ok: false, reason: 'Esta acción requiere un personaje.' };
  if (context.targetNpcId && !state.npcs[context.targetNpcId]) return { ok: false, reason: 'Personaje no existe.' };
  return { ok: true };
}

export function applyCareerAction(
  state: CareerState,
  context: ApplyActionContext,
): ApplyActionResult {
  const check = checkCanApply(state, context);
  if (!check.ok) return { ok: false, state, reason: check.reason };

  const def = CAREER_ACTIONS[context.kind];
  let next = { ...state, actionPoints: state.actionPoints - def.cost };

  // Cuerpo específico por acción.
  switch (context.kind) {
    case 'meet_regional_leader': {
      const region = context.targetRegion!;
      next = {
        ...next,
        reputation: applyDelta(next.reputation, 'popularity', 3),
        memory: addMemory(next.memory, {
          type: 'region_visited',
          cycle: next.currentCycleIndex,
          description: `Visita formal a ${region}.`,
          impact: 2,
          severity: 'low',
          region,
        }),
      };
      break;
    }
    case 'build_alliance': {
      const npc = next.npcs[context.targetNpcId!] as NpcCharacter;
      const updated = patchNpc(npc, {
        trustDelta: 12,
        respectDelta: 6,
        historyNote: 'El jugador invirtió en la relación.',
      });
      next = { ...next, npcs: { ...next.npcs, [updated.id]: updated } };
      break;
    }
    case 'support_ally': {
      const npc = next.npcs[context.targetNpcId!] as NpcCharacter;
      const updated = patchNpc(npc, {
        loyaltyDelta: 10,
        respectDelta: 5,
        historyNote: 'El jugador lo apoyó cuando importó.',
      });
      next = {
        ...next,
        npcs: { ...next.npcs, [updated.id]: updated },
        memory: addMemory(next.memory, {
          type: 'alliance_formed',
          cycle: next.currentCycleIndex,
          description: `Apoyaste a ${npc.name}.`,
          impact: 3,
          severity: 'medium',
          characterId: npc.id,
        }),
      };
      break;
    }
    case 'betray_ally': {
      const npc = next.npcs[context.targetNpcId!] as NpcCharacter;
      const updated = patchNpc(npc, {
        trustDelta: -30,
        loyaltyDelta: -20,
        respectDelta: -10,
        betrayalRiskDelta: 30,
        historyNote: 'El jugador lo traicionó.',
      });
      next = {
        ...next,
        npcs: { ...next.npcs, [updated.id]: updated },
        rivals: next.rivals.includes(npc.id) ? next.rivals : [...next.rivals, npc.id],
        allies: next.allies.filter((id) => id !== npc.id),
        memory: addMemory(next.memory, {
          type: 'betrayal',
          cycle: next.currentCycleIndex,
          description: `Traicionaste a ${npc.name}.`,
          impact: -8,
          severity: 'high',
          characterId: npc.id,
          canRecur: true,
        }),
        reputation: applyDelta(next.reputation, 'honesty', -10),
      };
      break;
    }
    case 'accept_donor': {
      next = {
        ...next,
        reputation: applyDelta(
          applyDelta(next.reputation, 'economicCredibility', 4),
          'honesty',
          -5,
        ),
        memory: addMemory(next.memory, {
          type: 'pending_favor',
          cycle: next.currentCycleIndex,
          description: 'Aceptaste apoyo financiero — favor pendiente.',
          impact: -3,
          severity: 'medium',
        }),
      };
      break;
    }
    case 'reject_controversial_donor': {
      next = {
        ...next,
        reputation: applyDelta(
          applyDelta(next.reputation, 'honesty', 8),
          'publicTrust',
          5,
        ),
      };
      break;
    }
    case 'shift_ideology': {
      // Mover discurso a centro: bajamos radicalismo y polarización un toque.
      next = {
        ...next,
        reputation: applyDelta(
          applyDelta(next.reputation, 'radicalism', -8),
          'polarization',
          -6,
        ),
      };
      break;
    }
    case 'found_movement': {
      next = {
        ...next,
        party: {
          ...next.party,
          mode: 'movement',
          partyName: `Movimiento ${next.player.name.split(' ')[0]}`,
          internalSupport: 50,
          ruptureRisk: 0,
          discipline: 30,
        },
        reputation: applyDelta(
          applyDelta(applyDelta(next.reputation, 'authority', 6), 'radicalism', 6),
          'nationalFame',
          8,
        ),
      };
      next = { ...next, reputation: setLabel(next.reputation, { add: 'El Fundador' }) };
      break;
    }
    case 'negotiate_endorsement': {
      next = {
        ...next,
        party: {
          ...next.party,
          internalSupport: Math.min(100, next.party.internalSupport + 10),
          discipline: Math.min(100, next.party.discipline + 4),
        },
        reputation: applyDelta(next.reputation, 'partyLoyalty', 4),
      };
      break;
    }
    case 'denounce_corruption': {
      next = {
        ...next,
        reputation: applyDelta(
          applyDelta(next.reputation, 'honesty', 8),
          'publicTrust',
          4,
        ),
      };
      break;
    }
    case 'moderate_discourse': {
      next = {
        ...next,
        reputation: applyDelta(
          applyDelta(next.reputation, 'radicalism', -6),
          'economicCredibility',
          6,
        ),
      };
      break;
    }
    case 'radicalize_discourse': {
      next = {
        ...next,
        reputation: applyDelta(
          applyDelta(next.reputation, 'radicalism', 8),
          'polarization',
          6,
        ),
      };
      break;
    }
    case 'keep_promise': {
      // Cierra la promesa más vieja abierta.
      const idx = next.promises.findIndex((p) => p.status === 'open');
      if (idx === -1) break;
      const promise = next.promises[idx];
      if (!promise) break;
      const updated = [...next.promises];
      updated[idx] = { ...promise, status: 'kept' };
      next = {
        ...next,
        promises: updated,
        memory: addMemory(next.memory, {
          type: 'promise_kept',
          cycle: next.currentCycleIndex,
          description: `Cumpliste: ${promise.description}.`,
          impact: 5,
          severity: 'medium',
          region: promise.region,
        }),
        reputation: applyDelta(
          applyDelta(next.reputation, 'honesty', 8),
          'publicTrust',
          4,
        ),
      };
      break;
    }
    case 'abandon_promise': {
      const idx = next.promises.findIndex((p) => p.status === 'open');
      if (idx === -1) break;
      const promise = next.promises[idx];
      if (!promise) break;
      const updated = [...next.promises];
      updated[idx] = { ...promise, status: 'broken' };
      next = {
        ...next,
        promises: updated,
        memory: addMemory(next.memory, {
          type: 'promise_broken',
          cycle: next.currentCycleIndex,
          description: `Abandonaste: ${promise.description}.`,
          impact: -8,
          severity: 'high',
          region: promise.region,
          canRecur: true,
        }),
        reputation: applyDelta(
          applyDelta(next.reputation, 'honesty', -10),
          'publicTrust',
          -6,
        ),
      };
      next = { ...next, reputation: setLabel(next.reputation, { add: 'La Promesa Incumplida' }) };
      break;
    }
    case 'prepare_candidacy': {
      // Sube directamente la "preparación" mediante un boost suave a casi todo.
      next = {
        ...next,
        reputation: applyDelta(
          applyDelta(applyDelta(next.reputation, 'governmentCapacity', 4), 'nationalFame', 4),
          'authority',
          3,
        ),
      };
      break;
    }
  }

  return { ok: true, state: next };
}
