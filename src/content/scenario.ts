/* =============================================================================
   CONTENT — Escenario inicial: "Elecciones Generales 2026"
   Hechos del país + snapshot de partida con que se siembra el game store.
   Es contenido de diseño: define el punto de partida de la simulación.
   ============================================================================= */

import type { ProvinceId } from './types';
import type {
  CalendarEvent,
  CandidateStats,
  GameEvent,
  GameSnapshot,
  Issue,
  NewsItem,
  PollPoint,
  ProvinceState,
  SocialPost,
  VoterBloc,
} from '@/state/types';
import { CAMPAIGN_TOTAL_DAYS, SCENARIO_START_DAY } from './country';

const PROVINCE_DYNAMICS: Record<ProvinceId, ProvinceState> = {
  NF: {
    intent: { PRD: 22, MNP: 41, FAS: 18, VC: 12, IND: 7 },
    momentum: -3, turnout: 54, approval: 38, leaning: 0.55,
    dominantIssue: 'Seguridad fronteriza', crisis: 2, gdp: 4.1,
  },
  SA: {
    intent: { PRD: 28, MNP: 26, FAS: 24, VC: 14, IND: 8 },
    momentum: 5, turnout: 67, approval: 44, leaning: 0.05,
    dominantIssue: 'Minería y agua', crisis: 4, gdp: 5.8,
  },
  CA: {
    intent: { PRD: 38, MNP: 18, FAS: 27, VC: 11, IND: 6 },
    momentum: 2, turnout: 71, approval: 52, leaning: -0.25,
    dominantIssue: 'Turismo y empleo', crisis: 1, gdp: 7.2,
  },
  LO: {
    intent: { PRD: 19, MNP: 36, FAS: 21, VC: 16, IND: 8 },
    momentum: -1, turnout: 62, approval: 41, leaning: 0.4,
    dominantIssue: 'Sequía y agro', crisis: 5, gdp: 3.6,
  },
  VC: {
    intent: { PRD: 34, MNP: 21, FAS: 26, VC: 13, IND: 6 },
    momentum: 8, turnout: 76, approval: 49, leaning: -0.15,
    dominantIssue: 'Costo de vida', crisis: 3, gdp: 9.4,
  },
  CE: {
    intent: { PRD: 31, MNP: 24, FAS: 22, VC: 17, IND: 6 },
    momentum: 1, turnout: 69, approval: 46, leaning: -0.1,
    dominantIssue: 'Puerto y comercio', crisis: 2, gdp: 6.1,
  },
  CR: {
    intent: { PRD: 24, MNP: 19, FAS: 32, VC: 18, IND: 7 },
    momentum: 4, turnout: 58, approval: 36, leaning: -0.2,
    dominantIssue: 'Pueblos originarios', crisis: 6, gdp: 2.9,
  },
  RG: {
    intent: { PRD: 29, MNP: 27, FAS: 23, VC: 14, IND: 7 },
    momentum: 0, turnout: 65, approval: 42, leaning: 0.05,
    dominantIssue: 'Inundaciones', crisis: 7, gdp: 4.4,
  },
  BR: {
    intent: { PRD: 26, MNP: 31, FAS: 19, VC: 17, IND: 7 },
    momentum: -2, turnout: 64, approval: 40, leaning: 0.2,
    dominantIssue: 'Pesca y energía', crisis: 3, gdp: 5.3,
  },
  PS: {
    intent: { PRD: 17, MNP: 44, FAS: 14, VC: 18, IND: 7 },
    momentum: -4, turnout: 60, approval: 43, leaning: 0.5,
    dominantIssue: 'Ganadería y exportaciones', crisis: 2, gdp: 3.1,
  },
  SS: {
    intent: { PRD: 21, MNP: 22, FAS: 35, VC: 16, IND: 6 },
    momentum: 6, turnout: 49, approval: 33, leaning: -0.15,
    dominantIssue: 'Deforestación', crisis: 8, gdp: 2.1,
  },
  TA: {
    intent: { PRD: 25, MNP: 33, FAS: 17, VC: 18, IND: 7 },
    momentum: 1, turnout: 71, approval: 47, leaning: 0.25,
    dominantIssue: 'Soberanía austral', crisis: 1, gdp: 4.7,
  },
};

const CANDIDATE_STATS: CandidateStats = {
  approval: {
    national: 47, men: 42, women: 52,
    youth: 58, elders: 39, urban: 54, rural: 32,
  },
  image: { charisma: 71, competence: 78, integrity: 64, decisiveness: 55 },
  warChest: 24.6,
  mediaShare: 0.34,
  momentum: 8,
};

const POLLING: PollPoint[] = [
  { week: 'S-12', intent: { PRD: 24, MNP: 34, FAS: 18, VC: 16, IND: 8 } },
  { week: 'S-11', intent: { PRD: 25, MNP: 33, FAS: 19, VC: 15, IND: 8 } },
  { week: 'S-10', intent: { PRD: 26, MNP: 32, FAS: 20, VC: 15, IND: 7 } },
  { week: 'S-9', intent: { PRD: 27, MNP: 31, FAS: 21, VC: 14, IND: 7 } },
  { week: 'S-8', intent: { PRD: 27, MNP: 30, FAS: 22, VC: 14, IND: 7 } },
  { week: 'S-7', intent: { PRD: 28, MNP: 30, FAS: 21, VC: 14, IND: 7 } },
  { week: 'S-6', intent: { PRD: 29, MNP: 29, FAS: 21, VC: 14, IND: 7 } },
  { week: 'S-5', intent: { PRD: 30, MNP: 28, FAS: 22, VC: 13, IND: 7 } },
  { week: 'S-4', intent: { PRD: 30, MNP: 28, FAS: 23, VC: 13, IND: 6 } },
  { week: 'S-3', intent: { PRD: 31, MNP: 27, FAS: 23, VC: 13, IND: 6 } },
  { week: 'S-2', intent: { PRD: 30, MNP: 27, FAS: 24, VC: 13, IND: 6 } },
  { week: 'S-1', intent: { PRD: 31, MNP: 26, FAS: 24, VC: 13, IND: 6 } },
];

const ISSUES: Issue[] = [
  { id: 'inflacion', label: 'Inflación y costo de vida', salience: 84, owned: 'MNP', delta: 2 },
  { id: 'seguridad', label: 'Seguridad pública', salience: 71, owned: 'MNP', delta: 5 },
  { id: 'empleo', label: 'Empleo formal', salience: 68, owned: 'PRD', delta: -1 },
  { id: 'corrupcion', label: 'Corrupción', salience: 62, owned: 'VC', delta: 3 },
  { id: 'agua', label: 'Crisis hídrica', salience: 54, owned: 'FAS', delta: 8 },
  { id: 'mineria', label: 'Minería e indígenas', salience: 47, owned: 'FAS', delta: 4 },
  { id: 'educacion', label: 'Educación pública', salience: 41, owned: 'PRD', delta: 0 },
  { id: 'aborto', label: 'Derechos reproductivos', salience: 38, owned: 'PRD', delta: -2 },
];

const BLOCS: VoterBloc[] = [
  { id: 'urb_pro', label: 'Urbano progresista', share: 18, you: 62, them: 14, swing: 6 },
  { id: 'urb_mid', label: 'Clase media urbana', share: 22, you: 34, them: 38, swing: 18 },
  { id: 'rural', label: 'Rural conservador', share: 14, you: 18, them: 55, swing: 9 },
  { id: 'joven', label: 'Jóvenes 18–29', share: 16, you: 41, them: 22, swing: 24 },
  { id: 'mayor', label: 'Adultos 60+', share: 19, you: 36, them: 44, swing: 7 },
  { id: 'indig', label: 'Pueblos originarios', share: 6, you: 28, them: 11, swing: 14 },
  { id: 'inform', label: 'Sector informal', share: 5, you: 31, them: 32, swing: 22 },
];

const CALENDAR: CalendarEvent[] = [
  { day: 'Lun 12', type: 'rally', where: 'Ciudad Aurora', note: 'Acto central · 18:00', intensity: 9 },
  { day: 'Mar 13', type: 'travel', where: '→ Bahía Real', note: 'Vuelo 07:40 · 2h tránsito', intensity: 3 },
  { day: 'Mar 13', type: 'media', where: 'Bahía Real', note: 'Entrevista Canal 7', intensity: 6 },
  { day: 'Mié 14', type: 'rally', where: 'Bahía Real', note: 'Acto sindicatos portuarios', intensity: 8 },
  { day: 'Jue 15', type: 'debate', where: 'TV Federal', note: 'DEBATE NACIONAL · 21:00', intensity: 10 },
  { day: 'Vie 16', type: 'fund', where: 'Ciudad Aurora', note: 'Cena de recaudación', intensity: 5 },
  { day: 'Sáb 17', type: 'travel', where: '→ Quillota', note: 'Cordillera Real', intensity: 4 },
  { day: 'Dom 18', type: 'rally', where: 'Quillota', note: 'Acto comunidades originarias', intensity: 7 },
];

const NEWS: NewsItem[] = [
  { time: '14:32', src: 'CANAL 7', headline: 'Vasconcelos lidera intención de voto por 5 puntos en última encuesta nacional', tone: 'positive' },
  { time: '14:18', src: 'EL CLARÍN', headline: 'MNP denuncia "manipulación estadística" en encuestadora oficial', tone: 'negative' },
  { time: '13:55', src: 'RADIO PLATA', headline: 'Protesta de regantes corta ruta provincial en Llanos Occidentales', tone: 'neutral' },
  { time: '13:40', src: 'AURORA HOY', headline: 'Bolsa cierra en alza tras anuncio de plan económico de Vasconcelos', tone: 'positive' },
  { time: '13:22', src: 'LA SEMANA', headline: 'Mamani (FAS) confirma apoyo en segunda vuelta condicional', tone: 'positive' },
  { time: '13:01', src: 'NORTE TV', headline: 'Inseguridad en Norte Fronterizo: 3er ataque a transporte en una semana', tone: 'negative' },
  { time: '12:44', src: 'EL DÍA', headline: 'Salinas Cárdenas (MNP) llama a "frente antiprogresista"', tone: 'negative' },
  { time: '12:30', src: 'RED SOCIAL', headline: '#VasconcelosPresidenta trending nacional · 312k menciones', tone: 'positive' },
];

const ACTIVE_EVENT: GameEvent = {
  id: 'EVT-2026-047',
  classification: 'CRISIS · NIVEL 3',
  headline: 'Corte de ruta en Llanos Occidentales se extiende a 4° día',
  summary:
    'Asociación de regantes y productores agrícolas mantienen bloqueo de Ruta Federal 14, exigiendo subsidio de emergencia hídrica. Pérdidas estimadas $42M/día. La policía provincial reporta tensión creciente.',
  location: 'LO',
  timer: '03:47:21',
  sentiment: { national: -12, local: -28, base: -8 },
  options: [
    {
      label: 'Visitar la zona y reunirse con regantes',
      cost: '2 días de campaña · $1.2M',
      effect: 'Aprobación local +6 · Imagen pragmática +4 · Riesgo: protesta hostil',
    },
    {
      label: 'Anunciar plan hídrico de $200M',
      cost: 'Capital político elevado · Compromiso fiscal',
      effect: 'Aprobación rural +9 · MNP atacará "gasto irresponsable" · Aprueba issue:agua',
    },
    {
      label: 'Delegar en gobernador provincial',
      cost: 'Sin costo directo',
      effect: 'Sin cambio nacional · Aprobación local -5 · Liberación de agenda',
    },
    {
      label: 'Endurecer discurso de orden público',
      cost: 'Quiebre con base progresista',
      effect: '+ Voto urbano conservador · - Aprobación FAS-leaning · Riesgo de escisión',
    },
  ],
};

const SOCIAL: SocialPost[] = [
  { handle: '@AuroraPolítica', meta: '12k seguidores · hace 4 min', text: 'Vasconcelos en Ciudad Aurora: "El país no se gobierna desde un escritorio, se gobierna escuchando." Aplausos largos.', engagement: '8.4k' },
  { handle: '@RodrigoSalinas_OK', meta: 'oficial · hace 18 min', text: 'No vamos a permitir que se confunda al pueblo con promesas vacías. El MNP defiende la familia, el orden y el trabajo.', engagement: '14.2k' },
  { handle: '@InésMamani', meta: 'oficial · hace 42 min', text: 'Sin agua para los Llanos no hay soberanía alimentaria. El Estado no puede mirar a otro lado.', engagement: '6.1k' },
  { handle: '@CanalSiete', meta: 'media · hace 1 h', text: 'BREAKING — Debate Nacional confirmado: jueves 21:00. Moderan A. Reyes y C. Belaúnde.', engagement: '22.7k' },
  { handle: '@DataPolítica', meta: 'analista · hace 2 h', text: 'Hilo 🧵 Por qué la diferencia entre PRD y MNP sigue achicándose en Valle Central pese al momentum de Vasconcelos. ↓', engagement: '3.9k' },
];

/** Construye un snapshot de partida nuevo. Devuelve copias para que cada
 *  `resetGame()` arranque de datos limpios y no de referencias compartidas. */
export function createInitialGameState(): GameSnapshot {
  return structuredClone({
    version: GAME_STATE_VERSION,
    seed: DEFAULT_SEED,
    day: SCENARIO_START_DAY,
    totalDays: CAMPAIGN_TOTAL_DAYS,
    provinces: PROVINCE_DYNAMICS,
    candidate: CANDIDATE_STATS,
    polling: POLLING,
    issues: ISSUES,
    blocs: BLOCS,
    calendar: CALENDAR,
    news: NEWS,
    activeEvent: ACTIVE_EVENT,
    social: SOCIAL,
    pendingActions: [],
    actionHistory: [],
    resolvedEvents: [],
    currentTurnSummary: null,
    lastSimulationResult: null,
  });
}

/** Versión del schema del save. Aumentar al cambiar la forma de GameSnapshot. */
export const GAME_STATE_VERSION = 1;

/** Semilla por defecto del PRNG cuando arranca un escenario fresco. */
const DEFAULT_SEED = 0xc0ffee;
