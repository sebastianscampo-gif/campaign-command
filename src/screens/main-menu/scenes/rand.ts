/* =============================================================================
   MAIN MENU — Pseudo-aleatorio determinista
   Hash puro para posicionar multitudes y partículas en las escenas. Determinista
   (mismo índice → mismo valor) para que las escenas sean estables entre renders.
   ============================================================================= */

export function hash(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Hash en un rango [min, max). */
export function hashRange(n: number, min: number, max: number): number {
  return min + hash(n) * (max - min);
}
