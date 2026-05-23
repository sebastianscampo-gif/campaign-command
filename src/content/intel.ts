/* =============================================================================
   CONTENT — Intel narrativo
   Texto del consejo de campaña, recomendaciones estratégicas, alertas activas,
   factores del momentum y comentarios de TV. Es la "voz" del juego — todo lo
   que dice un consultor o un comentarista hoy es contenido editorial.

   Cuando exista IA narrativa real, esto pasará a ser un fallback / catálogo
   inicial y la mayoría se generará dinámicamente.
   ============================================================================= */

import type { PartyId } from './types';

/* ---- Consejo del jefe de gabinete en una crisis ---------------------------- */

export interface Advisor {
  readonly role: string;
  readonly quote: string;
  readonly recommendation: string;
}

export const CRISIS_ADVISORS: readonly Advisor[] = [
  {
    role: 'JEFE DE GABINETE',
    quote: 'Hay que visitar la zona. Si no aparecés, te van a comer.',
    recommendation: '→ A',
  },
  {
    role: 'DIR. COMUNICACIÓN',
    quote: 'Un anuncio de $200M nos vuelve dueños del issue "agua" tres semanas.',
    recommendation: '→ B',
  },
  {
    role: 'JEFE DE FINANZAS',
    quote: 'Esos $200M no los tenemos. Bancabilidad cero.',
    recommendation: '→ C',
  },
];

/* ---- Recomendaciones estratégicas del dashboard ---------------------------- */

export type RoiTone = 'pos' | 'warn' | 'neg';

export interface StrategyRec {
  readonly priority: string;
  readonly title: string;
  readonly explanation: string;
  readonly roi: string;
  readonly roiTone: RoiTone;
  readonly tone?: 'critical' | 'warn';
}

export const STRATEGY_RECS: readonly StrategyRec[] = [
  {
    priority: '★★★',
    title: 'Atender la crisis hídrica en Llanos Occidentales',
    explanation:
      'Riesgo de perder 1.4pt nacionales si escala 48h. Un anuncio temprano consolida la narrativa.',
    roi: '+2.1pt',
    roiTone: 'pos',
    tone: 'critical',
  },
  {
    priority: '★★',
    title: 'Pauta televisiva en Valle Central',
    explanation: '28% del padrón. Margen vs MNP en VC: 13pt. Saturación televisiva óptima.',
    roi: '+1.4pt',
    roiTone: 'pos',
  },
  {
    priority: '★★',
    title: 'Preparación de debate · 4 simulacros',
    explanation: 'Issues débiles: seguridad y corrupción. Necesitás respuesta en menos de 45s.',
    roi: 'crítico',
    roiTone: 'warn',
  },
  {
    priority: '⚠',
    title: 'EVITAR: comentar el caso fideicomiso 2021',
    explanation: 'El MNP intentará reactivarlo. Pivotear hacia educación y salud.',
    roi: '−3pt',
    roiTone: 'neg',
    tone: 'warn',
  },
];

/* ---- Tendencias del dashboard (intel feed) -------------------------------- */

export type TrendDirection = 'up' | 'down' | 'flat';

export interface DashboardTrend {
  readonly rank: string;
  readonly tag: string;
  readonly count: string;
  readonly dir: TrendDirection;
}

export const DASHBOARD_TRENDS: readonly DashboardTrend[] = [
  { rank: '01', tag: '#Vasconcelos2026', count: '214k', dir: 'up' },
  { rank: '02', tag: '#DebateNacional', count: '98k', dir: 'up' },
  { rank: '03', tag: '#Orellana', count: '72k', dir: 'flat' },
  { rank: '04', tag: '#FrenteAntiCrisis', count: '41k', dir: 'up' },
  { rank: '05', tag: '#SequíaLlanos', count: '18k', dir: 'down' },
];

/* ---- Comentario de TV en el dashboard ------------------------------------- */

export type TvTone = 'warm' | 'neg' | 'info';

export interface TvCommentary {
  readonly channel: string;
  readonly tone: TvTone;
  readonly text: string;
}

export const TV_COMMENTARY: readonly TvCommentary[] = [
  { channel: 'CH 04', tone: 'warm', text: '"PRD consolida la narrativa de cambio responsable" — Mendizábal' },
  { channel: 'CH 11', tone: 'neg', text: '"Vasconcelos evita responder sobre el fideicomiso" — Vega' },
  { channel: 'CH 22', tone: 'info', text: '"Llanos sigue cortado · gobierno provincial sin acuerdo" — corresponsal' },
];

/* ---- Vitales decorativos del dashboard (no derivan de stats reales) ------ */

export interface ExtraVital {
  readonly label: string;
  readonly value: number;
  readonly note: string;
  readonly warn?: boolean;
}

export const EXTRA_VITALS: readonly ExtraVital[] = [
  { label: 'ENERGY', value: 62, note: 'Próximo descanso D-2' },
  { label: 'TRUST', value: 56, note: 'Estable' },
  { label: 'REPUTATION', value: 71, note: '+4 esta semana' },
];

/** Notas de las imagen-stats reales (charisma, competence, etc.). */
export const IMAGE_VITAL_NOTES: Record<string, string> = {
  charisma: 'Top quintil nacional',
  competence: 'Fortaleza histórica',
  integrity: 'Fideicomiso 2021 · −12',
  decisiveness: 'Crítico para el debate',
};

/* ---- Descomposición del momentum (mock) ----------------------------------- */

export interface MomentumFactor {
  readonly label: string;
  readonly value: number;
}

export const MOMENTUM_FACTORS: readonly MomentumFactor[] = [
  { label: 'BASE', value: 12 },
  { label: 'MEDIA', value: 8 },
  { label: 'FUND', value: 5 },
  { label: 'EVENTOS', value: -3 },
  { label: 'RIVALES', value: -2 },
];

/* ---- Alertas activas que muestra la vista nacional del mapa --------------- */

export type AlertLevel = 'high' | 'mid' | 'low';

export interface ActiveAlert {
  readonly level: AlertLevel;
  readonly tag: string;
  readonly text: string;
  readonly timer: string;
}

export const ACTIVE_ALERTS: readonly ActiveAlert[] = [
  { level: 'high', tag: 'L3', text: 'Corte de ruta · Llanos Occidentales', timer: '03:47' },
  { level: 'mid', tag: 'L2', text: 'Debate nacional confirmado · 3d', timer: '—' },
  { level: 'low', tag: 'L1', text: 'MNP convocará frente antiprogresista', timer: '12h' },
];

/* ---- Rol del coalition panel ---------------------------------------------- */

export type CoalitionKind = 'you' | 'ally' | 'neutral' | 'opp';

export interface CoalitionRole {
  readonly party: PartyId;
  readonly role: string;
  readonly hint?: string;
  readonly kind: CoalitionKind;
}

export const COALITION_ROLES: readonly CoalitionRole[] = [
  { party: 'PRD', role: 'TU BLOQUE', kind: 'you' },
  { party: 'FAS', role: 'ALIADO', hint: 'Mamani · apoyo condicional', kind: 'ally' },
  { party: 'VC', role: 'NEUTRAL', hint: 'Tagliaferri · en silencio', kind: 'neutral' },
  { party: 'IND', role: 'DISPERSO', kind: 'neutral' },
  { party: 'MNP', role: 'OPOSICIÓN', kind: 'opp' },
];

/* ---- Etiquetas demográficas (uso compartido) ------------------------------ */

export const DEMOGRAPHIC_LABELS: Record<string, string> = {
  national: 'NACIONAL',
  men: 'HOMBRES',
  women: 'MUJERES',
  youth: 'JÓVENES',
  elders: 'MAYORES',
  urban: 'URBANO',
  rural: 'RURAL',
};

export const CANDIDATE_IMAGE_LABELS: Record<string, string> = {
  charisma: 'CARISMA',
  competence: 'COMPETENCIA',
  integrity: 'INTEGRIDAD',
  decisiveness: 'DECISIÓN',
};

/* ---- Roles ideológicos del candidate modal -------------------------------- */

export const IDEOLOGY_AXIS_LABELS: Record<string, readonly [string, string]> = {
  economic: ['ESTATISMO', 'MERCADO'],
  social: ['PROGRESISTA', 'CONSERVADOR'],
  authority: ['LIBERTARIO', 'AUTORITARIO'],
};
