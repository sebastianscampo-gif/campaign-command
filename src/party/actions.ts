/* =============================================================================
   PARTY — Aplicar acciones del jugador (precampaña)
   Cada acción consume puntos y aplica una mutación pura sobre el estado.
   ============================================================================= */

import { applyBrandDelta } from './brand';
import { endorseCandidate, patchCandidate, revokeEndorsement } from './candidates';
import { applyFinancePatch } from './finance';
import { computeInternalDiscipline, patchFaction } from './factions';
import { shiftIdeology } from './ideology';
import { patchRegion } from './territory';
import { PARTY_ACTIONS } from './content/actions';
import type { ProvinceId } from '@/content';
import type {
  FactionKind,
  PartyActionKind,
  PartyState,
} from './types';

export interface ActionInput {
  readonly kind: PartyActionKind;
  readonly targetRegion?: ProvinceId;
  readonly targetCandidateId?: string;
  readonly targetFactionId?: FactionKind;
}

export interface ActionResult {
  readonly ok: boolean;
  readonly state: PartyState;
  readonly reason?: string;
}

function fail(state: PartyState, reason: string): ActionResult {
  return { ok: false, state, reason };
}

function ok(state: PartyState): ActionResult {
  return { ok: true, state };
}

export function applyPartyAction(state: PartyState, input: ActionInput): ActionResult {
  const def = PARTY_ACTIONS[input.kind];
  if (!def) return fail(state, 'unknown_action');
  if (state.actionPoints < def.cost) return fail(state, 'no_points');
  if (def.requiresRegion && !input.targetRegion) return fail(state, 'missing_region');
  if (def.requiresCandidate && !input.targetCandidateId) return fail(state, 'missing_candidate');
  if (def.requiresFaction && !input.targetFactionId) return fail(state, 'missing_faction');

  const charged: PartyState = { ...state, actionPoints: state.actionPoints - def.cost };

  switch (input.kind) {
    case 'recruit_candidate': {
      const c = charged.candidatePool[input.targetCandidateId!];
      if (!c) return fail(state, 'candidate_not_found');
      return ok({
        ...charged,
        finances: applyFinancePatch(charged.finances, { politicalCapitalDelta: -2 }),
        candidatePool: {
          ...charged.candidatePool,
          [c.id]: { ...c, history: [...c.history, 'Reclutado activamente por la dirigencia.'] },
        },
      });
    }
    case 'give_endorsement': {
      const c = charged.candidatePool[input.targetCandidateId!];
      if (!c) return fail(state, 'candidate_not_found');
      const stage = charged.cycles[charged.currentCycleIndex]?.stage ?? 'local';
      return ok({
        ...charged,
        candidatePool: {
          ...charged.candidatePool,
          [c.id]: endorseCandidate(patchCandidate(c, { loyaltyDelta: 6 }), stage),
        },
        finances: applyFinancePatch(charged.finances, { politicalCapitalDelta: -3 }),
      });
    }
    case 'revoke_endorsement': {
      const c = charged.candidatePool[input.targetCandidateId!];
      if (!c) return fail(state, 'candidate_not_found');
      return ok({
        ...charged,
        candidatePool: { ...charged.candidatePool, [c.id]: revokeEndorsement(c) },
      });
    }
    case 'open_regional_office': {
      const region = charged.territory[input.targetRegion!];
      if (!region) return fail(state, 'region_not_found');
      if (charged.finances.money < 0.8) return fail(state, 'no_money');
      return ok({
        ...charged,
        territory: {
          ...charged.territory,
          [input.targetRegion!]: patchRegion(region, {
            officesDelta: 1,
            machineryDelta: 8,
            militantBaseDelta: 4,
          }),
        },
        finances: applyFinancePatch(charged.finances, { moneyDelta: -0.8 }),
        brand: applyBrandDelta(charged.brand, 'territorialStrength', 2),
      });
    }
    case 'finance_region': {
      const region = charged.territory[input.targetRegion!];
      if (!region) return fail(state, 'region_not_found');
      if (charged.finances.money < 1.5) return fail(state, 'no_money');
      return ok({
        ...charged,
        territory: {
          ...charged.territory,
          [input.targetRegion!]: patchRegion(region, {
            supportDelta: 8,
            volunteersDelta: 6,
            machineryDelta: 4,
          }),
        },
        finances: applyFinancePatch(charged.finances, {
          moneyDelta: -1.5,
          volunteersDelta: 1,
        }),
      });
    }
    case 'accept_donor': {
      return ok({
        ...charged,
        finances: applyFinancePatch(charged.finances, { moneyDelta: 2.5 }),
        brand: applyBrandDelta(
          applyBrandDelta(charged.brand, 'perceivedCorruption', 6),
          'publicTrust',
          -4,
        ),
      });
    }
    case 'reject_donor': {
      return ok({
        ...charged,
        brand: applyBrandDelta(
          applyBrandDelta(charged.brand, 'publicTrust', 4),
          'ideologicalClarity',
          3,
        ),
      });
    }
    case 'negotiate_coalition': {
      return ok({
        ...charged,
        finances: applyFinancePatch(charged.finances, { politicalCapitalDelta: -4 }),
        brand: applyBrandDelta(charged.brand, 'professionalism', 2),
      });
    }
    case 'break_coalition': {
      return ok({
        ...charged,
        coalitions: charged.coalitions.map((c) =>
          c.status === 'active' ? { ...c, status: 'broken' as const } : c,
        ),
        brand: applyBrandDelta(
          applyBrandDelta(charged.brand, 'ideologicalClarity', 6),
          'publicTrust',
          -6,
        ),
      });
    }
    case 'sanction_faction': {
      const f = charged.factions[input.targetFactionId!];
      if (!f) return fail(state, 'faction_not_found');
      const next = patchFaction(f, {
        powerDelta: -8,
        loyaltyDelta: -14,
        disciplineDelta: 10,
        ruptureRiskDelta: 14,
      });
      const factions = { ...charged.factions, [f.id]: next };
      return ok({
        ...charged,
        factions,
        internalDiscipline: computeInternalDiscipline(factions),
        brand: applyBrandDelta(charged.brand, 'internalOrder', 6),
      });
    }
    case 'expel_candidate': {
      const c = charged.candidatePool[input.targetCandidateId!];
      if (!c) return fail(state, 'candidate_not_found');
      return ok({
        ...charged,
        candidatePool: {
          ...charged.candidatePool,
          [c.id]: {
            ...c,
            endorsed: false,
            endorsedFor: null,
            loyalty: 0,
            history: [...c.history, 'Expulsado del partido.'],
          },
        },
        brand: applyBrandDelta(
          applyBrandDelta(charged.brand, 'internalOrder', 8),
          'narrativeCoherence',
          4,
        ),
      });
    }
    case 'moderate_ideology': {
      const ideology = { ...charged.ideology };
      const axis = Math.abs(ideology.economic) > Math.abs(ideology.social) ? 'economic' : 'social';
      const delta = ideology[axis] > 0 ? -0.1 : 0.1;
      return ok({
        ...charged,
        ideology: shiftIdeology(charged.ideology, axis, delta),
        brand: applyBrandDelta(
          applyBrandDelta(charged.brand, 'polarization', -8),
          'movementMystique',
          -6,
        ),
      });
    }
    case 'radicalize_ideology': {
      const ideology = { ...charged.ideology };
      const axis = Math.abs(ideology.economic) > Math.abs(ideology.social) ? 'economic' : 'social';
      const delta = ideology[axis] >= 0 ? 0.1 : -0.1;
      return ok({
        ...charged,
        ideology: shiftIdeology(charged.ideology, axis, delta),
        brand: applyBrandDelta(
          applyBrandDelta(charged.brand, 'polarization', 10),
          'movementMystique',
          8,
        ),
      });
    }
    case 'launch_national_campaign': {
      if (charged.finances.money < 2) return fail(state, 'no_money');
      return ok({
        ...charged,
        finances: applyFinancePatch(charged.finances, {
          moneyDelta: -2,
          mediaInfluenceDelta: 10,
        }),
        brand: applyBrandDelta(
          applyBrandDelta(charged.brand, 'popularConnection', 8),
          'modernity',
          4,
        ),
      });
    }
    case 'activate_militants': {
      const territory = { ...charged.territory };
      for (const id of Object.keys(territory) as ProvinceId[]) {
        const region = territory[id];
        if (!region) continue;
        territory[id] = patchRegion(region, { volunteersDelta: 4, supportDelta: 2 });
      }
      return ok({
        ...charged,
        territory,
        finances: applyFinancePatch(charged.finances, { volunteersDelta: 3, militantsDelta: 2 }),
      });
    }
    case 'resolve_internal_conflict': {
      const factions = { ...charged.factions };
      for (const k of Object.keys(factions) as FactionKind[]) {
        const f = factions[k];
        factions[k] = patchFaction(f, { ruptureRiskDelta: -10, disciplineDelta: 6, loyaltyDelta: 4 });
      }
      return ok({
        ...charged,
        factions,
        internalDiscipline: computeInternalDiscipline(factions),
        brand: applyBrandDelta(charged.brand, 'internalOrder', 6),
      });
    }
    case 'distribute_positions': {
      const factions = { ...charged.factions };
      for (const k of Object.keys(factions) as FactionKind[]) {
        const f = factions[k];
        factions[k] = patchFaction(f, { loyaltyDelta: 8, ambitionDelta: -3 });
      }
      return ok({
        ...charged,
        factions,
        internalDiscipline: computeInternalDiscipline(factions),
        brand: applyBrandDelta(
          applyBrandDelta(charged.brand, 'internalOrder', -4),
          'professionalism',
          2,
        ),
        finances: applyFinancePatch(charged.finances, { politicalCapitalDelta: -8 }),
      });
    }
    case 'call_party_congress': {
      if (charged.finances.money < 1.5) return fail(state, 'no_money');
      const factions = { ...charged.factions };
      for (const k of Object.keys(factions) as FactionKind[]) {
        const f = factions[k];
        factions[k] = patchFaction(f, { disciplineDelta: 10, loyaltyDelta: 4 });
      }
      return ok({
        ...charged,
        factions,
        internalDiscipline: computeInternalDiscipline(factions),
        finances: applyFinancePatch(charged.finances, { moneyDelta: -1.5 }),
        brand: applyBrandDelta(
          applyBrandDelta(charged.brand, 'ideologicalClarity', 8),
          'narrativeCoherence',
          6,
        ),
      });
    }
  }
}

export { PARTY_ACTIONS };
