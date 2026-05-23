import { describe, expect, it } from 'vitest';
import { Rng, rngFor } from '../random';

describe('Rng', () => {
  it('is deterministic: same seed → same sequence', () => {
    const a = new Rng(42);
    const b = new Rng(42);
    for (let i = 0; i < 100; i++) {
      expect(a.next()).toBe(b.next());
    }
  });

  it('two different seeds produce different sequences', () => {
    const a = new Rng(1);
    const b = new Rng(2);
    let differs = false;
    for (let i = 0; i < 10; i++) {
      if (a.next() !== b.next()) {
        differs = true;
        break;
      }
    }
    expect(differs).toBe(true);
  });

  it('next() returns values in [0, 1)', () => {
    const r = new Rng(7);
    for (let i = 0; i < 200; i++) {
      const v = r.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('range(min, max) returns integers in [min, max]', () => {
    const r = new Rng(123);
    for (let i = 0; i < 200; i++) {
      const v = r.range(5, 10);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThanOrEqual(10);
    }
  });

  it('chance(p) trends toward p over many samples', () => {
    const r = new Rng(99);
    let hits = 0;
    const N = 10_000;
    for (let i = 0; i < N; i++) {
      if (r.chance(0.3)) hits += 1;
    }
    const ratio = hits / N;
    expect(ratio).toBeGreaterThan(0.27);
    expect(ratio).toBeLessThan(0.33);
  });

  it('pick returns one of the array items', () => {
    const items = ['a', 'b', 'c', 'd'];
    const r = new Rng(7);
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      seen.add(r.pick(items));
    }
    expect([...seen].sort()).toEqual(['a', 'b', 'c', 'd']);
  });

  it('handles seed 0 as a valid non-fixed-point seed', () => {
    const r = new Rng(0);
    // Si fuera 0 puro, next() devolvería siempre 0. Comprobamos que avanza.
    const a = r.next();
    const b = r.next();
    expect(a).not.toBe(b);
  });
});

describe('rngFor', () => {
  it('different domains produce different sequences with same seed', () => {
    const a = rngFor(42, 'polling');
    const b = rngFor(42, 'events');
    expect(a.next()).not.toBe(b.next());
  });

  it('same domain + seed produces the same sequence', () => {
    const a = rngFor(42, 'polling');
    const b = rngFor(42, 'polling');
    expect(a.next()).toBe(b.next());
    expect(a.next()).toBe(b.next());
  });
});
