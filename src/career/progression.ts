/* =============================================================================
   CAREER — Progresión
   Maneja el avance entre cargos / etapas tras cada elección. Si gana, asciende.
   Si pierde, cae al cargo de consolación pero no termina la carrera.
   ============================================================================= */

import { CONSOLATION_OFFICE, OFFICES, STAGE_ORDER } from './content/offices';
import type { CareerStage, CompletedElection, OfficeId } from './types';

/** Devuelve el siguiente stage en la cadena (o el actual si ya es el último). */
export function nextStage(current: CareerStage): CareerStage {
  const idx = STAGE_ORDER.indexOf(current);
  if (idx === -1 || idx === STAGE_ORDER.length - 1) return current;
  // STAGE_ORDER es readonly tuple — el [idx+1] no es undefined porque idx < length-1.
  return STAGE_ORDER[idx + 1] as CareerStage;
}

/** Calcula el nuevo cargo del jugador tras resolver una elección. */
export function officeAfterElection(
  result: CompletedElection,
  scenarioStage: CareerStage,
  currentOffice: OfficeId,
): OfficeId {
  if (result.result === 'won' && result.officeAwarded) {
    return result.officeAwarded;
  }
  // Si pierde, cae a un cargo de visibilidad opositora.
  return CONSOLATION_OFFICE[scenarioStage] ?? currentOffice;
}

/** Etapa de carrera correspondiente al cargo actual. */
export function stageOfOffice(office: OfficeId): CareerStage {
  return OFFICES[office].stage;
}

/** Determina si todavía quedan ciclos por jugar. */
export function hasMoreCycles(
  cycleIndex: number,
  totalCycles: number,
): boolean {
  return cycleIndex < totalCycles;
}
