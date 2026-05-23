/* =============================================================================
   CAREER — Tipos base del modo carrera
   La carrera es una secuencia de ciclos políticos. Cada ciclo el jugador
   prepara, hace campaña, vota, y carga las consecuencias. La memoria política
   sobrevive entre ciclos: lo que prometió y rompió, a quién traicionó, qué
   regiones ignoró.
   ============================================================================= */

import type { PartyId, ProvinceId } from '@/content';

/* ---- Identidad del político del jugador ----------------------------------- */

/** Las 10 estadísticas base que definen el perfil del político. */
export interface PoliticianStats {
  /** Capacidad de inspirar y conectar. */
  readonly charisma: number;
  /** Capacidad táctica/estratégica. */
  readonly strategy: number;
  /** Cómo lo perciben los votantes en términos de honestidad. */
  readonly perceivedHonesty: number;
  /** Habilidad para manejar medios y opinión pública. */
  readonly mediaSkill: number;
  /** Capacidad de negociación con otras facciones. */
  readonly negotiation: number;
  /** Maquinaria territorial / "ground game". */
  readonly groundGame: number;
  /** Conexión emocional con la base popular. */
  readonly popularConnection: number;
  /** Conocimiento técnico y de gestión. */
  readonly technicalCompetence: number;
  /** Grado de radicalismo del discurso. */
  readonly radicalism: number;
  /** Adherencia a la línea partidaria. */
  readonly partyDiscipline: number;
}

export type ArchetypeId =
  | 'reformist'
  | 'populist'
  | 'technocrat'
  | 'regional_baron'
  | 'outsider';

export type SocialBackground =
  | 'working'
  | 'middle'
  | 'upper'
  | 'rural'
  | 'academic';

export type LeadershipStyle =
  | 'inspirational'
  | 'pragmatic'
  | 'authoritarian'
  | 'collaborative'
  | 'confrontational';

export type MotivationId =
  | 'reform'
  | 'justice'
  | 'order'
  | 'legacy'
  | 'revenge'
  | 'power';

/** Snapshot inmutable del político: identidad fija que viene del setup. */
export interface PlayerPolitician {
  readonly name: string;
  readonly age: number;
  readonly originRegion: ProvinceId;
  readonly socialBackground: SocialBackground;
  readonly ideology: {
    readonly economic: number;
    readonly social: number;
    readonly authority: number;
  };
  readonly leadershipStyle: LeadershipStyle;
  readonly motivation: MotivationId;
  readonly strength: string;
  readonly weakness: string;
  readonly archetype: ArchetypeId;
  readonly stats: PoliticianStats;
}

/* ---- Estructura de cargos ------------------------------------------------- */

export type CareerStage = 'local' | 'regional' | 'national' | 'presidential';

export type OfficeId =
  | 'activist'
  | 'councilor'
  | 'mayor'
  | 'regional_deputy'
  | 'governor'
  | 'senator'
  | 'minister'
  | 'presidential_candidate'
  | 'president'
  | 'opposition_leader';

/* ---- Estado partidario ---------------------------------------------------- */

export type PartyMode = 'inside_party' | 'independent' | 'movement';

export interface PartyStatus {
  readonly mode: PartyMode;
  readonly partyId: PartyId | null;
  readonly partyName: string;
  /** 0..100 — apoyo de la dirigencia partidaria. */
  internalSupport: number;
  /** 0..100 — riesgo de quiebre / ruptura. */
  ruptureRisk: number;
  /** 0..100 — disciplina con la línea oficial. */
  discipline: number;
}

/* ---- Reputación ----------------------------------------------------------- */

/** Las 15 dimensiones de reputación del político. Todas 0..100. */
export interface Reputation {
  publicTrust: number;
  charisma: number;
  competence: number;
  honesty: number;
  authority: number;
  popularity: number;
  radicalism: number;
  internationalImage: number;
  partyLoyalty: number;
  governmentCapacity: number;
  nationalFame: number;
  polarization: number;
  economicCredibility: number;
  socialCredibility: number;
  securityCredibility: number;
  /** Etiquetas narrativas activas — ej. "El Reformista", "La Promesa Incumplida". */
  labels: string[];
}

/* ---- Memoria política ----------------------------------------------------- */

export type MemoryType =
  | 'promise_made'
  | 'promise_kept'
  | 'promise_broken'
  | 'region_visited'
  | 'region_ignored'
  | 'crisis_handled'
  | 'crisis_ignored'
  | 'scandal'
  | 'betrayal'
  | 'alliance_formed'
  | 'enemy_created'
  | 'debate_won'
  | 'debate_lost'
  | 'election_won'
  | 'election_lost'
  | 'controversial_decision'
  | 'support_received'
  | 'pending_favor';

export type MemorySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface PoliticalMemoryEntry {
  readonly id: string;
  readonly type: MemoryType;
  readonly cycle: number;
  readonly description: string;
  /** Impacto en reputación / relaciones. Rango aprox. -10..+10. */
  readonly impact: number;
  readonly region?: ProvinceId;
  readonly characterId?: string;
  readonly severity: MemorySeverity;
  /** Cuántos ciclos sigue vigente esta memoria antes de desvanecerse. */
  readonly duration: number;
  /** Ciclos transcurridos desde que se creó. */
  age: number;
  readonly canRecur: boolean;
}

/* ---- Promesas ------------------------------------------------------------- */

export interface Promise {
  readonly id: string;
  readonly cycle: number;
  readonly description: string;
  readonly region?: ProvinceId;
  readonly topic: string;
  /** Costo (caja política/social) si se cumple. */
  readonly costToKeep: number;
  /** Daño reputacional si se rompe. */
  readonly costToBreak: number;
  status: 'open' | 'kept' | 'broken';
}

/* ---- Escándalos ----------------------------------------------------------- */

export interface Scandal {
  readonly id: string;
  readonly cycle: number;
  readonly title: string;
  readonly description: string;
  /** Severidad en reputación. */
  readonly severity: MemorySeverity;
  /** Si está activo, sigue dañando; si está cerrado, ya pasó. */
  status: 'active' | 'closed';
}

/* ---- Personajes recurrentes (NPCs) ---------------------------------------- */

export type NpcRole =
  | 'mentor'
  | 'rival'
  | 'journalist'
  | 'party_boss'
  | 'donor'
  | 'social_leader'
  | 'mayor'
  | 'governor'
  | 'advisor'
  | 'businessman'
  | 'internal_opponent'
  | 'regional_ally';

export type RelationStatus = 'allied' | 'neutral' | 'tense' | 'hostile';

export interface NpcCharacter {
  readonly id: string;
  readonly name: string;
  readonly role: NpcRole;
  readonly ideology: {
    readonly economic: number;
    readonly social: number;
    readonly authority: number;
  };
  /** Ambición personal del NPC (0..100). */
  ambition: number;
  /** Lealtad sentida hacia el jugador (0..100). */
  loyalty: number;
  /** Confianza en el jugador (0..100). */
  trust: number;
  /** Miedo al jugador (0..100). Influye en cooperación. */
  fear: number;
  /** Respeto al jugador (0..100). */
  respect: number;
  readonly interests: readonly string[];
  currentRelation: RelationStatus;
  /** Memoria narrativa de interacciones — solo strings. */
  history: string[];
  /** 0..100 — probabilidad de traicionar al jugador. */
  betrayalRisk: number;
  readonly region?: ProvinceId;
  readonly partyId?: PartyId;
}

/* ---- Elecciones ----------------------------------------------------------- */

export type ElectionResult = 'won' | 'lost_close' | 'lost_landslide' | 'pending';

export interface ElectionScenario {
  readonly id: string;
  readonly stage: CareerStage;
  readonly title: string;
  readonly region?: ProvinceId;
  readonly officeOnWin: OfficeId;
  /** Umbral de score para victoria (0..100). */
  readonly winThreshold: number;
  /** Quién es el oponente principal. */
  readonly opponentName: string;
  readonly opponentParty?: PartyId;
  /** Reputación que aporta ganar. */
  readonly fameReward: number;
}

export interface CompletedElection {
  readonly scenarioId: string;
  readonly cycle: number;
  readonly result: ElectionResult;
  /** Score final que obtuvo el jugador (0..100). */
  readonly playerScore: number;
  readonly opponentScore: number;
  readonly turnoutPct: number;
  readonly region?: ProvinceId;
  readonly officeAwarded: OfficeId | null;
}

/* ---- Eventos de carrera --------------------------------------------------- */

export type CareerEventTrigger = 'cycle_start' | 'pre_election' | 'post_election' | 'always';

export interface CareerEventOption {
  readonly id: string;
  readonly label: string;
  readonly cost: string;
  readonly effect: string;
  /** Cambios discretos en reputación / relaciones / memoria que aplica esta opción. */
  readonly outcomes: readonly CareerEventOutcome[];
}

export type CareerEventOutcome =
  | { readonly kind: 'reputation'; readonly field: keyof Reputation; readonly delta: number }
  | { readonly kind: 'relation'; readonly npcId: string; readonly trustDelta: number; readonly loyaltyDelta?: number; readonly fearDelta?: number }
  | { readonly kind: 'memory'; readonly type: MemoryType; readonly description: string; readonly impact: number; readonly severity?: MemorySeverity; readonly region?: ProvinceId; readonly characterId?: string }
  | { readonly kind: 'promise'; readonly description: string; readonly topic: string; readonly region?: ProvinceId; readonly costToKeep: number; readonly costToBreak: number }
  | { readonly kind: 'scandal'; readonly title: string; readonly description: string; readonly severity: MemorySeverity }
  | { readonly kind: 'party'; readonly internalSupportDelta?: number; readonly ruptureRiskDelta?: number; readonly disciplineDelta?: number }
  | { readonly kind: 'add_ally'; readonly npcId: string }
  | { readonly kind: 'add_rival'; readonly npcId: string }
  | { readonly kind: 'label'; readonly add?: string; readonly remove?: string }
  | { readonly kind: 'action_points'; readonly delta: number };

export interface CareerEvent {
  readonly id: string;
  readonly title: string;
  readonly classification: string;
  readonly description: string;
  readonly trigger: CareerEventTrigger;
  /** En qué stage de carrera puede dispararse. */
  readonly stages: readonly CareerStage[];
  /** Si la elección actual debe ser una en particular. */
  readonly electionStage?: CareerStage;
  /** Personaje vinculado al evento, si aplica. */
  readonly characterId?: string;
  readonly options: readonly CareerEventOption[];
  /** Una vez disparado, este evento no vuelve a aparecer. */
  readonly oneShot: boolean;
}

/* ---- Acciones de carrera (durante precampaña) ---------------------------- */

export type CareerActionKind =
  | 'build_alliance'
  | 'meet_regional_leader'
  | 'accept_donor'
  | 'reject_controversial_donor'
  | 'shift_ideology'
  | 'found_movement'
  | 'negotiate_endorsement'
  | 'denounce_corruption'
  | 'moderate_discourse'
  | 'radicalize_discourse'
  | 'keep_promise'
  | 'abandon_promise'
  | 'support_ally'
  | 'betray_ally'
  | 'prepare_candidacy';

export interface CareerActionDefinition {
  readonly kind: CareerActionKind;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  /** Puntos de acción que cuesta. */
  readonly cost: number;
  /** Provincia objetivo opcional. */
  readonly requiresRegion: boolean;
  /** Personaje objetivo opcional. */
  readonly requiresNpc: boolean;
}

/* ---- Estado de la carrera ------------------------------------------------- */

export type CareerStatus =
  | 'setup'
  | 'precampaign'
  | 'election_resolving'
  | 'aftermath'
  | 'legacy';

export interface CareerCycle {
  readonly number: number;
  readonly electionScenarioId: string;
  readonly stage: CareerStage;
  status: CareerStatus;
  result: ElectionResult;
}

export interface CareerState {
  status: CareerStatus;
  player: PlayerPolitician;
  currentOffice: OfficeId;
  currentStage: CareerStage;
  /** Año relativo dentro de la carrera (suma de duraciones de ciclos). */
  careerYear: number;
  /** Número del ciclo actual (1-indexed). */
  currentCycleIndex: number;
  /** Definiciones inmutables de cada ciclo de la carrera. */
  cycles: CareerCycle[];
  /** Puntos de acción disponibles en la precampaña actual. */
  actionPoints: number;
  party: PartyStatus;
  reputation: Reputation;
  npcs: Record<string, NpcCharacter>;
  memory: PoliticalMemoryEntry[];
  promises: Promise[];
  scandals: Scandal[];
  allies: string[];
  rivals: string[];
  completedElections: CompletedElection[];
  activeCareerEvent: CareerEvent | null;
  /** Cola de eventos de carrera disponibles aún no disparados. */
  pendingEventIds: string[];
  /** Eventos ya disparados (para `oneShot`). */
  firedEventIds: string[];
  /** Objetivos sugeridos para el ciclo actual. */
  goals: string[];
  /** Score acumulado de legado (calculado al cerrar). */
  legacyScore: number;
  /** Etiqueta final de legado, asignada al cerrar la carrera. */
  legacyLabel: string | null;
  /** Líneas narrativas del último ciclo (titular-like). */
  recentNarratives: string[];
}
