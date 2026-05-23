/* =============================================================================
   CAREER — Memoria política
   El corazón narrativo del modo carrera. Cada entrada es inmutable salvo `age`,
   que avanza con cada ciclo. Cuando `age >= duration`, la memoria se desvanece
   (a menos que `canRecur` la haga reaparecer).
   ============================================================================= */

import type {
  MemorySeverity,
  MemoryType,
  PoliticalMemoryEntry,
} from './types';
import type { ProvinceId } from '@/content';

/** Duración por severidad — cuántos ciclos sigue activa. */
const DURATION_BY_SEVERITY: Record<MemorySeverity, number> = {
  low: 1,
  medium: 2,
  high: 4,
  critical: 6,
};

let memoryCounter = 0;
function nextMemoryId(): string {
  memoryCounter += 1;
  return `mem_${Date.now().toString(36)}_${memoryCounter}`;
}

export interface AddMemoryOptions {
  readonly type: MemoryType;
  readonly cycle: number;
  readonly description: string;
  readonly impact: number;
  readonly region?: ProvinceId;
  readonly characterId?: string;
  readonly severity?: MemorySeverity;
  readonly canRecur?: boolean;
}

export function addMemory(
  memory: readonly PoliticalMemoryEntry[],
  options: AddMemoryOptions,
): PoliticalMemoryEntry[] {
  const severity = options.severity ?? 'medium';
  const duration = DURATION_BY_SEVERITY[severity];
  const entry: PoliticalMemoryEntry = {
    id: nextMemoryId(),
    type: options.type,
    cycle: options.cycle,
    description: options.description,
    impact: options.impact,
    severity,
    duration,
    age: 0,
    canRecur: options.canRecur ?? false,
    region: options.region,
    characterId: options.characterId,
  };
  return [...memory, entry];
}

/** Envejece todas las memorias y filtra las que pasaron su duración. */
export function ageMemoriesOneCycle(
  memory: readonly PoliticalMemoryEntry[],
): PoliticalMemoryEntry[] {
  return memory
    .map((m) => ({ ...m, age: m.age + 1 }))
    .filter((m) => m.canRecur || m.age < m.duration);
}

/** Memorias todavía activas (no caducadas). Útil para impactos en cálculos. */
export function activeMemories(
  memory: readonly PoliticalMemoryEntry[],
): readonly PoliticalMemoryEntry[] {
  return memory.filter((m) => m.canRecur || m.age < m.duration);
}

/** Suma neta del impacto de las memorias activas. */
export function netMemoryImpact(
  memory: readonly PoliticalMemoryEntry[],
): number {
  return activeMemories(memory).reduce((sum, m) => sum + m.impact, 0);
}

/** Memorias activas que afectan una región específica. */
export function memoriesForRegion(
  memory: readonly PoliticalMemoryEntry[],
  region: ProvinceId,
): readonly PoliticalMemoryEntry[] {
  return activeMemories(memory).filter((m) => m.region === region);
}

/** Memorias por personaje (e.g., todo lo relacionado con un NPC). */
export function memoriesForCharacter(
  memory: readonly PoliticalMemoryEntry[],
  characterId: string,
): readonly PoliticalMemoryEntry[] {
  return activeMemories(memory).filter((m) => m.characterId === characterId);
}

export function _resetMemoryCounterForTests(): void {
  memoryCounter = 0;
}
