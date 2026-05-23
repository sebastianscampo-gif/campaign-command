/* =============================================================================
   CONTENT — Noche Electoral
   Snapshot fijo de la cobertura: resultados, analistas, ticker breaking, curva
   de swing y datos de turnout. Es contenido de diseño — un guion de la noche.
   ============================================================================= */

import type { PartyId } from './types';

/** Proyección nacional al porcentaje REPORTING de mesas. */
export interface ElectionResult {
  readonly party: PartyId;
  readonly candidate: string;
  readonly pct: number;
}

export const ELECTION_RESULTS: readonly ElectionResult[] = [
  { party: 'PRD', candidate: 'Vasconcelos', pct: 29.4 },
  { party: 'MNP', candidate: 'Orellana', pct: 28.1 },
  { party: 'FAS', candidate: 'Linares', pct: 21.8 },
  { party: 'VC', candidate: 'Salinas', pct: 14.2 },
  { party: 'IND', candidate: 'Otros', pct: 6.5 },
];

/** % de mesas escrutadas que se muestra como "estado de la cobertura". */
export const REPORTING_PCT = 38;

/** Reloj congelado que ve el espectador. La noche electoral es un snapshot. */
export const SHOW_TIME = '22:47';

/** Analistas en cabina, con cita atribuida. */
export interface Anchor {
  readonly cam: string;
  readonly name: string;
  readonly role: string;
  readonly quote: string;
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

/** Titulares que rotan en el ticker rojo inferior. */
export const BREAKING_HEADLINES: readonly string[] = [
  'PRD AL FRENTE EN PROYECCIÓN NACIONAL · MARGEN ±0.4 pt',
  'COSTA ATLÁNTICA REPORTA AL 71% · VASCONCELOS LIDERA',
  'LLANOS OCCIDENTALES SORPRENDE · PRD CRECE 11 pt',
  'SIERRA ANDINA EN DISPUTA · ESPERANDO 18 MESAS',
  'BAHÍA REAL CIERRA · CONCENTRACIÓN POPULAR EN PLAZA',
  'JUNTA ELECTORAL CONFIRMA: SIN INCIDENTES MAYORES',
  'CANDIDATA ORELLANA EVALÚA DECLARACIÓN',
  'MERCADOS REGIONALES REACCIONAN · BOLSA +1.8%',
];

/** Sparkline PRD–MNP que se muestra en el panel "swing dramático". */
export const SWING_CURVE: readonly number[] = [
  41, 44, 42, 47, 45, 50, 52, 49, 53, 55, 52, 56, 58, 61,
];

/** Turnout esperado y comparativo por segmento. */
export const TURNOUT_REPORT = {
  current: 67.4,
  segments: [
    { label: 'JÓVENES 18-29', delta: '+8.1pt', tone: 'pos' as const },
    { label: 'RURAL', delta: '−2.4pt', tone: 'neg' as const },
    { label: 'METRO AURORA', delta: '+5.6pt', tone: 'pos' as const },
  ],
} as const;

/** Tres tarjetas de la franja inferior de Election Night. */
export const ELECTION_LOWER_STATS = {
  margin: { label: 'VENTAJA · 1° vs 2°', sub: 'pts nacional' },
  turnout: { label: 'TURNOUT', value: '67.4%', sub: 'vs 64.1% (2022) · +3.3' },
  confidence: { label: 'CONFIANZA · MODELO', value: '92%', sub: 'PROYECCIÓN · GANADOR PRD' },
} as const;

/**
 * Escrutinio determinista por provincia. Estable entre renders (no usa reloj).
 * Reemplazará a un cálculo real cuando exista la simulación de noche electoral.
 */
export function reportedPercent(provinceId: string): number {
  const seed = provinceId.charCodeAt(0) * 7 + (provinceId.charCodeAt(1) || 0) * 3;
  return Math.min(100, seed % 116);
}
