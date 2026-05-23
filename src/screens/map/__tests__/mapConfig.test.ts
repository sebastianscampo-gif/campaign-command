import { describe, expect, it } from 'vitest';
import { PARTIES, PROVINCES } from '@/content';
import { createInitialGameState } from '@/content/scenario';
import { lerpColor, legendFor, provinceColor } from '../mapConfig';
import type { OverlayId } from '../mapConfig';

const snapshot = createInitialGameState();

function geoState(id: string) {
  const geo = PROVINCES.find((p) => p.id === id);
  if (!geo) throw new Error(`unknown province ${id}`);
  const state = snapshot.provinces[geo.id];
  return { geo, state };
}

describe('lerpColor', () => {
  it('returns from at t=0', () => {
    expect(lerpColor('#000000', '#FFFFFF', 0).toLowerCase()).toBe('#000000');
  });

  it('returns to at t=1', () => {
    expect(lerpColor('#000000', '#FFFFFF', 1).toLowerCase()).toBe('#ffffff');
  });

  it('returns the midpoint at t=0.5', () => {
    expect(lerpColor('#000000', '#FFFFFF', 0.5).toLowerCase()).toBe('#808080');
  });

  it('clamps t outside [0, 1]', () => {
    expect(lerpColor('#000000', '#FFFFFF', -1).toLowerCase()).toBe('#000000');
    expect(lerpColor('#000000', '#FFFFFF', 2).toLowerCase()).toBe('#ffffff');
  });
});

describe('provinceColor', () => {
  it('returns the leading partyʼs color for the "intent" overlay', () => {
    const { geo, state } = geoState('NF');
    const expected = PARTIES.MNP.color; // NF está sembrada con MNP al frente.
    expect(provinceColor(geo, state, 'intent')).toBe(expected);
  });

  it('returns a non-empty hex for every overlay × every province', () => {
    const overlays: OverlayId[] = [
      'intent', 'momentum', 'issues', 'turnout', 'polar', 'crisis',
      'econ', 'approval', 'media', 'infra', 'demo', 'ideol',
    ];
    for (const overlay of overlays) {
      for (const geo of PROVINCES) {
        const color = provinceColor(geo, snapshot.provinces[geo.id], overlay);
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      }
    }
  });
});

describe('legendFor', () => {
  it('returns party-colored entries for "intent"', () => {
    const legend = legendFor('intent');
    expect(legend.length).toBeGreaterThanOrEqual(4);
    for (const entry of legend) {
      expect(entry.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(entry.label.length).toBeGreaterThan(0);
    }
  });

  it('returns a non-null result for every overlay', () => {
    const overlays: OverlayId[] = [
      'intent', 'momentum', 'issues', 'turnout', 'polar', 'crisis',
      'econ', 'approval', 'media', 'infra', 'demo', 'ideol',
    ];
    for (const overlay of overlays) {
      const legend = legendFor(overlay);
      expect(Array.isArray(legend)).toBe(true);
    }
  });
});
