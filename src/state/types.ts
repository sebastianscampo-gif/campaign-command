/* =============================================================================
   STATE — Tipos del estado de juego (datos mutables en runtime)
   El estado es todo lo que cambia mientras se juega: dinámica de provincias,
   estadísticas del candidato, encuestas, eventos. Se siembra desde el escenario
   y a partir de ahí lo gobiernan los stores de Zustand.
   ============================================================================= */

import type { PartyId, ProvinceId } from '@/content/types';
import type {
  ActionKind,
  CampaignAction,
  ResolvedAction,
  ResolvedEvent,
  SimulationResult,
  TurnSummary,
} from '@/sim/types';

/* ---- Navegación / UI -------------------------------------------------------- */

export type ScreenId =
  | 'menu'
  | 'map'
  | 'dashboard'
  | 'election'
  | 'media'
  | 'gov'
  | 'party'
  | 'profile'
  | 'styleguide'
  | 'career-setup'
  | 'career-overview'
  | 'career-legacy';

export type ModalId = 'crisis' | 'candidate' | 'career-event';

export type PaletteId = 'warroom' | 'cinematic' | 'brutalist' | 'ember';

export type FontPairId = 'institutional' | 'editorial' | 'brutalmono';

export interface ThemeConfig {
  palette: PaletteId;
  fontPair: FontPairId;
  /** Densidad de información, 4 (espaciada) … 10 (compacta). */
  density: number;
  accent: string;
  showGrid: boolean;
  showTicker: boolean;
  breathe: boolean;
  cinematicCuts: boolean;
}

/* ---- Simulación electoral --------------------------------------------------- */

/** Reparto de intención de voto: porcentaje por partido. */
export type VoteShare = Record<PartyId, number>;

export interface ProvinceState {
  intent: VoteShare;
  /** Variación de tendencia reciente, en puntos. */
  momentum: number;
  /** Participación esperada, en porcentaje. */
  turnout: number;
  /** Aprobación del candidato del jugador en la provincia. */
  approval: number;
  /** Sesgo estructural: -1 favorable al jugador … +1 adverso. */
  leaning: number;
  dominantIssue: string;
  /** Nivel de crisis abierta, 0 (calma) … 10 (grave). */
  crisis: number;
  /** PIB provincial en miles de millones. */
  gdp: number;
}

export interface DemographicApproval {
  national: number;
  men: number;
  women: number;
  youth: number;
  elders: number;
  urban: number;
  rural: number;
}

export interface CandidateImage {
  charisma: number;
  competence: number;
  integrity: number;
  decisiveness: number;
}

export interface CandidateStats {
  approval: DemographicApproval;
  image: CandidateImage;
  /** Caja de campaña en millones. */
  warChest: number;
  /** Cuota de presencia mediática, 0 … 1. */
  mediaShare: number;
  momentum: number;
}

export interface PollPoint {
  week: string;
  intent: VoteShare;
}

export interface Issue {
  id: string;
  label: string;
  /** Relevancia pública del tema, 0 … 100. */
  salience: number;
  /** Partido que "posee" el tema en la opinión pública. */
  owned: PartyId;
  /** Variación de relevancia respecto al período anterior. */
  delta: number;
}

export interface VoterBloc {
  id: string;
  label: string;
  /** Peso del bloque sobre el electorado total, en porcentaje. */
  share: number;
  /** Apoyo al jugador dentro del bloque. */
  you: number;
  /** Apoyo al rival principal dentro del bloque. */
  them: number;
  /** Volatilidad del bloque. */
  swing: number;
}

export type CalendarEventType =
  | 'rally'
  | 'travel'
  | 'media'
  | 'debate'
  | 'fund';

export interface CalendarEvent {
  day: string;
  type: CalendarEventType;
  where: string;
  note: string;
  /** Intensidad del evento, 1 … 10. */
  intensity: number;
}

export type NewsTone = 'positive' | 'negative' | 'neutral';

export interface NewsItem {
  time: string;
  src: string;
  headline: string;
  tone: NewsTone;
}

export interface EventOption {
  label: string;
  cost: string;
  effect: string;
}

export interface GameEvent {
  id: string;
  classification: string;
  headline: string;
  summary: string;
  location: ProvinceId;
  timer: string;
  sentiment: {
    national: number;
    local: number;
    base: number;
  };
  options: readonly EventOption[];
}

export interface SocialPost {
  handle: string;
  meta: string;
  text: string;
  engagement: string;
}

/* ---- Snapshot + acciones del game store ------------------------------------ */

/** Estado de simulación serializable. Lo que se siembra desde el escenario. */
export interface GameSnapshot {
  /** Versión del schema. Útil para migraciones de saves. */
  version: number;
  /** Semilla del PRNG — define la rama estocástica de esta partida. */
  seed: number;
  day: number;
  totalDays: number;
  provinces: Record<ProvinceId, ProvinceState>;
  candidate: CandidateStats;
  polling: PollPoint[];
  issues: Issue[];
  blocs: VoterBloc[];
  calendar: CalendarEvent[];
  news: NewsItem[];
  activeEvent: GameEvent | null;
  social: SocialPost[];
  /** Acciones encoladas por el jugador, pendientes de resolución. */
  pendingActions: CampaignAction[];
  /** Acciones ya resueltas en días previos. */
  actionHistory: ResolvedAction[];
  /** Eventos cerrados (crisis ya resueltas con su elección). */
  resolvedEvents: ResolvedEvent[];
  /** Resumen del último día simulado, para mostrar al jugador. */
  currentTurnSummary: TurnSummary | null;
  /** Resultado completo de la última simulación. Útil para devtools / replay. */
  lastSimulationResult: SimulationResult | null;
}

/** Re-exporta tipos del sim para que consumidores no toquen `@/sim` directo
 *  cuando solo necesitan tipos públicos del estado. */
export type { ActionKind, CampaignAction, ResolvedAction, ResolvedEvent, TurnSummary };

export interface GameActions {
  /** Encola una acción del jugador para el día actual. */
  queueCampaignAction: (kind: ActionKind, province?: ProvinceId) => void;
  /** Cancela una acción aún no resuelta. */
  cancelCampaignAction: (id: string) => void;
  /** Aplica la elección del jugador frente al evento activo. */
  resolveEventChoice: (optionIndex: number) => void;
  /** Simula el próximo día (resuelve acciones, drift, avanza el calendario). */
  simulateNextDay: () => void;
  /** Cierra el evento/crisis activo sin aplicar elección. */
  dismissActiveEvent: () => void;
  /** Reinicia la simulación al escenario inicial. */
  resetGame: () => void;
}

export type GameStore = GameSnapshot & GameActions;

/* ---- UI store --------------------------------------------------------------- */

export interface UiState {
  screen: ScreenId;
  selectedProvince: ProvinceId | null;
  modal: ModalId | null;
  theme: ThemeConfig;
  navigate: (screen: ScreenId) => void;
  selectProvince: (id: ProvinceId | null) => void;
  openModal: (modal: ModalId) => void;
  closeModal: () => void;
  setTheme: (patch: Partial<ThemeConfig>) => void;
}
