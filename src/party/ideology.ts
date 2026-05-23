/* =============================================================================
   PARTY — Ideología
   Editar un eje cuesta capital político (a aplicar por quien llame) y afecta
   coherencia narrativa. Esta función solo ajusta el eje y lo acota a -1..+1.
   ============================================================================= */

import type { Ideology } from './types';

const clampAxis = (v: number): number => Math.max(-1, Math.min(1, v));

export function shiftIdeology(
  ideology: Ideology,
  axis: keyof Ideology,
  delta: number,
): Ideology {
  return { ...ideology, [axis]: clampAxis(ideology[axis] + delta) };
}

/** Distancia entre dos vectores ideológicos (sumas absolutas, normalizada). */
export function ideologyDistance(a: Ideology, b: Ideology): number {
  const axes: (keyof Ideology)[] = [
    'economic',
    'social',
    'authority',
    'globalism',
    'security',
    'market',
    'environment',
  ];
  const total = axes.reduce((sum, ax) => sum + Math.abs(a[ax] - b[ax]), 0);
  return total / axes.length; // 0..2 normalizado a 0..2
}
