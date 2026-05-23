/* =============================================================================
   SIM — Pseudoaleatorio determinista
   PRNG seedable (mulberry32) + helpers. Es pura: dada la misma seed, produce
   la misma secuencia. Se usa para todo lo que necesita variación reproducible:
   ruido en swings de polling, eventos aleatorios, tirones de momentum.

   Por qué seedable: queremos que las partidas sean reproducibles para QA, para
   tests y para diagnóstico de bugs. `Math.random` no lo es.
   ============================================================================= */

export type Seed = number;

/** PRNG mulberry32: rápido, suficientemente bueno para juego, determinista. */
export class Rng {
  private state: number;

  constructor(seed: Seed) {
    // Asegurar estado distinto de 0 (cero es punto fijo).
    this.state = (seed | 0) || 1;
  }

  /** Próximo valor en [0, 1). */
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Entero en [min, max] inclusive. */
  range(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /** Valor en [min, max). */
  rangeFloat(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** Verdadero con probabilidad `p` (0..1). */
  chance(p: number): boolean {
    return this.next() < p;
  }

  /** Elige un elemento aleatorio del array. Caller garantiza array no vacío. */
  pick<T>(items: readonly T[]): T {
    const i = Math.floor(this.next() * items.length);
    // Indexed access — items[i] está en rango por construcción.
    return items[i] as T;
  }

  /** Estado actual (para serializar/replicar). */
  getState(): number {
    return this.state;
  }
}

/** Construye un RNG a partir de la semilla del juego + un "domain" textual,
 *  de modo que distintos sistemas (polling, eventos, narrativa) avancen sus
 *  propias secuencias sin colisionar entre sí. */
export function rngFor(seed: Seed, domain: string): Rng {
  let h = seed | 0;
  for (let i = 0; i < domain.length; i++) {
    h = Math.imul(h ^ domain.charCodeAt(i), 0x9e3779b1);
  }
  return new Rng(h);
}
