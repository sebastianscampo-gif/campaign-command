/* =============================================================================
   PARTY — Escándalos
   Crear, envejecer y contener escándalos. Cada uno tiene severidad y duración;
   los activos penalizan elecciones y trust.
   ============================================================================= */

import type { Scandal, ScandalSeverity, ScandalType } from './types';
import type { FactionKind, ProvinceId } from './types';

const DURATION_BY_SEVERITY: Record<ScandalSeverity, number> = {
  low: 1,
  medium: 2,
  high: 4,
  critical: 6,
};

let scandalCounter = 0;
function nextScandalId(): string {
  scandalCounter += 1;
  return `scan_${Date.now().toString(36)}_${scandalCounter}`;
}

export interface CreateScandalInput {
  readonly cycle: number;
  readonly type: ScandalType;
  readonly title: string;
  readonly description: string;
  readonly severity: ScandalSeverity;
  readonly involvedFaction?: FactionKind;
  readonly involvedCandidateId?: string;
  readonly affectedRegion?: ProvinceId;
  readonly canRecur?: boolean;
}

export function createScandal(input: CreateScandalInput): Scandal {
  return {
    id: nextScandalId(),
    cycle: input.cycle,
    type: input.type,
    title: input.title,
    description: input.description,
    severity: input.severity,
    involvedFaction: input.involvedFaction ?? null,
    involvedCandidateId: input.involvedCandidateId ?? null,
    affectedRegion: input.affectedRegion ?? null,
    status: 'active',
    duration: DURATION_BY_SEVERITY[input.severity],
    age: 0,
    canRecur: input.canRecur ?? false,
  };
}

/** Envejece y filtra los escándalos cerrados. */
export function ageScandalsOneCycle(scandals: readonly Scandal[]): Scandal[] {
  return scandals
    .map((s) => ({ ...s, age: s.age + 1 }))
    .map((s) =>
      s.age >= s.duration && s.status === 'active'
        ? { ...s, status: 'closed' as const }
        : s,
    )
    .filter((s) => s.canRecur || s.status === 'active' || s.age <= s.duration + 1);
}

/** Solo los escándalos vigentes para penalizar elecciones. */
export function activeScandals(scandals: readonly Scandal[]): readonly Scandal[] {
  return scandals.filter((s) => s.status === 'active');
}

export function _resetScandalCounter(): void {
  scandalCounter = 0;
}
