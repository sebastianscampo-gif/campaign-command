/* =============================================================================
   PARTY — Memoria política del partido
   Cada decisión consecuente se anota en memoria con un impacto y una duración.
   Mientras está activa, pesa en las elecciones y narrativa. Si `canRecur`, no
   se desvanece — el partido la carga para siempre.
   ============================================================================= */

import type {
  FactionKind,
  PartyMemoryEntry,
  PartyMemoryType,
  ProvinceId,
} from './types';

const DURATION_BY_SEVERITY: Record<PartyMemoryEntry['severity'], number> = {
  low: 1,
  medium: 2,
  high: 4,
  critical: 6,
};

let memoryCounter = 0;
function nextMemoryId(): string {
  memoryCounter += 1;
  return `pmem_${Date.now().toString(36)}_${memoryCounter}`;
}

export interface AddMemoryOptions {
  readonly type: PartyMemoryType;
  readonly cycle: number;
  readonly description: string;
  readonly impact: number;
  readonly factionId?: FactionKind;
  readonly region?: ProvinceId;
  readonly candidateId?: string;
  readonly severity?: PartyMemoryEntry['severity'];
  readonly canRecur?: boolean;
}

export function addMemory(
  memory: readonly PartyMemoryEntry[],
  options: AddMemoryOptions,
): PartyMemoryEntry[] {
  const severity = options.severity ?? 'medium';
  const entry: PartyMemoryEntry = {
    id: nextMemoryId(),
    type: options.type,
    cycle: options.cycle,
    description: options.description,
    impact: options.impact,
    factionId: options.factionId,
    region: options.region,
    candidateId: options.candidateId,
    severity,
    duration: DURATION_BY_SEVERITY[severity],
    age: 0,
    canRecur: options.canRecur ?? false,
  };
  return [...memory, entry];
}

export function ageMemoriesOneCycle(
  memory: readonly PartyMemoryEntry[],
): PartyMemoryEntry[] {
  return memory
    .map((m) => ({ ...m, age: m.age + 1 }))
    .filter((m) => m.canRecur || m.age < m.duration);
}

export function activeMemories(
  memory: readonly PartyMemoryEntry[],
): readonly PartyMemoryEntry[] {
  return memory.filter((m) => m.canRecur || m.age < m.duration);
}

export function netMemoryImpact(memory: readonly PartyMemoryEntry[]): number {
  return activeMemories(memory).reduce((sum, m) => sum + m.impact, 0);
}

export function _resetMemoryCounter(): void {
  memoryCounter = 0;
}
