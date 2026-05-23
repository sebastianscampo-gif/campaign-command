/* =============================================================================
   SIM — Barrel export del motor de simulación.
   Punto de entrada estable: los stores y la UI consumen sim/ por este barrel,
   no por archivos internos. Reordenar los módulos no rompe consumidores.
   ============================================================================= */

export * from './types';
export * from './actions';
export * from './rules';
export * from './effects';
export * from './simulation';
export { Rng, rngFor } from './random';
export type { Seed } from './random';
