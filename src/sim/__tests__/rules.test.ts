import { describe, expect, it } from 'vitest';
import { createInitialGameState } from '@/content/scenario';
import {
  MAX_ACTIONS_PER_DAY,
  actionsQueuedToday,
  canQueueAction,
  daysRemaining,
  isSwingProvince,
  moneyRemaining,
  nationalTension,
} from '../rules';
import { ACTION_CATALOG, makeCampaignAction } from '../actions';

function snapshot() {
  return createInitialGameState();
}

describe('moneyRemaining', () => {
  it('equals warChest when no actions are queued', () => {
    const s = snapshot();
    expect(moneyRemaining(s)).toBe(s.candidate.warChest);
  });

  it('decreases by the cost of queued actions', () => {
    const s = snapshot();
    const action = makeCampaignAction({ kind: 'rally', province: 'CA', day: s.day });
    const next = { ...s, pendingActions: [...s.pendingActions, action] };
    expect(moneyRemaining(next)).toBeCloseTo(s.candidate.warChest - ACTION_CATALOG.rally.costMoney, 5);
  });
});

describe('daysRemaining', () => {
  it('returns total - day, clamped to 0', () => {
    const s = snapshot();
    expect(daysRemaining(s)).toBe(s.totalDays - s.day);
    expect(daysRemaining({ ...s, day: s.totalDays + 5 })).toBe(0);
  });
});

describe('actionsQueuedToday', () => {
  it('counts pending actions', () => {
    const s = snapshot();
    expect(actionsQueuedToday(s)).toBe(0);
    const a = makeCampaignAction({ kind: 'social', day: s.day });
    expect(actionsQueuedToday({ ...s, pendingActions: [a] })).toBe(1);
  });
});

describe('canQueueAction', () => {
  it('rejects actions requiring province if none is provided', () => {
    const s = snapshot();
    const result = canQueueAction(s, 'rally', false);
    expect(result.ok).toBe(false);
  });

  it('accepts province-required actions when a province is provided', () => {
    const s = snapshot();
    const result = canQueueAction(s, 'rally', true);
    expect(result.ok).toBe(true);
  });

  it('rejects when the daily cap is reached', () => {
    const s = snapshot();
    const queue = Array.from({ length: MAX_ACTIONS_PER_DAY }, () =>
      makeCampaignAction({ kind: 'social', day: s.day }),
    );
    const result = canQueueAction({ ...s, pendingActions: queue }, 'social', false);
    expect(result.ok).toBe(false);
  });

  it('rejects when the cost exceeds remaining cash', () => {
    const s: ReturnType<typeof snapshot> = {
      ...snapshot(),
      candidate: { ...snapshot().candidate, warChest: 0 },
    };
    const result = canQueueAction(s, 'rally', true);
    expect(result.ok).toBe(false);
  });
});

describe('isSwingProvince', () => {
  it('returns true when top1 − top2 < 4', () => {
    expect(isSwingProvince({ A: 30, B: 28, C: 25, D: 17 })).toBe(true);
  });

  it('returns false when the gap is wide', () => {
    expect(isSwingProvince({ A: 45, B: 28, C: 15, D: 12 })).toBe(false);
  });
});

describe('nationalTension', () => {
  it('returns a value in [0, 1]', () => {
    const t = nationalTension(snapshot());
    expect(t).toBeGreaterThanOrEqual(0);
    expect(t).toBeLessThanOrEqual(1);
  });

  it('returns 0 for an empty provinces record', () => {
    const s = snapshot();
    const empty = { ...s, provinces: {} as typeof s.provinces };
    expect(nationalTension(empty)).toBe(0);
  });
});
