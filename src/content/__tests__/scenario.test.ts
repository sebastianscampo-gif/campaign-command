import { describe, expect, it } from 'vitest';
import { createInitialGameState } from '../scenario';
import { CAMPAIGN_TOTAL_DAYS, SCENARIO_START_DAY } from '../country';

describe('createInitialGameState', () => {
  it('returns a snapshot with the expected starting day', () => {
    const s = createInitialGameState();
    expect(s.day).toBe(SCENARIO_START_DAY);
    expect(s.totalDays).toBe(CAMPAIGN_TOTAL_DAYS);
  });

  it('starts with empty action queues and no turn summary', () => {
    const s = createInitialGameState();
    expect(s.pendingActions).toEqual([]);
    expect(s.actionHistory).toEqual([]);
    expect(s.resolvedEvents).toEqual([]);
    expect(s.currentTurnSummary).toBeNull();
    expect(s.lastSimulationResult).toBeNull();
  });

  it('returns independent snapshots (no shared references)', () => {
    const a = createInitialGameState();
    const b = createInitialGameState();
    expect(a).not.toBe(b);
    expect(a.provinces).not.toBe(b.provinces);
    a.pendingActions.push({ id: 'x', kind: 'rally', queuedOnDay: a.day });
    expect(b.pendingActions).toEqual([]);
  });

  it('seeds 12 provinces with vote intent that sums close to 100', () => {
    const s = createInitialGameState();
    const ids = Object.keys(s.provinces);
    expect(ids.length).toBe(12);
    for (const id of ids) {
      const state = s.provinces[id as keyof typeof s.provinces];
      const total = Object.values(state.intent).reduce((sum, v) => sum + v, 0);
      expect(total).toBeGreaterThanOrEqual(99);
      expect(total).toBeLessThanOrEqual(101);
    }
  });

  it('has a non-null seed for reproducibility', () => {
    const s = createInitialGameState();
    expect(typeof s.seed).toBe('number');
    expect(s.seed).not.toBe(0);
  });
});
