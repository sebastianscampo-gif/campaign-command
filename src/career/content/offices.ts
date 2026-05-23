/* =============================================================================
   CAREER · CONTENT — Cargos políticos
   Tabla de cargos organizados por etapa. El sistema de progresión consulta
   esto para decidir qué cargo se obtiene tras ganar una elección.
   ============================================================================= */

import type { CareerStage, OfficeId } from '../types';

export interface OfficeDefinition {
  readonly id: OfficeId;
  readonly label: string;
  readonly stage: CareerStage;
  /** Texto corto para mostrar en HUDs. */
  readonly short: string;
  /** Es un cargo ejecutivo (vs legislativo / opositor). */
  readonly executive: boolean;
}

export const OFFICES: Record<OfficeId, OfficeDefinition> = {
  activist: { id: 'activist', label: 'Activista regional', stage: 'local', short: 'ACTIVISTA', executive: false },
  councilor: { id: 'councilor', label: 'Concejal', stage: 'local', short: 'CONCEJAL', executive: false },
  mayor: { id: 'mayor', label: 'Alcalde', stage: 'local', short: 'ALCALDE', executive: true },
  regional_deputy: { id: 'regional_deputy', label: 'Diputado regional', stage: 'regional', short: 'DIPUTADO', executive: false },
  governor: { id: 'governor', label: 'Gobernador', stage: 'regional', short: 'GOBERNADOR', executive: true },
  senator: { id: 'senator', label: 'Senador nacional', stage: 'national', short: 'SENADOR', executive: false },
  minister: { id: 'minister', label: 'Ministro', stage: 'national', short: 'MINISTRO', executive: true },
  presidential_candidate: { id: 'presidential_candidate', label: 'Candidato presidencial', stage: 'presidential', short: 'CANDIDATO', executive: false },
  president: { id: 'president', label: 'Presidente de la Nación', stage: 'presidential', short: 'PRESIDENTE', executive: true },
  opposition_leader: { id: 'opposition_leader', label: 'Líder opositor', stage: 'national', short: 'OPOSITOR', executive: false },
};

/** Orden ascendente de etapas. */
export const STAGE_ORDER: readonly CareerStage[] = [
  'local',
  'regional',
  'national',
  'presidential',
];

/** Cargo de "consolación" si se pierde una elección — el jugador conserva visibilidad. */
export const CONSOLATION_OFFICE: Record<CareerStage, OfficeId> = {
  local: 'activist',
  regional: 'councilor',
  national: 'opposition_leader',
  presidential: 'opposition_leader',
};
