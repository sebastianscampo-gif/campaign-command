/* =============================================================================
   PARTY — Tests del módulo
   Suite mínimo que ejerce los principales contratos: setup, marca, facciones,
   efectos, elección y el loop completo del store.
   ============================================================================= */

import { beforeEach, describe, expect, it } from 'vitest';
import {
  PARTY_ELECTIONS,
  PARTY_EVENTS,
  PARTY_TYPES,
  buildPartyState,
  computePartyLegacy,
  usePartyStore,
} from '../index';
import { applyOutcomes } from '../effects';
import { computeNationalShare, classifyResult, resolvePartyElection } from '../elections';
import { applyBrandDelta, decayBrand } from '../brand';
import { computeInternalDiscipline, factionsAtRuptureThreshold, patchFaction } from '../factions';
import { addMemory, ageMemoriesOneCycle, netMemoryImpact } from '../memory';
import { ageScandalsOneCycle, createScandal } from '../scandals';
import type { PartySetupChoices } from '../setup';
import type { Faction, FactionKind } from '../types';

const baseChoices: PartySetupChoices = {
  name: 'Test Party',
  sigla: 'TP',
  color: '#000',
  slogan: 'Test',
  type: 'traditional',
  originRegion: 'CA',
  leadershipStyle: 'pragmatic',
  growthStrategy: 'territorial',
  ideology: {
    economic: 0,
    social: 0,
    authority: 0,
    globalism: 0,
    security: 0,
    market: 0,
    environment: 0,
  },
};

beforeEach(() => {
  localStorage.clear();
  usePartyStore.getState().resetParty();
});

/* ---- Setup ---------------------------------------------------------------- */

describe('buildPartyState', () => {
  it('genera un estado inicial completo', () => {
    const state = buildPartyState(baseChoices);
    expect(state.profile.sigla).toBe('TP');
    expect(state.cycles).toHaveLength(3);
    expect(state.actionPoints).toBeGreaterThan(0);
    expect(Object.keys(state.factions).length).toBe(4);
  });

  it('aplica modificadores del tipo de partido', () => {
    const outsider = buildPartyState({ ...baseChoices, type: 'outsider' });
    expect(outsider.brand.movementMystique).toBeGreaterThan(50);
    expect(outsider.brand.territorialStrength).toBeLessThan(50);

    const traditional = buildPartyState({ ...baseChoices, type: 'traditional' });
    expect(traditional.brand.territorialStrength).toBeGreaterThan(50);
    expect(traditional.brand.modernity).toBeLessThan(50);
  });

  it('siembra las 4 facciones correctas para cada tipo', () => {
    const idealogical = buildPartyState({ ...baseChoices, type: 'ideological' });
    expect(Object.keys(idealogical.factions).sort()).toEqual(
      PARTY_TYPES.ideological.initialFactions.slice().sort(),
    );
  });

  it('la región de origen arranca con más apoyo y maquinaria', () => {
    const state = buildPartyState({ ...baseChoices, originRegion: 'NF' });
    const origin = state.territory['NF']!;
    const other = state.territory['SA']!;
    expect(origin.support).toBeGreaterThan(other.support);
    expect(origin.machinery).toBeGreaterThan(other.machinery);
  });
});

/* ---- Brand ---------------------------------------------------------------- */

describe('brand', () => {
  it('aplica deltas y acota', () => {
    const state = buildPartyState(baseChoices);
    const next = applyBrandDelta(state.brand, 'publicTrust', 200);
    expect(next.publicTrust).toBe(100);
    const negative = applyBrandDelta(state.brand, 'publicTrust', -1000);
    expect(negative.publicTrust).toBe(0);
  });

  it('decae polarización y mística', () => {
    const state = buildPartyState(baseChoices);
    const boosted = applyBrandDelta(state.brand, 'polarization', 30);
    const decayed = decayBrand(boosted);
    expect(decayed.polarization).toBeLessThan(boosted.polarization);
  });
});

/* ---- Facciones ------------------------------------------------------------ */

describe('factions', () => {
  it('disciplina interna baja si las facciones tienen mucho riesgo de ruptura', () => {
    const state = buildPartyState(baseChoices);
    const factions = { ...state.factions };
    for (const k of Object.keys(factions) as FactionKind[]) {
      factions[k] = patchFaction(factions[k] as Faction, { ruptureRiskDelta: 50, loyaltyDelta: -30 });
    }
    const lower = computeInternalDiscipline(factions);
    const higher = computeInternalDiscipline(state.factions);
    expect(lower).toBeLessThan(higher);
  });

  it('detecta facciones en umbral de ruptura', () => {
    const state = buildPartyState(baseChoices);
    const factions = { ...state.factions };
    const firstKey = Object.keys(factions)[0] as FactionKind;
    factions[firstKey] = patchFaction(factions[firstKey] as Faction, { ruptureRiskDelta: 90, loyaltyDelta: -100 });
    const ruptured = factionsAtRuptureThreshold(factions);
    expect(ruptured).toContain(firstKey);
  });
});

/* ---- Memoria y escándalos ------------------------------------------------- */

describe('memory & scandals', () => {
  it('memoria se desvanece tras su duración', () => {
    let mem = addMemory([], {
      type: 'election_won',
      cycle: 0,
      description: 'test',
      impact: 5,
      severity: 'low',
    });
    expect(mem).toHaveLength(1);
    mem = ageMemoriesOneCycle(mem); // age=1, duration=1 → desaparece
    expect(mem).toHaveLength(0);
  });

  it('canRecur mantiene la memoria viva indefinidamente', () => {
    let mem = addMemory([], {
      type: 'donor_accepted',
      cycle: 0,
      description: 'eternal',
      impact: -3,
      severity: 'low',
      canRecur: true,
    });
    mem = ageMemoriesOneCycle(mem);
    mem = ageMemoriesOneCycle(mem);
    expect(mem).toHaveLength(1);
  });

  it('netMemoryImpact suma impactos vigentes', () => {
    const mem = addMemory(
      addMemory([], { type: 'election_won', cycle: 0, description: '', impact: 5 }),
      { type: 'election_lost', cycle: 0, description: '', impact: -3 },
    );
    expect(netMemoryImpact(mem)).toBe(2);
  });

  it('escándalo critical sobrevive más ciclos que low', () => {
    let scandals = [
      createScandal({ cycle: 0, type: 'corruption', title: 'A', description: '', severity: 'low' }),
      createScandal({ cycle: 0, type: 'corruption', title: 'B', description: '', severity: 'critical' }),
    ];
    scandals = ageScandalsOneCycle(scandals);
    scandals = ageScandalsOneCycle(scandals);
    const active = scandals.filter((s) => s.status === 'active');
    expect(active.find((s) => s.title === 'B')).toBeTruthy();
  });
});

/* ---- Effects -------------------------------------------------------------- */

describe('applyOutcomes', () => {
  it('aplica deltas de marca', () => {
    const state = buildPartyState(baseChoices);
    const next = applyOutcomes(state, [
      { kind: 'brand', field: 'publicTrust', delta: 10 },
      { kind: 'brand', field: 'polarization', delta: -5 },
    ]);
    expect(next.brand.publicTrust).toBe(state.brand.publicTrust + 10);
    expect(next.brand.polarization).toBe(state.brand.polarization - 5);
  });

  it('aplica patches de facción y recalcula disciplina', () => {
    const state = buildPartyState({ ...baseChoices, type: 'traditional' });
    const next = applyOutcomes(state, [
      { kind: 'faction', factionId: 'old_guard', loyaltyDelta: -50, ruptureRiskDelta: 60 },
    ]);
    expect(next.factions.old_guard!.loyalty).toBeLessThan(state.factions.old_guard!.loyalty);
    expect(next.internalDiscipline).toBeLessThan(state.internalDiscipline);
  });

  it('registra un donante en finanzas', () => {
    const state = buildPartyState(baseChoices);
    const next = applyOutcomes(state, [
      { kind: 'donor', donorKind: 'corporate', name: 'Korniak', amount: 4.5, conditions: 'x' },
    ]);
    expect(next.finances.donors.find((d) => d.name === 'Korniak')).toBeTruthy();
    expect(next.finances.money).toBe(state.finances.money + 4.5);
  });

  it('crea un escándalo y penaliza la marca', () => {
    const state = buildPartyState(baseChoices);
    const next = applyOutcomes(state, [
      {
        kind: 'scandal',
        scandalType: 'corruption',
        title: 'X',
        description: 'y',
        severity: 'high',
      },
    ]);
    expect(next.scandals).toHaveLength(1);
    expect(next.brand.publicTrust).toBeLessThan(state.brand.publicTrust);
    expect(next.brand.perceivedCorruption).toBeGreaterThan(state.brand.perceivedCorruption);
  });
});

/* ---- Elecciones ----------------------------------------------------------- */

describe('elections', () => {
  it('classifyResult devuelve won, split, lost', () => {
    const scenario = PARTY_ELECTIONS[0]!;
    expect(classifyResult(scenario.winThreshold + 5, scenario)).toBe('won');
    expect(classifyResult(Math.max(1, scenario.winThreshold * 0.75), scenario)).toBe('split');
    expect(classifyResult(1, scenario)).toBe('lost');
  });

  it('computeNationalShare devuelve un valor acotado 0..100', () => {
    const state = buildPartyState(baseChoices);
    const scenario = PARTY_ELECTIONS[0]!;
    const share = computeNationalShare(state, scenario);
    expect(share).toBeGreaterThan(0);
    expect(share).toBeLessThan(100);
  });

  it('resolvePartyElection es determinista para el mismo estado', () => {
    const state = buildPartyState(baseChoices);
    const scenario = PARTY_ELECTIONS[0]!;
    const a = resolvePartyElection(state, scenario);
    const b = resolvePartyElection(state, scenario);
    expect(a.nationalShare).toBe(b.nationalShare);
    expect(a.result).toBe(b.result);
  });
});

/* ---- Eventos: cobertura del catálogo -------------------------------------- */

describe('events catalog', () => {
  it('todos los eventos tienen al menos una opción', () => {
    for (const e of PARTY_EVENTS) {
      expect(e.options.length).toBeGreaterThan(0);
    }
  });

  it('cada opción tiene outcomes', () => {
    for (const e of PARTY_EVENTS) {
      for (const o of e.options) {
        expect(o.outcomes.length).toBeGreaterThan(0);
      }
    }
  });
});

/* ---- Store: loop completo ------------------------------------------------- */

describe('partyStore loop', () => {
  it('startParty inicializa el estado', () => {
    usePartyStore.getState().startParty(baseChoices);
    const state = usePartyStore.getState().state;
    expect(state).not.toBeNull();
    expect(state!.profile.name).toBe('Test Party');
  });

  it('proceedToElection registra el resultado y avanza a aftermath', () => {
    usePartyStore.getState().startParty(baseChoices);
    usePartyStore.getState().proceedToElection();
    const state = usePartyStore.getState().state!;
    expect(state.completedElections).toHaveLength(1);
    expect(state.status).toBe('aftermath');
  });

  it('proceedToNextCycle pasa al siguiente ciclo y resetea action points', () => {
    usePartyStore.getState().startParty(baseChoices);
    usePartyStore.getState().proceedToElection();
    usePartyStore.getState().proceedToNextCycle();
    const state = usePartyStore.getState().state!;
    expect(state.currentCycleIndex).toBe(1);
    expect(state.status).toBe('precampaign');
    expect(state.actionPoints).toBeGreaterThan(0);
  });

  it('después de 3 ciclos pasa a legacy', () => {
    usePartyStore.getState().startParty(baseChoices);
    for (let i = 0; i < 3; i++) {
      usePartyStore.getState().proceedToElection();
      usePartyStore.getState().proceedToNextCycle();
    }
    const state = usePartyStore.getState().state!;
    expect(state.status).toBe('legacy');
    expect(state.legacyLabel).not.toBeNull();
  });

  it('computePartyLegacy devuelve un archetype', () => {
    const state = buildPartyState(baseChoices);
    const legacy = computePartyLegacy(state);
    expect(legacy.archetype).toBeTruthy();
    expect(legacy.label).toBeTruthy();
    expect(legacy.highlights.length).toBeGreaterThan(0);
  });
});
