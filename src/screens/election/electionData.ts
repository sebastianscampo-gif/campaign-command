/* =============================================================================
   ELECTION NIGHT — Datos de la cobertura
   Resultados de la jornada y guion de la transmisión. Es un escenario fijo: la
   noche electoral muestra un snapshot, no una simulación en vivo.
   ============================================================================= */

import type { PartyId } from '@/content';

export interface ElectionResult {
  party: PartyId;
  candidate: string;
  pct: number;
}

/** Proyección nacional con el escrutinio al REPORTING %. */
export const ELECTION_RESULTS: readonly ElectionResult[] = [
  { party: 'PRD', candidate: 'Vasconcelos', pct: 29.4 },
  { party: 'MNP', candidate: 'Orellana', pct: 28.1 },
  { party: 'FAS', candidate: 'Linares', pct: 21.8 },
  { party: 'VC', candidate: 'Salinas', pct: 14.2 },
  { party: 'IND', candidate: 'Otros', pct: 6.5 },
];

/** Porcentaje de mesas escrutadas a esta altura de la noche. */
export const REPORTING = 38;

export interface Anchor {
  cam: string;
  name: string;
  role: string;
  quote: string;
}

export const ANCHORS: readonly Anchor[] = [
  {
    cam: 'CAM 01',
    name: 'Carla Mendizábal',
    role: 'Conductora · Mesa de análisis',
    quote:
      'Está abriéndose una ventana inesperada para el PRD en el norte. Linares estaría perdiendo Sierra Andina por menos de 0.4 puntos.',
  },
  {
    cam: 'CAM 02',
    name: 'Iván Otárola',
    role: 'Analista político · Encuestador',
    quote:
      'Vamos a ver swings dramáticos cuando entren los datos de Llanos. Allí Vasconcelos no esperaba pasar del 22%.',
  },
];

export const BREAKING: readonly string[] = [
  'PRD AL FRENTE EN PROYECCIÓN NACIONAL · MARGEN ±0.4 pt',
  'COSTA ATLÁNTICA REPORTA AL 71% · VASCONCELOS LIDERA',
  'LLANOS OCCIDENTALES SORPRENDE · PRD CRECE 11 pt',
  'SIERRA ANDINA EN DISPUTA · ESPERANDO 18 MESAS',
  'BAHÍA REAL CIERRA · CONCENTRACIÓN POPULAR EN PLAZA',
  'JUNTA ELECTORAL CONFIRMA: SIN INCIDENTES MAYORES',
  'CANDIDATA ORELLANA EVALÚA DECLARACIÓN',
  'MERCADOS REGIONALES REACCIONAN · BOLSA +1.8%',
];

/** Curva de swing PRD–MNP (puntos de un sparkline, valores fijos). */
export const SWING_CURVE: readonly number[] = [
  41, 44, 42, 47, 45, 50, 52, 49, 53, 55, 52, 56, 58, 61,
];

/** Escrutinio determinista por provincia (sin reloj). */
export function reportedPercent(provinceId: string): number {
  const seed = provinceId.charCodeAt(0) * 7 + (provinceId.charCodeAt(1) || 0) * 3;
  return Math.min(100, seed % 116);
}
