/* =============================================================================
   PARTY — Tipos base del Party Mode
   El partido es la unidad de juego: tiene identidad, facciones internas que
   compiten por poder, candidatos a quienes avalar, finanzas con tradeoffs,
   territorio que conquistar, marca pública que cuidar, y elecciones donde
   medirse. El jugador no es candidato — es el armador.
   ============================================================================= */

import type { PartyId, ProvinceId } from '@/content';

export type { ProvinceId, PartyId };

/* ---- Identidad del partido (setup) ---------------------------------------- */

export type PartyTypeId =
  | 'traditional'
  | 'outsider'
  | 'ideological'
  | 'coalition'
  | 'regional';

export type LeadershipStyle =
  | 'inspirational'
  | 'pragmatic'
  | 'authoritarian'
  | 'collegial'
  | 'confrontational';

export type GrowthStrategy =
  | 'territorial'
  | 'media'
  | 'institutional'
  | 'militant'
  | 'opportunistic';

/** Snapshot inmutable del partido. */
export interface PartyProfile {
  readonly name: string;
  readonly sigla: string;
  readonly color: string;
  readonly slogan: string;
  readonly type: PartyTypeId;
  readonly originRegion: ProvinceId;
  readonly leadershipStyle: LeadershipStyle;
  readonly growthStrategy: GrowthStrategy;
}

/* ---- Ideología ------------------------------------------------------------ */

/** 7 ejes; cada uno -1..+1. Editable durante la partida con costo. */
export interface Ideology {
  /** Economía: -1 izquierda, +1 derecha. */
  economic: number;
  /** Sociedad: -1 progresista, +1 conservador. */
  social: number;
  /** Instituciones: -1 democrático, +1 autoritario. */
  authority: number;
  /** Globalización: -1 nacionalista, +1 globalista. */
  globalism: number;
  /** Seguridad: -1 garantista, +1 mano dura. */
  security: number;
  /** Rol del Estado: -1 estatista, +1 libre mercado. */
  market: number;
  /** Ambiente: -1 extractivista, +1 verde. */
  environment: number;
}

/* ---- Marca política (12 dimensiones) -------------------------------------- */

export interface PartyBrand {
  ideologicalClarity: number;
  publicTrust: number;
  modernity: number;
  internalOrder: number;
  popularConnection: number;
  technicalCompetence: number;
  territorialStrength: number;
  perceivedCorruption: number;
  polarization: number;
  movementMystique: number;
  professionalism: number;
  narrativeCoherence: number;
}

/* ---- Facciones internas --------------------------------------------------- */

export type FactionKind =
  | 'old_guard'
  | 'youth'
  | 'technocrats'
  | 'populists'
  | 'regionals'
  | 'business'
  | 'union'
  | 'moderates'
  | 'radicals'
  | 'ground_ops';

export interface Faction {
  readonly id: FactionKind;
  readonly name: string;
  readonly leader: string;
  /** Ideología interna de la facción (subset relevante). */
  readonly leaning: {
    readonly economic: number;
    readonly social: number;
    readonly radicalism: number;
  };
  /** Cuánto poder tiene dentro del partido (0..100). */
  power: number;
  /** Cuánta lealtad le tiene al liderazgo (jugador) (0..100). */
  loyalty: number;
  /** Cuánta disciplina pública mantiene (0..100). */
  discipline: number;
  /** Ambición del líder de la facción (0..100). */
  ambition: number;
  /** Recursos propios que controla (0..100). */
  resources: number;
  /** Riesgo de ruptura/escisión (0..100). */
  ruptureRisk: number;
  /** Influencia regional (lista de provincias en las que pesa). */
  readonly regions: readonly ProvinceId[];
  /** Influencia mediática propia (0..100). */
  mediaInfluence: number;
  /** Demanda actual que tiene contra el jugador. */
  currentDemand: string | null;
  /** Historial narrativo (notas breves). */
  history: string[];
}

/* ---- Candidatos ----------------------------------------------------------- */

export type CandidateRole =
  | 'star'
  | 'technocrat'
  | 'regional_leader'
  | 'influencer'
  | 'ex_military'
  | 'businessman'
  | 'activist'
  | 'heir'
  | 'viral_outsider'
  | 'old_cacique';

export interface PartyCandidate {
  readonly id: string;
  readonly name: string;
  readonly age: number;
  readonly region: ProvinceId;
  readonly role: CandidateRole;
  /** Stats. */
  popularity: number;
  charisma: number;
  loyalty: number;
  scandalRisk: number;
  groundGame: number;
  mediaSkill: number;
  ambition: number;
  experience: number;
  futurePotential: number;
  /** Ideología propia. */
  readonly ideology: {
    readonly economic: number;
    readonly social: number;
  };
  /** Facción de la que viene. */
  readonly faction: FactionKind;
  /** Si está actualmente avalado por el partido. */
  endorsed: boolean;
  /** Para qué etapa fue avalado (si aplica). */
  endorsedFor: ElectionStage | null;
  /** Historial breve. */
  history: string[];
}

/* ---- Finanzas ------------------------------------------------------------- */

export type DonorKind =
  | 'corporate'
  | 'union'
  | 'small_donors'
  | 'state_funding'
  | 'crowdfund'
  | 'regional_pact';

export interface DonorRecord {
  readonly kind: DonorKind;
  readonly name: string;
  /** Monto disponible (millones). */
  amount: number;
  /** Condicionalidad: qué espera a cambio. */
  readonly conditions: string;
  /** Si está activo / aceptado. */
  active: boolean;
}

export interface PartyFinances {
  /** Caja en millones. */
  money: number;
  /** Militantes activos (en miles). */
  militants: number;
  /** Voluntarios disponibles para campaña (en miles). */
  volunteers: number;
  /** Capital político (favores acumulables, 0..100). */
  politicalCapital: number;
  /** Influencia mediática total (0..100). */
  mediaInfluence: number;
  /** Donantes registrados. */
  donors: DonorRecord[];
}

/* ---- Territorio ----------------------------------------------------------- */

export interface RegionalPresence {
  /** Apoyo electoral estimado en la región (0..100). */
  support: number;
  /** Base militante local (0..100). */
  militantBase: number;
  /** Sedes regionales abiertas. */
  offices: number;
  /** Tiene líder local asignado. */
  hasLeader: boolean;
  /** Facción dominante en la región. */
  dominantFaction: FactionKind | null;
  /** Maquinaria territorial (0..100). */
  machinery: number;
  /** Voluntarios activos (0..100). */
  activeVolunteers: number;
  /** Influencia mediática local (0..100). */
  localMedia: number;
  /** Costo estimado de campaña en esta región (millones). */
  campaignCost: number;
  /** Potencial de crecimiento estimado (0..100). */
  growthPotential: number;
}

/* ---- Coaliciones ---------------------------------------------------------- */

export type CoalitionType =
  | 'electoral'
  | 'legislative'
  | 'single_candidacy'
  | 'regional_pact'
  | 'programmatic'
  | 'positions'
  | 'tactical';

export interface Coalition {
  readonly id: string;
  readonly partnerName: string;
  readonly partnerPartyId: PartyId;
  readonly type: CoalitionType;
  readonly terms: string;
  /** Para qué elección aplica (si aplica). */
  readonly forStage: ElectionStage | 'all';
  /** Estado. */
  status: 'active' | 'broken' | 'completed';
  /** Cuando se creó (cycle). */
  readonly createdCycle: number;
}

/* ---- Escándalos ----------------------------------------------------------- */

export type ScandalSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ScandalType =
  | 'corruption'
  | 'abuse_of_power'
  | 'dubious_financing'
  | 'leaked_audio'
  | 'internal_fight'
  | 'vote_buying'
  | 'nepotism'
  | 'ideological_contradiction'
  | 'public_betrayal'
  | 'internal_sabotage';

export interface Scandal {
  readonly id: string;
  readonly cycle: number;
  readonly type: ScandalType;
  readonly title: string;
  readonly description: string;
  readonly severity: ScandalSeverity;
  readonly involvedFaction: FactionKind | null;
  readonly involvedCandidateId: string | null;
  readonly affectedRegion: ProvinceId | null;
  status: 'active' | 'contained' | 'closed';
  /** Cuántos ciclos sigue pesando. */
  duration: number;
  /** Ciclos transcurridos. */
  age: number;
  readonly canRecur: boolean;
}

/* ---- Elecciones encadenadas ----------------------------------------------- */

export type ElectionStage = 'local' | 'legislative' | 'national';

export interface PartyElectionScenario {
  readonly id: string;
  readonly stage: ElectionStage;
  readonly title: string;
  /** Cuántas posiciones se reparten (alcaldías, bancas, etc.). */
  readonly seats: number;
  /** Umbral % para considerar victoria estratégica. */
  readonly winThreshold: number;
  /** Recompensa de marca por victoria. */
  readonly brandReward: number;
}

export type ElectionResult = 'won' | 'split' | 'lost' | 'pending';

export interface CompletedPartyElection {
  readonly scenarioId: string;
  readonly cycle: number;
  readonly result: ElectionResult;
  /** Cuota nacional obtenida (% aproximado). */
  readonly nationalShare: number;
  /** Asientos/posiciones ganadas. */
  readonly seatsWon: number;
  /** Provincias dominadas. */
  readonly provincesWon: readonly ProvinceId[];
  /** Candidatos electos por provincia. */
  readonly electedCandidates: readonly string[];
}

/* ---- Memoria política del partido ----------------------------------------- */

export type PartyMemoryType =
  | 'election_won'
  | 'election_lost'
  | 'faction_demand_accepted'
  | 'faction_demand_refused'
  | 'candidate_endorsed'
  | 'candidate_expelled'
  | 'coalition_formed'
  | 'coalition_broken'
  | 'scandal_contained'
  | 'scandal_escalated'
  | 'ideology_moderated'
  | 'ideology_radicalized'
  | 'region_conquered'
  | 'region_abandoned'
  | 'donor_accepted'
  | 'donor_rejected'
  | 'internal_split';

export interface PartyMemoryEntry {
  readonly id: string;
  readonly type: PartyMemoryType;
  readonly cycle: number;
  readonly description: string;
  readonly impact: number;
  readonly factionId?: FactionKind;
  readonly region?: ProvinceId;
  readonly candidateId?: string;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly duration: number;
  age: number;
  readonly canRecur: boolean;
}

/* ---- Eventos del Party Mode ----------------------------------------------- */

export type PartyEventTrigger =
  | 'cycle_start'
  | 'pre_election'
  | 'post_election'
  | 'always';

export type PartyEventOutcome =
  | { readonly kind: 'brand'; readonly field: keyof PartyBrand; readonly delta: number }
  | { readonly kind: 'faction'; readonly factionId: FactionKind; readonly powerDelta?: number; readonly loyaltyDelta?: number; readonly disciplineDelta?: number; readonly ruptureRiskDelta?: number; readonly resourcesDelta?: number }
  | { readonly kind: 'finance'; readonly moneyDelta?: number; readonly militantsDelta?: number; readonly volunteersDelta?: number; readonly politicalCapitalDelta?: number; readonly mediaInfluenceDelta?: number }
  | { readonly kind: 'territory'; readonly region: ProvinceId; readonly supportDelta?: number; readonly machineryDelta?: number; readonly officesDelta?: number }
  | { readonly kind: 'ideology'; readonly axis: keyof Ideology; readonly delta: number }
  | { readonly kind: 'memory'; readonly type: PartyMemoryType; readonly description: string; readonly impact: number; readonly severity?: 'low' | 'medium' | 'high' | 'critical'; readonly region?: ProvinceId; readonly factionId?: FactionKind; readonly candidateId?: string; readonly canRecur?: boolean }
  | { readonly kind: 'scandal'; readonly scandalType: ScandalType; readonly title: string; readonly description: string; readonly severity: ScandalSeverity; readonly factionId?: FactionKind; readonly region?: ProvinceId }
  | { readonly kind: 'donor'; readonly donorKind: DonorKind; readonly name: string; readonly amount: number; readonly conditions: string }
  | { readonly kind: 'candidate_threat'; readonly candidateId: string; readonly loyaltyDelta: number; readonly ambitionDelta: number }
  | { readonly kind: 'label'; readonly add?: string; readonly remove?: string }
  | { readonly kind: 'action_points'; readonly delta: number };

export interface PartyEventOption {
  readonly id: string;
  readonly label: string;
  readonly cost: string;
  readonly effect: string;
  readonly outcomes: readonly PartyEventOutcome[];
}

export interface PartyEvent {
  readonly id: string;
  readonly title: string;
  readonly classification: string;
  readonly description: string;
  readonly trigger: PartyEventTrigger;
  readonly factionId?: FactionKind;
  readonly oneShot: boolean;
  readonly options: readonly PartyEventOption[];
}

/* ---- Acciones del Party Mode ---------------------------------------------- */

export type PartyActionKind =
  | 'recruit_candidate'
  | 'give_endorsement'
  | 'revoke_endorsement'
  | 'open_regional_office'
  | 'finance_region'
  | 'accept_donor'
  | 'reject_donor'
  | 'negotiate_coalition'
  | 'break_coalition'
  | 'sanction_faction'
  | 'expel_candidate'
  | 'moderate_ideology'
  | 'radicalize_ideology'
  | 'launch_national_campaign'
  | 'activate_militants'
  | 'resolve_internal_conflict'
  | 'distribute_positions'
  | 'call_party_congress';

export interface PartyActionDefinition {
  readonly kind: PartyActionKind;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly cost: number;
  readonly requiresRegion: boolean;
  readonly requiresCandidate: boolean;
  readonly requiresFaction: boolean;
}

/* ---- Etiquetas de legado -------------------------------------------------- */

export type LegacyArchetype =
  | 'electoral_dominance'
  | 'historic_movement'
  | 'pure_ideological'
  | 'national_coalition'
  | 'territorial_machine'
  | 'democratic_revolution'
  | 'eternal_party'
  | 'presidential_party'
  | 'regional_dominant'
  | 'system_breaker'
  | 'forgotten';

/* ---- Estado completo ------------------------------------------------------ */

export type PartyStatus =
  | 'setup'
  | 'precampaign'
  | 'election_resolving'
  | 'aftermath'
  | 'legacy';

export interface PartyCycle {
  readonly number: number;
  readonly scenarioId: string;
  readonly stage: ElectionStage;
  status: PartyStatus;
  result: ElectionResult;
}

export interface PartyState {
  status: PartyStatus;
  profile: PartyProfile;
  ideology: Ideology;
  brand: PartyBrand;
  factions: Record<FactionKind, Faction>;
  candidatePool: Record<string, PartyCandidate>;
  finances: PartyFinances;
  territory: Record<ProvinceId, RegionalPresence>;
  coalitions: Coalition[];
  scandals: Scandal[];
  /** Cuán bien funciona la disciplina interna (derivada, 0..100). */
  internalDiscipline: number;
  /** Etiquetas narrativas (ej. "El Movimiento", "Máquina Regional"). */
  labels: string[];
  cycles: PartyCycle[];
  currentCycleIndex: number;
  actionPoints: number;
  completedElections: CompletedPartyElection[];
  activePartyEvent: PartyEvent | null;
  pendingEventIds: string[];
  firedEventIds: string[];
  memory: PartyMemoryEntry[];
  goals: string[];
  legacyScore: number;
  legacyLabel: string | null;
  recentNarratives: string[];
}
