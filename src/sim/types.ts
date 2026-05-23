/* =============================================================================
   SIM — Tipos del motor de simulación
   Define la forma de las acciones del jugador, los eventos, los resúmenes de
   turno y los resultados de simulación. Pensado para crecer: las funciones
   reales viven en simulation.ts / rules.ts / effects.ts.
   ============================================================================= */

import type { PartyId, ProvinceId } from '@/content';

/* ---- Catálogo de acciones de campaña --------------------------------------- */

export type ActionKind =
  | 'rally'
  | 'ad'
  | 'door'
  | 'speech'
  | 'fund'
  | 'travel'
  | 'social'
  | 'debate-prep'
  | 'endorse'
  | 'attack';

/** Etiqueta visual extra que sugiere prioridad del día. Es presentational. */
export type ActionFlag = 'hot' | 'critical';

/** Definición estática de una acción. Inmutable, parametriza el juego. */
export interface ActionDefinition {
  readonly kind: ActionKind;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  /** Costo en millones de la moneda del juego. 0 si no aplica. */
  readonly costMoney: number;
  /** Días de campaña que consume. 0 si no aplica. */
  readonly costDays: number;
  /** Etiqueta de ROI esperado, formato libre — placeholder hasta tener sim. */
  readonly roiHint: string;
  /** Si la acción necesita una provincia objetivo. */
  readonly requiresProvince: boolean;
  /** Flag presentational opcional ("hot", "critical"). */
  readonly flag?: ActionFlag;
}

/* ---- Instancia de acción encolada por el jugador --------------------------- */

export interface CampaignAction {
  /** ID único asignado al encolarse. */
  readonly id: string;
  readonly kind: ActionKind;
  /** Provincia destino, si la acción la requiere. */
  readonly province?: ProvinceId;
  /** Día en que se encoló. */
  readonly queuedOnDay: number;
}

/** Acción + metadata de cómo terminó. Va al actionHistory tras resolverse. */
export interface ResolvedAction extends CampaignAction {
  readonly resolvedOnDay: number;
  readonly intentDelta?: number;
  readonly approvalDelta?: number;
  readonly notes?: string;
}

/* ---- Eventos --------------------------------------------------------------- */

/** Registro de un evento resuelto (cierre de crisis u otro). */
export interface ResolvedEvent {
  readonly eventId: string;
  readonly chosenOptionIndex: number;
  readonly resolvedOnDay: number;
  readonly summary: string;
}

/* ---- Resumen de turno ------------------------------------------------------ */

/** Snapshot de qué cambió al avanzar un día — útil para mostrar al jugador. */
export interface TurnSummary {
  readonly day: number;
  readonly actionsResolved: number;
  readonly eventsResolved: number;
  readonly intentShifts: ReadonlyArray<{
    readonly party: PartyId;
    readonly delta: number;
  }>;
  readonly highlights: readonly string[];
}

/** Resultado tras `simulateDay()`. */
export interface SimulationResult {
  readonly summary: TurnSummary;
  readonly resolvedActions: readonly ResolvedAction[];
  readonly resolvedEvents: readonly ResolvedEvent[];
}
