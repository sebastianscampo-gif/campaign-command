/* =============================================================================
   CAREER — Tests del módulo
   Suite mínimo que ejerce los principales contratos: setup, reputación,
   memoria, efectos, elección y el loop completo del store.
   ============================================================================= */

import { beforeEach, describe, expect, it } from 'vitest';
import {
  ARCHETYPES,
  CAREER_ELECTIONS,
  CAREER_EVENTS,
  buildPolitician,
  computeLegacy,
  useCareerStore,
} from '../index';
import { addMemory, ageMemoriesOneCycle, netMemoryImpact } from '../memory';
import { applyOutcomes } from '../effects';
import {
  applyDelta,
  initialReputation,
  setLabel,
} from '../reputation';
import { resolveElection } from '../elections';

beforeEach(() => {
  localStorage.clear();
  useCareerStore.getState().resetCareer();
});

/* ---- Setup ---------------------------------------------------------------- */

describe('buildPolitician', () => {
  it('aplica el modificador del arquetipo sobre las stats base', () => {
    const player = buildPolitician({
      name: 'Test',
      age: 40,
      originRegion: 'CA',
      socialBackground: 'middle',
      ideology: { economic: 0, social: 0, authority: 0 },
      leadershipStyle: 'pragmatic',
      motivation: 'reform',
      strength: 'X',
      weakness: 'Y',
      archetype: 'populist',
    });
    // El populista tiene +14 carisma sobre la base 50 → 64.
    expect(player.stats.charisma).toBe(64);
    // El populista tiene -8 a competencia técnica → 50 - 8 = 42.
    expect(player.stats.technicalCompetence).toBe(42);
  });

  it('acota los stats a 0..100', () => {
    const player = buildPolitician({
      name: 'X',
      age: 30,
      originRegion: 'CA',
      socialBackground: 'middle',
      ideology: { economic: 0, social: 0, authority: 0 },
      leadershipStyle: 'pragmatic',
      motivation: 'reform',
      strength: '',
      weakness: '',
      archetype: 'reformist',
    });
    for (const v of Object.values(player.stats)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });
});

/* ---- Reputación ----------------------------------------------------------- */

describe('reputación', () => {
  it('inicial respeta acotaciones', () => {
    const stats = ARCHETYPES.reformist.statModifiers;
    const r = initialReputation({
      charisma: 60, strategy: 50, perceivedHonesty: 70, mediaSkill: 60,
      negotiation: 50, groundGame: 40, popularConnection: 50, technicalCompetence: 60,
      radicalism: 20, partyDiscipline: 50,
    });
    expect(r.publicTrust).toBeGreaterThan(0);
    expect(r.honesty).toBe(70);
    expect(r.labels).toEqual([]);
    void stats;
  });

  it('applyDelta acota a 0..100', () => {
    const r = initialReputation({
      charisma: 50, strategy: 50, perceivedHonesty: 50, mediaSkill: 50,
      negotiation: 50, groundGame: 50, popularConnection: 50, technicalCompetence: 50,
      radicalism: 20, partyDiscipline: 50,
    });
    const high = applyDelta(r, 'publicTrust', 200);
    expect(high.publicTrust).toBe(100);
    const low = applyDelta(r, 'publicTrust', -200);
    expect(low.publicTrust).toBe(0);
  });

  it('setLabel agrega y remueve etiquetas', () => {
    const r = initialReputation({
      charisma: 50, strategy: 50, perceivedHonesty: 50, mediaSkill: 50,
      negotiation: 50, groundGame: 50, popularConnection: 50, technicalCompetence: 50,
      radicalism: 20, partyDiscipline: 50,
    });
    const added = setLabel(r, { add: 'X' });
    expect(added.labels).toEqual(['X']);
    // No duplica.
    expect(setLabel(added, { add: 'X' }).labels).toEqual(['X']);
    expect(setLabel(added, { remove: 'X' }).labels).toEqual([]);
  });
});

/* ---- Memoria -------------------------------------------------------------- */

describe('memoria', () => {
  it('addMemory crea una entrada con age=0', () => {
    const m = addMemory([], {
      type: 'promise_made',
      cycle: 0,
      description: 'x',
      impact: 4,
      severity: 'medium',
    });
    expect(m).toHaveLength(1);
    expect(m[0]?.age).toBe(0);
    expect(m[0]?.duration).toBe(2); // medium = 2
  });

  it('ageMemoriesOneCycle expira lo que pasa su duración', () => {
    let m = addMemory([], { type: 'region_visited', cycle: 0, description: 'x', impact: 1, severity: 'low' });
    m = ageMemoriesOneCycle(m); // age=1, duration=1, debería expirar
    expect(m).toHaveLength(0);
  });

  it('canRecur mantiene la memoria viva incluso pasada su duración', () => {
    let m = addMemory([], { type: 'promise_broken', cycle: 0, description: 'x', impact: -5, severity: 'low', canRecur: true });
    m = ageMemoriesOneCycle(m);
    m = ageMemoriesOneCycle(m);
    expect(m).toHaveLength(1);
  });

  it('netMemoryImpact suma los impactos vigentes', () => {
    const m = addMemory(
      addMemory([], { type: 'promise_kept', cycle: 0, description: '', impact: 5, severity: 'medium' }),
      { type: 'scandal', cycle: 0, description: '', impact: -8, severity: 'high' },
    );
    expect(netMemoryImpact(m)).toBe(-3);
  });
});

/* ---- Elecciones ----------------------------------------------------------- */

describe('elections', () => {
  it('resolveElection devuelve resultado determinista', () => {
    useCareerStore.getState().startCareer({
      setup: {
        name: 'Test',
        age: 40,
        originRegion: 'CA',
        socialBackground: 'middle',
        ideology: { economic: 0, social: 0, authority: 0 },
        leadershipStyle: 'pragmatic',
        motivation: 'reform',
        strength: '',
        weakness: '',
        archetype: 'reformist',
      },
      partyMode: 'inside_party',
      partyId: 'PRD',
    });
    const state = useCareerStore.getState().state!;
    const scenario = CAREER_ELECTIONS[0]!;
    const a = resolveElection(state, scenario);
    const b = resolveElection(state, scenario);
    expect(a.playerScore).toBe(b.playerScore);
    expect(['won', 'lost_close', 'lost_landslide']).toContain(a.result);
  });
});

/* ---- Outcomes / efectos --------------------------------------------------- */

describe('applyOutcomes', () => {
  it('aplica un outcome de reputación al estado', () => {
    useCareerStore.getState().startCareer({
      setup: {
        name: 'X', age: 35, originRegion: 'CA', socialBackground: 'middle',
        ideology: { economic: 0, social: 0, authority: 0 },
        leadershipStyle: 'pragmatic', motivation: 'reform', strength: '', weakness: '',
        archetype: 'reformist',
      },
      partyMode: 'independent',
    });
    const before = useCareerStore.getState().state!;
    const after = applyOutcomes(before, [
      { kind: 'reputation', field: 'publicTrust', delta: 10 },
      { kind: 'label', add: 'TestLabel' },
    ]);
    expect(after.reputation.publicTrust).toBeGreaterThan(before.reputation.publicTrust);
    expect(after.reputation.labels).toContain('TestLabel');
  });
});

/* ---- Loop completo del store ---------------------------------------------- */

describe('careerStore — loop end-to-end', () => {
  it('arranca, gasta acciones, procede a elección y al siguiente ciclo', () => {
    const store = useCareerStore.getState();
    store.startCareer({
      setup: {
        name: 'X', age: 35, originRegion: 'CA', socialBackground: 'middle',
        ideology: { economic: 0, social: 0, authority: 0 },
        leadershipStyle: 'pragmatic', motivation: 'reform', strength: '', weakness: '',
        archetype: 'reformist',
      },
      partyMode: 'inside_party',
      partyId: 'PRD',
    });

    expect(useCareerStore.getState().state?.status).toBe('precampaign');
    expect(useCareerStore.getState().state?.currentCycleIndex).toBe(0);

    // Gastar todas las acciones disponibles.
    const initialAP = useCareerStore.getState().state!.actionPoints;
    expect(initialAP).toBe(6);
    const ok1 = useCareerStore.getState().spendActionPoint('prepare_candidacy');
    expect(ok1).toBe(true);
    expect(useCareerStore.getState().state!.actionPoints).toBe(5);

    // Avanzar a la elección.
    useCareerStore.getState().proceedToElection();
    expect(useCareerStore.getState().state?.status).toBe('aftermath');
    expect(useCareerStore.getState().state?.completedElections.length).toBe(1);

    // Avanzar al siguiente ciclo.
    useCareerStore.getState().proceedToNextCycle();
    expect(useCareerStore.getState().state?.currentCycleIndex).toBe(1);
    expect(useCareerStore.getState().state?.actionPoints).toBe(6);
    expect(useCareerStore.getState().state?.status).toBe('precampaign');
  });

  it('triggerNextEvent expone el evento activo si hay uno elegible', () => {
    useCareerStore.getState().startCareer({
      setup: {
        name: 'X', age: 35, originRegion: 'CA', socialBackground: 'middle',
        ideology: { economic: 0, social: 0, authority: 0 },
        leadershipStyle: 'pragmatic', motivation: 'reform', strength: '', weakness: '',
        archetype: 'reformist',
      },
      partyMode: 'inside_party',
      partyId: 'PRD',
    });
    useCareerStore.getState().triggerNextEvent();
    expect(useCareerStore.getState().state?.activeCareerEvent).not.toBeNull();
  });

  it('resolveActiveEvent aplica outcomes y limpia el evento activo', () => {
    useCareerStore.getState().startCareer({
      setup: {
        name: 'X', age: 35, originRegion: 'CA', socialBackground: 'middle',
        ideology: { economic: 0, social: 0, authority: 0 },
        leadershipStyle: 'pragmatic', motivation: 'reform', strength: '', weakness: '',
        archetype: 'reformist',
      },
      partyMode: 'inside_party',
      partyId: 'PRD',
    });
    useCareerStore.getState().triggerNextEvent();
    const evt = useCareerStore.getState().state?.activeCareerEvent;
    expect(evt).not.toBeNull();
    const firstOption = evt!.options[0]!;
    useCareerStore.getState().resolveActiveEvent(firstOption.id);
    expect(useCareerStore.getState().state?.activeCareerEvent).toBeNull();
    expect(useCareerStore.getState().state?.firedEventIds.length).toBeGreaterThan(0);
  });

  it('completa la carrera y calcula legado', () => {
    useCareerStore.getState().startCareer({
      setup: {
        name: 'X', age: 35, originRegion: 'CA', socialBackground: 'middle',
        ideology: { economic: 0, social: 0, authority: 0 },
        leadershipStyle: 'pragmatic', motivation: 'reform', strength: '', weakness: '',
        archetype: 'reformist',
      },
      partyMode: 'inside_party',
      partyId: 'PRD',
    });
    // Avanzar las 3 elecciones.
    for (let i = 0; i < CAREER_ELECTIONS.length; i++) {
      useCareerStore.getState().proceedToElection();
      useCareerStore.getState().proceedToNextCycle();
    }
    const state = useCareerStore.getState().state;
    expect(state?.status).toBe('legacy');
    expect(state?.legacyLabel).not.toBeNull();
    expect(state?.completedElections.length).toBe(3);
  });
});

/* ---- Legacy --------------------------------------------------------------- */

describe('computeLegacy', () => {
  it('produce un score y una etiqueta', () => {
    useCareerStore.getState().startCareer({
      setup: {
        name: 'X', age: 35, originRegion: 'CA', socialBackground: 'middle',
        ideology: { economic: 0, social: 0, authority: 0 },
        leadershipStyle: 'pragmatic', motivation: 'reform', strength: '', weakness: '',
        archetype: 'reformist',
      },
      partyMode: 'inside_party',
      partyId: 'PRD',
    });
    const state = useCareerStore.getState().state!;
    const summary = computeLegacy(state);
    expect(typeof summary.score).toBe('number');
    expect(typeof summary.label).toBe('string');
    expect(summary.highlights.length).toBeGreaterThan(0);
  });
});

/* ---- Sanity del catálogo -------------------------------------------------- */

describe('catálogos', () => {
  it('cada evento tiene al menos una opción con outcomes', () => {
    for (const evt of CAREER_EVENTS) {
      expect(evt.options.length).toBeGreaterThan(0);
      for (const opt of evt.options) {
        expect(opt.outcomes.length).toBeGreaterThan(0);
      }
    }
  });

  it('los 5 arquetipos están definidos', () => {
    expect(Object.keys(ARCHETYPES)).toHaveLength(5);
  });

  it('hay 3 escenarios electorales encadenados', () => {
    expect(CAREER_ELECTIONS).toHaveLength(3);
  });
});
